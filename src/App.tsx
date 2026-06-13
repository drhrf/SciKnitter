import { useState, useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Download, Sparkles } from 'lucide-react'
import { IconBrowser } from './components/IconBrowser'
import { DiagramCanvas } from './components/DiagramCanvas'
import { PropertiesPanel } from './components/PropertiesPanel'
import type { Icon } from './types'

function Topbar() {
  return (
    <header className="h-12 border-b border-gray-200 bg-white flex items-center gap-3 px-4 shrink-0">
      <div className="flex items-center gap-2 mr-2">
        <span className="font-bold text-gray-800 tracking-tight">SciKnitter</span>
        <span className="text-xs text-gray-400 hidden sm:inline">Scientific Diagram Editor</span>
      </div>

      <div className="h-5 w-px bg-gray-200" />

      {/* Coming-soon LLM button */}
      <button
        disabled
        title="LLM diagram generation — coming soon!"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-purple-50 text-purple-300 border border-purple-100 cursor-not-allowed"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Generate with AI
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-400 text-[9px] font-bold uppercase tracking-wide">
          Soon
        </span>
      </button>

      <div className="flex-1" />

      <button
        title="Export SVG (coming soon)"
        disabled
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-400 border border-gray-200 cursor-not-allowed"
      >
        <Download className="w-3.5 h-3.5" />
        Export SVG
      </button>
    </header>
  )
}

export function App() {
  const [pendingIcon, setPendingIcon] = useState<Icon | null>(null)

  const handleAddIcon = useCallback((icon: Icon) => {
    // Dispatch custom event for the canvas to add the icon at a random position
    window.dispatchEvent(new CustomEvent('sciknitter:addicon', { detail: icon }))
  }, [])

  const handleIconPlaced = useCallback(() => {
    setPendingIcon(null)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          <IconBrowser onAddIcon={handleAddIcon} />
          <DiagramCanvas
            pendingIcon={pendingIcon}
            onIconPlaced={handleIconPlaced}
          />
          <PropertiesPanel />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
