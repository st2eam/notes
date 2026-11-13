import test from "node:test";
import assert from "node:assert/strict";
import { closeWorkspaceTabs, createGraphTab, restoreWorkspace } from "../.vitepress/vault/workspace.mjs";

const note = { id: "笔记.md", title: "笔记", route: "/笔记.html" };
const global = createGraphTab(note);
const first = { key: note.id, noteId: note.id, title: note.title, href: note.route };
const second = { key: "其他.md", noteId: "其他.md", title: "其他", href: "/其他.html" };
const filtered = createGraphTab(note, "path:历史/");
const related = createGraphTab(note, "", true);

test("global graph survives single close and repeated close-all requests", () => {
  let state = { tabs: [global], active: global.key };
  for (let i = 0; i < 3; i++) {
    state = closeWorkspaceTabs(state.tabs, state.active, [global.key]);
    assert.deepEqual(state, { tabs: [global], active: global.key });
  }
});

test("closing all keeps the global graph while closing notes, filtered and related graphs", () => {
  const tabs = [first, global, filtered, second, related];
  const state = closeWorkspaceTabs(tabs, related.key, tabs.map((tab) => tab.key));
  assert.deepEqual(state, { tabs: [global], active: global.key });
  assert.equal(tabs.length, 5);
  const restored = restoreWorkspace(JSON.stringify(state), [note]);
  assert.deepEqual(restored.tabs, state.tabs);
  assert.equal(restored.active, global.key);
});

test("closing other tabs preserves the clicked tab and global graph even when the clicked tab is inactive", () => {
  const tabs = [global, first, filtered, second, related];
  for (const target of [first, filtered, related, global]) {
    const keys = tabs.filter((tab) => tab.key !== target.key).map((tab) => tab.key);
    const state = closeWorkspaceTabs(tabs, second.key, keys);
    assert.deepEqual(state.tabs, tabs.filter((tab) => tab === global || tab === target));
    assert.equal(state.active, target.key);
  }
});

test("closing inactive tabs keeps the current tab and closing the active tab selects a neighbor", () => {
  const tabs = [global, first, second];
  assert.deepEqual(closeWorkspaceTabs(tabs, first.key, [second.key]), {
    tabs: [global, first], active: first.key,
  });
  assert.deepEqual(closeWorkspaceTabs(tabs, first.key, [first.key]), {
    tabs: [global, second], active: second.key,
  });
  assert.deepEqual(closeWorkspaceTabs(tabs, second.key, [second.key]), {
    tabs: [global, first], active: first.key,
  });
});

test("closing the last note or all tabs without an open global graph falls back to the global graph", () => {
  for (const tabs of [[first], [first, filtered, related]]) {
    const state = closeWorkspaceTabs(tabs, first.key, tabs.map((tab) => tab.key));
    assert.deepEqual(state, { tabs: [createGraphTab()], active: "graph:" });
  }
});

test("closing other tabs without an open global graph keeps the selected note", () => {
  assert.deepEqual(closeWorkspaceTabs([first, second], second.key, [second.key]), {
    tabs: [first], active: first.key,
  });
});
