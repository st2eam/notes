<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { withBase } from "vitepress";
import { data as vault } from "../../../vault/vault.data";
import { sortHistory } from "../../../vault/history.mjs";
import type { VaultNote } from "../../../vault/types";
const props = defineProps<{ scope: "中国史" | "世界史" }>();
const group = ref("");
const search = ref("");
const direction = ref("asc");
const start = ref("");
const end = ref("");
watch(() => props.scope, () => { group.value = ""; search.value = ""; start.value = ""; end.value = ""; });
const notes = computed(() => (vault.notes as VaultNote[]).filter(n => n.historyId && n.id.startsWith(`历史/${props.scope}/`)));
const groups = computed(() => {
  const keys = [...new Set(notes.value.map(n => n.historyGroup || ""))];
  return keys.sort((a, b) => props.scope === "中国史"
    ? Math.min(...notes.value.filter(n => n.historyGroup === a).map(n => n.historyOrder!)) - Math.min(...notes.value.filter(n => n.historyGroup === b).map(n => n.historyOrder!))
    : a.localeCompare(b, "zh-CN"));
});
const filtered = computed(() => sortHistory(notes.value.filter(n => {
  const year = Math.floor((n.historyOrder || 0) / 10000);
  return (!group.value || n.historyGroup === group.value) && (!search.value || `${n.title} ${n.historyDate} ${n.excerpt}`.toLowerCase().includes(search.value.trim().toLowerCase())) &&
    (start.value === "" || year >= Number(start.value)) && (end.value === "" || year <= Number(end.value));
}), direction.value === "desc") as VaultNote[]);
const invalidRange = computed(() => start.value !== "" && end.value !== "" && Number(start.value) > Number(end.value));
function reset() { group.value = ""; search.value = ""; start.value = ""; end.value = ""; }
</script>
<template>
  <section class="history-browser" :aria-label="`${scope}事件时间线`">
    <div class="history-intro"><span class="history-kicker">历史 · 时间索引</span><p>沿时间阅读，在{{ scope === '中国史' ? '朝代' : '国家与地区' }}之间探索。</p></div>
    <div class="history-toolbar">
      <label class="history-search"><span>查找事件</span><input v-model="search" type="search" placeholder="事件、地点或年代" /></label>
      <label><span>{{ scope === '中国史' ? '朝代与时期' : '国家与地区' }}</span><select v-model="group"><option value="">全部{{ scope === '中国史' ? '朝代' : '地区' }}</option><option v-for="g in groups" :key="g" :value="g">{{ g.replaceAll('/', ' / ') }}</option></select></label>
      <label><span>时间顺序</span><select v-model="direction"><option value="asc">从古至今 ↑</option><option value="desc">从今至古 ↓</option></select></label>
    </div>
    <div class="history-dates"><span>年份范围</span><input v-model="start" type="number" aria-label="起始年份" placeholder="起始年份" /><span aria-hidden="true">—</span><input v-model="end" type="number" aria-label="结束年份" placeholder="结束年份" /><small>公元前年份用负数，如 -221</small><button v-if="group || search || start || end" @click="reset">清除筛选</button></div>
    <div class="history-result" aria-live="polite"><span>{{ filtered.length }} 个事件<span v-if="filtered.length !== notes.length"> / 共 {{ notes.length }} 个</span></span><span>{{ group ? group.replaceAll('/', ' / ') : '完整时间线' }}</span></div>
    <p v-if="invalidRange" class="history-empty">起始年份应早于结束年份。</p>
    <p v-else-if="!filtered.length" class="history-empty">没有符合条件的事件。试试其他关键词或年份。</p>
    <ol v-else class="history-events">
      <li v-for="note in filtered" :key="note.id">
        <a :href="withBase(note.route)" class="history-event">
          <time>{{ note.historyDate }}</time>
          <div><span class="history-event-group">{{ note.historyGroup?.replaceAll('/', ' / ') }}</span><strong>{{ note.title }}</strong></div>
          <span class="history-arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    </ol>
    <p class="history-footnote">事件按起始日期排列；年代范围与“约”的标记保留原文，世纪按其大致起始时期排序。</p>
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
.history-browser input:focus-visible, .history-browser select:focus-visible, .history-event:focus-visible { outline: 2px solid var(--history-accent); outline-offset: 3px; }
.history-dates { display: flex; align-items: center; flex-wrap: wrap; gap: 9px; padding-bottom: 20px; }
.history-dates input { width: 112px; }
.history-dates small { color: var(--vp-c-text-3); font-size: 11px; }
.history-dates button { color: var(--history-accent); font-size: 12px; margin-left: auto; text-decoration: underline; text-underline-offset: 3px; }
.history-result { display: flex; justify-content: space-between; gap: 12px; color: var(--vp-c-text-2); font-size: 11px; padding: 12px 0; border-top: 1px solid var(--vp-c-divider); }
.history-events { list-style: none !important; margin: 0 !important; padding: 0 !important; }
.history-events li { margin: 0 !important; border-top: 1px solid var(--vp-c-divider); }
.history-event { display: grid; grid-template-columns: 165px minmax(0, 1fr) 18px; gap: 24px; align-items: center; padding: 19px 0; color: inherit !important; text-decoration: none !important; transition: color .15s, background .15s; }
.history-event:hover { background: var(--vp-c-bg-soft); }
.history-event time { color: var(--history-accent); font-size: 12px; font-variant-numeric: tabular-nums; line-height: 1.6; }
.history-event-group { display: block; color: var(--vp-c-text-3); font-size: 10px; margin-bottom: 4px; }
.history-event strong { display: block; font-family: "Songti SC", "Noto Serif CJK SC", serif; font-weight: 600; font-size: 18px; line-height: 1.5; }
.history-arrow { color: var(--vp-c-text-3); font-size: 16px; }
.history-event:hover strong, .history-event:hover .history-arrow { color: var(--history-accent); }
.history-empty { padding: 40px 0; color: var(--vp-c-text-2); }
.history-footnote { margin-top: 24px; font-size: 11px; color: var(--vp-c-text-3); }
@media (max-width: 640px) { .history-toolbar { grid-template-columns: 1fr 1fr; gap: 12px; } .history-search { grid-column: 1 / -1; } .history-event { grid-template-columns: 95px minmax(0, 1fr) 12px; gap: 12px; } .history-event strong { font-size: 16px; } .history-dates small { flex-basis: 100%; } }
</style>
