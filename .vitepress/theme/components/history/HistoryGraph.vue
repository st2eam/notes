<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { nodes, periods } from './history-data.mjs'
import { themes, readingLenses, readingPaths, graphNodes, graphRelations, graphLabels, graphRelationSources, findPath } from './history-network.mjs'
import { layoutAtlas, edgePath, fitView, labelLines } from './history-scene.mjs'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 2.4

const activePeriod = ref('classical')
const activeNodeId = ref('han')
const activeRelationId = ref<string | null>(null)
const showComparisons = ref(true)
const query = ref('')
const pathFrom = ref('han')
const pathTo = ref('rome')
const pathRequested = ref(false)
const sceneRef = ref<SVGSVGElement | null>(null)
const pageFullscreen = ref(false)
const viewport = ref({ width: 900, height: 570 })
const panning = ref(false)
const userMoved = ref(false)

const positions = layoutAtlas(graphNodes, graphRelations)
const byId = new Map(graphNodes.map((node) => [node.id, node]))
const byRelationId = new Map(graphRelations.map((edge) => [edge.id, edge]))
const activeNode = computed(() => byId.get(activeNodeId.value) ?? nodes[0])
const activeRelation = computed(() => activeRelationId.value ? byRelationId.get(activeRelationId.value) : null)
const nodeRelations = computed(() => graphRelations.filter((edge) => edge.from === activeNodeId.value || edge.to === activeNodeId.value))
const historyRelations = computed(() => nodeRelations.value.filter((edge) => edge.type !== 'theme'))
const studyThemes = computed(() => themes.filter((theme) => nodeRelations.value.some((edge) => edge.type === 'theme' && edge.to === theme.id)))
const bookStops = computed(() => readingPaths.flatMap((book) => book.steps.flatMap((step, index) => step.node === activeNodeId.value ? [{ book, step, prev: book.steps[index - 1] ?? null, next: book.steps[index + 1] ?? null }] : [])))
const path = computed(() => pathRequested.value ? findPath(pathFrom.value, pathTo.value) : [])
const pathSteps = computed(() => {
  let current = pathFrom.value
  return path.value.map((edge) => {
    const next = edge.from === current ? edge.to : edge.from
    const step = { edge, from: current, to: next }
    current = next
    return step
  })
})
const searchMatches = computed(() => {
  const term = query.value.trim()
  if (!term) return []
  return graphNodes.filter((node) => {
    const books = readingPaths.flatMap((book) => book.steps.filter((step) => step.node === node.id).map((step) => `${book.title}${step.cite}${step.point}`)).join('')
    const events = (node.events ?? []).map((event) => `${event.date}${event.place ?? ''}${event.title}${event.note}`).join('')
    return `${node.title}${node.place ?? ''}${node.summary}${events}${readingLenses[node.id as keyof typeof readingLenses]?.question ?? ''}${books}`.includes(term)
  }).slice(0, 8)
})
const visibleIds = computed(() => {
  if (activePeriod.value === 'all') return new Set(graphNodes.map((node) => node.id))
  const coreIds = new Set(nodes.filter((node) => node.period === activePeriod.value).map((node) => node.id))
  const ids = new Set(coreIds)
  for (const edge of graphRelations.filter((item) => item.type !== 'theme')) {
    if (coreIds.has(edge.from)) ids.add(edge.to)
    if (coreIds.has(edge.to)) ids.add(edge.from)
  }
  for (const edge of graphRelations.filter((item) => item.type === 'theme')) {
    if (ids.has(edge.from)) ids.add(edge.to)
  }
  return ids
})
const visibleNodes = computed(() => nodes.filter((node) => visibleIds.value.has(node.id)).sort((a, b) => a.year - b.year))
const visibleListNodes = computed(() => [...visibleNodes.value, ...themes.filter((theme) => visibleIds.value.has(theme.id))])
const visibleEdgeIds = computed(() => new Set(graphRelations.filter((edge) => visibleIds.value.has(edge.from) && visibleIds.value.has(edge.to) && (showComparisons.value || edge.type !== 'comparison')).map((edge) => edge.id)))
const focusIds = computed(() => {
  const ids = new Set([activeNodeId.value])
  for (const edge of graphRelations) {
    if (edge.from === activeNodeId.value) ids.add(edge.to)
    if (edge.to === activeNodeId.value) ids.add(edge.from)
  }
  if (activeRelation.value) {
    ids.add(activeRelation.value.from)
    ids.add(activeRelation.value.to)
  }
  if (pathRequested.value) {
    ids.add(pathFrom.value)
    ids.add(pathTo.value)
    for (const edge of path.value) {
      ids.add(edge.from)
      ids.add(edge.to)
    }
  }
  return ids
})
const pathIndex = computed(() => new Map(path.value.map((edge, index) => [edge.id, index])))
const drawKey = computed(() => pathRequested.value ? `path:${path.value.map((edge) => edge.id).join('.')}` : activeRelationId.value ? `edge:${activeRelationId.value}` : `node:${activeNodeId.value}`)
const sceneEdges = computed(() => {
  const groups = new Map()
  for (const edge of graphRelations) {
    const key = [edge.from, edge.to].sort().join('|')
    const list = groups.get(key) ?? []
    list.push(edge)
    groups.set(key, list)
  }
  const bends = new Map()
  for (const list of groups.values()) {
    list.forEach((edge, index) => {
      const offset = index - (list.length - 1) / 2
      bends.set(edge.id, list.length === 1 ? 18 : offset * 28)
    })
  }
  return graphRelations.map((edge) => {
    const bend = bends.get(edge.id) ?? 18
    const incident = edge.from === activeNodeId.value || edge.to === activeNodeId.value
    const onPath = pathIndex.value.has(edge.id)
    const selected = edge.id === activeRelationId.value
    const visible = visibleEdgeIds.value.has(edge.id)
    return {
      edge,
      d: edgePath(positions[edge.from], positions[edge.to], bend),
      arrow: edge.type !== 'theme' && edge.type !== 'comparison',
      visible,
      lit: visible && (incident || onPath || selected),
      draw: visible && (pathRequested.value ? onPath : incident || selected),
      step: pathIndex.value.get(edge.id) ?? 0,
    }
  })
})
const orderedNodes = computed(() => [...graphNodes].sort((a, b) => nodeRank(a) - nodeRank(b)))
const view = ref(fitView(placed(visibleIds.value), viewport.value, 42))

let resizeObserver: ResizeObserver | null = null
let motion = 0
let skipPeriodFrame = false
let pathCamera = false
const pointers = new Map<number, { x: number, y: number }>()
let pan: { x: number, y: number, vx: number, vy: number, pinch: boolean, dist: number } | null = null

function placed(ids: Iterable<string>) {
  const subset: Record<string, { x: number, y: number, width: number, height: number }> = {}
  for (const id of ids) if (positions[id]) subset[id] = positions[id]
  return subset
}
function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}
function currentViewport() {
  const element = sceneRef.value
  if (!element) return viewport.value
  const rect = element.getBoundingClientRect()
  if (rect.width < 2 || rect.height < 2) return viewport.value
  viewport.value = { width: rect.width, height: rect.height }
  return viewport.value
}
function easeCamera(amount: number) {
  const x1 = 0.16
  const y1 = 1
  const x2 = 0.3
  const y2 = 1
  let u = amount
  for (let i = 0; i < 6; i += 1) {
    const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u
    const slope = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2)
    if (Math.abs(slope) < 1e-4) break
    u = Math.min(1, Math.max(0, u - (x - amount) / slope))
  }
  return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u
}
function writeView(next: { x: number, y: number, k: number }, animated: boolean) {
  const token = ++motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!animated || reduce) {
    view.value = next
    return
  }
  const from = { ...view.value }
  const start = performance.now()
  const step = (now: number) => {
    if (token !== motion) return
    const progress = Math.min(1, (now - start) / 420)
    const eased = easeCamera(progress)
    view.value = {
      x: from.x + (next.x - from.x) * eased,
      y: from.y + (next.y - from.y) * eased,
      k: from.k + (next.k - from.k) * eased,
    }
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
function frameIds(ids: Iterable<string>) {
  userMoved.value = false
  writeView(fitView(placed(ids), currentViewport(), 42), true)
}
function framePath() {
  const ids = new Set([pathFrom.value, pathTo.value])
  for (const edge of path.value) {
    ids.add(edge.from)
    ids.add(edge.to)
  }
  frameIds(ids)
}
function centerOn(id: string, zoom = view.value.k) {
  const point = positions[id]
  if (!point) return
  const size = currentViewport()
  const k = clampZoom(zoom)
  writeView({ k, x: size.width / 2 - point.x * k, y: size.height / 2 - point.y * k }, true)
}
function nodeRank(node: { id: string }) {
  if (!visibleIds.value.has(node.id)) return 0
  if (node.id === activeNodeId.value) return 3
  if (focusIds.value.has(node.id)) return 2
  return 1
}
function nodeClass(node: { id: string, track: string, kind: string }) {
  return {
    'is-china': node.track === 'china',
    'is-world': node.track === 'world',
    'is-theme': node.kind === 'theme',
    'is-hidden': !visibleIds.value.has(node.id),
    'is-dim': visibleIds.value.has(node.id) && !focusIds.value.has(node.id),
    'is-selected': node.id === activeNodeId.value,
  }
}
function shapeOf(node: { kind: string }) {
  if (node.kind === 'theme') return 'diamond'
  if (node.kind === 'event') return 'round'
  if (node.kind === 'polity') return 'rect'
  return 'ellipse'
}
function linesOf(node: { title: string, kind: string }) {
  return labelLines(node.title, node.kind)
}
function lineOffset(count: number, index: number) {
  return (index - (count - 1) / 2) * 17
}
function selectNode(id: string) {
  if (!byId.has(id)) return
  const reveal = !visibleIds.value.has(id)
  if (reveal) skipPeriodFrame = true
  if (reveal) activePeriod.value = 'all'
  activeNodeId.value = id
  activeRelationId.value = null
  query.value = ''
  const focus = () => {
    skipPeriodFrame = false
    centerOn(id, reveal ? Math.max(view.value.k, 1) : view.value.k)
  }
  if (reveal) nextTick(focus)
  else focus()
}
function selectPeriod(id: string) {
  activePeriod.value = id
  if (id !== 'all') {
    activeNodeId.value = nodes.find((node) => node.period === id)!.id
    activeRelationId.value = null
  }
}
function edgeBetween(from: string, to: string) {
  const matches = graphRelations.filter((edge) => edge.type !== 'theme' && edge.type !== 'comparison' && ((edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)))
  return matches.find((edge) => edge.type === 'institution') ?? matches[0] ?? null
}
function followBook(nodeId: string, neighborId: string | null) {
  selectNode(nodeId)
  if (!neighborId) return
  const edge = edgeBetween(nodeId, neighborId)
  if (edge) activeRelationId.value = edge.id
}
function selectRelation(id: string) {
  const edge = byRelationId.get(id)
  if (!edge) return
  const reveal = !visibleIds.value.has(edge.from) || !visibleIds.value.has(edge.to)
  if (reveal) skipPeriodFrame = true
  if (reveal) activePeriod.value = 'all'
  activeRelationId.value = id
  activeNodeId.value = edge.from
  const focus = () => {
    skipPeriodFrame = false
    frameIds([edge.from, edge.to])
  }
  if (reveal) nextTick(focus)
  else focus()
}
function isWiki(url: string) {
  return /wikipedia\.org\//i.test(url)
}
function otherTitle(edge: { from: string, to: string }) {
  return byId.get(edge.from === activeNodeId.value ? edge.to : edge.from)?.title ?? ''
}
function fitGraph() {
  if (pathRequested.value) framePath()
  else frameIds(visibleIds.value)
}
function togglePageFullscreen() {
  pageFullscreen.value = !pageFullscreen.value
}
function onFullscreenKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && pageFullscreen.value) pageFullscreen.value = false
}
function calculatePath() {
  pathRequested.value = true
  activeRelationId.value = null
  pathCamera = true
  if (activePeriod.value !== 'all') activePeriod.value = 'all'
  else framePath()
}
function clearPath() {
  pathRequested.value = false
}
function onPointerDown(event: PointerEvent) {
  if (event.button !== 0 && event.pointerType === 'mouse') return
  sceneRef.value?.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  motion += 1
  panning.value = true
  if (pointers.size >= 2) {
    const [a, b] = [...pointers.values()]
    pan = { x: 0, y: 0, vx: view.value.x, vy: view.value.y, pinch: true, dist: Math.hypot(a.x - b.x, a.y - b.y) || 1 }
  } else {
    pan = { x: event.clientX, y: event.clientY, vx: view.value.x, vy: view.value.y, pinch: false, dist: 0 }
  }
}
function onPointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId) || !pan || !sceneRef.value) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pointers.size >= 2) {
    const [a, b] = [...pointers.values()]
    const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1
    const rect = sceneRef.value.getBoundingClientRect()
    const next = clampZoom(view.value.k * (dist / (pan.dist || dist)))
    const mx = (a.x + b.x) / 2 - rect.left
    const my = (a.y + b.y) / 2 - rect.top
    const ratio = next / view.value.k
    view.value = { k: next, x: mx - (mx - view.value.x) * ratio, y: my - (my - view.value.y) * ratio }
    pan.dist = dist
    userMoved.value = true
    return
  }
  if (pan.pinch) return
  const dx = event.clientX - pan.x
  const dy = event.clientY - pan.y
  if (Math.hypot(dx, dy) > 3) userMoved.value = true
  view.value = { ...view.value, x: pan.vx + dx, y: pan.vy + dy }
}
function onPointerUp(event: PointerEvent) {
  pointers.delete(event.pointerId)
  if (pointers.size === 0) {
    pan = null
    panning.value = false
    return
  }
  const [point] = [...pointers.values()]
  pan = { x: point.x, y: point.y, vx: view.value.x, vy: view.value.y, pinch: false, dist: 0 }
}
function onWheel(event: WheelEvent) {
  if (!sceneRef.value) return
  const rect = sceneRef.value.getBoundingClientRect()
  const px = event.clientX - rect.left
  const py = event.clientY - rect.top
  const next = clampZoom(view.value.k * (event.deltaY < 0 ? 1.08 : 1 / 1.08))
  const ratio = next / view.value.k
  motion += 1
  userMoved.value = true
  view.value = { k: next, x: px - (px - view.value.x) * ratio, y: py - (py - view.value.y) * ratio }
}

onMounted(() => {
  frameIds(visibleIds.value)
  window.addEventListener('keydown', onFullscreenKey)
  if (!sceneRef.value) return
  resizeObserver = new ResizeObserver(() => {
    currentViewport()
    if (!userMoved.value) frameIds(visibleIds.value)
  })
  resizeObserver.observe(sceneRef.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onFullscreenKey)
  document.documentElement.classList.remove('history-page-locked')
  resizeObserver?.disconnect()
})
watch(pageFullscreen, (on) => {
  document.documentElement.classList.toggle('history-page-locked', on)
})
watch([activePeriod, showComparisons], () => {
  if (skipPeriodFrame) return
  if (pathCamera) {
    pathCamera = false
    framePath()
    return
  }
  frameIds(visibleIds.value)
})
</script>

<template>
  <section class="history-graph" :class="{ 'is-page-fullscreen': pageFullscreen }" aria-label="历史知识图谱">
    <div class="history-graph__topline"><span>HISTORY / RELATION ATLAS</span><span>{{ nodes.length }} 个史实节点 · {{ themes.length }} 个学习主题 · {{ graphRelations.length }} 条关系</span></div>
    <div class="history-graph__heading">
      <div><p class="history-graph__eyebrow">EXPLORE THE CONNECTIONS</p><h2>从一个节点出发，<br><em>读懂历史的关联。</em></h2></div>
      <p>人物、事件、政权与过程连接成网络。选择一个时期，再沿实线、虚线或主题线探索跨地区、跨时期的联系。</p>
    </div>
    <div class="history-graph__controls">
      <div class="history-graph__periods" role="group" aria-label="按时期筛选">
        <button type="button" :aria-pressed="activePeriod === 'all'" @click="selectPeriod('all')">全部时期</button>
        <button v-for="period in periods" :key="period.id" type="button" :aria-pressed="activePeriod === period.id" @click="selectPeriod(period.id)">{{ period.title }}</button>
      </div>
      <label class="history-graph__compare"><input v-model="showComparisons" type="checkbox"> 显示对照关系</label>
    </div>
    <div class="history-graph__workbench">
      <div class="history-graph__network">
        <div class="history-graph__network-top"><span>关系网络 · 拖动画布 / 滚轮缩放</span><div class="history-graph__network-actions"><button type="button" @click="fitGraph">适合屏幕</button><button type="button" :aria-pressed="pageFullscreen" @click="togglePageFullscreen">{{ pageFullscreen ? '退出全屏' : '网页全屏' }}</button></div></div>
        <svg
          ref="sceneRef"
          class="history-graph__canvas"
          :class="{ 'is-panning': panning }"
          aria-hidden="true"
          :viewBox="`0 0 ${viewport.width} ${viewport.height}`"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel.prevent="onWheel"
        >
          <defs>
            <filter id="history-node-shadow" x="-40%" y="-50%" width="180%" height="200%">
              <feDropShadow class="history-graph__shadow" dx="0" dy="5" stdDeviation="5" flood-opacity="0.22" />
            </filter>
            <marker id="history-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1.2 L 9 5 L 0 8.8 Z" fill="context-stroke" />
            </marker>
          </defs>
          <g class="history-graph__scene" :transform="`translate(${view.x} ${view.y}) scale(${view.k})`">
            <g
              v-for="item in sceneEdges"
              :key="`${item.edge.id}:${item.draw ? drawKey : 'still'}`"
              class="history-graph__edge"
              :class="[`is-${item.edge.type}`, { 'is-hidden': !item.visible, 'is-dim': item.visible && !item.lit, 'is-lit': item.lit, 'is-selected': item.edge.id === activeRelationId, 'is-path': pathIndex.has(item.edge.id), 'is-draw': item.draw }]"
              :style="{ '--step': item.step }"
              @pointerdown.stop
              @click.stop="selectRelation(item.edge.id)"
            >
              <path class="history-graph__edge-hit" :d="item.d" />
              <path class="history-graph__edge-line" :d="item.d" pathLength="1" :marker-end="item.arrow ? 'url(#history-arrow)' : undefined" />
            </g>
            <g
              v-for="node in orderedNodes"
              :key="node.id"
              class="history-graph__node"
              :class="nodeClass(node)"
              :transform="`translate(${positions[node.id].x} ${positions[node.id].y})`"
              @pointerdown.stop
              @click.stop="selectNode(node.id)"
            >
              <ellipse v-if="shapeOf(node) === 'ellipse'" class="history-graph__shape" cx="0" cy="0" rx="48" ry="24" />
              <rect v-else-if="shapeOf(node) === 'round'" class="history-graph__shape" x="-48" y="-24" width="96" height="48" rx="12" />
              <rect v-else-if="shapeOf(node) === 'rect'" class="history-graph__shape" x="-48" y="-24" width="96" height="48" rx="2" />
              <polygon v-else class="history-graph__shape" points="0,-40 62.5,0 0,40 -62.5,0" />
              <text v-for="(line, index) in linesOf(node)" :key="index" text-anchor="middle" dominant-baseline="central" :y="lineOffset(linesOf(node).length, index)">{{ line }}</text>
            </g>
          </g>
        </svg>
      </div>
      <div class="history-graph__inspector" aria-live="polite">
        <p class="history-graph__eyebrow">史实</p>
        <h3>{{ activeNode.title }}</h3>
        <p v-if="activeNode.kind !== 'theme'" class="history-graph__meta">{{ activeNode.date }} · {{ activeNode.place }} · {{ activeNode.track === 'china' ? '中国' : '世界' }}</p>
        <p class="history-graph__summary">{{ activeNode.summary }}</p>
        <h4 v-if="activeNode.events?.length">发生的事件 <small>{{ activeNode.events.length }}</small></h4>
        <ul v-if="activeNode.events?.length" class="history-graph__events"><li v-for="(item, index) in activeNode.events" :key="index"><button v-if="item.node" type="button" @click="selectNode(item.node)"><small>{{ item.date }}<template v-if="item.place"> · {{ item.place }}</template></small><strong>{{ item.title }}</strong><p>{{ item.note }}</p></button><div v-else><small>{{ item.date }}<template v-if="item.place"> · {{ item.place }}</template></small><strong>{{ item.title }}</strong><p>{{ item.note }}</p></div></li></ul>
        <div v-if="activeRelation && activeRelation.type !== 'theme'" class="history-graph__relation-note"><small>{{ graphLabels[activeRelation.type] }}</small><strong>{{ byId.get(activeRelation.from)?.title }} → {{ byId.get(activeRelation.to)?.title }}</strong><p>{{ activeRelation.note }}</p><a v-for="(source, index) in graphRelationSources(activeRelation).filter((item) => !isWiki(item.url))" :key="index" :href="source.url" target="_blank" rel="noopener noreferrer">关系依据 {{ index + 1 }} ↗</a></div>
        <h4 v-if="historyRelations.length">史实关系 <small>{{ historyRelations.length }}</small></h4>
        <ul v-if="historyRelations.length" class="history-graph__relations"><li v-for="edge in historyRelations" :key="edge.id"><button type="button" @click="selectRelation(edge.id)"><small>{{ graphLabels[edge.type] }}</small><strong>{{ otherTitle(edge) }}</strong><span>查看关系 ↗</span></button></li></ul>
        <h4>学习主题 <small>{{ activeNode.kind === 'theme' ? nodeRelations.length : studyThemes.length }}</small></h4>
        <ul v-if="activeNode.kind !== 'theme'" class="history-graph__relations"><li v-for="theme in studyThemes" :key="theme.id"><button type="button" @click="selectNode(theme.id)"><small>学习主题</small><strong>{{ theme.title }}</strong><span>打开主题 ↗</span></button></li><li v-if="!studyThemes.length">这一节点还没有归入学习主题。</li></ul>
        <ul v-else class="history-graph__relations"><li v-for="edge in nodeRelations" :key="edge.id"><button type="button" @click="selectNode(edge.from)"><small>案例</small><strong>{{ byId.get(edge.from)?.title }}</strong><span>打开节点 ↗</span></button></li></ul>
        <h4 v-if="bookStops.length">阅读路径 <small>{{ bookStops.length }}</small></h4>
        <div v-for="stop in bookStops" :key="stop.book.id" class="history-graph__lens"><strong>{{ stop.book.title }}</strong><small>{{ stop.book.author }} · {{ stop.step.cite }}</small><p>{{ stop.step.point }}</p><div class="history-graph__path-nav"><button type="button" :disabled="!stop.prev" @click="stop.prev && followBook(stop.prev.node, stop.step.node)">上一步</button><button type="button" :disabled="!stop.next" @click="stop.next && followBook(stop.next.node, stop.step.node)">下一步</button></div></div>
      </div>
    </div>
    <div class="history-graph__legend" aria-label="图例"><span><i class="china-dot"></i>中国</span><span><i class="world-dot"></i>世界</span><span><i class="theme-dot"></i>学习主题</span><span><i class="solid-line"></i>史实关系</span><span><i class="dashed-line"></i>对照阅读</span><span><i class="dotted-line"></i>主题分类</span></div>
    <div class="history-graph__explore">
      <div><p class="history-graph__eyebrow">TRACE A PATH</p><h3>寻找两个节点之间的路径</h3><p>路径是学习线索，可能经过主题或对照关系；它不表示连续因果。</p></div>
      <div class="history-graph__path-inputs"><label>起点<select v-model="pathFrom" @change="clearPath"><option v-for="node in nodes" :key="node.id" :value="node.id">{{ node.title }}</option></select></label><label>终点<select v-model="pathTo" @change="clearPath"><option v-for="node in nodes" :key="node.id" :value="node.id">{{ node.title }}</option></select></label><button type="button" @click="calculatePath">显示路径</button></div>
      <ol v-if="pathRequested" class="history-graph__path-result"><li v-for="(step, index) in pathSteps" :key="step.edge.id"><button type="button" @click="selectRelation(step.edge.id)">{{ index + 1 }}. {{ byId.get(step.from)?.title }} <span>{{ graphLabels[step.edge.type] }}</span> {{ byId.get(step.to)?.title }}</button></li><li v-if="!path.length">{{ pathFrom === pathTo ? '请选择两个不同的节点。' : '未找到路径。' }}</li></ol>
    </div>
    <div class="history-graph__index"><div class="history-graph__index-head"><div><p class="history-graph__eyebrow">KEYBOARD & MOBILE INDEX</p><h3>节点索引</h3><p>列表与图上节点对应，可用键盘逐一选择。</p></div><label>搜索节点<input v-model="query" type="search" placeholder="输入人物、事件、地区或主题"></label></div><div v-if="query" class="history-graph__node-list"><button v-for="node in searchMatches" :key="node.id" type="button" @click="selectNode(node.id)"><small>{{ node.kind === 'theme' ? '学习主题' : node.date }}</small><strong>{{ node.title }}</strong><span>{{ node.kind === 'theme' ? node.summary : node.place }}</span></button><p v-if="!searchMatches.length">没有匹配的节点。</p></div><div v-else class="history-graph__node-list"><button v-for="node in visibleListNodes" :key="node.id" type="button" :aria-pressed="activeNodeId === node.id" @click="selectNode(node.id)"><small>{{ node.kind === 'theme' ? '学习主题' : node.date }}</small><strong>{{ node.title }}</strong><span>{{ node.kind === 'theme' ? node.summary : node.place }}</span></button></div></div>
    <p class="history-graph__footnote">实线的箭头表示关系描述的方向，不必然表示因果。虚线“对照阅读”和点线“学习主题”是本站的编排；节点与关系均可打开来源核查。</p>
  </section>
</template>
