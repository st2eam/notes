<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, ref, watch } from "vue";
import { useRouter, withBase } from "vitepress";
import { data as vault } from "../../../vault/vault.data";
import { createHistorySearchIndex, eventTime, filterHistoryEvents, historyYearRange } from "../../../vault/history.mjs";
import { embedHref } from "../../../vault/embed.mjs";
import { useEmbedMode } from "../../composables/useEmbedMode";
import type { VaultNote } from "../../../vault/types";
import HistoryReferences from "./HistoryReferences.vue";
const VaultNoteMap = defineAsyncComponent(() => import("../vault/VaultNoteMap.vue"));
const props = defineProps<{ scope: "中国史" | "世界史" }>();
const router = useRouter();
const { isEmbedded } = useEmbedMode();
const group = ref("");
const search = ref("");
const direction = ref("asc");
const start = ref("");
const end = ref("");
const selectedId = ref("");
const mapPanel = ref<HTMLElement>();
let mapTrigger: HTMLElement | undefined;
const allNotes = vault.notes as VaultNote[];
watch(() => props.scope, () => { reset(); selectedId.value = ""; });
const notes = computed(() => allNotes.filter(n => n.historyId && n.id.startsWith(`历史/${props.scope}/`)));
const searchIndex = computed(() => createHistorySearchIndex(notes.value, allNotes));
const groups = computed(() => {
  const keys = [...new Set(notes.value.map(n => n.historyGroup || ""))];
  return keys.sort((a, b) => props.scope === "中国史"
    ? Math.min(...notes.value.filter(n => n.historyGroup === a).map(n => n.historyOrder!)) - Math.min(...notes.value.filter(n => n.historyGroup === b).map(n => n.historyOrder!))
    : a.localeCompare(b, "zh-CN"));
});
const filtered = computed(() => filterHistoryEvents(notes.value, {
  group: group.value, search: search.value, start: start.value, end: end.value,
  descending: direction.value === "desc",
}, searchIndex.value) as VaultNote[]);
const invalidRange = computed(() => !historyYearRange(start.value, end.value).valid);
const unknownTimes = computed(() => notes.value.filter(note => !eventTime(note)).length);
const selected = computed(() => filtered.value.find(note => note.id === selectedId.value));
watch(filtered, () => { if (!selected.value) selectedId.value = ""; });
function reset() { group.value = ""; search.value = ""; start.value = ""; end.value = ""; }
async function showMap(note: VaultNote, event: MouseEvent) {
  mapTrigger = event.currentTarget as HTMLElement;
  selectedId.value = note.id;
  await nextTick();
  mapPanel.value?.focus({ preventScroll: true });
  mapPanel.value?.scrollIntoView({ block: "start" });
}
async function closeMap() {
  selectedId.value = "";
  await nextTick();
  if (mapTrigger?.isConnected) mapTrigger.focus();
}
function openPlace(note: VaultNote, event: MouseEvent) {
  const href = withBase(isEmbedded.value ? embedHref(note.route, window.location.search) : note.route);
  if (event.metaKey || event.ctrlKey || event.shiftKey) window.open(href, "_blank", "noopener");
  else void router.go(href);
}
</script>
<template>
  <section class="history-browser" :aria-label="`${scope}事件时间线`">
    <div class="history-intro"><span class="history-kicker">历史 · 时间索引</span><p>沿时间阅读，在{{ scope === '中国史' ? '朝代' : '国家与地区' }}之间探索。</p></div>
    <div class="history-toolbar">
      <label class="history-search"><span>查找事件</span><input v-model="search" type="search" placeholder="事件、地点或年代" /></label>
      <label><span>{{ scope === '中国史' ? '朝代与时期' : '国家与地区' }}</span><select v-model="group"><option value="">全部{{ scope === '中国史' ? '朝代' : '地区' }}</option><option v-for="g in groups" :key="g" :value="g">{{ g.replaceAll('/', ' / ') }}</option></select></label>
      <label><span>时间顺序</span><select v-model="direction"><option value="asc">从古至今 ↑</option><option value="desc">从今至古 ↓</option></select></label>
    </div>
    <div class="history-dates"><span>年份范围</span><input v-model="start" type="number" step="1" aria-label="起始年份" placeholder="起始年份" /><span aria-hidden="true">—</span><input v-model="end" type="number" step="1" aria-label="结束年份" placeholder="结束年份" /><small>公元前年份用负数，如 -221；无零年</small><button v-if="group || search || start || end" @click="reset">清除筛选</button></div>
    <div class="history-result" aria-live="polite"><span>{{ filtered.length }} 个事件<span v-if="filtered.length !== notes.length"> / 共 {{ notes.length }} 个</span></span><span>{{ group ? group.replaceAll('/', ' / ') : '完整时间线' }}</span></div>
    <p v-if="unknownTimes" class="history-footnote">{{ unknownTimes }} 个事件年代未确定，有年份筛选时不计入结果。</p>
    <p v-if="invalidRange" class="history-empty">请输入非零整数年份，且起始年份不晚于结束年份。</p>
    <p v-else-if="!filtered.length" class="history-empty">没有符合条件的事件。试试其他关键词或年份。</p>
    <section v-if="selected" ref="mapPanel" class="history-map-panel" tabindex="-1" :aria-label="selected.title + '的事件地图'" @keydown.esc.stop.prevent="closeMap">
      <div class="history-map-heading"><div><span>事件地图</span><h3>{{ selected.title }}</h3><a :href="withBase(selected.route)">阅读事件笔记 ↗</a></div><button type="button" class="history-map-close" aria-label="关闭事件地图" @click="closeMap">关闭</button></div>
      <ClientOnly><VaultNoteMap :note="selected" :notes="allNotes" :enabled="true" @open="openPlace" /></ClientOnly>
      <HistoryReferences :history-id="selected.historyId" />
      <p v-if="!selected.geoReferences?.length && !selected.geo?.place && !eventTime(selected)" class="history-footnote">此事件暂无可定位的年代或地点资料，仍可阅读原笔记。</p>
    </section>
    <ol v-if="!invalidRange && filtered.length" class="history-events">
      <li v-for="note in filtered" :key="note.id" :class="{ 'history-selected': selectedId === note.id }">
        <div class="history-event-row">
          <a :href="withBase(note.route)" class="history-event">
            <time>{{ note.historyDate }}</time>
            <div><span class="history-event-group">{{ note.historyGroup?.replaceAll('/', ' / ') }}</span><strong>{{ note.title }}</strong></div>
            <span class="history-arrow" aria-hidden="true">↗</span>
          </a>
          <button type="button" class="history-show-map" :aria-label="'查看' + note.title + '的地图'" :aria-pressed="selectedId === note.id" @click="showMap(note, $event)">查看地图</button>
        </div>
      </li>
    </ol>
    <p class="history-footnote">事件按起始日期排列，保留有依据的月日细化排序；年份筛选按年代区间相交。“约”、世纪及“年起”保留原意，结束年代未详的条目不推定终止年。</p>
  </section>
</template>
<style scoped>
.history-browser { --history-accent: #9b4c2c; color: var(--vp-c-text-1); }
.history-kicker { font-size: 11px; letter-spacing: .12em; color: var(--history-accent); }
.history-intro p { margin: 8px 0 28px; color: var(--vp-c-text-2); font-family: "Songti SC", "Noto Serif CJK SC", serif; font-size: 20px; }
.history-toolbar { display: grid; grid-template-columns: minmax(160px, 1.4fr) 1fr 150px; gap: 16px; padding: 20px 0; border-top: 1px solid var(--vp-c-divider); }
.history-toolbar label { display: flex; flex-direction: column; gap: 8px; }
.history-toolbar label > span, .history-dates > span:first-child { font-size: 11px; color: var(--vp-c-text-2); }
.history-browser input, .history-browser select { border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 9px 12px; font-size: 13px; width: 100%; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.history-browser select { appearance: auto; }
.history-browser input:focus-visible, .history-browser select:focus-visible, .history-event:focus-visible, .history-show-map:focus-visible, .history-map-close:focus-visible { outline: 2px solid var(--history-accent); outline-offset: 3px; }
.history-dates { display: flex; align-items: center; flex-wrap: wrap; gap: 9px; padding-bottom: 20px; }
.history-dates input { width: 112px; }
.history-dates small { color: var(--vp-c-text-3); font-size: 11px; }
.history-dates button { color: var(--history-accent); font-size: 12px; margin-left: auto; text-decoration: underline; text-underline-offset: 3px; }
.history-result { display: flex; justify-content: space-between; gap: 12px; color: var(--vp-c-text-2); font-size: 11px; padding: 12px 0; border-top: 1px solid var(--vp-c-divider); }
.history-events { list-style: none !important; margin: 0 !important; padding: 0 !important; }
.history-events li { margin: 0 !important; border-top: 1px solid var(--vp-c-divider); }
.history-event-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 16px; }
.history-selected { background: var(--vp-c-bg-soft); }
.history-event { display: grid; grid-template-columns: 165px minmax(0, 1fr) 18px; gap: 24px; align-items: center; padding: 19px 0; color: inherit !important; text-decoration: none !important; transition: color .15s, background .15s; }
.history-event:hover { background: var(--vp-c-bg-soft); }
.history-event time { color: var(--history-accent); font-size: 12px; font-variant-numeric: tabular-nums; line-height: 1.6; }
.history-event-group { display: block; color: var(--vp-c-text-3); font-size: 10px; margin-bottom: 4px; }
.history-event strong { display: block; font-family: "Songti SC", "Noto Serif CJK SC", serif; font-weight: 600; font-size: 18px; line-height: 1.5; }
.history-arrow { color: var(--vp-c-text-3); font-size: 16px; }
.history-event:hover strong, .history-event:hover .history-arrow { color: var(--history-accent); }
.history-show-map, .history-map-close { padding: 8px 10px; border: 1px solid var(--vp-c-divider); border-radius: 4px; font-size: 12px; white-space: nowrap; min-height: 36px; }
.history-show-map:hover, .history-map-close:hover { background: var(--vp-c-bg-soft); }
.history-map-panel { margin: 12px 0 24px; border: 1px solid var(--vp-c-divider); padding: 20px; border-radius: 6px; scroll-margin: 20px; }
.history-map-panel:focus-visible { outline: 2px solid var(--history-accent); outline-offset: 3px; }
.history-map-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.history-map-heading span, .history-map-heading a { font-size: 12px; color: var(--vp-c-text-2); }
.history-map-heading h3 { margin: 6px 0; padding: 0; border: 0; font-size: 20px; }
.history-map-panel :deep(.note-map-frame) { height: 340px; }
.history-empty { padding: 40px 0; color: var(--vp-c-text-2); }
.history-footnote { margin-top: 24px; font-size: 11px; color: var(--vp-c-text-3); }
@media (max-width: 640px) { .history-toolbar { grid-template-columns: 1fr 1fr; gap: 12px; } .history-search { grid-column: 1 / -1; } .history-event { grid-template-columns: 82px minmax(0, 1fr); gap: 10px; } .history-arrow { display: none; } .history-event-row { gap: 8px; } .history-event strong { font-size: 16px; } .history-show-map { padding: 8px 6px; font-size: 11px; } .history-dates small { flex-basis: 100%; } .history-map-panel { padding: 12px; } .history-map-panel :deep(.note-map-frame) { height: 280px; } }
</style>
