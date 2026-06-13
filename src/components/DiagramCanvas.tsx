import { useCallback, useEffect, useMemo, useRef } from 'react'
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
import type { Icon, IconNodeData } from '../types'

interface DiagramCanvasProps {
  pendingIcon: Icon | null
  onIconPlaced: () => void
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

function CanvasInner({ pendingIcon, onIconPlaced }: DiagramCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { screenToFlowPosition } = useReactFlow()

  const nodeTypes: NodeTypes = useMemo(() => ({ iconNode: IconNode }), [])
  const edgeTypes: EdgeTypes = useMemo(() => ({ custom: CustomEdge }), [])

  function createNode(icon: Icon, position: { x: number; y: number }): Node {
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
      setNodes((nds) => nds.concat(createNode(icon, position)))
    },
    [screenToFlowPosition, setNodes],
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const onPaneClick = useCallback(
    (e: React.MouseEvent) => {
      if (!pendingIcon) return
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      setNodes((nds) => nds.concat(createNode(pendingIcon, position)))
      onIconPlaced()
    },
    [pendingIcon, screenToFlowPosition, setNodes, onIconPlaced],
  )

  // Stable ref so the event listener always sees latest setNodes
  const setNodesRef = useRef(setNodes)
  setNodesRef.current = setNodes

  useEffect(() => {
    function handler(e: Event) {
      const icon = (e as CustomEvent<Icon>).detail
      setNodesRef.current((nds) =>
        nds.concat(
          createNode(icon, {
            x: 160 + Math.random() * 280,
            y: 100 + Math.random() * 180,
          }),
        ),
      )
    }
    window.addEventListener('sciknitter:addicon', handler)
    return () => window.removeEventListener('sciknitter:addicon', handler)
  }, [])

  return (
    <div
      className="flex-1 h-full relative"
      style={{ cursor: pendingIcon ? 'crosshair' : 'default' }}
    >
      {pendingIcon && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-full shadow-lg pointer-events-none">
          Click canvas to place "{pendingIcon.name}"
        </div>
      )}
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
        onPaneClick={onPaneClick}
        defaultEdgeOptions={defaultEdgeOptions}
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
}

export function DiagramCanvas(props: DiagramCanvasProps) {
  return <CanvasInner {...props} />
}
