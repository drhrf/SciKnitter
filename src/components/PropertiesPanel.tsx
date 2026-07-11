import { useState } from 'react'
import { useReactFlow, useStore } from '@xyflow/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Crop,
  Italic,
  Loader2,
  Trash2,
} from 'lucide-react'
import type { EdgeStyle, IconNodeData, TextNodeData } from '../types'
import { trimSvgWhitespace } from '../utils/cropSvg'
import { applyShapeStyle, isShapeNode } from '../utils/shapeStyle'

const EDGE_STYLES: { value: EdgeStyle; label: string; description: string }[] = [
  { value: 'arrow', label: '→ Arrow', description: 'Activation / positive regulation' },
  { value: 'blunt', label: '⊣ Blunt', description: 'Inhibition / negative regulation' },
  { value: 'dashed', label: '⤑ Dashed', description: 'Indirect relationship' },
  { value: 'bidirectional', label: '↔ Both', description: 'Bidirectional interaction' },
]

export function PropertiesPanel() {
  const { setNodes, setEdges, deleteElements, getNodes } = useReactFlow()
  const [trimming, setTrimming] = useState(false)

  const selectedNodes = useStore((s) => s.nodes.filter((n) => n.selected))
  const selectedEdges = useStore((s) => s.edges.filter((e) => e.selected))

  const selectedNode = selectedNodes[0] ?? null
  const selectedEdge = selectedEdges[0] ?? null
  const multiSelect =
    selectedNodes.length > 1 || (selectedNodes.length >= 1 && selectedEdges.length >= 1)

  function patchNodeData(id: string, patch: Record<string, unknown>) {
    setNodes((nodes) =>
      nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
    )
  }

  // ── Multi-selection ────────────────────────────────────────────────────────
  if (multiSelect) {
    const nc = selectedNodes.length
    const ec = selectedEdges.length
    return (
      <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Selection</h2>
          <div className="space-y-1 text-xs text-gray-600">
            {nc > 0 && <p>{nc} node{nc > 1 ? 's' : ''} selected</p>}
            {ec > 0 && <p>{ec} edge{ec > 1 ? 's' : ''} selected</p>}
          </div>
          <p className="text-[10px] text-gray-400">
            Drag any selected node to move all together. Press{' '}
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px] font-mono">Delete</kbd> to
            remove all.
          </p>
          {selectedNodes.length > 0 && selectedNodes.every(n => n.type === 'iconNode') && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Background</label>
              <div className="flex items-center gap-2">
                <input type="checkbox"
                  checked={selectedNodes.every(n => (n.data as IconNodeData).bgColor === 'transparent')}
                  onChange={(e) => selectedNodes.forEach(n =>
                    patchNodeData(n.id, { bgColor: e.target.checked ? 'transparent' : '' })
                  )}
                  className="rounded" />
                <span className="text-xs text-gray-500">Transparent</span>
              </div>
              {!selectedNodes.every(n => (n.data as IconNodeData).bgColor === 'transparent') && (
                <div className="flex items-center gap-2 mt-1.5">
                  <input type="color"
                    value={(selectedNodes[0].data as IconNodeData).bgColor || '#ffffff'}
                    onChange={(e) => selectedNodes.forEach(n =>
                      patchNodeData(n.id, { bgColor: e.target.value })
                    )}
                    className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5" />
                  <span className="text-xs text-gray-400">Apply to all</span>
                </div>
              )}
            </div>
          )}
          {/* Align & Distribute — only when multiple nodes are selected */}
          {selectedNodes.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Align</label>
              <div className="grid grid-cols-3 gap-1">
                {/* Align left edges */}
                <button onClick={() => {
                  const minX = Math.min(...selectedNodes.map(n => n.position.x))
                  setNodes(nds => nds.map(n => selectedNodes.find(s => s.id === n.id) ? {...n, position: {...n.position, x: minX}} : n))
                }} className="px-1 py-1.5 text-[10px] border border-gray-200 rounded bg-white hover:bg-gray-50" title="Align left">⇤ Left</button>
                {/* Align centers horizontally */}
                <button onClick={() => {
                  const avgX = selectedNodes.reduce((s, n) => s + n.position.x + (n.width ?? 110) / 2, 0) / selectedNodes.length
                  setNodes(nds => nds.map(n => { const s = selectedNodes.find(x => x.id === n.id); return s ? {...n, position: {...n.position, x: avgX - (s.width ?? 110) / 2}} : n }))
                }} className="px-1 py-1.5 text-[10px] border border-gray-200 rounded bg-white hover:bg-gray-50" title="Center horizontally">⇔ H</button>
                {/* Align right edges */}
                <button onClick={() => {
                  const maxX = Math.max(...selectedNodes.map(n => n.position.x + (n.width ?? 110)))
                  setNodes(nds => nds.map(n => { const s = selectedNodes.find(x => x.id === n.id); return s ? {...n, position: {...n.position, x: maxX - (s.width ?? 110)}} : n }))
                }} className="px-1 py-1.5 text-[10px] border border-gray-200 rounded bg-white hover:bg-gray-50" title="Align right">Right ⇥</button>
                {/* Align top edges */}
                <button onClick={() => {
                  const minY = Math.min(...selectedNodes.map(n => n.position.y))
                  setNodes(nds => nds.map(n => selectedNodes.find(s => s.id === n.id) ? {...n, position: {...n.position, y: minY}} : n))
                }} className="px-1 py-1.5 text-[10px] border border-gray-200 rounded bg-white hover:bg-gray-50" title="Align top">⇡ Top</button>
                {/* Align middles vertically */}
                <button onClick={() => {
                  const avgY = selectedNodes.reduce((s, n) => s + n.position.y + (n.height ?? 100) / 2, 0) / selectedNodes.length
                  setNodes(nds => nds.map(n => { const s = selectedNodes.find(x => x.id === n.id); return s ? {...n, position: {...n.position, y: avgY - (s.height ?? 100) / 2}} : n }))
                }} className="px-1 py-1.5 text-[10px] border border-gray-200 rounded bg-white hover:bg-gray-50" title="Center vertically">⇕ V</button>
                {/* Align bottom edges */}
                <button onClick={() => {
                  const maxY = Math.max(...selectedNodes.map(n => n.position.y + (n.height ?? 100)))
                  setNodes(nds => nds.map(n => { const s = selectedNodes.find(x => x.id === n.id); return s ? {...n, position: {...n.position, y: maxY - (s.height ?? 100)}} : n }))
                }} className="px-1 py-1.5 text-[10px] border border-gray-200 rounded bg-white hover:bg-gray-50" title="Align bottom">Bottom ⇣</button>
              </div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 mt-2">Distribute</label>
              <div className="flex gap-1">
                {/* Distribute horizontally */}
                <button onClick={() => {
                  const sorted = [...selectedNodes].sort((a, b) => a.position.x - b.position.x)
                  if (sorted.length < 3) return
                  const totalW = sorted.reduce((s, n) => s + (n.width ?? 110), 0)
                  const span = sorted[sorted.length-1].position.x + (sorted[sorted.length-1].width ?? 110) - sorted[0].position.x
                  const gap = (span - totalW) / (sorted.length - 1)
                  let cx = sorted[0].position.x
                  setNodes(nds => nds.map(n => {
                    const idx = sorted.findIndex(s => s.id === n.id)
                    if (idx < 0) return n
                    const x = idx === 0 ? sorted[0].position.x : (() => { cx += (sorted[idx-1].width ?? 110) + gap; return cx })()
                    return {...n, position: {...n.position, x}}
                  }))
                }} className="flex-1 px-1 py-1.5 text-[10px] border border-gray-200 rounded bg-white hover:bg-gray-50" title="Distribute horizontal spacing evenly">↔ H space</button>
                {/* Distribute vertically */}
                <button onClick={() => {
                  const sorted = [...selectedNodes].sort((a, b) => a.position.y - b.position.y)
                  if (sorted.length < 3) return
                  const totalH = sorted.reduce((s, n) => s + (n.height ?? 100), 0)
                  const span = sorted[sorted.length-1].position.y + (sorted[sorted.length-1].height ?? 100) - sorted[0].position.y
                  const gap = (span - totalH) / (sorted.length - 1)
                  let cy = sorted[0].position.y
                  setNodes(nds => nds.map(n => {
                    const idx = sorted.findIndex(s => s.id === n.id)
                    if (idx < 0) return n
                    const y = idx === 0 ? sorted[0].position.y : (() => { cy += (sorted[idx-1].height ?? 100) + gap; return cy })()
                    return {...n, position: {...n.position, y}}
                  }))
                }} className="flex-1 px-1 py-1.5 text-[10px] border border-gray-200 rounded bg-white hover:bg-gray-50" title="Distribute vertical spacing evenly">↕ V space</button>
              </div>
            </div>
          )}
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

  // ── Nothing selected ───────────────────────────────────────────────────────
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

  // ── Text node ──────────────────────────────────────────────────────────────
  if (selectedNode?.type === 'textNode') {
    const d = selectedNode.data as TextNodeData
    const hasBg = !!d.bgColor
    const hasBorder = !!d.borderColor

    return (
      <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Text Box</h2>

          {/* Text content */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
            <textarea
              defaultValue={d.text}
              rows={3}
              placeholder="Enter text…"
              onBlur={(e) => patchNodeData(selectedNode.id, { text: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Font size */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600 shrink-0">Size</label>
            <input
              type="number"
              min={8}
              max={72}
              defaultValue={d.fontSize ?? 14}
              onBlur={(e) =>
                patchNodeData(selectedNode.id, { fontSize: Math.max(8, Math.min(72, Number(e.target.value))) })
              }
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
              className="w-14 text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-xs text-gray-400">px</span>
          </div>

          {/* Style toggles */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Style</label>
            <div className="flex gap-1">
              <button
                onClick={() =>
                  patchNodeData(selectedNode.id, {
                    fontWeight: d.fontWeight === 'bold' ? 'normal' : 'bold',
                  })
                }
                className={`flex-1 flex items-center justify-center py-1.5 rounded-md border text-xs font-bold transition-colors ${
                  d.fontWeight === 'bold'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  patchNodeData(selectedNode.id, {
                    fontStyle: d.fontStyle === 'italic' ? 'normal' : 'italic',
                  })
                }
                className={`flex-1 flex items-center justify-center py-1.5 rounded-md border text-xs transition-colors ${
                  d.fontStyle === 'italic'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Alignment</label>
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((align) => {
                const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
                return (
                  <button
                    key={align}
                    onClick={() => patchNodeData(selectedNode.id, { textAlign: align })}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md border text-xs transition-colors ${
                      (d.textAlign ?? 'left') === align
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                    title={align.charAt(0).toUpperCase() + align.slice(1)}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Text color */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Text color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={d.textColor || '#1e293b'}
                onChange={(e) => patchNodeData(selectedNode.id, { textColor: e.target.value })}
                className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
              />
              <span className="text-xs text-gray-500 font-mono">{d.textColor || '#1e293b'}</span>
            </div>
          </div>

          {/* Background — purely cosmetic here; a colored text box stays a
              normal foreground annotation. Use "Convert to panel" below to
              turn it into an immovable background region instead. */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasBg}
                onChange={(e) => patchNodeData(selectedNode.id, { bgColor: e.target.checked ? '#ffffff' : '' })}
                className="rounded"
              />
              <input
                type="color"
                value={d.bgColor || '#ffffff'}
                disabled={!hasBg}
                onChange={(e) => patchNodeData(selectedNode.id, { bgColor: e.target.value })}
                className={`w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5 ${!hasBg ? 'opacity-40 cursor-not-allowed' : ''}`}
              />
              <span className="text-xs text-gray-400">{hasBg ? 'color' : 'none'}</span>
            </div>
          </div>

          {/* Border */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Border</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasBorder}
                onChange={(e) =>
                  patchNodeData(selectedNode.id, { borderColor: e.target.checked ? '#94a3b8' : '' })
                }
                className="rounded"
              />
              <input
                type="color"
                value={d.borderColor || '#94a3b8'}
                disabled={!hasBorder}
                onChange={(e) => patchNodeData(selectedNode.id, { borderColor: e.target.value })}
                className={`w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5 ${!hasBorder ? 'opacity-40 cursor-not-allowed' : ''}`}
              />
              <span className="text-xs text-gray-400">{hasBorder ? 'color' : 'none'}</span>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Rotation</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => patchNodeData(selectedNode.id, { rotation: ((d.rotation ?? 0) - 90 + 360) % 360 })}
                className="px-2 py-1 text-xs border border-gray-200 rounded bg-white hover:bg-gray-50"
              >&#8634; -90°</button>
              <input
                type="number"
                min={0}
                max={359}
                value={d.rotation ?? 0}
                onChange={(e) => patchNodeData(selectedNode.id, { rotation: Number(e.target.value) })}
                className="w-16 text-xs text-center border border-gray-300 rounded-md px-1 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => patchNodeData(selectedNode.id, { rotation: ((d.rotation ?? 0) + 90) % 360 })}
                className="px-2 py-1 text-xs border border-gray-200 rounded bg-white hover:bg-gray-50"
              >&#8635; +90°</button>
            </div>
          </div>

          {/* Layer order */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Layer order</label>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  const all = getNodes()
                  const maxZ = Math.max(0, ...all.map(n => (n.zIndex ?? 0) as number))
                  setNodes(all.map(n => n.id === selectedNode.id ? {...n, zIndex: maxZ + 1} : n))
                }}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
                title="Bring to front"
              >
                ↑ Front
              </button>
              <button
                onClick={() => {
                  const all = getNodes()
                  const minZ = Math.min(0, ...all.map(n => (n.zIndex ?? 0) as number))
                  setNodes(all.map(n => n.id === selectedNode.id ? {...n, zIndex: minZ - 1} : n))
                }}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
                title="Send to back"
              >
                ↓ Back
              </button>
            </div>
          </div>

          {/* Convert to panel */}
          <button
            onClick={() => {
              patchNodeData(selectedNode.id, { bgColor: d.bgColor || '#eff6ff', borderColor: d.borderColor || '#bfdbfe' })
              setNodes((nds) => nds.map((n) =>
                n.id === selectedNode.id ? { ...n, type: 'panelNode', zIndex: -1 } : n,
              ))
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs border border-gray-200 rounded-md py-1.5 bg-white hover:bg-gray-50 transition-colors"
            title="Turn this into a background panel that encloses other icons"
          >
            ▢ Convert to panel
          </button>

          {/* Duplicate */}
          <button
            onClick={() => {
              const newNode = {
                ...selectedNode,
                id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                position: { x: selectedNode.position.x + 30, y: selectedNode.position.y + 30 },
                selected: false,
              }
              setNodes((nds) => [...nds, newNode])
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs border border-gray-200 rounded-md py-1.5 bg-white hover:bg-gray-50 transition-colors"
          >
            ⧉ Duplicate
          </button>

          {/* Delete */}
          <button
            onClick={() => deleteElements({ nodes: [{ id: selectedNode.id }] })}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete text box
          </button>
        </div>
      </aside>
    )
  }

  // ── Panel node ─────────────────────────────────────────────────────────────
  if (selectedNode?.type === 'panelNode') {
    const d = selectedNode.data as TextNodeData
    const hasBorder = !!d.borderColor

    return (
      <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Panel</h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <textarea
              defaultValue={d.text}
              rows={2}
              placeholder="Panel title…"
              onBlur={(e) => patchNodeData(selectedNode.id, { text: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Font size */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600 shrink-0">Size</label>
            <input
              type="number"
              min={8}
              max={72}
              defaultValue={d.fontSize ?? 12}
              onBlur={(e) =>
                patchNodeData(selectedNode.id, { fontSize: Math.max(8, Math.min(72, Number(e.target.value))) })
              }
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
              className="w-14 text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-xs text-gray-400">px</span>
          </div>

          {/* Title color */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Title color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={d.textColor || '#1e293b'}
                onChange={(e) => patchNodeData(selectedNode.id, { textColor: e.target.value })}
                className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
              />
              <span className="text-xs text-gray-500 font-mono">{d.textColor || '#1e293b'}</span>
            </div>
          </div>

          {/* Fill — unchecking turns this back into a plain text box, since a
              panel is defined by having a background. */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Fill</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked
                onChange={() => {
                  setNodes((nds) => nds.map((n) =>
                    n.id === selectedNode.id ? { ...n, type: 'textNode', zIndex: 2 } : n,
                  ))
                }}
                className="rounded"
                title="Uncheck to convert back to a text box"
              />
              <input
                type="color"
                value={d.bgColor || '#eff6ff'}
                onChange={(e) => patchNodeData(selectedNode.id, { bgColor: e.target.value })}
                className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
              />
              <span className="text-xs text-gray-400">color</span>
            </div>
          </div>

          {/* Border */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Border</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasBorder}
                onChange={(e) =>
                  patchNodeData(selectedNode.id, { borderColor: e.target.checked ? '#bfdbfe' : '' })
                }
                className="rounded"
              />
              <input
                type="color"
                value={d.borderColor || '#bfdbfe'}
                disabled={!hasBorder}
                onChange={(e) => patchNodeData(selectedNode.id, { borderColor: e.target.value })}
                className={`w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5 ${!hasBorder ? 'opacity-40 cursor-not-allowed' : ''}`}
              />
              <span className="text-xs text-gray-400">{hasBorder ? 'color' : 'none'}</span>
            </div>
          </div>

          {/* Layer order */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Layer order</label>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  const all = getNodes()
                  const maxZ = Math.max(0, ...all.map(n => (n.zIndex ?? 0) as number))
                  setNodes(all.map(n => n.id === selectedNode.id ? {...n, zIndex: maxZ + 1} : n))
                }}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
                title="Bring to front"
              >
                ↑ Front
              </button>
              <button
                onClick={() => {
                  const all = getNodes()
                  const minZ = Math.min(0, ...all.map(n => (n.zIndex ?? 0) as number))
                  setNodes(all.map(n => n.id === selectedNode.id ? {...n, zIndex: minZ - 1} : n))
                }}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
                title="Send to back"
              >
                ↓ Back
              </button>
            </div>
          </div>

          {/* Duplicate */}
          <button
            onClick={() => {
              const newNode = {
                ...selectedNode,
                id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                position: { x: selectedNode.position.x + 30, y: selectedNode.position.y + 30 },
                selected: false,
              }
              setNodes((nds) => [...nds, newNode])
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs border border-gray-200 rounded-md py-1.5 bg-white hover:bg-gray-50 transition-colors"
          >
            ⧉ Duplicate
          </button>

          {/* Delete */}
          <button
            onClick={() => deleteElements({ nodes: [{ id: selectedNode.id }] })}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete panel
          </button>
        </div>
      </aside>
    )
  }

  // ── Icon node ──────────────────────────────────────────────────────────────
  if (selectedNode) {
    const nodeData = selectedNode.data as IconNodeData
    const previewSvg = isShapeNode(nodeData.iconId)
      ? applyShapeStyle(nodeData.svgContent, nodeData.shapeStrokeColor, nodeData.shapeStrokeWidth)
      : nodeData.svgContent
    return (
      <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Node</h2>

          {/* Icon preview */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16"
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          </div>

          {/* Label field */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
            <input
              type="text"
              defaultValue={nodeData.label}
              onBlur={(e) => patchNodeData(selectedNode.id, { label: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
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

          {/* Rotation */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Rotation</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => patchNodeData(selectedNode.id, { rotation: ((nodeData.rotation ?? 0) - 90 + 360) % 360 })}
                className="px-2 py-1 text-xs border border-gray-200 rounded bg-white hover:bg-gray-50"
              >&#8634; -90°</button>
              <input
                type="number"
                min={0}
                max={359}
                value={nodeData.rotation ?? 0}
                onChange={(e) => patchNodeData(selectedNode.id, { rotation: Number(e.target.value) })}
                className="w-16 text-xs text-center border border-gray-300 rounded-md px-1 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => patchNodeData(selectedNode.id, { rotation: ((nodeData.rotation ?? 0) + 90) % 360 })}
                className="px-2 py-1 text-xs border border-gray-200 rounded bg-white hover:bg-gray-50"
              >&#8635; +90°</button>
            </div>
          </div>

          {/* Trim whitespace */}
          <button
            disabled={trimming}
            onClick={async () => {
              setTrimming(true)
              try {
                const newSvg = await trimSvgWhitespace(nodeData.svgContent)
                patchNodeData(selectedNode.id, { svgContent: newSvg })
              } finally {
                setTrimming(false)
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs border border-gray-200 rounded-md py-1.5 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {trimming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crop className="w-3.5 h-3.5" />}
            {trimming ? 'Trimming…' : 'Trim whitespace'}
          </button>

          {/* Shape Style — only for shape nodes */}
          {isShapeNode(nodeData.iconId) && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Shape Style</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={nodeData.shapeStrokeColor || '#374151'}
                    onChange={(e) => patchNodeData(selectedNode.id, { shapeStrokeColor: e.target.value })}
                    className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
                  />
                  <span className="text-xs text-gray-500">Line color</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={nodeData.shapeStrokeWidth ?? 3}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val) && val >= 0.5) {
                        patchNodeData(selectedNode.id, { shapeStrokeWidth: val })
                      }
                    }}
                    className="w-14 text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-xs text-gray-400">px thick</span>
                </div>
              </div>
            </div>
          )}

          {/* Background */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={nodeData.bgColor === 'transparent'}
                onChange={(e) =>
                  patchNodeData(selectedNode.id, { bgColor: e.target.checked ? 'transparent' : '' })
                }
                className="rounded"
              />
              <span className="text-xs text-gray-500">Transparent</span>
            </div>
            {nodeData.bgColor !== 'transparent' && (
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="color"
                  value={nodeData.bgColor || '#ffffff'}
                  onChange={(e) => patchNodeData(selectedNode.id, { bgColor: e.target.value })}
                  className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <span className="text-xs text-gray-400">Fill color</span>
              </div>
            )}
          </div>

          {/* Layer order */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Layer order</label>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  const all = getNodes()
                  const maxZ = Math.max(0, ...all.map(n => (n.zIndex ?? 0) as number))
                  setNodes(all.map(n => n.id === selectedNode.id ? {...n, zIndex: maxZ + 1} : n))
                }}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
                title="Bring to front"
              >
                ↑ Front
              </button>
              <button
                onClick={() => {
                  const all = getNodes()
                  const minZ = Math.min(0, ...all.map(n => (n.zIndex ?? 0) as number))
                  setNodes(all.map(n => n.id === selectedNode.id ? {...n, zIndex: minZ - 1} : n))
                }}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
                title="Send to back"
              >
                ↓ Back
              </button>
            </div>
          </div>

          {/* Duplicate */}
          <button
            onClick={() => {
              const newNode = {
                ...selectedNode,
                id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                position: { x: selectedNode.position.x + 30, y: selectedNode.position.y + 30 },
                selected: false,
              }
              setNodes((nds) => [...nds, newNode])
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs border border-gray-200 rounded-md py-1.5 bg-white hover:bg-gray-50 transition-colors"
          >
            ⧉ Duplicate
          </button>

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

  // ── Edge selected ──────────────────────────────────────────────────────────
  const edgeData = (selectedEdge!.data ?? {}) as { edgeStyle?: EdgeStyle; label?: string; strokeColor?: string; strokeWidth?: number }
  const currentStyle: EdgeStyle = edgeData.edgeStyle ?? 'arrow'

  return (
    <aside className="w-52 min-w-[13rem] border-l border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
      <div className="p-4 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Edge</h2>

        {/* Edge style selector */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Connection style</label>
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
                  className={`text-[10px] mt-0.5 ${currentStyle === value ? 'text-blue-100' : 'text-gray-400'}`}
                >
                  {description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Label field */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
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
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
            className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Stroke color */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Line color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={edgeData.strokeColor || '#64748b'}
              onChange={(e) => setEdges(edges => edges.map(ed =>
                ed.id === selectedEdge!.id ? {...ed, data: {...(ed.data ?? {}), strokeColor: e.target.value}} : ed
              ))}
              className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
            />
            <button
              onClick={() => setEdges(edges => edges.map(ed =>
                ed.id === selectedEdge!.id ? {...ed, data: {...(ed.data ?? {}), strokeColor: undefined}} : ed
              ))}
              className="text-[10px] text-gray-400 hover:text-gray-600"
            >reset</button>
          </div>
        </div>

        {/* Stroke width */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Line thickness</label>
          <div className="flex gap-1">
            {[1, 1.5, 2, 3, 4].map(w => (
              <button
                key={w}
                onClick={() => setEdges(edges => edges.map(ed =>
                  ed.id === selectedEdge!.id ? {...ed, data: {...(ed.data ?? {}), strokeWidth: w}} : ed
                ))}
                className={`flex-1 py-1 text-[10px] rounded border transition-colors ${
                  (edgeData.strokeWidth ?? 2) === w
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >{w}px</button>
            ))}
          </div>
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
