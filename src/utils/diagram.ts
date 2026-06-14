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
        zIndex: n.zIndex,
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
      zIndex: n.zIndex,
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
          zIndex: n.zIndex !== undefined ? n.zIndex : undefined,
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
        zIndex: n.zIndex !== undefined ? n.zIndex : undefined,
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

CANVAS & NODE SIZES
===================
- Canvas: x: 50–1400, y: 50–1000
- Icon nodes are exactly 110 px wide × 100 px tall. The (x, y) is the TOP-LEFT corner.
  → To avoid overlap, icon centers must be ≥ 170 px apart in both x and y.
  → Icon center = (x + 55, y + 50)
- Text/panel nodes: always set explicit "width" and "height".
  Annotation text boxes: width 160–280, height 50–100.
  Panel backgrounds: width and height large enough to surround all member icons
  with ≥ 40 px padding on every side.

LAYOUT STRATEGY — follow these steps in order
=============================================
1. PLAN sections: identify 2–5 logical groups in the diagram.
2. ASSIGN each group a screen region (e.g. top-left 400×300 block, center column, etc.).
   Spread groups across the full canvas — use x up to 1300 and y up to 900.
3. PLACE icons inside each region. Start from the top-left of the region and step
   right/down in increments of 180 px so icons never overlap.
4. ADD panels: for each section, output a text node with bgColor, borderColor, and
   zIndex: -1 that encloses all member icons.
5. ADD annotation text boxes ABOVE or BESIDE icons — never on top of them.
6. ADD edges last, choosing from arrow/blunt/dashed/bidirectional.

PANEL BACKGROUNDS
=================
Use text nodes as coloured panel backgrounds to group related icons:
  {
    "nodeType": "text", "id": "panel1", "text": "Panel Title",
    "x": 60, "y": 60, "width": 400, "height": 260,
    "bgColor": "#eff6ff", "borderColor": "#bfdbfe",
    "fontSize": 12, "fontWeight": "bold", "textAlign": "left",
    "zIndex": -1
  }
Suggested panel colours (mix and match):
  Blue:   bgColor "#eff6ff"  borderColor "#bfdbfe"
  Green:  bgColor "#f0fdf4"  borderColor "#bbf7d0"
  Yellow: bgColor "#fefce8"  borderColor "#fde68a"
  Purple: bgColor "#faf5ff"  borderColor "#e9d5ff"
  Gray:   bgColor "#f8fafc"  borderColor "#e2e8f0"

ICON RULES
==========
- ALWAYS prefer Servier Medical Art icons for biological and scientific elements
- Only use iconId values that exactly match ids listed above — no guessing
- Set zIndex: 0 (or omit) for regular icons; zIndex: 1 for key/highlighted icons

EDGE STYLES
===========
  "arrow"         = activation / flow / positive regulation
  "blunt"         = inhibition / negative regulation
  "dashed"        = indirect / unknown mechanism
  "bidirectional" = mutual interaction

OUTPUT
======
Return ONLY valid JSON — no markdown fences, no explanation, nothing else.

{
  "title": "string",
  "nodes": [
    { "nodeType": "text", "id": "panel1", "text": "Section A", "x": 50, "y": 50, "width": 420, "height": 240, "bgColor": "#eff6ff", "borderColor": "#bfdbfe", "fontSize": 12, "fontWeight": "bold", "zIndex": -1 },
    { "id": "n1", "iconId": "exact-id-from-list", "label": "Protein X", "x": 100, "y": 120 },
    { "id": "n2", "iconId": "exact-id-from-list", "label": "Protein Y", "x": 280, "y": 120 },
    { "nodeType": "text", "id": "ann1", "text": "Short annotation", "x": 520, "y": 130, "width": 200, "height": 60 }
  ],
  "edges": [
    { "id": "e1", "from": "n1", "to": "n2", "style": "arrow" }
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
          zIndex: typeof node.zIndex === 'number' ? node.zIndex : undefined,
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
        zIndex: typeof node.zIndex === 'number' ? node.zIndex : undefined,
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
