import fs from "node:fs";
import path from "node:path";
import { readVault } from "./vault/build.mjs";
const root = process.cwd();
const { attachments } = readVault(root);
for (const a of attachments) {
  if (a.id.startsWith("public/")) continue;
  const target = path.join(root, "docs/vault-assets", a.id);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, a.id), target);
}
