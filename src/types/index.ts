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
  bgColor?: string
  rotation?: number
  shapeStrokeColor?: string
  shapeStrokeWidth?: number
  [key: string]: unknown
}

export interface TextNodeData {
  text: string
  fontSize: number
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  textColor: string
  bgColor: string
  borderColor: string
  textAlign: 'left' | 'center' | 'right'
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

export type DiagramNodeExport =
  | {
      nodeType?: 'icon'
      id: string
      iconId: string
      label: string
      x: number
      y: number
      width?: number
      height?: number
      bgColor?: string
      rotation?: number
      svgContent?: string
      shapeStrokeColor?: string
      shapeStrokeWidth?: number
      zIndex?: number
    }
  | {
      nodeType: 'text'
      id: string
      x: number
      y: number
      width?: number
      height?: number
      text: string
      fontSize?: number
      fontWeight?: 'normal' | 'bold'
      fontStyle?: 'normal' | 'italic'
      textColor?: string
      bgColor?: string
      borderColor?: string
      textAlign?: 'left' | 'center' | 'right'
      zIndex?: number
    }

/** Portable diagram format — used for save/load, SVG export, and LLM round-trips */
export interface DiagramExport {
  title: string
  nodes: DiagramNodeExport[]
  edges: Array<{
    id: string
    from: string
    to: string
    label?: string
    style: EdgeStyle
  }>
}
