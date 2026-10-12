import test from 'node:test'
import assert from 'node:assert/strict'
import { diceDefaults, cardDefaults, evDefaults, diceDistribution, diceProbability, diceChartBins,
  cardProbability, expectedValue, diceErrors, cardErrors, evErrors, formatPercent } from '../.vitepress/theme/components/math/board-game-models.mjs'
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} ≠ ${expected}`)

test('ndm distributions preserve exact counts, symmetry and the correct mean', () => {
  for (const faces of [1, 2, 4, 6, 8, 10, 12, 20, 100]) {
    for (let n = 1; n <= 6; n++) {
      const rows = diceDistribution(n, faces)
      assert.equal(rows[0].sum, n)
      assert.equal(rows.at(-1).sum, n * faces)
      assert.equal(rows.reduce((sum, row) => sum + row.count, 0), faces ** n)
      close(rows.reduce((sum, row) => sum + row.probability, 0), 1)
      close(rows.reduce((sum, row) => sum + row.sum * row.probability, 0), n * (faces + 1) / 2)
      assert.deepEqual(rows.map(row => row.count), rows.map(row => row.count).reverse())
    }
  }
  assert.deepEqual(diceDistribution(2, 6).map(row => row.count), [1,2,3,4,5,6,5,4,3,2,1])
})

test('event probabilities keep the target across changes of count and faces', () => {
  close(diceProbability(diceDefaults).probability, 15 / 36)
  assert.equal(diceProbability({ ...diceDefaults, dice: 1 }).probability, 0)
  close(diceProbability({ ...diceDefaults, dice: 1, faces: 20 }).probability, 13 / 20)
  assert.equal(diceProbability({ ...diceDefaults, threshold: 1 }).probability, 1)
  assert.equal(diceProbability({ dice: 6, faces: 100, threshold: 601 }).probability, 0)
  assert.equal(diceProbability({ dice: 6, faces: 100, threshold: 600 }).probability, 1e-12)
})

test('compact chart bins retain all outcomes without crossing the event boundary', () => {
  for (const faces of [1, 6, 20, 100]) {
    const result = diceProbability({ dice: 6, faces, threshold: 88 })
    const bins = diceChartBins(result.distribution, 88)
    assert.ok(bins.length <= 33)
    assert.equal(bins.reduce((sum, bin) => sum + bin.count, 0), result.total)
    close(bins.reduce((sum, bin) => sum + bin.probability, 0), 1)
    close(bins.filter(bin => bin.success).reduce((sum, bin) => sum + bin.probability, 0), result.probability)
    for (const bin of bins) assert.equal(bin.from >= 88, bin.to >= 88)
    assert.equal(bins[0].from, result.distribution[0].sum)
    assert.equal(bins.at(-1).to, result.distribution.at(-1).sum)
  }
})

test('nonreplacement card probability reproduces both defaults and article boundaries', () => {
  close(cardProbability(cardDefaults).probability, 33 / 221)
  close(cardProbability({ total: 20, targets: 5, draws: 2 }).probability, 17 / 38)
  for (const draws of [0, 1, 2, 20]) {
    assert.equal(cardProbability({ total: 20, targets: 0, draws }).probability, 0)
    assert.equal(cardProbability({ total: 20, targets: 20, draws }).probability, draws ? 1 : 0)
  }
  assert.equal(cardProbability({ total: 20, targets: 5, draws: 20 }).probability, 1)
  assert.equal(cardProbability({ total: 1000, targets: 5, draws: 1000 }).probability, 1)
})

test('standalone EV weights signed net values or final totals with unrounded probabilities', () => {
  close(expectedValue({ ...evDefaults, probability: 100 * 15 / 36 }).ev, 7 / 6)
  close(expectedValue({ probability: 100 * 17 / 38, success: 5, failure: -1 }).ev, 32 / 19)
  assert.equal(expectedValue({ probability: 50, success: 9, failure: 0 }).ev, 4.5)
  assert.equal(expectedValue({ probability: 0, success: 9, failure: -2 }).ev, -2)
  assert.equal(expectedValue({ probability: 100, success: 9, failure: -2 }).ev, 9)
  assert.equal(expectedValue({ probability: 30, success: 5, failure: 5 }).ev, 5)
})

test('invalid and blank inputs remain invalid and tiny probabilities remain visible', () => {
  for (const dice of ['', NaN, Infinity, 0, 7, 1.5]) {
    assert.ok(diceErrors({ ...diceDefaults, dice }).dice)
    assert.throws(() => diceProbability({ ...diceDefaults, dice }), RangeError)
  }
  for (const faces of ['', 0, 101, 1.5]) assert.throws(() => diceDistribution(2, faces), RangeError)
  assert.ok(cardErrors({ ...cardDefaults, total: 0 }).total)
  assert.ok(cardErrors({ ...cardDefaults, targets: 53 }).targets)
  assert.ok(cardErrors({ ...cardDefaults, draws: 53 }).draws)
  assert.throws(() => cardProbability({ ...cardDefaults, draws: 53 }), RangeError)
  assert.ok(evErrors({ ...evDefaults, success: '' }).success)
  assert.throws(() => expectedValue({ ...evDefaults, probability: 101 }), RangeError)
  assert.notEqual(formatPercent(1e-12), '0%')
  assert.notEqual(formatPercent(1 - 1e-12), '100%')
})
