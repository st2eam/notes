import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { redirects } from "./redirects.mjs";

export function pageHref(sitePath, base = "/notes/") {
  const prefix = base.endsWith("/") ? base : `${base}/`;
  const parts = sitePath
    .replace(/^\//, "")
    .split("/")
    .map((part) => encodeURIComponent(part));
  return `${prefix}${parts.join("/")}.html`;
}

export function writeRedirectPages(outDir, base = "/notes/") {
  for (const [from, to] of Object.entries(redirects)) {
    const file = join(outDir, `${from.replace(/^\//, "")}.html`);
    const target = pageHref(to, base);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(
      file,
      `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script>
<noscript><meta http-equiv="refresh" content="0;url=${target}"></noscript>
<link rel="canonical" href="${target}">
<title>页面已移动</title>
</head>
<body><a href="${target}">继续阅读</a></body>
</html>
`,
    );
  }
}

if (process.argv[1] && process.argv[1].endsWith("write-redirects.mjs")) {
  writeRedirectPages("docs");
}
