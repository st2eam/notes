import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseHistoryTime } from "../.vitepress/vault/history-time.mjs";
import { auditHistoryMetadata, createHistorySearchIndex, filterHistoryEvents, historyDateOrder, historyYearRange } from "../.vitepress/vault/history.mjs";
import { readVault } from "../.vitepress/vault/build.mjs";
import { noteGeoTime, parseGeoTime } from "../.vitepress/vault/geo.mjs";

const years = (label) => { const time = parseHistoryTime(label); return time && [time.from, time.to]; };
test("centuries advance forward in BCE and keep approximate intervals rather than invented exact dates", () => {
  assert.deepEqual(years("约前18世纪"), [-1800, -1701]);
  assert.deepEqual(years("公元前1世纪"), [-100, -1]);
  assert.deepEqual(years("14世纪"), [1301, 1400]);
  assert.equal(parseHistoryTime("14世纪").approximate, true);
  for (const era of ["前", ""]) {
    assert.ok(historyDateOrder(`${era}18世纪初`) < historyDateOrder(`${era}18世纪中叶`));
    assert.ok(historyDateOrder(`${era}18世纪中叶`) < historyDateOrder(`${era}18世纪末`));
  }
  assert.deepEqual(parseGeoTime("约前18世纪"), { from: -1800, to: -1701 });
  assert.deepEqual(noteGeoTime({ historyDate: "约前18世纪" }), { from: -1800, to: -1701, approximate: true });
});

test("the same grammar handles abbreviated ranges, month/day endpoints and decades", () => {
  for (const [label, expected] of [
    ["前230年—前221年", [-230, -221]], ["前230年—221年", [-230, -221]],
    ["前1年—公元1年", [-1, 1]], ["208—209年", [208, 209]],
    ["1935年1月15日至17日", [1935, 1935]], ["1938年3月—4月", [1938, 1938]],
    ["1940年8月—1941年1月", [1940, 1941]], ["1760年代—1770年代", [1760, 1779]],
    ["前180年代", [-189, -180]], ["约前1042年前后", [-1042, -1042]],
  ]) assert.deepEqual(years(label), expected, label);
  assert.equal(historyDateOrder("1935年1月15日至17日"), 19350115);
  for (const label of ["0年", "0世纪", "907年—618年", "2001年4月—3月", "2000年13月", "2000年2月30日", "2000年1月0日", "未知", "2000年随意文本"])
    assert.equal(parseHistoryTime(label), null, label);
});

test("year filtering uses interval overlap, inclusive boundaries and explicit unknown dates", () => {
  const notes = [
    { id: "war", title: "战争", historyDate: "755年—763年" },
    { id: "exact", title: "当年", historyDate: "760年" },
    { id: "unknown", title: "年代待考" },
    { id: "open", title: "改革", historyDate: "1921年起" },
  ];
  assert.deepEqual(filterHistoryEvents(notes, { start: "760", end: "760" }).map(n => n.id), ["war", "exact"]);
  assert.deepEqual(filterHistoryEvents(notes, { start: "763", end: "763" }).map(n => n.id), ["war"]);
  assert.deepEqual(filterHistoryEvents(notes, { start: "1922", end: "1922" }).map(n => n.id), ["open"]);
  assert.equal(filterHistoryEvents(notes).length, 4);
  assert.equal(filterHistoryEvents(notes, { start: "0" }).length, 0);
  assert.equal(historyYearRange("800", "700").valid, false);
  assert.equal(historyYearRange("1.5", "").valid, false);
  assert.equal(historyYearRange("", "").valid, true);
});

test("location searches include direct place aliases and modern names but never unrelated places", () => {
  const place = { id: "洛阳.md", title: "洛阳", aliases: ["东都"], geo: { place: {
    id: "luoyang", kind: "point", modernName: "河南洛阳", variants: [{ id: "tang", name: "隋唐洛阳" }],
  } } };
  const event = { id: "event.md", title: "迁都", historyDate: "684年", historyGroup: "唐", excerpt: "短摘要",
    geoReferences: [{ target: place.id, reference: "洛阳" }] };
  const unrelated = { id: "other.md", title: "另一事件", historyDate: "684年" };
  const notes = [event, unrelated];
  const index = createHistorySearchIndex(notes, [...notes, place]);
  for (const search of ["东都", "河南洛阳", "隋唐洛阳", "迁都 东都"])
    assert.deepEqual(filterHistoryEvents(notes, { search }, index).map(n => n.id), [event.id]);
  assert.equal(filterHistoryEvents(notes, { search: "东都", group: "秦" }, index).length, 0);
  assert.equal(filterHistoryEvents(notes, { search: "   " }, index).length, 2);
});

test("all real event metadata is consistent and manual month refinement is retained", () => {
  const { notes } = readVault(process.cwd());
  assert.deepEqual(auditHistoryMetadata(notes), []);
  const alignment = JSON.parse(fs.readFileSync(".vitepress/reports/jiangshan-audit.json", "utf8"));
  assert.equal(notes.filter(n => n.historyId).length, 484 + alignment.addedEventIds.length);
  const event = notes.find(n => n.historyId === "event-394");
  assert.deepEqual(years(event.historyDate), [-1800, -1701]);
  assert.equal(event.historyOrder, -18000000);
  assert.equal(auditHistoryMetadata([{ historyId: "a", id: "a", historyDate: "2015年", historyOrder: 20151100 }]).length, 0);
  assert.equal(auditHistoryMetadata([{ historyId: "a", id: "a", historyDate: "2015年", historyOrder: 20140000 }]).length, 1);
  assert.equal(auditHistoryMetadata([{ historyId: "a", id: "a", historyDate: "2015年" }, { historyId: "a", id: "b", historyDate: "2016年" }]).length, 1);
});
