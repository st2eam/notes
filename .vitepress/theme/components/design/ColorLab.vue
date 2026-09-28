<script setup lang="ts">
import { computed, ref } from 'vue'

type Scheme = 'complementary' | 'analogous' | 'triadic'

const schemes: { key: Scheme; label: string }[] = [
  { key: 'complementary', label: '互补色' },
  { key: 'analogous', label: '类似色' },
  { key: 'triadic', label: '三等分' },
]

const hue = ref(34)
const scheme = ref<Scheme>('complementary')
const wrap = (value: number) => (value + 360) % 360

const palette = computed(() => {
  const base = hue.value
  if (scheme.value === 'complementary') {
    return [
      { label: '基色', hue: base },
      { label: '互补色', hue: wrap(base + 180) },
    ]
  }
  if (scheme.value === 'analogous') {
    return [
      { label: '相邻色 A', hue: wrap(base - 30) },
      { label: '基色', hue: base },
      { label: '相邻色 B', hue: wrap(base + 30) },
    ]
  }
  return [
    { label: '基色', hue: base },
    { label: '三等分 A', hue: wrap(base + 120) },
    { label: '三等分 B', hue: wrap(base + 240) },
  ]
})

const supportHue = computed(() => scheme.value === 'analogous' ? wrap(hue.value - 30) : palette.value[1].hue)
const accentHue = computed(() => scheme.value === 'complementary' ? palette.value[1].hue : palette.value[2].hue)

function luminanceOfHsl(h: number, s: number, l: number) {
  const saturation = s / 100
  const lightness = l / 100
  const a = saturation * Math.min(lightness, 1 - lightness)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const value = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4)
}

const accentText = computed(() => {
  const luminance = luminanceOfHsl(accentHue.value, 62, 38)
  return (1.05 / (luminance + 0.05)) >= 4.5 ? '#ffffff' : '#101010'
})

const previewStyle = computed(() => ({
  '--color-preview-bg': `hsl(${hue.value} 38% 93%)`,
  '--color-preview-surface': `hsl(${supportHue.value} 44% 82%)`,
  '--color-preview-accent': `hsl(${accentHue.value} 62% 38%)`,
  '--color-preview-accent-text': accentText.value,
  '--color-preview-ink': `hsl(${hue.value} 20% 16%)`,
}))

function markerPosition(value: number) {
  return { '--marker-angle': `${value}deg` }
}
</script>

<template>
  <section class="design-demo color-lab" aria-label="色彩关系实验台">
    <div class="design-demo__header">
      <div>
        <strong class="design-demo__title">转动色轮，观察配色关系</strong>
        <p class="design-demo__description">色轮上的标记会随基色移动；下方界面同步使用这组配色。</p>
      </div>
    </div>

    <div class="design-demo__controls">
      <div class="design-demo__field">
        <span>配色方案</span>
        <div class="design-demo__choices" role="group" aria-label="配色方案">
          <button v-for="item in schemes" :key="item.key" type="button" :aria-pressed="scheme === item.key" @click="scheme = item.key">
            {{ item.label }}
          </button>
        </div>
      </div>
      <label class="design-demo__field design-demo__field--range">
        <span>基色色相 <output>{{ hue }}°</output></span>
        <input v-model.number="hue" type="range" min="0" max="359" step="1" aria-label="基色色相">
      </label>
    </div>

    <div class="design-demo__stage color-lab__stage">
      <div class="color-lab__wheel-area">
        <div class="color-lab__wheel" aria-hidden="true">
          <div class="color-lab__wheel-center">色相<br>360°</div>
          <span v-for="(item, index) in palette" :key="index" class="color-lab__marker" :style="markerPosition(item.hue)">{{ index + 1 }}</span>
        </div>
        <div class="color-lab__swatches">
          <div v-for="(item, index) in palette" :key="index" class="color-lab__swatch">
            <span class="color-lab__swatch-color" :style="{ backgroundColor: `hsl(${item.hue} 68% 52%)` }"></span>
            <span><strong>{{ index + 1 }} · {{ item.label }}</strong><small>H {{ item.hue }}°</small></span>
          </div>
        </div>
      </div>

      <div class="color-lab__preview-wrap" :style="previewStyle">
        <span class="color-lab__preview-label">60–30–10 界面预览</span>
        <div class="color-lab__preview">
          <div class="color-lab__preview-panel">
            <strong>探索新的可能</strong>
            <p>主色留给背景，辅助色组织内容，强调色提示行动。</p>
            <span class="color-lab__preview-button">查看示例</span>
          </div>
        </div>
        <div class="color-lab__legend">
          <span><i class="color-lab__legend-bg"></i>60% 背景</span>
          <span><i class="color-lab__legend-surface"></i>30% 内容</span>
          <span><i class="color-lab__legend-accent"></i>10% 强调</span>
        </div>
      </div>
    </div>
    <p class="design-demo__note">比例为教学示意；实际界面仍需逐项检查文字与背景的对比度。</p>
  </section>
</template>

<style scoped>
.color-lab__stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: center;
  padding: clamp(1rem, 3vw, 1.5rem);
}

.color-lab__wheel-area {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  align-items: center;
  gap: 0.8rem;
  min-width: 0;
}

.color-lab__wheel {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(#f33, #ff3, #3f3, #3ff, #33f, #f3f, #f33);
}

.color-lab__wheel-center {
  position: absolute;
  inset: 24%;
  display: grid;
  place-content: center;
  border-radius: 50%;
  background: var(--demo-paper);
  color: var(--demo-muted);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
  text-align: center;
}

.color-lab__marker {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--demo-paper);
  border-radius: 50%;
  background: var(--demo-ink);
  color: var(--demo-paper);
  font-size: 0.72rem;
  font-weight: 700;
  transform: translate(-50%, -50%) rotate(var(--marker-angle)) translateY(-72px) rotate(calc(0deg - var(--marker-angle)));
  transition: transform 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

.color-lab__swatches {
  display: grid;
  gap: 0.65rem;
}

.color-lab__swatch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  font-size: 0.73rem;
  line-height: 1.3;
}

.color-lab__swatch-color {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  border-radius: 6px;
  transition: background-color 360ms ease;
}

.color-lab__swatch strong,
.color-lab__swatch small {
  display: block;
}

.color-lab__swatch strong { color: var(--demo-ink); }
.color-lab__swatch small { color: var(--demo-muted); font-size: 0.7rem; font-variant-numeric: tabular-nums; }

.color-lab__preview-wrap {
  min-width: 0;
  color: var(--color-preview-ink);
}

.color-lab__preview-label {
  display: block;
  margin-bottom: 0.55rem;
  color: var(--demo-muted);
  font-size: 0.73rem;
  font-weight: 600;
}

.color-lab__preview {
  min-height: 185px;
  padding: 1.1rem;
  border-radius: 10px;
  background: var(--color-preview-bg);
  transition: background-color 360ms ease;
}

.color-lab__preview-panel {
  max-width: 240px;
  padding: 0.85rem;
  border-radius: 8px;
  background: var(--color-preview-surface);
  transition: background-color 360ms ease;
}

.color-lab__preview-panel strong {
  color: var(--color-preview-ink);
  font-size: 0.85rem;
}

.color-lab__preview-panel p {
  margin: 0.4rem 0 0.65rem;
  color: var(--color-preview-ink);
  font-size: 0.73rem;
  line-height: 1.5;
}

.color-lab__preview-button {
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  background: var(--color-preview-accent);
  color: var(--color-preview-accent-text);
  font-size: 0.72rem;
  font-weight: 700;
  transition: background-color 360ms ease, color 360ms ease;
}

.color-lab__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.7rem;
  margin-top: 0.6rem;
  color: var(--demo-muted);
  font-size: 0.69rem;
}

.color-lab__legend span { display: inline-flex; align-items: center; gap: 0.25rem; }
.color-lab__legend i { width: 8px; height: 8px; border-radius: 2px; }
.color-lab__legend-bg { background: var(--color-preview-bg); }
.color-lab__legend-surface { background: var(--color-preview-surface); }
.color-lab__legend-accent { background: var(--color-preview-accent); }

@media (max-width: 480px) {
  .color-lab__wheel-area { grid-template-columns: 1fr; justify-items: center; }
  .color-lab__swatches { width: 100%; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .color-lab__swatch { align-items: flex-start; }
}
</style>
