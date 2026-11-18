// Exact coordinate membership in the statically parsed, fixed Jiangshan source.
// No rounding, nearest-city substitution or other-source fallback is allowed.
export function sourceCoordinates(dynasties) {
  const coordinates = new Set();
  for (const period of dynasties) {
    for (const record of [...(period.milestones || []), ...(period.settlements || [])]) {
      for (const point of [record.coord, ...(record.siteCoords || [])]) {
        if (Array.isArray(point) && point.length === 2 && point.every(Number.isFinite)) {
          coordinates.add(JSON.stringify(point));
        }
      }
    }
  }
  return coordinates;
}
