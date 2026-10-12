<script setup lang="ts">
import { computed, reactive, useId } from 'vue'
import NumberField from './NumberField.vue'
import { riskDefaults, riskErrors, riskMetrics, formatNumber as num, formatPercent as pct, compareMean } from './board-game-models.mjs'
const id = useId()
const values = reactive<Record<string, number | string>>({ ...riskDefaults })
const errors = computed(() => riskErrors(values))
const result = computed(() => Object.keys(errors.value).length ? null : riskMetrics(values))
function reset() { Object.assign(values, riskDefaults) }
</script>

<template>
  <section class="design-demo math-lab risk-lab" aria-label="停手与继续的风险比较">
    <header class="math-lab__header"><div><strong class="design-demo__title">停手与继续的风险比较</strong><p>比较行动之后的总分，已有分数只计算一次。</p></div><button type="button" aria-label="恢复默认参数" @click="reset">重置</button></header>
    <div class="math-lab__controls">
      <NumberField v-model="values.stop" label="停手保留分数（分）" :min="-1000000" :max="1000000" :error="errors.stop" hint="停手后的最终总分。" />
      <div class="math-lab__field">
        <label :for="`${id}-probability`">继续成功概率 <output :for="`${id}-probability`">{{ values.probability }}%</output></label>
        <input :id="`${id}-probability`" v-model.number="values.probability" type="range" min="0" max="100" step="1">
        <span class="math-lab__help">拖动滑块，观察哪种行动的平均分更高。</span>
      </div>
    </div>
    <details class="math-lab__details"><summary>调整成功与失败后的总分{{ errors.success || errors.failure ? '（有参数需要修正）' : '' }}</summary>
      <div class="math-lab__controls">
        <NumberField v-model="values.success" label="成功后的总分（分）" :min="-1000000" :max="1000000" :error="errors.success" hint="包含已有分数，不是新增分数。" />
        <NumberField v-model="values.failure" label="失败后的总分（分）" :min="-1000000" :max="1000000" :error="errors.failure" hint="直接填写失败后剩余的总分。" />
      </div>
    </details>
    <template v-if="result">
      <div class="risk-lab__tree" aria-label="继续行动的两个可能结果">
        <div class="risk-lab__root">继续</div>
        <dl class="risk-lab__branches">
          <div><dt>成功 · {{ pct(result.probability) }}</dt><dd>最终 {{ num(Number(values.success)) }} 分</dd></div>
          <div><dt>失败 · {{ pct(1 - result.probability) }}</dt><dd>最终 {{ num(Number(values.failure)) }} 分</dd></div>
        </dl>
      </div>
      <dl class="math-lab__metrics" aria-live="polite">
        <div><dt>停手总分</dt><dd>{{ num(Number(values.stop)) }} <small>分</small></dd></div>
        <div><dt>继续的期望总分</dt><dd>{{ num(result.ev) }} <small>分</small></dd></div>
        <div><dt>继续的标准差</dt><dd>{{ num(result.sd) }} <small>分</small></dd></div>
        <div><dt>继续 − 停手</dt><dd>{{ result.difference > 0 ? '+' : '' }}{{ num(result.difference) }} <small>分</small></dd></div>
      </dl>
      <p class="math-lab__conclusion" aria-live="polite">{{ compareMean(result.difference, '继续', '停手') }}这一比较只回答平均得分，不代表本局胜率或你的风险偏好。</p>
      <details class="math-lab__details"><summary>查看当前计算式</summary><div class="math-lab__formula">
        <p>继续的期望总分 = {{ num(result.probability, 6) }} × ({{ values.success }}) + {{ num(1 - result.probability, 6) }} × ({{ values.failure }}) ≈ {{ num(result.ev) }} 分</p>
        <p>期望差 = {{ num(result.ev) }} − ({{ values.stop }}) ≈ {{ num(result.difference) }} 分</p>
        <p>继续的方差 = p(1−p) × (成功总分 − 失败总分)² ≈ {{ num(result.variance) }} 分²</p>
      </div></details>
      <p class="math-lab__note">停手的总分固定，标准差为 0。继续的标准差越大，结果波动越大；波动大小本身并不决定该不该继续。</p>
    </template>
    <p v-else class="math-lab__error" role="status">请修正参数后查看结果；本次计算已暂停。</p>
  </section>
</template>
