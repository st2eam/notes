<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

const apertures = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16]
const shutters = [
  { label: '1/2000 s', seconds: 1 / 2000 },
  { label: '1/1000 s', seconds: 1 / 1000 },
  { label: '1/500 s', seconds: 1 / 500 },
  { label: '1/250 s', seconds: 1 / 250 },
  { label: '1/125 s', seconds: 1 / 125 },
  { label: '1/60 s', seconds: 1 / 60 },
  { label: '1/30 s', seconds: 1 / 30 },
  { label: '1/8 s', seconds: 1 / 8 },
  { label: '1/2 s', seconds: 1 / 2 },
  { label: '1 s', seconds: 1 },
]
const isos = [100, 200, 400, 800, 1600, 3200, 6400]

const apertureIndex = ref(3)
const shutterIndex = ref(4)
const isoIndex = ref(1)
const scene = ref<'portrait' | 'waterfall'>('portrait')
const comparing = ref(false)

const aperture = computed(() => apertures[comparing.value ? 3 : apertureIndex.value])
const shutter = computed(() => shutters[comparing.value ? 4 : shutterIndex.value])
const iso = computed(() => isos[comparing.value ? 1 : isoIndex.value])
const relativeEv = computed(() => Math.log2(
  (shutter.value.seconds / (1 / 125)) * (4 / aperture.value) ** 2 * (iso.value / 200),
))
const exposureLabel = computed(() => {
  const value = relativeEv.value
  return `${value > 0.05 ? '+' : ''}${value.toFixed(1)} EV`
})
const exposureHint = computed(() => {
  if (relativeEv.value > 1.5) return '明显偏亮：缩小光圈、加快快门或降低 ISO。'
  if (relativeEv.value < -1.5) return '明显偏暗：增大光圈、放慢快门或提高 ISO。'
  return '亮度接近教学基准，继续改变参数观察画面质感。'
})
const depthBlur = computed(() => Math.max(0, (16 - aperture.value) * 0.8))
const motionBlur = computed(() => Math.min(18, Math.max(0, Math.log2(shutter.value.seconds * 125) * 2.7)))
const noiseOpacity = computed(() => Math.min(0.44, Math.max(0, Math.log2(iso.value / 200) * 0.085)))
const brightness = computed(() => 2 ** Math.max(-2.3, Math.min(2.3, relativeEv.value)))
const photoStyle = computed(() => ({ filter: `brightness(${brightness.value.toFixed(3)})` }))

function reset() {
  apertureIndex.value = 3
  shutterIndex.value = 4
  isoIndex.value = 1
  comparing.value = false
}
</script>

<template>
  <section class="design-demo photo-lab exposure-lab" aria-label="曝光三要素实验">
    <div class="photo-lab__header">
      <div>
        <strong class="design-demo__title">转动相机参数，观察画面怎么变</strong>
        <p>人像看景深，流水看运动；光圈、快门与 ISO 同时影响亮度。</p>
      </div>
      <button type="button" @click="reset">重置参数</button>
    </div>

    <div class="photo-lab__choices" role="group" aria-label="预览场景">
      <button type="button" :aria-pressed="scene === 'portrait'" @click="scene = 'portrait'">人像 · 景深</button>
      <button type="button" :aria-pressed="scene === 'waterfall'" @click="scene = 'waterfall'">流水 · 快门</button>
    </div>

    <div class="photo-lab__controls">
      <label class="photo-lab__field">
        <span>光圈 <output>f/{{ apertures[apertureIndex] }}</output></span>
        <input v-model.number="apertureIndex" type="range" min="0" max="7" step="1" aria-label="光圈">
      </label>
      <label class="photo-lab__field">
        <span>快门 <output>{{ shutters[shutterIndex].label }}</output></span>
        <input v-model.number="shutterIndex" type="range" min="0" max="9" step="1" aria-label="快门速度">
      </label>
      <label class="photo-lab__field">
        <span>ISO <output>{{ isos[isoIndex] }}</output></span>
        <input v-model.number="isoIndex" type="range" min="0" max="6" step="1" aria-label="ISO 感光度">
      </label>
    </div>

    <div class="photo-lab__stage">
      <div class="photo-lab__photo exposure-lab__photo" :class="`exposure-lab__photo--${scene}`" :style="photoStyle" role="img" :aria-label="scene === 'portrait' ? '人像照片，预览景深、亮度和噪点' : '流水照片，预览运动模糊、亮度和噪点'">
        <template v-if="scene === 'portrait'">
          <img :src="withBase('/photography/backlight.jpg')" alt="" :style="{ filter: `blur(${depthBlur}px)` }">
          <img class="exposure-lab__portrait-focus" :src="withBase('/photography/backlight.jpg')" alt="">
        </template>
        <template v-else>
          <img :src="withBase('/photography/waterfall.jpg')" alt="">
          <img class="exposure-lab__water-motion" :src="withBase('/photography/waterfall.jpg')" alt="" :style="{ filter: `blur(${motionBlur}px)` }">
        </template>
        <div class="exposure-lab__noise" :style="{ opacity: noiseOpacity, backgroundImage: `url(${withBase('/photography/noise.svg')})` }" aria-hidden="true"></div>
      </div>
    </div>

    <div class="photo-lab__readout" aria-live="polite">
      <span>相对曝光 {{ exposureLabel }}</span>
      <span>景深 {{ aperture <= 2.8 ? '浅' : aperture >= 8 ? '深' : '适中' }}</span>
      <span>运动 {{ shutter.seconds >= 1 / 30 ? '容易拖影' : '较易凝固' }}</span>
      <span>噪点 {{ iso >= 1600 ? '明显' : iso >= 800 ? '增加' : '较少' }}</span>
    </div>
    <p class="photo-lab__hint" aria-live="polite">{{ exposureHint }}</p>
    <button
      type="button"
      class="exposure-lab__compare"
      :aria-pressed="comparing"
      @pointerdown.prevent="comparing = true"
      @pointerup="comparing = false"
      @pointercancel="comparing = false"
      @pointerleave="comparing = false"
      @keydown.space.prevent="comparing = true"
      @keyup.space.prevent="comparing = false"
      @keydown.enter.prevent="comparing = true"
      @keyup.enter.prevent="comparing = false"
      @blur="comparing = false"
    >按住对照基准</button>
    <p class="photo-lab__note">教学模拟：f/4、1/125 s、ISO 200 为相对曝光基准；真实景深与拖影还受焦距、距离和主体速度影响。</p>
    <p class="photo-lab__credit">照片：<a href="https://www.pexels.com/photo/sunlight-behind-woman-12374842/" target="_blank" rel="noopener noreferrer">Tony Frost / Pexels</a>、<a href="https://www.pexels.com/photo/waterfalls-on-rocks-20141672/" target="_blank" rel="noopener noreferrer">Nandakumar R / Pexels</a></p>
  </section>
</template>

<style scoped>
.exposure-lab__photo--portrait img {
  object-position: center;
}

.exposure-lab__photo--waterfall img {
  object-position: center 53%;
}

.exposure-lab__portrait-focus {
  mask-image: radial-gradient(ellipse 34% 51% at 50% 65%, #000 47%, transparent 87%);
}

.exposure-lab__water-motion {
  mask-image: radial-gradient(ellipse 34% 25% at 29% 29%, #000 47%, transparent 85%),
    radial-gradient(ellipse 36% 27% at 66% 67%, #000 48%, transparent 85%);
}

.exposure-lab__noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.exposure-lab__compare {
  margin-top: 0.85rem;
  touch-action: none;
  user-select: none;
}
</style>
