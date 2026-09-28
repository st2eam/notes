<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

type Curve = 'linear' | 'out' | 'inOut'

const curves: { key: Curve; label: string; easing: string }[] = [
  { key: 'linear', label: '线性', easing: 'linear' },
  { key: 'out', label: '缓出', easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { key: 'inOut', label: '缓入缓出', easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
]

const curve = ref<Curve>('out')
const duration = ref(500)
const motionStatus = ref('选择曲线与时长，然后点击「播放运动」。')
const feedbackStatus = ref('点击按钮，观察反馈出现的时机。')
const feedbackState = ref<'idle' | 'ack' | 'done'>('idle')
const track = ref<HTMLElement | null>(null)
const object = ref<HTMLElement | null>(null)
let animation: Animation | null = null
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

watch([curve, duration], () => {
  animation?.cancel()
  animation = null
  motionStatus.value = '参数已更新，点击「播放运动」查看变化。'
})

function play() {
  animation?.cancel()
  animation = null

  const selected = curves.find((item) => item.key === curve.value)!
  if (!track.value || !object.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    motionStatus.value = `已选择${selected.label}、${duration.value} ms；减少动态效果时省略位移。`
    return
  }

  const distance = Math.max(0, track.value.clientWidth - object.value.offsetWidth)
  motionStatus.value = `正在播放${selected.label}运动…`
  animation = object.value.animate(
    [{ transform: 'translateX(0)' }, { transform: `translateX(${distance}px)` }],
    { duration: duration.value, easing: selected.easing, fill: 'forwards' },
  )
  const current = animation
  current.onfinish = () => {
    if (animation === current) motionStatus.value = `${selected.label}运动完成，用时 ${duration.value} ms。`
  }
}

function showFeedback() {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackState.value = 'ack'
  feedbackStatus.value = '已收到操作，正在处理…'
  feedbackTimer = setTimeout(() => {
    feedbackState.value = 'done'
    feedbackStatus.value = '操作已完成。反馈从点击时就开始了。'
    feedbackTimer = null
  }, 280)
}

onUnmounted(() => {
  animation?.cancel()
  if (feedbackTimer) clearTimeout(feedbackTimer)
})
</script>

<template>
  <section class="design-demo motion-lab" aria-label="动效实验台">
    <div class="design-demo__header">
      <div>
        <strong class="design-demo__title">感受不同的运动节奏</strong>
        <p class="design-demo__description">同一段位移，改变曲线和时长，运动的性格就会不同。</p>
      </div>
    </div>

    <div class="design-demo__controls">
      <div class="design-demo__field">
        <span>运动曲线</span>
        <div class="design-demo__choices" role="group" aria-label="运动曲线">
          <button v-for="item in curves" :key="item.key" type="button" :aria-pressed="curve === item.key" @click="curve = item.key">
            {{ item.label }}
          </button>
        </div>
      </div>
      <label class="design-demo__field design-demo__field--range">
        <span>持续时间 <output>{{ duration }} ms</output></span>
        <input v-model.number="duration" type="range" min="180" max="800" step="20" aria-label="运动持续时间">
      </label>
      <button class="design-demo__action" type="button" @click="play">播放运动</button>
    </div>

    <div class="design-demo__stage motion-lab__stage">
      <div class="motion-lab__track-labels" aria-hidden="true"><span>起点</span><span>终点</span></div>
      <div ref="track" class="motion-lab__track" aria-hidden="true">
        <div ref="object" class="motion-lab__object"></div>
      </div>
    </div>
    <p class="design-demo__status" aria-live="polite">{{ motionStatus }}</p>

    <div class="motion-lab__feedback">
      <div>
        <strong>操作反馈</strong>
        <p>点击后立即确认，再呈现处理结果。</p>
      </div>
      <button type="button" :class="{ 'motion-lab__feedback-button--active': feedbackState !== 'idle' }" @click="showFeedback">
        {{ feedbackState === 'idle' ? '执行操作' : feedbackState === 'ack' ? '处理中…' : '再试一次' }}
      </button>
      <span class="motion-lab__feedback-result" aria-live="polite">{{ feedbackStatus }}</span>
    </div>
  </section>
</template>

<style scoped>
.motion-lab__stage {
  padding: 1.25rem 1.5rem 1.65rem;
}

.motion-lab__track-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.85rem;
  color: var(--demo-muted);
  font-size: 0.75rem;
}

.motion-lab__track {
  position: relative;
  height: 48px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.motion-lab__object {
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--demo-accent);
  box-shadow: 0 7px 16px -8px rgba(40, 30, 20, 0.48);
}

.motion-lab__feedback {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-top: 1.25rem;
  padding-top: 1.15rem;
  border-top: 1px solid var(--vp-c-divider);
}

.motion-lab__feedback strong {
  font-size: 0.88rem;
}

.motion-lab__feedback p {
  margin: 0.2rem 0 0;
  color: var(--demo-muted);
  font-size: 0.8rem;
}

.motion-lab__feedback-button--active {
  border-color: var(--demo-accent) !important;
  background: var(--demo-accent-soft) !important;
}

.motion-lab__feedback-result {
  grid-column: 1 / -1;
  min-height: 1.3em;
  color: var(--demo-muted);
  font-size: 0.8rem;
}
</style>
