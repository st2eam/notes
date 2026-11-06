import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_PATH = fileURLToPath(new URL("../../../public/geo/v1/cities.tsv", import.meta.url));
const HEADER = "id\tname\tcountry\tlon\tlat\tpopulation\taltChineseNames\tasciiName";

// Normalize typography and an optional Chinese municipal suffix. Do not infer
// historical aliases, simplify traditional characters or pick one homonym.
export function normalizeCityName(name) {
  return name.normalize("NFKC").replace(/[’‘]/g, "'").trim().toLowerCase()
    .replace(/^([\p{Script=Han}]{2,})市$/u, "$1");
}

export function parseCities(text) {
  const lines = text.replace(/\r\n/g, "\n").trimEnd().split("\n");
  if (lines.shift() !== HEADER) throw new Error("Unexpected cities.tsv header");
  const ids = new Set();
  return Object.freeze(lines.map((line, index) => {
    const fields = line.split("\t");
    if (fields.length !== 8) throw new Error(`Invalid city columns at row ${index + 2}`);
    const [id, name, country, rawLon, rawLat, rawPopulation, aliases, asciiName] = fields;
    const lon = Number(rawLon), lat = Number(rawLat), population = Number(rawPopulation);
    if (!/^\d+$/.test(id) || Number(id) <= 0 || ids.has(id) || !name || !/^[A-Z]{2}$/.test(country)
      || !rawLon || !rawLat || !rawPopulation || !Number.isFinite(lon) || !Number.isFinite(lat)
      || Math.abs(lon) > 180 || Math.abs(lat) > 90 || !Number.isSafeInteger(population) || population < 0) {
      throw new Error(`Invalid city at row ${index + 2}`);
    }
    ids.add(id);
    return Object.freeze({
      id, name, asciiName, country, lon, lat, population,
      altChineseNames: Object.freeze(aliases ? aliases.split("|") : []),
    });
  }));
}

export function createCityIndex(cities) {
  const byId = new Map(cities.map((city) => [city.id, city]));
  const byName = new Map();
  for (const city of cities) {
    for (const key of new Set([city.name, city.asciiName, ...city.altChineseNames].map(normalizeCityName))) {
      if (!key) continue;
      const candidates = byName.get(key) ?? [];
      candidates.push(city);
      byName.set(key, candidates);
    }
  }
  for (const [key, cities] of byName) {
    byName.set(key, Object.freeze(cities.sort((a, b) => b.population - a.population || Number(a.id) - Number(b.id))));
  }
  return Object.freeze({
    size: cities.length,
    get(id) { return byId.get(String(id)); },
    find(name, { country } = {}) {
      const candidates = byName.get(normalizeCityName(name)) ?? [];
      return Object.freeze(country ? candidates.filter(city => city.country === country.toUpperCase()) : [...candidates]);
    },
  });
}

export function loadCityIndex(file = DEFAULT_PATH) {
  return createCityIndex(parseCities(readFileSync(file, "utf8")));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [name, country] = process.argv.slice(2);
  if (!name) {
    console.error("Usage: node scripts/geo/gazetteer/query.mjs <city name> [country code]");
    process.exitCode = 2;
  } else {
    const matches = loadCityIndex().find(name, { country });
    for (const city of matches) console.log([city.id, city.name, city.country, city.lon, city.lat, city.population].join("\t"));
    if (!matches.length) process.exitCode = 1;
  }
}
