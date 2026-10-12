// Counts are exact within the supported bounds; only display values are rounded.
export const diceDefaults = { dice: 2, faces: 6, threshold: 8 }
export const cardDefaults = { total: 52, targets: 4, draws: 2 }
export const evDefaults = { probability: 50, success: 7, failure: -3 }

export function numberError(value, label, min, max, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return `请输入${label}。`
  if (integer && !Number.isInteger(value)) return `${label}需要是整数。`
  if (value < min || value > max) return `${label}应在 ${min}～${max} 之间。`
  return ''
}

function validate(values, rules) {
  return Object.fromEntries(Object.entries(rules).flatMap(([key, rule]) => {
    const error = numberError(values[key], ...rule)
    return error ? [[key, error]] : []
  }))
}
function requireValid(errors) {
  if (Object.keys(errors).length) throw new RangeError(Object.values(errors).join(' '))
}
const diceRules = { dice: ['骰子数量 n', 1, 6, true], faces: ['每枚面数 m', 1, 100, true] }

export function diceErrors(values) {
  return validate(values, { ...diceRules, threshold: ['目标点数', 1, 601, true] })
}
export function cardErrors(values) {
  const errors = validate(values, {
    total: ['牌堆总数', 1, 1000, true], targets: ['目标牌数', 0, 1000, true], draws: ['抽取张数', 0, 1000, true],
  })
  if (!errors.total && !errors.targets && values.targets > values.total) errors.targets = '目标牌数不能超过牌堆总数。'
  if (!errors.total && !errors.draws && values.draws > values.total) errors.draws = '抽取张数不能超过牌堆总数。'
  return errors
}
export function evErrors(values) {
  return validate(values, {
    probability: ['事件概率（%）', 0, 100],
    success: ['事件发生时的结果', -1000000, 1000000],
    failure: ['未发生时的结果', -1000000, 1000000],
  })
}

export function diceDistribution(dice, faces = 6) {
  requireValid(validate({ dice, faces }, diceRules))
  let counts = [1]
  for (let die = 0; die < dice; die++) {
    const next = Array(counts.length + faces).fill(0)
    counts.forEach((count, sum) => {
      for (let face = 1; face <= faces; face++) next[sum + face] += count
    })
    counts = next
  }
  const total = faces ** dice
  return counts.flatMap((count, sum) => count ? [{ sum, count, probability: count / total }] : [])
}
export function diceProbability(values) {
  requireValid(diceErrors(values))
  const distribution = diceDistribution(values.dice, values.faces)
  const total = values.faces ** values.dice
  const successCount = distribution.reduce((sum, row) => sum + (row.sum >= values.threshold ? row.count : 0), 0)
  return { distribution, total, successCount, probability: successCount / total }
}

// Preserve every outcome while grouping dense charts; never merge across the event boundary.
export function diceChartBins(distribution, threshold, limit = 32) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('图表区间数需要是正整数。')
  const size = Math.max(1, Math.ceil(distribution.length / limit))
  const bins = []
  for (const row of distribution) {
    const success = row.sum >= threshold
    const previous = bins.at(-1)
    if (!previous || previous.length >= size || previous.success !== success) {
      bins.push({ from: row.sum, to: row.sum, count: row.count, probability: row.probability, success, length: 1 })
    } else {
      previous.to = row.sum
      previous.count += row.count
      previous.probability += row.probability
      previous.length++
    }
  }
  return bins
}

export function cardProbability(values) {
  requireValid(cardErrors(values))
  let miss = 1
  for (let index = 0; index < values.draws; index++) {
    if (index >= values.total - values.targets) { miss = 0; break }
    miss *= (values.total - values.targets - index) / (values.total - index)
  }
  return { probability: 1 - miss, miss }
}
export function expectedValue(values) {
  requireValid(evErrors(values))
  const probability = values.probability / 100
  return { probability, ev: probability * values.success + (1 - probability) * values.failure }
}
export function formatNumber(value, digits = 3) {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: digits }).format(Object.is(value, -0) ? 0 : value)
}
export function formatPercent(value) {
  const percent = value * 100
  if (percent > 0 && percent < 0.0001) return `${percent.toExponential(2)}%`
  // Keep rare d100 results and near-certainty distinct from zero or certainty.
  if (value < 1 && percent > 99.9999) return `约 100%（未发生 ${formatPercent(1 - value)}）`
  return `${formatNumber(percent, percent > 0 && percent < 0.01 ? 4 : 2)}%`
}
