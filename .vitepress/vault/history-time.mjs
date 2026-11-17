// Historical years use -1, 1 across the era boundary: there is no year zero.
export const validHistoryYear = (year) => Number.isInteger(year) && year !== 0 && Math.abs(year) <= 100000;

function endpoint(raw, inherited) {
  const approximate = /约|前后/.test(raw);
  let text = raw.replace(/^约/, "").replace(/前后$/, "");
  const era = text.match(/^(公元)?(前)?/);
  const bce = era[2] ? true : era[1] ? false : inherited?.bce || false;
  text = text.slice(era[0].length);
  const century = text.match(/^(\d+)世纪(初|中叶|末)?$/);
  if (century) {
    const number = Number(century[1]);
    if (!number || number > 1000) return null;
    const first = bce ? -number * 100 : (number - 1) * 100 + 1;
    // Parts are approximate search windows, not exact historical dates. Keep the
    // familiar decade anchors for CE ordering and advance forward in BCE too.
    const offset = { 初: 0, 中叶: 49, 末: 89 }[century[2]];
    const from = first + (offset ?? 0);
    const to = first + (offset == null ? 99 : Math.min(99, offset + 10));
    return { from, to, order: from * 10000, lastOrder: to * 10000 + 1231,
      approximate: true, precision: century[2] ? "century-part" : "century", bce };
  }
  const yearDate = text.match(/^(\d+)年(代|初|末)?(?:(\d+)月(?:(\d+)日)?)?$/);
  const shortMonth = !yearDate && inherited && text.match(/^(\d+)月(?:(\d+)日)?$/);
  const shortDay = !yearDate && !shortMonth && inherited?.month && text.match(/^(\d+)日$/);
  if (!yearDate && !shortMonth && !shortDay) return null;
  let year = yearDate ? Number(yearDate[1]) * (bce ? -1 : 1) : inherited.from;
  const month = Number(yearDate?.[3] || shortMonth?.[1] || (shortDay ? inherited.month : 0));
  const day = Number(yearDate?.[4] || shortMonth?.[2] || shortDay?.[1] || 0);
  if (!validHistoryYear(year) || month > 12 || day > 31 ||
    ((yearDate?.[3] || shortMonth) && month < 1) ||
    ((yearDate?.[4] || shortMonth?.[2] || shortDay) && day < 1)) return null;
  if (day && day > [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]) return null;
  const decade = yearDate?.[2] === "代";
  if (decade && (month || Math.abs(year) % 10 !== 0)) return null;
  const from = decade && bce ? year - 9 : year;
  const to = decade && !bce ? year + 9 : year;
  if (!validHistoryYear(from) || !validHistoryYear(to)) return null;
  return { from, to, month, bce,
    order: from * 10000 + month * 100 + day,
    lastOrder: to * 10000 + (month || 12) * 100 + (day || 31),
    approximate: approximate || Boolean(yearDate?.[2]),
    precision: decade ? "decade" : day ? "day" : month ? "month" : "year" };
}

export function parseHistoryTime(label = "") {
  const raw = String(label).replace(/\s/g, "");
  const openEnd = raw.endsWith("起");
  const text = openEnd ? raw.slice(0, -1) : raw;
  const parts = text.split(/[—–~～至-]+/);
  if (parts.length > 2 || parts.some((part) => !part)) return null;
  // The archive also uses the abbreviated forms "208—209年" and "3月—4月".
  const start = endpoint(parts[0].replace(/^(约?(?:公元)?前?\d+)$/, "$1年"), null);
  if (!start) return null;
  const end = parts.length === 2 ? endpoint(parts[1], start) : start;
  if (!end || start.order > end.lastOrder || start.from > end.to) return null;
  return { from: start.from, to: end.to, order: start.order,
    approximate: start.approximate || end.approximate,
    precision: parts.length === 2 ? "range" : start.precision, ...(openEnd ? { openEnd: true } : {}) };
}

export function overlapsHistoryTime(time, from, to) {
  return Boolean(time && (from == null || time.openEnd || time.to >= from) && (to == null || time.from <= to));
}
