<script setup lang="ts">
import { computed, reactive, ref, useId, watch } from 'vue'
import NumberField from './NumberField.vue'
import { diceDefaults, diceErrors, diceProbability, diceChartBins, formatNumber as num, formatPercent as pct } from './board-game-models.mjs'
const emit = defineEmits<{ 'probability-change': [value: number | null]; 'use-probability': [] }>()
const id = useId()
const values = reactive<Record<string, number | string>>({ ...diceDefaults })
const errors = computed(() => diceErrors(values))
const result = computed(() => Object.keys(errors.value).length ? null : diceProbability(values))
const selected = ref(8)
const hovered = ref<number | null>(null)
const selectedRow = computed(() => result.value?.distribution.find(row => row.sum === selected.value) ?? result.value?.distribution.at(-1))
const bins = computed(() => result.value ? diceChartBins(result.value.distribution, Number(values.threshold)) : [])
const grouped = computed(() => bins.value.some(bin => bin.from !== bin.to))
const selectedBin = computed(() => bins.value.find(bin => selectedRow.value && selectedRow.value.sum >= bin.from && selectedRow.value.sum <= bin.to))
const inspectedBin = computed(() => bins.value.find(bin => bin.from === hovered.value) ?? selectedBin.value)
const chartMax = computed(() => Math.min(1, Math.max(0.05, Math.ceil(Math.max(...bins.value.map(bin => bin.probability)) / 0.05) * 0.05)))
watch(result, value => emit('probability-change', value?.probability ?? null), { immediate: true })
function reset() { Object.assign(values, diceDefaults); selected.value = 8; hovered.value = null }
function navigateBar(event: KeyboardEvent, index: number) {
  const directions = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: bins.value.length - 1 }
  if (!(event.key in directions)) return
  event.preventDefault()
  const target = Math.max(0, Math.min(bins.value.length - 1, directions[event.key as keyof typeof directions]))
  const buttons = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('button')
  buttons?.[target].focus()
}
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
    <div class="math-lab__presets" role="group" aria-label="常用骰子面数"><span>常用骰面</span><button v-for="faces in [6, 10, 20, 100]" :key="faces" type="button" :aria-pressed="values.faces === faces" @click="values.faces = faces">d{{ faces }}</button></div>
    <template v-if="result">
      <dl class="math-lab__metrics math-lab__metrics--two" aria-live="polite"><div><dt>总点数 ≥ {{ values.threshold }}</dt><dd>{{ pct(result.probability) }}</dd></div><div><dt>总点数 &lt; {{ values.threshold }}</dt><dd>{{ pct(1 - result.probability) }}</dd></div></dl>
      <p v-if="result.probability === 0 || result.probability === 1" class="math-lab__help" aria-live="polite">{{ result.probability === 0 ? '所有点数都低于目标，此事件不可能发生。' : '所有点数都达到目标，此事件必定发生。' }}</p>
      <figure class="dice-lab__figure" :aria-labelledby="`${id}-chart-title`">
        <figcaption class="math-lab__chart-header" :id="`${id}-chart-title`"><strong>{{ grouped ? '总点数区间的概率' : '各总点数的概率' }}</strong><span>{{ values.dice }}～{{ Number(values.dice) * Number(values.faces) }} 点</span></figcaption>
        <div class="math-lab__legend"><span class="math-lab__legend-event">达到目标</span><span>低于目标</span></div>
        <div v-if="inspectedBin" class="dice-lab__readout"><span>{{ rangeLabel(inspectedBin) }}<small>{{ inspectedBin.success ? '达到目标' : '低于目标' }}{{ grouped ? ' · 区间合计' : '' }}</small></span><strong>{{ pct(inspectedBin.probability) }}</strong></div>
        <div class="dice-lab__plot" aria-label="总点数概率图">
        <div class="dice-lab__chart"><div class="dice-lab__axis" aria-hidden="true"><span v-for="tick in [1, 0.75, 0.5, 0.25, 0]" :key="tick" :style="{ top: `${(1 - tick) * 100}%` }">{{ pct(chartMax * tick) }}</span></div>
          <div class="dice-lab__bars" role="group" aria-label="选择柱形查看概率，可使用左右方向键" :style="{ gridTemplateColumns: `repeat(${bins.length}, minmax(0, 1fr))` }" @mouseleave="hovered = null">
            <span v-for="tick in [0, 25, 50, 75]" :key="tick" class="dice-lab__gridline" :style="{ top: `${tick}%` }" aria-hidden="true"></span>
            <button v-for="(bin, index) in bins" :key="bin.from" type="button" class="dice-lab__bar" :class="{ 'dice-lab__bar--success': bin.success, 'dice-lab__bar--inspected': inspectedBin?.from === bin.from }" :aria-pressed="selectedBin?.from === bin.from" :tabindex="selectedBin?.from === bin.from ? 0 : -1" :aria-label="`${rangeLabel(bin)}，${grouped ? '区间' : ''}概率 ${pct(bin.probability)}，${bin.success ? '达到目标' : '低于目标'}`" @mouseenter="hovered = bin.from" @click="selected = bin.from" @focus="selected = bin.from; hovered = null" @keydown="navigateBar($event, index)">
              <span class="dice-lab__fill" :style="{ transform: `scaleY(${bin.probability / chartMax})` }"></span><span v-if="showLabel(index)" class="dice-lab__point">{{ index === bins.length - 1 ? bin.to : bin.from }}</span>
            </button>
          </div>
        </div>
      </div>
      <p class="math-lab__help">悬停或点选柱形查看概率；键盘可用左右方向键切换。{{ grouped ? '每根柱形是区间内概率的总和。' : '每根柱形对应一个总点数。' }}</p>
      </figure>
      <div class="dice-lab__picker"><label :for="`${id}-point`">单点概率</label><select :id="`${id}-point`" :value="selectedRow?.sum" @change="selected = Number(($event.target as HTMLSelectElement).value)"><option v-for="row in result.distribution" :key="row.sum" :value="row.sum">{{ row.sum }} 点 · {{ pct(row.probability) }}</option></select></div>
      <p v-if="selectedRow" class="dice-lab__selection" aria-live="polite"><strong>恰好 {{ selectedRow.sum }} 点</strong>：{{ pct(selectedRow.probability) }}（{{ num(selectedRow.count, 0) }} / {{ num(result.total, 0) }} 种结果）。</p>
      <div class="math-lab__handoff"><span>将达到目标的概率用于收益计算</span><button type="button" @click="emit('use-probability')">用此概率算 EV<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></button></div>
      <details class="math-lab__details"><summary>展开完整概率表</summary><div class="math-lab__scroll" tabindex="0" aria-label="总点数概率表"><table><caption>{{ values.dice }}d{{ values.faces }} 的精确计数</caption><thead><tr><th scope="col">总点数</th><th scope="col">结果数</th><th scope="col">概率</th></tr></thead><tbody><tr v-for="row in result.distribution" :key="row.sum"><th scope="row">{{ row.sum }}</th><td>{{ num(row.count, 0) }}</td><td>{{ pct(row.probability) }}</td></tr></tbody></table></div></details>
    </template>
    <p v-else class="math-lab__error" role="status">请修正参数后查看概率；计算已暂停。</p>
  </section>
</template>
