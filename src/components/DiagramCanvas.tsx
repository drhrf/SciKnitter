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
import { CustomEdge } from './CustomEdge'
import { rfToSpec, specToRFEdges, specToRFNodes } from '../utils/diagram'
import type { DiagramExport, Icon, IconNodeData } from '../types'

export interface DiagramCanvasHandle {
  getSpec: (title: string) => DiagramExport
  loadSpec: (spec: DiagramExport) => void
  clearAll: () => void
}

interface DiagramCanvasProps {
  snapToGrid: boolean
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
    data,
  }
}

export const DiagramCanvas = forwardRef<DiagramCanvasHandle, DiagramCanvasProps>(
  function DiagramCanvas({ snapToGrid }, ref) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { screenToFlowPosition } = useReactFlow()

    const nodeTypes: NodeTypes = useMemo(() => ({ iconNode: IconNode }), [])
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
        const raw = e.dataTransfer.getData('application/sciknitter')
        if (!raw) return
        const icon: Icon = JSON.parse(raw)
        const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
        setNodes((nds) => nds.concat(createRFNode(icon, position)))
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
