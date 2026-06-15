import { getAllIcons } from '../data/iconsIndex'
import type { DiagramExport } from '../types'
import { applyShapeStyle, isShapeNode } from './shapeStyle'

const NODE_W = 110
const NODE_H = 100
const PAD = 70

// Arrow / blunt-end geometry (used instead of SVG markers, which Chrome
// does not render when an SVG is drawn to canvas via ctx.drawImage).
const ARROW_LEN = 9
const ARROW_HW = 5
const BLUNT_HW = 8

// ─── Edge routing ────────────────────────────────────────────────────────────

function routeEdge(
  srcX: number, srcY: number, srcW: number, srcH: number,
  tgtX: number, tgtY: number, tgtW: number, tgtH: number,
  ox: number, oy: number,
) {
  const srcCX = srcX + srcW / 2 - ox
  const srcCY = srcY + srcH / 2 - oy
  const tgtCX = tgtX + tgtW / 2 - ox
  const tgtCY = tgtY + tgtH / 2 - oy

  const ddx = tgtCX - srcCX
  const ddy = tgtCY - srcCY

  let sx: number, sy: number, tx: number, ty: number
  let cp1x: number, cp1y: number, cp2x: number, cp2y: number

  if (Math.abs(ddx) >= Math.abs(ddy)) {
    // Primarily horizontal — connect from the side edges
    if (ddx >= 0) {
      sx = srcX + srcW - ox; sy = srcCY
      tx = tgtX - ox;        ty = tgtCY
    } else {
      sx = srcX - ox;        sy = srcCY
      tx = tgtX + tgtW - ox; ty = tgtCY
    }
    const cpOff = Math.max(50, Math.abs(ddx) * 0.4)
    const s = ddx >= 0 ? 1 : -1
    cp1x = sx + cpOff * s; cp1y = sy
    cp2x = tx - cpOff * s; cp2y = ty
  } else {
    // Primarily vertical — connect from top/bottom edges
    if (ddy >= 0) {
      sx = srcCX; sy = srcY + srcH - oy
      tx = tgtCX; ty = tgtY - oy
    } else {
      sx = srcCX; sy = srcY - oy
      tx = tgtCX; ty = tgtY + tgtH - oy
    }
    const cpOff = Math.max(50, Math.abs(ddy) * 0.4)
    const s = ddy >= 0 ? 1 : -1
    cp1x = sx; cp1y = sy + cpOff * s
    cp2x = tx; cp2y = ty - cpOff * s
  }

  // Unit tangent at END (direction of approach to tip): P2 → P3
  const ex = tx - cp2x; const ey = ty - cp2y
  const el = Math.sqrt(ex * ex + ey * ey) || 1
  const ux = ex / el;  const uy = ey / el

  // Unit tangent at START (direction leaving source): P0 → P1; negate for
  // bidirectional arrowhead pointing INTO the source node
  const bx = cp1x - sx; const by = cp1y - sy
  const bl = Math.sqrt(bx * bx + by * by) || 1
  const tailUX = -(bx / bl); const tailUY = -(by / bl)

  const f = (n: number) => n.toFixed(1)
  const pathD = `M ${f(sx)} ${f(sy)} C ${f(cp1x)} ${f(cp1y)} ${f(cp2x)} ${f(cp2y)} ${f(tx)} ${f(ty)}`

  return { pathD, tipX: tx, tipY: ty, ux, uy, tailX: sx, tailY: sy, tailUX, tailUY }
}

// Inline filled arrow-head polygon (replaces SVG marker)
function makeArrow(tipX: number, tipY: number, ux: number, uy: number, color: string): string {
  const nx = -uy; const ny = ux  // perpendicular
  const bx = tipX - ARROW_LEN * ux; const by = tipY - ARROW_LEN * uy
  const f = (n: number) => n.toFixed(1)
  const pts = [
    `${f(tipX)},${f(tipY)}`,
    `${f(bx + ARROW_HW * nx)},${f(by + ARROW_HW * ny)}`,
    `${f(bx - ARROW_HW * nx)},${f(by - ARROW_HW * ny)}`,
  ].join(' ')
  return `<polygon points="${pts}" fill="${color}"/>`
}

// Blunt / inhibitory end — perpendicular bar
function makeBlunt(tipX: number, tipY: number, ux: number, uy: number, color: string): string {
  const nx = -uy * BLUNT_HW; const ny = ux * BLUNT_HW
  const f = (n: number) => n.toFixed(1)
  return `<line x1="${f(tipX - nx)}" y1="${f(tipY - ny)}" x2="${f(tipX + nx)}" y2="${f(tipY + ny)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`
}

// ─── SVG content scoping ──────────────────────────────────────────────────────
//
// When multiple icon SVGs are inlined in one export document, their CSS class
// names (.cls-1, .cls-2 …) and element IDs (clippath-1, mask-1 …) collide —
// the last definition in the file wins, corrupting earlier icons.  We prefix
// every class name and every id/url-reference with a unique per-icon token.

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function scopeSvgContent(inner: string, prefix: string): string {
  // Collect every id="…" value so we can update back-references.
  const ids: string[] = []
  inner.replace(/\bid="([^"]+)"/g, (_, id) => { ids.push(id); return _ })

  let out = inner

  // 1. Rename id attributes
  out = out.replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}-${id}"`)

  // 2. Update url(#id) and href="#id" references everywhere (including inside
  //    <style> blocks — will be re-touched below only for class names)
  for (const id of ids) {
    const re = new RegExp(`url\\(#${escapeRe(id)}\\)`, 'g')
    out = out.replace(re, `url(#${prefix}-${id})`)
    const re2 = new RegExp(`href="#${escapeRe(id)}"`, 'g')
    out = out.replace(re2, `href="#${prefix}-${id}"`)
  }

  // 3. Scope CSS class selectors inside <style> blocks
  out = out.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, open, css, close) => {
    const scoped = css.replace(/\.([\w-]+)/g, (_m: string, cls: string) => `.${prefix}-${cls}`)
    return `${open}${scoped}${close}`
  })

  // 4. Prefix class="" attribute values on SVG elements
  out = out.replace(/\bclass="([^"]+)"/g, (_, classes: string) => {
    const scoped = classes.trim().split(/\s+/).map((c) => `${prefix}-${c}`).join(' ')
    return `class="${scoped}"`
  })

  return out
}

// ─── SVG wrapper stripping ────────────────────────────────────────────────────

function stripSvgWrapper(svgContent: string, scopePrefix?: string): { inner: string; viewBox: string } {
  const vbMatch = svgContent.match(/\bviewBox\s*=\s*["']([^"']+)["']/)
  const viewBox = vbMatch ? vbMatch[1] : '0 0 80 80'

  let inner = svgContent
    .replace(/<\?xml[^?]*\?>\s*/i, '')
    .replace(/<!DOCTYPE[^>]*>\s*/i, '')
    .replace(/<svg\b[^>]*>/i, '')   // strip first <svg> opening tag
    .replace(/<\/svg>\s*$/i, '')    // strip last </svg> closing tag
    .trim()

  if (scopePrefix) inner = scopeSvgContent(inner, scopePrefix)

  return { inner, viewBox }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function exportToSvg(spec: DiagramExport, bgColor = '#f8fafc'): string {
  const iconMap = new Map(getAllIcons().map((i) => [i.id, i]))
  const nodeMap = new Map(spec.nodes.map((n) => [n.id, n]))

  if (spec.nodes.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120">
  <rect width="400" height="120" fill="${bgColor}"/>
  <text x="200" y="65" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#9ca3af">Empty diagram</text>
</svg>`
  }

  // Bounding box across all node types
  const allX     = spec.nodes.map((n) => n.x)
  const allY     = spec.nodes.map((n) => n.y)
  const allRight = spec.nodes.map((n) =>
    n.x + (n.nodeType === 'text' ? (n.width ?? 200) : (n.width ?? NODE_W)))
  const allBottom = spec.nodes.map((n) =>
    n.y + (n.nodeType === 'text' ? (n.height ?? 60) : (n.height ?? NODE_H)))

  const ox = Math.min(...allX) - PAD
  const oy = Math.min(...allY) - PAD
  const W  = Math.max(...allRight)  + PAD - ox
  const H  = Math.max(...allBottom) + PAD - oy

  // ── Edges (inline arrowheads — no markers) ──────────────────────────────────
  const edgeEls = spec.edges
    .map((edge) => {
      const src = nodeMap.get(edge.from)
      const tgt = nodeMap.get(edge.to)
      if (!src || !tgt) return ''

      const srcW = src.nodeType === 'text' ? (src.width ?? 200) : (src.width ?? NODE_W)
      const srcH = src.nodeType === 'text' ? (src.height ?? 60) : (src.height ?? NODE_H)
      const tgtW = tgt.nodeType === 'text' ? (tgt.width ?? 200) : (tgt.width ?? NODE_W)
      const tgtH = tgt.nodeType === 'text' ? (tgt.height ?? 60) : (tgt.height ?? NODE_H)

      const strokeColor = edge.strokeColor ?? '#64748b'
      const strokeWidth = edge.strokeWidth ?? 2
      const isBlunt        = edge.style === 'blunt'
      const isDashed       = edge.style === 'dashed'
      const isBidirectional = edge.style === 'bidirectional'

      const route = routeEdge(src.x, src.y, srcW, srcH, tgt.x, tgt.y, tgtW, tgtH, ox, oy)

      const dash = isDashed ? ` stroke-dasharray="6,4"` : ''
      const pathEl = `<path d="${route.pathD}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}"${dash}/>`

      const headEl = isBlunt
        ? makeBlunt(route.tipX, route.tipY, route.ux, route.uy, strokeColor)
        : makeArrow(route.tipX, route.tipY, route.ux, route.uy, strokeColor)

      const tailEl = isBidirectional
        ? makeArrow(route.tailX, route.tailY, route.tailUX, route.tailUY, strokeColor)
        : ''

      const lx = (route.tipX + route.tailX) / 2
      const ly = (route.tipY + route.tailY) / 2
      const labelEl = edge.label
        ? `<rect x="${lx - edge.label.length * 3.5 - 4}" y="${ly - 9}" width="${edge.label.length * 7 + 8}" height="16" rx="3" fill="white" stroke="#e2e8f0"/>
<text x="${lx}" y="${ly + 3}" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="10" fill="#475569">${escapeXml(edge.label)}</text>`
        : ''

      return [pathEl, headEl, tailEl, labelEl].filter(Boolean).join('\n')
    })
    .filter(Boolean)
    .join('\n')

  // ── Nodes ───────────────────────────────────────────────────────────────────
  // Effective stacking mirrors specToRFNodes(): filled text nodes are panel
  // backgrounds (z < 0) that must sit BEHIND the edges; icons and annotation
  // text sit in front. SVG has no z-index — order is pure document order — so
  // we partition the elements and emit panels, then edges, then everything else.
  const nodeParts = spec.nodes
    .map((node, nodeIdx): { z: number; el: string } => {
      const z = node.nodeType === 'text'
        ? (node.bgColor ? -1 : (node.zIndex ?? 2))
        : (node.zIndex ?? 2)
      if (node.nodeType === 'text') {
        const nx = node.x - ox
        const ny = node.y - oy
        const nw = node.width ?? 200
        const nh = node.height ?? 60
        const fontSize   = node.fontSize ?? 14
        const fontWeight = node.fontWeight ?? 'normal'
        const fontStyle  = node.fontStyle ?? 'normal'
        const textColor  = node.textColor || '#1e293b'
        const bgFill     = node.bgColor || 'none'
        const borderStroke = node.borderColor || 'none'
        const textAlign  = node.textAlign ?? 'left'

        const anchor = textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start'
        const textX  =
          textAlign === 'center' ? nx + nw / 2
          : textAlign === 'right' ? nx + nw - 8
          : nx + 8

        const lines = wrapTextForSvg(node.text, nw, fontSize)
        const lineH = fontSize * 1.5
        const tspans = lines
          .map((line, idx) => {
            const dy = idx === 0 ? fontSize + 6 : lineH
            return `<tspan x="${textX}" dy="${dy}">${escapeXml(line || ' ')}</tspan>`
          })
          .join('')

        const rotation = node.rotation ?? 0
        const cx = nx + nw / 2; const cy = ny + nh / 2
        const groupOpen  = rotation !== 0 ? `<g transform="rotate(${rotation}, ${cx}, ${cy})">` : '<g>'
        const groupClose = '</g>'

        const bgEl = bgFill !== 'none' || borderStroke !== 'none'
          ? `<rect x="${nx}" y="${ny}" width="${nw}" height="${nh}" rx="6" fill="${bgFill}" stroke="${borderStroke}" stroke-width="1.5"/>`
          : ''

        const textEl = `<text y="${ny}" font-family="-apple-system,sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${fontStyle}" fill="${textColor}" text-anchor="${anchor}">${tspans}</text>`

        return { z, el: [groupOpen, bgEl, textEl, groupClose].filter(Boolean).join('\n') }
      }

      // Icon node
      const icon  = iconMap.get(node.iconId)
      const nx    = node.x - ox
      const ny    = node.y - oy
      const nw    = node.width  ?? NODE_W
      const nh    = node.height ?? NODE_H
      const bgFill = node.bgColor === 'transparent' ? 'none' : (node.bgColor || 'white')

      const baseSvg = icon?.svgContent ?? node.svgContent
      const rawSvg  = isShapeNode(node.iconId)
        ? applyShapeStyle(baseSvg ?? '', node.shapeStrokeColor, node.shapeStrokeWidth)
        : baseSvg

      // Use per-icon scope prefix so CSS classes and IDs don't collide
      const { inner: innerSvg, viewBox } = rawSvg
        ? stripSvgWrapper(rawSvg, `sk${nodeIdx}`)
        : {
            inner: `<rect x="10" y="10" width="60" height="60" rx="6" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1.5"/>`,
            viewBox: '0 0 80 80',
          }

      const labelY   = nh - 4
      const iconSize = Math.round(Math.min(nw, nh - 20) * 0.8)
      const iconX    = Math.round((nw - iconSize) / 2)
      const rotation = node.rotation ?? 0

      return { z, el: `<g transform="translate(${nx},${ny}) rotate(${rotation}, ${nw / 2}, ${nh / 2})">
  <rect width="${nw}" height="${nh}" rx="10" fill="${bgFill}" stroke="${bgFill === 'none' ? 'none' : '#e2e8f0'}" stroke-width="1.5"/>
  <svg x="${iconX}" y="6" viewBox="${viewBox}" width="${iconSize}" height="${iconSize}" overflow="visible">${innerSvg}</svg>
  <text x="${nw / 2}" y="${labelY}" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="10.5" fill="#374151">${escapeXml(node.label)}</text>
</g>` }
    })

  // Panels (z < 0) paint behind the edges; icons & annotation text in front.
  const bgNodeEls = nodeParts.filter((n) => n.z < 0).map((n) => n.el).join('\n')
  const fgNodeEls = nodeParts.filter((n) => n.z >= 0).map((n) => n.el).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${bgColor}"/>
${bgNodeEls}
${edgeEls}
${fgNodeEls}
</svg>`
}

// ─── PNG export ───────────────────────────────────────────────────────────────

export async function exportToPng(svgContent: string, filename: string, scale = 2): Promise<void> {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgContent, 'image/svg+xml')
  const svgEl = doc.documentElement
  const w = parseFloat(svgEl.getAttribute('width') ?? '800')
  const h = parseFloat(svgEl.getAttribute('height') ?? '600')
  const canvas = document.createElement('canvas')
  canvas.width  = w * scale
  canvas.height = h * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  const img = new Image()
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  await new Promise<void>((resolve, reject) => {
    img.onload = () => { ctx.drawImage(img, 0, 0); resolve() }
    img.onerror = reject
    img.src = url
  })
  URL.revokeObjectURL(url)
  canvas.toBlob((b) => {
    if (!b) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(b)
    a.download = filename
    a.click()
  }, 'image/png')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wrapTextForSvg(text: string, boxWidth: number, fontSize: number): string[] {
  const charWidth = fontSize * 0.56
  const maxChars  = Math.max(1, Math.floor((boxWidth - 16) / charWidth))
  const result: string[] = []

  for (const paragraph of text.split('\n')) {
    if (!paragraph) { result.push(''); continue }
    const words = paragraph.split(/\s+/)
    let line = ''
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (candidate.length <= maxChars || !line) {
        line = candidate
      } else {
        result.push(line)
        line = word
      }
    }
    if (line) result.push(line)
  }

  return result.length > 0 ? result : ['']
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
