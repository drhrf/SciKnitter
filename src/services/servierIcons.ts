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
 */

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

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })

  if (res.status === 404) {
    throw new Error(`Repository "${OWNER}/${REPO}" not found on GitHub.`)
  }
  if (res.status === 403) {
    const reset = res.headers.get('X-RateLimit-Reset')
    const time = reset
      ? new Date(Number(reset) * 1000).toLocaleTimeString()
      : 'soon'
    throw new Error(`GitHub API rate limit reached — resets at ${time}.`)
  }
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${res.statusText}`)
  }

  const body: { tree: Array<{ type: string; path: string }> } = await res.json()

  const icons = body.tree
    .filter(
      (f) =>
        f.type === 'blob' &&
        f.path.startsWith(SERVIER_PREFIX) &&
        f.path.includes('/Servier/') &&
        /\.svg$/i.test(f.path),
    )
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
