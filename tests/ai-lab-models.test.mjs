import test from 'node:test'
import assert from 'node:assert/strict'
import { joinRows, confusionMetrics, attentionWeights, rankDocuments, evaluateToolAction } from '../.vitepress/theme/components/ai/lab-models.mjs'

test('inner and left joins preserve matches and unmatched left rows', () => {
  assert.deepEqual(joinRows('inner').map((row) => row.order.id), [101, 102])
  assert.equal(joinRows('left').length, 4)
  assert.deepEqual(joinRows('left').filter((row) => row.order === null).map((row) => row.person.id), [2, 3])
})

test('threshold metrics count every case and handle no positive predictions', () => {
  const mid = confusionMetrics(0.5)
  assert.deepEqual([mid.tp, mid.fp, mid.tn, mid.fn], [2, 2, 2, 2])
  assert.equal(mid.precision, 0.5)
  assert.equal(mid.recall, 0.5)
  assert.equal(confusionMetrics(1).precision, 0)
  assert.equal(confusionMetrics(1).recall, 0)
})

test('attention weights are normalized and respond to query direction', () => {
  const technical = attentionWeights([1, 0])
  const design = attentionWeights([0, 1])
  assert.ok(Math.abs(technical.reduce((sum, item) => sum + item.weight, 0) - 1) < 1e-12)
  assert.ok(technical[0].weight > technical[1].weight)
  assert.ok(design[1].weight > design[0].weight)
})

test('retrieval weights can change ranking', () => {
  assert.equal(rankDocuments(0, 1)[0].title, '认证与授权')
  assert.equal(rankDocuments(0, 0)[0].title, 'Agentic 工程模式实践指南')
  assert.ok(rankDocuments(1, 0.5)[0].score >= rankDocuments(1, 0.5)[1].score)
})

test('untrusted instructions and excessive permissions are blocked', () => {
  assert.equal(evaluateToolAction('web', 'write', 'write').status, 'blocked')
  assert.equal(evaluateToolAction('user', 'read', 'write').status, 'blocked')
  assert.equal(evaluateToolAction('user', 'write', 'write').status, 'confirm')
  assert.equal(evaluateToolAction('user', 'read', 'read').status, 'allowed')
})
