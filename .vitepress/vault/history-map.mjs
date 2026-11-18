import { describePlace } from "./geo.mjs";
import { jiangshanPeriods } from "./jiangshan-catalog.mjs";

const phases = jiangshanPeriods.flatMap(period => period.phases);
import { landMap } from "./geo-catalog.mjs";
import { modernMaps } from "./geo-modern-catalog.mjs";
import { describeJiangshanPlace, jiangshanSource, selectJiangshanPhase } from "./jiangshan-map.mjs";

// Ordinary note maps retain the pinned Jiangshan-only policy. The history explorer
// additionally offers a clearly labelled geographic reference outside its coverage.
export function historyMapContext(note, year, explorer = false) {
  const china = note.id.startsWith("历史/中国史/") || note.geo?.scope === "china";
  const historical = explorer && !china ? null : selectJiangshanPhase(year);
  const reference = explorer && !historical && year >= 1949
    ? modernMaps.find(map => map.scope === (china ? "china" : "world") && year >= map.from && year <= map.to) || null : null;
  return { historical, reference, landPath: explorer ? landMap.geometry : jiangshanSource.neighbors };
}

// Warm only adjacent phases, rather than downloading the entire historical atlas.
export function historyMapNeighbors(note, year) {
  const current = historyMapContext(note, year, true).historical;
  if (!current) return [];
  const index = phases.findIndex(phase => phase.geometry === current.geometry);
  return [phases[index - 1], phases[index + 1]].filter(Boolean).map(phase => phase.geometry);
}

export function historyMapPlace(item, year, areas = [], variant, explorer = false) {
  const place = describeJiangshanPlace(item, year, areas, variant);
  if (!explorer || place.variant) return place;
  const sourced = describePlace(item, year, variant);
  // A dated point is an additional geographic reference, never an invented
  // occurrence or another year's polygon. Ambiguous or missing sites stay missing.
  return sourced.variant?.coordinates ? { ...sourced, candidates: [sourced.variant] } : place;
}
