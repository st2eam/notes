import test from "node:test";
import assert from "node:assert/strict";
import { graphData, defaultGraphSettings } from "../.vitepress/vault/graph.mjs";
import { createGraphTab, restoreWorkspace } from "../.vitepress/vault/workspace.mjs";

const notes = ["目标 笔记", "入链", "出链", "间接关联", "无关笔记"].map((title) => ({
  id: `分类/${title}.md`,
  route: `/分类/${title}.html`,
  title,
  tags: [],
  aliases: [],
}));
const [target, incoming, outgoing, indirect, unrelated] = notes;
const index = {
  notes,
  attachments: [],
  links: [
    { source: incoming.id, target: target.id, kind: "note" },
    { source: target.id, target: outgoing.id, kind: "note", relationType: "similar" },
    { source: outgoing.id, target: indirect.id, kind: "note" },
  ],
};

test("related graphs include the target and direct incoming/outgoing neighbors, excluding indirect and unrelated nodes", () => {
  const graph = graphData(index, defaultGraphSettings(), target.id);
  assert.deepEqual(new Set(graph.nodes.map((n) => n.id)), new Set([target.id, incoming.id, outgoing.id]));
  assert.equal(graph.edges.length, 2);
  const isolated = graphData(index, defaultGraphSettings(), unrelated.id);
  assert.deepEqual(isolated.nodes.map((n) => n.id), [unrelated.id]);
  assert.equal(isolated.edges.length, 0);
  assert.equal(graphData(index, defaultGraphSettings()).nodes.length, notes.length);
});

test("related graph tabs retain their target in URLs and remain separate from global and other related graphs", () => {
  const related = createGraphTab(target, "", true);
  const global = createGraphTab(target);
  assert.notEqual(related.key, global.key);
  assert.notEqual(related.key, createGraphTab(incoming, "", true).key);
  assert.equal(related.key, createGraphTab(target, "", true).key);
  assert.equal(related.title, "目标 笔记 · 关联图谱");
  const url = new URL(related.href, "https://notes.example");
  assert.equal(decodeURIComponent(url.pathname), target.route);
  assert.equal(url.searchParams.get("view"), "graph");
  assert.equal(url.searchParams.get("scope"), "related");
  assert.equal(global.related, false);
  assert.equal(global.href, target.route + "?view=graph");
  assert.equal(createGraphTab(target, "tag:测试", true).filter, "tag:测试");
});

test("workspace restoration keeps related scope, deduplicates targets and drops removed related notes", () => {
  const related = createGraphTab(target, "", true);
  const other = createGraphTab(incoming, "", true);
  const global = createGraphTab(target);
  const restored = restoreWorkspace(JSON.stringify({
    active: related.key,
    tabs: [global, related, related, other, { key: "graph:removed", noteId: "removed.md", related: true }],
  }), notes);
  assert.equal(restored.active, related.key);
  assert.equal(restored.tabs.length, 3);
  assert.deepEqual(restored.tabs.find((t) => t.key === related.key), related);
  assert.deepEqual(restored.tabs.find((t) => t.key === other.key), other);
  assert.deepEqual(restored.tabs.find((t) => t.key === global.key), global);
});
