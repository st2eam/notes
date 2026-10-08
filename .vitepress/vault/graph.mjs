import { matchesQuery, neighborhood } from "./model.mjs";
export const defaultGraphSettings = () => ({
  query: "",
  category: "",
  relationTypes: ["citation", "similar", "subordinate", "causal"],
  relationStatus: "all",
  orphans: true,
  tags: false,
  attachments: false,
  arrows: false,
  nodeSize: 1,
  lineWidth: 1,
  labelThreshold: 1.6,
  center: 0.08,
  repel: 160,
  link: 0.3,
  distance: 70,
  groups: [],
});
export function selectRelations(links, settings) {
  return links.filter(
    (l) =>
      l.kind !== "note" ||
      ((
        settings.relationTypes || [
          "citation",
          "similar",
          "subordinate",
          "causal",
        ]
      ).includes(l.relationType || "citation") &&
        (settings.relationStatus === "all" ||
          !settings.relationStatus ||
          (l.status || "confirmed") === settings.relationStatus)),
  );
}
export function graphData(index, settings, current, depth = 1, documents = []) {
  const relationships = selectRelations(index.links, settings);
  const texts = new Map(documents.map((d) => [d.id, d.text]));
  let notes = index.notes.filter(
    (n) =>
      matchesQuery(n, settings.query, texts.get(n.id) || "") &&
      (!settings.category ||
        (n.categories || []).some(
          (c) =>
            c.path === settings.category ||
            c.path.startsWith(settings.category + "/"),
        )),
  );
  if (current) {
    const ids = neighborhood(
      current,
      relationships.filter((l) => l.kind === "note"),
      depth,
    );
    notes = notes.filter((n) => ids.has(n.id));
  }
  const ids = new Set(notes.map((n) => n.id));
  let edges = relationships
    .filter(
      (l) =>
        l.target &&
        l.source !== l.target &&
        ids.has(l.source) &&
        ids.has(l.target),
    )
    .map((l) => ({
      source: l.source,
      target: l.target,
      directed: l.directed !== false,
      relations: [l],
    }));
  let nodes = notes.map((n) => ({
    id: n.id,
    title: n.title,
    kind: "note",
    note: n,
  }));
  if (settings.tags) {
    const tags = new Map();
    for (const note of notes)
      for (const tag of note.tags) {
        const id = "tag:" + tag;
        tags.set(id, { id, title: "#" + tag, kind: "tag" });
        edges.push({ source: note.id, target: id });
      }
    nodes.push(...tags.values());
  }
  if (settings.attachments) {
    const used = new Set();
    for (const l of index.links)
      if (l.kind === "attachment" && ids.has(l.source)) {
        used.add(l.target);
        edges.push({ source: l.source, target: l.target });
      }
    nodes.push(
      ...index.attachments
        .filter((a) => used.has(a.id))
        .map((a) => ({ ...a, kind: "attachment" })),
    );
  }
  const unique = new Map();
  for (const edge of edges) {
    const key = [edge.source, edge.target].sort().join("\0");
    const previous = unique.get(key);
    if (previous) {
      previous.relations.push(...(edge.relations || []));
      if (edge.directed !== false) {
        if (previous.source !== edge.source) previous.backward = true;
        else previous.forward = true;
      }
      previous.bidirectional = !!(previous.forward && previous.backward);
    } else
      unique.set(key, {
        ...edge,
        relations: edge.relations || [],
        forward: edge.directed !== false,
        backward: false,
      });
  }
  edges = [...unique.values()];
  const degree = new Map();
  for (const e of edges) {
    degree.set(e.source, (degree.get(e.source) || 0) + 1);
    degree.set(e.target, (degree.get(e.target) || 0) + 1);
  }
  nodes = nodes
    .filter((n) => settings.orphans || degree.has(n.id))
    .map((n) => ({ ...n, degree: degree.get(n.id) || 0 }));
  return { nodes, edges };
}
