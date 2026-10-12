import test from 'node:test'
import assert from 'node:assert/strict'
import { diceDefaults, cardDefaults, riskDefaults, diceDistribution, diceMetrics, cardMetrics, riskMetrics,
  diceErrors, cardErrors, riskErrors, formatPercent, compareMean } from '../.vitepress/theme/components/math/board-game-models.mjs'

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} ≠ ${expected}`)
const articleCards = { ...cardDefaults, total: 20, targets: 5 }

test('all supported dice counts have complete, symmetric distributions and correct moments', () => {
  for (let n = 1; n <= 6; n++) {
    const rows = diceDistribution(n)
    assert.equal(rows[0].sum, n)
    assert.equal(rows.at(-1).sum, 6 * n)
    assert.equal(rows.reduce((sum, row) => sum + row.count, 0), 6 ** n)
    close(rows.reduce((sum, row) => sum + row.probability, 0), 1)
    close(rows.reduce((sum, row) => sum + row.sum * row.probability, 0), 3.5 * n)
    close(rows.reduce((sum, row) => sum + (row.sum - 3.5 * n) ** 2 * row.probability, 0), n * 35 / 12)
    assert.deepEqual(rows.map(row => row.count), rows.map(row => row.count).reverse())
  }
  assert.deepEqual(diceDistribution(2).map(row => row.count), [1,2,3,4,5,6,5,4,3,2,1])
})

test('dice action reproduces the article and preserves an impossible threshold', () => {
  const result = diceMetrics(diceDefaults)
  close(result.probability, 15 / 36)
  close(result.ev, 7 / 6)
  close(result.variance, 875 / 36)
  close(result.difference, 1 / 6)
  const impossible = diceMetrics({ ...diceDefaults, dice: 1 })
  assert.equal(impossible.probability, 0)
  assert.equal(impossible.ev, -3)
  assert.equal(impossible.sd, 0)
  assert.equal(diceMetrics({ ...diceDefaults, threshold: 1 }).probability, 1)
  assert.equal(diceMetrics({ ...diceDefaults, dice: 6, threshold: 37 }).probability, 0)
  close(diceMetrics({ ...diceDefaults, cost: 3 }).ev, result.ev - 2)
})

test('without-replacement draws distinguish one-time and per-card scoring', () => {
  const once = cardMetrics(articleCards)
  close(once.probability, 17 / 38)
  close(once.expectedHits, 0.5)
  close(once.ev, 32 / 19)
  assert.equal(cardMetrics(articleCards, 'each').ev, 2)
  const defaults = cardMetrics(cardDefaults)
  close(defaults.probability, 33 / 221)
  close(defaults.expectedHits, 2 / 13)
  close(defaults.ev, -23 / 221)
  close(cardMetrics(cardDefaults, 'each').ev, -1 / 13)
  for (const draws of [0, 1, 2, 20]) {
    const none = cardMetrics({ ...articleCards, targets: 0, draws })
    assert.equal(none.probability, 0)
    assert.equal(none.expectedHits, 0)
    const all = cardMetrics({ ...articleCards, targets: 20, draws })
    assert.equal(all.probability, draws ? 1 : 0)
    assert.equal(all.expectedHits, draws)
  }
  assert.equal(cardMetrics({ ...articleCards, draws: 20 }).probability, 1)
  assert.equal(cardMetrics({ ...articleCards, draws: 20 }).expectedHits, 5)
  assert.equal(cardMetrics({ ...cardDefaults, draws: 0 }).ev, -1)
  assert.ok(Number.isFinite(cardMetrics({ ...cardDefaults, total: 1000, draws: 1000 }).ev))
})

test('stop and continue use final totals and handle deterministic or equal results', () => {
  const result = riskMetrics(riskDefaults)
  assert.equal(result.ev, 4.5)
  assert.equal(result.sd, 4.5)
  assert.equal(result.difference, -0.5)
  assert.equal(riskMetrics({ ...riskDefaults, probability: 0 }).ev, 0)
  assert.equal(riskMetrics({ ...riskDefaults, probability: 100 }).ev, 9)
  assert.equal(riskMetrics({ ...riskDefaults, success: 5, failure: 5 }).difference, 0)
  assert.equal(riskMetrics({ ...riskDefaults, success: 5, failure: 5 }).sd, 0)
  assert.match(compareMean(0, '继续', '停手'), /期望相同/)
  assert.match(compareMean(0.0001, '继续', '停手'), /高不足 0.001 分/)
  assert.match(compareMean(-0.0001, '继续', '停手'), /低不足 0.001 分/)
})

test('invalid and blank parameters suppress calculations rather than coercing to zero', () => {
  for (const dice of ['', NaN, Infinity, 0, 7, 1.5]) {
    assert.ok(diceErrors({ ...diceDefaults, dice }).dice)
    assert.throws(() => diceMetrics({ ...diceDefaults, dice }), RangeError)
  }
  assert.ok(diceErrors({ ...diceDefaults, cost: -1 }).cost)
  assert.ok(cardErrors({ ...cardDefaults, total: 0 }).total)
  assert.ok(cardErrors({ ...cardDefaults, targets: 53 }).targets)
  assert.ok(cardErrors({ ...cardDefaults, draws: 53 }).draws)
  assert.ok(cardErrors({ ...cardDefaults, draws: 1.5 }).draws)
  assert.throws(() => cardMetrics(cardDefaults, 'unknown'), RangeError)
  assert.throws(() => cardMetrics({ ...cardDefaults, draws: 53 }), RangeError)
  assert.ok(riskErrors({ ...riskDefaults, success: '' }).success)
  assert.throws(() => riskMetrics({ ...riskDefaults, probability: 101 }), RangeError)
  assert.notEqual(formatPercent(1 / 46656), '0%')
})
