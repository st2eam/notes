import test from "node:test";
import assert from "node:assert/strict";
import { publicNoteUrl, contextMenuPosition } from "../.vitepress/vault/context-menu.mjs";

test("share links add the deployment base once and preserve Chinese paths and encoded anchors", () => {
  const path = "/经济学/政治经济学/生产力与生产关系.html";
  const anchor = encodeURIComponent("相互作用与制度变迁");
  const expected = new URL("/notes" + path + "#" + anchor, "https://st2eam.github.io").href;
  assert.equal(publicNoteUrl(path + "#" + anchor, "https://st2eam.github.io"), expected);
  assert.equal(publicNoteUrl(expected, "https://st2eam.github.io"), expected);
  assert.equal(publicNoteUrl("/notes" + path + "#" + anchor, "https://st2eam.github.io"), expected);
});

test("share links preserve graph filters and other query data but remove embedding settings", () => {
  const href = "/notes/计算机/基础/index.html?view=graph&filter=" + encodeURIComponent('path:"计算机/基础"') +
    "&embed=true&theme=dark&background=transparent&parentOrigin=https%3A%2F%2Fhost.example&example=1#heading";
  const url = new URL(publicNoteUrl(href, "https://notes.example"));
  assert.equal(url.searchParams.get("view"), "graph");
  assert.equal(url.searchParams.get("filter"), 'path:"计算机/基础"');
  assert.equal(url.searchParams.get("example"), "1");
  assert.equal(url.hash, "#heading");
  for (const key of ["embed", "theme", "background", "parentOrigin"]) assert.ok(!url.searchParams.has(key));
});

test("share links support spaces, local preview origins, root and alternate bases", () => {
  assert.equal(publicNoteUrl("/笔记 空格.html", "http://127.0.0.1:5173"), "http://127.0.0.1:5173/notes/%E7%AC%94%E8%AE%B0%20%E7%A9%BA%E6%A0%BC.html");
  assert.equal(publicNoteUrl("/note.html", "https://notes.example", "/"), "https://notes.example/note.html");
  assert.equal(publicNoteUrl("/note.html", "https://notes.example", "/vault/"), "https://notes.example/vault/note.html");
  assert.equal(publicNoteUrl("/notes/", "https://notes.example"), "https://notes.example/notes/");
});

test("share links reject external and executable URLs", () => {
  assert.throws(() => publicNoteUrl("https://other.example/note.html", "https://notes.example"));
  assert.throws(() => publicNoteUrl("javascript:alert(1)", "https://notes.example"));
});

test("menus keep normal pointer positions and flip near the right and bottom edges", () => {
  const size = { width: 224, height: 160 };
  const viewport = { width: 1024, height: 800 };
  assert.deepEqual(contextMenuPosition({ x: 120, y: 200 }, size, viewport), { left: 120, top: 200 });
  assert.deepEqual(contextMenuPosition({ x: 998, y: 798 }, size, viewport), { left: 774, top: 632 });
  assert.deepEqual(contextMenuPosition({ x: 998, y: 30 }, size, viewport), { left: 774, top: 30 });
  assert.deepEqual(contextMenuPosition({ x: 20, y: 798 }, size, viewport), { left: 20, top: 632 });
});

test("menus clamp keyboard anchors, outside points and oversized menus to the viewport", () => {
  const size = { width: 224, height: 160 };
  const viewport = { width: 1024, height: 800 };
  assert.deepEqual(contextMenuPosition({ x: 0, y: 0 }, size, viewport), { left: 8, top: 8 });
  assert.deepEqual(contextMenuPosition({ x: -20, y: 2000 }, size, viewport), { left: 8, top: 632 });
  assert.deepEqual(contextMenuPosition({ x: 319, y: 179 }, { width: 1000, height: 1000 }, { width: 320, height: 180 }), { left: 8, top: 8 });
  const tiny = contextMenuPosition({ x: 0, y: 0 }, size, { width: 10, height: 12 });
  assert.ok(tiny.left >= 0 && tiny.left <= 10 && tiny.top >= 0 && tiny.top <= 12);
});
