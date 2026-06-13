import type { Edge, Node } from '@xyflow/react'
import { MarkerType } from '@xyflow/react'
import { getAllIcons } from '../data/iconsIndex'
import type { DiagramExport, EdgeData, EdgeStyle, IconNodeData } from '../types'

const iconLookup = new Map(getAllIcons().map((i) => [i.id, i]))

function fallbackSvg(iconId: string): string {
  const parts = iconId.split('-')
  const label = parts[parts.length - 1] ?? '?'
  return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="60" height="60" rx="8" fill="#f3f4f6" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="40" y="44" text-anchor="middle" font-size="9" fill="#6b7280" font-family="sans-serif">${label}</text>
  </svg>`
}

export function specToRFNodes(spec: DiagramExport): Node[] {
  return spec.nodes.map((n) => {
    const icon = iconLookup.get(n.iconId)
    const data: IconNodeData = {
      iconId: n.iconId,
      svgContent: icon?.svgContent ?? fallbackSvg(n.iconId),
      label: n.label,
      category: icon?.category ?? 'Unknown',
    }
    return {
      id: n.id,
      type: 'iconNode',
      position: { x: n.x, y: n.y },
      data,
    }
  })
}

export function specToRFEdges(spec: DiagramExport): Edge[] {
  return spec.edges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
    type: 'custom',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 14,
      height: 14,
      color: '#64748b',
    },
    data: { label: e.label ?? '', edgeStyle: e.style } satisfies EdgeData,
  }))
}

export function rfToSpec(nodes: Node[], edges: Edge[], title: string): DiagramExport {
  return {
    title,
    nodes: nodes.map((n) => {
      const d = n.data as IconNodeData
      return {
        id: n.id,
        iconId: d.iconId,
        label: d.label,
        x: Math.round(n.position.x),
        y: Math.round(n.position.y),
      }
    }),
    edges: edges.map((e) => {
      const d = (e.data ?? {}) as EdgeData
      return {
        id: e.id,
        from: e.source,
        to: e.target,
        label: d.label || undefined,
        style: d.edgeStyle ?? 'arrow',
      }
    }),
  }
}

export function generateLLMPrompt(description: string): string {
  const icons = getAllIcons()
  const lines = icons
    .map((i) => `  • ${i.id}  "${i.name}"  [${i.tags.slice(0, 5).join(', ')}]`)
    .join('\n')

  return `You are a scientific diagram layout assistant for SciKnitter.

AVAILABLE ICONS
===============
${lines}

TASK
====
Create a diagram layout for:
"${description}"

RULES
=====
- Only use iconId values that exactly match ids from the list above
- Position nodes at x: 50–900, y: 50–700
- Space nodes at least 150 px apart
- For pathways, lay out left-to-right or top-to-bottom
- Edge styles:
    "arrow"  = activation / positive regulation / flow
    "blunt"  = inhibition / negative regulation
    "dashed" = indirect relationship / unknown mechanism

OUTPUT
======
Return ONLY valid JSON — no markdown code fences, no explanation, no extra text.

{
  "title": "string",
  "nodes": [
    { "id": "n1", "iconId": "exact-id-from-list", "label": "Display Name", "x": 100, "y": 100 }
  ],
  "edges": [
    { "id": "e1", "from": "n1", "to": "n2", "label": "optional label", "style": "arrow" }
  ]
}`
}

const VALID_STYLES: EdgeStyle[] = ['arrow', 'blunt', 'dashed', 'bidirectional']

export function parseDiagramSpec(raw: string): DiagramExport {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim()

  const parsed: unknown = JSON.parse(cleaned)
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Response is not a JSON object')
  }
  const obj = parsed as Record<string, unknown>
  if (!Array.isArray(obj.nodes)) throw new Error('Missing "nodes" array')
  if (!Array.isArray(obj.edges)) throw new Error('Missing "edges" array')

  return {
    title: typeof obj.title === 'string' ? obj.title : 'Untitled',
    nodes: (obj.nodes as unknown[]).map((n, i) => {
      if (typeof n !== 'object' || n === null) throw new Error(`Node ${i} is not an object`)
      const node = n as Record<string, unknown>
      return {
        id: String(node.id ?? `n${i}`),
        iconId: String(node.iconId ?? ''),
        label: String(node.label ?? ''),
        x: Number(node.x ?? 0),
        y: Number(node.y ?? 0),
      }
    }),
    edges: (obj.edges as unknown[]).map((e, i) => {
      if (typeof e !== 'object' || e === null) throw new Error(`Edge ${i} is not an object`)
      const edge = e as Record<string, unknown>
      const style = String(edge.style ?? 'arrow') as EdgeStyle
      return {
        id: String(edge.id ?? `e${i}`),
        from: String(edge.from ?? ''),
        to: String(edge.to ?? ''),
        label: typeof edge.label === 'string' && edge.label ? edge.label : undefined,
        style: VALID_STYLES.includes(style) ? style : 'arrow',
      }
    }),
  }
}
