<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue'

const dots = Array.from({ length: 16 }, (_, index) => ({ index, group: (Math.floor(index / 4) + index % 4) % 2 === 0 ? 'a' : 'b' }))
const active = ref(false)
const status = ref('这些点外观相同。播放后，观察自己如何将它们分组。')
let firstFrame = 0
let secondFrame = 0

async function play() {
  cancelAnimationFrame(firstFrame)
  cancelAnimationFrame(secondFrame)
  active.value = false
  status.value = '准备重新播放…'
  await nextTick()
  firstFrame = requestAnimationFrame(() => {
    secondFrame = requestAnimationFrame(() => {
      active.value = true
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      status.value = reduced ? '减少动态效果：两组点改用颜色区分，并保留方向说明。' : '一组向左上，一组向右下；相同运动方向让它们被看作一组。'
    })
  })
}

onUnmounted(() => {
  cancelAnimationFrame(firstFrame)
  cancelAnimationFrame(secondFrame)
})
</script>

<template>
  <section class="design-demo gestalt-lab" aria-label="格式塔共同命运演示">
    <div class="design-demo__header gestalt-lab__header">
      <div>
        <strong class="design-demo__title">共同运动，产生新的分组</strong>
        <p class="design-demo__description">点的位置交错、外观一致；运动方向让两组关系显现。</p>
      </div>
      <button class="design-demo__action" type="button" @click="play">{{ active ? '重新播放' : '播放分组' }}</button>
    </div>

    <div class="design-demo__stage gestalt-lab__stage" :class="{ 'gestalt-lab__stage--active': active }">
      <div class="gestalt-lab__grid" aria-hidden="true">
        <span v-for="dot in dots" :key="dot.index" class="gestalt-lab__dot" :data-group="dot.group"></span>
      </div>
      <div class="gestalt-lab__directions" aria-hidden="true"><span>A · 左上</span><span>B · 右下</span></div>
    </div>
    <p class="design-demo__status" aria-live="polite">{{ status }}</p>
  </section>
</template>

<style scoped>
.gestalt-lab__header { align-items: center; }

.gestalt-lab__stage {
  display: grid;
  place-items: center;
  min-height: 230px;
  padding: 1.5rem;
}

.gestalt-lab__grid {
  display: grid;
  grid-template-columns: repeat(4, 34px);
  grid-template-rows: repeat(4, 34px);
  place-items: center;
}

.gestalt-lab__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--demo-accent);
  transition: transform 660ms cubic-bezier(0.16, 1, 0.3, 1), background-color 160ms ease;
}

.gestalt-lab__stage--active .gestalt-lab__dot[data-group='a'] {
  transform: translate(-70px, -17px);
}

.gestalt-lab__stage--active .gestalt-lab__dot[data-group='b'] {
  transform: translate(70px, 17px);
}

.gestalt-lab__directions {
  display: flex;
  justify-content: space-between;
  width: min(230px, 100%);
  margin-top: 0.25rem;
  color: var(--demo-muted);
  font-size: 0.73rem;
  opacity: 0;
  transition: opacity 200ms ease 450ms;
}

.gestalt-lab__stage--active .gestalt-lab__directions {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .gestalt-lab__stage--active .gestalt-lab__dot[data-group='a'],
  .gestalt-lab__stage--active .gestalt-lab__dot[data-group='b'] {
    transform: none;
  }

  .gestalt-lab__stage--active .gestalt-lab__dot[data-group='b'] {
    background: #5b8791;
  }
}

@media (max-width: 640px) {
  .gestalt-lab__header { display: block; }
  .gestalt-lab__header .design-demo__action { margin-top: 0.8rem; }
}
</style>
