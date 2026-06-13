import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import {
  Download,
  FileJson,
  FolderOpen,
  Grid3X3,
  Hand,
  LayoutTemplate,
  MousePointer2,
  Trash2,
  Wand2,
} from 'lucide-react'
import { IconBrowser } from './components/IconBrowser'
import { DiagramCanvas, type DiagramCanvasHandle } from './components/DiagramCanvas'
import { PropertiesPanel } from './components/PropertiesPanel'
import { LLMWorkflowPanel } from './components/LLMWorkflowPanel'
import { TEMPLATES, type Template } from './data/templates'
import { parseDiagramSpec } from './utils/diagram'
import { downloadFile, exportToSvg } from './utils/exportSvg'
import type { DiagramExport, Icon } from './types'

function slugify(s: string) {
  return s.trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'diagram'
}

export function App() {
  const canvasRef = useRef<DiagramCanvasHandle>(null)
  const loadFileRef = useRef<HTMLInputElement>(null)

  const [snapToGrid, setSnapToGrid] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [showLLMPanel, setShowLLMPanel] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [diagramTitle, setDiagramTitle] = useState('Untitled Diagram')

  // Keyboard shortcuts: V = select, H/Escape = pan
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'v' || e.key === 'V') setIsSelecting(true)
      if (e.key === 'h' || e.key === 'H' || e.key === 'Escape') setIsSelecting(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Export / Save / Load ───────────────────────────────────────────────

  function handleExportSvg() {
    const spec = canvasRef.current?.getSpec(diagramTitle)
    if (!spec) return
    downloadFile(exportToSvg(spec, diagramTitle), `${slugify(diagramTitle)}.svg`, 'image/svg+xml')
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

        {/* LLM Workflow */}
        <button
          onClick={() => setShowLLMPanel(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LLM Workflow</span>
          <span className="sm:hidden">LLM</span>
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

        {/* Export SVG */}
        <button
          onClick={handleExportSvg}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
          title="Export as SVG"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export SVG</span>
        </button>

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
