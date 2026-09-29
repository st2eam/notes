<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { nodes, periods } from './history-data.mjs'
import { themes, readingLenses, graphNodes, graphRelations, graphLabels, graphRelationSources, findPath } from './history-network.mjs'

const activePeriod = ref('classical')
const activeNodeId = ref('han')
const activeRelationId = ref<string | null>(null)
const showComparisons = ref(true)
const query = ref('')
const pathFrom = ref('han')
const pathTo = ref('rome')
const pathRequested = ref(false)
const graphElement = ref<HTMLElement | null>(null)
let cy: any = null
let resizeObserver: ResizeObserver | null = null
let themeObserver: MutationObserver | null = null

const byId = new Map(graphNodes.map((node) => [node.id, node]))
const byRelationId = new Map(graphRelations.map((edge) => [edge.id, edge]))
const activeNode = computed(() => byId.get(activeNodeId.value) ?? nodes[0])
const activeLens = computed(() => readingLenses[activeNodeId.value as keyof typeof readingLenses])
const activeRelation = computed(() => activeRelationId.value ? byRelationId.get(activeRelationId.value) : null)
const nodeRelations = computed(() => graphRelations.filter((edge) => edge.from === activeNodeId.value || edge.to === activeNodeId.value))
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
const searchMatches = computed(() => query.value.trim() ? graphNodes.filter((node) => `${node.title}${node.place ?? ''}${node.summary}${readingLenses[node.id as keyof typeof readingLenses]?.question ?? ''}`.includes(query.value.trim())).slice(0, 8) : [])
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
const visibleEdges = computed(() => graphRelations.filter((edge) => visibleIds.value.has(edge.from) && visibleIds.value.has(edge.to) && (showComparisons.value || edge.type !== 'comparison')))

function selectNode(id: string) {
  if (!byId.has(id)) return
  if (!visibleIds.value.has(id)) activePeriod.value = 'all'
  activeNodeId.value = id
  activeRelationId.value = null
  query.value = ''
  cy?.$id(id).select()
  if (cy?.$id(id).length) cy.animate({ center: { eles: cy.$id(id) }, duration: 250 })
}
function selectPeriod(id: string) {
  activePeriod.value = id
  if (id !== 'all') {
    activeNodeId.value = nodes.find((node) => node.period === id)!.id
    activeRelationId.value = null
  }
}
function selectRelation(id: string) {
  const edge = byRelationId.get(id)
  if (!edge) return
  if (!visibleIds.value.has(edge.from) || !visibleIds.value.has(edge.to)) activePeriod.value = 'all'
  activeRelationId.value = id
  activeNodeId.value = edge.from
  cy?.$id(id).select()
}
function otherTitle(edge: any) {
  return byId.get(edge.from === activeNodeId.value ? edge.to : edge.from)?.title ?? ''
}
function cssVar(name: string) {
  return getComputedStyle(graphElement.value!).getPropertyValue(name).trim()
}
function graphStyle() {
  const ink = cssVar('--history-ink')
  const paper = cssVar('--history-paper')
  const china = cssVar('--history-china')
  const world = cssVar('--history-world')
  const muted = cssVar('--history-muted')
  const theme = cssVar('--history-theme')
  return [
    { selector: 'node', style: { label: 'data(label)', 'font-family': 'system-ui, sans-serif', 'font-size': 11, 'font-weight': 600, color: ink, 'text-wrap': 'wrap', 'text-max-width': 85, 'text-valign': 'center', 'text-halign': 'center', 'background-color': paper, 'border-width': 2, width: 96, height: 48, 'overlay-opacity': 0 } },
    { selector: 'node[track = "china"]', style: { 'border-color': china, 'background-color': paper } },
    { selector: 'node[track = "world"]', style: { 'border-color': world, 'background-color': paper } },
    { selector: 'node[track = "theme"]', style: { shape: 'diamond', width: 125, height: 80, 'border-color': theme, 'background-color': theme, color: paper, 'font-size': 12 } },
    { selector: 'node[kind = "person"]', style: { shape: 'ellipse' } },
    { selector: 'node[kind = "event"]', style: { shape: 'round-rectangle' } },
    { selector: 'node[kind = "polity"]', style: { shape: 'rectangle' } },
    { selector: 'edge', style: { width: 2, 'curve-style': 'bezier', 'line-color': muted, 'target-arrow-color': muted, 'target-arrow-shape': 'triangle', 'arrow-scale': .7, opacity: .55 } },
    { selector: 'edge[type = "theme"]', style: { 'line-style': 'dotted', 'line-color': theme, 'target-arrow-shape': 'none', opacity: .38, width: 1.2 } },
    { selector: 'edge[type = "comparison"]', style: { 'line-style': 'dashed', 'line-color': china, 'target-arrow-shape': 'none', opacity: .75 } },
    { selector: 'edge:selected', style: { width: 4, opacity: 1, 'line-color': theme, 'target-arrow-color': theme, 'z-index': 20 } },
    { selector: 'node:selected', style: { 'border-width': 5, 'border-color': theme, 'z-index': 30 } },
    { selector: '.dim', style: { opacity: .3 } },
    { selector: '.path', style: { opacity: 1, 'line-color': theme, 'target-arrow-color': theme, width: 4, 'z-index': 18 } },
  ]
}
function highlight() {
  if (!cy) return
  cy.elements().removeClass('dim path')
  const id = activeNodeId.value
  const selected = cy.$id(id)
  if (selected.length) {
    cy.elements().addClass('dim')
    selected.removeClass('dim')
    selected.connectedEdges().removeClass('dim')
    selected.neighborhood('node').removeClass('dim')
    cy.elements(':selected').unselect()
    selected.select()
  }
  if (activeRelationId.value) {
    const edge = cy.$id(activeRelationId.value)
    edge.removeClass('dim').select()
    edge.connectedNodes().removeClass('dim')
  }
  if (pathRequested.value) {
    for (const edge of path.value) {
      cy.$id(edge.id).removeClass('dim').addClass('path')
      cy.$id(edge.from).removeClass('dim')
      cy.$id(edge.to).removeClass('dim')
    }
  }
}
function renderGraph() {
  if (!cy) return
  const elements = [
    ...graphNodes.filter((node) => visibleIds.value.has(node.id)).map((node) => ({ data: { id: node.id, label: node.title, track: node.track, kind: node.kind } })),
    ...visibleEdges.value.map((edge) => ({ data: { id: edge.id, source: edge.from, target: edge.to, type: edge.type } })),
  ]
  cy.elements().remove()
  cy.add(elements)
  cy.layout({ name: 'cose', randomize: false, animate: false, fit: true, padding: 42, nodeRepulsion: () => 11000, idealEdgeLength: () => 125, edgeElasticity: () => 80, gravity: .35, numIter: 700 }).run()
  highlight()
}
function fitGraph() { cy?.fit(cy.elements(), 35) }
function calculatePath() {
  pathRequested.value = true
  activeRelationId.value = null
  if (activePeriod.value !== 'all') activePeriod.value = 'all'
  else highlight()
}
function clearPath() { pathRequested.value = false; highlight() }

onMounted(async () => {
  if (!graphElement.value) return
  const cytoscape = (await import('cytoscape')).default
  cy = cytoscape({ container: graphElement.value, elements: [], style: graphStyle(), minZoom: .25, maxZoom: 2.4, boxSelectionEnabled: false })
  cy.on('tap', 'node', (event: any) => selectNode(event.target.id()))
  cy.on('tap', 'edge', (event: any) => selectRelation(event.target.id()))
  resizeObserver = new ResizeObserver(() => cy?.resize())
  resizeObserver.observe(graphElement.value)
  renderGraph()
  themeObserver = new MutationObserver(() => { cy?.style(graphStyle()); highlight() })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
onBeforeUnmount(() => { resizeObserver?.disconnect(); themeObserver?.disconnect(); cy?.destroy(); cy = null })
watch([activePeriod, showComparisons], renderGraph)
watch([activeNodeId, activeRelationId], highlight)
</script>

<template>
  <section class="history-graph" aria-label="历史知识图谱">
    <div class="history-graph__topline"><span>HISTORY / RELATION ATLAS</span><span>{{ nodes.length }} 个史实节点 · {{ themes.length }} 个学习主题 · {{ graphRelations.length }} 条关系</span></div>
    <div class="history-graph__heading">
      <div><p class="history-graph__eyebrow">EXPLORE THE CONNECTIONS</p><h2>从一个节点出发，<br><em>读懂历史的关联。</em></h2></div>
      <p>人物、事件、政权与过程连接成网络。选择一个时期，再沿实线、虚线或主题线探索跨地区、跨时期的联系。</p>
    </div>
    <div class="history-graph__legend" aria-label="图例"><span><i class="china-dot"></i>中国</span><span><i class="world-dot"></i>世界</span><span><i class="theme-dot"></i>学习主题</span><span><i class="solid-line"></i>史实关系</span><span><i class="dashed-line"></i>对照阅读</span><span><i class="dotted-line"></i>主题分类</span></div>
    <div class="history-graph__controls">
      <div class="history-graph__periods" role="group" aria-label="按时期筛选">
        <button type="button" :aria-pressed="activePeriod === 'all'" @click="selectPeriod('all')">全部时期</button>
        <button v-for="period in periods" :key="period.id" type="button" :aria-pressed="activePeriod === period.id" @click="selectPeriod(period.id)">{{ period.title }}</button>
      </div>
      <label class="history-graph__compare"><input v-model="showComparisons" type="checkbox"> 显示对照关系</label>
    </div>
    <div class="history-graph__workbench">
      <div class="history-graph__network">
        <div class="history-graph__network-top"><span>关系网络 · 拖动画布 / 滚轮缩放</span><button type="button" @click="fitGraph">适合屏幕</button></div>
        <div ref="graphElement" class="history-graph__canvas" role="img" aria-label="可拖动缩放的历史关系网络；下方列表提供相同节点和关系的键盘操作"></div>
      </div>
      <div class="history-graph__inspector" aria-live="polite">
        <p class="history-graph__eyebrow">{{ activeNode.kind === 'theme' ? 'STUDY THEME' : 'SELECTED NODE' }}</p>
        <h3>{{ activeNode.title }}</h3>
        <p v-if="activeNode.kind !== 'theme'" class="history-graph__meta">{{ activeNode.date }} · {{ activeNode.place }} · {{ activeNode.track === 'china' ? '中国' : '世界' }}</p>
        <p class="history-graph__summary">{{ activeNode.summary }}</p>
        <div v-if="activeLens" class="history-graph__lens"><strong>可追问</strong><p>{{ activeLens.question }}</p><small>分析线索：赫拉利《人类简史》{{ activeLens.chapters }}。这是提问角度，史实请核对节点来源。</small></div>
        <div v-if="activeNode.kind !== 'theme'" class="history-graph__actions"><a :href="withBase(activeNode.link)">阅读分期笔记 ↗</a><a :href="activeNode.source.url" target="_blank" rel="noopener noreferrer">核对节点来源 ↗</a></div>
        <div v-if="activeRelation" class="history-graph__relation-note"><small>{{ graphLabels[activeRelation.type] }}</small><strong>{{ byId.get(activeRelation.from)?.title }} → {{ byId.get(activeRelation.to)?.title }}</strong><p>{{ activeRelation.note }}</p><a v-for="(source, index) in graphRelationSources(activeRelation)" :key="index" :href="source.url" target="_blank" rel="noopener noreferrer">关系依据 {{ index + 1 }} ↗</a></div>
        <h4>相连的节点 <small>{{ nodeRelations.length }}</small></h4>
        <ul class="history-graph__relations"><li v-for="edge in nodeRelations" :key="edge.id"><button type="button" @click="selectRelation(edge.id)"><small>{{ graphLabels[edge.type] }}</small><strong>{{ otherTitle(edge) }}</strong><span>查看关系 ↗</span></button></li></ul>
      </div>
    </div>
    <div class="history-graph__explore">
      <div><p class="history-graph__eyebrow">TRACE A PATH</p><h3>寻找两个节点之间的路径</h3><p>路径是学习线索，可能经过主题或对照关系；它不表示连续因果。</p></div>
      <div class="history-graph__path-inputs"><label>起点<select v-model="pathFrom" @change="clearPath"><option v-for="node in nodes" :key="node.id" :value="node.id">{{ node.title }}</option></select></label><label>终点<select v-model="pathTo" @change="clearPath"><option v-for="node in nodes" :key="node.id" :value="node.id">{{ node.title }}</option></select></label><button type="button" @click="calculatePath">显示路径</button></div>
      <ol v-if="pathRequested" class="history-graph__path-result"><li v-for="(step, index) in pathSteps" :key="step.edge.id"><button type="button" @click="selectRelation(step.edge.id)">{{ index + 1 }}. {{ byId.get(step.from)?.title }} <span>{{ graphLabels[step.edge.type] }}</span> {{ byId.get(step.to)?.title }}</button></li><li v-if="!path.length">{{ pathFrom === pathTo ? '请选择两个不同的节点。' : '未找到路径。' }}</li></ol>
    </div>
    <div class="history-graph__index"><div class="history-graph__index-head"><div><p class="history-graph__eyebrow">KEYBOARD & MOBILE INDEX</p><h3>节点索引</h3><p>列表与图上节点对应，可用键盘逐一选择。</p></div><label>搜索节点<input v-model="query" type="search" placeholder="输入人物、事件、地区或主题"></label></div><div v-if="query" class="history-graph__node-list"><button v-for="node in searchMatches" :key="node.id" type="button" @click="selectNode(node.id)"><small>{{ node.kind === 'theme' ? '学习主题' : node.date }}</small><strong>{{ node.title }}</strong><span>{{ node.kind === 'theme' ? node.summary : node.place }}</span></button><p v-if="!searchMatches.length">没有匹配的节点。</p></div><div v-else class="history-graph__node-list"><button v-for="node in visibleListNodes" :key="node.id" type="button" :aria-pressed="activeNodeId === node.id" @click="selectNode(node.id)"><small>{{ node.kind === 'theme' ? '学习主题' : node.date }}</small><strong>{{ node.title }}</strong><span>{{ node.kind === 'theme' ? node.summary : node.place }}</span></button></div></div>
    <p class="history-graph__footnote">实线的箭头表示关系描述的方向，不必然表示因果。虚线“对照阅读”和点线“学习主题”是本站的编排；节点与关系均可打开来源核查。</p>
  </section>
</template>
