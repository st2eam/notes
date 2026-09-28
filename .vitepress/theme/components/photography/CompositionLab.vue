<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

type Rule = 'thirds' | 'leading' | 'frame' | 'symmetry'
const rules: { key: Rule; label: string; description: string }[] = [
  { key: 'thirds', label: '三分法', description: '将人物移到交叉点附近，看看留白如何改变视线。' },
  { key: 'leading', label: '引导线', description: '桥梁两侧的线条把视线引向远处。' },
  { key: 'frame', label: '框架构图', description: '利用桥梁结构围住远处主体，形成画中画。' },
  { key: 'symmetry', label: '对称', description: '将消失点放在中轴附近，比较画面的平衡感。' },
]
const rule = ref<Rule>('thirds')
const x = ref(-7)
const y = ref(0)
const current = computed(() => rules.find((item) => item.key === rule.value)!)
const photo = computed(() => rule.value === 'thirds' ? withBase('/photography/backlight.jpg') : withBase('/photography/bridge.jpg'))
const photoStyle = computed(() => ({ transform: `translate(${x.value}%, ${y.value}%) scale(1.25)` }))
let dragStart: { pointerX: number; pointerY: number; x: number; y: number } | null = null

const clamp = (value: number) => Math.max(-10, Math.min(10, value))

function selectRule(value: Rule) {
  rule.value = value
  x.value = value === 'thirds' ? -7 : 0
  y.value = 0
}

function startDrag(event: PointerEvent) {
  const stage = event.currentTarget as HTMLElement
  stage.setPointerCapture(event.pointerId)
  dragStart = { pointerX: event.clientX, pointerY: event.clientY, x: x.value, y: y.value }
}

function moveDrag(event: PointerEvent) {
  if (!dragStart) return
  const stage = event.currentTarget as HTMLElement
  x.value = Math.round(clamp(dragStart.x + (event.clientX - dragStart.pointerX) / stage.clientWidth * 100))
  y.value = Math.round(clamp(dragStart.y + (event.clientY - dragStart.pointerY) / stage.clientHeight * 100))
}

function endDrag() {
  dragStart = null
}
</script>

<template>
  <section class="design-demo photo-lab composition-lab" aria-label="构图法则实验">
    <div class="photo-lab__header">
      <div>
        <strong class="design-demo__title">换一种取景，画面的重心也会变</strong>
        <p>选择构图法则，再拖动画面或使用滑杆调整裁切位置。</p>
      </div>
    </div>
    <div class="photo-lab__choices" role="group" aria-label="构图法则">
      <button v-for="item in rules" :key="item.key" type="button" :aria-pressed="rule === item.key" @click="selectRule(item.key)">{{ item.label }}</button>
    </div>
    <div class="photo-lab__stage composition-lab__stage" @pointerdown="startDrag" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag" @lostpointercapture="endDrag">
      <div class="photo-lab__photo composition-lab__photo" role="img" :aria-label="rule === 'thirds' ? '可拖动的逆光人物取景照片' : '可拖动的桥梁取景照片'">
        <img :src="photo" alt="" :style="photoStyle" draggable="false">
        <svg class="composition-lab__guides" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true">
          <g v-if="rule === 'thirds'">
            <path d="M33.33 0v75 M66.67 0v75 M0 25h100 M0 50h100" />
            <circle cx="33.33" cy="25" r="1.6" /><circle cx="66.67" cy="25" r="1.6" />
            <circle cx="33.33" cy="50" r="1.6" /><circle cx="66.67" cy="50" r="1.6" />
          </g>
          <g v-else-if="rule === 'leading'">
            <path d="M0 75 50 41 100 75 M0 43 50 41 100 43" />
            <circle cx="50" cy="41" r="2" />
          </g>
          <g v-else-if="rule === 'frame'">
            <path d="M12 16 Q50 -2 88 16 L88 69 M12 16v53 M12 69h76" />
            <circle cx="50" cy="42" r="2" />
          </g>
          <g v-else>
            <path d="M50 0v75 M0 37.5h100" />
            <circle cx="50" cy="37.5" r="2" />
          </g>
        </svg>
        <span class="composition-lab__badge">拖动画面取景</span>
      </div>
    </div>
    <div class="photo-lab__controls composition-lab__controls">
      <label class="photo-lab__field">
        <span>水平位置 <output>{{ x > 0 ? '+' : '' }}{{ x }}</output></span>
        <input v-model.number="x" type="range" min="-10" max="10" step="1" aria-label="取景水平位置">
      </label>
      <label class="photo-lab__field">
        <span>垂直位置 <output>{{ y > 0 ? '+' : '' }}{{ y }}</output></span>
        <input v-model.number="y" type="range" min="-10" max="10" step="1" aria-label="取景垂直位置">
      </label>
    </div>
    <p class="photo-lab__hint" aria-live="polite">{{ current.description }}</p>
    <p class="photo-lab__note">辅助线只是观察工具；移动取景时留意主体、留白与背景的关系。</p>
    <p class="photo-lab__credit">照片：<a href="https://www.pexels.com/photo/sunlight-behind-woman-12374842/" target="_blank" rel="noopener noreferrer">Tony Frost / Pexels</a>、<a href="https://www.pexels.com/photo/modern-pedestrian-bridge-with-dramatic-symmetry-37248909/" target="_blank" rel="noopener noreferrer">jose Figueroa Díaz / Pexels</a></p>
  </section>
</template>

<style scoped>
.composition-lab__stage {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.composition-lab__stage:active { cursor: grabbing; }

.composition-lab__photo img {
  object-position: center;
  pointer-events: none;
}

.composition-lab__guides {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  fill: none;
  stroke: #fff;
  stroke-width: 0.35;
  filter: drop-shadow(0 1px 2px #000c);
  pointer-events: none;
}

.composition-lab__guides circle { fill: #fff; stroke: #222; stroke-width: 0.4; }

.composition-lab__badge {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  background: #111a;
  color: #fff;
  font-size: 0.74rem;
  pointer-events: none;
}

.composition-lab__controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }

@media (max-width: 640px) {
  .composition-lab__controls { grid-template-columns: 1fr; }
}
</style>
