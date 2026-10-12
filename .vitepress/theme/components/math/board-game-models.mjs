// Counts are exact; only presentation rounds probabilities and scores.
export const diceDefaults = { dice: 2, threshold: 8, reward: 8, loss: 2, cost: 1, stable: 1 }
export const cardDefaults = { total: 52, targets: 4, draws: 2, reward: 6, cost: 1 }
export const riskDefaults = { stop: 5, probability: 50, success: 9, failure: 0 }

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

const points = (label) => [label, 0, 1000000]
const finalScore = (label) => [label, -1000000, 1000000]

export function diceErrors(values) {
  return validate(values, {
    dice: ['骰子数量', 1, 6, true], threshold: ['成功门槛', 1, 37, true],
    reward: points('成功奖励'), loss: points('失败额外损失'), cost: points('固定成本'),
    stable: finalScore('稳定替代收益'),
  })
}

export function cardErrors(values) {
  const errors = validate(values, {
    total: ['牌堆总数', 1, 1000, true], targets: ['目标牌数', 0, 1000, true],
    draws: ['抽取张数', 0, 1000, true], reward: points('奖励'), cost: points('抽牌成本'),
  })
  if (!errors.total && !errors.targets && values.targets > values.total) errors.targets = '目标牌数不能超过牌堆总数。'
  if (!errors.total && !errors.draws && values.draws > values.total) errors.draws = '抽取张数不能超过牌堆总数。'
  return errors
}

export function riskErrors(values) {
  return validate(values, {
    stop: finalScore('停手保留分数'), probability: ['成功概率', 0, 100],
    success: finalScore('成功后的总分'), failure: finalScore('失败后的总分'),
  })
}

function requireValid(errors) {
  if (Object.keys(errors).length) throw new RangeError(Object.values(errors).join(' '))
}

export function diceDistribution(dice) {
  requireValid(validate({ dice }, { dice: ['骰子数量', 1, 6, true] }))
  let counts = [1]
  for (let die = 0; die < dice; die++) {
    const next = Array(counts.length + 6).fill(0)
    counts.forEach((count, sum) => {
      for (let face = 1; face <= 6; face++) next[sum + face] += count
    })
    counts = next
  }
  const total = 6 ** dice
  return counts.flatMap((count, sum) => count ? [{ sum, count, probability: count / total }] : [])
}

export function diceMetrics(values) {
  requireValid(diceErrors(values))
  const distribution = diceDistribution(values.dice)
  const total = 6 ** values.dice
  const successCount = distribution.reduce((sum, row) => sum + (row.sum >= values.threshold ? row.count : 0), 0)
  const probability = successCount / total
  const ev = probability * values.reward - (1 - probability) * values.loss - values.cost
  const variance = probability * (1 - probability) * (values.reward + values.loss) ** 2
  return { distribution, total, successCount, probability, mean: 3.5 * values.dice,
    ev, variance, sd: Math.sqrt(variance), difference: ev - values.stable }
}

export function cardMetrics(values, rule = 'once') {
  requireValid(cardErrors(values))
  if (!['once', 'each'].includes(rule)) throw new RangeError('未知计分规则。')
  let miss = 1
  for (let index = 0; index < values.draws; index++) {
    if (index >= values.total - values.targets) { miss = 0; break }
    miss *= (values.total - values.targets - index) / (values.total - index)
  }
  const probability = 1 - miss
  const expectedHits = values.draws * values.targets / values.total
  const onceEv = values.reward * probability - values.cost
  const eachEv = values.reward * expectedHits - values.cost
  return { probability, expectedHits, onceEv, eachEv, ev: rule === 'once' ? onceEv : eachEv }
}

export function riskMetrics(values) {
  requireValid(riskErrors(values))
  const probability = values.probability / 100
  const ev = probability * values.success + (1 - probability) * values.failure
  const variance = probability * (1 - probability) * (values.success - values.failure) ** 2
  return { probability, ev, variance, sd: Math.sqrt(variance), difference: ev - values.stop }
}

export function formatNumber(value, digits = 3) {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: digits }).format(Object.is(value, -0) ? 0 : value)
}

export function formatPercent(value) {
  return `${formatNumber(value * 100, value > 0 && value < 0.0001 ? 4 : 2)}%`
}

export function compareMean(difference, first, second) {
  if (Math.abs(difference) < 1e-9) return `${first}与${second}的期望相同。`
  const amount = Math.abs(difference)
  const label = amount < 0.001 ? '不足 0.001' : ` ${formatNumber(amount)}`
  return difference > 0
    ? `${first}的期望比${second}高${label} 分。`
    : `${first}的期望比${second}低${label} 分。`
}
