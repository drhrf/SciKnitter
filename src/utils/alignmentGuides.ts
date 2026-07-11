export interface GuideBox {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface GuideResult {
  /** Offset to apply to the dragged node's position to snap it onto a guide (0 if no match) */
  dx: number
  dy: number
  /** Flow-space x of the vertical guide line to draw, or null if none matched */
  vGuideX: number | null
  /** Flow-space y of the horizontal guide line to draw, or null if none matched */
  hGuideY: number | null
}

function closestMatch(
  draggedValues: number[],
  otherValues: number[],
  threshold: number,
): { diff: number; guideAt: number } | null {
  let best: { diff: number; guideAt: number } | null = null
  for (const dv of draggedValues) {
    for (const ov of otherValues) {
      const diff = ov - dv
      if (Math.abs(diff) < threshold && (!best || Math.abs(diff) < Math.abs(best.diff))) {
        best = { diff, guideAt: ov }
      }
    }
  }
  return best
}

// Finds the nearest edge/center alignment between the dragged node and every
// other node, on each axis independently, within `threshold` px. Left/center/
// right edges are compared against the same three on every other node (so a
// dragged node's left edge can snap to another node's right edge too, not
// just its own left edge) — same for top/center/bottom on the Y axis.
export function computeGuides(dragged: GuideBox, others: GuideBox[], threshold = 6): GuideResult {
  const dX = [dragged.x, dragged.x + dragged.width / 2, dragged.x + dragged.width]
  const dY = [dragged.y, dragged.y + dragged.height / 2, dragged.y + dragged.height]

  let bestX: { diff: number; guideAt: number } | null = null
  let bestY: { diff: number; guideAt: number } | null = null

  for (const o of others) {
    if (o.id === dragged.id) continue
    const oX = [o.x, o.x + o.width / 2, o.x + o.width]
    const oY = [o.y, o.y + o.height / 2, o.y + o.height]

    const mx = closestMatch(dX, oX, threshold)
    if (mx && (!bestX || Math.abs(mx.diff) < Math.abs(bestX.diff))) bestX = mx

    const my = closestMatch(dY, oY, threshold)
    if (my && (!bestY || Math.abs(my.diff) < Math.abs(bestY.diff))) bestY = my
  }

  return {
    dx: bestX?.diff ?? 0,
    dy: bestY?.diff ?? 0,
    vGuideX: bestX?.guideAt ?? null,
    hGuideY: bestY?.guideAt ?? null,
  }
}
