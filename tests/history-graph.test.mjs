import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { nodes, periods } from '../.vitepress/theme/components/history/history-data.mjs'
import { themes, readingLenses, graphNodes, graphRelations, graphLabels, graphRelationSources, findPath } from '../.vitepress/theme/components/history/history-network.mjs'
import { layoutAtlas, edgePath, fitView } from '../.vitepress/theme/components/history/history-scene.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

test('six periods cover China and multiple world regions', () => {
  assert.equal(periods.length, 6)
  assert.equal(nodes.length, 42)
  for (const period of periods) {
    const selected = nodes.filter((node) => node.period === period.id)
    assert.ok(selected.filter((node) => node.track === 'china').length >= 3)
    assert.ok(selected.filter((node) => node.track === 'world').length >= 3)
    assert.ok(selected.every((node) => Number.isFinite(node.year)))
  }
})

test('every historical node has an article anchor and source', () => {
  const ids = new Set()
  for (const node of nodes) {
    assert.ok(!ids.has(node.id), `duplicate node ${node.id}`)
    ids.add(node.id)
    assert.ok(node.summary && node.date && node.place && node.kind)
    assert.match(node.source.url, /^https:\/\//)
    const [page, anchor] = node.link.replace(/^\/History\//, '').split('#')
    const article = resolve(root, 'History', `${page}.md`)
    assert.ok(existsSync(article), `missing article ${article}`)
    assert.ok(readFileSync(article, 'utf8').includes(`<a id="${anchor}"></a>`), `missing anchor ${anchor}`)
  }
})

test('typed relations have endpoints, explanation, and evidence', () => {
  const byId = new Map(graphNodes.map((node) => [node.id, node]))
  assert.equal(themes.length, 6)
  assert.ok(graphRelations.length >= 100)
  assert.ok(graphRelations.some((edge) => byId.get(edge.from)?.period !== byId.get(edge.to)?.period && edge.type !== 'theme'))
  const ids = new Set()
  for (const edge of graphRelations) {
    assert.ok(!ids.has(edge.id), `duplicate edge ${edge.id}`)
    ids.add(edge.id)
    assert.ok(byId.has(edge.from) && byId.has(edge.to), `broken edge ${edge.id}`)
    assert.ok(graphLabels[edge.type], `unknown relation type ${edge.type}`)
    assert.notEqual(edge.from, edge.to)
    assert.ok(edge.note.length >= 15, `missing explanation ${edge.id}`)
    assert.ok(graphRelationSources(edge).length > 0, `missing source ${edge.id}`)
    assert.ok(graphRelationSources(edge).every((item) => item.url.startsWith('https://')))
  }
})

test('Han through Qing compare institutions without replacing regime changes', () => {
  const chain = [
    ['han', 'tang', /第一讲/, /第二讲/],
    ['tang', 'song', /第二讲/, /第三讲/],
    ['song', 'ming', /第三讲/, /第四讲/],
    ['ming', 'qing', /第四讲/, /第五讲/],
  ]
  const edges = graphRelations.filter((edge) => edge.type === 'institution')
  assert.equal(edges.length, 4)
  assert.equal(graphLabels.institution, '制度演变')
  assert.equal(nodes.length, 42)
  assert.equal(periods.length, 6)
  for (const [from, to, earlier, later] of chain) {
    const edge = edges.find((item) => item.from === from && item.to === to)
    assert.ok(edge, `${from} → ${to}`)
    assert.match(edge.note, /钱穆/)
    assert.match(edge.note, earlier)
    assert.match(edge.note, later)
    const sources = graphRelationSources(edge)
    assert.equal(sources.length, 2)
    assert.ok(sources.every((item) => item.url.startsWith('https://')))
  }
  assert.match(edges.find((edge) => edge.id === 'f26').note, /元朝/)
  assert.match(nodes.find((node) => node.id === 'han').summary, /丞相/)
  assert.match(nodes.find((node) => node.id === 'qing').summary, /部族/)
  assert.ok(graphRelations.some((edge) => edge.id === 'f12' && edge.type === 'succession'))
})

test('book perspectives stay attached to sourced historical nodes', () => {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  for (const [id, lens] of Object.entries(readingLenses)) {
    assert.ok(byId.has(id), `unknown node ${id}`)
    assert.match(lens.chapters, /^第 .+ 章$/)
    assert.ok(lens.question.length >= 25, `thin perspective ${id}`)
    assert.ok(byId.get(id).source.url.startsWith('https://'))
  }
  for (const themeId of ['theme-ecology', 'theme-welfare']) {
    const edges = graphRelations.filter((edge) => edge.to === themeId)
    assert.ok(edges.length >= 5)
    assert.ok(edges.every((edge) => readingLenses[edge.from]))
  }
})

test('atlas layout is finite, stable, and separated', () => {
  const first = layoutAtlas(graphNodes, graphRelations)
  const second = layoutAtlas(graphNodes, graphRelations)
  const ids = graphNodes.map((node) => node.id)
  for (const id of ids) {
    assert.ok(Number.isFinite(first[id].x) && Number.isFinite(first[id].y), id)
    assert.equal(first[id].x, second[id].x)
    assert.equal(first[id].y, second[id].y)
  }
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      const distance = Math.hypot(first[ids[i]].x - first[ids[j]].x, first[ids[i]].y - first[ids[j]].y)
      assert.ok(distance > 40, `${ids[i]} overlaps ${ids[j]}`)
    }
  }
})

test('fitView places node boxes inside the padded viewport', () => {
  const positions = {
    a: { x: 0, y: 0, width: 96, height: 48 },
    b: { x: 400, y: 200, width: 96, height: 48 },
  }
  const viewport = { width: 800, height: 600 }
  const padding = 36
  const view = fitView(positions, viewport, padding)
  assert.ok(view.k >= 0.25 && view.k <= 2.4)
  for (const item of Object.values(positions)) {
    const left = view.x + (item.x - item.width / 2) * view.k
    const right = view.x + (item.x + item.width / 2) * view.k
    const top = view.y + (item.y - item.height / 2) * view.k
    const bottom = view.y + (item.y + item.height / 2) * view.k
    assert.ok(left >= padding - 0.5)
    assert.ok(top >= padding - 0.5)
    assert.ok(right <= viewport.width - padding + 0.5)
    assert.ok(bottom <= viewport.height - padding + 0.5)
  }
})

test('edge curves clear the node center', () => {
  const path = edgePath(
    { x: 0, y: 0, width: 96, height: 48 },
    { x: 240, y: 0, width: 96, height: 48 },
    18,
  )
  const start = path.match(/^M ([0-9.-]+) ([0-9.-]+)/)
  assert.ok(start)
  assert.ok(Number(start[1]) > 40)
})

test('every node connects to the graph and paths can cross periods', () => {
  for (const node of graphNodes) assert.ok(graphRelations.some((edge) => edge.from === node.id || edge.to === node.id), `isolated ${node.id}`)
  for (const node of nodes) assert.ok(findPath('yangshao', node.id).length > 0 || node.id === 'yangshao', `unreachable ${node.id}`)
  assert.ok(findPath('han', 'globalization').length > 0)
})
