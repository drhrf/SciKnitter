import { getAllIcons } from '../data/iconsIndex'
import type { DiagramExport } from '../types'

const NODE_W = 110
const NODE_H = 100
const PAD = 70

export function exportToSvg(spec: DiagramExport, title?: string): string {
  const iconMap = new Map(getAllIcons().map((i) => [i.id, i]))
  const nodeMap = new Map(spec.nodes.map((n) => [n.id, n]))

  if (spec.nodes.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120">
  <rect width="400" height="120" fill="#f8fafc"/>
  <text x="200" y="65" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#9ca3af">Empty diagram</text>
</svg>`
  }

  // Bounding box across all node types
  const allX = spec.nodes.map((n) => n.x)
  const allY = spec.nodes.map((n) => n.y)
  const allRight = spec.nodes.map((n) =>
    n.nodeType === 'text' ? n.x + (n.width ?? 200) : n.x + (n.width ?? NODE_W),
  )
  const allBottom = spec.nodes.map((n) =>
    n.nodeType === 'text' ? n.y + (n.height ?? 60) : n.y + (n.height ?? NODE_H),
  )

  const ox = Math.min(...allX) - PAD
  const oy = Math.min(...allY) - (title ? PAD + 24 : PAD)
  const W = Math.max(...allRight) + PAD - ox
  const H = Math.max(...allBottom) + PAD - oy

  const defs = `  <defs>
    <marker id="sk-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
      <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#64748b"/>
    </marker>
    <marker id="sk-blunt" markerWidth="6" markerHeight="12" refX="3" refY="6" orient="auto">
      <line x1="3" y1="1" x2="3" y2="11" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
    </marker>
  </defs>`

  const edgeEls = spec.edges
    .map((edge) => {
      const src = nodeMap.get(edge.from)
      const tgt = nodeMap.get(edge.to)
      if (!src || !tgt) return ''

      const srcW = src.nodeType === 'text' ? (src.width ?? 200) : (src.width ?? NODE_W)
      const srcH = src.nodeType === 'text' ? (src.height ?? 60) : (src.height ?? NODE_H)
      const tgtW = tgt.nodeType === 'text' ? (tgt.width ?? 200) : (tgt.width ?? NODE_W)

      const sx = src.x + srcW / 2 - ox
      const sy = src.y + srcH - oy
      const tx = tgt.x + tgtW / 2 - ox
      const ty = tgt.y - oy

      const dy = Math.max(36, Math.abs(ty - sy) * 0.45)
      const pathD = `M ${sx} ${sy} C ${sx} ${sy + dy} ${tx} ${ty - dy} ${tx} ${ty}`

      const isBlunt = edge.style === 'blunt'
      const isDashed = edge.style === 'dashed'
      const marker = isBlunt ? 'url(#sk-blunt)' : 'url(#sk-arrow)'
      const dash = isDashed ? ' stroke-dasharray="6,4"' : ''

      const pathEl = `  <path d="${pathD}" fill="none" stroke="#64748b" stroke-width="2"${dash} marker-end="${marker}"/>`

      const lx = (sx + tx) / 2
      const ly = (sy + ty) / 2
      const labelEl = edge.label
        ? `  <rect x="${lx - edge.label.length * 3.5 - 4}" y="${ly - 9}" width="${edge.label.length * 7 + 8}" height="16" rx="3" fill="white" stroke="#e2e8f0"/>
  <text x="${lx}" y="${ly + 3}" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="10" fill="#475569">${escapeXml(edge.label)}</text>`
        : ''

      return [pathEl, labelEl].filter(Boolean).join('\n')
    })
    .filter(Boolean)
    .join('\n')

  const nodeEls = spec.nodes
    .map((node) => {
      if (node.nodeType === 'text') {
        const nx = node.x - ox
        const ny = node.y - oy
        const nw = node.width ?? 200
        const nh = node.height ?? 60
        const fontSize = node.fontSize ?? 14
        const fontWeight = node.fontWeight ?? 'normal'
        const fontStyle = node.fontStyle ?? 'normal'
        const textColor = node.textColor || '#1e293b'
        const bgFill = node.bgColor || 'none'
        const borderStroke = node.borderColor || 'none'
        const textAlign = node.textAlign ?? 'left'

        const anchor = textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start'
        const textX =
          textAlign === 'center' ? nx + nw / 2 : textAlign === 'right' ? nx + nw - 8 : nx + 8

        const lines = node.text.split('\n')
        const lineH = fontSize * 1.5
        const tspans = lines
          .map((line, idx) => {
            const dy = idx === 0 ? fontSize + 6 : lineH
            return `<tspan x="${textX}" dy="${dy}">${escapeXml(line || ' ')}</tspan>`
          })
          .join('')

        const bgEl =
          bgFill !== 'none' || borderStroke !== 'none'
            ? `  <rect x="${nx}" y="${ny}" width="${nw}" height="${nh}" rx="6" fill="${bgFill}" stroke="${borderStroke}" stroke-width="1.5"/>`
            : ''

        const textEl = `  <text font-family="-apple-system,sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${fontStyle}" fill="${textColor}" text-anchor="${anchor}">${tspans}</text>`

        return [bgEl, textEl].filter(Boolean).join('\n')
      }

      const icon = iconMap.get(node.iconId)
      const nx = node.x - ox
      const ny = node.y - oy
      const nw = node.width ?? NODE_W
      const nh = node.height ?? NODE_H
      const bgFill = node.bgColor === 'transparent' ? 'none' : (node.bgColor || 'white')
      const innerSvg = icon
        ? icon.svgContent
            .replace(/<svg[^>]*xmlns[^>]*>/g, '')
            .replace(/<svg[^>]*>/g, '')
            .replace(/<\/svg>/g, '')
            .trim()
        : `<rect x="10" y="10" width="60" height="60" rx="6" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1.5"/>`

      const labelY = nh - 4
      const iconSize = Math.round(Math.min(nw, nh - 20) * 0.8)
      const iconX = Math.round((nw - iconSize) / 2)

      return `  <g transform="translate(${nx},${ny})">
    <rect width="${nw}" height="${nh}" rx="10" fill="${bgFill}" stroke="${bgFill === 'none' ? 'none' : '#e2e8f0'}" stroke-width="1.5"/>
    <svg x="${iconX}" y="6" viewBox="0 0 80 80" width="${iconSize}" height="${iconSize}">${innerSvg}</svg>
    <text x="${nw / 2}" y="${labelY}" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="10.5" fill="#374151">${escapeXml(node.label)}</text>
  </g>`
    })
    .join('\n')

  const titleEl = title
    ? `  <text x="${W / 2}" y="${PAD - 8}" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="15" font-weight="600" fill="#1e293b">${escapeXml(title)}</text>`
    : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#f8fafc"/>
${titleEl}
${defs}
${edgeEls}
${nodeEls}
</svg>`
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
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
