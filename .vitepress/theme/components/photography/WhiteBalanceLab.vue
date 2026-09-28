<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

const kelvin = ref(5500)
const tint = computed(() => {
  const distance = kelvin.value - 5500
  return {
    backgroundColor: distance >= 0 ? '#f5a54d' : '#4d8dcc',
    opacity: Math.abs(distance) / (distance >= 0 ? 3500 : 3000) * 0.48,
  }
})
const mood = computed(() => kelvin.value < 4700 ? '偏冷，蓝色更明显' : kelvin.value > 6300 ? '偏暖，黄色更明显' : '接近中性')
</script>

<template>
  <section class="design-demo photo-lab whitebalance-lab" aria-label="白平衡实验">
    <div class="photo-lab__header">
      <div>
        <strong class="design-demo__title">固定光线，改变相机白平衡</strong>
        <p>观察白色桌面与花朵：相机 K 值越高，成片越暖。</p>
      </div>
    </div>
    <div class="photo-lab__choices" role="group" aria-label="白平衡预设">
      <button v-for="preset in [3200, 5500, 7500]" :key="preset" type="button" :aria-pressed="kelvin === preset" @click="kelvin = preset">{{ preset }} K</button>
    </div>
    <div class="photo-lab__controls whitebalance-lab__controls">
      <label class="photo-lab__field">
        <span>相机白平衡设定 <output>{{ kelvin }} K</output></span>
        <input v-model.number="kelvin" type="range" min="2500" max="9000" step="100" aria-label="相机白平衡 K 值">
      </label>
    </div>
    <div class="photo-lab__stage">
      <div class="photo-lab__photo whitebalance-lab__photo" role="img" aria-label="花瓶与白色桌面的冷暖色调预览">
        <img :src="withBase('/photography/vase.jpg')" alt="">
        <div class="whitebalance-lab__tint" :style="tint" aria-hidden="true"></div>
      </div>
    </div>
    <div class="photo-lab__readout" aria-live="polite"><span>{{ kelvin }} K</span><span>{{ mood }}</span></div>
    <p class="photo-lab__note">教学模拟：场景光源保持不变，滑杆代表相机的手动 K 设定。暖光光源本身 K 值较低，但相机设定调高 K 值会让同一画面更暖；实际效果取决于现场光线与相机处理。</p>
    <p class="photo-lab__credit">照片：<a href="https://www.pexels.com/photo/table-with-vase-of-flowers-in-room-5812892/" target="_blank" rel="noopener noreferrer">Khoa Võ / Pexels</a></p>
  </section>
</template>

<style scoped>
.whitebalance-lab__controls { grid-template-columns: minmax(0, 1fr); }
.whitebalance-lab__photo img { object-position: center 53%; filter: sepia(0.13) saturate(0.92); }
.whitebalance-lab__tint {
  position: absolute;
  inset: 0;
  mix-blend-mode: color;
  pointer-events: none;
}
</style>
