import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import MarkdownIt from "markdown-it";
import {
  buildVault,
  parseNote,
  readVault,
  scanFiles,
  wikiPlugin,
} from "../.vitepress/vault/build.mjs";
import {
  resolveLink,
  neighborhood,
  matchesQuery,
  slugify,
} from "../.vitepress/vault/model.mjs";
import { graphData, defaultGraphSettings } from "../.vitepress/vault/graph.mjs";
import {
  restoreWorkspace,
  restoreGraphSettings,
} from "../.vitepress/vault/workspace.mjs";
import { searchNotes } from "../.vitepress/vault/search.mjs";
const fixture = buildVault([
  {
    id: "中国/入口.md",
    raw: "# 入口\n\n[[中国/笔记 空格#小节|读一读]] 和 [标准链接](./笔记%20空格.md#小节)。\n\n[[同名]] [[别名]] [[重复别名]] [[不存在]]\n\n`[[代码]]`\n\n```md\n[[假节点]]\n[code](./fake.md)\n```\n",
  },
  {
    id: "中国/笔记 空格.md",
    raw: '---\naliases: [别名, 重复别名]\ntags: [历史, 学习]\n---\n# 真实标题\n\n独有正文测试词。\n\n## 小节\n## 小节\n\n<span id="old-anchor"></span>\n',
  },
  { id: "中国/同名.md", raw: "# 同名" },
  { id: "世界/同名.md", raw: "---\naliases: [重复别名]\n---\n# 同名" },
  { id: "孤立.md", raw: "# 孤立" },
]);
test("Chinese and space paths, Markdown and wikilinks resolve to the same identity and anchor", () => {
  const selected = fixture.links.filter(
    (l) => l.target === "中国/笔记 空格.md",
  );
  assert.equal(selected.length, 3);
  assert.equal(selected[0].anchor, "小节");
  assert.equal(selected[1].anchor, "小节");
  assert.ok(selected[0].context.includes("读一读"));
  assert.equal(
    resolveLink(
      fixture.notes,
      "中国/入口.md",
      "/notes/中国/笔记%20空格.html#小节",
    ).target,
    "中国/笔记 空格.md",
  );
  assert.equal(
    resolveLink(
      fixture.notes,
      "中国/入口.md",
      "中国/笔记 空格#old-anchor",
      true,
    ).reason,
    null,
  );
  assert.equal(
    resolveLink(fixture.notes, "中国/入口.md", "./笔记 空格.md?embed=true#小节")
      .href,
    "/中国/笔记 空格.html?embed=true#%E5%B0%8F%E8%8A%82",
  );
  assert.equal(
    resolveLink(fixture.notes, "中国/入口.md", "别名#小节", true).href,
    "/中国/笔记 空格.html#%E5%B0%8F%E8%8A%82",
  );
  assert.equal(
    resolveLink(fixture.notes, "中国/入口.md", "别名#缺失", true).reason,
    "missing-anchor",
  );
  assert.equal(
    fixture.notes[1].headings.filter((h) => h.level === 2)[1].id,
    "小节-1",
  );
});
test("root directory links resolve to the welcome note", () => {
  const root = buildVault([
    { id: "index.md", raw: "# 首页" },
    { id: "prefixindex.md", raw: "# 普通笔记" },
  ]);
  assert.equal(root.notes[1].route, "/prefixindex.html");
  assert.equal(
    resolveLink(root.notes, "index.md", "/notes/").target,
    "index.md",
  );
  assert.equal(resolveLink(root.notes, "index.md", "./").target, "index.md");
});
test("explicit paths and local names are resolved; ambiguous names and aliases stay unresolved", () => {
  assert.equal(
    resolveLink(fixture.notes, "孤立.md", "同名", true).target,
    null,
  );
  assert.equal(
    resolveLink(fixture.notes, "中国/入口.md", "同名", true).target,
    null,
  );
  assert.equal(
    resolveLink(fixture.notes, "中国/入口.md", "./同名", true).target,
    "中国/同名.md",
  );
  assert.equal(
    resolveLink(fixture.notes, "孤立.md", "中国/同名", true).target,
    "中国/同名.md",
  );
  assert.equal(
    resolveLink(fixture.notes, "孤立.md", "重复别名", true).target,
    null,
  );
  assert.equal(
    fixture.links.find((l) => l.reference === "不存在").target,
    null,
  );
  assert.equal(
    resolveLink(fixture.notes, "孤立.md", "https://example.com"),
    null,
  );
});
test("code fences and inline code never create graph edges or fulltext example relationships", () => {
  assert.ok(
    !fixture.links.some((l) =>
      ["代码", "假节点", "./fake.md"].includes(l.reference),
    ),
  );
  const note = parseNote(
    "x.md",
    "# A\n\n    [[indented-code]]\n\n<!-- [[comment]] -->\n",
  );
  assert.equal(note.references.length, 0);
  assert.equal(parseNote("math.md", "$[[x]]$").references.length, 0);
  assert.deepEqual(
    parseNote(
      "code.md",
      "# C++\n\n```cpp\n#include <foo>\n```\n\n`#example` #actual",
    ).note.tags,
    ["actual"],
  );
});
test("body wikilink renderer and index use the same resolver, escape labels, and expose unresolved links", () => {
  const md = new MarkdownIt();
  md.use(wikiPlugin, (source, reference) =>
    resolveLink(fixture.notes, source, reference, true),
  );
  const html = md.render(
    "[[中国/笔记 空格#小节|<测试>]] [[missing]] `[[别名]]`",
    { relativePath: "孤立.md" },
  );
  assert.ok(html.includes("/notes/中国/笔记 空格.html#%E5%B0%8F%E8%8A%82"));
  assert.ok(html.includes("&lt;测试&gt;"));
  assert.ok(html.includes("unresolved-link"));
  assert.ok(html.includes("<code>[[别名]]</code>"));
});
test("graph uses actual links; local depth is undirected, capped at five, and filters do not invent edges", () => {
  const notes = Array.from({ length: 8 }, (_, i) => ({
    id: String(i),
    title: String(i),
    aliases: [],
    tags: i === 2 ? ["历史"] : [],
  }));
  const links = notes
    .slice(1)
    .map((n, i) => ({ source: String(i), target: n.id, kind: "note" }));
  assert.deepEqual([...neighborhood("0", links, 1)], ["0", "1"]);
  assert.equal(neighborhood("0", links, 5).size, 6);
  assert.equal(neighborhood("0", links, 10).size, 6);
  assert.ok(neighborhood("3", links, 1).has("2"));
  const reciprocal = graphData(
    {
      notes,
      links: [
        { source: "0", target: "1", kind: "note" },
        { source: "1", target: "0", kind: "note" },
      ],
      attachments: [],
    },
    defaultGraphSettings(),
  );
  assert.equal(reciprocal.edges.length, 1);
  assert.equal(reciprocal.edges[0].bidirectional, true);
  const graph = graphData(fixture, defaultGraphSettings());
  assert.ok(graph.nodes.some((n) => n.id === "孤立.md"));
  assert.ok(!graph.edges.some((e) => e.source === "孤立.md"));
  assert.equal(
    graphData(
      fixture,
      { ...defaultGraphSettings(), query: "独有正文测试词" },
      undefined,
      1,
      fixture.search,
    ).nodes.length,
    1,
  );
  const withoutOrphans = graphData(fixture, {
    ...defaultGraphSettings(),
    orphans: false,
  });
  assert.ok(!withoutOrphans.nodes.some((n) => n.id === "孤立.md"));
  assert.equal(
    graphData(
      { notes, links, attachments: [] },
      { ...defaultGraphSettings(), query: "tag:历史" },
    ).nodes.length,
    1,
  );
  assert.ok(matchesQuery(fixture.notes[1], "path:中国/ tag:历史 -path:世界"));
  assert.ok(!matchesQuery(fixture.notes[1], "tag:不存在"));
  assert.ok(
    !matchesQuery(
      { ...fixture.notes[1], tags: ["后古典时期"] },
      "tag:古典时期",
    ),
  );
  assert.ok(
    graphData(fixture, { ...defaultGraphSettings(), tags: true }).nodes.some(
      (n) => n.kind === "tag",
    ),
  );
});
test("fulltext finds body-only matches with context; quick switch includes aliases", () => {
  const result = searchNotes(fixture.notes, fixture.search, "独有正文测试词");
  assert.equal(result[0].note.id, "中国/笔记 空格.md");
  assert.ok(result[0].context.includes("独有正文测试词"));
  assert.equal(
    searchNotes(fixture.notes, [], "别名", true)[0].note.id,
    "中国/笔记 空格.md",
  );
});
test("workspace restoration preserves multiple valid tabs, drops removed notes and bounds widths/depth", () => {
  const state = restoreWorkspace(
    JSON.stringify({
      tabs: [
        { key: "old", noteId: "中国/笔记 空格.md", href: "bad" },
        { key: "removed", noteId: "gone" },
        { key: "graph:path:中国", filter: "path:中国" },
      ],
      leftWidth: 999,
      rightWidth: 12,
      localDepth: 9,
      theme: "dark",
    }),
    fixture.notes,
  );
  assert.equal(state.tabs.length, 2);
  assert.equal(state.tabs[0].href, "/中国/笔记 空格.html");
  assert.equal(state.leftWidth, 420);
  assert.equal(state.rightWidth, 190);
  assert.equal(state.localDepth, 5);
  assert.equal(state.theme, "dark");
  assert.equal(restoreWorkspace("{broken", fixture.notes).tabs.length, 0);
  assert.deepEqual(restoreGraphSettings("{broken"), defaultGraphSettings());
  assert.equal(
    restoreGraphSettings('{"groups":"broken","repel":9999}').repel,
    600,
  );
});
test("scan publishes only notes and excludes hidden dirs, symlinks, caches, dependencies and example pages", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "vault-test-"));
  try {
    for (const name of [
      ".hidden",
      "docs",
      "node_modules",
      "cache",
      "temp",
      "Module",
    ]) {
      fs.mkdirSync(path.join(root, name));
      fs.writeFileSync(path.join(root, name, "test.md"), "# test");
    }
    fs.writeFileSync(path.join(root, "api-examples.md"), "# example");
    fs.writeFileSync(path.join(root, "index.md"), "# Home");
    fs.symlinkSync(path.join(root, "Module"), path.join(root, "alias"));
    assert.deepEqual(
      scanFiles(root)
        .map((f) => path.relative(root, f))
        .sort(),
      ["Module/test.md", "index.md"],
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
test("history publishes individual events without external links and archives all summaries", () => {
  const index = readVault(process.cwd());
  const events = index.notes.filter((n) => n.historyId);
  assert.equal(events.length, 181);
  assert.equal(index.notes.filter((n) => n.historyTheme).length, 0);
  const report = JSON.parse(fs.readFileSync(".vitepress/reports/history-events.json", "utf8"));
  assert.equal(report.originalNotes, 58);
  assert.equal(new Set(report.provenance.map((p) => p.source + "#" + p.heading)).size, 171);
  for (const note of events) {
    const raw = fs.readFileSync(note.path, "utf8");
    assert.equal((raw.match(/^# /gm) || []).length, 1);
    assert.ok(!/https?:\/\/|href=|## 关键事件|^### /m.test(raw), note.path);
    assert.ok(raw.includes("地点："), note.path);
    assert.ok(!raw.includes("维基百科（入门索引）"), note.path);
    assert.equal(note.headings[0].title, note.title);
  }
  assert.ok(!index.links.some((l) => l.source.startsWith("历史/") && !l.target));
  for (const source of new Set(report.provenance.map((p) => p.source))) {
    assert.ok(fs.existsSync(report.archive + "/" + source), source);
    assert.ok(!index.notes.some((n) => n.id === source), source);
  }
  const qinEvents = report.provenance.filter((p) => p.source.endsWith("/秦统一.md")).map((p) => p.event.split("/").at(-1));
  assert.deepEqual(qinEvents, ["秦灭六国.md", "嬴政称皇帝.md", "焚书.md", "秦始皇去世.md", "陈胜吴广起义.md", "秦朝灭亡.md"]);
  assert.ok(events.some((n) => n.title === "凡尔登战役"));
  assert.ok(events.some((n) => n.title === "索姆河战役"));
  assert.equal(events.filter((n) => n.title === "中国加入世界贸易组织").length, 1);
});
test("all published links resolve and retain VitePress heading slug conventions", () => {
  const index = readVault(process.cwd());
  assert.deepEqual(
    index.links.filter((l) => !l.target).map((l) => l.reference),
    [],
  );
  assert.deepEqual(
    index.links
      .filter((l) => l.reason === "missing-anchor")
      .map((l) => l.reference),
    [],
  );
  assert.equal(slugify("6. 实战案例：Prompt 拆解"), "_6-实战案例-prompt-拆解");
});
