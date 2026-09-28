<script setup lang="ts">
import { computed, ref } from 'vue'

type Kind = 'jakob' | 'miller' | 'occam' | 'pareto' | 'peakEnd'
const props = defineProps<{ kind: Kind }>()
const active = ref(false)
const found = ref(false)

const copy: Record<Kind, { title: string; description: string; action: string; result: string }> = {
  jakob: {
    title: '熟悉的位置，减少寻找',
    description: '同一个搜索入口，放在常见或出人意料的位置。',
    action: '换成陌生布局',
    result: '功能没有变，但入口偏离常见位置后，需要重新寻找。',
  },
  miller: {
    title: '把长信息拆成块',
    description: '观察同一串数字，连写与分组时的阅读感受。',
    action: '分成四组',
    result: '分组后有了清晰的停顿与结构；示例不用于测量记忆容量。',
  },
  occam: {
    title: '同一个目标，减少多余步骤',
    description: '任务只是下载当前 PDF，看看哪些步骤可以省略。',
    action: '简化流程',
    result: '保留完成任务所需的动作，删除与此目标无关的选择。',
  },
  pareto: {
    title: '先找影响最大的少数事项',
    description: '十项工作具有不同收益，试着聚焦前两项。',
    action: '聚焦前两项',
    result: '在这组示意数据中，2/10 项贡献了 80% 的收益；真实项目须先测量。',
  },
  peakEnd: {
    title: '同样的过程，不同的结尾',
    description: '保留中间经历，只改变最后一个接触点。',
    action: '改成积极结尾',
    result: '高峰时刻和结束时刻更容易留在印象里；这不是体验评分公式。',
  },
}

const content = computed(() => copy[props.kind])
const impacts = [45, 35, 5, 4, 3, 2, 2, 2, 1, 1]
const number = computed(() => active.value ? '583 719 264 801' : '583719264801')

function toggle() {
  active.value = !active.value
  found.value = false
}
</script>

<template>
  <section class="design-demo law-example" :aria-label="`${content.title}示例`">
    <div class="design-demo__header law-example__header">
      <div>
        <strong class="design-demo__title">{{ content.title }}</strong>
        <p class="design-demo__description">{{ content.description }}</p>
      </div>
      <button type="button" :aria-pressed="active" @click="toggle">{{ active ? '查看原始状态' : content.action }}</button>
    </div>

    <div v-if="kind === 'jakob'" class="design-demo__stage law-example__jakob" :class="{ 'law-example__jakob--unfamiliar': active }">
      <div class="law-example__nav">
        <strong>示例站点</strong>
        <span>首页</span>
        <span>分类</span>
        <button type="button" @click="found = true">搜索</button>
      </div>
      <p>{{ found ? '已找到搜索入口。' : '尝试找一找「搜索」。' }}</p>
    </div>

    <div v-else-if="kind === 'miller'" class="design-demo__stage law-example__miller" :class="{ 'law-example__miller--grouped': active }">
      <div class="law-example__number" aria-label="数字 583 719 264 801">{{ number }}</div>
      <div class="law-example__chunk-markers" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <span>{{ active ? '4 个信息块' : '12 个连续数字' }}</span>
    </div>

    <div v-else-if="kind === 'occam'" class="design-demo__stage law-example__occam">
      <strong>目标：下载当前 PDF</strong>
      <div v-if="!active" class="law-example__extra-steps" aria-label="多余的步骤示意">
        <span>进入下载中心</span><span>选择当前文档</span><span>再次确认格式</span>
      </div>
      <button class="design-demo__action" type="button" @click="found = true">下载 PDF</button>
      <span v-if="found" class="law-example__completion" role="status">已完成示例操作</span>
    </div>

    <div v-else-if="kind === 'pareto'" class="design-demo__stage law-example__pareto" :class="{ 'law-example__pareto--focused': active }">
      <div class="law-example__bars" role="img" aria-label="十项工作的收益示意，前两项分别为45%和35%，其余八项合计20%">
        <span v-for="(impact, index) in impacts" :key="index" :class="{ 'law-example__bar--top': index < 2 }" :style="{ height: `${16 + impact * 2}px` }"><small>{{ index + 1 }}</small></span>
      </div>
      <strong>{{ active ? '前 2 项 / 10 项 → 80% 示意收益' : '全部 10 项 → 100% 示意收益' }}</strong>
    </div>

    <div v-else class="design-demo__stage law-example__peak" :class="{ 'law-example__peak--positive': active }">
      <div class="law-example__moments" role="img" :aria-label="active ? '过程包含一次积极高峰，结尾也变积极' : '过程包含一次积极高峰，但结尾草率'">
        <div><span class="law-example__moment-dot"></span><small>开始</small></div>
        <div><span class="law-example__moment-dot"></span><small>过程</small></div>
        <div><span class="law-example__moment-dot law-example__moment-dot--peak"></span><small>惊喜高峰</small></div>
        <div><span class="law-example__moment-dot"></span><small>过程</small></div>
        <div><span class="law-example__moment-dot law-example__moment-dot--end"></span><small>{{ active ? '感谢与确认' : '草率结束' }}</small></div>
      </div>
    </div>

    <p class="design-demo__status" aria-live="polite">{{ active ? content.result : '切换状态，观察同一任务或内容如何被感知。' }}</p>
    <p v-if="kind === 'pareto'" class="design-demo__note">条形高度和百分比均为教学示意，不代表普遍的固定比例。</p>
  </section>
</template>

<style scoped>
.law-example__header { align-items: center; }
.law-example__jakob, .law-example__miller, .law-example__occam, .law-example__pareto, .law-example__peak { min-height: 150px; padding: 1.15rem; }

.law-example__jakob { display: grid; align-content: space-between; gap: 0.7rem; }
.law-example__nav { position: relative; display: flex; align-items: center; gap: 1rem; min-height: 82px; padding: 0.2rem 0; border-bottom: 1px solid var(--vp-c-divider); font-size: 0.8rem; }
.law-example__nav strong { margin-right: auto; white-space: nowrap; }
.law-example__nav button { white-space: nowrap; }
.law-example__jakob--unfamiliar .law-example__nav button { position: absolute; bottom: -48px; left: 0; }
.law-example__jakob--unfamiliar { min-height: 205px; }
.law-example__jakob p { margin: 0; color: var(--demo-muted); font-size: 0.78rem; }

.law-example__miller { display: grid; place-content: center; justify-items: center; gap: 0.8rem; }
.law-example__number { max-width: 100%; color: var(--demo-ink); font-size: clamp(1.05rem, 4vw, 1.6rem); font-variant-numeric: tabular-nums; font-weight: 700; letter-spacing: 0.03em; white-space: nowrap; }
.law-example__chunk-markers { display: flex; gap: 0.35rem; width: 100%; max-width: 245px; opacity: 0; transition: opacity 180ms ease; }
.law-example__chunk-markers span { flex: 1; height: 2px; background: var(--demo-accent); }
.law-example__miller--grouped .law-example__chunk-markers { opacity: 1; }
.law-example__miller > span { color: var(--demo-muted); font-size: 0.78rem; }

.law-example__occam { display: grid; justify-items: start; align-content: center; gap: 0.8rem; }
.law-example__occam strong { font-size: 0.88rem; }
.law-example__extra-steps { display: flex; flex-wrap: wrap; gap: 0.3rem; color: var(--demo-muted); font-size: 0.75rem; }
.law-example__extra-steps span:not(:last-child)::after { content: '→'; margin-left: 0.3rem; }
.law-example__completion { color: var(--demo-muted); font-size: 0.78rem; }

.law-example__pareto { display: grid; align-content: center; gap: 1rem; }
.law-example__bars { display: flex; align-items: end; justify-content: center; gap: clamp(0.25rem, 2vw, 0.8rem); height: 125px; }
.law-example__bars span { position: relative; width: min(9%, 28px); min-width: 12px; border-radius: 5px 5px 0 0; background: var(--vp-c-text-3); transition: background-color 240ms ease, opacity 240ms ease; }
.law-example__bars small { position: absolute; top: calc(100% + 4px); left: 50%; color: var(--demo-muted); font-size: 0.68rem; transform: translateX(-50%); }
.law-example__pareto--focused .law-example__bar--top { background: var(--demo-accent); }
.law-example__pareto--focused .law-example__bars span:not(.law-example__bar--top) { opacity: 0.35; }
.law-example__pareto strong { margin-top: 0.5rem; font-size: 0.85rem; font-variant-numeric: tabular-nums; text-align: center; }

.law-example__peak { display: grid; place-items: center; }
.law-example__moments { position: relative; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: center; width: 100%; max-width: 460px; }
.law-example__moments::before { content: ''; position: absolute; top: 35px; right: 10%; left: 10%; height: 1px; background: var(--vp-c-divider); }
.law-example__moments > div { z-index: 1; display: grid; justify-items: center; gap: 0.45rem; min-width: 0; }
.law-example__moment-dot { width: 15px; height: 15px; margin: 28px 0 0; border-radius: 50%; background: var(--vp-c-text-3); }
.law-example__moment-dot--peak { width: 21px; height: 21px; margin-top: 12px; background: var(--demo-accent); }
.law-example__moment-dot--end { background: var(--vp-c-text-3); transition: transform 360ms cubic-bezier(0.16, 1, 0.3, 1), background-color 260ms ease; }
.law-example__peak--positive .law-example__moment-dot--end { background: var(--demo-accent); transform: translateY(-17px) scale(1.35); }
.law-example__moments small { min-height: 2.8em; color: var(--demo-muted); font-size: 0.7rem; line-height: 1.4; text-align: center; }

@media (max-width: 640px) {
  .law-example__header { display: block; }
  .law-example__header button { margin-top: 0.8rem; }
  .law-example__nav { gap: 0.5rem; }
  .law-example__nav strong { font-size: 0.72rem; }
}
</style>
