import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
} from 'lucide-react'
import {
  bioiconsRawUrl,
  clearBioiconsCache,
  fetchBioiconsIndex,
  fetchBioiconsSvg,
  type BioiconsIcon,
} from '../services/bioiconsIcons'
import type { Icon } from '../types'

interface BioiconsSearchProps {
  onAddIcon: (icon: Icon) => void
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

const CATEGORIES = ['All'] as const

// A short, human-readable license label for the card tooltip/footer —
// bioicons.com's folder names ("cc-by-4.0") aren't quite presentable.
function licenseLabel(license: string): string {
  if (license === 'cc-0') return 'CC0 (public domain)'
  if (license === 'cc-by-3.0') return 'CC BY 3.0'
  if (license === 'cc-by-4.0') return 'CC BY 4.0'
  if (license === 'mit') return 'MIT'
  if (license === 'bsd') return 'BSD'
  return license
}

export function BioiconsSearch({ onAddIcon }: BioiconsSearchProps) {
  const [loadState, setLoadState] = useState<LoadState>('idle')
  const [icons, setIcons] = useState<BioiconsIcon[]>([])
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  const [addingId, setAddingId] = useState<string | null>(null)

  async function handleLoad(forceRefresh = false) {
    if (forceRefresh) clearBioiconsCache()
    setLoadState('loading')
    setError('')
    try {
      const result = await fetchBioiconsIndex()
      setIcons(result)
      setLoadState('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoadState('error')
    }
  }

  const categories = useMemo(() => {
    if (!icons.length) return CATEGORIES
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

  async function handleAdd(icon: BioiconsIcon) {
    if (addingId) return
    setAddingId(icon.id)
    try {
      const svgContent = await fetchBioiconsSvg(icon)
      const internalIcon: Icon = {
        id: icon.id,
        name: icon.name,
        category: `Bioicons · ${icon.category}`,
        tags: icon.tags,
        source: 'bioicons',
        svgContent,
        attribution: icon.requiresAttribution
          ? { author: icon.author, license: licenseLabel(icon.license) }
          : undefined,
      }
      onAddIcon(internalIcon)
    } catch {
      // silently ignore — the card will stop spinning
    } finally {
      setAddingId(null)
    }
  }

  // ── Idle / Error ───────────────────────────────────────────────────────
  if (loadState === 'idle' || loadState === 'error') {
    return (
      <div className="flex flex-col items-center px-4 py-8 gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
          <ExternalLink className="w-5 h-5 text-teal-400" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Bioicons</p>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            ~1,400 open science icons under CC0, CC BY, MIT, or BSD.
            <br />
            Share-alike (CC BY-SA) icons are excluded.
            <br />
            The index is cached locally for 48 hours.
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
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white text-xs font-medium rounded-lg hover:bg-teal-600 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {error ? 'Retry' : 'Load Bioicons'}
        </button>

        <p className="text-[10px] text-gray-400">
          Icons from{' '}
          <span className="font-medium text-gray-500">bioicons.com</span>
        </p>
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 text-teal-400 animate-spin" />
        <p className="text-xs text-gray-400">Fetching icon index from GitHub…</p>
        <p className="text-[10px] text-gray-300">Cached for 48 h after first load</p>
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
            className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={() => handleLoad(true)}
            title="Refresh index from GitHub"
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
                  ? 'bg-teal-500 text-white'
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

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-8">
            No icons match "{query}"
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((icon) => {
              const isAdding = addingId === icon.id
              return (
                <div
                  key={icon.id}
                  onClick={() => handleAdd(icon)}
                  className={`relative flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 transition-all group select-none ${
                    isAdding
                      ? 'opacity-60 cursor-wait'
                      : 'cursor-pointer hover:border-teal-400 hover:shadow-sm'
                  }`}
                  title={`${icon.name} — ${icon.category}\n${licenseLabel(icon.license)} · ${icon.author}\nClick to add to canvas`}
                >
                  {isAdding ? (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={bioiconsRawUrl(icon.path, icon.branch)}
                      alt={icon.name}
                      className="w-12 h-12 object-contain"
                      loading="lazy"
                    />
                  )}
                  <span className="mt-1 text-[10px] text-center text-gray-600 leading-tight line-clamp-2 group-hover:text-teal-600">
                    {icon.name}
                  </span>
                  {icon.requiresAttribution && (
                    <span className="text-[8px] text-amber-500 leading-tight">© credit</span>
                  )}

                  {/* Add indicator */}
                  {!isAdding && (
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                        <Plus className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-gray-100 text-center">
        <p className="text-[9px] text-gray-300">
          Bioicons · CC0 / CC BY / MIT / BSD · © marks a required credit
        </p>
      </div>
    </div>
  )
}
