<script setup lang="ts">
import { computed, reactive, ref, useId } from 'vue'
import NumberField from './NumberField.vue'
import { evDefaults, evErrors, expectedValue, formatNumber as num, formatPercent as pct } from './board-game-models.mjs'
const props = defineProps<{ diceProbability: number | null; cardProbability: number | null }>()
const id = useId()
const source = ref<'dice' | 'cards' | 'manual'>('dice')
const values = reactive<Record<string, number | string>>({ ...evDefaults })
const sourceProbability = computed(() => source.value === 'dice' ? props.diceProbability : source.value === 'cards' ? props.cardProbability : null)
const calculation = computed(() => ({ ...values, probability: source.value === 'manual' ? values.probability : sourceProbability.value === null ? '' : sourceProbability.value * 100 }))
const errors = computed(() => evErrors(calculation.value))
const result = computed(() => Object.keys(errors.value).length ? null : expectedValue(calculation.value))
function reset() { Object.assign(values, evDefaults); source.value = 'dice' }
</script>

<template>
  <section class="design-demo math-lab ev-lab" aria-label="通用期望 EV 计算">
    <header class="math-lab__header"><div><strong class="design-demo__title">通用期望 EV 计算</strong><p>先选事件概率，再填写发生与未发生时的结果。</p></div><button type="button" aria-label="恢复 EV 默认参数" @click="reset">重置</button></header>
    <div class="math-lab__field ev-lab__source"><label :for="`${id}-source`">概率来源</label><select :id="`${id}-source`" v-model="source"><option value="dice">上方掷骰 · 达到目标点数</option><option value="cards">上方抽牌 · 至少命中一次</option><option value="manual">手动输入概率</option></select></div>
    <NumberField v-if="source === 'manual'" v-model="values.probability" label="事件概率（%）" :min="0" :max="100" :error="errors.probability" hint="例如 50 表示 50%。" />
    <p v-else class="math-lab__conclusion" aria-live="polite">{{ sourceProbability === null ? '上方概率参数无效，请先修正，或改用手动输入。' : `当前事件概率：${pct(sourceProbability)}，随上方参数实时更新。` }}</p>
    <div class="math-lab__controls">
      <NumberField v-model="values.success" label="事件发生时的结果（分）" :min="-1000000" :max="1000000" :error="errors.success" hint="收益填正数，损失填负数。" />
      <NumberField v-model="values.failure" label="未发生时的结果（分）" :min="-1000000" :max="1000000" :error="errors.failure" hint="与发生时的结果使用同一口径。" />
    </div>
    <template v-if="result">
      <dl class="math-lab__metrics math-lab__metrics--two" aria-live="polite"><div><dt>期望 EV</dt><dd>{{ num(result.ev) }} <small>分</small></dd></div></dl>
      <p class="math-lab__formula ev-lab__formula">EV = {{ pct(result.probability) }} × ({{ values.success }}) + {{ pct(1 - result.probability) }} × ({{ values.failure }}) ≈ {{ num(result.ev) }} 分</p>
    </template>
    <p v-else class="math-lab__error" role="status">请修正概率或结果值后查看 EV；计算已暂停。</p>
    <p class="math-lab__note">计算净收益时，先把成本扣入两个结果，避免重复扣费。也可填写最终总分，但两个结果需使用同一口径。EV 是长期平均，不保证每次获得这个分数。</p>
  </section>
</template>
