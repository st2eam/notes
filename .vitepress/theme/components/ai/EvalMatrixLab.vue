<script setup lang="ts">
import { computed, ref } from 'vue'
import { confusionMetrics, evaluationCases } from './lab-models.mjs'

const threshold = ref(0.5)
const metrics = computed(() => confusionMetrics(threshold.value))
const percent = (value: number) => (value * 100).toFixed(0) + '%'
</script>

<template>
  <section class="design-demo ai-lab" aria-label="分类评测实验台">
    <strong class="design-demo__title">调整阈值，观察准确性与召回的权衡</strong>
    <p class="design-demo__description">八个样本的真实标签和预测分数固定；分数大于等于阈值时判为正例。</p>
    <label class="design-demo__field design-demo__field--range ai-lab__range">
      <span>判定阈值 <output>{{ threshold.toFixed(2) }}</output></span>
      <input v-model.number="threshold" type="range" min="0.1" max="0.9" step="0.05" aria-label="正例判定阈值">
    </label>
    <div class="ai-lab__cases">
      <div v-for="(item, index) in evaluationCases" :key="index" class="ai-lab__case" :class="item.score >= threshold ? 'ai-lab__case--positive' : ''">
        <strong>{{ index + 1 }}</strong><span>分数 {{ item.score.toFixed(2) }}</span><small>真实 {{ item.label ? '正' : '负' }} · 预测 {{ item.score >= threshold ? '正' : '负' }}</small>
      </div>
    </div>
    <div class="ai-lab__metrics" aria-live="polite">
      <div><strong>{{ metrics.tp }}</strong><span>真正例 TP</span></div>
      <div><strong>{{ metrics.fp }}</strong><span>假正例 FP</span></div>
      <div><strong>{{ metrics.fn }}</strong><span>假负例 FN</span></div>
      <div><strong>{{ metrics.tn }}</strong><span>真负例 TN</span></div>
    </div>
    <p class="design-demo__status" aria-live="polite">精确率 {{ percent(metrics.precision) }} · 召回率 {{ percent(metrics.recall) }} · F1 {{ percent(metrics.f1) }}</p>
    <p class="design-demo__note">教学模拟：阈值和指标只描述这八个样本；真实系统还需检查样本代表性、误判成本与数据泄漏。</p>
  </section>
</template>
