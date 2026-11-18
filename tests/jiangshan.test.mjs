import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { parseUpstreamData, adaptReferences, buildReferences } from "../scripts/history/jiangshan.mjs";
import { historyReferences, referenceSource } from "../.vitepress/vault/history-references.mjs";
import { readVault } from "../.vitepress/vault/build.mjs";
import { mapPlaces } from "../.vitepress/vault/geo.mjs";
import { sourceCoordinates } from "../scripts/history/source-coordinates.mjs";

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

test("event points attributed to Jiangshan exist exactly in its fixed coordinate source", () => {
  const source = parseUpstreamData(fs.readFileSync("public/history/sources/jiangshan/map-data/source.js.txt", "utf8"), "DYNASTY_DATA");
  const allowed = sourceCoordinates(source);
  const url = `https://github.com/DeanChensj/jiangshan-map/blob/${referenceSource.commit}/js/map_data.js`;
  assert.ok(allowed.size > 500);
  assert.ok(allowed.has(JSON.stringify([112.451, 34.621])));
  assert.ok(!allowed.has(JSON.stringify([116.391, 39.911])), "A near-city coordinate is not a source record");
  for (const note of readVault(process.cwd()).notes) {
    for (const variant of note.geo?.place?.variants || []) {
      if (variant.coordinates && (variant.source?.url === url || variant.source?.url?.startsWith(url + "#"))) {
        assert.ok(allowed.has(JSON.stringify(variant.coordinates)), `${note.id}: ${variant.id}`);
      }
    }
  }
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
  const mapping = [{ historyId: "b", title: "称帝", upstreamKey: "qin:-221", reason: "上游合写称帝，本地单列此行动" }];
  assert.deepEqual(adaptReferences(dynasties, {}, notes, mapping).references.b.books, []);
  assert.throws(() => adaptReferences(dynasties, {}, notes, [{ ...mapping[0], reason: "" }]), /missing/);
  const duplicate = [{ ...dynasties[0], milestones: [...dynasties[0].milestones, { year: -221, headline: "同年另一件事" }] }];
  assert.throws(() => adaptReferences(duplicate, { "qin:-221": [["史记", ["卷6"]]] }, notes, mapping), /Ambiguous/);
});

test("every Chinese history event has a resolved occurrence distinct from contextual references", () => {
  const vault = readVault(process.cwd());
  const chinese = vault.notes.filter(note => note.id.startsWith("历史/中国史/"));
  const events = chinese.filter(note => note.historyId);
  assert.ok(chinese.filter(note => note.id.includes("/事件/") && !note.id.endsWith("/index.md"))
    .every(note => note.historyId), "Each event note must participate in the timeline");
  assert.ok(events.length >= 526);
  for (const event of events) {
    const occurrences = mapPlaces(event, vault.notes).filter(place => place.role === "occurrence");
    assert.ok(occurrences.length, event.id);
    assert.ok(occurrences.every(place => place.note || place.catalog), event.id);
    assert.ok(event.geo.locationNote, event.id);
  }
});

test("multi-milestone events retain scopes, deduplicate books and require documented date differences", () => {
  const dynasties = [{ key: "han", title: "汉", milestones: [
    { year: 1, headline: "开始" }, { year: 2, headline: "后续" }, { year: 3, headline: "另一纪年" },
  ] }];
  const notes = [{ id: "过程.md", historyId: "process", title: "过程", geo: { time: { from: 1, to: 2 } } }];
  const mappings = [1, 2].map(year => ({ historyId: "process", title: "过程", upstreamKey: `han:${year}`,
    reason: "正文记述此行动", scope: year === 1 ? "开始" : "后续" }));
  const citations = { "han:1": [["史记", ["卷1"]]], "han:2": [["史记", ["卷1", "卷2"]]] };
  const result = adaptReferences(dynasties, citations, notes, mappings).references.process;
  assert.equal(result.matches.length, 2);
  assert.deepEqual(result.books, [{ title: "史记", volumes: ["卷1", "卷2"] }]);
  assert.throws(() => adaptReferences(dynasties, citations, notes, [...mappings, mappings[0]]), /Inconsistent/);
  const differentDate = { historyId: "process", title: "过程", upstreamKey: "han:3", reason: "对应同一行动" };
  assert.throws(() => adaptReferences(dynasties, {}, notes, [differentDate]), /Inconsistent/);
  assert.equal(adaptReferences(dynasties, {}, notes, [{ ...differentDate,
    difference: "上游使用另一纪年，保留本地范围并明确标注差异" }]).references.process.matches[0].year, 3);
});

test("fixed-source outputs reproduce exactly and carry content matches rather than coordinate verification", () => {
  const built = buildReferences();
  const digest = text => createHash("sha256").update(text).digest("hex");
  assert.equal(digest(built.module), digest(fs.readFileSync(".vitepress/vault/history-references.mjs", "utf8")), "Regenerate history references");
  assert.equal(digest(built.report), digest(fs.readFileSync(".vitepress/reports/jiangshan-audit.json", "utf8")), "Regenerate the alignment audit");
  const report = JSON.parse(built.report);
  assert.equal(report.periods, 18);
  assert.equal(report.milestones, 526);
  assert.equal(report.referencedSnapshots, 204); // IDs referenced by phases, not an atlas geometry count.
  assert.equal(report.reviewedMappings, Object.keys(historyReferences).length);
  assert.equal(report.coveredMilestones, 526);
  assert.ok(report.events.every(event => event.status === "reviewed-content-match" && event.mapped.length));
  assert.equal(report.localChineseEvents, 310 + report.addedEventIds.length);
  assert.equal(new Set(report.addedEventIds).size, report.addedEventIds.length);
  assert.ok(report.withoutReferences > 0);
  assert.deepEqual(report.localMetadataIssues, []);
  assert.equal(referenceSource.commit, "897b9ad4e987fcface8728ffdfbe33e801a3dbae");
  assert.equal(referenceSource.license, "GPL-3.0-only");
  assert.deepEqual(historyReferences["event-361"].books.map(book => book.title), ["资治通鉴", "旧唐书"]);
  assert.equal(historyReferences["event-163"].status, "upstream-reference");
  assert.equal(historyReferences["event-163"].coordinates, undefined);
  assert.ok(historyReferences["event-162"].matches.some(match => match.upstreamKey === "qin:-221"));
});
