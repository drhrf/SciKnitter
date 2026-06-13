import {
  getBezierPath,
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
} from '@xyflow/react'
import { useState } from 'react'
import type { EdgeData, EdgeStyle } from '../types'

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps) {
  const edgeData = (data ?? {}) as EdgeData
  const edgeStyle: EdgeStyle = edgeData.edgeStyle ?? 'arrow'
  const label = edgeData.label ?? ''
  const [editing, setEditing] = useState(false)
  const [labelValue, setLabelValue] = useState(label)
  const { setEdges } = useReactFlow()

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isDashed = edgeStyle === 'dashed'
  const isBlunt = edgeStyle === 'blunt'
  const isBidirectional = edgeStyle === 'bidirectional'

  const strokeColor = selected ? '#3b82f6' : '#64748b'
  const strokeWidth = selected ? 2.5 : 2

  function commitLabel() {
    setEditing(false)
    setEdges((edges) =>
      edges.map((e) =>
        e.id === id
          ? { ...e, data: { ...(e.data ?? {}), label: labelValue } }
          : e,
      ),
    )
  }

  return (
    <>
      <defs>
        {isBlunt && (
          <marker
            id={`blunt-${id}`}
            markerWidth="6"
            markerHeight="10"
            refX="3"
            refY="5"
            orient="auto"
          >
            <line
              x1="3"
              y1="1"
              x2="3"
              y2="9"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </marker>
        )}
        {isBidirectional && (
          <marker
            id={`bidir-start-${id}`}
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 8 4 L 0 8 z"
              fill={strokeColor}
            />
          </marker>
        )}
      </defs>

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={
          isBlunt
            ? `url(#blunt-${id})`
            : isBidirectional
              ? markerEnd
              : markerEnd
        }
        markerStart={isBidirectional ? `url(#bidir-start-${id})` : undefined}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: isDashed ? '6,4' : undefined,
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {editing ? (
            <input
              autoFocus
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitLabel()
                if (e.key === 'Escape') {
                  setLabelValue(label)
                  setEditing(false)
                }
              }}
              className="text-xs border border-blue-400 rounded px-1.5 py-0.5 bg-white focus:outline-none shadow"
            />
          ) : (
            <div
              onDoubleClick={() => setEditing(true)}
              className={`text-xs px-1.5 py-0.5 rounded cursor-pointer select-none ${
                labelValue
                  ? 'bg-white border border-gray-200 shadow-sm text-gray-700'
                  : 'text-transparent hover:bg-gray-100 hover:text-gray-400'
              }`}
              title="Double-click to add/edit label"
            >
              {labelValue || '＋ label'}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
