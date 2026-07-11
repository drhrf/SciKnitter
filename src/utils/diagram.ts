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

function fallbackSvg(): string {
  return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="60" height="60" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="26" y1="40" x2="54" y2="40" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    <line x1="40" y1="26" x2="40" y2="54" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
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
        rotation: n.rotation,
        fontFamily: n.fontFamily,
        opacity: n.opacity,
        cornerRadius: n.cornerRadius,
        gradientTo: n.gradientTo,
      }
      // An explicit zIndex always wins; only default to "bgColor implies a
      // background panel" (behind edges) when zIndex is omitted — otherwise a
      // colored callout box would be silently demoted to an immovable panel
      // just for having a fill color. The same effective zIndex decides the
      // node TYPE too: a background panel becomes a dedicated 'panelNode'
      // (see PanelNode.tsx) so PropertiesPanel and resolveLayoutOverlaps can
      // treat it as a panel by type rather than re-inferring it from zIndex.
      // The on-disk/LLM-facing JSON shape is unchanged either way.
      const zIndex = typeof n.zIndex === 'number' ? n.zIndex : (n.bgColor ? -1 : 2)
      return {
        id: n.id,
        type: zIndex < 0 ? 'panelNode' : 'textNode',
        position: { x: n.x, y: n.y },
        width: n.width ?? 200,
        height: n.height ?? 60,
        zIndex,
        data,
      }
    }
    const icon = iconLookup.get(n.iconId)
    const data: IconNodeData = {
      iconId: n.iconId,
      svgContent: icon?.svgContent ?? n.svgContent ?? fallbackSvg(),
      label: n.label,
      category: icon?.category ?? 'Unknown',
      bgColor: n.bgColor ?? 'transparent',
      rotation: n.rotation,
      shapeStrokeColor: n.shapeStrokeColor,
      shapeStrokeWidth: n.shapeStrokeWidth,
      opacity: n.opacity,
      cornerRadius: n.cornerRadius,
      gradientTo: n.gradientTo,
    }
    return {
      id: n.id,
      type: 'iconNode',
      position: { x: n.x, y: n.y },
      width: n.width ?? 110,
      height: n.height ?? 100,
      zIndex: n.zIndex ?? 2,
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
    data: { label: e.label ?? '', edgeStyle: e.style, strokeColor: e.strokeColor, strokeWidth: e.strokeWidth } satisfies EdgeData,
  }))
}

export function rfToSpec(nodes: Node[], edges: Edge[], title: string): DiagramExport {
  return {
    title,
    nodes: nodes.map((n): DiagramNodeExport => {
      if (n.type === 'textNode' || n.type === 'panelNode') {
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
          rotation: d.rotation !== undefined ? d.rotation : undefined,
          zIndex: n.zIndex !== undefined ? n.zIndex : undefined,
          fontFamily: d.fontFamily,
          opacity: d.opacity,
          cornerRadius: d.cornerRadius,
          gradientTo: d.gradientTo,
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
        opacity: d.opacity,
        cornerRadius: d.cornerRadius,
        gradientTo: d.gradientTo,
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
        strokeColor: (d.strokeColor as string | undefined) || undefined,
        strokeWidth: (d.strokeWidth as number | undefined) || undefined,
      }
    }),
  }
}

function getCachedBioartIcons(): Array<{ id: string; name: string }> {
  try {
    const raw = localStorage.getItem('sciknitter:bioart:v2')
    if (!raw) return []
    const data = JSON.parse(raw) as { icons: Array<{ id: string; name: string }> }
    if (!Array.isArray(data?.icons)) return []
    // Deduplicate by BIOART number — one entry per unique concept
    const seen = new Set<string>()
    return data.icons.filter((i) => {
      const m = i.id.match(/bioart:BIOART-(\d+)/)
      if (!m) return true
      if (seen.has(m[1])) return false
      seen.add(m[1])
      return true
    })
  } catch {
    return []
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

function buildIconListingSection(): string {
  const allBuiltIn = getAllIcons()
  const shapeIcons = allBuiltIn.filter((i) => i.category === 'Shapes')
  const scientificIcons = allBuiltIn.filter((i) => i.category !== 'Shapes')

  const bioartIcons = getCachedBioartIcons()
  const servierIcons = getCachedServierIcons()

  const bioartSection = bioartIcons.length > 0
    ? `NIH BIOART ICONS — PRIMARY SOURCE (${bioartIcons.length} unique concepts)
${'='.repeat(62)}
${bioartIcons
    .slice(0, 700)
    .map((i) => `  • ${i.id}  "${i.name}"`)
    .join('\n')}`
    : `⚠️  NIH BIOART ICONS NOT LOADED
${'='.repeat(62)}
Open the "NIH Bioart" tab in the icon browser first, then regenerate this prompt.`

  const servierSection = servierIcons.length > 0
    ? `SERVIER MEDICAL ART ICONS — SECONDARY SOURCE (use if BioArt has no match)
${'='.repeat(62)}
${servierIcons
    .slice(0, 400)
    .map((i) => `  • ${i.id}  "${i.name}"  [${i.category}]`)
    .join('\n')}`
    : ''

  const builtInSection = `BUILT-IN SCIENTIFIC ICONS (last fallback)
${'='.repeat(62)}
${scientificIcons
    .map((i) => `  • ${i.id}  "${i.name}"  [${i.tags.slice(0, 4).join(', ')}]`)
    .join('\n')}

SHAPES (use as containers, backgrounds, or layout elements)
${'='.repeat(62)}
${shapeIcons
    .map((i) => `  • ${i.id}  "${i.name}"`)
    .join('\n')}`

  return `${bioartSection}

${servierSection ? servierSection + '\n' : ''}
${builtInSection}`
}

export type FigureType = 'pathway' | 'timeline' | 'protocol' | 'graphical-abstract'

// The grid/panel/callout/JSON mechanics are identical across figure types —
// only the PLANNING steps (how to decide where things go) differ enough to
// be worth a dedicated section per type. Keeping one shared grid instead of
// a different coordinate system per type means the rest of the prompt
// (PANEL BACKGROUNDS, callouts, output schema) never has to branch.
function buildLayoutStrategySection(figureType: FigureType): string {
  if (figureType === 'timeline') {
    return `LAYOUT STRATEGY — TIMELINE
==========================
1. Identify the chronological events or milestones (typically 3–6).
2. Place them along a SINGLE ROW, left to right in time order — row 2
   (ROW_Y[2]=350) is a good default. Event 1 at col 0, event 2 at col 1, etc.
   — one event per column, using the same COL_X/ROW_Y lookup as any icon.
3. BEFORE writing any JSON, write a short plain-text planning table (NOT in
   a code fence): id | event name | col,row — e.g. n1 | Baseline | 0,2
4. Connect consecutive events with "arrow" edges, and label each edge with
   the date/timepoint/duration of that transition (e.g. "Day 7", "Week 2",
   "2 hr post-treatment") — the edge labels ARE the timeline's time axis.
5. If the sequence is cyclical (returns to the start), add one final
   "dashed" edge from the last event back to the first, labeled "repeats".
6. Use annotations sparingly — at most one per event, placed ABOVE it (see
   TEXT ANNOTATION PLACEMENT), only for a detail that won't fit in the label.`
  }

  if (figureType === 'protocol') {
    return `LAYOUT STRATEGY — PROTOCOL / FLOWCHART
=======================================
1. Break the procedure into 3–7 sequential steps.
2. Place steps in a SINGLE COLUMN, top to bottom — col 2 (COL_X[2]=430) is a
   good default. Step 1 at row 0, step 2 at row 1, etc. Number each label
   ("1. Seed cells", "2. Incubate 37°C", "3. Passage", ...).
3. BEFORE writing any JSON, write a short plain-text planning table (NOT in
   a code fence): id | step | col,row — e.g. n1 | 1. Seed cells | 2,0
4. For a DECISION point, use iconId "shape-diamond" and branch it into TWO
   "arrow"/"blunt" edges going to two different cells (e.g. one column to
   the left, one to the right, both one row down) — label each branch edge
   with the condition ("yes"/"no", or the specific outcome).
5. Connect steps in order with "arrow" edges. Use "shape-x-mark" for a step
   that represents failure/rejection/a blocked outcome.
6. Keep annotations minimal — the step labels should carry most of the
   information; only add a text box for something that won't fit in a label.`
  }

  if (figureType === 'graphical-abstract') {
    return `LAYOUT STRATEGY — GRAPHICAL ABSTRACT
=====================================
1. Identify 2–4 major sections of the story (e.g. "Trigger", "Mechanism",
   "Outcome") — each becomes one panel.
2. Give each panel a 1–2 column grid span (see PANEL BACKGROUNDS below),
   placed side by side along row 0 if you have 2–3 panels, or in a 2×2
   arrangement across two rows if you have 4.
3. BEFORE writing any JSON, write a short plain-text planning table (NOT in
   a code fence): id | panel | col,row (icons) or colStart,rowStart-colEnd,rowEnd (panels).
4. Place 2–3 icons inside each panel's own cells (see GRID SYSTEM).
5. Connect the LAST icon of one panel to the FIRST icon of the next panel
   with an "arrow" edge, so the panels visibly flow into each other.
6. Add exactly ONE bold colored callout box summarizing the key finding or
   take-home message, spanning the full width below (or beside) the panels
   — see COLORED CALLOUT / HIGHLIGHT BOXES below. This callout is the single
   most important line of the whole figure — make it concise and specific
   (e.g. "↑ Inflammation drives tissue damage", not "Summary").`
  }

  return `LAYOUT STRATEGY — follow these steps in order
=============================================
1. PLAN sections: identify 2–5 logical groups in the diagram.
2. BEFORE writing any JSON, write a short plain-text planning table — one line
   per node, NOT inside a code fence:
     id | group | col,row  (icons)          e.g.  n1 | Signaling | 0,0
     id | group | colStart,rowStart-colEnd,rowEnd (panels)  e.g.  panel1 | Signaling | 0,0-1,1
   Check your own table before moving on:
     - No two icons share the same (col,row).
     - Every panel's grid span fully contains all of its member icons' cells.
     - No annotation box (see below) overlaps an icon box.
3. PLACE icons: for each icon, look up (COL_X[col], ROW_Y[row]) directly.
4. ADD panels: use the grid-span formula in PANEL BACKGROUNDS below.
5. ADD annotation text boxes ABOVE or BESIDE icons — never on top of them
   (see TEXT ANNOTATION PLACEMENT below).
6. ADD edges last, choosing from arrow/blunt/dashed/bidirectional.`
}

export function generateLLMPrompt(description: string, figureType: FigureType = 'pathway'): string {
  return `You are a scientific diagram layout assistant for SciKnitter.

${buildIconListingSection()}

TASK
====
Create a ${figureType === 'pathway' ? 'diagram' : figureType} layout for:
"${description}"

GRID SYSTEM — use this instead of freehand coordinates
=======================================================
The canvas is a fixed 7×6 grid. Every icon occupies exactly one cell.
LOOK UP pixel coordinates in these tables — do not compute offsets by hand:

  COL_X (col → x):  0→50   1→240   2→430   3→620   4→810   5→1000   6→1190
  ROW_Y (row → y):  0→50   1→200   2→350   3→500   4→650   5→800

- Icon top-left = (COL_X[col], ROW_Y[row]). Icons are always 110×100.
- Each cell has enough built-in gutter (80 px horizontal, 50 px vertical) that
  icons in two different cells never overlap. You do NOT need to check pixel
  spacing yourself — you only need to make sure no two icons share a cell.
- Text/panel nodes: always set explicit "width" and "height".
  Annotation text boxes: width 160–280, height 50–100 (placement formula below).
  Panel backgrounds: computed from a grid span — see PANEL BACKGROUNDS below.

${buildLayoutStrategySection(figureType)}

PANEL BACKGROUNDS
=================
Use text nodes as coloured panel backgrounds to group related icons. Compute
the panel's box from its grid span (colStart,rowStart)-(colEnd,rowEnd):

  x      = COL_X[colStart] - 40
  y      = ROW_Y[rowStart] - 40
  width  = (COL_X[colEnd] - COL_X[colStart]) + 110 + 80
  height = (ROW_Y[rowEnd] - ROW_Y[rowStart]) + 100 + 80

  {
    "nodeType": "text", "id": "panel1", "text": "Panel Title",
    "x": 10, "y": 10, "width": 380, "height": 180,
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

COLORED CALLOUT / HIGHLIGHT BOXES — NOT THE SAME AS A PANEL
=============================================================
A small colored box that highlights a finding (e.g. a pink box reading
"↑ Obesity (OR 2.13)") is NOT a panel, even though it also uses bgColor.
A text node with bgColor and NO explicit zIndex is assumed to be a full
section panel — it will be pinned to the back of the diagram, rendered
BEHIND every icon and arrow. For any colored box that is NOT a full section
panel, you MUST explicitly set "zIndex": 2 so it stays in front:
  {
    "nodeType": "text", "id": "callout1", "text": "↑ Obesity (OR 2.13)",
    "x": 610, "y": 260, "width": 220, "height": 80,
    "bgColor": "#fecaca", "zIndex": 2
  }
Rule of thumb: bgColor + "zIndex": -1 → background panel (behind everything).
              bgColor + "zIndex": 2  → foreground highlight box (in front).

ICON RULES
==========
- ALWAYS prefer NIH BioArt icons (primary source) for biological and scientific elements
- Use Servier icons only when BioArt has no suitable match
- Only use iconId values that exactly match ids listed above — no guessing
- Set zIndex: 0 (or omit) for regular icons; zIndex: 1 for key/highlighted icons
- FALLBACK — if NONE of the icons above is a reasonable conceptual match for a
  node, do NOT invent or guess an iconId. Instead emit that node as a labeled
  text box placed at its intended grid cell:
    {
      "nodeType": "text", "id": "n5", "text": "Concept label",
      "x": <COL_X[col]>, "y": <ROW_Y[row]>, "width": 130, "height": 70,
      "borderColor": "#cbd5e1", "textAlign": "center", "fontWeight": "bold"
    }
  Do NOT set "bgColor" on these placeholder boxes — bgColor turns a text node
  into a background panel (rendered behind everything), which is not what a
  concept placeholder should look like.

TEXT ANNOTATION PLACEMENT — CRITICAL
=====================================
An icon at (ix, iy) occupies the box (ix, iy) → (ix+110, iy+100).
A text box at (tx, ty) with width W and height H occupies (tx, ty) → (tx+W, ty+H).
These boxes MUST NOT INTERSECT. Use these safe offsets:

  Right of icon:  tx = ix + 120,             ty = iy + 20        (width 180–240, height 50–80)
  Left of icon:   tx = ix - annotW - 20,     ty = iy + 20        (width 180–240, height 50–80)
  Above icon:     tx = ix - (annotW-110)/2,  ty = iy - annotH - 20  (width 160–220, height 40–70)
  Below icon:     tx = ix - (annotW-110)/2,  ty = iy + 120       (width 160–220, height 40–70)

Pick the direction with the most empty space. Never place a text box on top of an icon.

EDGE STYLES
===========
  "arrow"         = activation / flow / positive regulation
  "blunt"         = inhibition / negative regulation
  "dashed"        = indirect / unknown mechanism
  "bidirectional" = mutual interaction

OUTPUT
======
First write your planning table from step 2 above as plain text (no code fence).
Then, on its own, output ONLY the final JSON inside a single \`\`\`json code
fence — nothing after the closing fence.

Example planning table:
  n1 | Signaling | 0,0
  n2 | Signaling | 1,0
  panel1 | Signaling | 0,0-1,0
  ann1 | Signaling | (annotation, right of n2)

\`\`\`json
{
  "title": "string",
  "nodes": [
    { "nodeType": "text", "id": "panel1", "text": "Section A", "x": 10, "y": 10, "width": 380, "height": 180, "bgColor": "#eff6ff", "borderColor": "#bfdbfe", "fontSize": 12, "fontWeight": "bold", "zIndex": -1 },
    { "id": "n1", "iconId": "exact-id-from-list", "label": "Protein X", "x": 50, "y": 50 },
    { "id": "n2", "iconId": "exact-id-from-list", "label": "Protein Y", "x": 240, "y": 50 },
    { "nodeType": "text", "id": "ann1", "text": "Short annotation", "x": 360, "y": 70, "width": 200, "height": 60 }
  ],
  "edges": [
    { "id": "e1", "from": "n1", "to": "n2", "style": "arrow" }
  ]
}
\`\`\``
}

const VALID_STYLES: EdgeStyle[] = ['arrow', 'blunt', 'dashed', 'bidirectional']

// Isolates the JSON payload an LLM returned, tolerating deviations from the
// "return ONLY JSON" instruction: a fenced code block (any language tag) with
// prose before/after it, or prose with no fence at all. Braces inside string
// literals are tracked so they don't throw off the outermost-object match.
// Some editors/notes apps auto-convert straight quotes to "smart" typographic
// quotes as you type or paste, which silently corrupts JSON (curly quotes
// aren't valid string delimiters). Normalize them back before anything else —
// this must run before fence/brace extraction, since that logic tracks
// strings by looking for literal '"' characters.
function normalizeSmartQuotes(s: string): string {
  return s
    .replace(/[“”‟″]/g, '"')
    .replace(/[‘’‛′]/g, "'")
}

function extractJsonPayload(raw: string): string {
  let s = normalizeSmartQuotes(raw.trim())

  const fenced = s.match(/```[^\n]*\n?([\s\S]*?)```/)
  if (fenced) s = fenced[1].trim()

  const start = s.indexOf('{')
  if (start === -1) return s

  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < s.length; i++) {
    const c = s[i]
    if (inString) {
      if (escaped) escaped = false
      else if (c === '\\') escaped = true
      else if (c === '"') inString = false
      continue
    }
    if (c === '"') inString = true
    else if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return s.slice(start, i + 1)
    }
  }
  return s.slice(start)
}

// Best-effort repair for near-JSON some LLMs produce despite instructions:
// trailing commas, unquoted object keys, and Python-style single-quoted strings.
function repairJsonLenient(s: string): string {
  let out = s.replace(/,(\s*[}\]])/g, '$1')
  out = out.replace(/([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)(\s*:)/g, '$1"$2"$3')
  out = out.replace(
    /([:,[{]\s*)'((?:[^'\\]|\\.)*)'(?=\s*[,:}\]])/g,
    (_, pre: string, inner: string) => `${pre}"${inner.replace(/"/g, '\\"')}"`,
  )
  return out
}

export function parseDiagramSpec(raw: string): DiagramExport {
  const payload = extractJsonPayload(raw)

  let parsed: unknown
  try {
    parsed = JSON.parse(payload)
  } catch (firstErr) {
    try {
      parsed = JSON.parse(repairJsonLenient(payload))
    } catch {
      const msg = firstErr instanceof Error ? firstErr.message : String(firstErr)
      throw new Error(
        `Couldn't parse that as JSON (${msg}). Make sure you pasted only the JSON the LLM returned, with nothing else before or after it.`,
      )
    }
  }
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
          rotation: typeof node.rotation === 'number' ? node.rotation : undefined,
          // An explicit zIndex always wins. Only fall back to "bgColor implies
          // a background panel" when zIndex is omitted entirely — a colored
          // callout/highlight box (bgColor set, zIndex explicitly >= 0) must
          // NOT be silently demoted to a background panel just for having a fill.
          zIndex: typeof node.zIndex === 'number' ? node.zIndex : (node.bgColor ? -1 : 2),
          fontFamily: typeof node.fontFamily === 'string' ? node.fontFamily : undefined,
          opacity: typeof node.opacity === 'number' ? node.opacity : undefined,
          cornerRadius: typeof node.cornerRadius === 'number' ? node.cornerRadius : undefined,
          gradientTo: typeof node.gradientTo === 'string' ? node.gradientTo : undefined,
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
        rotation: typeof node.rotation === 'number' ? node.rotation : undefined,
        svgContent: typeof node.svgContent === 'string' ? node.svgContent : undefined,
        shapeStrokeColor: typeof node.shapeStrokeColor === 'string' ? node.shapeStrokeColor : undefined,
        shapeStrokeWidth: typeof node.shapeStrokeWidth === 'number' ? node.shapeStrokeWidth : undefined,
        zIndex: typeof node.zIndex === 'number' ? node.zIndex : undefined,
        opacity: typeof node.opacity === 'number' ? node.opacity : undefined,
        cornerRadius: typeof node.cornerRadius === 'number' ? node.cornerRadius : undefined,
        gradientTo: typeof node.gradientTo === 'string' ? node.gradientTo : undefined,
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
        strokeColor: typeof edge.strokeColor === 'string' ? edge.strokeColor : undefined,
        strokeWidth: typeof edge.strokeWidth === 'number' ? edge.strokeWidth : undefined,
      }
    }),
  }
}
