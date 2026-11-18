import test from "node:test";
import assert from "node:assert/strict";
import {
  clampHistoryYear, formatHistoryYear, historyEventsAtYear, historyIndexYear,
  historyExplorerDomain, historyTimelineDomain, historyTimelinePosition, historyTimelineStops,
  historyTimelineTicks, historyYearIndex,
} from "../.vitepress/vault/history-timeline.mjs";
import { eventTime, filterHistoryEvents } from "../.vitepress/vault/history.mjs";
import { readVault } from "../.vitepress/vault/build.mjs";

const notes = [
  { id: "bce", title: "古代事件", historyDate: "前221年", historyGroup: "古代" },
  { id: "boundary", title: "跨纪年", historyDate: "前1年—公元1年", historyGroup: "古代" },
  { id: "war", title: "跨年战争", historyDate: "755年—763年", historyGroup: "中世" },
  { id: "same-a", title: "同年甲", historyDate: "760年1月", historyGroup: "中世" },
  { id: "same-b", title: "同年乙", historyDate: "760年5月", historyGroup: "中世" },
  { id: "open", title: "持续事件", historyDate: "1921年起", historyGroup: "现代" },
  { id: "modern", title: "现代事件", historyDate: "2000年", historyGroup: "现代" },
  { id: "unknown", title: "年代未知" },
];

test("map explorer prioritizes 400 BCE through the present independently of search density", () => {
  const older = [{ title: "史前", historyDate: "约前5000年" }, ...notes];
  assert.deepEqual(historyExplorerDomain(older, false, 2026), { from: -400, to: 2026 });
  assert.deepEqual(historyExplorerDomain(older, true, 2026), { from: -5000, to: 2026 });
  assert.deepEqual(historyExplorerDomain([notes[2]], false, 2026), { from: -400, to: 2026 });
  assert.deepEqual(historyExplorerDomain([], true, 2026), { from: -400, to: 2026 });
});

test("slider coordinates cross directly from 1 BCE to 1 CE without year zero", () => {
  const years = [-221, -2, -1, 1, 2, 2000];
  for (const year of years) assert.equal(historyIndexYear(historyYearIndex(year)), year);
  assert.equal(historyIndexYear(historyYearIndex(-1) + 1), 1);
  assert.equal(historyIndexYear(historyYearIndex(1) - 1), -1);
  assert.equal(formatHistoryYear(-221), "公元前 221 年");
  assert.equal(formatHistoryYear(1), "公元 1 年");
  assert.deepEqual(historyTimelineTicks({ from: -1, to: 1 }), [-1, 1]);
});

test("timeline domain follows filters and retains explicit empty-year boundaries", () => {
  assert.deepEqual(historyTimelineDomain(notes), { from: -221, to: 2000 });
  assert.deepEqual(historyTimelineDomain(notes, "-300", "2020"), { from: -300, to: 2020 });
  const clipped = filterHistoryEvents(notes, { start: "761", end: "762" });
  assert.deepEqual(clipped.map(note => note.id), ["war"]);
  assert.deepEqual(historyTimelineDomain(clipped, "761", "762"), { from: 761, to: 762 });
  const open = filterHistoryEvents(notes, { start: "2020" });
  assert.deepEqual(historyTimelineDomain(open, "2020"), { from: 2020, to: 2020 });
  assert.equal(historyTimelineDomain([]), null);
  assert.equal(historyTimelineDomain([notes.at(-1)]), null);
  assert.equal(historyTimelineDomain(notes, "0"), null);
  assert.equal(historyTimelineDomain(notes, "100", "99"), null);
});

test("year lookup includes all simultaneous and spanning events without nearest-year substitution", () => {
  assert.deepEqual(historyEventsAtYear(notes, 760).map(note => note.id), ["war", "same-a", "same-b"]);
  assert.deepEqual(historyEventsAtYear(notes, 763).map(note => note.id), ["war"]);
  assert.deepEqual(historyEventsAtYear(notes, 764), []);
  assert.deepEqual(historyEventsAtYear(notes, -1).map(note => note.id), ["boundary"]);
  assert.deepEqual(historyEventsAtYear(notes, 1).map(note => note.id), ["boundary"]);
  assert.deepEqual(historyEventsAtYear(notes, 0), []);
  assert.deepEqual(historyEventsAtYear(notes, 2001).map(note => note.id), ["open"]);
});

test("event positions, year stops and ticks remain bounded for single-year and reversed lists", () => {
  const domain = { from: -1, to: 2 };
  assert.equal(historyTimelinePosition(-1, domain), 0);
  assert.equal(historyTimelinePosition(1, domain), 50);
  assert.equal(historyTimelinePosition(2, domain), 100);
  assert.equal(historyTimelinePosition(100, domain), 100);
  assert.equal(historyTimelinePosition(760, { from: 760, to: 760 }), 0);
  assert.equal(clampHistoryYear(755, { from: 760, to: 763 }), 760);
  assert.deepEqual(historyTimelineTicks({ from: 760, to: 760 }), [760]);
  const forward = historyTimelineStops(notes, { from: -221, to: 2000 });
  assert.deepEqual(historyTimelineStops([...notes].reverse(), { from: -221, to: 2000 }), forward);
  assert.deepEqual(forward.find(stop => stop.year === 760), { year: 760, count: 2 });
  assert.deepEqual(historyTimelineStops([notes[2]], { from: 761, to: 762 }), [{ year: 761, count: 1 }]);
});

test("all dated events in both real history scopes can position and recover their year", () => {
  const { notes: vault } = readVault(process.cwd());
  for (const scope of ["中国史", "世界史"]) {
    const events = filterHistoryEvents(vault.filter(note => note.historyId && note.id.startsWith(`历史/${scope}/`)));
    const domain = historyTimelineDomain(events);
    const times = new Map(events.map(note => [note.id, eventTime(note)]));
    assert.ok(domain, scope);
    for (const stop of historyTimelineStops(events, domain)) {
      assert.equal(historyIndexYear(historyYearIndex(stop.year)), stop.year);
      assert.ok(historyTimelinePosition(stop.year, domain) >= 0);
      assert.ok(historyTimelinePosition(stop.year, domain) <= 100);
      const matching = historyEventsAtYear(events, stop.year);
      assert.ok(matching.length > 0, `${scope}: ${stop.year}`);
      assert.deepEqual(historyEventsAtYear(events, stop.year, note => times.get(note.id)), matching,
        `cached date lookup must retain every simultaneous and spanning event: ${scope} ${stop.year}`);
    }
  }
});
