import type { Edge, Node } from '@xyflow/react'
import { MarkerType } from '@xyflow/react'
import { getAllIcons } from '../data/iconsIndex'
import type {
  DiagramExport,
  DiagramNodeExport,
  EdgeData,
  EdgeStyle,
  IconNodeData,
  TextNodeData,
} from '../types'

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
    if (n.nodeType === 'text') {
      const data: TextNodeData = {
        text: n.text,
        fontSize: n.fontSize ?? 14,
        fontWeight: n.fontWeight ?? 'normal',
        fontStyle: n.fontStyle ?? 'normal',
        textColor: n.textColor ?? '#1e293b',
        bgColor: n.bgColor ?? '',
        borderColor: n.borderColor ?? '',
        textAlign: n.textAlign ?? 'left',
      }
      return {
        id: n.id,
        type: 'textNode',
        position: { x: n.x, y: n.y },
        width: n.width ?? 200,
        height: n.height ?? 60,
        data,
      }
    }
    const icon = iconLookup.get(n.iconId)
    const data: IconNodeData = {
      iconId: n.iconId,
      svgContent: icon?.svgContent ?? n.svgContent ?? fallbackSvg(n.iconId),
      label: n.label,
      category: icon?.category ?? 'Unknown',
      bgColor: n.bgColor ?? '',
      rotation: n.rotation,
      shapeStrokeColor: n.shapeStrokeColor,
      shapeStrokeWidth: n.shapeStrokeWidth,
    }
    return {
      id: n.id,
      type: 'iconNode',
      position: { x: n.x, y: n.y },
      width: n.width ?? 110,
      height: n.height ?? 100,
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
    nodes: nodes.map((n): DiagramNodeExport => {
      if (n.type === 'textNode') {
        const d = n.data as TextNodeData
        return {
          nodeType: 'text',
          id: n.id,
          x: Math.round(n.position.x),
          y: Math.round(n.position.y),
          width: n.width ? Math.round(n.width) : undefined,
          height: n.height ? Math.round(n.height) : undefined,
          text: d.text,
          fontSize: d.fontSize,
          fontWeight: d.fontWeight,
          fontStyle: d.fontStyle,
          textColor: d.textColor,
          bgColor: d.bgColor || undefined,
          borderColor: d.borderColor || undefined,
          textAlign: d.textAlign,
        }
      }
      const d = n.data as IconNodeData
      const isBuiltIn = getAllIcons().some((i) => i.id === d.iconId)
      return {
        id: n.id,
        iconId: d.iconId,
        label: d.label,
        x: Math.round(n.position.x),
        y: Math.round(n.position.y),
        width: n.width ? Math.round(n.width) : undefined,
        height: n.height ? Math.round(n.height) : undefined,
        bgColor: d.bgColor || undefined,
        rotation: d.rotation !== undefined ? d.rotation : undefined,
        svgContent: !isBuiltIn ? d.svgContent : undefined,
        shapeStrokeColor: d.shapeStrokeColor,
        shapeStrokeWidth: d.shapeStrokeWidth,
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

function getCachedServierIcons(): Array<{ id: string; name: string; category: string }> {
  try {
    const raw = localStorage.getItem('sciknitter:servier:v2')
    if (!raw) return []
    const data = JSON.parse(raw) as { icons: Array<{ id: string; name: string; category: string }> }
    if (!Array.isArray(data?.icons)) return []
    return data.icons
  } catch {
    return []
  }
}

export function generateLLMPrompt(description: string): string {
  const allBuiltIn = getAllIcons()
  const shapeIcons = allBuiltIn.filter((i) => i.category === 'Shapes')
  const scientificIcons = allBuiltIn.filter((i) => i.category !== 'Shapes')

  const servierIcons = getCachedServierIcons()

  const servierSection = servierIcons.length > 0
    ? `SERVIER MEDICAL ART ICONS — PRIMARY SOURCE (${servierIcons.length} total; top 600 shown)
${'='.repeat(62)}
${servierIcons
    .slice(0, 600)
    .map((i) => `  • ${i.id}  "${i.name}"  [${i.category}]`)
    .join('\n')}`
    : `⚠️  SERVIER ICONS NOT LOADED
${'='.repeat(62)}
Open the "Servier" tab in the icon browser first, then regenerate this prompt.
Until then, only the built-in icons below are available.`

  const builtInSection = `BUILT-IN SCIENTIFIC ICONS (fallback; prefer Servier above)
${'='.repeat(62)}
${scientificIcons
    .map((i) => `  • ${i.id}  "${i.name}"  [${i.tags.slice(0, 4).join(', ')}]`)
    .join('\n')}

SHAPES (use as containers, backgrounds, or layout elements)
${'='.repeat(62)}
${shapeIcons
    .map((i) => `  • ${i.id}  "${i.name}"`)
    .join('\n')}`

  return `You are a scientific diagram layout assistant for SciKnitter.

${servierSection}

${builtInSection}

TASK
====
Create a diagram layout for:
"${description}"

RULES
=====
- ALWAYS prefer Servier Medical Art icons for biological and scientific elements
- Only use iconId values that exactly match ids from the lists above
- Position nodes at x: 50–900, y: 50–700
- Space nodes at least 150 px apart — do NOT overlap nodes
- For pathways, lay out left-to-right or top-to-bottom
- Use shape icons (shape-rect, shape-circle, etc.) as background containers or grouping boxes, not as scientific elements
- Edge styles:
    "arrow"  = activation / positive regulation / flow
    "blunt"  = inhibition / negative regulation
    "dashed" = indirect relationship / unknown mechanism
- You may also add text box annotations with nodeType "text"

OUTPUT
======
Return ONLY valid JSON — no markdown code fences, no explanation, no extra text.

{
  "title": "string",
  "nodes": [
    { "id": "n1", "iconId": "exact-id-from-list", "label": "Display Name", "x": 100, "y": 100 },
    { "nodeType": "text", "id": "t1", "text": "Annotation text", "x": 300, "y": 50, "width": 200, "height": 40 }
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
    nodes: (obj.nodes as unknown[]).map((n, i): DiagramNodeExport => {
      if (typeof n !== 'object' || n === null) throw new Error(`Node ${i} is not an object`)
      const node = n as Record<string, unknown>

      if (node.nodeType === 'text') {
        return {
          nodeType: 'text',
          id: String(node.id ?? `t${i}`),
          x: Number(node.x ?? 0),
          y: Number(node.y ?? 0),
          width: node.width ? Number(node.width) : undefined,
          height: node.height ? Number(node.height) : undefined,
          text: String(node.text ?? ''),
          fontSize: node.fontSize ? Number(node.fontSize) : undefined,
          fontWeight: node.fontWeight === 'bold' ? 'bold' : 'normal',
          fontStyle: node.fontStyle === 'italic' ? 'italic' : 'normal',
          textColor: typeof node.textColor === 'string' ? node.textColor : undefined,
          bgColor: typeof node.bgColor === 'string' ? node.bgColor : undefined,
          borderColor: typeof node.borderColor === 'string' ? node.borderColor : undefined,
          textAlign: (['left', 'center', 'right'] as const).includes(
            node.textAlign as 'left' | 'center' | 'right',
          )
            ? (node.textAlign as 'left' | 'center' | 'right')
            : 'left',
        }
      }

      return {
        id: String(node.id ?? `n${i}`),
        iconId: String(node.iconId ?? ''),
        label: String(node.label ?? ''),
        x: Number(node.x ?? 0),
        y: Number(node.y ?? 0),
        width: node.width ? Number(node.width) : undefined,
        height: node.height ? Number(node.height) : undefined,
        bgColor: typeof node.bgColor === 'string' ? node.bgColor : undefined,
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
