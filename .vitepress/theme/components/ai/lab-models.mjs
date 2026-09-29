export const people = [
  { id: 1, name: '林' },
  { id: 2, name: '周' },
  { id: 3, name: '陈' },
]

export const orders = [
  { id: 101, personId: 1, amount: 80 },
  { id: 102, personId: 1, amount: 35 },
  { id: 103, personId: 4, amount: 50 },
]

export function joinRows(kind = 'inner') {
  if (kind !== 'inner' && kind !== 'left') throw new Error('Unknown join kind')
  return people.flatMap((person) => {
    const matches = orders.filter((order) => order.personId === person.id)
    if (matches.length) return matches.map((order) => ({ person, order }))
    return kind === 'left' ? [{ person, order: null }] : []
  })
}

export const evaluationCases = [
  { label: 1, score: 0.95 }, { label: 0, score: 0.82 },
  { label: 1, score: 0.75 }, { label: 0, score: 0.61 },
  { label: 1, score: 0.45 }, { label: 0, score: 0.34 },
  { label: 1, score: 0.25 }, { label: 0, score: 0.15 },
]

export function confusionMetrics(threshold, cases = evaluationCases) {
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) throw new Error('Threshold must be within [0, 1]')
  const result = { tp: 0, fp: 0, tn: 0, fn: 0 }
  for (const item of cases) {
    const predicted = item.score >= threshold
    if (predicted && item.label === 1) result.tp++
    else if (predicted) result.fp++
    else if (item.label === 1) result.fn++
    else result.tn++
  }
  result.precision = result.tp + result.fp ? result.tp / (result.tp + result.fp) : 0
  result.recall = result.tp + result.fn ? result.tp / (result.tp + result.fn) : 0
  result.f1 = result.precision + result.recall ? 2 * result.precision * result.recall / (result.precision + result.recall) : 0
  return result
}

export const attentionQueries = [
  { label: '偏技术', vector: [1, 0] },
  { label: '偏设计', vector: [0, 1] },
  { label: '兼顾两者', vector: [1, 1] },
]

export const attentionKeys = [
  { label: 'Python', vector: [1, 0] },
  { label: '界面', vector: [0, 1] },
  { label: '案例', vector: [1, 1] },
]

export function attentionWeights(query) {
  if (!Array.isArray(query) || query.length !== 2 || query.some((item) => !Number.isFinite(item))) throw new Error('Expected a 2D query vector')
  const scores = attentionKeys.map((item) => (query[0] * item.vector[0] + query[1] * item.vector[1]) / Math.sqrt(2))
  const largest = Math.max(...scores)
  const exp = scores.map((score) => Math.exp(score - largest))
  const sum = exp.reduce((total, item) => total + item, 0)
  return scores.map((score, index) => ({ label: attentionKeys[index].label, score, weight: exp[index] / sum }))
}

export const retrievalQueries = [
  {
    label: '认证与权限',
    docs: [
      { title: '认证与授权', path: '/Web/JavaScript/Network/认证与授权', keyword: 0.98, semantic: 0.70 },
      { title: 'HTTP Cookie', path: '/Web/JavaScript/Network/HTTP Cookie', keyword: 0.72, semantic: 0.66 },
      { title: 'Agent 工具与安全', path: '/AI/Agent工具与安全', keyword: 0.20, semantic: 0.88 },
    ],
  },
  {
    label: '向量检索',
    docs: [
      { title: 'Embedding 与向量数据库', path: '/AI/Embedding与向量数据库', keyword: 0.90, semantic: 0.96 },
      { title: 'RAG 与检索质量', path: '/AI/RAG与检索质量', keyword: 0.62, semantic: 0.94 },
      { title: 'AI 应用开发', path: '/AI/AI应用开发', keyword: 0.38, semantic: 0.50 },
    ],
  },
]

export function rankDocuments(queryIndex, keywordWeight) {
  if (!Number.isInteger(queryIndex) || !retrievalQueries[queryIndex]) throw new Error('Unknown query')
  if (!Number.isFinite(keywordWeight) || keywordWeight < 0 || keywordWeight > 1) throw new Error('Weight must be within [0, 1]')
  return retrievalQueries[queryIndex].docs.map((doc) => ({
    ...doc,
    score: keywordWeight * doc.keyword + (1 - keywordWeight) * doc.semantic,
  })).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
}

export function evaluateToolAction(source, permission, action) {
  if (!['user', 'web'].includes(source) || !['read', 'write'].includes(permission) || !['read', 'write'].includes(action)) throw new Error('Invalid tool scenario')
  if (source === 'web') return { status: 'blocked', reason: '网页是低信任内容，不能替用户发起工具调用。' }
  if (action === 'write' && permission === 'read') return { status: 'blocked', reason: '工具只有读取权限，不能执行写入。' }
  if (action === 'write') return { status: 'confirm', reason: '写入会改变外部状态，执行前需要用户确认具体操作。' }
  return { status: 'allowed', reason: '来自用户的读取请求，且工具权限允许读取。' }
}
