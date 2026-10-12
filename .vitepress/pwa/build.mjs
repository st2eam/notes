import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

export function buildPwa(directory, base = "/notes/") {
  const files = [];
  const digest = createHash("sha256");
  function walk(folder, prefix = "") {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const relative = prefix + entry.name;
      if (entry.isDirectory()) walk(path.join(folder, entry.name), relative + "/");
      else if (relative !== "sw.js") {
        const bytes = fs.readFileSync(path.join(folder, entry.name));
        // Version all published content, including pages cached at runtime.
        digest.update(relative).update(bytes);
        if (["index.html", "offline.html", "manifest.webmanifest", "favicon.png", "favicon.ico"].includes(relative)
          || /\.(?:js|mjs|css|json|woff2?)$/.test(relative) || relative.startsWith("pwa/")) {
          files.push(base + relative.split("/").map(encodeURIComponent).join("/"));
        }
      }
    }
  }
  walk(directory);
  const template = fs.readFileSync(fileURLToPath(new URL("./worker.js", import.meta.url)), "utf8");
  digest.update(template);
  const version = digest.digest("hex").slice(0, 16);
  const source = template.replace("__PWA_CONFIG__", JSON.stringify({ base, version, files }));
  fs.writeFileSync(path.join(directory, "sw.js"), source);
  return { version, files };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = buildPwa(path.resolve("docs"));
  console.log(`PWA: ${result.files.length} offline resources, version ${result.version}`);
}
