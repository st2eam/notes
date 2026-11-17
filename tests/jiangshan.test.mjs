import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseUpstreamData, adaptReferences, buildReferences } from "../scripts/history/jiangshan.mjs";
import { historyReferences, referenceSource } from "../.vitepress/vault/history-references.mjs";

test("upstream data is read as static literals and executable constructs are rejected", () => {
  assert.deepEqual(parseUpstreamData('window.DYNASTY_DATA = [{key:"qin", year:-221, values:[true,null]}];', "DYNASTY_DATA"),
    [{ key: "qin", year: -221, values: [true, null] }]);
  for (const source of [
    'window.DYNASTY_DATA = runAnything();',
    'window.DYNASTY_DATA = [{get year(){throw 1}}];',
    'window.DYNASTY_DATA = [{...unknown}];',
    'globalThis.injected = true; window.DYNASTY_DATA = [];',
    'window.DYNASTY_DATA = [{__proto__:null}];',
  ]) assert.throws(() => parseUpstreamData(source, "DYNASTY_DATA"));
});

test("sharing a year only creates candidates and never confirms an event match", () => {
  const dynasties = [{ key: "qin", title: "秦", milestones: [{ year: -221, headline: "合并记述" }] }];
  const notes = [
    { historyId: "a", title: "统一", id: "a.md", historyGroup: "秦", historyDate: "前221年" },
    { historyId: "b", title: "称帝", id: "b.md", historyGroup: "秦", historyDate: "前221年" },
  ];
  const result = adaptReferences(dynasties, {}, notes, []);
  assert.deepEqual(result.references, {});
  assert.deepEqual(result.report.events[0].candidates, ["a", "b"]);
  assert.equal(result.report.events[0].status, "candidate-only");
  assert.equal(result.report.events[0].hasReferences, false);
  const mapping = [{ historyId: "b", title: "称帝", upstreamKey: "qin:-221" }];
  assert.throws(() => adaptReferences(dynasties, {}, notes, mapping), /missing/);
  const duplicate = [{ ...dynasties[0], milestones: [...dynasties[0].milestones, { year: -221, headline: "同年另一件事" }] }];
  assert.throws(() => adaptReferences(duplicate, { "qin:-221": [["史记", ["卷6"]]] }, notes, mapping), /Ambiguous/);
});

test("fixed-source outputs reproduce exactly and carry content matches rather than coordinate verification", () => {
  const built = buildReferences();
  assert.equal(built.module, fs.readFileSync(".vitepress/vault/history-references.mjs", "utf8"));
  assert.equal(built.report, fs.readFileSync(".vitepress/reports/jiangshan-audit.json", "utf8"));
  const report = JSON.parse(built.report);
  assert.equal(report.periods, 18);
  assert.equal(report.milestones, 526);
  assert.equal(report.referencedSnapshots, 204); // IDs referenced by phases, not an atlas geometry count.
  assert.equal(report.reviewedMappings, 2);
  assert.ok(report.withoutReferences > 0);
  assert.deepEqual(report.localMetadataIssues, []);
  assert.equal(referenceSource.commit, "897b9ad4e987fcface8728ffdfbe33e801a3dbae");
  assert.equal(referenceSource.license, "GPL-3.0-only");
  assert.deepEqual(historyReferences["event-361"].books.map(book => book.title), ["资治通鉴", "旧唐书"]);
  assert.equal(historyReferences["event-163"].status, "upstream-reference");
  assert.equal(historyReferences["event-163"].coordinates, undefined);
  assert.equal(historyReferences["event-162"], undefined);
});
