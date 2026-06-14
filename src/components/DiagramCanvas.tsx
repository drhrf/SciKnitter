import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  SelectionMode,
  ConnectionMode,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  BackgroundVariant,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { IconNode } from './IconNode'
import { TextNode } from './TextNode'
import { CustomEdge } from './CustomEdge'
import { rfToSpec, specToRFEdges, specToRFNodes } from '../utils/diagram'
import type { DiagramExport, Icon, IconNodeData, TextNodeData } from '../types'

export interface DiagramCanvasHandle {
  getSpec: (title: string) => DiagramExport
  loadSpec: (spec: DiagramExport) => void
  clearAll: () => void
}

interface DiagramCanvasProps {
  snapToGrid: boolean
  /** When true: left-drag draws a selection box; pan uses middle/right mouse */
  isSelecting: boolean
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

function createRFNode(icon: Icon, position: { x: number; y: number }): Node {
  const data: IconNodeData = {
    iconId: icon.id,
    svgContent: icon.svgContent,
    label: icon.name,
    category: icon.category,
  }
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'iconNode',
    position,
    width: 110,
    height: 100,
    data,
  }
}

export const DiagramCanvas = forwardRef<DiagramCanvasHandle, DiagramCanvasProps>(
  function DiagramCanvas({ snapToGrid, isSelecting }, ref) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { screenToFlowPosition } = useReactFlow()

    const nodeTypes: NodeTypes = useMemo(() => ({ iconNode: IconNode, textNode: TextNode }), [])
    const edgeTypes: EdgeTypes = useMemo(() => ({ custom: CustomEdge }), [])

    useImperativeHandle(
      ref,
      () => ({
        getSpec: (title) => rfToSpec(nodes, edges, title),
        loadSpec: (spec) => {
          setNodes(specToRFNodes(spec))
          setEdges(specToRFEdges(spec))
        },
        clearAll: () => {
          setNodes([])
          setEdges([])
        },
      }),
      [nodes, edges, setNodes, setEdges],
    )

    const onConnect = useCallback(
      (connection: Connection) => {
        setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds))
      },
      [setEdges],
    )

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
            const svgContent = ev.target?.result as string
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

    return (
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#e2e8f0" />
          <Controls className="!shadow-sm" />
          <MiniMap
            nodeStrokeWidth={2}
            zoomable
            pannable
            className="!rounded-lg !shadow-sm !border !border-gray-200"
          />
        </ReactFlow>
      </div>
    )
  },
)
