<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { historyReferences, referenceSource } from "../../../vault/history-references.mjs";
const props = defineProps<{ historyId?: string }>();
const reference = computed(() => historyReferences[props.historyId || ""]);
</script>

<template>
  <details v-if="reference" class="history-references">
    <summary>上游提供的参考文献</summary>
    <ul>
      <li v-for="book in reference.books" :key="book.title">《{{ book.title }}》{{ book.volumes.join('、') }}</li>
    </ul>
    <p>{{ reference.reason }}</p>
    <p>此处保留上游文献线索，尚未逐卷核验，不作为坐标精度或事件细节已获证实的依据。</p>
    <a :href="referenceSource.repository + '/blob/' + referenceSource.commit + '/js/milestone_sources.js'" target="_blank" rel="noopener">查看上游引用</a>
    <span aria-hidden="true"> · </span>
    <a :href="withBase(referenceSource.sourcePath + 'SOURCES.md')" target="_blank" rel="noopener">版本、署名与 GPL 许可</a>
  </details>
</template>

<style scoped>
.history-references { border-top: 1px solid var(--vp-c-divider); padding: 12px 0; font-size: 12px; color: var(--vp-c-text-2); line-height: 1.7; }
.history-references summary { cursor: pointer; color: var(--vp-c-text-1); }
.history-references ul { padding-left: 18px; margin: 10px 0; }
.history-references p { font-size: inherit; margin: 8px 0; }
.history-references a { color: var(--vp-c-brand-1); text-decoration: underline; text-underline-offset: 3px; }
</style>
