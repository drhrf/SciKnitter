import { useCallback, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'
import { RotateCw } from 'lucide-react'

interface RotateHandleProps {
  nodeId: string
  rotation: number
  /** Distance in px from the node's top edge, in unscaled node coordinates */
  offset?: number
}

// A small drag handle above a selected node that lets you rotate it directly
// on the canvas, instead of only through the numeric input in
// PropertiesPanel. Angle is measured from the node's center to the pointer.
export function RotateHandle({ nodeId, rotation, offset = 28 }: RotateHandleProps) {
  const { setNodes, screenToFlowPosition, getNode } = useReactFlow()
  const draggingRef = useRef(false)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      e.preventDefault()
      draggingRef.current = true
      ;(e.target as Element).setPointerCapture(e.pointerId)

      const onMove = (ev: PointerEvent) => {
        if (!draggingRef.current) return
        const node = getNode(nodeId)
        if (!node) return
        const w = node.width ?? 110
        const h = node.height ?? 100
        const centerFlow = {
          x: node.position.x + w / 2,
          y: node.position.y + h / 2,
        }
        const pointerFlow = screenToFlowPosition({ x: ev.clientX, y: ev.clientY })
        const angleRad = Math.atan2(pointerFlow.y - centerFlow.y, pointerFlow.x - centerFlow.x)
        // 0deg = pointing up (handle sits above the node), so offset by +90deg
        let deg = Math.round(((angleRad * 180) / Math.PI + 90 + 360) % 360)
        // Snap to 15deg increments when close, for easy axis-aligned rotation
        const nearest15 = Math.round(deg / 15) * 15
        if (Math.abs(deg - nearest15) < 4) deg = nearest15 % 360
        setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, rotation: deg } } : n)))
      }

      const onUp = () => {
        draggingRef.current = false
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [nodeId, setNodes, screenToFlowPosition, getNode],
  )

  return (
    <div
      className="nodrag nopan absolute left-1/2 w-5 h-5 rounded-full bg-white border-2 border-blue-400 shadow flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-blue-50 transition-colors"
      style={{ top: -offset, transform: `translateX(-50%) rotate(${-rotation}deg)` }}
      onPointerDown={onPointerDown}
      title="Drag to rotate"
    >
      <RotateCw className="w-3 h-3 text-blue-500" />
    </div>
  )
}
