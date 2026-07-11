import type { Node } from '@xyflow/react'

const PAD = 15
const ICON_SEP_PAD = 24
const MAX_TEXT_PASSES = 12
const MAX_SEPARATION_ITERS = 40

function overlaps(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
): boolean {
  return ax < bx + bw + PAD && ax + aw > bx - PAD &&
         ay < by + bh + PAD && ay + ah > by - PAD
}

function box(n: Node): { x: number; y: number; w: number; h: number } {
  return {
    x: n.position.x,
    y: n.position.y,
    w: n.width ?? (n.type === 'iconNode' ? 110 : 200),
    h: n.height ?? (n.type === 'iconNode' ? 100 : 60),
  }
}

// Pairwise iterative force-separation restricted to icon nodes — panels are
// textNodes and are never part of this set, so they're untouched by design.
// Mirrors the push-apart math in DiagramCanvas.autoLayout().
function separateIcons(iconNodes: Node[]): Node[] {
  const result = iconNodes.map((n) => ({ ...n, position: { ...n.position } }))
  for (let iter = 0; iter < MAX_SEPARATION_ITERS; iter++) {
    let moved = false
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const a = box(result[i])
        const b = box(result[j])
        const aw = a.w + ICON_SEP_PAD, ah = a.h + ICON_SEP_PAD
        const bw = b.w + ICON_SEP_PAD, bh = b.h + ICON_SEP_PAD
        const ax2 = a.x + aw, ay2 = a.y + ah
        const bx2 = b.x + bw, by2 = b.y + bh
        if (ax2 > b.x && bx2 > a.x && ay2 > b.y && by2 > a.y) {
          const ox = Math.min(ax2 - b.x, bx2 - a.x) / 2
          const oy = Math.min(ay2 - b.y, by2 - a.y) / 2
          if (ox < oy) {
            const d = a.x < b.x ? ox : -ox
            result[i].position = { ...result[i].position, x: result[i].position.x - d }
            result[j].position = { ...result[j].position, x: result[j].position.x + d }
          } else {
            const d = a.y < b.y ? oy : -oy
            result[i].position = { ...result[i].position, y: result[i].position.y - d }
            result[j].position = { ...result[j].position, y: result[j].position.y + d }
          }
          moved = true
        }
      }
    }
    if (!moved) break
  }
  return result
}

// Finds a non-overlapping position for a box currently overlapping another,
// preferring the direction (right/left/above/below) with the most free room,
// else the candidate requiring the smallest move.
function nudgeAwayFromBox(
  pos: { x: number; y: number }, tw: number, th: number,
  ix: number, iy: number, iw: number, ih: number,
  obstacles: Array<{ x: number; y: number; w: number; h: number }>,
): { x: number; y: number } {
  const candidates = [
    { x: ix + iw + PAD,       y: iy + (ih - th) / 2 },  // right
    { x: ix - tw - PAD,       y: iy + (ih - th) / 2 },  // left
    { x: ix + (iw - tw) / 2,  y: iy - th - PAD },       // above
    { x: ix + (iw - tw) / 2,  y: iy + ih + PAD },       // below
  ]
  const freeOnes = candidates.filter((c) =>
    obstacles.every((o) => !overlaps(c.x, c.y, tw, th, o.x, o.y, o.w, o.h)),
  )
  const pool = freeOnes.length > 0 ? freeOnes : candidates
  pool.sort(
    (a, b) =>
      Math.hypot(a.x - pos.x, a.y - pos.y) -
      Math.hypot(b.x - pos.x, b.y - pos.y),
  )
  return pool[0]
}

/**
 * Deterministic, panel-safe layout correction run automatically on every
 * spec import (LLM paste or manual JSON file) as a safety net independent of
 * how well the source JSON's coordinates were chosen.
 *
 * Panels (type 'panelNode') are never moved — they define fixed regions that
 * intentionally enclose their member icons. Everything else is:
 *  1. Icon-vs-icon overlaps resolved by iterative force-separation.
 *  2. Non-panel text nodes (annotations) nudged to a fixpoint against the
 *     now-final icon positions and against each other, looping until a pass
 *     makes no further moves (bounded by MAX_TEXT_PASSES).
 */
export function resolveLayoutOverlaps(nodes: Node[]): Node[] {
  const iconNodes = nodes.filter((n) => n.type === 'iconNode')
  const separatedIcons = separateIcons(iconNodes)
  const iconById = new Map(separatedIcons.map((n) => [n.id, n]))

  const result = nodes.map((n) => iconById.get(n.id) ?? { ...n, position: { ...n.position } })
  const movable = result.filter((n) => n.type === 'iconNode' || n.type === 'textNode')

  for (let pass = 0; pass < MAX_TEXT_PASSES; pass++) {
    let moved = false

    for (const n of movable) {
      if (n.type !== 'textNode') continue

      const tb = box(n)
      const obstacle = movable.find((m) => {
        if (m === n) return false
        const mb = box(m)
        return overlaps(tb.x, tb.y, tb.w, tb.h, mb.x, mb.y, mb.w, mb.h)
      })
      if (!obstacle) continue

      const ob = box(obstacle)
      const others = movable.filter((m) => m !== n && m !== obstacle).map(box)
      n.position = nudgeAwayFromBox(n.position, tb.w, tb.h, ob.x, ob.y, ob.w, ob.h, others)
      moved = true
    }

    if (!moved) break
  }

  return result
}
