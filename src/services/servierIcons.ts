/**
 * Fetches Servier Medical Art icons from the duerrsimon/bioicons
 * GitHub repository and caches the index in localStorage for 48 hours.
 *
 * Icons live at:
 *   static/icons/cc-by-3.0/<Category>/Servier/<name>.svg
 *
 * SVG thumbnails are served directly from raw.githubusercontent.com
 * (CORS-enabled). Full SVG content is fetched on-demand when the
 * user adds an icon to the canvas.
 *
 * The underlying repo tree fetch is shared with bioiconsIcons.ts (the rest
 * of the same repo, minus this Servier slice) via fetchBioiconsTree, so
 * opening both tabs costs one GitHub API call, not two.
 */

import { fetchBioiconsTree } from './bioiconsIcons'

const OWNER = 'duerrsimon'
const REPO = 'bioicons'
const BRANCH = 'main'
const SERVIER_PREFIX = 'static/icons/cc-by-3.0/'
const CACHE_KEY = 'sciknitter:servier:v2'
const CACHE_TTL_MS = 48 * 60 * 60 * 1000 // 48 hours

export interface ServierIcon {
  id: string
  name: string
  category: string
  tags: string[]
  path: string
  branch: string
}

interface CacheData {
  icons: ServierIcon[]
  cachedAt: number
}

export function servierRawUrl(icon: ServierIcon): string {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${icon.branch}/${icon.path}`
}

function prettify(s: string): string {
  return s
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

/**
 * Path format: static/icons/cc-by-3.0/<Category>/Servier/<filename>.svg
 * parts[0]=static  [1]=icons  [2]=cc-by-3.0  [3]=Category  [4]=Servier  [5]=filename
 */
function pathToIcon(path: string): ServierIcon {
  const noExt = path.replace(/\.svg$/i, '')
  const parts = noExt.split('/')
  const filename = parts[parts.length - 1] ?? 'icon'
  // Category is two levels up from the filename (one above "Servier")
  const category = parts.length >= 4 ? parts[parts.length - 3] : 'Uncategorized'

  const tags = [
    ...filename.toLowerCase().split(/[_\-\s]+/),
    ...category.toLowerCase().split(/[_\-\s]+/),
  ].filter((t) => t.length > 1)

  return {
    id: `servier:${noExt.replace(/\//g, ':')}`,
    name: prettify(filename),
    category: prettify(category.replace(/_/g, ' ')),
    tags: [...new Set(tags)],
    path,
    branch: BRANCH,
  }
}

function readCache(): CacheData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data: CacheData = JSON.parse(raw)
    if (Date.now() - data.cachedAt > CACHE_TTL_MS) return null
    return data
  } catch {
    return null
  }
}

function writeCache(data: CacheData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // Storage full — skip caching silently
  }
}

export function clearServierCache() {
  localStorage.removeItem(CACHE_KEY)
}

export async function fetchServierIndex(): Promise<ServierIcon[]> {
  const cached = readCache()
  if (cached) return cached.icons

  const tree = await fetchBioiconsTree()
  const icons = tree
    .filter((f) => f.path.startsWith(SERVIER_PREFIX) && f.path.includes('/Servier/'))
    .map((f) => pathToIcon(f.path))

  if (icons.length === 0) {
    throw new Error('No Servier SVG files found in the repository.')
  }

  writeCache({ icons, cachedAt: Date.now() })
  return icons
}

export async function fetchServierSvg(icon: ServierIcon): Promise<string> {
  const res = await fetch(servierRawUrl(icon))
  if (!res.ok) throw new Error(`Failed to load icon: ${res.status}`)
  return res.text()
}

/** Looks up a Servier icon by id from the localStorage cache and fetches its SVG. */
export async function fetchServierSvgById(
  iconId: string,
): Promise<{ svgContent: string; category: string } | null> {
  if (!iconId.startsWith('servier:')) return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { icons: ServierIcon[] }
    if (!Array.isArray(data?.icons)) return null
    const icon = data.icons.find((i) => i.id === iconId)
    if (!icon) return null
    const svgContent = await fetchServierSvg(icon)
    return { svgContent, category: icon.category }
  } catch {
    return null
  }
}
