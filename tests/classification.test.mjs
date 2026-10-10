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
import { migrateQuery, migrateNoteId } from "../.vitepress/vault/migration.mjs";
import { graphData, defaultGraphSettings } from "../.vitepress/vault/graph.mjs";
import { searchNotes } from "../.vitepress/vault/search.mjs";
const manifest = JSON.parse(
  fs.readFileSync(".vitepress/reports/classification.json", "utf8"),
);
const vault = readVault(process.cwd());
const md = new MarkdownIt({ html: true });
test("retained original notes preserve headings, demos and code after requested removals", () => {
  assert.equal(manifest.records.length, 361);
  assert.equal(new Set(manifest.records.map((r) => r.newPath)).size, 361);
  const removed = new Set(["AI/Agent工具与安全.md", "AI/AI应用开发.md", "AI/Prompt Engineering.md", "AI/Embedding与向量数据库.md", "AI/RAG与检索质量.md", "AI/大语言模型基础.md", "Language/index.md", "Language/日语.md"]);
  for (const r of manifest.records) {
    if (removed.has(r.oldPath)) {
      assert.ok(!fs.existsSync(r.newPath));
      continue;
    }
    const raw = execFileSync("git", ["show", "d34f2dc:" + r.oldPath], {
      encoding: "utf8",
    });
    const retainedPath = fs.existsSync(r.newPath) ? r.newPath : ".vitepress/archive/history-events/" + r.newPath;
    const old = parseNote(r.oldPath, raw),
      next = parseNote(r.newPath, fs.readFileSync(retainedPath, "utf8"));
    assert.equal(next.note.originalPath, r.oldPath);
    assert.equal(next.note.title, old.note.title);
    if (r.oldPath !== "History/index.md") assert.deepEqual(
      next.note.headings.slice(0, old.note.headings.length),
      old.note.headings,
      r.oldPath,
    );
    // Directory navigation and links to explicitly deleted notes may change.
    const code = (s) =>
      md
        .parse(matter(s).content, {})
        .filter((t) => ["fence", "code_block"].includes(t.type))
        .map((t) => ({ info: t.info, content: t.content }));
    assert.deepEqual(
      code(fs.readFileSync(retainedPath, "utf8")),
      code(raw),
      "changed code: " + r.oldPath,
    );
  }
  assert.equal(vault.notes.filter((n) => n.originalPath).length, 295);
});
test("all notes have supported classifications, six roots and acyclic explicit overviews", () => {
  const categories = new Map(vault.categories.map((c) => [c.id, c]));
  assert.equal(vault.categories.filter((c) => !c.parent).length, 6);
  assert.equal(vault.notes.length, 699);
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
  assert.ok(category.nodes.some((n) => n.title === "PyTorch 官方文档"));
  const embedding = vault.notes.find(
    (n) => n.title === "PyTorch 官方文档",
  );
  assert.ok(matchesQuery(embedding, "category:数学与统计"));
  assert.ok(!matchesQuery(embedding, "category:历史"));
  assert.ok(
    searchNotes(
      vault.notes,
      vault.search,
      "category:数学与统计 PyTorch",
    ).some((r) => r.note.id === embedding.id),
  );
});
test("old note tabs, active graph keys, folder filters and group colors migrate", () => {
  const query = migrateQuery("path:History/");
  assert.equal(query, 'path:"历史/"');
  assert.equal(migrateQuery("path:Python/"), 'origin:"Python/"');
  const old = "History/笔记/汉王朝.md",
    next = migrateNoteId(old);
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
  assert.ok(restored.expanded.includes("历史/中国史"));
  const graph = restoreGraphSettings(
    JSON.stringify({
      query: "path:Python/",
      groups: [{ query: "path:History/", color: "#aa88ff" }],
    }),
  );
  assert.equal(graph.query, 'origin:"Python/"');
  assert.equal(graph.groups[0].query, query);
  const newId = manifest.paths["AI/agentic-engineering-patterns.md"];
  assert.equal(
    resolveLink(
      vault.notes,
      newId,
      "/AI/agentic-engineering-patterns.html",
    ).target,
    newId,
  );
});
test("history note and folder overview links resolve after flattening", () => {
  const result = resolveLink(
    vault.notes,
    "历史/中国史/秦/秦灭六国.md",
    "历史/中国史/秦/焚书",
    true,
  );
  assert.equal(result.target, "历史/中国史/秦/焚书.md");
  assert.equal(
    resolveLink(vault.notes, result.target, "历史/世界史/", true).target,
    "历史/世界史/index.md",
  );
});

test("history events follow dynasty or country classifications", () => {
  const history = vault.notes.filter((n) => n.historyId);
  for (const note of history) {
    assert.equal(note.primaryCategory, note.folder);
    assert.deepEqual(note.categories.map((c) => c.path), [note.folder]);
    assert.ok(note.historyGroup);
    assert.ok(Number.isFinite(note.historyOrder));
    assert.ok(note.historyDate);
  }
  assert.equal(history.filter((n) => n.id.startsWith("历史/中国史/")).length, 155);
  assert.equal(history.filter((n) => n.id.startsWith("历史/世界史/")).length, 116);
  assert.ok(history.some(n => n.folder === "历史/中国史/秦"));
  assert.ok(history.some(n => n.folder === "历史/世界史/亚洲/日本"));
});
