// Project-owned static converter. Never executes upstream JavaScript.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { babelParse } from "@vue/compiler-sfc";
import { parseUpstreamData } from "./jiangshan.mjs";

const COMMIT = "897b9ad4e987fcface8728ffdfbe33e801a3dbae";
const ROOT = "public/history/jiangshan";
const SUBSET = `${ROOT}/source-subset.json`;
const CATALOG = ".vitepress/vault/jiangshan-catalog.mjs";
const HASHES = { atlas: "12ad4a8d8252be4fb5828a9ad866cba21db2a8864545007263f9f41122460a7e",
  geography: "a2d3dc622bd57bd4ba88e77fcc34902af775e02dc74b3ffa997c0f757156d1f1",
  settlements: "0654ae269ebd9e89162be87aef484cf3d3d224fe96295a132db75948d0bbbfa1" };
const sha = text => createHash("sha256").update(text).digest("hex");
const json = value => JSON.stringify(value) + "\n";
const alphabet = [...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)), ..."0123456789+-"].join("");
const previousYear = year => year === 1 ? -1 : year - 1;
const point = p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90;

export function staticConstant(text, name) {
  const ast = babelParse(text, { sourceType: "script" });
  const expression = ast.program.body[0]?.expression;
  const statements = expression?.type === "CallExpression" && expression.callee?.type === "FunctionExpression"
    ? expression.callee.body.body : [];
  const values = statements.flatMap(s => s.type === "VariableDeclaration" ? s.declarations : []).filter(d => d.id.name === name);
  if (values.length !== 1) throw new Error(`Missing static constant: ${name}`);
  // JSON.parse accepts data only; executable initializers, getters and calls fail.
  return JSON.parse(text.slice(values[0].init.start, values[0].init.end));
}
export function decodeRing(text) {
  if (typeof text !== "string" || !text.length) throw new Error("Invalid encoded ring");
  let at = 0, x = 0, y = 0;
  const integer = () => {
    let value = 0, multiplier = 1, part;
    do {
      if (at >= text.length || multiplier > 2 ** 30) throw new Error("Truncated or oversized VLQ");
      part = alphabet.indexOf(text[at++]);
      if (part < 0) throw new Error("Invalid VLQ character");
      value += (part & 31) * multiplier;
      multiplier *= 32;
    } while (part >= 32);
    return value % 2 ? -(Math.floor(value / 2) + 1) : value / 2;
  };
  const out = [];
  while (at < text.length) {
    x += integer(); y += integer();
    const p = [x / 100, y / 100];
    if (!point(p)) throw new Error("Invalid decoded coordinate");
    out.push(p);
  }
  return out;
}
export function closedRing(points, exterior) {
  const out = points.filter((p, i) => !i || p[0] !== points[i - 1][0] || p[1] !== points[i - 1][1]).map(p => [...p]);
  if (!out.every(point) || out.length < 3) throw new Error("Invalid polygon ring");
  const first = out[0], last = out.at(-1);
  if (first[0] !== last[0] || first[1] !== last[1]) out.push([...first]);
  if (new Set(out.map(p => p.join(","))).size < 3) throw new Error("Collapsed polygon ring");
  const area = out.slice(0, -1).reduce((sum, p, i) => sum + p[0] * out[i + 1][1] - out[i + 1][0] * p[1], 0);
  if (!area) throw new Error("Zero-area polygon ring");
  if ((area > 0) !== exterior) out.reverse();
  return out;
}
export function buildPeriods(dynasties) {
  return dynasties.flatMap((d, di) => {
    const end = Math.min(di < dynasties.length - 1 ? previousYear(dynasties[di + 1].fromYear) : d.toYear, 1948);
    if (d.fromYear > end) return [];
    const phases = (d.phases?.length ? d.phases : [{ until: d.toYear, snap: `s_${d.key}` }]).flatMap((p, i, all) => {
      const from = i ? all[i - 1].until : d.fromYear;
      const to = Math.min(i === all.length - 1 ? end : previousYear(p.until), end);
      if (from > to) return [];
      if (!/^[a-z0-9_]+$/.test(p.snap)) throw new Error("Invalid snapshot ID");
      return [{ id: p.snap, title: p.overview || "", from, to, geometry: `/history/jiangshan/snapshots/${p.snap}.geojson` }];
    });
    return [{ key: d.key, title: d.title, from: d.fromYear, to: end, focusYear: d.focusYear, phases }];
  });
}
export function permittedSubset(data, periods) {
  const selected = new Set(periods.flatMap(p => p.phases.map(ph => ph.id)));
  const d = {}, used = new Set(data.d.neighbors || []);
  const regions = (key, visited = new Set()) => {
    if (visited.has(key)) throw new Error("Cyclic region reference");
    const snapshot = data.d[key];
    if (!snapshot) throw new Error("Missing region reference");
    if (snapshot.regions?.length) return snapshot.regions;
    if (!snapshot.regionRef) return [];
    return regions(snapshot.regionRef, new Set([...visited, key]));
  };
  d.neighbors = data.d.neighbors || [];
  for (const key of selected) {
    const s = data.d[key];
    if (!s) throw new Error(`Missing snapshot: ${key}`);
    d[key] = { caption: s.caption || "", polities: s.polities || [], regions: regions(key) };
    for (const index of [...d[key].polities, ...d[key].regions]) used.add(index);
  }
  const f = [], r = [], featureIds = new Map(), ringIds = new Map();
  const ring = index => {
    if (!Number.isInteger(index) || typeof data.r[index] !== "string") throw new Error("Missing ring");
    if (!ringIds.has(index)) { ringIds.set(index, r.length); r.push(data.r[index]); }
    return ringIds.get(index);
  };
  for (const index of used) {
    const feature = data.f[index];
    if (!Number.isInteger(index) || !feature?.shape) throw new Error("Missing feature geometry");
    const shape = feature.shape._p ? { _p: feature.shape._p.map(ring) } :
      feature.shape._m ? { _m: feature.shape._m.map(poly => poly.map(ring)) } : null;
    if (!shape) throw new Error("Unsupported geometry");
    featureIds.set(index, f.length);
    f.push({ title: feature.title, ...(feature.anchor ? { anchor: feature.anchor } : {}), shape });
  }
  for (const [key, snapshot] of Object.entries(d)) {
    if (key === "neighbors") d[key] = snapshot.map(i => featureIds.get(i));
    else for (const layer of ["polities", "regions"]) snapshot[layer] = snapshot[layer].map(i => featureIds.get(i));
  }
  return { r, f, d };
}
export function extractSubset(atlasText, geographyText, dynasties) {
  if (sha(atlasText) !== HASHES.atlas || sha(geographyText) !== HASHES.geography) throw new Error("Upstream checksum mismatch");
  const periods = buildPeriods(dynasties);
  return { commit: COMMIT, license: "GPL-3.0-only", upstreamHashes: HASHES,
    atlas: permittedSubset(staticConstant(atlasText, "D"), periods),
    hydro: { rivers: staticConstant(geographyText, "HR"), lakes: staticConstant(geographyText, "HL") } };
}
function collection(features) {
  return { type: "FeatureCollection", attribution: "DeanChensj/jiangshan-map and contributors", license: "GPL-3.0-only", features };
}
export function buildMapOutputs(subset, dynasties) {
  if (subset.commit !== COMMIT) throw new Error("Unexpected source version");
  const periods = buildPeriods(dynasties);
  const data = subset.atlas;
  const rings = new Map();
  const ring = (index, exterior) => {
    if (!rings.has(index)) rings.set(index, decodeRing(data.r[index]));
    return closedRing(rings.get(index), exterior);
  };
  const feature = (index, layer) => {
    const f = data.f[index], s = f.shape;
    const geometry = s._p ? { type: "Polygon", coordinates: s._p.map((r, i) => ring(r, i === 0)) }
      : { type: "MultiPolygon", coordinates: s._m.map(poly => poly.map((r, i) => ring(r, i === 0))) };
    return { type: "Feature", properties: { title: f.title, anchor: f.anchor, layer }, geometry };
  };
  const outputs = new Map();
  for (const id of new Set(periods.flatMap(p => p.phases.map(ph => ph.id)))) {
    const s = data.d[id];
    outputs.set(`${ROOT}/snapshots/${id}.geojson`, json(collection([
      ...s.regions.map(i => feature(i, "region")), ...s.polities.map(i => feature(i, "polity")),
    ])));
    for (const p of periods) for (const ph of p.phases) if (ph.id === id) ph.title = s.caption || ph.title;
  }
  outputs.set(`${ROOT}/neighbors.geojson`, json(collection(data.d.neighbors.map(i => feature(i, "context")))));
  const hydro = [];
  for (const [kind, list] of [["river", subset.hydro.rivers], ["lake", subset.hydro.lakes]]) for (const item of list) {
    const coordinates = kind === "river" ? item.l.map(decodeRing).filter(line => line.length > 1)
      : item.r.map((r, i) => closedRing(decodeRing(r), i === 0));
    if (!coordinates.length) continue;
    hydro.push({ type: "Feature", properties: { name: item.n, rank: item.k, kind,
      ...(item.a == null ? {} : { appear: item.a }), ...(item.v == null ? {} : { vanish: item.v }) },
      geometry: { type: kind === "river" ? "MultiLineString" : "Polygon", coordinates } });
  }
  outputs.set(`${ROOT}/hydro.geojson`, json(collection(hydro)));
  const settlements = periods.flatMap(p => dynasties.find(d => d.key === p.key).settlements.filter(s => point(s.coord)).flatMap(s => {
    const from = Math.max(p.from, s.appear ?? p.from), to = Math.min(p.to, s.vanish == null ? p.to : previousYear(s.vanish));
    return from <= to ? [{ ...s, dynasty: p.key, from, to }] : [];
  }));
  const source = { source: { title: "江山地图 · DeanChensj/jiangshan-map and contributors",
    url: `https://github.com/DeanChensj/jiangshan-map/tree/${COMMIT}` },
    accuracy: "阶段疆域和一级区划为近似示意；聚落为代表点；周边国界为现代地理参照。未采用 CHGIS 府级边界及 DataV 现代省界。",
    neighbors: "/history/jiangshan/neighbors.geojson", hydro: "/history/jiangshan/hydro.geojson",
    settlements: "/history/jiangshan/settlements.json", license: "GPL-3.0-only", commit: COMMIT };
  outputs.set(`${ROOT}/settlements.json`, json(settlements));
  outputs.set(CATALOG, `// Generated by scripts/history/jiangshan-map.mjs. Adapted data GPL-3.0-only.\n// Attribution, source subset and license: public/history/sources/jiangshan/SOURCES.md\nexport const jiangshanSource = ${JSON.stringify(source)};\nexport const jiangshanPeriods = ${JSON.stringify(periods)};\nexport const jiangshanSettlements = ${JSON.stringify(settlements)};\n`);
  const manifest = { commit: COMMIT, upstreamHashes: HASHES, subsetHash: sha(json(subset)),
    license: "GPL-3.0-only", licenseFile: "../sources/jiangshan/license/LICENSE",
    sourceFiles: { atlas: `https://raw.githubusercontent.com/DeanChensj/jiangshan-map/${COMMIT}/js/atlas_snapshots.js`,
      geography: `https://raw.githubusercontent.com/DeanChensj/jiangshan-map/${COMMIT}/js/china_geo_data.js` },
    excluded: ["CHGIS/Hartwell prefectures", "DataV modern provinces", "post-1948 snapshots"],
    counts: { periods: periods.length, phases: periods.reduce((n, p) => n + p.phases.length, 0),
      snapshots: outputs.size - 4, settlements: settlements.length, features: data.f.length, rings: data.r.length, hydro: hydro.length },
    files: [...outputs].map(([file, content]) => ({ path: file, sha256: sha(content), bytes: Buffer.byteLength(content) })) };
  outputs.set(`${ROOT}/manifest.json`, JSON.stringify(manifest, null, 2) + "\n");
  return outputs;
}
function main() {
  const args = process.argv.slice(2);
  const value = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : null;
  const raw = fs.readFileSync("public/history/sources/jiangshan/map-data/source.js.txt", "utf8");
  if (sha(raw) !== HASHES.settlements) throw new Error("Settlement source checksum mismatch");
  const dynasties = parseUpstreamData(raw, "DYNASTY_DATA");
  const atlas = value("--atlas"), geography = value("--geography");
  if (Boolean(atlas) !== Boolean(geography)) throw new Error("Both --atlas and --geography are required");
  const subset = atlas ? extractSubset(fs.readFileSync(atlas, "utf8"), fs.readFileSync(geography, "utf8"), dynasties)
    : JSON.parse(fs.readFileSync(SUBSET, "utf8"));
  const outputs = buildMapOutputs(subset, dynasties);
  outputs.set(SUBSET, json(subset));
  for (const [file, content] of outputs) {
    if (args.includes("--write")) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
    else if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content) throw new Error(`Stale output: ${file}`);
  }
  console.log(`${args.includes("--write") ? "Generated" : "Verified"} ${outputs.size} Jiangshan map files`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
