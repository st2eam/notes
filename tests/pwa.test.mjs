import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { buildPwa } from "../.vitepress/pwa/build.mjs";

test("install manifest stays in the deployment scope and references correctly sized PNG icons", () => {
  const manifest = JSON.parse(fs.readFileSync("public/manifest.webmanifest", "utf8"));
  assert.equal(manifest.id, "/notes/");
  assert.equal(manifest.start_url, "/notes/");
  assert.equal(manifest.scope, "/notes/");
  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192" && icon.purpose === "any"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512" && icon.purpose === "any"));
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
  for (const icon of manifest.icons) {
    const png = fs.readFileSync(path.join("public", icon.src));
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes);
  }
});

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "notes-pwa-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "assets"));
  for (const [name, content] of Object.entries({
    "index.html": "home", "offline.html": "offline", "笔记.html": "note",
    "assets/笔记.js": "note module", "assets/app.css": "styles", "large.pdf": "attachment",
  })) fs.writeFileSync(path.join(root, name), content);
  return root;
}

test("PWA versions content and encodes offline assets without precaching all pages or attachments", (t) => {
  const root = fixture(t);
  const first = buildPwa(root);
  assert.ok(first.files.includes("/notes/assets/%E7%AC%94%E8%AE%B0.js"));
  assert.ok(first.files.includes("/notes/index.html"));
  assert.ok(!first.files.includes("/notes/large.pdf"));
  assert.ok(!first.files.includes("/notes/%E7%AC%94%E8%AE%B0.html"));
  assert.equal(buildPwa(root).version, first.version);
  fs.writeFileSync(path.join(root, "笔记.html"), "updated note");
  assert.notEqual(buildPwa(root).version, first.version);
});

function worker(root) {
  buildPwa(root);
  const handlers = {}, stores = new Map();
  let online = true, status = 200, skipped = false, claimed = false;
  const absolute = (key) => new URL(typeof key === "string" ? key : key.url, "https://example.com").href;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      return {
        async addAll(requests) {
          if (!online) throw new Error("offline");
          for (const request of requests) entries.set(absolute(request), new Response(absolute(request)));
        },
        async match(key) { return entries.get(absolute(key))?.clone(); },
        async put(key, response) { entries.set(absolute(key), response.clone()); },
        async keys() { return [...entries.keys()].map((url) => new Request(url)); },
        async delete(key) { return entries.delete(absolute(key)); },
      };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
  };
  // Browser Request accepts relative URLs; Node's Request requires an origin.
  class BrowserRequest extends Request {
    constructor(url, options) { super(absolute(url), options); }
  }
  vm.runInNewContext(fs.readFileSync(path.join(root, "sw.js"), "utf8"), {
    self: {
      location: { origin: "https://example.com" },
      addEventListener(name, handler) { handlers[name] = handler; },
      clients: { async claim() { claimed = true; } },
      async skipWaiting() { skipped = true; },
    },
    caches, URL, Request: BrowserRequest, Response,
    async fetch(request) {
      if (!online) throw new Error("offline");
      return new Response(`network:${request.url}`, { status });
    },
  });
  async function event(name, data = {}) {
    const pending = [];
    let result;
    handlers[name]({ ...data, waitUntil(p) { pending.push(p); }, respondWith(p) { result = p; } });
    const response = await result;
    await Promise.all(pending);
    return response;
  }
  return {
    event, caches, stores,
    online(value) { online = value; },
    status(value) { status = value; },
    skipped: () => skipped, claimed: () => claimed,
    fetch(route, mode = "navigate", options = {}) {
      return event("fetch", { request: {
        url: `https://example.com${route}`, method: "GET", mode, headers: new Headers(), ...options,
      } });
    },
  };
}

test("worker caches visited notes, normalizes embed URLs, handles offline misses and respects scope", async (t) => {
  const sw = worker(fixture(t));
  await sw.event("install");
  assert.equal(sw.skipped(), false, "updates must wait for user acceptance");
  await sw.caches.open("another-app");
  await sw.caches.open("notes-pwa:/notes/:old:static");
  await sw.event("activate");
  assert.ok(sw.claimed());
  assert.ok(sw.stores.has("another-app"));
  assert.ok(!sw.stores.has("notes-pwa:/notes/:old:static"));
  const note = "/notes/%E7%AC%94%E8%AE%B0.html";
  await sw.fetch(note + "?embed=true");
  sw.status(503);
  assert.match(await (await sw.fetch(note)).text(), /network:/);
  sw.online(false);
  assert.match(await (await sw.fetch(note + "?theme=dark")).text(), /network:/);
  assert.match(await (await sw.fetch("/notes/")).text(), /index.html/);
  assert.match(await (await sw.fetch("/notes/unvisited.html")).text(), /offline.html/);
  assert.match(await (await sw.fetch("/notes/assets/%E7%AC%94%E8%AE%B0.js", "cors")).text(), /assets/);
  assert.equal(await sw.fetch("/other-app/"), undefined);
  assert.equal(await sw.fetch("/notes/sw.js", "cors"), undefined);
  assert.equal(await sw.fetch("/notes/api?query=1", "cors"), undefined);
  assert.equal(await sw.fetch("/notes/media.mp4", "cors", { headers: new Headers({ range: "bytes=0-10" }) }), undefined);
  await sw.event("message", { data: { type: "SKIP_WAITING" } });
  assert.ok(sw.skipped());
});

test("failed precaching does not leave a partial cache active", async (t) => {
  const sw = worker(fixture(t));
  sw.online(false);
  await assert.rejects(sw.event("install"), /offline/);
  assert.equal(sw.stores.size, 0);
});
