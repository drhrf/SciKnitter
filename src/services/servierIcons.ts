/**
 * Fetches the Servier Medical Art icon tree from the holtzy/servier
 * GitHub repository and caches it in localStorage for 48 hours.
 *
 * SVG thumbnails are served directly from raw.githubusercontent.com
 * (which supports CORS GET requests). Full SVG content is fetched
 * on-demand when the user adds an icon to the canvas.
 */

const OWNER = 'holtzy'
const REPO = 'servier'
const CACHE_KEY = 'sciknitter:servier:v1'
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
  branch: string
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

function pathToIcon(path: string, branch: string): ServierIcon {
  const noExt = path.replace(/\.svg$/i, '')
  const parts = noExt.split('/')
  const filename = parts[parts.length - 1] ?? 'icon'
  const folder = parts.length > 1 ? parts[parts.length - 2] : 'Uncategorized'

  const tags = [
    ...filename.toLowerCase().split(/[_\-\s]+/),
    ...folder.toLowerCase().split(/[_\-\s]+/),
  ].filter((t) => t.length > 1)

  return {
    id: `servier:${noExt.replace(/\//g, ':')}`,
    name: prettify(filename),
    category: prettify(folder),
    tags: [...new Set(tags)],
    path,
    branch,
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

async function treeForBranch(
  branch: string,
): Promise<Array<{ type: string; path: string }> | null> {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${branch}?recursive=1`
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (res.status === 404) return null
  if (res.status === 403) {
    const reset = res.headers.get('X-RateLimit-Reset')
    const time = reset
      ? new Date(Number(reset) * 1000).toLocaleTimeString()
      : 'soon'
    throw new Error(`GitHub API rate limit reached — resets at ${time}.`)
  }
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${res.statusText}`)
  const body: { tree: Array<{ type: string; path: string }> } = await res.json()
  return body.tree
}

export async function fetchServierIndex(): Promise<ServierIcon[]> {
  const cached = readCache()
  if (cached) return cached.icons

  let tree: Array<{ type: string; path: string }> | null = null
  let branch = 'master'

  tree = await treeForBranch('master')
  if (!tree) {
    branch = 'main'
    tree = await treeForBranch('main')
  }
  if (!tree) {
    throw new Error(
      'Repository "holtzy/servier" not found on GitHub. The Servier icon source may have moved.',
    )
  }

  const icons = tree
    .filter((f) => f.type === 'blob' && /\.svg$/i.test(f.path))
    .map((f) => pathToIcon(f.path, branch))

  if (icons.length === 0) {
    throw new Error('No SVG files found in the repository.')
  }

  writeCache({ icons, branch, cachedAt: Date.now() })
  return icons
}

export async function fetchServierSvg(icon: ServierIcon): Promise<string> {
  const res = await fetch(servierRawUrl(icon))
  if (!res.ok) throw new Error(`Failed to load icon: ${res.status}`)
  return res.text()
}
