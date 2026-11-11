import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildVault, parseNote, readVault } from "../.vitepress/vault/build.mjs";
import { normalizeGeo, parseGeoTime, noteGeoTime, resolveGeoReferences, mapPlaces,
  describePlace, selectPlaceVariant, selectHistoricalMap, mapYearOptions, initialMapYear } from "../.vitepress/vault/geo.mjs";
import { historicalMaps, landMap } from "../.vitepress/vault/geo-catalog.mjs";

const source = { title: "Fixture source", url: "https://example.org/history" };
const old = { id: "han", name: "汉魏洛阳", from: 25, to: 493, coordinates: [112.64, 34.72], source, accuracy: "约略城址" };
const later = { id: "tang", name: "隋唐洛阳", from: 605, to: 907, coordinates: [112.47, 34.66], source, accuracy: "约略城址" };
const point = { id: "luoyang", kind: "point", modernName: "河南洛阳一带", variants: [old, later] };
const note = (id, extra = {}) => ({ id, title: id.replace(/\.md$/, ""), route: "/" + id.replace(/\.md$/, ".html"),
  aliases: [], tags: [], headings: [], ...extra });

test("geography preserves historical fields without requiring an event ID and validates geometry", () => {
  const parsed = parseNote("城址.md", "---\nhistoryDate: 805 年\nhistoryGroup: 唐\nhistoryTrack: china\ngeo:\n  time: {from: 805, to: 810}\n---\n# 城址");
  assert.equal(parsed.note.historyDate, "805 年");
  assert.equal(parsed.note.historyTrack, "china");
  assert.deepEqual(parsed.note.geo.time, { from: 805, to: 810 });
  assert.throws(() => normalizeGeo({ place: { ...point, variants: [{ ...old, coordinates: [200, 34] }] } }), /geometry/);
  assert.throws(() => normalizeGeo({ time: { from: 0 } }), /time/);
  assert.throws(() => normalizeGeo({ place: { ...point, kind: "region", variants: [old] } }), /geometry/);
  assert.throws(() => normalizeGeo({ place: { ...point, variants: [{ ...old, geometry: "https://outside.test/file.geojson", coordinates: undefined }] } }), /geometry/);
});

test("original direct references survive semantic-edge merging; incoming edges never spread places", () => {
  const vault = buildVault([
    { id: "事件.md", raw: `---\nrelations:\n  - target: 城.md\n    type: similar\n    status: confirmed\n    reason: 同一地点\n    evidence: fixture\n---\n# 事件\n\n[[城]] [[城]]` },
    { id: "城.md", raw: "---\ntags: [地点]\n---\n# 城\n\n[[事件]] [[另一座城]]" },
    { id: "另一座城.md", raw: "---\ntags: [地点]\n---\n# 另一座城" },
    { id: "仅被引用.md", raw: "# 仅被引用" },
    { id: "间接.md", raw: "# 间接\n\n[[仅被引用]] [[另一座城]]" },
  ]);
  assert.equal(vault.links.find((l) => l.source === "事件.md" && l.target === "城.md").structured, true);
  const event = vault.notes.find((n) => n.id === "事件.md");
  assert.deepEqual(event.geoReferences.map((r) => r.target), ["城.md"]);
  assert.deepEqual(mapPlaces(event, vault.notes).map((p) => p.target), ["城.md"]);
  assert.deepEqual(mapPlaces(vault.notes.find((n) => n.id === "仅被引用.md"), vault.notes), []);
});

test("explicit references resolve aliases, preserve ambiguity and override a place variant", () => {
  const luoyang = note("历史/洛阳.md", { aliases: ["东都"], geo: { place: point } });
  const a = note("A/同名.md", { title: "同名", tags: ["地点"] });
  const b = note("B/同名.md", { title: "同名", tags: ["地点"] });
  const event = note("事件.md", { geo: { places: [
    { target: "东都", variant: "tang" }, { target: "同名" },
  ] } });
  const refs = resolveGeoReferences([event, luoyang, a, b], event, [{ reference: "东都", wiki: true }]);
  assert.equal(refs.length, 2);
  assert.equal(refs[0].target, luoyang.id);
  assert.equal(refs[0].variant, "tang");
  assert.equal(refs[1].target, null);
  event.geoReferences = refs;
  assert.equal(describePlace(mapPlaces(event, [luoyang])[1], 805).missing, "地点引用待确认");
});

test("time parser handles BCE ranges, exact dates and rejects invalid or ambiguous intervals", () => {
  assert.deepEqual(parseGeoTime("前 230 年—前 221 年"), { from: -230, to: -221 });
  assert.deepEqual(parseGeoTime("前230年—221年"), { from: -230, to: -221 });
  assert.deepEqual(parseGeoTime("前1年—公元1年"), { from: -1, to: 1 });
  assert.deepEqual(parseGeoTime("约 631 年—643 年"), { from: 631, to: 643 });
  assert.deepEqual(parseGeoTime("前200年1月1日"), { from: -200, to: -200 });
  assert.deepEqual(parseGeoTime("805 年 8 月"), { from: 805, to: 805 });
  assert.equal(parseGeoTime("0年"), null);
  assert.equal(parseGeoTime("907年—618年"), null);
  assert.equal(parseGeoTime("8世纪"), null);
  assert.equal(noteGeoTime(note("普通.md")), null);
});

test("historical city sites follow dates and unknown dates require a choice", () => {
  assert.equal(selectPlaceVariant(point, 238).id, "han");
  assert.equal(selectPlaceVariant(point, 805).id, "tang");
  assert.equal(selectPlaceVariant(point, null), null);
  assert.equal(selectPlaceVariant(point, null, "han").id, "han");
  assert.equal(selectPlaceVariant(point, 238, "tang"), null);
  assert.equal(selectPlaceVariant(point, 550), null);
  const partlyDated = { ...point, variants: [{ ...old, from: undefined, to: undefined }, later] };
  assert.equal(selectPlaceVariant(partlyDated, 805).id, "tang");
  assert.equal(selectPlaceVariant(partlyDated, null), null);
  const overlapping = { ...point, variants: [later, { ...later, id: "other" }] };
  assert.equal(selectPlaceVariant(overlapping, 805), null);
  const item = { target: "洛阳.md", note: note("洛阳.md", { geo: { place: point } }) };
  assert.equal(describePlace(item, 238).label, "汉魏洛阳（今河南洛阳一带）");
  assert.equal(describePlace(item, null).missing, "请选择历史形态");
  const region = { target: "荆州.md", note: note("荆州.md", { geo: { place: { id: "jingzhou", kind: "region", variants: [] } } }) };
  assert.equal(describePlace(region, 219).missing, "区域范围待补");
  assert.equal(describePlace(region, 219).variant, null);
});

test("snapshot selection stays in the same region and dynasty and reports the actual map year", () => {
  const tang = note("历史/中国史/唐/事件.md", { historyDate: "805 年", historyGroup: "唐", historyTrack: "china" });
  assert.equal(selectHistoricalMap(tang, 805).year, 800);
  assert.equal(selectHistoricalMap(tang, 800).year, 800);
  assert.equal(selectHistoricalMap(tang, 907).period, "唐");
  assert.equal(selectHistoricalMap(tang, 908).period, "五代十国");
  assert.equal(selectHistoricalMap(note("历史/中国史/三国/事件.md", { historyGroup: "三国" }), 238).year, 250);
  assert.equal(selectHistoricalMap(note("历史/世界史/事件.md", { historyTrack: "world" }), 805), null);
  assert.equal(selectHistoricalMap(tang, null), null);
  assert.deepEqual(noteGeoTime(note("历史/中国史/唐/人物.md")), { from: 618, to: 907, approximate: true });
  assert.equal(noteGeoTime(note("历史/世界史/人物.md", { historyPeriod: "postclassical" })), null);
  const spanning = note("历史/中国史/跨期.md", { geo: { time: { from: 800, to: 1000 } } });
  assert.ok(mapYearOptions(spanning, []).includes(907));
  assert.ok(mapYearOptions(spanning, []).includes(960));
});

test("shipped geometry and real note fixtures support points, polygons and honest missing-area states", () => {
  const root = path.resolve(import.meta.dirname, "..");
  for (const data of [landMap, ...historicalMaps]) {
    const file = path.join(root, "public", data.geometry);
    const geometry = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(geometry.type, "FeatureCollection");
    assert.ok(geometry.features.length > 0);
    assert.ok(geometry.features.every((f) => ["Polygon", "MultiPolygon"].includes(f.geometry.type)));
    assert.ok(fs.statSync(file).size < 5 * 1024 * 1024);
  }
  assert.ok(fs.existsSync(path.join(root, "public/geo/SOURCES.md")));
  const { notes } = readVault(root);
  const event = notes.find((n) => n.title === "曹魏灭燕");
  const items = mapPlaces(event, notes).map((p) => describePlace(p, 238));
  assert.ok(items.find((p) => p.name.includes("襄平") && p.variant?.coordinates));
  assert.ok(items.find((p) => p.note?.title === "洛阳" && p.variant?.id !== "tang" && p.variant?.coordinates));
  const tang = notes.find((n) => n.id === "历史/中国史/唐/index.md");
  const area = describePlace(mapPlaces(tang, notes).find((p) => p.target === tang.id), 800);
  assert.ok(area.variant.geometry);
  assert.equal(area.variant.snapshotYear, 800);
  const polygon = JSON.parse(fs.readFileSync(path.join(root, "public", area.variant.geometry), "utf8"));
  assert.ok(polygon.features.some((f) => f.geometry.type === "MultiPolygon"));
  const jingzhou = notes.find((n) => n.title === "荆州");
  assert.equal(describePlace({ target: jingzhou.id, note: jingzhou }, 219).missing, "区域范围待补");
});

test("dynasty overviews choose real snapshots while event years stay explicit", () => {
  const cases = [["商", -1200], ["西周", -900], ["东周", -600], ["秦", -210],
    ["汉", -200], ["三国", 250], ["两晋南北朝", 270], ["隋", 600],
    ["五代十国", 920], ["宋", 1060], ["元", 1300], ["明", 1400], ["清", 1700], ["中华民国", 1912]];
  for (const [period, year] of cases) {
    const n = note(`历史/中国史/${period}/index.md`);
    assert.equal(initialMapYear(n, []), year, period);
    assert.equal(selectHistoricalMap(n, year).year, year, period);
  }
  const event = note("历史/中国史/三国/事件.md", { historyDate: "238 年" });
  assert.equal(initialMapYear(event, []), 238);
  assert.equal(selectHistoricalMap(event, 238).year, 250);
  assert.equal(selectHistoricalMap(note("历史/中国史/夏/index.md"), -1800), null);
});

test("Han gaps and Three Kingdoms transitions do not retain abolished polities", () => {
  const han = note("历史/中国史/汉/index.md");
  assert.equal(selectHistoricalMap(han, -100).period, "西汉");
  assert.equal(selectHistoricalMap(han, 100).period, "东汉");
  for (const y of [9, 23, 24]) assert.equal(selectHistoricalMap(han, y), null);
  const kingdoms = note("历史/中国史/三国/index.md");
  const names = (year) => JSON.parse(fs.readFileSync(path.join("public", selectHistoricalMap(kingdoms, year).geometry), "utf8"))
    .features.map((f) => f.properties.displayName);
  assert.deepEqual(names(250), ["曹魏", "蜀汉", "孙吴"]);
  assert.deepEqual(names(264), ["曹魏", "孙吴"]);
  assert.deepEqual(names(270), ["西晋", "孙吴"]);
  assert.deepEqual(names(280), ["西晋"]);
});

test("transition years without a named dynasty still select an available phase", () => {
  const n = note("历史/中国史/跨期.md");
  for (const [year, expected] of [[420, "南北朝"], [589, "隋"], [618, "唐"],
    [1127, "南宋"], [1368, "明"], [1912, "中华民国"]])
    assert.equal(selectHistoricalMap(n, year)?.period, expected, String(year));
  const broad = note("历史/中国史/两晋南北朝/index.md");
  assert.equal(noteGeoTime(broad).to, 589);
  assert.equal(selectHistoricalMap(broad, 589)?.period, "隋");
  assert.equal(selectHistoricalMap(note("历史/中国史/三国/index.md"), 220)?.period, "东汉");
});

test("Cliopatria outputs preserve original geometry and source properties", () => {
  const subset = JSON.parse(fs.readFileSync("public/geo/sources/cliopatria/selected-original.geojson", "utf8"));
  const maps = historicalMaps.filter((m) => m.source.title.startsWith("Cliopatria"));
  assert.equal(maps.length, 33);
  const rejected = ["qin-221-bce", "qin-214-bce", "eastern-han-200", "three-kingdoms-230"];
  for (const id of rejected) {
    assert.ok(!maps.some((m) => m.id === id));
    assert.ok(!fs.existsSync(`public/geo/v1/${id}.geojson`));
  }
  assert.equal(selectHistoricalMap(note("历史/中国史/秦/统一.md"), -221).year, -210);
  assert.equal(selectHistoricalMap(note("历史/中国史/汉/汉末.md"), 200).year, 100);
  for (const entry of maps) {
    const data = JSON.parse(fs.readFileSync(path.join("public", entry.geometry), "utf8"));
    assert.equal(data.representativeYear, entry.year);
    assert.equal(data.sourceCommit, subset.sourceCommit);
    assert.equal(data.license, "CC-BY-4.0");
    if (entry.id === "eastern-jin-402") assert.ok(!data.features.some((f) => f.properties.Name === "Later Yan"));
    if (entry.id === "warring-states-300-bce") assert.ok(!data.features.some((f) => f.properties.Name === "Later Zhou"));
    for (const f of data.features) {
      const original = subset.features.find((o) => o.properties.Name === f.properties.Name &&
        o.properties.FromYear <= entry.year && o.properties.ToYear >= entry.year);
      assert.ok(original, `${entry.id}: original record`);
      assert.deepEqual(f.geometry, original.geometry);
      for (const [key, value] of Object.entries(original.properties)) assert.deepEqual(f.properties[key], value);
    }
  }
});
