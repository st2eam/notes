<script setup lang="ts">
import { computed, ref } from 'vue'
import { attentionKeys, attentionQueries, attentionWeights } from './lab-models.mjs'

const selected = ref(0)
const weights = computed(() => attentionWeights(attentionQueries[selected.value].vector))
const total = computed(() => weights.value.reduce((sum: number, item: { weight: number }) => sum + item.weight, 0))
</script>

<template>
  <section class="design-demo ai-lab" aria-label="注意力权重实验台">
    <strong class="design-demo__title">换一个 Query，看注意力如何分配</strong>
    <p class="design-demo__description">二维向量先做点积，再除以 √2，最后经过 softmax；条形长度表示权重。</p>
    <div class="design-demo__choices ai-lab__choices" role="group" aria-label="查询向量">
      <button v-for="(query, index) in attentionQueries" :key="query.label" type="button" :aria-pressed="selected === index" @click="selected = index">{{ query.label }} [{{ query.vector.join(', ') }}]</button>
    </div>
    <div class="ai-lab__bars" aria-live="polite">
      <div v-for="(item, index) in weights" :key="item.label" class="ai-lab__bar-row">
        <span>{{ item.label }} <small>Key [{{ attentionKeys[index].vector.join(', ') }}]</small></span>
        <div class="ai-lab__bar-track"><div class="ai-lab__bar-fill" :style="{ width: (item.weight * 100) + '%' }"></div></div>
        <strong>{{ (item.weight * 100).toFixed(1) }}%</strong>
      </div>
    </div>
    <p class="design-demo__status" aria-live="polite">三个权重之和：{{ total.toFixed(3) }}</p>
    <p class="design-demo__note">教学模拟：向量由人工设定，仅展示缩放点积注意力的一步；真实模型的向量从训练中学得，还会结合 Value、多头与其他层。</p>
  </section>
</template>
