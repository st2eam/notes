import { migrateNoteId } from "./migration.mjs";
// Shared browser-safe identity, resolution and graph rules.
export const slugify = (text) =>
  text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0000-\u001f]/g, "")
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(\d)/, "_$1")
    .toLowerCase();
export const decode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};
export function normalizePath(value) {
  const parts = [];
  for (const part of decode(value).replace(/\\/g, "/").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}
export const noteRoute = (id) =>
  "/" +
  (id === "index.md"
    ? ""
    : id.endsWith("/index.md")
      ? id.slice(0, -8)
      : id.replace(/\.md$/, ".html"));
export function resolveLink(notes, source, reference, wiki = false) {
  if (!reference || /^(?:[a-z][\w+.-]*:|\/\/)/i.test(reference)) return null;
  const [raw, anchor = ""] = decode(reference).split("#");
  const path = raw.split("?")[0];
  const query = raw.includes("?")
    ? "?" + raw.split("?").slice(1).join("?")
    : "";
  let found;
  if (!path) found = notes.find((n) => n.id === source);
  else {
    const rootPath = normalizePath(
      path.replace(/^\/notes\//, "/").replace(/\.html$/i, ".md"),
    );
    const local = normalizePath(
      source.split("/").slice(0, -1).join("/") +
        "/" +
        path.replace(/\.html$/i, ".md"),
    );
    const candidates = (v) =>
      path.endsWith("/")
        ? [v ? v.replace(/\/$/, "") + "/index.md" : "index.md"]
        : v
          ? [v, v + ".md", v.replace(/\/$/, "") + "/index.md"]
          : ["index.md"];
    const exact = (values) =>
      values
        .map((v) => notes.find((n) => n.id === v || migrateNoteId(v) === n.id))
        .find(Boolean);
    found = wiki
      ? path.includes("/")
        ? exact(candidates(rootPath)) || exact(candidates(local))
        : undefined
      : path.startsWith("/")
        ? exact(candidates(rootPath))
        : exact(candidates(local));
    if (!found && wiki && !path.includes("/")) {
      const name = path.replace(/\.md$/i, "");
      const matches = notes.filter(
        (n) =>
          n.title === name ||
          n.id.split("/").pop().replace(/\.md$/, "") === name ||
          n.aliases.includes(name),
      );
      if (matches.length === 1) found = matches[0];
    }
  }
  if (!found)
    return { target: null, reference, anchor, reason: "missing-or-ambiguous" };
  const heading =
    anchor &&
    (found.headings.find((h) => h.id === anchor || h.title === anchor) ||
      found.headings.find((h) => h.id === slugify(anchor)));
  return {
    target: found.id,
    anchor: heading?.id || anchor,
    reference,
    reason: anchor && !heading ? "missing-anchor" : null,
    href:
      found.route +
      query +
      (anchor ? "#" + encodeURIComponent(heading?.id || anchor) : ""),
  };
}
export function neighborhood(id, links, depth = 1) {
  const seen = new Set([id]);
  let wave = [id];
  for (let d = 0; d < Math.min(5, Math.max(0, depth)); d++) {
    const next = [];
    for (const l of links) {
      if (wave.includes(l.source) && l.target && !seen.has(l.target)) {
        seen.add(l.target);
        next.push(l.target);
      }
      if (wave.includes(l.target) && !seen.has(l.source)) {
        seen.add(l.source);
        next.push(l.source);
      }
    }
    wave = next;
    if (!wave.length) break;
  }
  return seen;
}
export function matchesQuery(note, query = "", text = "") {
  const words =
    query.match(/-?(?:path:|tag:|category:|origin:)?"[^"]+"|\S+/g) || [];
  return words.every((word) => {
    const negative = word.startsWith("-");
    if (negative) word = word.slice(1);
    const type = word.startsWith("path:")
      ? "path"
      : word.startsWith("tag:")
        ? "tag"
        : word.startsWith("category:")
          ? "category"
          : word.startsWith("origin:")
            ? "origin"
            : "text";
    const value = word
      .replace(/^(path:|tag:|category:|origin:)/, "")
      .replace(/^"|"$/g, "")
      .toLowerCase();
    const hit =
      type === "path"
        ? note.id.toLowerCase().includes(value)
        : type === "origin"
          ? (note.originalPath || "").toLowerCase().includes(value)
          : type === "category"
            ? (note.categories || []).some(
                (c) =>
                  c.path.toLowerCase() === value ||
                  c.path.toLowerCase().startsWith(value + "/"),
              )
            : type === "tag"
              ? note.tags.some(
                  (t) =>
                    t.toLowerCase() === value.replace(/^#/, "") ||
                    t.toLowerCase().startsWith(value.replace(/^#/, "") + "/"),
                )
              : [note.title, note.id, ...note.aliases, text]
                  .join(" ")
                  .toLowerCase()
                  .includes(value);
    return negative ? !hit : hit;
  });
}
export function buildTree(notes) {
  const root = { name: "", path: "", folders: [], notes: [] };
  for (const note of notes) {
    let branch = root;
    const parts = note.id.split("/");
    parts.pop();
    let current = "";
    for (const part of parts) {
      current += (current ? "/" : "") + part;
      let child = branch.folders.find((f) => f.name === part);
      if (!child) {
        child = { name: part, path: current, folders: [], notes: [] };
        branch.folders.push(child);
      }
      branch = child;
    }
    branch.notes.push(note);
  }
  return root;
}

export function buildCategoryTree(notes, category = "") {
  const virtual = notes.flatMap((note) =>
    (note.categories || [])
      .filter(
        (c) =>
          !category || c.path === category || c.path.startsWith(category + "/"),
      )
      .map((c) => ({
        ...note,
        id: c.path + "/" + note.id.split("/").at(-1),
        vaultId: note.id,
        categoryContext: c.path,
      })),
  );
  const tree = buildTree(virtual);
  const restore = (branch) => {
    branch.notes = branch.notes.map((n) => ({ ...n, id: n.vaultId }));
    for (const child of branch.folders) restore(child);
  };
  restore(tree);
  return tree;
}
