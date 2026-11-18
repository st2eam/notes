import { eventTime, historyYearRange } from "./history.mjs";
import { overlapsHistoryTime, validHistoryYear } from "./history-time.mjs";

// A continuous slider coordinate: -1 (1 BCE) is immediately followed by 0 (1 CE).
export const historyYearIndex = (year) => year > 0 ? year - 1 : year;
export const historyIndexYear = (index) => index >= 0 ? index + 1 : index;
export const formatHistoryYear = (year) => `${year < 0 ? "公元前" : "公元"} ${Math.abs(year)} 年`;

export function historyTimelineDomain(notes, start = "", end = "") {
  const range = historyYearRange(start, end);
  if (!range.valid) return null;
  const times = notes.map(eventTime).filter(time => time && validHistoryYear(time.from) && validHistoryYear(time.to));
  if (!times.length) return null;
  const from = range.from ?? Math.min(...times.map(time => time.from));
  const to = range.to ?? Math.max(from, ...times.map(time => time.to));
  return from <= to ? { from, to } : null;
}

export function historyExplorerDomain(notes, fullRange = false, currentYear = new Date().getFullYear()) {
  const years = notes.map(note => eventTime(note)?.from).filter(validHistoryYear);
  return { from: fullRange ? Math.min(-400, ...years) : -400, to: currentYear };
}

export function clampHistoryYear(year, domain) {
  return Math.max(domain.from, Math.min(domain.to, year));
}

export function historyTimelinePosition(year, domain) {
  const from = historyYearIndex(domain.from), to = historyYearIndex(domain.to);
  return to === from ? 0 : (historyYearIndex(clampHistoryYear(year, domain)) - from) / (to - from) * 100;
}

export function historyEventsAtYear(notes, year, timeForNote = eventTime) {
  return validHistoryYear(year) ? notes.filter(note => overlapsHistoryTime(timeForNote(note), year, year)) : [];
}

export function historyTimelineStops(notes, domain) {
  if (!domain) return [];
  const counts = new Map();
  for (const note of notes) {
    const time = eventTime(note);
    if (!time || !validHistoryYear(time.from)) continue;
    const year = clampHistoryYear(time.from, domain);
    counts.set(year, (counts.get(year) || 0) + 1);
  }
  return [...counts].sort(([a], [b]) => a - b).map(([year, count]) => ({ year, count }));
}

export function historyTimelineTicks(domain, count = 5) {
  if (!domain) return [];
  const from = historyYearIndex(domain.from), to = historyYearIndex(domain.to);
  return [...new Set(Array.from({ length: count }, (_, i) =>
    historyIndexYear(Math.round(from + (to - from) * i / (count - 1)))))];
}
