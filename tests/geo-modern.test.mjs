import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { selectHistoricalMap, initialMapYear } from "../.vitepress/vault/geo.mjs";
import { modernMaps } from "../.vitepress/vault/geo-modern-catalog.mjs";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

test("modern reference maps preserve data year or edition independently of event year", () => {
  const china = { id: "历史/中国史/中华人民共和国/index.md" };
  assert.equal(initialMapYear(china, []), 2019);
  assert.equal(selectHistoricalMap(china, 1950).dataYear, 2019);
  assert.equal(selectHistoricalMap(china, 2026).modern, true);
  assert.equal(selectHistoricalMap(china, 1948).modern, undefined);
  const world = { id: "历史/世界史/现代事件.md", historyDate: "1991 年" };
  assert.equal(initialMapYear(world, []), 1991);
  const reference = selectHistoricalMap(world, 1991);
  assert.equal(reference.edition, "5.1.1");
  assert.equal(reference.year, undefined);
  assert.equal(selectHistoricalMap(world, 1948), null);
});

test("modern province and country outputs retain source geometries with unique accessible names", () => {
  const originals = ["geoBoundaries-CHN-ADM1.geojson", "ne_110m_admin_0_countries.geojson"];
  for (let i = 0; i < modernMaps.length; i++) {
    const entry = modernMaps[i];
    const data = read("public" + entry.geometry);
    const original = read("public/geo/sources/modern/" + originals[i]);
    assert.equal(data.features.length, i === 0 ? 34 : 177);
    assert.equal(new Set(data.features.map((f) => f.id)).size, data.features.length);
    for (let j = 0; j < data.features.length; j++) {
      const f = data.features[j];
      assert.ok(f.properties.displayName);
      assert.deepEqual(f.geometry, original.features[j].geometry);
      for (const [key, value] of Object.entries(original.features[j].properties))
        assert.deepEqual(f.properties[key], value);
    }
  }
  const china = read("public/geo/v1/modern-china-2019.geojson");
  assert.equal(china.dataYear, 2019);
  assert.equal(china.features.find((f) => f.properties.shapeName === "Guangzhou Province").properties.displayName, "广东省");
  assert.equal(new Set(china.features.map((f) => f.properties.displayName)).size, 34);
});
