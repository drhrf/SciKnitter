import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import {
  Download,
  FileImage,
  FileJson,
  FolderOpen,
  Grid3X3,
  Hand,
  LayoutGrid,
  LayoutTemplate,
  MousePointer2,
  Redo2,
  Trash2,
  Type,
  Undo2,
  Wand2,
} from 'lucide-react'
import { IconBrowser } from './components/IconBrowser'
import { DiagramCanvas, type DiagramCanvasHandle } from './components/DiagramCanvas'
import { PropertiesPanel } from './components/PropertiesPanel'
import { LLMWorkflowPanel } from './components/LLMWorkflowPanel'
import { TEMPLATES, type Template } from './data/templates'
import { parseDiagramSpec } from './utils/diagram'
import { downloadFile, exportToSvg, exportToPng } from './utils/exportSvg'
import type { DiagramExport, Icon } from './types'

function slugify(s: string) {
  return s.trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'diagram'
}

function bgColorForExport(exportBg: 'canvas' | 'white' | 'transparent'): string {
  if (exportBg === 'white') return '#ffffff'
  if (exportBg === 'transparent') return 'none'
  return '#f8fafc'
}

export function App() {
  const canvasRef = useRef<DiagramCanvasHandle>(null)
  const loadFileRef = useRef<HTMLInputElement>(null)
  const panelLetterRef = useRef(0)

  const [snapToGrid, setSnapToGrid] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [showLLMPanel, setShowLLMPanel] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [diagramTitle, setDiagramTitle] = useState('Untitled Diagram')
  const [pngScale, setPngScale] = useState(2)
  const [exportBg, setExportBg] = useState<'canvas' | 'white' | 'transparent'>('white')

  // Keyboard shortcuts: V = select, H/Escape = pan, Ctrl+Z = undo, Ctrl+Y/Ctrl+Shift+Z = redo,
  // Ctrl+C = copy, Ctrl+V = paste, Ctrl+D = duplicate
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'v' || e.key === 'V') setIsSelecting(true)
      if (e.key === 'h' || e.key === 'H' || e.key === 'Escape') setIsSelecting(false)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); canvasRef.current?.undo()
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault(); canvasRef.current?.redo()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        canvasRef.current?.copySelected()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault(); canvasRef.current?.paste()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault(); canvasRef.current?.duplicateSelected()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Export / Save / Load ───────────────────────────────────────────────

  function handleExportSvg() {
    const spec = canvasRef.current?.getSpec(diagramTitle)
    if (!spec) return
    downloadFile(exportToSvg(spec, bgColorForExport(exportBg)), `${slugify(diagramTitle)}.svg`, 'image/svg+xml')
  }

  async function handleExportPng() {
    const spec = canvasRef.current?.getSpec(diagramTitle)
    if (!spec) return
    await exportToPng(exportToSvg(spec, bgColorForExport(exportBg)), `${slugify(diagramTitle)}.png`, pngScale)
  }

  function handleSaveJson() {
    const spec = canvasRef.current?.getSpec(diagramTitle)
    if (!spec) return
    downloadFile(JSON.stringify(spec, null, 2), `${slugify(diagramTitle)}.json`, 'application/json')
  }

  function handleLoadSpec(spec: DiagramExport) {
    canvasRef.current?.loadSpec(spec)
    if (spec.title) setDiagramTitle(spec.title)
  }

  function handleLoadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const spec = parseDiagramSpec(ev.target?.result as string)
        handleLoadSpec(spec)
      } catch (err) {
        alert(`Could not load file: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleClearCanvas() {
    if (!window.confirm('Clear the entire canvas? This cannot be undone.')) return
    canvasRef.current?.clearAll()
  }

  function handleLoadTemplate(t: Template) {
    handleLoadSpec(t.spec)
    setShowTemplates(false)
  }

  const handleAddIcon = useCallback((icon: Icon) => {
    window.dispatchEvent(new CustomEvent('sciknitter:addicon', { detail: icon }))
  }, [])

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="h-12 border-b border-gray-200 bg-white flex items-center gap-2 px-3 shrink-0">
        {/* Logo + editable title */}
        <div className="flex items-center gap-2 mr-1 shrink-0">
          <svg viewBox="0 0 80 80" className="w-5 h-5 shrink-0" aria-hidden="true">
            <path
              d="M25 5 C45 13 35 27 25 35 C15 43 25 57 45 65 C55 69 55 75 55 75"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M55 5 C35 13 45 27 55 35 C65 43 55 57 35 65 C25 69 25 75 25 75"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line x1="30" y1="22" x2="50" y2="22" stroke="#6b7280" strokeWidth="1.5" />
            <line x1="30" y1="58" x2="50" y2="58" stroke="#6b7280" strokeWidth="1.5" />
          </svg>
          <input
            type="text"
            value={diagramTitle}
            onChange={(e) => setDiagramTitle(e.target.value)}
            className="text-sm font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none px-0.5 py-0 w-44 truncate"
            title="Click to rename"
          />
        </div>

        <div className="h-5 w-px bg-gray-200" />

        {/* Mode toggle: Pan / Select */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setIsSelecting(false)}
            title="Pan mode (H)"
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors ${
              !isSelecting
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pan</span>
          </button>
          <button
            onClick={() => setIsSelecting(true)}
            title="Select mode — drag to rubber-band select (V)"
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors ${
              isSelecting
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Select</span>
          </button>
        </div>

        <div className="h-5 w-px bg-gray-200" />

        {/* Undo / Redo */}
        <button onClick={() => canvasRef.current?.undo()} title="Undo (Cmd+Z)"
          className="flex items-center gap-1 px-2 py-1.5 text-xs rounded-md bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors">
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => canvasRef.current?.redo()} title="Redo (Cmd+Shift+Z)"
          className="flex items-center gap-1 px-2 py-1.5 text-xs rounded-md bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors">
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        {/* Spread layout */}
        <button
          onClick={() => canvasRef.current?.autoLayout()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
          title="Remove overlapping nodes"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Spread</span>
        </button>

        <div className="h-5 w-px bg-gray-200" />

        {/* LLM Workflow */}
        <button
          onClick={() => setShowLLMPanel(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LLM Workflow</span>
          <span className="sm:hidden">LLM</span>
        </button>

        {/* Add Text */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('sciknitter:addtext'))}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
          title="Add a text box"
        >
          <Type className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Text</span>
        </button>

        {/* Panel label */}
        <button
          onClick={() => {
            const letter = String.fromCharCode(65 + (panelLetterRef.current % 26))
            panelLetterRef.current++
            window.dispatchEvent(new CustomEvent('sciknitter:addpanellabel', { detail: { letter } }))
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
          title="Add panel label (A, B, C…)"
        >
          <span className="text-xs font-bold">A</span>
          <span className="hidden sm:inline">Label</span>
        </button>

        {/* Templates */}
        <div className="relative">
          <button
            onClick={() => setShowTemplates((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Templates</span>
          </button>
          {showTemplates && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowTemplates(false)} />
              <div className="absolute left-0 top-full mt-1 z-30 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 w-64">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleLoadTemplate(t)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-xs font-medium text-gray-800">{t.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{t.description}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex-1" />

        {/* Snap */}
        <button
          onClick={() => setSnapToGrid((v) => !v)}
          title={snapToGrid ? 'Snap to grid: ON' : 'Snap to grid: OFF'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
            snapToGrid
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Snap</span>
        </button>

        <div className="h-5 w-px bg-gray-200" />

        {/* Export background toggle */}
        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden text-[10px]">
          {(['white', 'transparent'] as const).map(bg => (
            <button
              key={bg}
              onClick={() => setExportBg(bg)}
              className={`px-2 py-1.5 transition-colors ${exportBg === bg ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              title={`Export background: ${bg}`}
            >
              {bg === 'white' ? '□ White' : '⊘ None'}
            </button>
          ))}
        </div>

        {/* Export SVG */}
        <button
          onClick={handleExportSvg}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
          title="Export as SVG"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export SVG</span>
        </button>

        {/* Export PNG with resolution picker */}
        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
          <button
            onClick={handleExportPng}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            title={`Export as PNG (${pngScale}×)`}
          >
            <FileImage className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PNG</span>
          </button>
          <select
            value={pngScale}
            onChange={(e) => setPngScale(Number(e.target.value))}
            className="text-[10px] bg-gray-50 text-gray-600 border-l border-gray-200 pr-1 pl-0.5 py-1.5 focus:outline-none cursor-pointer"
            title="PNG resolution"
          >
            <option value={2}>2× screen</option>
            <option value={4}>4× print</option>
            <option value={8}>8× hi-res</option>
          </select>
        </div>

        {/* Save JSON */}
        <button
          onClick={handleSaveJson}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
          title="Save diagram as JSON"
        >
          <FileJson className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Save</span>
        </button>

        {/* Load JSON */}
        <button
          onClick={() => loadFileRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
          title="Load diagram from JSON"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Load</span>
        </button>

        {/* Clear */}
        <button
          onClick={handleClearCanvas}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
          title="Clear entire canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Clear</span>
        </button>
      </header>

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          <IconBrowser onAddIcon={handleAddIcon} />
          <DiagramCanvas
            ref={canvasRef}
            snapToGrid={snapToGrid}
            isSelecting={isSelecting}
          />
          <PropertiesPanel />
        </ReactFlowProvider>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".json,application/json"
        ref={loadFileRef}
        className="hidden"
        onChange={handleLoadFile}
      />

      {/* LLM Workflow modal */}
      {showLLMPanel && (
        <LLMWorkflowPanel
          onClose={() => setShowLLMPanel(false)}
          onLoad={handleLoadSpec}
        />
      )}
    </div>
  )
}
