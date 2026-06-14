import { useEffect, useMemo, useState } from 'react'
import { Loader2, RotateCcw, Search, X } from 'lucide-react'
import { useIconSearch } from '../hooks/useIconSearch'
import { getAllIcons, getCategories } from '../data/iconsIndex'
import { clearBioartCache, fetchBioartIndex, fetchBioartSvg, type BioartIcon } from '../services/bioartIcons'
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
  const [icons, setIcons] = useState<BioartIcon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState<string | null>(null)

  useEffect(() => {
    fetchBioartIndex()
      .then(setIcons)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return icons
    return icons.filter(
      (i) => i.name.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q)),
    )
  }, [icons, query])

  async function handleAdd(icon: BioartIcon) {
    if (adding) return
    setAdding(icon.id)
    try {
      const svgContent = await fetchBioartSvg(icon)
      const fullIcon: Icon = {
        id: icon.id,
        name: icon.name,
        category: icon.category,
        tags: icon.tags,
        source: 'bioart',
        svgContent,
      }
      onAddIcon(fullIcon)
    } catch {
      // silently fail
    } finally {
      setAdding(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 text-green-400 animate-spin" />
        <p className="text-xs text-gray-400">Loading {'…'}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center px-4 py-8 gap-3 text-center">
        <p className="text-xs text-red-500">{error}</p>
        <button
          onClick={() => { setError(''); setLoading(true); fetchBioartIndex().then(setIcons).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 pt-2 pb-1 border-b border-gray-200 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${icons.length.toLocaleString()} icons…`}
              className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => { clearBioartCache(); setLoading(true); fetchBioartIndex().then(setIcons).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
            title="Refresh"
            className="p-1.5 text-gray-400 hover:text-gray-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-8">No icons match your search.</p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((icon) => (
              <button
                key={icon.id}
                onClick={() => handleAdd(icon)}
                disabled={!!adding}
                title={`${icon.name}\nClick to add to canvas`}
                className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-sm transition-all group select-none disabled:opacity-60"
              >
                {adding === icon.id ? (
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                  </div>
                ) : (
                  <img
                    src={`${import.meta.env.BASE_URL}bioart-icons/${icon.path}`}
                    className="w-12 h-12 object-contain"
                    loading="lazy"
                    alt={icon.name}
                  />
                )}
                <span className="mt-1 text-[10px] text-center text-gray-600 leading-tight line-clamp-2 group-hover:text-green-600">
                  {icon.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-1.5 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">Click to add to canvas</p>
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
