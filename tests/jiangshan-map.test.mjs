import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { decodeRing, closedRing, permittedSubset, staticConstant, buildPeriods, buildMapOutputs } from "../scripts/history/jiangshan-map.mjs";
import { parseUpstreamData } from "../scripts/history/jiangshan.mjs";
import { selectJiangshanPhase, settlementsAt, describeJiangshanPlace, visibleAt } from "../.vitepress/vault/jiangshan-map.mjs";
import { jiangshanPeriods, jiangshanSettlements } from "../.vitepress/vault/jiangshan-catalog.mjs";

test("static extraction and VLQ decoding do not execute upstream code", () => {
  assert.deepEqual(staticConstant('(function(){const D={"r":[]}; throw new Error("never executed")})();', "D"), { r: [] });
  assert.throws(() => staticConstant('(function(){const D=(()=>{throw 1})()})();', "D"));
  assert.deepEqual(decodeRing("AACC"), [[0, 0], [0.01, 0.01]]);
  assert.throws(() => decodeRing("g"), /Truncated/);
  assert.throws(() => decodeRing("?A"), /character/);
  const outer = closedRing([[0, 0], [0, 1], [1, 0]], true);
  assert.deepEqual(outer[0], outer.at(-1));
  const area = r => r.slice(0, -1).reduce((n, p, i) => n + p[0] * r[i + 1][1] - r[i + 1][0] * p[1], 0);
  assert.ok(area(outer) > 0);
  assert.ok(area(closedRing(outer, false)) < 0);
  assert.throws(() => closedRing([[0, 0], [0, 0], [1, 1]], true));
});

test("safe topology subset resolves regions and drops every restricted feature", () => {
  const feature = title => ({ title, shape: { _p: [0] } });
  const raw = { r: ["AACC"], f: [feature("context"), feature("region"), feature("polity"), feature("restricted")],
    d: { neighbors: [0], old: { regions: [1] }, shown: { regionRef: "old", polities: [2], prefectures: [3] }, s_prc: { polities: [3] } } };
  const subset = permittedSubset(raw, [{ phases: [{ id: "shown" }] }]);
  assert.deepEqual(subset.f.map(f => f.title), ["context", "polity", "region"]);
  assert.deepEqual(Object.keys(subset.d), ["neighbors", "shown"]);
  assert.ok(!JSON.stringify(subset).includes("prefectures"));
  raw.d.old = { regionRef: "shown" };
  assert.throws(() => permittedSubset(raw, [{ phases: [{ id: "shown" }] }]), /Cyclic/);
});

test("phase coverage assigns transition years to the later phase and stops at 1948", () => {
  assert.equal(selectJiangshanPhase(-404), null);
  assert.equal(selectJiangshanPhase(-403).dynasty, "zhanguo");
  assert.equal(selectJiangshanPhase(-221).dynasty, "qin");
  assert.equal(selectJiangshanPhase(618).dynasty, "tang");
  assert.equal(selectJiangshanPhase(1948).dynasty, "roc");
  assert.equal(selectJiangshanPhase(1949), null);
  assert.equal(selectJiangshanPhase(0), null);
  assert.equal(selectJiangshanPhase(650.1), null);
  for (const period of jiangshanPeriods) for (const phase of period.phases) {
    assert.equal(selectJiangshanPhase(phase.from).id, phase.id);
    assert.equal(selectJiangshanPhase(phase.to).id, phase.id);
    assert.ok(phase.from !== 0 && phase.to !== 0);
  }
  const periods = buildPeriods([{ key: "x", title: "X", fromYear: -2, toYear: 2,
    phases: [{ snap: "s_a", until: 1 }, { snap: "s_b", until: 2 }] }]);
  assert.equal(periods[0].phases[0].to, -1);
});

test("settlements respect lifetimes, changing names and disjoint capital periods", () => {
  const fixture = [{ dynasty: "x", from: 600, to: 900, ancient: "长安", modern: "西安", coord: [108.941, 34.341],
    appear: 610, vanish: 880, isCapital: true, capitalPeriods: [[618, 689], [705, 800]], eraNames: [{ from: 700, until: 750, zh: "京城" }] }];
  assert.equal(settlementsAt(609, fixture).length, 0);
  assert.equal(settlementsAt(880, fixture).length, 0);
  assert.equal(settlementsAt(690, fixture)[0].isCapital, false);
  assert.equal(settlementsAt(705, fixture)[0].isCapital, true);
  assert.equal(settlementsAt(700, fixture)[0].ancient, "京城");
  assert.equal(settlementsAt(750, fixture)[0].ancient, "长安");
  assert.equal(visibleAt({ appear: 11, vanish: 1048 }, 1048), false);
});

test("place matching uses only upstream coordinates and current snapshot polygons", () => {
  const item = { title: "长安", key: "changan", location: { kind: "point", variants: [{ name: "隋唐长安城", coordinates: [1, 2] }] } };
  const found = describeJiangshanPlace(item, 641);
  assert.deepEqual(found.variant.coordinates, [108.941, 34.341]);
  assert.equal(describeJiangshanPlace(item, 1949).variant, null);
  assert.equal(describeJiangshanPlace({ ...item, title: "从未收录的城" }, 641).variant, null);
  const cities = [{ dynasty: "tang", from: 618, to: 907, ancient: "同名", modern: "甲", coord: [100, 30] },
    { dynasty: "tang", from: 618, to: 907, ancient: "同名", modern: "乙", coord: [110, 30] }];
  const ambiguous = describeJiangshanPlace({ title: "同名", location: { kind: "point" } }, 641, [], undefined, cities);
  assert.equal(ambiguous.variant, null);
  assert.equal(ambiguous.candidates.length, 2);
  assert.deepEqual(describeJiangshanPlace({ title: "同名", location: { kind: "point" } }, 641, [], ambiguous.candidates[1].id, cities).variant.coordinates, [110, 30]);
  const polygon = { type: "Feature", properties: { title: "吐蕃", layer: "polity" }, geometry: { type: "Polygon", coordinates: [] } };
  const region = { title: "吐蕃", location: { kind: "region", variants: [{ geometry: "/geo/old.geojson" }] } };
  assert.equal(describeJiangshanPlace(region, 641, [polygon]).variant.feature, polygon);
  assert.equal(describeJiangshanPlace(region, 641).variant, null);
});

test("published files are deterministic, checked, and contain no restricted layers", () => {
  const subset = JSON.parse(fs.readFileSync("public/history/jiangshan/source-subset.json", "utf8"));
  const dynasties = parseUpstreamData(fs.readFileSync("public/history/sources/jiangshan/map-data/source.js.txt", "utf8"), "DYNASTY_DATA");
  const outputs = buildMapOutputs(subset, dynasties);
  for (const [file, content] of outputs) assert.equal(fs.readFileSync(file, "utf8"), content, file);
  const manifest = JSON.parse(outputs.get("public/history/jiangshan/manifest.json"));
  for (const file of manifest.files) assert.equal(createHash("sha256").update(fs.readFileSync(file.path)).digest("hex"), file.sha256);
  assert.equal(manifest.counts.snapshots, 204);
  assert.equal(jiangshanSettlements.length, 1406);
  for (const [name, content] of outputs) if (name.endsWith(".geojson")) {
    const data = JSON.parse(content);
    assert.ok(data.features.every(f => f.properties.layer !== "prefecture"));
    assert.ok(!name.includes("s_prc"));
  }
  const component = fs.readFileSync(".vitepress/theme/components/vault/VaultNoteMap.vue", "utf8");
  assert.ok(!/landMap|selectHistoricalMap|initialMapYear|describePlace\(/.test(component));
});
