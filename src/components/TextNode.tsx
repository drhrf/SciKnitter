import { useEffect, useRef, useState } from 'react'
import { Handle, NodeResizer, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import type { TextNodeData } from '../types'

export function TextNode({ id, data, selected }: NodeProps) {
  const nodeData = data as TextNodeData
  const { setNodes } = useReactFlow()
  const [editing, setEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleStyle = 'w-4 h-4 !bg-blue-400 !border-2 !border-white !rounded-full shadow'

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [editing])

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={32}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: '#3b82f6', border: '2px solid white' }}
        lineStyle={{ borderColor: '#3b82f6', borderWidth: 1 }}
      />

      <Handle id="top" type="source" position={Position.Top} className={handleStyle} />
      <Handle id="bottom" type="source" position={Position.Bottom} className={handleStyle} />
      <Handle id="left" type="source" position={Position.Left} className={handleStyle} />
      <Handle id="right" type="source" position={Position.Right} className={handleStyle} />

      <div
        className="w-full h-full overflow-hidden"
        style={{
          transform: `rotate(${nodeData.rotation ?? 0}deg)`,
          transformOrigin: 'center center',
          background: nodeData.bgColor || 'transparent',
          border: nodeData.borderColor ? `1.5px solid ${nodeData.borderColor}` : 'none',
          borderRadius: 6,
          padding: '6px 8px',
          boxSizing: 'border-box',
          outline: selected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
          outlineOffset: selected ? 2 : 0,
        }}
        onDoubleClick={() => setEditing(true)}
      >
        {editing ? (
          <textarea
            ref={textareaRef}
            defaultValue={nodeData.text}
            onBlur={(e) => {
              setNodes((nodes) =>
                nodes.map((n) =>
                  n.id === id ? { ...n, data: { ...n.data, text: e.target.value } } : n,
                ),
              )
              setEditing(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setEditing(false)
            }}
            className="w-full h-full resize-none border-none outline-none bg-transparent nodrag nopan"
            style={{
              fontSize: nodeData.fontSize ?? 14,
              fontWeight: nodeData.fontWeight ?? 'normal',
              fontStyle: nodeData.fontStyle ?? 'normal',
              color: nodeData.textColor || '#1e293b',
              textAlign: nodeData.textAlign ?? 'left',
              lineHeight: 1.5,
              fontFamily: 'inherit',
            }}
          />
        ) : (
          <p
            className="m-0 w-full h-full whitespace-pre-wrap break-words select-none"
            style={{
              fontSize: nodeData.fontSize ?? 14,
              fontWeight: nodeData.fontWeight ?? 'normal',
              fontStyle: nodeData.fontStyle ?? 'normal',
              color: nodeData.textColor || '#1e293b',
              textAlign: nodeData.textAlign ?? 'left',
              lineHeight: 1.5,
              cursor: 'default',
            }}
          >
            {nodeData.text || (
              <span style={{ color: '#d1d5db', fontStyle: 'italic', fontSize: 12, fontWeight: 'normal' }}>
                Double-click to edit…
              </span>
            )}
          </p>
        )}
      </div>
    </>
  )
}
