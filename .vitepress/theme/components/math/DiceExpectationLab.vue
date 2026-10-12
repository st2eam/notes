<script setup lang="ts">
import { computed, reactive, ref, useId } from 'vue'
import NumberField from './NumberField.vue'
import { diceDefaults, diceErrors, diceMetrics, formatNumber as num, formatPercent as pct, compareMean } from './board-game-models.mjs'

const id = useId()
const values = reactive<Record<string, number | string>>({ ...diceDefaults })
const errors = computed(() => diceErrors(values))
const result = computed(() => Object.keys(errors.value).length ? null : diceMetrics(values))
const selected = ref(8)
const selectedRow = computed(() => result.value?.distribution.find(row => row.sum === selected.value)
  ?? result.value?.distribution.at(-1))
function reset() { Object.assign(values, diceDefaults); selected.value = 8 }
function showPointLabel(sum: number) {
  const rows = result.value?.distribution
  if (!rows) return false
  const first = rows[0].sum, last = rows.at(-1)!.sum
  if (rows.length <= 12 || sum === first || sum === last) return true
  const step = rows.length > 20 ? 5 : 2
  return sum > first + 1 && sum < last - 1 && sum % step === 0
}
</script>

<template>
  <section class="design-demo math-lab dice-lab" aria-label="骰子分布与行动收益">
    <header class="math-lab__header">
      <div><strong class="design-demo__title">骰子分布与行动收益</strong><p>先看点数出现的概率，再看奖励与成本带来的平均得失。</p></div>
      <button type="button" aria-label="恢复默认参数" @click="reset">重置</button>
    </header>
    <div class="math-lab__controls">
      <div class="math-lab__field">
        <label :for="`${id}-dice`">骰子数量 <output :for="`${id}-dice`">{{ values.dice }} 枚</output></label>
        <input :id="`${id}-dice`" v-model.number="values.dice" type="range" min="1" max="6" step="1">
        <span class="math-lab__help">公平六面骰，每枚结果独立。</span>
      </div>
      <NumberField v-model="values.threshold" label="成功门槛（至少多少点）" :min="1" :max="37" integer :error="errors.threshold" hint="改变骰子数量时，门槛保持不变。" />
    </div>
    <details class="math-lab__details">
      <summary>调整奖励、损失与成本{{ Object.keys(errors).some(key => key !== 'threshold' && key !== 'dice') ? '（有参数需要修正）' : '' }}</summary>
      <div class="math-lab__controls">
        <NumberField v-model="values.reward" label="成功奖励（分）" :min="0" :max="1000000" :error="errors.reward" hint="尚未扣除固定成本。" />
        <NumberField v-model="values.loss" label="失败额外损失（分）" :min="0" :max="1000000" :error="errors.loss" hint="仅在失败时支付。" />
        <NumberField v-model="values.cost" label="固定成本（分）" :min="0" :max="1000000" :error="errors.cost" hint="成功或失败都支付一次。" />
        <NumberField v-model="values.stable" label="稳定替代收益（分）" :min="-1000000" :max="1000000" :error="errors.stable" hint="另一行动的净收益。" />
      </div>
    </details>

    <template v-if="result">
      <div class="math-lab__chart-header"><span>各总点数出现概率 · {{ values.dice }}d6</span><span>{{ values.dice }}～{{ Number(values.dice) * 6 }} 点</span></div>
      <div class="dice-lab__legend"><span class="dice-lab__legend-success">达到成功门槛</span><span class="dice-lab__legend-failure">未达到门槛</span></div>
      <div class="dice-lab__plot" aria-label="各点数概率柱状图">
        <div class="dice-lab__chart">
          <div class="dice-lab__axis" aria-hidden="true"><span>20%</span><span>10%</span><span>0%</span></div>
          <div class="dice-lab__bars" role="group" aria-label="选择总点数查看详情" :style="{ gridTemplateColumns: `repeat(${result.distribution.length}, minmax(0, 1fr))` }">
            <button v-for="row in result.distribution" :key="row.sum" type="button" class="dice-lab__bar"
              :class="{ 'dice-lab__bar--success': row.sum >= Number(values.threshold) }"
              :aria-pressed="selectedRow?.sum === row.sum"
              :aria-label="`${row.sum} 点，概率 ${pct(row.probability)}，${row.sum >= Number(values.threshold) ? '成功' : '失败'}；查看详情`"
              @click="selected = row.sum" @focus="selected = row.sum">
              <span class="dice-lab__fill" :style="{ height: `${row.probability / 0.2 * 100}%` }"></span>
              <span v-if="showPointLabel(row.sum)" class="dice-lab__point">{{ row.sum }}</span>
            </button>
          </div>
        </div>
      </div>
      <p class="math-lab__help">横轴：点数之和，每根柱形代表一个点数；标签较密时省略部分标签。点击柱形、用 Tab 键，或通过下方选择框查看详情。</p>
      <div class="dice-lab__picker">
        <label :for="`${id}-point`">查看点数</label>
        <select :id="`${id}-point`" :value="selectedRow?.sum" @change="selected = Number(($event.target as HTMLSelectElement).value)">
          <option v-for="row in result.distribution" :key="row.sum" :value="row.sum">{{ row.sum }} 点 · {{ pct(row.probability) }}</option>
        </select>
      </div>
      <p class="dice-lab__selection" aria-live="polite" v-if="selectedRow">
        <strong>{{ selectedRow.sum }} 点</strong> · {{ selectedRow.count }} / {{ result.total }} 种结果 · 概率 {{ pct(selectedRow.probability) }} · {{ selectedRow.sum >= Number(values.threshold) ? '成功' : '失败' }}
      </p>
      <dl class="math-lab__metrics" aria-live="polite">
        <div><dt>平均总点数</dt><dd>{{ num(result.mean) }} <small>点</small></dd></div>
        <div><dt>行动成功率</dt><dd>{{ pct(result.probability) }}</dd></div>
        <div><dt>净期望收益</dt><dd>{{ num(result.ev) }} <small>分</small></dd></div>
        <div><dt>收益标准差</dt><dd>{{ num(result.sd) }} <small>分</small></dd></div>
      </dl>
      <p class="math-lab__conclusion" aria-live="polite">
        <template v-if="result.probability === 0">总点数达不到门槛，本规则下不可能成功。</template>
        <template v-else-if="result.probability === 1">所有总点数都达到门槛，本规则下必定成功。</template>
        <template v-else>失败概率仍有 {{ pct(1 - result.probability) }}。</template>
        {{ compareMean(result.difference, '掷骰行动', '稳定行动') }}
      </p>
      <details class="math-lab__details"><summary>查看当前计算式</summary>
        <div class="math-lab__formula">
          <p>平均总点数 = 3.5 × {{ values.dice }} = {{ num(result.mean) }} 点</p>
          <p>成功率 = {{ result.successCount }} / {{ result.total }} ≈ {{ pct(result.probability) }}</p>
          <p>净期望 = ({{ result.successCount }}/{{ result.total }}) × {{ values.reward }} − ({{ result.total - result.successCount }}/{{ result.total }}) × {{ values.loss }} − {{ values.cost }} ≈ {{ num(result.ev) }} 分</p>
          <p>成功净收益 = {{ values.reward }} − {{ values.cost }} = {{ num(Number(values.reward) - Number(values.cost)) }} 分；失败净收益 = −{{ values.loss }} − {{ values.cost }} = {{ num(-Number(values.loss) - Number(values.cost)) }} 分</p>
          <p>方差 = p(1−p) × (奖励 + 额外损失)² ≈ {{ num(result.variance) }} 分²；标准差是方差的平方根。</p>
        </div>
      </details>
      <details class="math-lab__details"><summary>展开完整概率表（{{ result.distribution.length }} 个点数）</summary>
        <div class="math-lab__scroll" tabindex="0" aria-label="完整点数概率表">
          <table><caption>{{ values.dice }} 枚骰子共有 {{ result.total }} 种等可能的有序结果</caption><thead><tr><th scope="col">总点数</th><th scope="col">结果数</th><th scope="col">概率</th><th scope="col">判定</th></tr></thead><tbody>
            <tr v-for="row in result.distribution" :key="row.sum"><th scope="row">{{ row.sum }}</th><td>{{ row.count }}</td><td>{{ row.count }}/{{ result.total }} ≈ {{ pct(row.probability) }}</td><td>{{ row.sum >= Number(values.threshold) ? '成功' : '失败' }}</td></tr>
          </tbody></table>
        </div>
      </details>
      <p class="math-lab__note">点数的概率与得分的期望是不同的量。期望描述长期平均；标准差描述结果的波动，不能保证这一局的收益。</p>
    </template>
    <p v-else class="math-lab__error" role="status">请修正参数后查看结果；本次计算已暂停。</p>
  </section>
</template>
