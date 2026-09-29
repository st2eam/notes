import cytoscape from 'cytoscape'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 2.4
const LAYOUT_SEED = 0xa71a5

export function nodeSize(node) {
  return node?.kind === 'theme' ? { width: 125, height: 80 } : { width: 96, height: 48 }
}

function mulberry32(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function round(value) {
  return Math.round(value * 10) / 10
}

function reach(node, ux, uy) {
  if (node.kind === 'theme') {
    const halfWidth = node.width / 2
    const halfHeight = node.height / 2
    return 1 / (Math.abs(ux) / halfWidth + Math.abs(uy) / halfHeight)
  }
  const rx = node.width / 2
  const ry = node.height / 2
  return 1 / Math.sqrt((ux / rx) ** 2 + (uy / ry) ** 2)
}

/** Push overlapping shapes apart. Order is fixed, so the result stays seeded. */
function separateShapes(positions, gap = 16) {
  const ids = Object.keys(positions)
  for (let iteration = 0; iteration < 160; iteration += 1) {
    let moved = false
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const a = positions[ids[i]]
        const b = positions[ids[j]]
        let dx = b.x - a.x
        let dy = b.y - a.y
        let distance = Math.hypot(dx, dy)
        if (distance < 0.5) {
          dx = 1
          dy = 0.25
          distance = Math.hypot(dx, dy)
        }
        const ux = dx / distance
        const uy = dy / distance
        const needed = reach(a, ux, uy) + reach(b, ux, uy) + gap
        if (distance + 0.2 >= needed) continue
        const push = (needed - distance) / 2
        a.x -= ux * push
        a.y -= uy * push
        b.x += ux * push
        b.y += uy * push
        moved = true
      }
    }
    if (!moved) break
  }
}

/** Headless cose positions. A fixed seed keeps the atlas still across reloads. */
export function layoutAtlas(nodes, edges) {
  const cy = cytoscape({
    headless: true,
    elements: [
      ...nodes.map((node) => ({ data: { id: node.id, kind: node.kind } })),
      ...edges.map((edge) => ({ data: { id: edge.id, source: edge.from, target: edge.to } })),
    ],
    style: [
      { selector: 'node', style: { width: 96, height: 48 } },
      { selector: 'node[kind = "theme"]', style: { width: 125, height: 80 } },
    ],
  })
  const random = Math.random
  Math.random = mulberry32(LAYOUT_SEED)
  try {
    cy.layout({
      name: 'cose',
      animate: false,
      randomize: true,
      fit: false,
      boundingBox: { x1: 0, y1: 0, w: 1280, h: 820 },
      nodeRepulsion: () => 28000,
      idealEdgeLength: () => 130,
      edgeElasticity: () => 100,
      gravity: 0.4,
      numIter: 800,
      nodeOverlap: 20,
    }).run()
  } finally {
    Math.random = random
  }
  const positions = {}
  cy.nodes().forEach((node) => {
    const point = node.position()
    const kind = node.data('kind')
    positions[node.id()] = { x: point.x, y: point.y, kind, ...nodeSize({ kind }) }
  })
  cy.destroy()
  separateShapes(positions)
  return positions
}

function inset(node, ux, uy) {
  const halfWidth = node.width / 2
  const halfHeight = node.height / 2
  const alongX = Math.abs(ux) > 1e-6 ? halfWidth / Math.abs(ux) : Infinity
  const alongY = Math.abs(uy) > 1e-6 ? halfHeight / Math.abs(uy) : Infinity
  return Math.min(alongX, alongY) + 8
}

/** Quadratic curve with endpoints pulled back so the arrow clears the node. */
export function edgePath(a, b, bend = 18) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const length = Math.hypot(dx, dy) || 1
  const ux = dx / length
  const uy = dy / length
  const startGap = Math.min(inset(a, ux, uy), length * 0.35)
  const endGap = Math.min(inset(b, -ux, -uy), length * 0.35)
  const x1 = a.x + ux * startGap
  const y1 = a.y + uy * startGap
  const x2 = b.x - ux * endGap
  const y2 = b.y - uy * endGap
  const cx = (x1 + x2) / 2 - uy * bend
  const cy = (y1 + y2) / 2 + ux * bend
  return `M ${round(x1)} ${round(y1)} Q ${round(cx)} ${round(cy)} ${round(x2)} ${round(y2)}`
}

export function labelLines(title, kind) {
  const width = kind === 'theme' ? 125 : 96
  const size = kind === 'theme' ? 15 : 14
  const max = Math.max(4, Math.floor((width - 22) / size))
  const chars = Array.from(title)
  if (chars.length <= max) return [title]
  const mid = Math.ceil(chars.length / 2)
  return [chars.slice(0, mid).join(''), chars.slice(mid).join('')]
}

/**
 * Camera that frames node boxes inside the viewport.
 * Returns translate(x, y) + scale(k), with k clamped to the old zoom range.
 */
export function fitView(positions, viewport, padding = 36) {
  const items = Object.values(positions)
  if (!items.length || viewport.width <= 0 || viewport.height <= 0) return { x: 0, y: 0, k: 1 }
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const item of items) {
    const halfWidth = (item.width ?? 96) / 2
    const halfHeight = (item.height ?? 48) / 2
    minX = Math.min(minX, item.x - halfWidth)
    minY = Math.min(minY, item.y - halfHeight)
    maxX = Math.max(maxX, item.x + halfWidth)
    maxY = Math.max(maxY, item.y + halfHeight)
  }
  const boundsWidth = Math.max(maxX - minX, 1)
  const boundsHeight = Math.max(maxY - minY, 1)
  const innerWidth = Math.max(viewport.width - padding * 2, 1)
  const innerHeight = Math.max(viewport.height - padding * 2, 1)
  const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min(innerWidth / boundsWidth, innerHeight / boundsHeight)))
  return {
    x: viewport.width / 2 - ((minX + maxX) / 2) * k,
    y: viewport.height / 2 - ((minY + maxY) / 2) * k,
    k,
  }
}
