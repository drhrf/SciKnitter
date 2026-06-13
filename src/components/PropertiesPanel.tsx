import { useReactFlow, useStore } from '@xyflow/react'
import { Trash2 } from 'lucide-react'
import type { EdgeStyle, IconNodeData } from '../types'

const EDGE_STYLES: { value: EdgeStyle; label: string; description: string }[] = [
  { value: 'arrow', label: '→ Arrow', description: 'Activation / positive regulation' },
  { value: 'blunt', label: '⊣ Blunt', description: 'Inhibition / negative regulation' },
  { value: 'dashed', label: '⤑ Dashed', description: 'Indirect relationship' },
  { value: 'bidirectional', label: '↔ Both', description: 'Bidirectional interaction' },
]

export function PropertiesPanel() {
  const { setNodes, setEdges, deleteElements } = useReactFlow()

  const selectedNodes = useStore((s) =>
    s.nodes.filter((n) => n.selected),
  )
  const selectedEdges = useStore((s) =>
    s.edges.filter((e) => e.selected),
  )

  const selectedNode = selectedNodes[0] ?? null
  const selectedEdge = selectedEdges[0] ?? null
  const multiSelect = selectedNodes.length > 1 || (selectedNodes.length >= 1 && selectedEdges.length >= 1)

  // Multi-selection panel
  if (multiSelect) {
    const nodeCount = selectedNodes.length
    const edgeCount = selectedEdges.length
    return (
      <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Selection
          </h2>
          <div className="space-y-1 text-xs text-gray-600">
            {nodeCount > 0 && <p>{nodeCount} node{nodeCount > 1 ? 's' : ''} selected</p>}
            {edgeCount > 0 && <p>{edgeCount} edge{edgeCount > 1 ? 's' : ''} selected</p>}
          </div>
          <p className="text-[10px] text-gray-400">
            Drag any selected node to move all together. Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px] font-mono">Delete</kbd> to remove all.
          </p>
          <button
            onClick={() =>
              deleteElements({
                nodes: selectedNodes.map((n) => ({ id: n.id })),
                edges: selectedEdges.map((e) => ({ id: e.id })),
              })
            }
            className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete all selected
          </button>
        </div>
      </aside>
    )
  }

  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Properties
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Click a node or edge to edit its properties.
          </p>
          <div className="mt-6 space-y-2 text-xs text-gray-400">
            <p className="font-medium text-gray-500">Tips</p>
            <p>• Drag handles to connect nodes</p>
            <p>• Double-click labels to edit</p>
            <p>• Right-click edge to change style</p>
          </div>
        </div>
      </aside>
    )
  }

  if (selectedNode) {
    const nodeData = selectedNode.data as IconNodeData
    return (
      <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Node
          </h2>

          {/* Icon preview */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16"
              dangerouslySetInnerHTML={{ __html: nodeData.svgContent }}
            />
          </div>

          {/* Label field */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Label
            </label>
            <input
              type="text"
              defaultValue={nodeData.label}
              onBlur={(e) => {
                const val = e.target.value
                setNodes((nodes) =>
                  nodes.map((n) =>
                    n.id === selectedNode.id
                      ? { ...n, data: { ...n.data, label: val } }
                      : n,
                  ),
                )
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
              }}
              className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category badge */}
          <div>
            <span className="text-xs font-medium text-gray-500">Category</span>
            <p className="mt-1 inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
              {nodeData.category}
            </p>
          </div>

          {/* Delete */}
          <button
            onClick={() => deleteElements({ nodes: [{ id: selectedNode.id }] })}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete node
          </button>
        </div>
      </aside>
    )
  }

  // Edge selected
  const edgeData = (selectedEdge!.data ?? {}) as { edgeStyle?: EdgeStyle; label?: string }
  const currentStyle: EdgeStyle = edgeData.edgeStyle ?? 'arrow'

  return (
    <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Edge
        </h2>

        {/* Edge style selector */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Connection style
          </label>
          <div className="space-y-1">
            {EDGE_STYLES.map(({ value, label, description }) => (
              <button
                key={value}
                onClick={() => {
                  setEdges((edges) =>
                    edges.map((e) =>
                      e.id === selectedEdge!.id
                        ? { ...e, data: { ...(e.data ?? {}), edgeStyle: value } }
                        : e,
                    ),
                  )
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  currentStyle === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{label}</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    currentStyle === value ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Label field */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Label
          </label>
          <input
            type="text"
            defaultValue={edgeData.label ?? ''}
            placeholder="Optional label…"
            onBlur={(e) => {
              const val = e.target.value
              setEdges((edges) =>
                edges.map((e) =>
                  e.id === selectedEdge!.id
                    ? { ...e, data: { ...(e.data ?? {}), label: val } }
                    : e,
                ),
              )
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
            className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Delete */}
        <button
          onClick={() => deleteElements({ edges: [{ id: selectedEdge!.id }] })}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete edge
        </button>
      </div>
    </aside>
  )
}
