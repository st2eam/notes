<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

type Mode = 'matrix' | 'center' | 'spot'
type Target = 'sky' | 'face'

const mode = ref<Mode>('matrix')
const target = ref<Target>('face')
const exposure = computed(() => {
  if (mode.value === 'matrix') return -0.2
  if (mode.value === 'center') return 0.5
  return target.value === 'sky' ? -1.3 : 1.2
})
const explanation = computed(() => {
  if (mode.value === 'matrix') return '综合亮部与暗部，人物和天空都作适度取舍。'
  if (mode.value === 'center') return '更重视中央人物，天空更容易变亮。'
  return target.value === 'sky'
    ? '以天空为参照压低曝光，人物可能变成剪影。'
    : '以人物为参照提高曝光，天空可能失去细节。'
})
</script>

<template>
  <section class="design-demo photo-lab metering-lab" aria-label="测光模式实验">
    <div class="photo-lab__header">
      <div>
        <strong class="design-demo__title">同一处逆光，测哪里会改变建议曝光</strong>
        <p>选择测光模式；点测光时再选择人物或天空。</p>
      </div>
    </div>
    <div class="photo-lab__choices" role="group" aria-label="测光模式">
      <button type="button" :aria-pressed="mode === 'matrix'" @click="mode = 'matrix'">评价测光</button>
      <button type="button" :aria-pressed="mode === 'center'" @click="mode = 'center'">中央重点</button>
      <button type="button" :aria-pressed="mode === 'spot'" @click="mode = 'spot'">点测光</button>
    </div>
    <div class="photo-lab__stage">
      <div class="photo-lab__photo photo-lab__photo--wide metering-lab__photo">
        <img :src="withBase('/photography/backlight.jpg')" alt="逆光站立的人物，背景是明亮天空" :style="{ filter: `brightness(${2 ** exposure})` }">
        <div v-if="mode === 'matrix'" class="metering-lab__grid" aria-hidden="true"></div>
        <div v-if="mode === 'center'" class="metering-lab__center" aria-hidden="true"></div>
        <template v-if="mode === 'spot'">
          <button type="button" class="metering-lab__target metering-lab__target--sky" :aria-pressed="target === 'sky'" aria-label="对天空点测光" @click="target = 'sky'">天空</button>
          <button type="button" class="metering-lab__target metering-lab__target--face" :aria-pressed="target === 'face'" aria-label="对人物点测光" @click="target = 'face'">人物</button>
        </template>
      </div>
    </div>
    <div class="photo-lab__readout" aria-live="polite"><span>模拟自动曝光 {{ exposure > 0 ? '+' : '' }}{{ exposure.toFixed(1) }} EV</span></div>
    <p class="photo-lab__hint" aria-live="polite">{{ explanation }}</p>
    <p class="photo-lab__note">教学模拟：展示 A/P/S 等自动曝光模式的可能取舍；在手动 M 档，改变测光模式只改变读数建议，不会自动改变已设定的曝光参数。</p>
    <p class="photo-lab__credit">照片：<a href="https://www.pexels.com/photo/sunlight-behind-woman-12374842/" target="_blank" rel="noopener noreferrer">Tony Frost / Pexels</a></p>
  </section>
</template>

<style scoped>
.metering-lab__grid {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(to right, transparent 33.2%, rgba(255, 255, 255, 0.7) 33.3% 33.5%, transparent 33.6% 66.5%, rgba(255, 255, 255, 0.7) 66.6% 66.8%, transparent 66.9%),
    linear-gradient(to bottom, transparent 33.2%, rgba(255, 255, 255, 0.7) 33.3% 33.5%, transparent 33.6% 66.5%, rgba(255, 255, 255, 0.7) 66.6% 66.8%, transparent 66.9%);
  opacity: 0.7;
  pointer-events: none;
}

.metering-lab__center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32%;
  aspect-ratio: 1;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.12), 0 0 7px #000;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.metering-lab__target {
  position: absolute;
  z-index: 1;
  min-width: 58px;
  padding: 0.3rem 0.5rem;
  border: 2px solid #fff;
  border-radius: 999px;
  background: rgba(10, 10, 10, 0.7);
  color: #fff;
  box-shadow: 0 1px 8px #0009;
}

.metering-lab__target[aria-pressed='true'] {
  background: #fff;
  color: #111;
}

.metering-lab__target--sky { top: 16%; left: 13%; }
.metering-lab__target--face { top: 33%; left: 50%; transform: translateX(-50%); }
</style>
