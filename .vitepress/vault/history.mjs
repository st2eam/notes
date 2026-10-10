export function historyDateOrder(label = "") {
  const text = label.replace(/\s/g, "");
  const century = text.match(/^(?:约)?(前)?(\d+)世纪(末|中叶|初)?/);
  let year;
  if (century) {
    year = (Number(century[2]) - 1) * 100 + 1;
    if (century[3] === "末") year += 89;
    if (century[3] === "中叶") year += 49;
    if (century[1]) year = -year;
  } else {
    const match = text.match(/^(?:约)?(?:公元)?(前)?(\d+)年/);
    if (!match) return null;
    year = Number(match[2]) * (match[1] ? -1 : 1);
  }
  const month = Number(text.match(/年(\d+)月/)?.[1] || 0);
  const day = Number(text.match(/月(\d+)日/)?.[1] || 0);
  return year * 10000 + month * 100 + day;
}
export function sortHistory(notes, descending = false) {
  return [...notes].sort((a, b) => {
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
