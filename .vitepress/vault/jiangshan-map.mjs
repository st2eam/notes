import { jiangshanPeriods, jiangshanSettlements, jiangshanSource } from "./jiangshan-catalog.mjs";
import { noteGeoTime } from "./geo.mjs";

export { jiangshanSource };
export function selectJiangshanPhase(year, periods = jiangshanPeriods) {
  if (!Number.isInteger(year) || year === 0) return null;
  const period = periods.find(p => year >= p.from && year <= p.to);
  const phase = period?.phases.find(p => year >= p.from && year <= p.to);
  return phase ? { ...phase, period: period.title, dynasty: period.key } : null;
}
export function jiangshanYears(note, periods = jiangshanPeriods) {
  const time = noteGeoTime(note);
  if (!time) return periods.map(p => p.focusYear ?? p.from);
  const years = new Set([time.from, time.to]);
  for (const p of periods) {
    for (const year of [p.focusYear, ...p.phases.map(ph => ph.from)])
      if (year && year >= time.from && year <= time.to) years.add(year);
  }
  return [...years].sort((a, b) => a - b);
}
export function initialJiangshanYear(note) {
  const time = noteGeoTime(note);
  if (!time) return null;
  if (time.approximate) {
    const p = jiangshanPeriods.find(p => p.focusYear >= time.from && p.focusYear <= time.to);
    if (p) return p.focusYear;
  }
  return time.from;
}
export const visibleAt = (item, year) => year != null &&
  (item.appear == null || year >= item.appear) && (item.vanish == null || year < item.vanish);
export function settlementsAt(year, settlements = jiangshanSettlements) {
  return settlements.filter(s => year >= s.from && year <= s.to && visibleAt(s, year)).map(s => {
    const era = s.eraNames?.find(n => (n.from == null || year >= n.from) && (n.until == null || year < n.until));
    return { ...s, originalAncient: s.ancient, ancient: era?.zh || s.ancient,
      isCapital: Boolean(s.isCapital && (!s.capitalPeriods?.length || s.capitalPeriods.some(([from, to]) => year >= from && year <= to))) };
  });
}
const normalizeName = name => String(name || "").trim().replace(/（[^）]*）|\([^)]*\)/g, "").replace(/\s/g, "");
export function placeNames(item) {
  return [...new Set([item.name, item.title, item.reference, ...(item.note?.aliases || []),
    ...(item.catalog?.aliases || []), ...(item.location?.variants || []).map(v => v.name)]
    .map(normalizeName).filter(Boolean))];
}
export function describeJiangshanPlace(item, year, areas = [], selected, settlements = jiangshanSettlements) {
  const names = placeNames(item);
  const kind = item.location?.kind || item.note?.geo?.place?.kind;
  const isArea = kind === "region" || kind === "polity";
  let candidates;
  if (isArea) {
    candidates = areas.filter(f => names.includes(normalizeName(f.properties?.title)))
      .map((f, index) => ({ id: `area:${f.properties.layer}:${f.properties.title}:${index}`, name: f.properties.title,
        feature: f, accuracy: "江山地图阶段示意边界，非精确测绘范围", source: jiangshanSource.source }));
  } else {
    const current = settlementsAt(year, settlements);
    const ancient = current.filter(s => [s.ancient, s.originalAncient, ...(s.aliases || [])].some(name => names.includes(normalizeName(name))));
    const matches = ancient.length ? ancient : current.filter(s => names.includes(normalizeName(s.modern)));
    const unique = [...new Map(matches.map(s => [`${s.ancient}:${s.coord.join(",")}`, s])).values()];
    candidates = unique.map(s => ({ id: `settlement:${s.dynasty}:${s.ancient}:${s.coord.join(",")}`, name: s.ancient,
      coordinates: s.coord, modern: s.modern, accuracy: "江山地图聚落代表点，非事件发生点的精确定位", source: jiangshanSource.source }));
  }
  const variant = selected ? candidates.find(v => v.id === selected) : candidates.length === 1 ? candidates[0] : null;
  const name = item.name || variant?.name || item.title || item.reference;
  const label = variant?.modern ? `${name}（今${variant.modern}）` : name;
  const missing = variant ? "" : year == null ? "选择年代后匹配江山地图地点" :
    !selectJiangshanPhase(year) ? "江山地图未覆盖该年代" :
    candidates.length > 1 ? "上游存在多个同名地点，请选择" : "江山地图此阶段未收录对应地点";
  return { ...item, name, label, variant, missing, candidates, place: { kind: isArea ? "region" : "point" } };
}
