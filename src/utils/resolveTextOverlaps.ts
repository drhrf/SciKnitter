import type { Node } from '@xyflow/react'

const PAD = 15

function overlaps(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
): boolean {
  return ax < bx + bw + PAD && ax + aw > bx - PAD &&
         ay < by + bh + PAD && ay + ah > by - PAD
}

/**
 * Moves text annotation nodes off icon node bounding boxes.
 * Panel text nodes (zIndex < 0) are left in place.
 * Each text node is tested against all icon nodes and nudged to the
 * nearest non-overlapping position (right → left → above → below).
 */
export function resolveTextOverlaps(nodes: Node[]): Node[] {
  const iconNodes = nodes.filter((n) => n.type === 'iconNode')
  const result = nodes.map((n) => ({ ...n, position: { ...n.position } }))

  for (let i = 0; i < result.length; i++) {
    const n = result[i]
    if (n.type !== 'textNode') continue
    if ((n.zIndex ?? 0) < 0) continue // leave panels alone

    const tw = n.width ?? 200
    const th = n.height ?? 60

    for (const icon of iconNodes) {
      const ix = icon.position.x
      const iy = icon.position.y
      const iw = icon.width ?? 110
      const ih = icon.height ?? 100

      if (!overlaps(n.position.x, n.position.y, tw, th, ix, iy, iw, ih)) continue

      // Four candidate positions around the offending icon
      const candidates = [
        { x: ix + iw + PAD,       y: iy + (ih - th) / 2 },  // right
        { x: ix - tw - PAD,       y: iy + (ih - th) / 2 },  // left
        { x: ix + (iw - tw) / 2,  y: iy - th - PAD },       // above
        { x: ix + (iw - tw) / 2,  y: iy + ih + PAD },       // below
      ]

      // Prefer candidates that don't overlap any icon
      const freeOnes = candidates.filter((pos) =>
        iconNodes.every(
          (ic) => !overlaps(pos.x, pos.y, tw, th, ic.position.x, ic.position.y, ic.width ?? 110, ic.height ?? 100),
        ),
      )
      const pool = freeOnes.length > 0 ? freeOnes : candidates

      // Pick the one requiring the smallest move
      pool.sort(
        (a, b) =>
          Math.hypot(a.x - n.position.x, a.y - n.position.y) -
          Math.hypot(b.x - n.position.x, b.y - n.position.y),
      )

      result[i] = { ...result[i], position: pool[0] }
      break
    }
  }

  return result
}
