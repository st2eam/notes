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
  const tabs = (Array.isArray(saved.tabs) ? saved.tabs : []).flatMap((t) => {
    if (typeof t?.key !== "string") return [];
    if (t.key.startsWith("graph:")) {
      const filter = typeof t.filter === "string" ? t.filter : "";
      const note = notes.find((n) => n.id === t.noteId);
      return [
        {
          key: "graph:" + filter,
          noteId: note?.id,
          title: filter.startsWith("path:History")
            ? "History 图谱"
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
    const n = notes.find((n) => n.id === t.noteId);
    return n
      ? [{ key: n.id, title: n.title, href: n.route, noteId: n.id }]
      : [];
  });
  return {
    active: tabs.some((t) => t.key === saved.active) ? saved.active : null,
    tabs: [...new Map(tabs.map((t) => [t.key, t])).values()],
    leftOpen: typeof saved.leftOpen === "boolean" ? saved.leftOpen : true,
    rightOpen: typeof saved.rightOpen === "boolean" ? saved.rightOpen : true,
    leftWidth: clamp(saved.leftWidth, 190, 420, 250),
    rightWidth: clamp(saved.rightWidth, 190, 420, 280),
    expanded: Array.isArray(saved.expanded)
      ? saved.expanded.filter((s) => typeof s === "string")
      : ["History"],
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
    query: typeof saved.query === "string" ? saved.query : "",
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
    .slice(0, 30);
  return restored;
}
