import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { redirects, redirectTarget } from "../.vitepress/redirects.mjs";
import {
  pageHref,
  writeRedirectPages,
} from "../.vitepress/write-redirects.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function listedExactly(sitePath) {
  const parts = sitePath.replace(/^\//, "").split("/");
  let dir = root;
  for (const part of parts.slice(0, -1)) {
    if (!readdirSync(dir).includes(part)) return false;
    dir = join(dir, part);
  }
  return readdirSync(dir).includes(`${parts.at(-1)}.md`);
}

test("every old note path redirects to exactly one existing page", () => {
  const targets = new Set();
  for (const [from, to] of Object.entries(redirects)) {
    assert.equal(redirectTarget(from), to);
    assert.equal(redirectTarget(`${from}.md`), to);
    assert.equal(redirectTarget(`/notes${from}.html`), to);
    assert.equal(listedExactly(from), false, `old file still exists: ${from}`);
    assert.equal(listedExactly(to), true, `missing target: ${to}`);
    assert.ok(!Object.hasOwn(redirects, to), `redirect chain: ${to}`);
    targets.add(to);
  }
  assert.equal(
    redirectTarget("/Study/Git"),
    "/计算机与软件/工程化/版本管理/Git",
  );
  assert.equal(redirectTarget("/Language/Japanese"), "/人文语言/日语/日语");
  assert.equal(
    redirectTarget("/Design Patterns/单例模式"),
    "/计算机与软件/架构/设计模式/创建型/单例模式",
  );
  assert.equal(listedExactly("/Design Patterns/单例模式"), false);
});

test("sidebar no longer lists the dissolved groups", () => {
  const sidebar = readFileSync(join(root, ".vitepress/sidebar.ts"), "utf8");
  const domains = JSON.parse(
    sidebar.replace(/^export default /, "").replace(/;\s*$/, ""),
  );
  const names = domains.map((item) => item.text);
  assert.deepEqual(names, [
    "计算机与软件",
    "人工智能",
    "数学与统计",
    "设计",
    "影像",
    "历史",
    "人文语言",
  ]);
  for (const gone of [
    '"/Study/',
    '"/Web/JS Lib/',
    '"/Python/flask/',
    '"/Python/python基础/',
    '"text": "Study"',
    '"text": "JS Lib"',
  ]) {
    assert.equal(sidebar.includes(gone), false, gone);
  }
  for (const kept of ['"text": "后端"', '"text": "架构"']) {
    assert.equal(sidebar.includes(kept), true, kept);
  }
});

test("built redirect pages point at the notes base", () => {
  const out = mkdtempSync(join(tmpdir(), "notes-redirects-"));
  try {
    writeRedirectPages(out, "/notes/");
    const html = readFileSync(join(out, "Study/Git.html"), "utf8");
    assert.match(
      html,
      new RegExp(
        `url=${pageHref("/计算机与软件/工程化/版本管理/Git", "/notes/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      ),
    );
    assert.ok(html.includes(pageHref("/计算机与软件/工程化/版本管理/Git")));
    assert.match(html, /location\.search \+ location\.hash/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
