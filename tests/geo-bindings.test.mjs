import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readVault, scanFiles } from "../.vitepress/vault/build.mjs";
import { geographicPlaces } from "../.vitepress/vault/geo-places.mjs";
import { normalizeGeo, resolveGeoReferences, mapPlaces, describePlace, noteGeoTime } from "../.vitepress/vault/geo.mjs";
import { createBinder, locationFields, replaceGeo, bindNotes } from "../scripts/geo/bind-notes.mjs";
import { createPlaceCatalog } from "../scripts/geo/build-place-catalog.mjs";
import { loadCityIndex } from "../scripts/geo/gazetteer/query.mjs";

const root = path.resolve(import.meta.dirname, "..");
const vault = readVault(root);
const get = (title) => {
  const note = vault.notes.find((n) => n.title === title);
  assert.ok(note, title); return note;
};
const titles = (title) => mapPlaces(get(title), vault.notes).map((p) => p.title);

test("every explicit location field is bound and every place identity resolves", () => {
  let locationNotes = 0;
  for (const file of scanFiles(root)) {
    const { content } = matter(fs.readFileSync(file, "utf8"));
    if (!locationFields(content).length) continue;
    locationNotes++;
    const id = path.relative(root, file).split(path.sep).join("/");
    const note = vault.notes.find((n) => n.id === id);
    assert.ok(note.geo.locationNote, id);
    assert.ok(note.geo.places.length, id);
    assert.ok(mapPlaces(note, vault.notes).length, id);
  }
  assert.ok(locationNotes >= 484);
  for (const note of vault.notes) {
    if (note.tags.includes("地点")) assert.ok(note.geo?.place, note.id);
    for (const ref of note.geoReferences || []) {
      assert.ok(ref.target || ref.place, `${note.id}: unresolved ${ref.reference}`);
      if (ref.target) assert.ok(vault.notes.some((n) => n.id === ref.target && n.geo?.place), note.id);
      if (ref.place) assert.ok(geographicPlaces.some((p) => p.id === ref.place), note.id);
    }
  }
});

test("catalog-only places preserve aliases, have independent keys and deduplicate note identities", () => {
  const event = { id: "事件.md", title: "事件", tags: [], aliases: [], headings: [], geo: { places: [
    { place: "city-beijing", name: "大都" }, { place: "city-paris" },
  ] } };
  event.geoReferences = resolveGeoReferences([event], event, []);
  const places = mapPlaces(event, [event]);
  assert.equal(places.length, 2);
  assert.notEqual(places[0].key, places[1].key);
  assert.match(describePlace(places[0], 1272).label, /^大都（今中国北京）$/);
  assert.equal(describePlace(places[1], 1789).missing, "");
  assert.ok(places.every((p) => !p.note && p.catalog));
  const paris = geographicPlaces.find((p) => p.id === "city-paris");
  const page = { id: "巴黎.md", title: "巴黎", tags: [], aliases: [], headings: [], geo: { place: paris.location } };
  event.geo.places.push({ target: page.id });
  event.geoReferences = resolveGeoReferences([event, page], event, []);
  const deduplicated = mapPlaces(event, [event, page]);
  assert.equal(deduplicated.length, 2);
  assert.equal(deduplicated.find((p) => p.key === "city-paris").note.id, page.id);
  assert.throws(() => normalizeGeo({ places: [{ place: "city-paris", target: "巴黎.md" }] }), /places/);
  assert.throws(() => normalizeGeo({ bindingStatus: "guess" }), /bindingStatus/);
});

test("historical homonyms resolve to their documented cities and regions remain regions", () => {
  assert.deepEqual(titles("武昌起义"), ["武汉"]);
  assert.ok(titles("孙权称帝").includes("武昌"));
  assert.ok(!titles("孙权称帝").includes("武汉"));
  const song = titles("宋高宗即位");
  assert.ok(song.includes("南京应天府")); assert.ok(!song.includes("南京"));
  const dingxiang = get("定襄").geo.place;
  assert.match(dingxiang.modernName, /和林格尔/);
  assert.equal(dingxiang.variants.length, 0);
  assert.match(get("临安").geo.place.modernName, /杭州/);
  assert.match(get("武昌").geo.place.modernName, /鄂州/);
  assert.equal(get("汉中").geo.place.kind, "region");
  assert.equal(get("江东").geo.place.kind, "region");
  assert.equal(get("荆州").geo.place.kind, "region");
});

test("negated places and unspecified creation cities never become occurrence markers", () => {
  assert.deepEqual(titles("九品中正制确立"), ["曹氏魏国与曹魏相关州郡"]);
  assert.deepEqual(titles("诸葛瑾致书刘备"), ["白帝城"]);
  assert.deepEqual(titles("吕布殒命白门楼"), ["下邳"]);
  assert.ok(!titles("东兴之战").includes("合肥"));
  assert.ok(!titles("石亭之战").includes("合肥"));
  assert.ok(!titles("曹魏灭燕").includes("襄阳"));
  assert.equal(get("九品中正制确立").geo.bindingStatus, "uncertain");
  assert.equal(get("诸葛瑾致书刘备").geo.bindingStatus, "uncertain");
  const item = mapPlaces(get("九品中正制确立"), vault.notes)[0];
  assert.equal(describePlace(item, 220).missing, "区域范围待补");
});

test("biography matches ignore titles, code, negation and non-geographic substrings", () => {
  assert.deepEqual(new Set(titles("贝多芬")), new Set(["波恩", "维也纳"]));
  assert.ok(!titles("陆逊").includes("北京"), "大都督 is not Yuan's 大都");
  assert.ok(titles("陆逊").includes("武昌"));
  assert.ok(!titles("诸葛亮").includes("江西"), "溯江西进 is a river journey");
  assert.ok(!titles("诸葛瑾").includes("成都"));
  assert.deepEqual(titles("万隆会议"), ["万隆"]);
  const binder = createBinder(vault.notes);
  assert.deepEqual(binder.match("乔治·华盛顿担任美国总统", { id: "人物.md" }, { explicit: false }).map((r) => r.place || r.target), ["历史/世界史/美洲/美国/index.md"]);
  assert.deepEqual(locationFields("```md\n地点：巴黎\n```\n\n- 地点：伦敦。\n"), ["伦敦。"]);
  assert.deepEqual(locationFields("[地点文档](https://example.org/地点：巴黎)"), []);
});

test("all catalog geometry validates and city coordinates have traceable source IDs", () => {
  assert.deepEqual(createPlaceCatalog(), geographicPlaces);
  const ids = new Set();
  const index = loadCityIndex();
  for (const record of geographicPlaces) {
    assert.ok(!ids.has(record.id), record.id); ids.add(record.id);
    normalizeGeo({ place: record.location }, record.id);
    for (const variant of record.location.variants) {
      const id = variant.source.url.match(/^https:\/\/www\.geonames\.org\/(\d+)\/$/)?.[1];
      assert.ok(id, record.id);
      const city = index.get(id);
      assert.ok(city, record.id);
      assert.deepEqual(variant.coordinates, [city.lon, city.lat]);
    }
  }
  assert.equal(geographicPlaces.find((p) => p.id === "city-shouxian").location.variants.length, 0, "Do not use Shandong's Shouxian for Anhui's Shouchun");
});

test("migration preserves body, unrelated YAML and explicit historical overrides and is stable", async () => {
  const raw = "---\r\ntitle: '地点示例'\r\nrelations: []\r\ngeo:\r\n  scope: china\r\ncustom: keep\r\n---\r\n# 地点示例\r\n\r\n正文\r\n";
  const changed = replaceGeo(raw, { places: [{ place: "city-paris" }] });
  const { geo: before, ...otherBefore } = matter(raw).data;
  const { geo: after, ...otherAfter } = matter(changed).data;
  assert.deepEqual(otherBefore, otherAfter);
  assert.equal(matter(raw).content, matter(changed).content);
  assert.ok(changed.includes("title: '地点示例'\r\nrelations: []"));
  const event = get("唐迁都洛阳");
  assert.ok(event.geo.places.some((r) => r.target === "历史/中国史/地点/洛阳.md" && r.variant === "sui-tang"));
  const report = await bindNotes();
  assert.equal(report.changed, 0);
  assert.equal(report.explicitFields, report.explicitBound);
});
