import { useCallback, useEffect, useRef, useState } from 'react'
import { Handle, NodeResizer, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import { X } from 'lucide-react'
import type { IconNodeData } from '../types'

export function IconNode({ id, data, selected }: NodeProps) {
  const nodeData = data as IconNodeData
  const [isEditing, setIsEditing] = useState(false)
  const [labelValue, setLabelValue] = useState(nodeData.label)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setNodes, deleteElements } = useReactFlow()

  // Sync local label state when node data changes externally (e.g. from PropertiesPanel)
  useEffect(() => {
    if (!isEditing) setLabelValue(nodeData.label)
  }, [nodeData.label, isEditing])

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
        n.id === id ? { ...n, data: { ...n.data, label: labelValue } } : n,
      ),
    )
  }, [id, labelValue, setNodes])

  const handleStyle = 'w-2.5 h-2.5 !bg-blue-400 !border-2 !border-white'

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={60}
        minHeight={60}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: '#3b82f6', border: '2px solid white' }}
        lineStyle={{ borderColor: '#3b82f6', borderWidth: 1 }}
      />

      {/* All handles are type="source" — with ConnectionMode.Loose any handle can both
          initiate and receive connections, so all four corners work bidirectionally */}
      <Handle id="top" type="source" position={Position.Top} className={handleStyle} />
      <Handle id="bottom" type="source" position={Position.Bottom} className={handleStyle} />
      <Handle id="left" type="source" position={Position.Left} className={handleStyle} />
      <Handle id="right" type="source" position={Position.Right} className={handleStyle} />

      <div
        className={`relative flex flex-col items-center w-full h-full rounded-xl transition-shadow cursor-default ${
          selected
            ? 'shadow-[0_0_0_2px_#3b82f6,0_4px_12px_rgba(0,0,0,0.12)]'
            : 'shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)]'
        }`}
        style={{
          padding: '8px 6px 4px',
          boxSizing: 'border-box',
          background: nodeData.bgColor === 'transparent' ? 'transparent' : (nodeData.bgColor || 'white'),
          borderRadius: 12,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Delete button */}
        {(hovered || selected) && (
          <button
            onClick={() => deleteElements({ nodes: [{ id }] })}
            className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 nodrag"
            title="Delete"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* SVG icon — fills available space and scales with node size */}
        <div
          className="flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden pointer-events-none [&>svg]:w-full [&>svg]:h-full"
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
            onDoubleClick={() => {
              setLabelValue(nodeData.label)
              setIsEditing(true)
            }}
            className="mt-1 text-center text-[11px] text-gray-700 leading-tight max-w-full px-1 cursor-text select-none shrink-0"
            title="Double-click to rename"
          >
            {nodeData.label}
          </div>
        )}
      </div>
    </>
  )
}
