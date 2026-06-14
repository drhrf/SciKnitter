import { useMemo, useState } from 'react'
import { FolderOpen, Search, X } from 'lucide-react'
import { useIconSearch } from '../hooks/useIconSearch'
import { getAllIcons, getCategories } from '../data/iconsIndex'
import { getBundledBioartIcons } from '../data/bioartIcons'
import { ExternalIconSearch } from './ExternalIconSearch'
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

function NIHBioartTab({ onAddIcon }: IconBrowserProps) {
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')

  const allIcons = useMemo(() => getBundledBioartIcons(), [])

  const categories = useMemo(() => {
    const cats = [...new Set(allIcons.map((i) => i.category))].sort()
    return ['All', ...cats]
  }, [allIcons])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return allIcons.filter((i) => {
      if (selectedCat !== 'All' && i.category !== selectedCat) return false
      if (!q) return true
      return i.name.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q))
    })
  }, [allIcons, query, selectedCat])

  function handleDragStart(e: React.DragEvent, icon: Icon) {
    e.dataTransfer.setData('application/sciknitter', JSON.stringify(icon))
    e.dataTransfer.effectAllowed = 'copy'
  }

  if (allIcons.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-8 gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-green-400" />
        </div>
        <p className="text-xs font-medium text-gray-700">No icons bundled yet</p>
        <div className="text-[10px] text-gray-500 leading-relaxed text-left bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200 space-y-1.5 w-full">
          <p>Add SVG files to the repo and push — they appear here automatically.</p>
          <p>
            <span className="font-medium text-gray-700">Flat layout</span> (all in one category):
          </p>
          <p className="font-mono text-[9px] text-gray-600 bg-white border border-gray-100 rounded px-2 py-1">
            src/data/bioart/BIOART-000001_Cell.svg
          </p>
          <p>
            <span className="font-medium text-gray-700">By category</span> (use subdirectories):
          </p>
          <p className="font-mono text-[9px] text-gray-600 bg-white border border-gray-100 rounded px-2 py-1">
            src/data/bioart/Cell Biology/BIOART-000001_Cell.svg
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 pt-2 pb-1 border-b border-gray-200 space-y-1.5">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${allIcons.length} icons…`}
            className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
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
      </div>

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
                className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 cursor-grab hover:border-green-400 hover:shadow-sm transition-all group select-none"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: icon.svgContent }}
                />
                <span className="mt-1 text-[10px] text-center text-gray-600 leading-tight line-clamp-2 group-hover:text-green-600">
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
