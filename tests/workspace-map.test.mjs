import test from "node:test";
import assert from "node:assert/strict";
import { createGraphTab, createMapTab, closeWorkspaceTabs, restoreWorkspace, parseMapView, normalizeMapView } from "../.vitepress/vault/workspace.mjs";

const note = { id: "历史/中国史/唐/index.md", title: "唐", route: "/历史/中国史/唐/index.html" };
const view = { year: 650, showRegions: false, showSettlements: true, variants: { changan: "settlement:tang:长安" } };

test("map tabs retain note identity and round-trip view state through copied URLs", () => {
  const tab = createMapTab(note, view);
  assert.equal(tab.key, "map:" + note.id);
  assert.equal(tab.noteId, note.id);
  assert.notEqual(tab.key, note.id);
  const url = new URL(tab.href, "https://local");
  assert.equal(url.searchParams.get("view"), "map");
  assert.deepEqual(parseMapView(url.searchParams.get("map")), view);
  assert.equal(createMapTab(note, { ...view, year: 800 }).key, tab.key);
  assert.equal(createMapTab(note).view, undefined);
});

test("saved map and reading tabs stay separate and map settings survive restoration", () => {
  const map = createMapTab(note, view), graph = createGraphTab();
  const reading = { key: note.id, noteId: note.id, title: note.title, href: note.route };
  const restored = restoreWorkspace(JSON.stringify({ tabs: [graph, reading, map, map], active: map.key }), [note]);
  assert.deepEqual(restored.tabs.map(t => t.key), [graph.key, reading.key, map.key]);
  assert.equal(restored.active, map.key);
  assert.deepEqual(restored.tabs[2].view, view);
  assert.equal(restored.tabs[2].href, map.href);
  assert.deepEqual(restoreWorkspace(JSON.stringify({ tabs: [map], active: map.key }), []).tabs, []);
});

test("invalid shared map state is bounded without admitting prototype properties", () => {
  assert.equal(parseMapView("{broken"), undefined);
  assert.equal(parseMapView("x".repeat(12001)), undefined);
  assert.equal(parseMapView("null"), undefined);
  assert.equal(parseMapView("[]"), undefined);
  const unsafe = JSON.parse('{"year":0,"showRegions":false,"variants":{"__proto__":"bad","valid":"ok","object":{}}}');
  assert.deepEqual(normalizeMapView(unsafe), { year: null, showRegions: false, showSettlements: true, variants: { valid: "ok" } });
  assert.deepEqual(normalizeMapView({ year: 1949, variants: ["bad"] }).variants, {});
  assert.equal(normalizeMapView({ year: 650.5 }).year, null);
});

test("map close and bulk close preserve the global graph and select a valid fallback", () => {
  const map = createMapTab(note, view), graph = createGraphTab();
  const reading = { key: note.id, title: note.title, href: note.route, noteId: note.id };
  const single = closeWorkspaceTabs([graph, reading, map], map.key, [map.key]);
  assert.equal(single.active, note.id);
  assert.deepEqual(single.tabs.map(t => t.key), [graph.key, reading.key]);
  const all = closeWorkspaceTabs([graph, reading, map], map.key, [graph.key, reading.key, map.key]);
  assert.deepEqual(all.tabs.map(t => t.key), ["graph:"]);
  assert.equal(all.active, "graph:");
});
