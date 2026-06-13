export interface Icon {
  id: string
  name: string
  category: string
  tags: string[]
  source: 'servier' | 'bioart' | 'custom'
  svgContent: string
}

export interface IconNodeData {
  iconId: string
  svgContent: string
  label: string
  category: string
  [key: string]: unknown
}

export type EdgeStyle = 'arrow' | 'blunt' | 'dashed' | 'bidirectional'

export interface EdgeData {
  label?: string
  edgeStyle?: EdgeStyle
  [key: string]: unknown
}

export interface DiagramSpec {
  title: string
  layout: 'LR' | 'TB'
  nodes: Array<{
    id: string
    iconQuery: string
    label: string
    type: string
  }>
  edges: Array<{
    from: string
    to: string
    label?: string
    style: EdgeStyle
  }>
}

/** Portable diagram format — used for save/load, SVG export, and LLM round-trips */
export interface DiagramExport {
  title: string
  nodes: Array<{
    id: string
    iconId: string
    label: string
    x: number
    y: number
  }>
  edges: Array<{
    id: string
    from: string
    to: string
    label?: string
    style: EdgeStyle
  }>
}
