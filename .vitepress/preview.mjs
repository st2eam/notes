import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { pathToFileURL } from "node:url";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".wasm": "application/wasm",
};
export function createPreviewServer(directory, base = "/notes/") {
  const root = path.resolve(directory);
  return http.createServer((req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405);
      res.end();
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    if (pathname === base.slice(0, -1)) {
      res.writeHead(302, { Location: base });
      res.end();
      return;
    }
    if (!pathname.startsWith(base)) {
      res.writeHead(404);
      res.end();
      return;
    }
    const relative = pathname.slice(base.length);
    let file = path.resolve(root, relative || "index.html");
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    // Read through the filesystem instead of a case-sensitive filename cache.
    // macOS can merge public/photography with the Photography note directory.
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    else if (!path.extname(file) && fs.existsSync(file + ".html"))
      file += ".html";
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.statusCode = 404;
      file = path.join(root, "404.html");
      if (!fs.existsSync(file)) {
        res.end("Not found");
        return;
      }
    }
    res.setHeader(
      "Content-Type",
      types[path.extname(file).toLowerCase()] || "application/octet-stream",
    );
    res.setHeader("Cache-Control", "no-cache");
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(file)
      .on("error", () => res.destroy())
      .pipe(res);
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const args = process.argv.slice(2);
  const option = (name, fallback) => {
    const i = args.indexOf(name);
    return i >= 0
      ? args[i + 1]
      : args
          .find((a) => a.startsWith(name + "="))
          ?.split("=")
          .slice(1)
          .join("=") || fallback;
  };
  const host = option("--host", "127.0.0.1"),
    port = Number(option("--port", "4173"));
  const server = createPreviewServer(path.join(process.cwd(), "docs"));
  server.listen(port, host, () =>
    console.log(`Built knowledge base: http://${host}:${port}/notes/`),
  );
}
