<script setup lang="ts">
import { computed, reactive, ref, useId, watch } from 'vue'
import NumberField from './NumberField.vue'
import { diceDefaults, diceErrors, diceProbability, diceChartBins, formatNumber as num, formatPercent as pct } from './board-game-models.mjs'
const emit = defineEmits<{ 'probability-change': [value: number | null] }>()
const id = useId()
const values = reactive<Record<string, number | string>>({ ...diceDefaults })
const errors = computed(() => diceErrors(values))
const result = computed(() => Object.keys(errors.value).length ? null : diceProbability(values))
const selected = ref(8)
const selectedRow = computed(() => result.value?.distribution.find(row => row.sum === selected.value) ?? result.value?.distribution.at(-1))
const bins = computed(() => result.value ? diceChartBins(result.value.distribution, Number(values.threshold)) : [])
const grouped = computed(() => bins.value.some(bin => bin.from !== bin.to))
const selectedBin = computed(() => bins.value.find(bin => selectedRow.value && selectedRow.value.sum >= bin.from && selectedRow.value.sum <= bin.to))
const chartMax = computed(() => Math.min(1, Math.max(0.05, Math.ceil(Math.max(...bins.value.map(bin => bin.probability)) / 0.05) * 0.05)))
watch(result, value => emit('probability-change', value?.probability ?? null), { immediate: true })
function reset() { Object.assign(values, diceDefaults); selected.value = 8 }
function showLabel(index: number) {
  const length = bins.value.length
  if (length <= 8 || index === 0 || index === length - 1) return true
  const stride = Math.ceil(length / 6)
  return index >= stride && index <= length - 1 - stride && index % stride === 0
}
const rangeLabel = (bin: { from: number; to: number }) => bin.from === bin.to ? `${bin.from} 点` : `${bin.from}～${bin.to} 点`
</script>

<template>
  <section class="design-demo math-lab dice-lab" aria-label="掷骰概率">
    <header class="math-lab__header"><div><strong class="design-demo__title">掷骰概率 · {{ values.dice }}d{{ values.faces }}</strong><p>n 是骰子数量，m 是每枚骰子的面数；每个面为 1～m，各枚结果独立。</p></div><button type="button" aria-label="恢复骰子默认参数" @click="reset">重置</button></header>
    <div class="math-lab__controls math-lab__controls--three">
      <div class="math-lab__field"><label :for="`${id}-dice`">骰子数量 n <output :for="`${id}-dice`">{{ values.dice }} 枚</output></label><input :id="`${id}-dice`" v-model.number="values.dice" type="range" min="1" max="6" step="1"><span class="math-lab__help">1～6 枚公平骰子。</span></div>
      <NumberField v-model="values.faces" label="每枚面数 m" :min="1" :max="100" integer :error="errors.faces" hint="1～100 面，例如 d6、d20。" />
      <NumberField v-model="values.threshold" label="总点数至少为" :min="1" :max="601" integer :error="errors.threshold" hint="调整 n、m 时，目标点数保持不变。" />
    </div>
    <template v-if="result">
      <dl class="math-lab__metrics math-lab__metrics--two" aria-live="polite"><div><dt>总点数 ≥ {{ values.threshold }}</dt><dd>{{ pct(result.probability) }}</dd></div><div><dt>总点数 &lt; {{ values.threshold }}</dt><dd>{{ pct(1 - result.probability) }}</dd></div></dl>
      <p v-if="result.probability === 0 || result.probability === 1" class="math-lab__help" aria-live="polite">{{ result.probability === 0 ? '所有点数都低于目标，此事件不可能发生。' : '所有点数都达到目标，此事件必定发生。' }}</p>
      <div class="math-lab__chart-header"><span>{{ grouped ? '总点数区间的概率' : '各总点数的概率' }}</span><span>{{ values.dice }}～{{ Number(values.dice) * Number(values.faces) }} 点</span></div>
      <div class="dice-lab__legend"><span class="dice-lab__legend-success">达到目标</span><span class="dice-lab__legend-failure">低于目标</span></div>
      <div class="dice-lab__plot" aria-label="总点数概率图">
        <div class="dice-lab__chart"><div class="dice-lab__axis" aria-hidden="true"><span>{{ pct(chartMax) }}</span><span>{{ pct(chartMax / 2) }}</span><span>0%</span></div>
          <div class="dice-lab__bars" role="group" aria-label="选择柱形查看概率" :style="{ gridTemplateColumns: `repeat(${bins.length}, minmax(0, 1fr))` }">
            <button v-for="(bin, index) in bins" :key="bin.from" type="button" class="dice-lab__bar" :class="{ 'dice-lab__bar--success': bin.success }" :aria-pressed="selectedBin?.from === bin.from" :aria-label="`${rangeLabel(bin)}，${grouped ? '区间' : ''}概率 ${pct(bin.probability)}，${bin.success ? '达到目标' : '低于目标'}`" @click="selected = bin.from" @focus="selected = bin.from">
              <span class="dice-lab__fill" :style="{ height: `${bin.probability / chartMax * 100}%` }"></span><span v-if="showLabel(index)" class="dice-lab__point">{{ index === bins.length - 1 ? bin.to : bin.from }}</span>
            </button>
          </div>
        </div>
      </div>
      <p class="math-lab__help">{{ grouped ? '点数较多，柱形按区间合并，柱高是区间内概率的总和；精确单点概率可在下方选择查看。' : '每根柱形对应一个总点数；横轴标签较密时会省略部分标签。' }}</p>
      <p v-if="grouped && selectedBin" class="math-lab__help" aria-live="polite">选中区间：{{ rangeLabel(selectedBin) }}，区间概率 {{ pct(selectedBin.probability) }}。</p>
      <div class="dice-lab__picker"><label :for="`${id}-point`">单点概率</label><select :id="`${id}-point`" :value="selectedRow?.sum" @change="selected = Number(($event.target as HTMLSelectElement).value)"><option v-for="row in result.distribution" :key="row.sum" :value="row.sum">{{ row.sum }} 点 · {{ pct(row.probability) }}</option></select></div>
      <p v-if="selectedRow" class="dice-lab__selection" aria-live="polite"><strong>恰好 {{ selectedRow.sum }} 点</strong>：{{ pct(selectedRow.probability) }}（{{ num(selectedRow.count, 0) }} / {{ num(result.total, 0) }} 种结果）。</p>
      <details class="math-lab__details"><summary>展开完整概率表</summary><div class="math-lab__scroll" tabindex="0" aria-label="总点数概率表"><table><caption>{{ values.dice }}d{{ values.faces }} 的精确计数</caption><thead><tr><th scope="col">总点数</th><th scope="col">结果数</th><th scope="col">概率</th></tr></thead><tbody><tr v-for="row in result.distribution" :key="row.sum"><th scope="row">{{ row.sum }}</th><td>{{ num(row.count, 0) }}</td><td>{{ pct(row.probability) }}</td></tr></tbody></table></div></details>
    </template>
    <p v-else class="math-lab__error" role="status">请修正参数后查看概率；计算已暂停。</p>
  </section>
</template>
