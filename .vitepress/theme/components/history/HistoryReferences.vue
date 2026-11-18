<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { historyReferences, referenceSource } from "../../../vault/history-references.mjs";
import { yearLabel } from "../../../vault/geo.mjs";
const props = defineProps<{ historyId?: string }>();
const reference = computed(() => historyReferences[props.historyId || ""]);
</script>

<template>
  <details v-if="reference" :key="historyId" class="history-references">
    <summary>事件来源</summary>
    <ul v-if="reference.matches?.length" class="history-source-matches">
      <li v-for="match in reference.matches" :key="match.upstreamKey + match.scope">
        <a :href="match.sourceUrl" target="_blank" rel="noopener">江山时序 · {{ yearLabel(match.year) }}</a>
        <p>{{ match.scope || match.headline }}</p>
        <p v-if="match.difference">{{ match.difference }}</p>
      </li>
    </ul>
    <p v-else>{{ reference.reason }}</p>
    <template v-if="reference.books?.length">
      <ul>
        <li v-for="book in reference.books" :key="book.title">《{{ book.title }}》{{ book.volumes.join('、') }}</li>
      </ul>
      <p>文献为上游提供的线索，尚未逐卷核验。</p>
    </template>
    <a :href="withBase(referenceSource.sourcePath + 'SOURCES.md')" target="_blank" rel="noopener">数据版本与许可</a>
  </details>
</template>

<style scoped>
.history-references { padding: 10px 8px; font-size: 11px; color: var(--vault-detail-muted, var(--vp-c-text-2)); line-height: 1.7; }
.history-references summary { cursor: pointer; width: fit-content; color: var(--vault-text, var(--vp-c-text-1)); }
.history-references ul { padding-left: 18px; margin: 10px 0; }
.history-references .history-source-matches { padding: 0; list-style: none; }
.history-source-matches > li + li { margin-top: 12px; }
.history-references p { font-size: inherit; margin: 4px 0 8px; overflow-wrap: anywhere; }
.history-references a { color: var(--vault-text, var(--vp-c-text-1)); text-decoration: underline; text-underline-offset: 3px; }
.history-references :is(summary, a):focus-visible { outline: 2px solid var(--vault-accent, var(--vp-c-brand-1)); outline-offset: 3px; }
</style>
