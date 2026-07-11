import type { Icon } from '../types'

const FAVORITES_KEY = 'sciknitter:favorites:v1'
const RECENTS_KEY = 'sciknitter:recents:v1'
const RECENTS_LIMIT = 24

// Favorites/recents are stored as full Icon objects (not just ids) so a
// BioArt/Servier icon someone starred stays usable offline without
// re-fetching its SVG from the network or an icon index that may have
// changed shape since.

function readIcons(key: string): Icon[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeIcons(key: string, icons: Icon[]) {
  try {
    localStorage.setItem(key, JSON.stringify(icons))
  } catch {
    /* storage full/unavailable — preferences are best-effort */
  }
}

export function getFavorites(): Icon[] {
  return readIcons(FAVORITES_KEY)
}

export function isFavorite(iconId: string): boolean {
  return getFavorites().some((i) => i.id === iconId)
}

export function toggleFavorite(icon: Icon): Icon[] {
  const current = getFavorites()
  const next = current.some((i) => i.id === icon.id)
    ? current.filter((i) => i.id !== icon.id)
    : [...current, icon]
  writeIcons(FAVORITES_KEY, next)
  return next
}

export function getRecents(): Icon[] {
  return readIcons(RECENTS_KEY)
}

export function addRecent(icon: Icon): Icon[] {
  const current = getRecents().filter((i) => i.id !== icon.id)
  const next = [icon, ...current].slice(0, RECENTS_LIMIT)
  writeIcons(RECENTS_KEY, next)
  return next
}
