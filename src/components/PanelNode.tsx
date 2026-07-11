import { useEffect, useRef, useState } from 'react'
import { Handle, NodeResizer, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import type { TextNodeData } from '../types'
import { RotateHandle } from './RotateHandle'

// Renders the same on-disk shape as TextNode (nodeType:'text' + bgColor +
// zIndex:-1 — see diagram.ts's specToRFNodes) but as its own React Flow node
// type. Splitting this out lets PropertiesPanel show panel-appropriate
// controls and lets resolveTextOverlaps.ts identify panels by node type
// instead of inferring "is this a panel" from zIndex.
export function PanelNode({ id, data, selected }: NodeProps) {
  const nodeData = data as TextNodeData
  const { setNodes } = useReactFlow()
  const [editing, setEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleStyle = 'w-4 h-4 !bg-blue-400 !border-2 !border-white !rounded-full shadow'
  const bgFill = !nodeData.bgColor
    ? 'transparent'
    : nodeData.gradientTo
      ? `linear-gradient(135deg, ${nodeData.bgColor}, ${nodeData.gradientTo})`
      : nodeData.bgColor

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
        minWidth={120}
        minHeight={80}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: '#3b82f6', border: '2px solid white' }}
        lineStyle={{ borderColor: '#3b82f6', borderWidth: 1 }}
      />

      <Handle id="top" type="source" position={Position.Top} className={handleStyle} />
      <Handle id="bottom" type="source" position={Position.Bottom} className={handleStyle} />
      <Handle id="left" type="source" position={Position.Left} className={handleStyle} />
      <Handle id="right" type="source" position={Position.Right} className={handleStyle} />

      {selected && <RotateHandle nodeId={id} rotation={nodeData.rotation ?? 0} />}

      <div
        className="w-full h-full overflow-hidden"
        style={{
          transform: `rotate(${nodeData.rotation ?? 0}deg)`,
          transformOrigin: 'center center',
          background: bgFill,
          opacity: nodeData.opacity ?? 1,
          border: nodeData.borderColor ? `1.5px solid ${nodeData.borderColor}` : 'none',
          borderRadius: nodeData.cornerRadius ?? 10,
          padding: '8px 10px',
          boxSizing: 'border-box',
          outline: selected ? '2px solid #3b82f6' : '1px dashed transparent',
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
            className="w-full h-auto resize-none border-none outline-none bg-transparent nodrag nopan"
            style={{
              fontSize: nodeData.fontSize ?? 12,
              fontWeight: nodeData.fontWeight ?? 'bold',
              fontStyle: nodeData.fontStyle ?? 'normal',
              color: nodeData.textColor || '#1e293b',
              textAlign: nodeData.textAlign ?? 'left',
              lineHeight: 1.4,
              fontFamily: nodeData.fontFamily || 'inherit',
            }}
          />
        ) : (
          <p
            className="m-0 w-full whitespace-pre-wrap break-words select-none pointer-events-none"
            style={{
              fontSize: nodeData.fontSize ?? 12,
              fontWeight: nodeData.fontWeight ?? 'bold',
              fontStyle: nodeData.fontStyle ?? 'normal',
              color: nodeData.textColor || '#1e293b',
              textAlign: nodeData.textAlign ?? 'left',
              lineHeight: 1.4,
              fontFamily: nodeData.fontFamily || 'inherit',
            }}
          >
            {nodeData.text || (
              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 'normal' }}>
                Double-click to title this panel…
              </span>
            )}
          </p>
        )}
      </div>
    </>
  )
}
