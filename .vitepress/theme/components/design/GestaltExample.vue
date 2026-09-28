<script setup lang="ts">
import { computed, ref } from 'vue'

type Kind = 'proximity' | 'similarity' | 'continuity' | 'closure'
const props = defineProps<{ kind: Kind }>()
const active = ref(false)
const copy: Record<Kind, { title: string; description: string; action: string; result: string }> = {
  proximity: {
    title: '把相近的点看作一组',
    description: '从等距排列开始，让点靠拢成两组。',
    action: '靠拢成组',
    result: '组内间距更小，即使没有边框，也能看出两个群组。',
  },
  similarity: {
    title: '外观一致，会跨越距离产生联系',
    description: '让散布在不同位置的点呈现相同颜色。',
    action: '显示相似点',
    result: '颜色相同的点被联系起来，尽管它们并不相邻。',
  },
  continuity: {
    title: '视线倾向沿着平滑路径前进',
    description: '两条曲线交叉时，试着追踪其中一条。',
    action: '追踪路径',
    result: '视线自然延续平滑曲线，而不是在交点突然转向。',
  },
  closure: {
    title: '缺了一段，仍能认出整体',
    description: '先观察不完整的轮廓，再切换到完整形状。',
    action: '补全轮廓',
    result: '补全后形状并没有变；留白时大脑已认出了圆。',
  },
}

const content = computed(() => copy[props.kind])
const proximityDots = Array.from({ length: 8 }, (_, index) => ({
  index,
  from: `${12 + index * 30}px`,
  to: `${index < 4 ? 12 + index * 18 : 166 + (index - 4) * 18}px`,
}))
const similarityDots = Array.from({ length: 12 }, (_, index) => ({ index, selected: [0, 5, 10].includes(index) }))
</script>

<template>
  <section class="design-demo gestalt-example" :aria-label="`${content.title}演示`">
    <div class="design-demo__header gestalt-example__header">
      <div>
        <strong class="design-demo__title">{{ content.title }}</strong>
        <p class="design-demo__description">{{ content.description }}</p>
      </div>
      <button type="button" :aria-pressed="active" @click="active = !active">{{ active ? '查看初始状态' : content.action }}</button>
    </div>

    <div class="design-demo__stage gestalt-example__stage" :class="{ 'gestalt-example__stage--active': active }">
      <div v-if="kind === 'proximity'" class="gestalt-example__proximity" aria-hidden="true">
        <span v-for="dot in proximityDots" :key="dot.index" :style="{ '--from-x': dot.from, '--to-x': dot.to }"></span>
      </div>
      <div v-else-if="kind === 'similarity'" class="gestalt-example__similarity" aria-hidden="true">
        <span v-for="dot in similarityDots" :key="dot.index" :data-selected="dot.selected"></span>
      </div>
      <svg v-else-if="kind === 'continuity'" class="gestalt-example__paths" viewBox="0 0 280 150" role="img" aria-label="两条平滑曲线相交">
        <path d="M20 115 C85 25 195 25 260 115" class="gestalt-example__path-base" />
        <path d="M20 35 C85 125 195 125 260 35" class="gestalt-example__path-base" />
        <path d="M20 115 C85 25 195 25 260 115" class="gestalt-example__path-highlight" />
      </svg>
      <svg v-else class="gestalt-example__closure" viewBox="0 0 220 150" role="img" :aria-label="active ? '完整的圆形轮廓' : '有缺口的圆形轮廓'">
        <circle cx="110" cy="75" r="53" class="gestalt-example__circle-open" />
        <circle cx="110" cy="75" r="53" class="gestalt-example__circle-complete" />
      </svg>
    </div>
    <p class="design-demo__status" aria-live="polite">{{ active ? content.result : '点击按钮，对比前后两种呈现。' }}</p>
  </section>
</template>

<style scoped>
.gestalt-example__header { align-items: center; }
.gestalt-example__stage { display: grid; place-items: center; min-height: 160px; padding: 1rem; }

.gestalt-example__proximity { position: relative; width: 260px; height: 90px; max-width: 100%; }
.gestalt-example__proximity span {
  position: absolute;
  top: 50%;
  left: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--demo-accent);
  transform: translate(var(--from-x), -50%);
  transition: transform 450ms cubic-bezier(0.16, 1, 0.3, 1);
}
.gestalt-example__stage--active .gestalt-example__proximity span { transform: translate(var(--to-x), -50%); }

.gestalt-example__similarity { display: grid; grid-template-columns: repeat(4, 28px); gap: 14px 20px; place-items: center; }
.gestalt-example__similarity span { width: 15px; height: 15px; border-radius: 50%; background: var(--demo-accent); transition: background-color 260ms ease, transform 260ms ease; }
.gestalt-example__stage--active .gestalt-example__similarity span[data-selected='false'] { background: var(--vp-c-text-3); transform: scale(0.85); }
.gestalt-example__stage--active .gestalt-example__similarity span[data-selected='true'] { transform: scale(1.2); }

.gestalt-example__paths { width: min(280px, 100%); height: auto; overflow: visible; fill: none; stroke-width: 3; stroke-linecap: round; }
.gestalt-example__path-base { stroke: var(--vp-c-text-3); }
.gestalt-example__path-highlight { stroke: var(--demo-accent); stroke-dasharray: 400; stroke-dashoffset: 400; transition: stroke-dashoffset 650ms cubic-bezier(0.16, 1, 0.3, 1); }
.gestalt-example__stage--active .gestalt-example__path-highlight { stroke-dashoffset: 0; }

.gestalt-example__closure { width: min(220px, 100%); height: 150px; fill: none; stroke: var(--demo-accent); stroke-width: 7; stroke-linecap: round; }
.gestalt-example__circle-open { stroke-dasharray: 63 20; }
.gestalt-example__circle-complete { opacity: 0; transition: opacity 300ms ease; }
.gestalt-example__stage--active .gestalt-example__circle-complete { opacity: 1; }

@media (max-width: 640px) {
  .gestalt-example__header { display: block; }
  .gestalt-example__header button { margin-top: 0.8rem; }
}
</style>
