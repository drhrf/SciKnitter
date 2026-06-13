import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Handle,
  Position,
  NodeProps,
  useReactFlow,
} from '@xyflow/react'
import { X } from 'lucide-react'
import type { IconNodeData } from '../types'

export function IconNode({ id, data, selected }: NodeProps) {
  const nodeData = data as IconNodeData
  const [isEditing, setIsEditing] = useState(false)
  const [labelValue, setLabelValue] = useState(nodeData.label)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setNodes, deleteElements } = useReactFlow()

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const commitLabel = useCallback(() => {
    setIsEditing(false)
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, label: labelValue } }
          : n,
      ),
    )
  }, [id, labelValue, setNodes])

  function handleDelete() {
    deleteElements({ nodes: [{ id }] })
  }

  const handleStyle = 'w-2.5 h-2.5 !bg-blue-400 !border-2 !border-white'

  return (
    <div
      className={`relative flex flex-col items-center rounded-xl bg-white transition-shadow cursor-default ${
        selected
          ? 'shadow-[0_0_0_2px_#3b82f6,0_4px_12px_rgba(0,0,0,0.12)]'
          : 'shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)]'
      }`}
      style={{ width: 110, padding: '10px 8px 8px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <Handle type="source" position={Position.Bottom} className={handleStyle} />
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />

      {/* Delete button */}
      {(hovered || selected) && (
        <button
          onClick={handleDelete}
          className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 nodrag"
          title="Delete"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* SVG icon */}
      <div
        className="w-16 h-16 flex items-center justify-center pointer-events-none"
        dangerouslySetInnerHTML={{ __html: nodeData.svgContent }}
      />

      {/* Label */}
      {isEditing ? (
        <input
          ref={inputRef}
          value={labelValue}
          onChange={(e) => setLabelValue(e.target.value)}
          onBlur={commitLabel}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitLabel()
            if (e.key === 'Escape') {
              setLabelValue(nodeData.label)
              setIsEditing(false)
            }
          }}
          className="mt-1 w-full text-center text-[11px] border border-blue-400 rounded px-1 py-0.5 focus:outline-none nodrag"
        />
      ) : (
        <div
          onDoubleClick={() => setIsEditing(true)}
          className="mt-1 text-center text-[11px] text-gray-700 leading-tight max-w-full px-1 cursor-text select-none"
          title="Double-click to edit label"
        >
          {labelValue || nodeData.label}
        </div>
      )}
    </div>
  )
}
