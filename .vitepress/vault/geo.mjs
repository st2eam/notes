import { resolveLink } from "./model.mjs";
import { historyDateOrder } from "./history.mjs";
import { historicalMaps } from "./geo-catalog.mjs";
import { geographicPlaces } from "./geo-places.mjs";

const placesById = new Map(geographicPlaces.map((place) => [place.id, place]));
export const geographicPlace = (id) => placesById.get(id);

const periods = [
  ["秦", -221, -207], ["西汉", -202, 9], ["东汉", 25, 220],
  ["三国", 220, 280], ["西晋", 266, 316], ["东晋", 317, 420],
  ["南北朝", 420, 589], ["隋", 581, 618], ["唐", 618, 907],
  ["五代十国", 907, 979], ["北宋", 960, 1127], ["南宋", 1127, 1279],
  ["宋", 960, 1279], ["元", 1271, 1368], ["明", 1368, 1644], ["清", 1644, 1912],
];
const validYear = (n) => Number.isInteger(n) && n !== 0 && Math.abs(n) <= 100000;
const validPoint = (p) => Array.isArray(p) && p.length === 2 &&
  p.every(Number.isFinite) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90;
const localGeometry = (p) => typeof p === "string" &&
  /^\/geo\/[\p{L}\p{N}_./-]+\.geojson$/u.test(p) && !p.split("/").includes("..");
const sourceValid = (s) => typeof s?.title === "string" && s.title.trim() &&
  typeof s.url === "string" && /^https:\/\//.test(s.url);

export function normalizeGeo(raw, noteId = "") {
  if (raw == null) return undefined;
  const invalid = (field) => { throw new Error(`Invalid geography metadata: ${noteId} (${field})`); };
  if (typeof raw !== "object" || Array.isArray(raw)) invalid("geo");
  const geo = {};
  for (const key of ["scope", "period", "locationNote", "bindingStatus"]) {
    if (raw[key] != null) {
      if (typeof raw[key] !== "string") invalid(key);
      geo[key] = raw[key];
    }
  }
  if (geo.bindingStatus && !["bound", "uncertain"].includes(geo.bindingStatus)) invalid("bindingStatus");
  if (raw.excludePlaces != null) {
    if (!Array.isArray(raw.excludePlaces) || raw.excludePlaces.some((p) => typeof p !== "string" || !p.trim())) invalid("excludePlaces");
    geo.excludePlaces = [...new Set(raw.excludePlaces)];
  }
  if (raw.time) {
    const { from, to = from } = raw.time;
    if (!validYear(from) || !validYear(to) || from > to) invalid("time");
    geo.time = { from, to };
  }
  if (raw.places != null) {
    if (!Array.isArray(raw.places)) invalid("places");
    geo.places = raw.places.map((p) => {
      const entry = typeof p === "string" ? { target: p } : p;
      const key = entry?.place != null ? "place" : "target";
      if (typeof entry?.[key] !== "string" || !entry[key].trim() ||
        (entry.place != null && entry.target != null) ||
        (entry.variant != null && typeof entry.variant !== "string") ||
        (entry.name != null && (typeof entry.name !== "string" || !entry.name.trim()))) invalid("places.target");
      return { [key]: entry[key], ...(entry.variant ? { variant: entry.variant } : {}), ...(entry.name ? { name: entry.name } : {}) };
    });
  }
  if (raw.place) {
    const place = raw.place;
    if (!place.id || !["point", "region", "polity"].includes(place.kind) ||
      !Array.isArray(place.variants)) invalid("place");
    const ids = new Set();
    const variants = place.variants.map((v) => {
      if (typeof v.id !== "string" || ids.has(v.id) || typeof v.name !== "string" ||
        !sourceValid(v.source) || typeof v.accuracy !== "string") invalid("variant");
      ids.add(v.id);
      if ((v.from != null && !validYear(v.from)) || (v.to != null && !validYear(v.to)) ||
        (v.from != null && v.to != null && v.from > v.to)) invalid("variant.time");
      if (v.snapshotYear != null && !validYear(v.snapshotYear)) invalid("snapshotYear");
      if (place.kind === "point" ? !validPoint(v.coordinates) : !localGeometry(v.geometry))
        invalid("variant.geometry");
      if (v.labelCoordinates != null && !validPoint(v.labelCoordinates)) invalid("labelCoordinates");
      return {
        id: v.id, name: v.name, accuracy: v.accuracy,
        source: { title: v.source.title, url: v.source.url },
        ...Object.fromEntries(["from", "to", "snapshotYear", "coordinates", "geometry", "labelCoordinates"]
          .filter((key) => v[key] != null).map((key) => [key, v[key]])),
      };
    });
    geo.place = { id: String(place.id), kind: place.kind,
      modernName: typeof place.modernName === "string" ? place.modernName : "", variants };
  }
  return geo;
}

export const isPlaceNote = (note) => Boolean(note?.geo?.place || note?.tags?.includes("地点"));

// Extract from the original Markdown references, before semantic graph edges merge.
export function resolveGeoReferences(notes, note, references) {
  const result = new Map();
  const excluded = new Set(note.geo?.excludePlaces || []);
  for (const ref of references) {
    if (ref.image) continue;
    const resolved = resolveLink(notes, note.id, ref.reference, ref.wiki);
    const target = notes.find((n) => n.id === resolved?.target);
    if (target && target.id !== note.id && !excluded.has(target.id) && isPlaceNote(target))
      result.set(target.id, { target: target.id, reference: ref.reference });
  }
  for (const explicit of note.geo?.places || []) {
    if (explicit.place) {
      const place = geographicPlace(explicit.place);
      result.set("place:" + explicit.place, {
        target: null, place: explicit.place, reference: place?.title || explicit.place,
        ...(explicit.variant ? { variant: explicit.variant } : {}),
        ...(explicit.name ? { name: explicit.name } : {}),
      });
      continue;
    }
    const resolved = resolveLink(notes, note.id, explicit.target, true);
    const key = resolved?.target || explicit.target;
    if (excluded.has(key)) continue;
    result.set(key, {
      target: resolved?.target || null, reference: explicit.target,
      ...(explicit.variant ? { variant: explicit.variant } : {}),
      ...(explicit.name ? { name: explicit.name } : {}),
    });
  }
  return [...result.values()];
}

export function parseGeoTime(label = "") {
  const text = String(label).replace(/\s/g, "");
  const match = text.match(/^(?:约)?((?:公元)?前?)(\d+)年(?:[—–~～至-]+((?:公元)?前?)(\d+)年)?$/);
  if (match) {
    const from = Number(match[2]) * (match[1].includes("前") ? -1 : 1);
    const to = match[4] ? Number(match[4]) *
      ((match[3].includes("前") || (!match[3] && match[1].includes("前"))) ? -1 : 1) : from;
    return validYear(from) && validYear(to) && from <= to ? { from, to } : null;
  }
  // Exact dates can reuse the site's existing year/month/day grammar.
  if (/^(?:约)?(?:公元)?前?\d+年\d+月(?:\d+日)?$/.test(text)) {
    const order = historyDateOrder(text);
    const year = order == null ? null : Math.floor(order / 10000);
    return validYear(year) ? { from: year, to: year } : null;
  }
  return null;
}

function notePeriod(note) {
  const names = new Set(periods.map(([name]) => name));
  const explicit = [note.geo?.period, note.historyGroup, note.historyPeriod].find((p) => names.has(p));
  if (explicit) return explicit;
  return (note.primaryCategory || note.id).split("/").reverse().find((part) => names.has(part)) || "";
}

export function noteGeoTime(note) {
  if (note.geo?.time) return { ...note.geo.time, approximate: false };
  const parsed = parseGeoTime(note.historyDate);
  if (parsed) return { ...parsed, approximate: String(note.historyDate).includes("约") };
  const period = notePeriod(note);
  const era = periods.find(([name]) => name === period);
  return era ? { from: era[1], to: era[2], approximate: true } : null;
}

export const yearLabel = (year) => year < 0 ? `前 ${-year} 年` : `${year} 年`;
export const timeLabel = (time) => !time ? "年代未确定" :
  (time.approximate ? "时期：" : "") + yearLabel(time.from) +
  (time.from === time.to ? "" : `—${yearLabel(time.to)}`);

function periodAt(note, year) {
  const named = notePeriod(note);
  if (named && periods.some(([name, from, to]) => name === named && year >= from && year <= to)) return named;
  return periods.find(([, from, to]) => year >= from && year <= to)?.[0] || named || "";
}

export function selectHistoricalMap(note, year, catalog = historicalMaps) {
  if (!validYear(year)) return null;
  const scope = note.geo?.scope || note.historyTrack ||
    (note.id.startsWith("历史/中国史/") ? "china" : "world");
  const period = periodAt(note, year);
  return catalog.filter((m) => m.scope === scope && m.period === period &&
    year >= m.from && year <= m.to)
    .sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year) || a.year - b.year)[0] || null;
}

export function mapYearOptions(note, places) {
  const time = noteGeoTime(note);
  const years = new Set();
  if (time) {
    years.add(time.from); years.add(time.to);
    for (const [, from, to] of periods) {
      if (from > time.from && from < time.to) years.add(from);
      if (to > time.from && to < time.to) years.add(to);
    }
  }
  for (const item of places) for (const v of (item.location || item.note?.geo?.place)?.variants || []) {
    for (const y of [v.from, v.to, v.snapshotYear])
      if (validYear(y) && (!time || (y >= time.from && y <= time.to))) years.add(y);
  }
  // Snapshots inside a broad period are useful defaults, without pretending they
  // describe the entire time range.
  for (const m of historicalMaps)
    if (time && m.year >= time.from && m.year <= time.to && selectHistoricalMap(note, m.year)?.id === m.id)
      years.add(m.year);
  return [...years].sort((a, b) => a - b);
}

export function mapPlaces(note, notes) {
  if (!note) return [];
  const refs = [...(isPlaceNote(note) ? [{ target: note.id, reference: note.title }] : []),
    ...(note.geoReferences || [])];
  const places = new Map();
  for (const ref of refs) {
    const target = notes.find((n) => n.id === ref.target) || null;
    const record = ref.place ? geographicPlace(ref.place) : null;
    const location = target?.geo?.place || record?.location;
    const key = location?.id || ref.target || ref.place || ref.reference;
    const previous = places.get(key);
    places.set(key, {
      ...previous, ...ref, key, note: target || previous?.note || null,
      catalog: record || previous?.catalog || null, location,
      title: target?.title || previous?.note?.title || record?.title || ref.reference,
    });
  }
  return [...places.values()];
}

export function selectPlaceVariant(place, year, variantId) {
  const variants = place?.variants || [];
  // An explicit override resolves ambiguity, but must still belong to this date.
  const fits = (v) => year == null || ((v.from == null || year >= v.from) && (v.to == null || year <= v.to));
  if (variantId) return variants.find((v) => v.id === variantId && fits(v)) || null;
  const candidates = variants.filter(fits);
  if (candidates.length === 1) return candidates[0];
  // Prefer a documented dated form over an undated approximate site. Two
  // overlapping dated forms still require a deliberate choice.
  if (year != null) {
    const dated = candidates.filter((v) => v.from != null && v.to != null);
    if (dated.length === 1) return dated[0];
  }
  return null;
}

export function describePlace(item, year, chosenVariant) {
  const place = item.location || item.note?.geo?.place;
  const variantId = chosenVariant || item.variant;
  const variant = selectPlaceVariant(place, year, variantId);
  const name = item.name || variant?.name || item.title || item.note?.title || item.reference;
  const modern = place?.modernName;
  let missing = "";
  if (!item.note && !item.catalog) missing = "地点引用待确认";
  else if (!place) missing = "地理资料待补";
  else if (!place.variants.length) missing = place.kind === "point" ? "坐标待补" : "区域范围待补";
  else if (!variant) missing = variantId ? "该历史形态不适用于当前年份" :
    (year == null || place.variants.filter((v) => (v.from == null || year >= v.from) &&
      (v.to == null || year <= v.to)).length > 1) ? "请选择历史形态" : "该时期地理资料待补";
  return { ...item, place, variant, name, label: `${name}（${modern ? "今" + modern : "今址待考"}）`, missing };
}
