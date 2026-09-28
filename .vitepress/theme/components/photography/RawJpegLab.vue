<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const width = 540
const height = 320
const highlights = ref(0)
const shadows = ref(0)
const ready = ref(false)
const rawCanvas = ref<HTMLCanvasElement | null>(null)
const jpegCanvas = ref<HTMLCanvasElement | null>(null)
let sourcePixels: Uint8ClampedArray | null = null
let image: HTMLImageElement | null = null
let frame = 0

const clamp = (value: number) => Math.max(0, Math.min(1, value))

function render() {
  if (!sourcePixels || !rawCanvas.value || !jpegCanvas.value) return
  const rawContext = rawCanvas.value.getContext('2d')
  const jpegContext = jpegCanvas.value.getContext('2d')
  if (!rawContext || !jpegContext) return

  const raw = rawContext.createImageData(width, height)
  const jpeg = jpegContext.createImageData(width, height)
  const highlightAmount = highlights.value / 100
  const shadowAmount = shadows.value / 100

  for (let i = 0; i < sourcePixels.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      const original = sourcePixels[i + channel] / 255
      const baked = clamp((original - 0.5) * 1.55 + 0.5)
      const recover = original > 0.5 ? highlightAmount : shadowAmount
      const rawValue = baked + (original - baked) * recover
      const jpegValue = baked > 0.5
        ? baked - highlightAmount * 0.32 * (baked - 0.5)
        : baked + shadowAmount * 0.32 * (0.5 - baked)
      raw.data[i + channel] = Math.round(clamp(rawValue) * 255)
      jpeg.data[i + channel] = Math.round(clamp(jpegValue) * 255)
    }
    raw.data[i + 3] = 255
    jpeg.data[i + 3] = 255
  }
  rawContext.putImageData(raw, 0, 0)
  jpegContext.putImageData(jpeg, 0, 0)
  ready.value = true
}

function scheduleRender() {
  if (frame) cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    frame = 0
    render()
  })
}

watch([highlights, shadows], scheduleRender)

onMounted(() => {
  image = new Image()
  image.onload = () => {
    if (!image) return
    const source = document.createElement('canvas')
    source.width = width
    source.height = height
    const context = source.getContext('2d', { willReadFrequently: true })
    if (!context) return
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const drawnWidth = image.naturalWidth * scale
    const drawnHeight = image.naturalHeight * scale
    context.drawImage(image, (width - drawnWidth) / 2, (height - drawnHeight) / 2, drawnWidth, drawnHeight)
    sourcePixels = context.getImageData(0, 0, width, height).data
    render()
  }
  image.src = withBase('/photography/backlight.jpg')
})

onUnmounted(() => {
  if (frame) cancelAnimationFrame(frame)
  if (image) image.onload = null
  image = null
})
</script>

<template>
  <section class="design-demo photo-lab raw-jpeg-lab" aria-label="RAW 与 JPEG 后期余量实验">
    <div class="photo-lab__header">
      <div>
        <strong class="design-demo__title">拍完再调整，看看高光和阴影的余量</strong>
        <p>两侧从相同的示意画面出发；向右拖动，观察细节是否还能显现。</p>
      </div>
    </div>
    <div class="photo-lab__controls raw-jpeg-lab__controls">
      <label class="photo-lab__field">
        <span>压低高光 <output>{{ highlights }}%</output></span>
        <input v-model.number="highlights" type="range" min="0" max="100" step="1" aria-label="压低高光">
      </label>
      <label class="photo-lab__field">
        <span>提亮阴影 <output>{{ shadows }}%</output></span>
        <input v-model.number="shadows" type="range" min="0" max="100" step="1" aria-label="提亮阴影">
      </label>
    </div>
    <div class="raw-jpeg-lab__previews">
      <div class="raw-jpeg-lab__preview">
        <strong>RAW 示意</strong>
        <div class="raw-jpeg-lab__frame" role="img" aria-label="RAW 后期余量模拟预览">
          <img v-if="!ready" :src="withBase('/photography/backlight.jpg')" alt="">
          <canvas ref="rawCanvas" :width="width" :height="height" :class="{ 'raw-jpeg-lab__canvas--ready': ready }"></canvas>
        </div>
        <span>保留更多可调整的亮暗信息</span>
      </div>
      <div class="raw-jpeg-lab__preview">
        <strong>JPEG 示意</strong>
        <div class="raw-jpeg-lab__frame" role="img" aria-label="JPEG 后期余量模拟预览">
          <img v-if="!ready" :src="withBase('/photography/backlight.jpg')" alt="">
          <canvas ref="jpegCanvas" :width="width" :height="height" :class="{ 'raw-jpeg-lab__canvas--ready': ready }"></canvas>
        </div>
        <span>已压成纯白或纯黑的区域只会整体变灰</span>
      </div>
    </div>
    <p class="photo-lab__note">教学模拟：素材是普通照片，未读取或处理真正的 RAW 文件；效果只说明已裁切细节与保留细节的差异，实际后期余量因相机、曝光和文件而异。</p>
    <p class="photo-lab__credit">照片：<a href="https://www.pexels.com/photo/sunlight-behind-woman-12374842/" target="_blank" rel="noopener noreferrer">Tony Frost / Pexels</a></p>
  </section>
</template>

<style scoped>
.raw-jpeg-lab__controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.raw-jpeg-lab__previews { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; margin-top: 1rem; }
.raw-jpeg-lab__preview { min-width: 0; padding: 0.6rem; border: 1px solid var(--photo-border); border-radius: 10px; background: var(--photo-panel); }
.raw-jpeg-lab__preview strong { display: block; margin-bottom: 0.4rem; font-size: 0.85rem; }
.raw-jpeg-lab__preview span { display: block; margin-top: 0.45rem; color: var(--photo-muted); font-size: 0.75rem; line-height: 1.5; }
.raw-jpeg-lab__frame { position: relative; overflow: hidden; aspect-ratio: 540 / 320; border-radius: 6px; background: #242321; }
.raw-jpeg-lab__frame img,
.raw-jpeg-lab__frame canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; }
.raw-jpeg-lab__frame canvas { visibility: hidden; }
.raw-jpeg-lab__frame canvas.raw-jpeg-lab__canvas--ready { visibility: visible; }

@media (max-width: 640px) {
  .raw-jpeg-lab__controls,
  .raw-jpeg-lab__previews { grid-template-columns: 1fr; }
}
</style>
