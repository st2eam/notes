<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import NumberField from './NumberField.vue'
import { cardDefaults, cardErrors, cardProbability, formatPercent as pct } from './board-game-models.mjs'
const emit = defineEmits<{ 'probability-change': [value: number | null]; 'use-probability': [] }>()
const values = reactive<Record<string, number | string>>({ ...cardDefaults })
const errors = computed(() => cardErrors(values))
const result = computed(() => Object.keys(errors.value).length ? null : cardProbability(values))
watch(result, value => emit('probability-change', value?.probability ?? null), { immediate: true })
function reset() { Object.assign(values, cardDefaults) }
</script>

<template>
  <section class="design-demo math-lab card-lab" aria-label="抽牌概率">
    <header class="math-lab__header"><div><strong class="design-demo__title">抽牌概率</strong><p>均匀随机抽牌，不放回；只计算是否抽到目标牌。</p></div><button type="button" aria-label="恢复抽牌默认参数" @click="reset">重置</button></header>
    <div class="math-lab__controls math-lab__controls--three">
      <NumberField v-model="values.total" label="牌堆总数（张）" :min="1" :max="1000" integer :error="errors.total" hint="当前剩余牌数，最多 1000 张。" />
      <NumberField v-model="values.targets" label="目标牌数（张）" :min="0" :max="Number(values.total) || 1000" integer :error="errors.targets" hint="包含在牌堆总数中。" />
      <NumberField v-model="values.draws" label="抽取张数（张）" :min="0" :max="Number(values.total) || 1000" integer :error="errors.draws" hint="允许抽 0 张。" />
    </div>
    <template v-if="result">
      <dl class="math-lab__metrics math-lab__metrics--two" aria-live="polite"><div><dt>至少抽到一张目标牌</dt><dd>{{ pct(result.probability) }}</dd></div><div><dt>没有抽到目标牌</dt><dd>{{ pct(result.miss) }}</dd></div></dl>
      <figure class="card-lab__figure" aria-label="命中与未命中的概率比例">
        <figcaption class="math-lab__chart-header"><strong>这次抽牌的两种结果</strong><span>合计 100%</span></figcaption>
        <div class="math-lab__legend"><span class="math-lab__legend-event">至少命中一次</span><span>未命中</span></div>
        <div class="card-lab__proportion" role="img" :aria-label="`至少命中一次 ${pct(result.probability)}，未命中 ${pct(result.miss)}`"><span :style="{ width: `${result.probability * 100}%` }"></span><span :style="{ width: `${result.miss * 100}%` }"></span></div>
        <div class="card-lab__ticks" aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>
      </figure>
      <div class="math-lab__handoff"><span>按至少命中一次计算收益</span><button type="button" @click="emit('use-probability')">用此概率算 EV<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></button></div>
      <details class="math-lab__details"><summary>查看概率计算式</summary><div class="math-lab__formula"><p>P(至少命中一次) = 1 − C({{ Number(values.total) - Number(values.targets) }}, {{ values.draws }}) / C({{ values.total }}, {{ values.draws }}) ≈ {{ pct(result.probability) }}</p><p>C(a, b) 表示从 a 张牌中选 b 张的组合数。非目标牌不足以抽满时，完全未命中的概率为 0。</p></div></details>
    </template>
    <p v-else class="math-lab__error" role="status">请修正参数后查看概率；计算已暂停。</p>
  </section>
</template>
