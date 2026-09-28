<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const delays = [100, 400, 1200] as const
const delay = ref<(typeof delays)[number]>(400)
const phase = ref<'idle' | 'waiting' | 'done'>('idle')
const result = ref('选择等待时间，点击「模拟一次操作」。')
const progress = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let animation: Animation | null = null

function clearRun() {
  if (timer) clearTimeout(timer)
  timer = null
  animation?.cancel()
  animation = null
  if (progress.value) progress.value.style.transform = 'scaleX(0)'
}

function chooseDelay(value: (typeof delays)[number]) {
  clearRun()
  delay.value = value
  phase.value = 'idle'
  result.value = '时间已切换，点击「模拟一次操作」。'
}

function simulate() {
  clearRun()

  const selectedDelay = delay.value
  phase.value = 'waiting'
  result.value = '操作已立即收到，结果仍在等待。'

  if (progress.value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animation = progress.value.animate(
      [{ transform: 'scaleX(0)' }, { transform: `scaleX(${selectedDelay / 1200})` }],
      { duration: selectedDelay, easing: 'linear', fill: 'forwards' },
    )
  }

  timer = setTimeout(() => {
    phase.value = 'done'
    result.value = `模拟结果在 ${selectedDelay} ms 后到达。`
    if (progress.value) progress.value.style.transform = `scaleX(${selectedDelay / 1200})`
    animation?.cancel()
    animation = null
    timer = null
  }, selectedDelay)
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  animation?.cancel()
})
</script>

<template>
  <section class="design-demo doherty-lab" aria-label="响应时间模拟">
    <div class="design-demo__header">
      <div>
        <strong class="design-demo__title">400 ms，等待感从哪里来？</strong>
        <p class="design-demo__description">对比不同的结果延迟，留意按钮反馈与任务完成之间的间隔。</p>
      </div>
    </div>

    <div class="design-demo__controls">
      <div class="design-demo__field">
        <span>模拟结果延迟</span>
        <div class="design-demo__choices" role="group" aria-label="模拟结果延迟">
          <button v-for="value in delays" :key="value" type="button" :aria-pressed="delay === value" @click="chooseDelay(value)">
            {{ value }} ms
          </button>
        </div>
      </div>
      <button class="design-demo__action" type="button" @click="simulate">模拟一次操作</button>
    </div>

    <div class="design-demo__stage doherty-lab__stage">
      <div class="doherty-lab__timeline" aria-hidden="true">
        <div ref="progress" class="doherty-lab__progress"></div>
        <div class="doherty-lab__threshold"><span>400 ms</span></div>
        <div class="doherty-lab__result-marker" :style="{ left: delay === 1200 ? 'calc(100% - 6px)' : `${delay / 12}%` }"></div>
      </div>
      <div class="doherty-lab__scale" aria-hidden="true"><span>点击 · 0</span><span>1200 ms</span></div>
      <div class="doherty-lab__events">
        <div :data-active="phase !== 'idle'">
          <span class="doherty-lab__event-dot"></span>
          <span>即时反馈</span>
          <strong>{{ phase === 'idle' ? '尚未操作' : '已收到' }}</strong>
        </div>
        <div :data-active="phase === 'done'">
          <span class="doherty-lab__event-dot"></span>
          <span>最终结果</span>
          <strong>{{ phase === 'done' ? '已完成' : phase === 'waiting' ? '等待中' : '尚未操作' }}</strong>
        </div>
      </div>
    </div>
    <p class="design-demo__status" aria-live="polite">{{ result }}</p>
    <p class="design-demo__note">这是用于感受等待差异的模拟，并非网络性能测试；400 ms 标记表示文中讨论的门槛。</p>
  </section>
</template>

<style scoped>
.doherty-lab__stage {
  padding: 2rem 1.35rem 1.15rem;
}

.doherty-lab__timeline {
  position: relative;
  height: 10px;
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
}

.doherty-lab__progress {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--demo-accent);
  transform: scaleX(0);
  transform-origin: left;
}

.doherty-lab__threshold {
  position: absolute;
  z-index: 1;
  top: -11px;
  bottom: -10px;
  left: 33.333%;
  border-left: 1px dashed var(--demo-ink);
}

.doherty-lab__threshold span {
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  color: var(--demo-muted);
  font-size: 0.73rem;
  font-variant-numeric: tabular-nums;
}

.doherty-lab__result-marker {
  position: absolute;
  z-index: 2;
  top: 50%;
  width: 12px;
  height: 12px;
  border: 2px solid var(--demo-accent);
  border-radius: 50%;
  background: var(--demo-paper);
  transform: translate(-50%, -50%);
  transition: left 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.doherty-lab__scale {
  display: flex;
  justify-content: space-between;
  margin-top: 0.65rem;
  color: var(--demo-muted);
  font-size: 0.73rem;
  font-variant-numeric: tabular-nums;
}

.doherty-lab__events {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.doherty-lab__events > div {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.2rem 0.45rem;
  color: var(--demo-muted);
  font-size: 0.78rem;
}

.doherty-lab__events strong {
  grid-column: 2;
  color: var(--demo-ink);
  font-size: 0.87rem;
}

.doherty-lab__event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
}

.doherty-lab__events [data-active='true'] .doherty-lab__event-dot {
  background: var(--demo-accent);
}
</style>
