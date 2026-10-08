import { migrateNoteId, migrateQuery, migrationPaths } from "./migration.mjs";
import { defaultGraphSettings } from "./graph.mjs";
export const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const clamp = (value, min, max, fallback) =>
  Number.isFinite(Number(value))
    ? Math.max(min, Math.min(max, Number(value)))
    : fallback;
export function restoreWorkspace(raw, notes) {
  let saved = {};
  try {
    saved = JSON.parse(raw || "{}") || {};
  } catch {}
  const keyMap = new Map();
  const tabs = (Array.isArray(saved.tabs) ? saved.tabs : []).flatMap((t) => {
    if (typeof t?.key !== "string") return [];
    if (t.key.startsWith("graph:")) {
      const filter = migrateQuery(typeof t.filter === "string" ? t.filter : "");
      keyMap.set(t.key, "graph:" + filter);
      const note = notes.find((n) => n.id === migrateNoteId(t.noteId));
      return [
        {
          key: "graph:" + filter,
          noteId: note?.id,
          title: /^(path:历史|path:"历史)/.test(filter)
            ? "历史图谱"
            : filter
              ? "筛选图谱"
              : "全局图谱",
          href:
            (note?.route || "/") +
            "?view=graph" +
            (filter ? "&filter=" + encodeURIComponent(filter) : ""),
          filter,
        },
      ];
    }
    const n = notes.find((n) => n.id === migrateNoteId(t.noteId));
    if (n) keyMap.set(t.key, n.id);
    return n
      ? [{ key: n.id, title: n.title, href: n.route, noteId: n.id }]
      : [];
  });
  return {
    active:
      keyMap.get(saved.active) ||
      (tabs.some((t) => t.key === saved.active) ? saved.active : null),
    tabs: [...new Map(tabs.map((t) => [t.key, t])).values()],
    leftOpen: typeof saved.leftOpen === "boolean" ? saved.leftOpen : true,
    rightOpen: typeof saved.rightOpen === "boolean" ? saved.rightOpen : true,
    leftWidth: clamp(saved.leftWidth, 190, 420, 250),
    rightWidth: clamp(saved.rightWidth, 190, 420, 280),
    expanded: Array.isArray(saved.expanded)
      ? saved.expanded
          .filter((s) => typeof s === "string")
          .flatMap((s) => {
            const ids = Object.entries(migrationPaths)
              .filter(([old]) => old.startsWith(s + "/"))
              .map(([, id]) => id);
            return ids.length
              ? [
                  ...new Set(
                    ids.flatMap((id) => {
                      const parts = id.split("/").slice(0, -1);
                      return parts.map((_, i) =>
                        parts.slice(0, i + 1).join("/"),
                      );
                    }),
                  ),
                ]
              : [s];
          })
      : ["历史"],
    localDepth: clamp(saved.localDepth, 1, 5, 1),
    rightTab: saved.rightTab === "links" ? "links" : "outline",
    theme: ["dark", "light"].includes(saved.theme) ? saved.theme : null,
  };
}
export function restoreGraphSettings(raw) {
  const defaults = defaultGraphSettings();
  let saved = {};
  try {
    saved = JSON.parse(raw || "{}") || {};
  } catch {}
  const restored = {
    ...defaults,
    query: migrateQuery(typeof saved.query === "string" ? saved.query : ""),
    category: typeof saved.category === "string" ? saved.category : "",
    relationStatus: ["all", "confirmed", "inferred"].includes(
      saved.relationStatus,
    )
      ? saved.relationStatus
      : "all",
    relationTypes: Array.isArray(saved.relationTypes)
      ? saved.relationTypes.filter((t) =>
          ["citation", "similar", "subordinate", "causal"].includes(t),
        )
      : defaults.relationTypes,
  };
  for (const key of ["orphans", "tags", "attachments", "arrows"])
    if (typeof saved[key] === "boolean") restored[key] = saved[key];
  for (const [key, min, max] of [
    ["nodeSize", 0.5, 3],
    ["lineWidth", 0.2, 3],
    ["labelThreshold", 0.1, 3],
    ["center", 0.01, 0.3],
    ["repel", 20, 600],
    ["link", 0.05, 1],
    ["distance", 20, 180],
  ])
    restored[key] = clamp(saved[key], min, max, defaults[key]);
  restored.groups = (Array.isArray(saved.groups) ? saved.groups : [])
    .filter(
      (g) => typeof g?.query === "string" && /^#[a-f\d]{6}$/i.test(g.color),
    )
    .slice(0, 30)
    .map((g) => ({ ...g, query: migrateQuery(g.query) }));
  return restored;
}

export function migrateGraphStorage() {
  try {
    const prefix = "steam-vault-graph-v1";
    for (const key of Object.keys(localStorage).filter((k) =>
      k.startsWith(prefix),
    )) {
      const next =
        key === prefix || key === prefix + ":local"
          ? key
          : prefix + ":" + migrateQuery(key.slice(prefix.length + 1));
      const raw = readStorage(key);
      if (raw && (next === key || !readStorage(next)))
        localStorage.setItem(next, JSON.stringify(restoreGraphSettings(raw)));
    }
  } catch {}
}
