const overviews = new Set(["历史/中国史/index.md", "历史/世界史/index.md"]);
const validTime = (value) => typeof value === "number" && Number.isFinite(value) &&
  Math.abs(value) <= 8.64e15;
const formatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export function sortTimeNotes(notes, field = "updatedAt", direction = "desc") {
  const key = field === "createdAt" ? "createdAt" : "updatedAt";
  const sign = direction === "asc" ? 1 : -1;
  return notes.filter((note) => note.id !== "index.md" &&
    (!note.id.endsWith("/index.md") || overviews.has(note.id))).sort((a, b) => {
    const aValid = validTime(a[key]), bValid = validTime(b[key]);
    if (aValid !== bValid) return aValid ? -1 : 1;
    if (aValid && a[key] !== b[key]) return (a[key] - b[key]) * sign;
    return a.title.localeCompare(b.title, "zh-CN") || a.id.localeCompare(b.id, "en");
  });
}

export function formatNoteTime(value) {
  return validTime(value) ? formatter.format(value) : "时间未知";
}
export function noteTimeISO(value) {
  return validTime(value) ? new Date(value).toISOString() : undefined;
}
