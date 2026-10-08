import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import {
  readVault,
  parseNote,
  buildVault,
  scanFiles,
} from "../.vitepress/vault/build.mjs";
import {
  resolveLink,
  matchesQuery,
  buildCategoryTree,
} from "../.vitepress/vault/model.mjs";
import {
  restoreWorkspace,
  restoreGraphSettings,
} from "../.vitepress/vault/workspace.mjs";
import { migrateQuery } from "../.vitepress/vault/migration.mjs";
import { graphData, defaultGraphSettings } from "../.vitepress/vault/graph.mjs";
import { searchNotes } from "../.vitepress/vault/search.mjs";
const manifest = JSON.parse(
  fs.readFileSync(".vitepress/reports/classification.json", "utf8"),
);
const vault = readVault(process.cwd());
const md = new MarkdownIt({ html: true });
test("361 original notes survive exactly once, with original headings, prose, demos and code", () => {
  assert.equal(manifest.records.length, 361);
  assert.equal(new Set(manifest.records.map((r) => r.newPath)).size, 361);
  for (const r of manifest.records) {
    const raw = execFileSync("git", ["show", "d34f2dc:" + r.oldPath], {
      encoding: "utf8",
    });
    const old = parseNote(r.oldPath, raw),
      next = parseNote(r.newPath, fs.readFileSync(r.newPath, "utf8"));
    assert.equal(next.note.originalPath, r.oldPath);
    assert.equal(next.note.title, old.note.title);
    assert.deepEqual(
      next.note.headings.slice(0, old.note.headings.length),
      old.note.headings,
      r.oldPath,
    );
    if (r.oldPath !== "index.md")
      assert.ok(next.text.startsWith(old.text), "changed prose: " + r.oldPath);
    const code = (s) =>
      md
        .parse(matter(s).content, {})
        .filter((t) => ["fence", "code_block"].includes(t.type))
        .map((t) => ({ info: t.info, content: t.content }));
    assert.deepEqual(
      code(fs.readFileSync(r.newPath, "utf8")),
      code(raw),
      "changed code: " + r.oldPath,
    );
  }
  assert.equal(vault.notes.filter((n) => n.originalPath).length, 361);
});
test("all notes have supported classifications, seven roots and acyclic explicit overviews", () => {
  const categories = new Map(vault.categories.map((c) => [c.id, c]));
  assert.equal(vault.categories.filter((c) => !c.parent).length, 7);
  assert.equal(vault.notes.length, 458);
  for (const n of vault.notes) {
    assert.ok(n.primaryCategory, n.id);
    assert.ok(n.categories.some((c) => c.path === n.primaryCategory));
    for (const c of n.categories) {
      assert.ok(categories.has(c.path), c.path);
      assert.ok(c.reason.length > 15, n.id);
    }
  }
  for (const c of vault.categories) {
    let parent = c.parent;
    const seen = new Set([c.id]);
    while (parent) {
      assert.ok(!seen.has(parent));
      seen.add(parent);
      assert.ok(categories.has(parent));
      parent = categories.get(parent).parent;
    }
  }
  assert.equal(
    vault.notes.filter((n) => n.classificationStatus === "provisional").length,
    5,
  );
  const tree = buildCategoryTree(vault.notes);
  const find = (branch, id) =>
    branch.notes.some((n) => n.id === id) ||
    branch.folders.some((f) => find(f, id));
  assert.ok(find(tree, "数学与统计/机器学习数学/机器学习数学基础.md"));
  assert.ok(
    !scanFiles(process.cwd()).some((f) => f.includes("/.vitepress/reports/")),
  );
});
test("semantic links retain independent meanings, evidence and safe cause direction", () => {
  const source = "计算机与软件/前端/CSS/CSS布局.md",
    target = "计算机与软件/前端/浏览器/浏览器渲染流程.md";
  const edges = vault.links.filter(
    (l) => (l.source === source && l.target === target) || (l.source === target && l.target === source),
  );
  assert.ok(
    edges.some(
      (l) =>
        l.relationType === "similar" && l.status === "inferred" && !l.directed,
    ),
  );
  assert.ok(
    edges.some(
      (l) =>
        l.relationType === "causal" &&
        l.status === "confirmed" &&
        l.directed &&
        l.evidence.includes("developer.mozilla.org"),
    ),
  );
  for (const l of vault.links.filter((l) => l.structured)) {
    assert.ok(l.target);
    assert.ok(l.explanation);
    assert.ok(l.evidence);
    assert.ok(!l.reason);
  }
  const emptyIds = new Set(
    vault.notes
      .filter((n) => n.classificationStatus === "provisional")
      .map((n) => n.id),
  );
  assert.ok(
    !vault.links.some(
      (l) =>
        l.status === "inferred" &&
        (emptyIds.has(l.source) || emptyIds.has(l.target)),
    ),
  );
  assert.throws(
    () =>
      buildVault([
        {
          id: "a.md",
          raw: "---\nrelations:\n - target: b.md\n   type: causal\n   status: inferred\n   reason: 猜测\n   evidence: 同目录\n---\n# a",
        },
        { id: "b.md", raw: "# b" },
      ]),
    /verified source/,
  );
});
test("relation and classification filters govern edges, arrows and local neighborhoods", () => {
  const settings = {
    ...defaultGraphSettings(),
    relationTypes: ["causal"],
    relationStatus: "confirmed",
    orphans: false,
  };
  const cause = graphData(vault, settings);
  assert.equal(cause.edges.length, 1);
  assert.equal(cause.nodes.length, 2);
  assert.equal(cause.edges[0].forward, true);
  assert.equal(cause.edges[0].backward, false);
  const local = graphData(
    vault,
    settings,
    "计算机与软件/前端/CSS/CSS布局.md",
    1,
  );
  assert.equal(local.nodes.length, 2);
  const inferred = graphData(vault, {
    ...defaultGraphSettings(),
    relationTypes: ["similar"],
    relationStatus: "inferred",
    orphans: false,
  });
  assert.ok(inferred.edges.length > 50);
  assert.ok(inferred.edges.every((e) => !e.forward && !e.backward));
  const category = graphData(vault, {
    ...defaultGraphSettings(),
    category: "数学与统计",
  });
  assert.ok(category.nodes.some((n) => n.title === "Embedding 与向量数据库"));
  const embedding = vault.notes.find(
    (n) => n.title === "Embedding 与向量数据库",
  );
  assert.ok(matchesQuery(embedding, "category:数学与统计"));
  assert.ok(!matchesQuery(embedding, "category:历史"));
  assert.ok(
    searchNotes(
      vault.notes,
      vault.search,
      "category:数学与统计 Embedding",
    ).some((r) => r.note.id === embedding.id),
  );
});
test("old note tabs, active graph keys, folder filters and group colors migrate", () => {
  const query = migrateQuery("path:History/");
  assert.equal(query, 'path:"历史/"');
  assert.equal(migrateQuery("path:Python/"), 'origin:"Python/"');
  const old = "History/笔记/汉王朝.md",
    next = manifest.paths[old];
  const restored = restoreWorkspace(
    JSON.stringify({
      tabs: [
        { key: old, noteId: old },
        { key: "graph:path:History/", noteId: old, filter: "path:History/" },
      ],
      active: old,
      expanded: ["History"],
    }),
    vault.notes,
  );
  assert.equal(restored.active, next);
  assert.equal(restored.tabs[0].noteId, next);
  assert.equal(restored.tabs[1].key, "graph:" + query);
  assert.ok(restored.expanded.includes("历史/人物"));
  const graph = restoreGraphSettings(
    JSON.stringify({
      query: "path:Python/",
      groups: [{ query: "path:History/", color: "#aa88ff" }],
    }),
  );
  assert.equal(graph.query, 'origin:"Python/"');
  assert.equal(graph.groups[0].query, query);
  const newId = manifest.paths["AI/Embedding与向量数据库.md"];
  assert.equal(
    resolveLink(
      vault.notes,
      newId,
      "/AI/Embedding与向量数据库.html?embed=true#余弦相似度",
    ).target,
    newId,
  );
});
test("explicit note paths take precedence over category indexes with the same stem", () => {
  const result = resolveLink(
    vault.notes,
    "历史/政权与制度/汉王朝.md",
    "历史/分期/古典时期",
    true,
  );
  assert.equal(result.target, "历史/分期/古典时期.md");
  assert.equal(
    resolveLink(vault.notes, result.target, "历史/分期/古典时期/", true).target,
    "历史/分期/古典时期/index.md",
  );
});
