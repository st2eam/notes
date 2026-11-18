<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRouter, withBase } from "vitepress";
import { data as vault } from "../../../vault/vault.data";
import { createHistorySearchIndex, eventTime, filterHistoryEvents, historyYearRange } from "../../../vault/history.mjs";
import { validHistoryYear } from "../../../vault/history-time.mjs";
import { clampHistoryYear, formatHistoryYear, historyEventsAtYear, historyExplorerDomain, historyIndexYear, historyTimelinePosition, historyTimelineStops, historyTimelineTicks, historyYearIndex } from "../../../vault/history-timeline.mjs";
import { selectJiangshanPhase } from "../../../vault/jiangshan-map.mjs";
import { embedHref } from "../../../vault/embed.mjs";
import { useEmbedMode } from "../../composables/useEmbedMode";
import type { VaultNote } from "../../../vault/types";
import type { MapViewState } from "../../composables/useMapWorkspace";
const VaultNoteMap = defineAsyncComponent(() => import("../vault/VaultNoteMap.vue"));
const props = defineProps<{ scope: "中国史" | "世界史" }>();
const router = useRouter();
const { isEmbedded } = useEmbedMode();
const allNotes = vault.notes as VaultNote[];
const group = ref("");
const search = ref("");
const direction = ref("asc");
const filtersOpen = ref(false);
const start = ref("");
const end = ref("");
const fullRange = ref(false);
const cursorYear = ref(-400);
const yearDraft = ref("-400");
const yearError = ref("");
const activeId = ref("");
const mapFocusRequest = ref(0);
const mapFocusYear = ref(-400);
const eventList = ref<HTMLElement>();
const mapSettings = ref({ showRegions: true, showSettlements: true, variants: {} as Record<string, string> });
let scrollFrame = 0;
const notes = computed(() => allNotes.filter(note => note.historyId && note.id.startsWith(`历史/${props.scope}/`)));
const overview = computed(() => allNotes.find(note => note.id === `历史/${props.scope}/index.md`)!);
const eventTimes = computed(() => new Map(notes.value.map(note => [note.id, eventTime(note)])));
const cachedTime = (note: VaultNote) => eventTimes.value.get(note.id);
const searchIndex = computed(() => createHistorySearchIndex(notes.value, allNotes));
const groups = computed(() => [...new Set(notes.value.map(note => note.historyGroup || ""))].sort((a, b) => props.scope === "中国史"
  ? Math.min(...notes.value.filter(note => note.historyGroup === a).map(note => note.historyOrder!)) - Math.min(...notes.value.filter(note => note.historyGroup === b).map(note => note.historyOrder!))
  : a.localeCompare(b, "zh-CN")));
const filtered = computed(() => filterHistoryEvents(notes.value, { group: group.value, search: search.value,
  start: start.value, end: end.value, descending: direction.value === "desc" }, searchIndex.value) as VaultNote[]);
const invalidRange = computed(() => !historyYearRange(start.value, end.value).valid);
const domain = computed(() => {
  const preset = historyExplorerDomain(notes.value, fullRange.value);
  const range = historyYearRange(start.value, end.value);
  if (!range.valid) return preset;
  const from = range.from ?? Math.min(preset.from, range.to ?? preset.from);
  return { from, to: range.to ?? Math.max(preset.to, from) };
});
const stops = computed(() => historyTimelineStops(filtered.value.filter(note => {
  const time = eventTime(note);
  return time && time.from >= domain.value.from && time.from <= domain.value.to;
}), domain.value));
const ticks = computed(() => historyTimelineTicks(domain.value));
const matching = computed(() => historyEventsAtYear(filtered.value, cursorYear.value, cachedTime) as VaultNote[]);
const matchingIds = computed(() => new Set(matching.value.map(note => note.id)));
const active = computed(() => filtered.value.find(note => note.id === activeId.value));
const mapNote = computed(() => active.value || overview.value);
const mapView = computed<MapViewState>(() => ({ year: cursorYear.value, ...mapSettings.value }));
const phase = computed(() => props.scope === "中国史" ? selectJiangshanPhase(cursorYear.value) : null);
const previousYear = computed(() => [...stops.value].reverse().find(stop => stop.year < cursorYear.value)?.year);
const nextYear = computed(() => stops.value.find(stop => stop.year > cursorYear.value)?.year);
const position = computed(() => historyTimelinePosition(cursorYear.value, domain.value));
const noteHref = (note: VaultNote) => withBase(isEmbedded.value && typeof window !== "undefined"
  ? embedHref(note.route, window.location.search) : note.route);

watch(() => props.scope, () => {
  reset(); fullRange.value = false; cursorYear.value = -400; activeId.value = "";
});
watch([filtered, domain], () => setYear(clampHistoryYear(cursorYear.value, domain.value)), { immediate: true });
function reset() { group.value = ""; search.value = ""; start.value = ""; end.value = ""; }
function scrollToEvent(id: string) {
  if (typeof window === "undefined") return;
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    const list = eventList.value;
    const row = list && Array.from(list.querySelectorAll<HTMLElement>("[data-event-id]"))
      .find(element => element.dataset.eventId === id);
    if (!list || !row) return;
    list.scrollTo({ top: Math.max(0, row.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop - 8), behavior: "auto" });
  });
}
function setYear(year: number) {
  if (!validHistoryYear(year)) return;
  cursorYear.value = clampHistoryYear(year, domain.value);
  yearDraft.value = String(cursorYear.value);
  yearError.value = "";
  if (!matchingIds.value.has(activeId.value)) activeId.value = matching.value[0]?.id || "";
  const nearest = stops.value.reduce<{ year: number; count: number } | undefined>((best, stop) => !best ||
    Math.abs(historyYearIndex(stop.year) - historyYearIndex(cursorYear.value)) < Math.abs(historyYearIndex(best.year) - historyYearIndex(cursorYear.value)) ? stop : best, undefined);
  const target = activeId.value || (nearest && filtered.value.find(note => cachedTime(note)?.from === nearest.year)?.id);
  if (target) void nextTick(() => scrollToEvent(target));
}
function moveCursor(event: Event) {
  setYear(historyIndexYear(Number((event.target as HTMLInputElement).value)));
}
function jumpToYear() {
  const year = Number(yearDraft.value);
  if (!validHistoryYear(year)) { yearError.value = "请输入非零整数年份；公元前年份用负数。"; return; }
  if (year < domain.value.from || year > domain.value.to) {
    yearError.value = `当前范围为 ${domain.value.from} 至 ${domain.value.to} 年；可切换全部年代或调整范围。`;
    return;
  }
  setYear(year);
}
function selectEvent(note: VaultNote) {
  mapFocusRequest.value++;
  const time = cachedTime(note);
  if (time && time.from < domain.value.from && !start.value) fullRange.value = true;
  activeId.value = note.id;
  if (time) setYear(time.from);
  mapFocusYear.value = cursorYear.value;
  activeId.value = note.id;
}
function updateMapView(view: MapViewState) {
  mapSettings.value = { showRegions: view.showRegions, showSettlements: view.showSettlements, variants: view.variants };
  if (view.year != null && view.year !== cursorYear.value) setYear(view.year);
}
function openPlace(note: VaultNote, event: MouseEvent) {
  const href = noteHref(note);
  if (event.metaKey || event.ctrlKey || event.shiftKey) window.open(href, "_blank", "noopener");
  else void router.go(href);
}
onBeforeUnmount(() => { if (scrollFrame) cancelAnimationFrame(scrollFrame); });
</script>

<template>
  <section class="history-browser" :aria-label="`${scope}地图时间轴`">
    <header class="history-header">
      <h1>{{ scope }}地图</h1>
      <label class="history-search"><span class="history-sr-only">查找事件</span><input v-model="search" type="search" placeholder="搜索事件、地点或年代" /></label>
      <button type="button" :aria-expanded="filtersOpen" :aria-controls="'history-filters-' + scope" @click="filtersOpen = !filtersOpen">{{ filtersOpen ? '收起筛选' : '筛选' }}</button>
    </header>
    <div v-if="filtersOpen" :id="'history-filters-' + scope" class="history-toolbar">
      <label><span>{{ scope === '中国史' ? '朝代与时期' : '国家与地区' }}</span><select v-model="group"><option value="">全部</option><option v-for="g in groups" :key="g" :value="g">{{ g.replaceAll('/', ' / ') }}</option></select></label>
      <label><span>排序</span><select v-model="direction"><option value="asc">从古至今</option><option value="desc">从今至古</option></select></label>
      <label><span>起始年份</span><input v-model="start" type="number" step="1" placeholder="如 -400" /></label>
      <label><span>结束年份</span><input v-model="end" type="number" step="1" placeholder="至今" /></label>
      <button type="button" @click="reset">清除筛选</button>
    </div>
    <div class="history-stage">
      <main class="history-map" aria-label="历史疆域与事件地图">
        <ClientOnly><VaultNoteMap :note="mapNote" :notes="allNotes" :enabled="true" expanded explorer :view="mapView" :focus-request="mapFocusRequest" :focus-year="mapFocusYear" @view-change="updateMapView" @open="openPlace" /><template #fallback><div class="history-map-placeholder">正在载入历史地图…</div></template></ClientOnly>
        <div class="history-map-era" aria-live="polite"><strong>{{ formatHistoryYear(cursorYear) }}</strong><span>{{ phase ? phase.period + ' · ' + phase.title : cursorYear >= 1949 ? '现代地理参照 · 非当年疆域复原' : '地理参照 · 该年代暂无疆域资料' }}</span></div>
      </main>
      <aside class="history-event-rail" aria-label="年代事件侧栏">
        <div class="history-rail-heading"><strong>年代事件</strong><span>{{ filtered.length }} 条</span></div>
        <div class="history-year-context" role="status" aria-live="polite"><span>{{ formatHistoryYear(cursorYear) }}</span><strong>{{ matching.length ? matching.length + ' 个相关事件' : '该年暂无已收录事件' }}</strong><p v-if="!matching.length">列表已定位至邻近年代，点击事件可在地图查看。</p></div>
        <p v-if="invalidRange" class="history-empty" role="alert">请输入非零整数年份，且起始年份不晚于结束年份。</p>
        <p v-else-if="!filtered.length" class="history-empty">没有符合条件的事件，请调整筛选。</p>
        <div v-else ref="eventList" class="history-event-scroll" tabindex="0" role="region" aria-label="历史事件列表，可滚动浏览">
          <ol class="history-events"><li v-for="note in filtered" :key="note.id" v-memo="[note, activeId === note.id, matchingIds.has(note.id)]" :data-event-id="note.id" :class="{ 'history-selected': activeId === note.id, 'history-in-year': matchingIds.has(note.id) }">
            <button type="button" class="history-event" :aria-pressed="activeId === note.id" @click="selectEvent(note)"><time>{{ note.historyDate || '年代未确定' }}</time><strong>{{ note.title }}</strong><span>{{ note.historyGroup?.replaceAll('/', ' / ') }}<span v-if="activeId === note.id"> · 已在地图选中</span><span v-else-if="matchingIds.has(note.id)"> · 涉及当前年份</span></span></button>
            <div v-if="activeId === note.id" class="history-event-detail"><p v-if="note.excerpt">{{ note.excerpt }}</p><a :href="noteHref(note)" :aria-label="'阅读' + note.title + '的笔记'">阅读事件笔记</a></div>
          </li></ol>
        </div>
      </aside>
    </div>
    <section class="history-navigator" aria-label="交互时间轴">
      <div class="history-time-controls">
        <output class="history-cursor-year" aria-live="off">{{ formatHistoryYear(cursorYear) }}</output>
        <div class="history-range-presets" aria-label="时间轴显示范围"><button type="button" :aria-pressed="!fullRange" @click="fullRange = false; start = ''; end = ''">前 400 年至今</button><button type="button" :aria-pressed="fullRange" @click="fullRange = true; start = ''; end = ''">全部年代</button></div>
        <form class="history-year-jump" novalidate @submit.prevent="jumpToYear"><input v-model="yearDraft" type="number" step="1" aria-label="定位年份" :aria-invalid="Boolean(yearError)" @input="yearError = ''" /><button type="submit">跳转</button></form>
        <div class="history-step"><button type="button" :disabled="previousYear == null" @click="previousYear != null && setYear(previousYear)">上一事件年</button><button type="button" :disabled="nextYear == null" @click="nextYear != null && setYear(nextYear)">下一事件年</button></div>
      </div>
      <p v-if="yearError" class="history-year-error" role="alert">{{ yearError }}</p>
      <div class="history-ruler"><div class="history-distribution" aria-hidden="true"><span v-for="stop in stops" :key="stop.year" v-memo="[stop, domain]" :style="{ left: historyTimelinePosition(stop.year, domain) + '%', height: Math.min(22, 4 + stop.count * 3) + 'px' }"></span><i :style="{ left: position + '%' }"></i></div><label><span class="history-sr-only">拖动指针选择年份</span><input class="history-slider" type="range" :min="historyYearIndex(domain.from)" :max="Math.max(historyYearIndex(domain.from) + 1, historyYearIndex(domain.to))" :value="historyYearIndex(cursorYear)" :disabled="domain.from === domain.to" step="1" :aria-valuetext="formatHistoryYear(cursorYear)" @input="moveCursor" /></label><div class="history-ticks" aria-hidden="true"><span v-for="(year, i) in ticks" :key="year" :class="{ 'history-tick-secondary': i % 2 === 1 }" :style="{ left: historyTimelinePosition(year, domain) + '%' }">{{ formatHistoryYear(year) }}</span></div></div>
      <p class="history-timeline-help">拖动年份切换疆域与事件。短线表示事件起始年份；疆域按已有阶段展示，非逐年复原。</p>
    </section>
  </section>
</template>

<style scoped>
.history-browser { --history-accent: #9b4c2c; --history-track: #777; --history-muted: #656565; display: grid; grid-template-rows: auto auto minmax(0, 1fr) auto; height: 100%; min-height: 0; color: var(--vp-c-text-1); background: var(--vp-c-bg); font-size: 13px; line-height: 1.5; }
:global(.dark .history-browser) { --history-accent: #c47e50; --history-track: #999; --history-muted: #ababab; }
:global(.vault-reading:has(.history-browser)) { overflow: hidden; }
:global(.vault-note-content:has(.history-browser)) { max-width: none; padding: 0; height: 100%; }
:global(.vault-note-content:has(.history-browser) > div) { height: 100%; }
:global(.vault-note-content div:has(.history-browser)) { height: 100%; }
:global(.vault-note-content div:has(> .history-browser) > :not(.history-browser)) { display: none; }
:global(.vault-shell:has(.history-browser) .vault-right), :global(.vault-shell:has(.history-browser) .vault-resizer[aria-label="调整辅助侧栏宽度"]) { display: none !important; }
.history-header { grid-row: 1; display: flex; align-items: center; gap: 12px; min-height: 58px; padding: 10px 20px; border-bottom: 1px solid var(--vp-c-divider); }
.history-browser .history-header h1 { margin: 0 auto 0 0; font-size: 18px; font-weight: 600; white-space: nowrap; }
.history-search { width: min(260px, 36%); }
.history-browser input, .history-browser select { min-width: 0; width: 100%; padding: 8px 10px; border: 1px solid var(--vp-c-divider); border-radius: 4px; color: var(--vp-c-text-1); background: var(--vp-c-bg); font-size: 12px; caret-color: var(--history-accent); }
.history-browser input::placeholder { color: var(--history-muted); }
.history-browser select { appearance: auto; }
.history-browser button { min-height: 36px; padding: 7px 10px; border: 1px solid var(--vp-c-divider); border-radius: 4px; font-size: 12px; }
.history-browser button:hover:not(:disabled) { background: var(--vp-c-bg-soft); }
.history-browser button:disabled { opacity: .5; cursor: default; }
.history-browser :is(input, button, select, a, [tabindex]):focus-visible { outline: 2px solid var(--history-accent); outline-offset: -2px; box-shadow: none; }
.history-browser ::selection { background: var(--history-accent); color: var(--vp-c-bg); }
.history-toolbar { grid-row: 2; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; padding: 12px 20px; border-bottom: 1px solid var(--vp-c-divider); }
.history-toolbar label { flex: 1; min-width: 100px; }
.history-toolbar label > span { display: block; margin-bottom: 5px; font-size: 11px; color: var(--history-muted); }
.history-stage { grid-row: 3; display: grid; grid-template-columns: minmax(0, 1fr) 300px; min-height: 0; }
.history-map { position: relative; min-height: 0; min-width: 0; overflow: hidden; contain: layout style paint; }
.history-map :deep(.note-map-section) { height: 100%; }
.history-map-era { position: absolute; top: 14px; left: 14px; z-index: 2; max-width: calc(100% - 185px); padding: 10px 12px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 4px; pointer-events: none; }
.history-map-era strong, .history-map-era span { display: block; }
.history-map-era strong { font-size: 17px; }
.history-map-era span { margin-top: 4px; font-size: 11px; color: var(--history-muted); }
.history-map-placeholder { display: grid; place-items: center; height: 100%; background: var(--vp-c-bg-soft); color: var(--history-muted); }
.history-event-rail { display: flex; flex-direction: column; min-height: 0; border-left: 1px solid var(--vp-c-divider); }
.history-rail-heading { display: flex; justify-content: space-between; padding: 15px 16px 12px; }
.history-rail-heading span { color: var(--history-muted); font-size: 11px; }
.history-year-context { padding: 0 16px 12px; border-bottom: 1px solid var(--vp-c-divider); }
.history-year-context > span { display: block; font-size: 12px; color: var(--history-muted); }
.history-year-context > strong { display: block; margin-top: 4px; font-size: 13px; font-weight: 500; }
.history-browser .history-year-context > p { margin: 6px 0 0; font-size: 11px; color: var(--history-muted); }
.history-event-scroll { flex: 1; min-height: 0; contain: layout style paint; overflow-y: auto; overscroll-behavior-y: contain; scrollbar-width: thin; scrollbar-color: var(--history-track) var(--vp-c-bg); }
.history-events { list-style: none !important; margin: 0 !important; padding: 0 !important; }
.history-events li { margin: 0 !important; border-bottom: 1px solid var(--vp-c-divider); }
.history-in-year { background: var(--vp-c-bg-soft); }
.history-selected { outline: 1px solid var(--history-accent); outline-offset: -1px; }
.history-browser .history-event { display: block; width: 100%; padding: 14px 16px; text-align: left; border: 0; border-radius: 0; }
.history-event time, .history-event > span { display: block; color: var(--history-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.history-event strong { display: block; margin: 5px 0 7px; font-family: "Songti SC", "Noto Serif CJK SC", serif; font-size: 17px; font-weight: 600; line-height: 1.5; overflow-wrap: anywhere; }
.history-event-detail { padding: 0 16px 14px; }
.history-browser .history-event-detail p { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; margin: 0 0 8px; font-size: 12px; color: var(--history-muted); }
.history-event-detail a { font-size: 12px; text-underline-offset: 3px; }
.history-empty { padding: 16px; color: var(--history-muted); }
.history-navigator { grid-row: 4; min-width: 0; padding: 12px 20px 10px; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.history-time-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 16px; }
.history-cursor-year { min-width: 145px; font-size: 20px; font-weight: 600; }
.history-range-presets, .history-year-jump, .history-step { display: flex; gap: 5px; }
.history-browser .history-range-presets button { border-color: transparent; }
.history-range-presets button[aria-pressed="true"] { background: var(--vp-c-bg-soft); text-decoration: underline; text-underline-offset: 4px; }
.history-year-jump { margin-left: auto; }
.history-year-jump input { width: 82px; }
.history-ruler { position: relative; margin: 10px 0 0; padding-top: 22px; }
.history-distribution { position: absolute; inset: 0 10px auto; height: 25px; pointer-events: none; }
.history-distribution > span { position: absolute; bottom: 0; width: 2px; transform: translateX(-50%); background: var(--history-track); opacity: .6; }
.history-distribution i { position: absolute; top: 0; width: 1px; height: 44px; background: var(--history-accent); }
.history-browser .history-slider { --slider-track-size: 2px; --slider-thumb-size: 20px; display: block; appearance: none; width: 100%; height: 44px; margin: 0; padding: 0; border: 0; border-radius: 0; background: transparent; cursor: ew-resize; box-shadow: none; }
.history-slider::-webkit-slider-runnable-track { height: var(--slider-track-size); background: var(--history-track); border: 0; }
.history-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: var(--slider-thumb-size); height: var(--slider-thumb-size); margin-top: calc((var(--slider-track-size) - var(--slider-thumb-size)) / 2); border: 3px solid var(--vp-c-bg); border-radius: 50%; background: var(--history-accent); box-shadow: 0 0 0 1px var(--history-accent); }
.history-slider::-moz-range-track { height: var(--slider-track-size); background: var(--history-track); border: 0; }
.history-slider::-moz-range-thumb { box-sizing: border-box; width: var(--slider-thumb-size); height: var(--slider-thumb-size); border: 3px solid var(--vp-c-bg); border-radius: 50%; background: var(--history-accent); box-shadow: 0 0 0 1px var(--history-accent); }
.history-ticks { position: relative; height: 20px; margin-inline: 10px; }
.history-ticks span { position: absolute; white-space: nowrap; transform: translateX(-50%); color: var(--history-muted); font-size: 10px; font-variant-numeric: tabular-nums; }
.history-ticks span:first-child { transform: none; }
.history-ticks span:last-child:not(:first-child) { transform: translateX(-100%); }
.history-browser .history-timeline-help { margin: 6px 0 0; font-size: 11px; color: var(--history-muted); }
.history-year-error { margin: 6px 0; font-size: 12px; }
.history-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
@media (max-width: 1100px) { .history-stage { grid-template-columns: minmax(0, 1fr) 260px; } .history-step { display: none; } }
@media (max-width: 640px) {
  .history-header { padding: 8px 12px; min-height: 48px; gap: 8px; }
  .history-browser .history-header h1 { font-size: 16px; }
  .history-search { width: 45%; }
  .history-stage { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(150px, 1.2fr) minmax(100px, 1fr); }
  .history-event-rail { border-left: 0; border-top: 1px solid var(--vp-c-divider); }
  .history-rail-heading { padding: 8px 12px; }
  .history-year-context { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; padding: 0 12px 8px; }
  .history-year-context > strong { margin: 0; font-size: 12px; }
  .history-browser .history-year-context > p { display: none; }
  .history-browser .history-event { padding: 10px 12px; }
  .history-event strong { font-size: 16px; }
  .history-map-era { top: 8px; left: 8px; padding: 7px 9px; max-width: calc(100% - 100px); }
  .history-map-era strong { font-size: 14px; }
  .history-map-era span { font-size: 10px; }
  .history-navigator { padding: 10px 12px 8px; }
  .history-time-controls { gap: 8px; }
  .history-cursor-year { min-width: 0; margin-right: auto; font-size: 17px; }
  .history-range-presets { order: 3; width: 100%; }
  .history-year-jump { margin-left: 0; }
  .history-browser .history-range-presets button { padding-block: 3px; min-height: 30px; }
  .history-ruler { margin-top: 6px; padding-top: 16px; }
  .history-distribution { height: 19px; }
  .history-distribution i { height: 38px; }
  .history-ticks .history-tick-secondary:not(:first-child):not(:last-child) { display: none; }
  .history-browser .history-timeline-help { display: none; }
  .history-toolbar { padding: 8px 12px; gap: 8px; max-height: 160px; overflow-y: auto; }
}
@media (forced-colors: active) {
  .history-slider::-webkit-slider-thumb { background: Highlight; border-color: Canvas; box-shadow: 0 0 0 1px CanvasText; }
  .history-slider::-moz-range-thumb { background: Highlight; border-color: Canvas; box-shadow: 0 0 0 1px CanvasText; }
  .history-slider::-webkit-slider-runnable-track { background: CanvasText; }
  .history-slider::-moz-range-track { background: CanvasText; }
  .history-selected { outline-color: Highlight; }
}
</style>
