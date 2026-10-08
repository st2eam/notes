import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { once } from "node:events";
import { createPreviewServer } from "../.vitepress/preview.mjs";
test("preview supports notes base, direct Chinese/space paths, queries and case-colliding public assets", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "vault-preview-"));
  fs.mkdirSync(path.join(root, "photography"), { recursive: true });
  fs.writeFileSync(path.join(root, "photography", "vase.jpg"), "image");
  fs.mkdirSync(path.join(root, "Photography"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "Photography", "摄影 基础.html"),
    "<h1>摄影</h1>",
  );
  fs.writeFileSync(
    path.join(root, "Photography", "index.html"),
    "<h1>总览</h1>",
  );
  fs.writeFileSync(path.join(root, "404.html"), "not found");
  fs.writeFileSync(path.join(root, "app.js"), "export default 1");
  const server = createPreviewServer(root);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const route of [
      "/notes/Photography/摄影%20基础.html?embed=true",
      "/notes/Photography/摄影%20基础",
      "/notes/Photography/",
      "/notes/photography/vase.jpg",
    ])
      assert.equal((await fetch(base + route)).status, 200, route);
    assert.equal(
      (await fetch(base + "/notes/app.js")).headers.get("content-type"),
      "text/javascript; charset=utf-8",
    );
    assert.equal((await fetch(base + "/notes/no-note.html")).status, 404);
    assert.equal((await fetch(base + "/Photography/")).status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
