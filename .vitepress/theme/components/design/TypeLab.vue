<script setup lang="ts">
import { ref } from 'vue'

const measure = ref(30)
const leading = ref(1.7)
const headingScale = ref(1.6)

function reset() {
  measure.value = 30
  leading.value = 1.7
  headingScale.value = 1.6
}
</script>

<template>
  <section class="design-demo type-lab" aria-label="排版实验台">
    <div class="design-demo__header">
      <div>
        <strong class="design-demo__title">亲手调整一段文字</strong>
        <p class="design-demo__description">改变行宽、行高与标题比例，观察视线如何在文字间移动。</p>
      </div>
    </div>

    <div class="design-demo__controls type-lab__controls">
      <label class="design-demo__field design-demo__field--range">
        <span>行宽 <output>{{ measure }} em</output></span>
        <input v-model.number="measure" type="range" min="18" max="36" step="1" aria-label="示例行宽">
      </label>
      <label class="design-demo__field design-demo__field--range">
        <span>行高 <output>{{ leading.toFixed(1) }}</output></span>
        <input v-model.number="leading" type="range" min="1.2" max="2" step="0.1" aria-label="示例行高">
      </label>
      <label class="design-demo__field design-demo__field--range">
        <span>标题比例 <output>{{ headingScale.toFixed(1) }}×</output></span>
        <input v-model.number="headingScale" type="range" min="1.1" max="2" step="0.1" aria-label="示例标题比例">
      </label>
      <button type="button" @click="reset">恢复推荐值</button>
    </div>

    <div class="design-demo__stage type-lab__stage">
      <div class="type-lab__sample" :style="{ maxWidth: `${measure}em`, lineHeight: leading }">
        <span class="type-lab__category">阅读样本</span>
        <h4 :style="{ fontSize: `${headingScale}em` }">让文字有呼吸的空间</h4>
        <p>舒适的排版让读者更容易找到下一行，也能分辨标题与正文的关系。行太长时，视线返回行首会更费力；行距太紧时，连续阅读容易感到拥挤。</p>
        <p>试着移动上方的滑块，观察同一段内容如何改变节奏。合适的数值取决于字体、屏幕宽度与阅读场景。</p>
      </div>
    </div>
    <p class="design-demo__note">预览区宽度随屏幕收窄；滑块只改变这段示例文字。</p>
  </section>
</template>

<style scoped>
.type-lab__controls {
  align-items: end;
}

.type-lab__controls .design-demo__field--range {
  flex-basis: 135px;
  max-width: 190px;
}

.type-lab__stage {
  padding: clamp(1.25rem, 4vw, 2.25rem);
}

.type-lab__sample {
  width: 100%;
  margin: 0 auto;
  font-size: 16px;
}

.type-lab__category {
  color: var(--demo-muted);
  font-size: 0.75em;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.type-lab__sample h4 {
  margin: 0.35em 0 0.65em;
  color: var(--demo-ink);
  font-family: 'Playfair Display', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-weight: 600;
  line-height: 1.2;
}

.type-lab__sample p {
  margin: 0 0 0.85em;
  color: var(--demo-ink);
  font-size: 1em;
  line-height: inherit;
}

.type-lab__sample p:last-child {
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .type-lab__controls .design-demo__field--range {
    flex: 1 1 100%;
    max-width: none;
  }
}
</style>
