import { parseHistoryTime, overlapsHistoryTime, validHistoryYear } from "./history-time.mjs";
import { mapPlaces } from "./geo.mjs";

export function historyDateOrder(label = "") {
  return parseHistoryTime(label)?.order ?? null;
}
export function eventTime(note) {
  return note.geo?.time || parseHistoryTime(note.historyDate);
}
export function historyYearRange(start = "", end = "") {
  const from = start === "" ? null : Number(start);
  const to = end === "" ? null : Number(end);
  return { from, to, valid: (from == null || validHistoryYear(from)) &&
    (to == null || validHistoryYear(to)) && (from == null || to == null || from <= to) };
}
export function createHistorySearchIndex(notes, allNotes = notes) {
  return new Map(notes.map((note) => [note.id, [note.title, note.historyDate, note.excerpt,
    ...(note.aliases || []), note.geo?.locationNote,
    ...mapPlaces(note, allNotes).flatMap((item) => [item.title, item.name, item.reference,
      item.location?.modernName, ...(item.note?.aliases || []), ...(item.catalog?.aliases || []),
      ...(item.location?.variants || []).map((variant) => variant.name)]),
  ].filter(Boolean).join(" ").toLocaleLowerCase("zh-CN")]));
}
export function filterHistoryEvents(notes, { group = "", search = "", start = "", end = "", descending = false } = {}, searchIndex) {
  const range = historyYearRange(start, end);
  if (!range.valid) return [];
  const terms = search.trim().toLocaleLowerCase("zh-CN").split(/\s+/).filter(Boolean);
  const index = searchIndex || createHistorySearchIndex(notes);
  return sortHistory(notes.filter((note) => (!group || note.historyGroup === group) &&
    terms.every((term) => index.get(note.id)?.includes(term)) &&
    ((range.from == null && range.to == null) || overlapsHistoryTime(eventTime(note), range.from, range.to))), descending);
}
export function auditHistoryMetadata(notes) {
  const ids = new Set();
  const issues = [];
  for (const note of notes.filter((item) => item.historyId)) {
    if (ids.has(note.historyId)) issues.push({ id: note.id, field: "historyId", value: note.historyId });
    ids.add(note.historyId);
    const expected = historyDateOrder(note.historyDate);
    // A manually researched month/day may refine a label that only states a year.
    const detail = note.historyOrder - expected;
    const month = Math.floor(detail / 100), day = detail % 100;
    const refinement = expected != null && expected % 10000 === 0 && Number.isInteger(detail) &&
      detail >= 0 && month <= 12 && day <= 31 && (month > 0 || day === 0) &&
      (!day || day <= [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]);
    if (expected == null || (note.historyOrder != null && note.historyOrder !== expected && !refinement))
      issues.push({ id: note.id, field: "historyOrder", value: note.historyOrder, expected });
  }
  return issues;
}
export function sortHistory(notes, descending = false) {
  return notes.toSorted((a, b) => {
    const x = a.historyOrder ?? historyDateOrder(a.historyDate);
    const y = b.historyOrder ?? historyDateOrder(b.historyDate);
    if (x == null || y == null) return x == null ? (y == null ? a.title.localeCompare(b.title, "zh-CN") : 1) : -1;
    return (x - y) * (descending ? -1 : 1) || a.title.localeCompare(b.title, "zh-CN");
  });
}
export function sortHistoryTree(branch) {
  for (const folder of branch.folders) sortHistoryTree(folder);
  if (branch.path.startsWith("历史/")) {
    branch.notes = sortHistory(branch.notes);
    if (branch.path === "历史/中国史") {
      const earliest = (node) => Math.min(...node.notes.filter(n => n.historyOrder != null).map(n => n.historyOrder), ...node.folders.map(earliest));
      branch.folders.sort((a, b) => earliest(a) - earliest(b));
    }
  }
  return branch;
}
