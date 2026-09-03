import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  SelectionMode,
  ConnectionMode,
  ViewportPortal,
  addEdge,
  reconnectEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  getViewportForBounds,
  BackgroundVariant,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  type OnNodeDrag,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { IconNode } from './IconNode'
import { TextNode } from './TextNode'
import { PanelNode } from './PanelNode'
import { CustomEdge } from './CustomEdge'
import { rfToSpec, specToRFEdges, specToRFNodes } from '../utils/diagram'
import { fetchServierSvgById } from '../services/servierIcons'
import { fetchBioiconsSvgById } from '../services/bioiconsIcons'
import { sanitizeSvg } from '../services/bioartIcons'
import { resolveLayoutOverlaps } from '../utils/resolveTextOverlaps'
import { captureElement, captureBlob, copyBlobToClipboard, triggerDownload } from '../utils/exportImage'
import { computeGuides } from '../utils/alignmentGuides'
import type { DiagramExport, Icon, IconNodeData, TextNodeData } from '../types'

const EXPORT_PADDING = 60
const AUTOSAVE_KEY = 'sciknitter:autosave:v1'
const AUTOSAVE_DEBOUNCE_MS = 800

export interface DiagramCanvasHandle {
  getSpec: (title: string) => DiagramExport
  loadSpec: (spec: DiagramExport) => void
  clearAll: () => void
  autoLayout: () => void
  undo: () => void
  redo: () => void
  copySelected: () => void
  paste: () => void
  duplicateSelected: () => void
  exportImage: (format: 'png' | 'svg', filename: string, opts: { bgColor: string; scale: number }) => Promise<void>
  copyImageToClipboard: (bgColor: string) => Promise<boolean>
  restoreAutosave: () => DiagramExport | null
}

interface DiagramCanvasProps {
  snapToGrid: boolean
  /** When true: left-drag draws a selection box; pan uses middle/right mouse */
  isSelecting: boolean
  title: string
}

const defaultEdgeOptions = {
  type: 'custom',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 14,
    height: 14,
    color: '#64748b',
  },
  data: { edgeStyle: 'arrow' as const },
}

// CC-BY-family icons (Servier, some Bioicons entries) require attribution;
// CC0/MIT/BSD/public-domain sources don't carry an `attribution` value at
// all, so this only ever credits what's actually required. Dedupes by
// author+license since a diagram can use several icons from the same source.
function buildAttributionText(nodes: Node[]): string | null {
  const credits = new Map<string, string>()
  for (const n of nodes) {
    const attribution = (n.data as IconNodeData)?.attribution
    if (attribution) credits.set(`${attribution.author}|${attribution.license}`, `${attribution.author} (${attribution.license})`)
  }
  return credits.size > 0 ? `Icons: ${[...credits.values()].join(' · ')}` : null
}

function createRFNode(icon: Icon, position: { x: number; y: number }): Node {
  const data: IconNodeData = {
    iconId: icon.id,
    svgContent: icon.svgContent,
    label: icon.name,
    category: icon.category,
    bgColor: 'transparent',
    attribution: icon.attribution,
  }
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'iconNode',
    position,
    width: 110,
    height: 100,
    zIndex: 2,
    data,
  }
}

export const DiagramCanvas = forwardRef<DiagramCanvasHandle, DiagramCanvasProps>(
  function DiagramCanvas({ snapToGrid, isSelecting, title }, ref) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { screenToFlowPosition, getNodesBounds } = useReactFlow()
    const wrapperRef = useRef<HTMLDivElement>(null)

    const nodeTypes: NodeTypes = useMemo(() => ({ iconNode: IconNode, textNode: TextNode, panelNode: PanelNode }), [])
    const edgeTypes: EdgeTypes = useMemo(() => ({ custom: CustomEdge }), [])

    // Stable ref to the latest title for the autosave effect below
    const titleRef = useRef(title)
    titleRef.current = title

    // History state (refs so they don't cause re-renders)
    const historyRef = useRef<Array<{ nodes: Node[]; edges: Edge[] }>>([])
    const historyIdxRef = useRef(-1)
    const isRestoringRef = useRef(false)

    // Clipboard ref for copy/paste
    const clipboardRef = useRef<Node[]>([])

    // Stable refs to latest state for the debounced snapshot
    const nodesSnapRef = useRef(nodes)
    nodesSnapRef.current = nodes
    const edgesSnapRef = useRef(edges)
    edgesSnapRef.current = edges

    // Debounced push to history — fires 400ms after last change
    useEffect(() => {
      if (isRestoringRef.current) return
      const timer = setTimeout(() => {
        if (isRestoringRef.current) return
        const snap = { nodes: nodesSnapRef.current, edges: edgesSnapRef.current }
        // Truncate redo branch
        historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1)
        historyRef.current.push(snap)
        if (historyRef.current.length > 60) historyRef.current.shift()
        else historyIdxRef.current++
      }, 400)
      return () => clearTimeout(timer)
    }, [nodes, edges])

    // Debounced autosave to localStorage — survives a refresh/closed tab.
    // Separate timer/interval from the undo-history debounce above: that one
    // exists to capture discrete undo steps, this one exists to persist, and
    // a synchronous localStorage.setItem on every 400ms tick (e.g. mid-drag)
    // would be wasteful.
    useEffect(() => {
      if (isRestoringRef.current) return
      const timer = setTimeout(() => {
        if (nodes.length === 0 && edges.length === 0) return
        try {
          const spec = rfToSpec(nodes, edges, titleRef.current)
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(spec))
        } catch { /* storage full/unavailable — autosave is best-effort */ }
      }, AUTOSAVE_DEBOUNCE_MS)
      return () => clearTimeout(timer)
    }, [nodes, edges])

    // Shared setup for both file export and clipboard copy: find the live
    // viewport DOM node, clear any selection outline/resize handles so they
    // don't leak into the capture, compute the pan/zoom transform that fits
    // the whole diagram (plus padding, plus an attribution footer if any
    // icon on canvas requires one) into the output image, and — if a footer
    // is needed — temporarily inject it as a real DOM child of the captured
    // element so html-to-image picks it up. Callers MUST call the returned
    // cleanup() once the capture is done, success or failure.
    async function prepareCapture(scale: number) {
      if (nodes.length === 0) return null
      const viewportEl = wrapperRef.current?.querySelector('.react-flow__viewport') as HTMLElement | null
      if (!viewportEl) return null

      const hadSelection = nodes.some((n) => n.selected) || edges.some((e) => e.selected)
      if (hadSelection) {
        setNodes((nds) => nds.map((n) => (n.selected ? { ...n, selected: false } : n)))
        setEdges((eds) => eds.map((e) => (e.selected ? { ...e, selected: false } : e)))
        await new Promise(requestAnimationFrame)
      }

      const creditText = buildAttributionText(nodes)
      const FOOTER_HEIGHT = creditText ? 26 : 0

      const bounds = getNodesBounds(nodes)
      const paddedBounds = {
        x: bounds.x - EXPORT_PADDING,
        y: bounds.y - EXPORT_PADDING,
        width: bounds.width + EXPORT_PADDING * 2,
        height: bounds.height + EXPORT_PADDING * 2 + FOOTER_HEIGHT,
      }
      const width = Math.max(1, Math.round(paddedBounds.width * scale))
      const height = Math.max(1, Math.round(paddedBounds.height * scale))
      const viewport = getViewportForBounds(paddedBounds, width, height, scale, scale, 0)

      let footerEl: HTMLDivElement | null = null
      if (creditText) {
        footerEl = document.createElement('div')
        footerEl.textContent = creditText
        Object.assign(footerEl.style, {
          position: 'absolute',
          left: `${paddedBounds.x}px`,
          top: `${paddedBounds.y + paddedBounds.height - FOOTER_HEIGHT}px`,
          width: `${paddedBounds.width}px`,
          textAlign: 'center',
          fontSize: '11px',
          color: '#94a3b8',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          pointerEvents: 'none',
        })
        viewportEl.appendChild(footerEl)
      }

      return {
        viewportEl,
        style: { width, height, transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})` },
        cleanup: () => footerEl?.remove(),
      }
    }

    useImperativeHandle(
      ref,
      () => ({
        getSpec: (title) => rfToSpec(nodes, edges, title),
        loadSpec: (spec) => {
          const rfNodes = resolveLayoutOverlaps(specToRFNodes(spec))
          setNodes(rfNodes)
          setEdges(specToRFEdges(spec))

          // Async-resolve SVG content for Servier icons (LLM specs carry only the id)
          const servierNodes = rfNodes.filter((n) =>
            (n.data as IconNodeData).iconId?.startsWith('servier:'),
          )
          if (servierNodes.length > 0) {
            Promise.all(
              servierNodes.map(async (n) => {
                const result = await fetchServierSvgById((n.data as IconNodeData).iconId)
                if (!result) return
                setNodes((nds) =>
                  nds.map((nd) =>
                    nd.id === n.id
                      ? { ...nd, data: { ...nd.data, svgContent: result.svgContent, category: result.category } }
                      : nd,
                  ),
                )
              }),
            )
          }

          // Async-resolve SVG content for BioArt icons
          const bioartNodes = rfNodes.filter((n) =>
            (n.data as IconNodeData).iconId?.startsWith('bioart:'),
          )
          if (bioartNodes.length > 0) {
            Promise.all(
              bioartNodes.map(async (n) => {
                const iconId = (n.data as IconNodeData).iconId
                const filename = iconId.replace('bioart:', '')
                try {
                  const res = await fetch(`${import.meta.env.BASE_URL}bioart-icons/${filename}.svg`)
                  if (!res.ok) return
                  const svgContent = sanitizeSvg(await res.text())
                  setNodes((nds) =>
                    nds.map((nd) =>
                      nd.id === n.id
                        ? { ...nd, data: { ...nd.data, svgContent } }
                        : nd,
                    ),
                  )
                } catch { /* ignore */ }
              }),
            )
          }

          // Async-resolve SVG content for Bioicons (LLM specs carry only the id)
          const bioiconsNodes = rfNodes.filter((n) =>
            (n.data as IconNodeData).iconId?.startsWith('bioicons:'),
          )
          if (bioiconsNodes.length > 0) {
            Promise.all(
              bioiconsNodes.map(async (n) => {
                const result = await fetchBioiconsSvgById((n.data as IconNodeData).iconId)
                if (!result) return
                const requiresAttribution = result.license.startsWith('cc-by-') && !result.license.includes('sa')
                setNodes((nds) =>
                  nds.map((nd) =>
                    nd.id === n.id
                      ? {
                          ...nd,
                          data: {
                            ...nd.data,
                            svgContent: result.svgContent,
                            category: result.category,
                            attribution: requiresAttribution
                              ? { author: result.author, license: result.license }
                              : undefined,
                          },
                        }
                      : nd,
                  ),
                )
              }),
            )
          }
        },
        clearAll: () => {
          setNodes([])
          setEdges([])
          localStorage.removeItem(AUTOSAVE_KEY)
        },
        restoreAutosave: () => {
          try {
            const raw = localStorage.getItem(AUTOSAVE_KEY)
            return raw ? (JSON.parse(raw) as DiagramExport) : null
          } catch {
            return null
          }
        },
        autoLayout: () => {
          setNodes(nds => {
            const PAD = 24
            const result = nds.map(n => ({ ...n, position: { ...n.position } }))
            for (let iter = 0; iter < 60; iter++) {
              let moved = false
              for (let i = 0; i < result.length; i++) {
                for (let j = i + 1; j < result.length; j++) {
                  const a = result[i], b = result[j]
                  const aw = (a.width ?? 110) + PAD, ah = (a.height ?? 100) + PAD
                  const bw = (b.width ?? 110) + PAD, bh = (b.height ?? 100) + PAD
                  const ax1 = a.position.x, ax2 = ax1 + aw
                  const ay1 = a.position.y, ay2 = ay1 + ah
                  const bx1 = b.position.x, bx2 = bx1 + bw
                  const by1 = b.position.y, by2 = by1 + bh
                  if (ax2 > bx1 && bx2 > ax1 && ay2 > by1 && by2 > ay1) {
                    const ox = Math.min(ax2 - bx1, bx2 - ax1) / 2
                    const oy = Math.min(ay2 - by1, by2 - ay1) / 2
                    if (ox < oy) {
                      const d = a.position.x < b.position.x ? ox : -ox
                      result[i].position = { ...result[i].position, x: result[i].position.x - d }
                      result[j].position = { ...result[j].position, x: result[j].position.x + d }
                    } else {
                      const d = a.position.y < b.position.y ? oy : -oy
                      result[i].position = { ...result[i].position, y: result[i].position.y - d }
                      result[j].position = { ...result[j].position, y: result[j].position.y + d }
                    }
                    moved = true
                  }
                }
              }
              if (!moved) break
            }
            return result
          })
        },
        undo: () => {
          if (historyIdxRef.current <= 0) return
          historyIdxRef.current--
          const snap = historyRef.current[historyIdxRef.current]
          isRestoringRef.current = true
          setNodes(snap.nodes)
          setEdges(snap.edges)
          setTimeout(() => { isRestoringRef.current = false }, 50)
        },
        redo: () => {
          if (historyIdxRef.current >= historyRef.current.length - 1) return
          historyIdxRef.current++
          const snap = historyRef.current[historyIdxRef.current]
          isRestoringRef.current = true
          setNodes(snap.nodes)
          setEdges(snap.edges)
          setTimeout(() => { isRestoringRef.current = false }, 50)
        },
        copySelected: () => {
          clipboardRef.current = nodes.filter(n => n.selected)
        },
        paste: () => {
          if (clipboardRef.current.length === 0) return
          const newNodes = clipboardRef.current.map(n => ({
            ...n,
            id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            position: { x: n.position.x + 40, y: n.position.y + 40 },
            selected: true,
          }))
          setNodes(nds => [...nds.map(n => ({...n, selected: false})), ...newNodes])
        },
        duplicateSelected: () => {
          const selected = nodes.filter(n => n.selected)
          if (selected.length === 0) return
          const newNodes = selected.map(n => ({
            ...n,
            id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            position: { x: n.position.x + 30, y: n.position.y + 30 },
            selected: true,
          }))
          setNodes(nds => [...nds.map(n => ({...n, selected: false})), ...newNodes])
        },
        exportImage: async (format, filename, opts) => {
          const prepared = await prepareCapture(opts.scale)
          if (!prepared) return
          try {
            const dataUrl = await captureElement(format, prepared.viewportEl, prepared.style, opts.bgColor)
            triggerDownload(dataUrl, filename)
          } finally {
            prepared.cleanup()
          }
        },
        copyImageToClipboard: async (bgColor) => {
          const prepared = await prepareCapture(2)
          if (!prepared) return false
          try {
            const blob = await captureBlob(prepared.viewportEl, prepared.style, bgColor)
            if (!blob) return false
            await copyBlobToClipboard(blob)
            return true
          } finally {
            prepared.cleanup()
          }
        },
      }),
      [nodes, edges, setNodes, setEdges, getNodesBounds],
    )

    const onConnect = useCallback(
      (connection: Connection) => {
        setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds))
      },
      [setEdges],
    )

    const onReconnect = useCallback(
      (oldEdge: Edge, newConnection: Connection) =>
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
      [setEdges],
    )

    // Smart alignment guides — snap the dragged node onto another node's
    // edge/center when close, and show a guide line while dragging. Skipped
    // entirely when snapToGrid is on: XYDrag already applies snapGrid
    // internally before onNodeDrag fires, so running both would fight over
    // the final position.
    const [guides, setGuides] = useState<{ vGuideX: number | null; hGuideY: number | null }>({
      vGuideX: null,
      hGuideY: null,
    })

    const onNodeDrag: OnNodeDrag = useCallback(
      (_event, node) => {
        if (snapToGrid) return
        const dragged = { id: node.id, x: node.position.x, y: node.position.y, width: node.width ?? 110, height: node.height ?? 100 }
        const others = nodes
          .filter((n) => n.id !== node.id)
          .map((n) => ({ id: n.id, x: n.position.x, y: n.position.y, width: n.width ?? 110, height: n.height ?? 100 }))
        const result = computeGuides(dragged, others, 6)
        setGuides({ vGuideX: result.vGuideX, hGuideY: result.hGuideY })
        if (result.dx !== 0 || result.dy !== 0) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === node.id
                ? { ...n, position: { x: n.position.x + result.dx, y: n.position.y + result.dy } }
                : n,
            ),
          )
        }
      },
      [snapToGrid, nodes, setNodes],
    )

    const onNodeDragStop = useCallback(() => {
      setGuides({ vGuideX: null, hGuideY: null })
    }, [])

    const onDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()

        // Handle panel icon drag (application/sciknitter data)
        const raw = e.dataTransfer.getData('application/sciknitter')
        if (raw) {
          const icon: Icon = JSON.parse(raw)
          const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
          setNodes((nds) => nds.concat(createRFNode(icon, position)))
          return
        }

        // Handle SVG file drops from the OS (e.g. files downloaded from NIH Bioart)
        const svgFiles = Array.from(e.dataTransfer.files).filter(
          (f) => f.type === 'image/svg+xml' || f.name.toLowerCase().endsWith('.svg'),
        )
        svgFiles.forEach((file) => {
          const reader = new FileReader()
          reader.onload = (ev) => {
            const svgContent = sanitizeSvg(ev.target?.result as string)
            const baseName = file.name.replace(/\.svg$/i, '')
            // Try to parse NIH Bioart filename: BIOART-000658_Title_741470
            const bioartMatch = baseName.match(/^(BIOART-\d+)_(.+?)(?:_\d+)?$/)
            const name = bioartMatch
              ? bioartMatch[2].replace(/-/g, ' ')
              : baseName.replace(/[_-]+/g, ' ')
            const icon: Icon = {
              id: `local:${baseName}`,
              name,
              category: 'Uploaded',
              tags: [],
              source: 'custom',
              svgContent,
            }
            const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
            setNodes((nds) => nds.concat(createRFNode(icon, position)))
          }
          reader.readAsText(file)
        })
      },
      [screenToFlowPosition, setNodes],
    )

    const onDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }, [])

    // Stable ref so the event listener always calls the latest setNodes
    const setNodesRef = useRef(setNodes)
    setNodesRef.current = setNodes

    useEffect(() => {
      function handler(e: Event) {
        const icon = (e as CustomEvent<Icon>).detail
        setNodesRef.current((nds) =>
          nds.concat(
            createRFNode(icon, {
              x: 160 + Math.random() * 300,
              y: 100 + Math.random() * 200,
            }),
          ),
        )
      }
      window.addEventListener('sciknitter:addicon', handler)
      return () => window.removeEventListener('sciknitter:addicon', handler)
    }, [])

    useEffect(() => {
      function handler() {
        const data: TextNodeData = {
          text: '',
          fontSize: 14,
          fontWeight: 'normal',
          fontStyle: 'normal',
          textColor: '#1e293b',
          bgColor: '',
          borderColor: '',
          textAlign: 'left',
        }
        setNodesRef.current((nds) =>
          nds.concat({
            id: `text-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            type: 'textNode',
            position: { x: 160 + Math.random() * 300, y: 100 + Math.random() * 200 },
            width: 200,
            height: 60,
            data,
          }),
        )
      }
      window.addEventListener('sciknitter:addtext', handler)
      return () => window.removeEventListener('sciknitter:addtext', handler)
    }, [])

    useEffect(() => {
      function handler() {
        const data: TextNodeData = {
          text: '',
          fontSize: 12,
          fontWeight: 'bold',
          fontStyle: 'normal',
          textColor: '#1e293b',
          bgColor: '#eff6ff',
          borderColor: '#bfdbfe',
          textAlign: 'left',
        }
        setNodesRef.current((nds) =>
          nds.concat({
            id: `panelnode-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            type: 'panelNode',
            position: { x: 100 + Math.random() * 200, y: 80 + Math.random() * 100 },
            width: 400,
            height: 300,
            zIndex: -1,
            data,
          }),
        )
      }
      window.addEventListener('sciknitter:addpanel', handler)
      return () => window.removeEventListener('sciknitter:addpanel', handler)
    }, [])

    useEffect(() => {
      function handler(e: Event) {
        const { letter } = (e as CustomEvent<{ letter: string }>).detail
        const data: TextNodeData = {
          text: letter,
          fontSize: 20,
          fontWeight: 'bold',
          fontStyle: 'normal',
          textColor: '#111827',
          bgColor: '',
          borderColor: '',
          textAlign: 'left',
        }
        setNodesRef.current((nds) =>
          nds.concat({
            id: `panel-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            type: 'textNode',
            position: { x: 60 + Math.random() * 200, y: 60 + Math.random() * 100 },
            width: 50,
            height: 40,
            data,
          }),
        )
      }
      window.addEventListener('sciknitter:addpanellabel', handler)
      return () => window.removeEventListener('sciknitter:addpanellabel', handler)
    }, [])

    return (
      <div className="flex-1 h-full" ref={wrapperRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onDrop={onDrop}
          onDragOver={onDragOver}
          defaultEdgeOptions={defaultEdgeOptions}
          snapToGrid={snapToGrid}
          snapGrid={[20, 20]}
          selectionOnDrag={isSelecting}
          panOnDrag={isSelecting ? [1, 2] : true}
          selectionMode={SelectionMode.Partial}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.4 }}
          deleteKeyCode={['Delete', 'Backspace']}
          multiSelectionKeyCode={['Meta', 'Control']}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#e2e8f0" />
          <Controls className="!shadow-sm" />
          <MiniMap
            nodeStrokeWidth={2}
            zoomable
            pannable
            className="!rounded-lg !shadow-sm !border !border-gray-200"
          />
          <ViewportPortal>
            {guides.vGuideX !== null && (
              <div
                className="pointer-events-none"
                style={{ position: 'absolute', left: guides.vGuideX, top: -5000, width: 1, height: 10000, background: '#3b82f6' }}
              />
            )}
            {guides.hGuideY !== null && (
              <div
                className="pointer-events-none"
                style={{ position: 'absolute', left: -5000, top: guides.hGuideY, width: 10000, height: 1, background: '#3b82f6' }}
              />
            )}
          </ViewportPortal>
        </ReactFlow>
      </div>
    )
  },
)
