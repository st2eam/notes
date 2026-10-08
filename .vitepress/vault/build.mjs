import fs from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import matter from "gray-matter";
import math from "markdown-it-mathjax3";
import { slugify, resolveLink, noteRoute, normalizePath } from "./model.mjs";
import { redirectTarget } from "../redirects.mjs";
const md = new MarkdownIt({ html: true }).use(math);
export function wikiPlugin(md, resolve) {
  md.inline.ruler.before("link", "vault-wiki", (state, silent) => {
    if (state.src.slice(state.pos, state.pos + 2) !== "[[") return false;
    const end = state.src.indexOf("]]", state.pos + 2);
    if (end < 0) return false;
    const raw = state.src.slice(state.pos + 2, end);
    if (raw.includes("\n")) return false;
    if (!silent) {
      const [reference, label] = raw.split("|");
      const token = state.push("vault_wiki", "", 0);
      token.meta = {
        reference,
        label: label || reference.split("#")[0].split("/").pop(),
        source: state.env.relativePath || state.env.path || "",
      };
    }
    state.pos = end + 2;
    return true;
  });
  md.renderer.rules.vault_wiki = (tokens, i) => {
    const t = tokens[i].meta;
    const resolved = resolve?.(t.source, t.reference);
    const label = md.utils.escapeHtml(t.label);
    return resolved?.target
      ? `<a class="internal-link" href="${md.utils.escapeHtml("/notes" + resolved.href)}">${label}</a>`
      : `<span class="unresolved-link" title="未解析链接：${md.utils.escapeHtml(t.reference)}">${label}</span>`;
  };
}
md.use(wikiPlugin);
const excluded = new Set([
  "node_modules",
  "docs",
  "cache",
  "temp",
  "tests",
  "public",
  "markdown-examples.md",
  "api-examples.md",
  "AGENTS.md",
  "README.md",
]);
export function scanFiles(root) {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs
      .readdirSync(dir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, "en"))) {
      if (
        entry.name.startsWith(".") ||
        excluded.has(entry.name) ||
        entry.isSymbolicLink()
      )
        continue;
      const target = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.name.endsWith(".md")) files.push(target);
    }
  };
  walk(root);
  return files;
}
const strings = (value) =>
  Array.isArray(value)
    ? value.map(String)
    : value
      ? String(value)
          .split(",")
          .map((v) => v.trim())
      : [];
const plain = (tokens) =>
  tokens
    .filter((t) =>
      ["text", "code_inline", "vault_wiki", "math_inline"].includes(t.type),
    )
    .map((t) => t.meta?.label || t.content)
    .join("");
export function parseNote(id, raw) {
  const { data, content } = matter(raw);
  const tokens = md.parse(content, { relativePath: id });
  const headings = [];
  const used = new Map();
  let body = [];
  const prose = [];
  let tagText = [];
  const references = [];
  let inHeading = false;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (
      t.type === "fence" ||
      t.type === "code_block" ||
      t.type === "math_block"
    )
      body.push(t.content);
    if (t.type === "heading_open") {
      inHeading = true;
      const title = plain(
        (tokens[i + 1]?.children || []).filter((t) => t.type !== "math_inline"),
      );
      const custom = title.match(/\s*\{#([^}]+)\}$/);
      const clean = title.replace(/\s*\{#[^}]+\}$/, "");
      const base = custom?.[1] || slugify(clean);
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      headings.push({
        title: clean,
        id: count ? base + "-" + count : base,
        level: Number(t.tag.slice(1)),
      });
    }
    if (t.type === "heading_close") inHeading = false;
    if (t.type === "html_block") {
      for (const match of t.content.matchAll(/\bid=["']([^"']+)["']/g))
        headings.push({ title: match[1], id: match[1], level: 0 });
    }
    if (t.type === "inline") {
      for (const c of t.children || [])
        if (c.type === "html_inline")
          for (const match of c.content.matchAll(/\bid=["']([^"']+)["']/g))
            headings.push({ title: match[1], id: match[1], level: 0 });
      const children = t.children || [];
      tagText.push(
        children
          .filter((c) => c.type === "text")
          .map((c) => c.content)
          .join(" "),
      );
      const context = plain(children)
        .replace(/\{#[^}]+\}/g, "")
        .trim();
      if (context) {
        body.push(context);
        if (!inHeading) prose.push(context);
      }
      for (const child of children) {
        if (
          child.type === "link_open" ||
          child.type === "vault_wiki" ||
          child.type === "image"
        )
          references.push({
            reference:
              child.meta?.reference ||
              child.attrGet("href") ||
              child.attrGet("src"),
            wiki: child.type === "vault_wiki",
            image: child.type === "image",
            context,
          });
      }
    }
  }
  const text = body.join("\n");
  const tags = strings(data.tags).map((t) => t.replace(/^#/, ""));
  for (const tag of tagText
    .join("\n")
    .matchAll(/(?:^|\s)#([\p{L}\p{N}_/-]+)/gu))
    if (!tags.includes(tag[1])) tags.push(tag[1]);
  const title =
    data.title ||
    headings.find((h) => h.level === 1)?.title ||
    id.split("/").pop().replace(/\.md$/, "");
  const excerpt = prose.slice(0, 2).join("\n").slice(0, 220);
  return {
    note: {
      id,
      path: id,
      route: noteRoute(id),
      title,
      aliases: strings(data.aliases || data.alias),
      tags,
      folder: id.split("/").slice(0, -1).join("/"),
      excerpt,
      headings,
      ...(data.historyId ? { historyId: data.historyId } : {}),
      ...(data.historyTheme ? { historyTheme: data.historyTheme } : {}),
    },
    references,
    text,
  };
}
export function buildVault(entries, root) {
  const parsed = entries.map(({ id, raw }) => parseNote(id, raw));
  const notes = parsed.map((p) => p.note);
  const links = [];
  const attachments = [];
  for (const p of parsed) {
    for (const ref of p.references) {
      if (!ref.reference || /^(?:[a-z][\w+.-]*:|\/\/|\?)/i.test(ref.reference))
        continue;
      let r = resolveLink(notes, p.note.id, ref.reference, ref.wiki);
      if (r?.target === null && !ref.wiki) {
        const redirected = redirectTarget(ref.reference);
        if (redirected) r = resolveLink(notes, p.note.id, redirected, false);
      }
      const extension = ref.reference
        .split(/[?#]/)[0]
        .match(/\.([a-z0-9]+)$/i)?.[1];
      if (extension && !["md", "html"].includes(extension)) {
        const attachmentId = normalizePath(
          ref.reference.startsWith("/")
            ? "public/" + ref.reference
            : p.note.folder + "/" + ref.reference.split(/[?#]/)[0],
        );
        if (
          root &&
          fs.existsSync(path.join(root, attachmentId)) &&
          !attachmentId
            .split("/")
            .some(
              (s) =>
                s.startsWith(".") ||
                ["node_modules", "docs", "cache", "temp"].includes(s),
            ) &&
          fs
            .realpathSync(path.join(root, attachmentId))
            .startsWith(path.resolve(root) + path.sep)
        ) {
          const route = attachmentId.startsWith("public/")
            ? "/" + attachmentId.slice(7)
            : "/vault-assets/" + attachmentId;
          attachments.push({
            id: attachmentId,
            title: attachmentId.split("/").pop(),
            route,
          });
          links.push({
            source: p.note.id,
            target: attachmentId,
            anchor: "",
            reference: ref.reference,
            context: ref.context,
            kind: "attachment",
          });
        }
        continue;
      }
      if (r)
        links.push({
          source: p.note.id,
          ...r,
          context: ref.context,
          kind: "note",
        });
    }
  }
  return {
    notes,
    links,
    attachments: [...new Map(attachments.map((a) => [a.id, a])).values()],
    search: parsed.map((p) => ({ id: p.note.id, text: p.text })),
  };
}
export const readVault = (root) =>
  buildVault(
    scanFiles(root).map((f) => ({
      id: path.relative(root, f).replace(/\\/g, "/"),
      raw: fs.readFileSync(f, "utf8"),
    })),
    root,
  );
