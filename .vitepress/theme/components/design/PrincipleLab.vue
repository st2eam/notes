<script setup lang="ts">
import { ref } from 'vue'

type Principle = 'fitts' | 'hick'
type Phase = 'idle' | 'running' | 'success'

const props = defineProps<{ kind: Principle }>()
const nouns = ['月亮', '纸船', '山峰', '雨伞', '灯塔', '苹果', '鲸鱼', '松树', '羽毛', '茶杯', '星星', '河流']
const phase = ref<Phase>('idle')
const targetSize = ref<48 | 88>(48)
const targetDistance = ref<52 | 78>(78)
const optionCount = ref<4 | 12>(4)
const options = ref(nouns.slice(0, 4))
const sought = ref('月亮')
const status = ref(props.kind === 'fitts' ? '点击左侧起点，再点击目标。' : '选择选项数量，再开始寻找。')
let startedAt = 0

function reset() {
  phase.value = 'idle'
  status.value = props.kind === 'fitts' ? '点击左侧起点，再点击目标。' : '选择选项数量，再开始寻找。'
}

function selectSize(value: 48 | 88) {
  targetSize.value = value
  reset()
}

function selectDistance(value: 52 | 78) {
  targetDistance.value = value
  reset()
}

function selectCount(value: 4 | 12) {
  optionCount.value = value
  options.value = nouns.slice(0, value)
  reset()
}

function start() {
  if (props.kind === 'hick') {
    const shuffled = [...nouns]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    options.value = shuffled.slice(0, optionCount.value)
    sought.value = options.value[Math.floor(Math.random() * options.value.length)]
    status.value = `请在 ${optionCount.value} 个选项中找到「${sought.value}」。`
  } else {
    status.value = '从起点移动到右侧目标。'
  }
  phase.value = 'running'
  startedAt = performance.now()
}

function finish() {
  if (phase.value !== 'running') return
  const elapsed = Math.round(performance.now() - startedAt)
  phase.value = 'success'
  status.value = `完成，用时约 ${elapsed} ms。调整条件后再试一次，感受差异。`
}

function chooseOption(value: string) {
  if (phase.value !== 'running') return
  if (value === sought.value) finish()
  else status.value = `「${value}」不是目标，继续找「${sought.value}」。`
}
</script>

<template>
  <section class="design-demo principle-lab" :aria-label="kind === 'fitts' ? '费茨定律交互演示' : '希克定律交互演示'">
    <div class="design-demo__header">
      <div>
        <strong class="design-demo__title">{{ kind === 'fitts' ? '目标大小与距离' : '选项数量与寻找时间' }}</strong>
        <p class="design-demo__description">{{ kind === 'fitts' ? '从起点触达目标，比较不同大小和距离。' : '在不同数量的选项中寻找目标，感受决策负担。' }}</p>
      </div>
    </div>

    <template v-if="kind === 'fitts'">
      <div class="design-demo__controls">
        <div class="design-demo__field">
          <span>目标尺寸</span>
          <div class="design-demo__choices" role="group" aria-label="目标尺寸">
            <button type="button" :aria-pressed="targetSize === 48" @click="selectSize(48)">小 · 48 px</button>
            <button type="button" :aria-pressed="targetSize === 88" @click="selectSize(88)">大 · 88 px</button>
          </div>
        </div>
        <div class="design-demo__field">
          <span>目标距离</span>
          <div class="design-demo__choices" role="group" aria-label="目标距离">
            <button type="button" :aria-pressed="targetDistance === 52" @click="selectDistance(52)">较近</button>
            <button type="button" :aria-pressed="targetDistance === 78" @click="selectDistance(78)">较远</button>
          </div>
        </div>
      </div>
      <div class="design-demo__stage principle-lab__fitts-stage">
        <div class="principle-lab__path" aria-hidden="true"></div>
        <button class="principle-lab__start" type="button" @click="start">起点</button>
        <button
          class="principle-lab__target"
          type="button"
          :disabled="phase !== 'running'"
          :style="{ left: `${targetDistance}%`, transform: `translate(-50%, -50%) scale(${targetSize / 88})` }"
          @click="finish"
        >目标</button>
      </div>
    </template>

    <template v-else>
      <div class="design-demo__controls">
        <div class="design-demo__field">
          <span>同时呈现的选项</span>
          <div class="design-demo__choices" role="group" aria-label="选项数量">
            <button type="button" :aria-pressed="optionCount === 4" @click="selectCount(4)">4 个</button>
            <button type="button" :aria-pressed="optionCount === 12" @click="selectCount(12)">12 个</button>
          </div>
        </div>
        <button class="design-demo__action" type="button" @click="start">开始寻找</button>
      </div>
      <div class="design-demo__stage principle-lab__hick-stage">
        <strong class="principle-lab__prompt">{{ phase === 'running' ? `寻找「${sought}」` : '开始后出现寻找目标' }}</strong>
        <div class="principle-lab__options">
          <button v-for="item in options" :key="item" type="button" :disabled="phase !== 'running'" @click="chooseOption(item)">{{ item }}</button>
        </div>
      </div>
    </template>

    <p class="design-demo__status" aria-live="polite">{{ status }}</p>
    <p class="design-demo__note">单次计时只帮助体验差异，不能作为定律的实验验证；键盘也可完成挑战。</p>
  </section>
</template>

<style scoped>
.principle-lab__fitts-stage {
  height: 172px;
}

.principle-lab__path {
  position: absolute;
  top: 50%;
  right: 11%;
  left: 14%;
  border-top: 1px dashed var(--vp-c-divider);
}

.principle-lab__start {
  position: absolute;
  top: 50%;
  left: 13%;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  min-height: 46px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--demo-paper);
  color: var(--demo-muted);
  font-size: 0.72rem;
  transform: translate(-50%, -50%);
}

.principle-lab__target {
  position: absolute;
  top: 50%;
  width: 88px;
  height: 88px;
  display: grid;
  place-items: center;
  padding: 0 !important;
  border: none !important;
  border-radius: 50% !important;
  background: var(--demo-accent) !important;
  color: var(--demo-paper) !important;
  font-size: 0.72rem !important;
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.principle-lab__target:disabled {
  opacity: 0.8 !important;
}

.principle-lab__hick-stage {
  padding: 1.15rem;
}

.principle-lab__prompt {
  display: block;
  min-height: 1.5em;
  margin-bottom: 0.75rem;
  color: var(--demo-ink);
  font-size: 0.87rem;
}

.principle-lab__options {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.45rem;
}

.principle-lab__options button {
  min-width: 0;
}

@media (max-width: 480px) {
  .principle-lab__options { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .principle-lab__target { font-size: 0.66rem !important; }
}
</style>
