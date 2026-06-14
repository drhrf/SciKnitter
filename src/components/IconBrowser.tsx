import { useMemo, useState } from 'react'
import { AlertCircle, ExternalLink, FolderOpen, Loader2, RotateCcw, Search, X } from 'lucide-react'
import { useIconSearch } from '../hooks/useIconSearch'
import { getAllIcons, getCategories } from '../data/iconsIndex'
import { ExternalIconSearch } from './ExternalIconSearch'
import { clearBioartCache, fetchBioartIndex, type BioartIcon } from '../services/bioartIcons'
import type { Icon } from '../types'

type Tab = 'library' | 'servier' | 'nihbioart'

interface IconBrowserProps {
  onAddIcon: (icon: Icon) => void
}

// ── Library tab ────────────────────────────────────────────────────────────

function LibraryTab({ onAddIcon }: IconBrowserProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const allIcons = getAllIcons()
  const categories = ['All', ...getCategories()]
  const filtered = useIconSearch(allIcons, query, selectedCategory)

  function handleDragStart(e: React.DragEvent, icon: Icon) {
    e.dataTransfer.setData('application/sciknitter', JSON.stringify(icon))
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search */}
      <div className="px-3 pt-2 pb-1 border-b border-gray-200 space-y-1.5">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons…"
            className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Icon grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-8">No icons match your search.</p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((icon) => (
              <div
                key={icon.id}
                draggable
                onDragStart={(e) => handleDragStart(e, icon)}
                onClick={() => onAddIcon(icon)}
                title={`${icon.name}\nDrag to canvas or click to add`}
                className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 cursor-grab hover:border-blue-400 hover:shadow-sm transition-all group select-none"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: icon.svgContent }}
                />
                <span className="mt-1 text-[10px] text-center text-gray-600 leading-tight line-clamp-2 group-hover:text-blue-600">
                  {icon.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-1.5 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">Drag to canvas or click to add</p>
      </div>
    </div>
  )
}

// ── NIH Bioart tab ────────────────────────────────────────────────────────

type BioartLoadState = 'idle' | 'loading' | 'empty' | 'ready' | 'error'

function NIHBioartTab(_: IconBrowserProps) {
  const [loadState, setLoadState] = useState<BioartLoadState>('idle')
  const [icons, setIcons] = useState<BioartIcon[]>([])
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  async function handleLoad(forceRefresh = false) {
    if (forceRefresh) clearBioartCache()
    setLoadState('loading')
    setError('')
    try {
      const result = await fetchBioartIndex()
      setIcons(result)
      setLoadState('ready')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      if (msg.includes('No bioart icons')) {
        setLoadState('empty')
      } else {
        setError(msg)
        setLoadState('error')
      }
    }
  }

  const categories = useMemo(() => {
    if (!icons.length) return ['All']
    const cats = [...new Set(icons.map((i) => i.category))].sort()
    return ['All', ...cats]
  }, [icons])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return icons
      .filter((i) => {
        if (selectedCat !== 'All' && i.category !== selectedCat) return false
        if (!q) return true
        return i.name.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q))
      })
      .slice(0, 120)
  }, [icons, query, selectedCat])

  function openOnNIH(icon: BioartIcon) {
    // Derive the numeric bioart ID from the download URL
    const bioartId = icon.download_url.match(/\/api\/bioarts\/(\d+)\//)?.[1]
    const url = bioartId
      ? `https://bioart.niaid.nih.gov/bioart/${bioartId}`
      : icon.download_url
    window.open(url, '_blank', 'noopener')
  }

  // ── Idle / Error ───────────────────────────────────────────────────────
  if (loadState === 'idle' || loadState === 'error') {
    return (
      <div className="flex flex-col items-center px-4 py-8 gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-green-400" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">NIH Bioart</p>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Local bioart icons served from{' '}
            <span className="font-medium text-gray-500">public/bioart-icons/</span>.
          </p>
        </div>

        {error && (
          <div className="w-full flex items-start gap-2 text-[10px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-left">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={() => handleLoad(false)}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          {error ? 'Retry' : 'Load NIH Bioart Icons'}
        </button>
      </div>
    )
  }

  // ── Empty manifest ─────────────────────────────────────────────────────
  if (loadState === 'empty') {
    return (
      <div className="flex flex-col items-center px-4 py-8 gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-xs font-medium text-gray-700">No icons found</p>
        <p className="text-[10px] text-gray-500 leading-relaxed text-left bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          To add NIH Bioart icons:
          <br />
          1. Copy SVG files to <span className="font-mono text-gray-700">public/bioart-icons/</span>
          <br />
          2. Update <span className="font-mono text-gray-700">public/bioart-icons/manifest.json</span> with entries:
          <br />
          <span className="font-mono text-[9px] text-gray-600">
            {`{"icons":[{"id":"bioart:B001","name":"Cell","category":"Cell Biology","tags":[],"path":"/bioart-icons/B001.svg"}]}`}
          </span>
        </p>
        <button
          onClick={() => handleLoad(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 text-green-400 animate-spin" />
        <p className="text-xs text-gray-400">Loading bioart icons…</p>
      </div>
    )
  }

  // ── Ready ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search + refresh */}
      <div className="px-3 pt-2 pb-1 space-y-1.5 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${icons.length.toLocaleString()} icons…`}
            className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={() => handleLoad(true)}
            title="Refresh icon index"
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                selectedCat === cat
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {!query && (
          <p className="text-[9px] text-gray-300 text-center">
            Showing first 120 · search to filter
          </p>
        )}
      </div>

      {/* How-to banner */}
      <div className="mx-2 mb-1 px-2.5 py-2 bg-green-50 border border-green-100 rounded-lg text-[9px] text-green-700 leading-relaxed">
        <span className="font-medium">How to use:</span> Click an icon below to open it on the NIH Bioart website → download the SVG → <span className="font-medium">drag the SVG file onto the canvas</span>.
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-8">
            No icons match "{query}"
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((icon) => {
              const initials = icon.name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
              return (
                <div
                  key={icon.id}
                  onClick={() => openOnNIH(icon)}
                  className="relative flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-400 hover:shadow-sm transition-all group select-none"
                  title={`${icon.name} — ${icon.category}\nClick to open on NIH Bioart website`}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-md bg-green-50 text-green-700 font-semibold text-sm">
                    {initials || '?'}
                  </div>
                  <span className="mt-1 text-[10px] text-center text-gray-600 leading-tight line-clamp-2 group-hover:text-green-600">
                    {icon.name}
                  </span>
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3 h-3 text-green-400" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-gray-100 text-center">
        <p className="text-[9px] text-gray-400">
          Click → open NIH page → download SVG → drag to canvas
        </p>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'library', label: 'Library' },
  { id: 'servier', label: 'Servier' },
  { id: 'nihbioart', label: 'NIH Bioart' },
]

export function IconBrowser({ onAddIcon }: IconBrowserProps) {
  const [activeTab, setActiveTab] = useState<Tab>('library')

  return (
    <aside className="flex flex-col w-64 min-w-[16rem] border-r border-gray-200 bg-gray-50 h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
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
            <line x1="29" y1="22" x2="51" y2="22" stroke="#6b7280" strokeWidth="1.5" />
            <line x1="33" y1="58" x2="47" y2="58" stroke="#6b7280" strokeWidth="1.5" />
          </svg>
          <span className="font-semibold text-gray-800 text-sm tracking-tight">Icon Library</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-[10px] font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'library' && <LibraryTab onAddIcon={onAddIcon} />}
        {activeTab === 'servier' && <ExternalIconSearch onAddIcon={onAddIcon} />}
        {activeTab === 'nihbioart' && <NIHBioartTab onAddIcon={onAddIcon} />}
      </div>
    </aside>
  )
}
