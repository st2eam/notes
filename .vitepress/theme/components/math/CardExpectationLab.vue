<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import NumberField from './NumberField.vue'
import { cardDefaults, cardErrors, cardMetrics, formatNumber as num, formatPercent as pct } from './board-game-models.mjs'
const values = reactive<Record<string, number | string>>({ ...cardDefaults })
const rule = ref<'once' | 'each'>('once')
const errors = computed(() => cardErrors(values))
const result = computed(() => Object.keys(errors.value).length ? null : cardMetrics(values, rule.value))
function reset() { Object.assign(values, cardDefaults); rule.value = 'once' }
</script>

<template>
  <section class="design-demo math-lab card-lab" aria-label="抽牌概率与计分规则">
    <header class="math-lab__header"><div><strong class="design-demo__title">抽牌概率与计分规则</strong><p>抽牌方式相同，奖励规则不同，平均收益也会不同。</p></div><button type="button" aria-label="恢复默认参数" @click="reset">重置</button></header>
    <div class="math-lab__controls math-lab__controls--three">
      <NumberField v-model="values.total" label="牌堆总数（张）" :min="1" :max="1000" integer :error="errors.total" hint="输入当前剩余牌堆，最多 1000 张。" />
      <NumberField v-model="values.targets" label="目标牌数（张）" :min="0" :max="Number(values.total) || 1000" integer :error="errors.targets" hint="目标牌包含在牌堆总数中。" />
      <NumberField v-model="values.draws" label="抽取张数（张）" :min="0" :max="Number(values.total) || 1000" integer :error="errors.draws" hint="抽出的牌不放回，允许抽 0 张。" />
    </div>
    <div class="math-lab__choices" role="group" aria-label="奖励规则">
      <button type="button" :aria-pressed="rule === 'once'" @click="rule = 'once'">至少命中一次，只奖励一次</button>
      <button type="button" :aria-pressed="rule === 'each'" @click="rule = 'each'">每张目标牌分别奖励</button>
    </div>
    <details class="math-lab__details"><summary>调整奖励与成本{{ errors.reward || errors.cost ? '（有参数需要修正）' : '' }}</summary>
      <div class="math-lab__controls">
        <NumberField v-model="values.reward" :label="rule === 'once' ? '单次命中奖励（分）' : '每张目标牌奖励（分）'" :min="0" :max="1000000" :error="errors.reward" hint="尚未扣除抽牌成本。" />
        <NumberField v-model="values.cost" label="抽牌固定成本（分）" :min="0" :max="1000000" :error="errors.cost" hint="整次行动支付一次，与命中张数无关。" />
      </div>
    </details>
    <template v-if="result">
      <dl class="math-lab__metrics math-lab__metrics--three" aria-live="polite">
        <div><dt>至少命中一次</dt><dd>{{ pct(result.probability) }}</dd></div>
        <div><dt>平均命中张数</dt><dd>{{ num(result.expectedHits) }} <small>张</small></dd></div>
        <div><dt>当前净期望收益</dt><dd>{{ num(result.ev) }} <small>分</small></dd></div>
      </dl>
      <div class="card-lab__comparison" aria-label="相同参数下的两种计分结果">
        <div :class="{ 'card-lab__active': rule === 'once' }"><span>只奖励一次{{ rule === 'once' ? ' · 当前' : '' }}</span><strong>{{ num(result.onceEv) }} 分</strong></div>
        <div :class="{ 'card-lab__active': rule === 'each' }"><span>逐张奖励{{ rule === 'each' ? ' · 当前' : '' }}</span><strong>{{ num(result.eachEv) }} 分</strong></div>
      </div>
      <p class="math-lab__conclusion" aria-live="polite">
        <template v-if="rule === 'once'">命中多张也只拿一次奖励，因此使用“至少命中一次”的概率。</template>
        <template v-else>每张目标牌都给奖励，因此使用平均命中张数；它可以不是整数。</template>
        切换计分规则不会改变抽牌概率。
      </p>
      <details class="math-lab__details"><summary>查看当前计算式</summary><div class="math-lab__formula">
        <p>至少命中一次 = 1 − 完全未命中的概率 ≈ {{ pct(result.probability) }}</p>
        <p>均匀不放回抽牌：完全未命中的概率为 C({{ Number(values.total) - Number(values.targets) }}, {{ values.draws }}) / C({{ values.total }}, {{ values.draws }})；可抽的非目标牌不足时，分子为 0。</p>
        <p>平均命中张数 = {{ values.draws }} × {{ values.targets }} / {{ values.total }} ≈ {{ num(result.expectedHits) }} 张</p>
        <p>只奖励一次：净期望 = {{ values.reward }} × {{ num(result.probability, 6) }} − {{ values.cost }} ≈ {{ num(result.onceEv) }} 分</p>
        <p>逐张奖励：净期望 = {{ values.reward }} × {{ num(result.expectedHits, 6) }} − {{ values.cost }} ≈ {{ num(result.eachEv) }} 分</p>
      </div></details>
      <p class="math-lab__note">假设牌堆均匀随机、抽牌不放回，未命中没有额外损失。即使抽取 0 张，模型仍会扣除设定的固定成本；若不行动无需付费，请把成本设为 0。</p>
    </template>
    <p v-else class="math-lab__error" role="status">请修正参数后查看结果；本次计算已暂停。</p>
  </section>
</template>
