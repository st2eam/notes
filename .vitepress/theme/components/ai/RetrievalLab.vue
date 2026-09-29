<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { rankDocuments, retrievalQueries } from './lab-models.mjs'

const selected = ref(0)
const keywordWeight = ref(0.5)
const ranked = computed(() => rankDocuments(selected.value, keywordWeight.value))
</script>

<template>
  <section class="design-demo ai-lab" aria-label="混合检索实验台">
    <strong class="design-demo__title">给关键词和语义分数分配权重</strong>
    <p class="design-demo__description">选择查询，再移动滑块；每篇文档的两个归一化分数都是预设的教学数据。</p>
    <div class="design-demo__choices ai-lab__choices" role="group" aria-label="查询">
      <button v-for="(query, index) in retrievalQueries" :key="query.label" type="button" :aria-pressed="selected === index" @click="selected = index">{{ query.label }}</button>
    </div>
    <label class="design-demo__field design-demo__field--range ai-lab__range">
      <span>关键词权重 <output>{{ (keywordWeight * 100).toFixed(0) }}%</output></span>
      <input v-model.number="keywordWeight" type="range" min="0" max="1" step="0.05" aria-label="关键词检索权重">
    </label>
    <ol class="ai-lab__ranking" aria-live="polite">
      <li v-for="doc in ranked" :key="doc.path">
        <a :href="withBase(doc.path + '.html')">{{ doc.title }}</a>
        <span>综合 {{ doc.score.toFixed(2) }} · 关键词 {{ doc.keyword.toFixed(2) }} · 语义 {{ doc.semantic.toFixed(2) }}</span>
      </li>
    </ol>
    <p class="design-demo__note">教学模拟：真实 BM25 与向量分数的量纲通常不同，不能直接相加；上线前需校准分数，并在自己的查询集上评测。</p>
  </section>
</template>
