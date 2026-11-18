import test from "node:test";
import assert from "node:assert/strict";
import { historyMapContext, historyMapNeighbors, historyMapPlace } from "../.vitepress/vault/history-map.mjs";
import { jiangshanPeriods } from "../.vitepress/vault/jiangshan-catalog.mjs";
import { jiangshanSource } from "../.vitepress/vault/jiangshan-map.mjs";

const china = { id: "历史/中国史/index.md" };
const world = { id: "历史/世界史/index.md" };
test("dragging years selects their historical phases and leaves uncovered years explicit", () => {
  assert.equal(historyMapContext(china, -400, true).historical.period, "战国");
  assert.equal(historyMapContext(china, -221, true).historical.period, "秦");
  assert.equal(historyMapContext(china, 755, true).historical.period, "唐");
  assert.notEqual(historyMapContext(china, 650, true).historical.geometry, historyMapContext(china, 755, true).historical.geometry);
  assert.equal(historyMapContext(china, -5000, true).historical, null);
  assert.equal(historyMapContext(world, 755, true).historical, null);
  assert.equal(historyMapContext(china, 0, true).historical, null);
});
test("neighbor warming is bounded to adjacent phases and never invents out-of-coverage geometry", () => {
  const phases = jiangshanPeriods.flatMap(period => period.phases);
  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const paths = historyMapNeighbors(china, phase.from);
    assert.ok(paths.length <= 2);
    assert.ok(!paths.includes(phase.geometry));
    assert.deepEqual(paths, [phases[i - 1], phases[i + 1]].filter(Boolean).map(item => item.geometry));
  }
  for (const year of [-5000, 0, 1949, 2026]) assert.deepEqual(historyMapNeighbors(china, year), []);
  assert.deepEqual(historyMapNeighbors(world, 755), []);
});
test("modern reference is opt-in for the explorer and is never relabelled as historical territory", () => {
  assert.equal(historyMapContext(china, 2026).reference, null);
  assert.equal(historyMapContext(china, 2026).landPath, jiangshanSource.neighbors);
  const current = historyMapContext(china, 2026, true);
  assert.equal(current.historical, null);
  assert.equal(current.reference.modern, true);
  assert.match(current.reference.accuracy, /非历史疆域复原/);
  assert.equal(historyMapContext(world, 2026, true).reference.scope, "world");
  assert.equal(historyMapContext(china, 1948, true).reference, null);
  assert.equal(historyMapContext(china, 1949, true).reference.scope, "china");
});
test("explorer may locate sourced dated points without altering ordinary note-map provenance", () => {
  const location = { kind: "point", modernName: "地点参照", variants: [{ id: "dated", from: 750, to: 800,
    coordinates: [112.46, 34.63], source: { title: "已考证地点", url: "https://example.org/site" } }] };
  const item = { key: "site", title: "地点", location, note: { geo: { place: location } } };
  assert.equal(historyMapPlace(item, 760).variant, null);
  assert.deepEqual(historyMapPlace(item, 760, [], undefined, true).variant.coordinates, [112.46, 34.63]);
  assert.equal(historyMapPlace(item, 900, [], undefined, true).variant, null);
  const ambiguous = { ...item, location: { ...location, variants: [...location.variants, { ...location.variants[0], id: "other" }] } };
  assert.equal(historyMapPlace(ambiguous, 760, [], undefined, true).variant, null);
});
