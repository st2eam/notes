import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { nodes, periods } from '../.vitepress/theme/components/history/history-data.mjs'
import { themes, graphNodes, graphRelations, graphLabels, graphRelationSources, findPath } from '../.vitepress/theme/components/history/history-network.mjs'

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
  assert.equal(themes.length, 4)
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

test('every node connects to the graph and paths can cross periods', () => {
  for (const node of graphNodes) assert.ok(graphRelations.some((edge) => edge.from === node.id || edge.to === node.id), `isolated ${node.id}`)
  for (const node of nodes) assert.ok(findPath('yangshao', node.id).length > 0 || node.id === 'yangshao', `unreachable ${node.id}`)
  assert.ok(findPath('han', 'globalization').length > 0)
})
