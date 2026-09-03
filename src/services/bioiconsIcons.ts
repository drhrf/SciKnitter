/**
 * Fetches the broader Bioicons library (bioicons.com / duerrsimon/bioicons)
 * beyond the Servier slice servierIcons.ts already covers: everything under
 * static/icons/ EXCEPT the CC-BY-SA buckets (share-alike is a stricter
 * condition than this app wants to hand a user's exported figure — see
 * fetchBioiconsIndex) and EXCEPT Servier's own cc-by-3.0 contributions
 * (already reachable from the Servier tab; excluded here to avoid the same
 * icon appearing in two tabs).
 *
 * Shares one underlying GitHub tree fetch with servierIcons.ts (see
 * fetchBioiconsTree) so opening both tabs costs one API call, not two —
 * unauthenticated GitHub API requests are rate-limited to 60/hour per IP.
 *
 * Icons live at:
 *   static/icons/<license>/<Category>/<Author>/<name>.svg
 * SVGs are served directly from raw.githubusercontent.com (CORS-enabled).
 */

const OWNER = 'duerrsimon'
const REPO = 'bioicons'
const BRANCH = 'main'
const ICONS_PREFIX = 'static/icons/'
const SHARE_ALIKE_LICENSES = new Set(['cc-by-sa-3.0', 'cc-by-sa-4.0'])

const TREE_CACHE_KEY = 'sciknitter:bioicons-tree:v1'
const TREE_CACHE_TTL_MS = 48 * 60 * 60 * 1000 // 48 hours

const CACHE_KEY = 'sciknitter:bioicons:v1'
const CACHE_TTL_MS = 48 * 60 * 60 * 1000

export interface BioiconsIcon {
  id: string
  name: string
  category: string
  tags: string[]
  path: string
  branch: string
  license: string
  author: string
  /** True for any CC-BY variant — these require attribution when used. */
  requiresAttribution: boolean
}

interface TreeEntry {
  type: string
  path: string
}

interface TreeCacheData {
  entries: TreeEntry[]
  cachedAt: number
}

interface CacheData {
  icons: BioiconsIcon[]
  cachedAt: number
}

export function bioiconsRawUrl(path: string, branch = BRANCH): string {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${branch}/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`
}

function prettify(s: string): string {
  return s
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function readTreeCache(): TreeCacheData | null {
  try {
    const raw = localStorage.getItem(TREE_CACHE_KEY)
    if (!raw) return null
    const data: TreeCacheData = JSON.parse(raw)
    if (Date.now() - data.cachedAt > TREE_CACHE_TTL_MS) return null
    return data
  } catch {
    return null
  }
}

function writeTreeCache(entries: TreeEntry[]) {
  try {
    localStorage.setItem(TREE_CACHE_KEY, JSON.stringify({ entries, cachedAt: Date.now() }))
  } catch {
    // Storage full — skip caching silently
  }
}

/**
 * The one GitHub API call both this module and servierIcons.ts build their
 * icon lists from. Cached independently of either derived list so a Servier
 * cache miss/expiry and a Bioicons cache miss/expiry don't each trigger
 * their own API round trip.
 */
export async function fetchBioiconsTree(): Promise<TreeEntry[]> {
  const cached = readTreeCache()
  if (cached) return cached.entries

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

  const body: { tree: TreeEntry[] } = await res.json()
  const entries = body.tree.filter(
    (f) => f.type === 'blob' && f.path.startsWith(ICONS_PREFIX) && /\.svg$/i.test(f.path),
  )
  if (entries.length === 0) {
    throw new Error('No icon SVG files found in the repository.')
  }

  writeTreeCache(entries)
  return entries
}

/**
 * Path format: static/icons/<license>/<Category>/<Author>/<filename>.svg
 * parts[0]=static [1]=icons [2]=license [3]=Category [4]=Author [5]=filename
 */
function pathToIcon(path: string): BioiconsIcon | null {
  const noExt = path.replace(/\.svg$/i, '')
  const parts = noExt.split('/')
  if (parts.length < 6) return null // not deep enough to have license/category/author/name

  const filename = parts[parts.length - 1]
  const author = parts[parts.length - 2]
  const category = parts[parts.length - 3]
  const license = parts[2]

  const tags = [
    ...filename.toLowerCase().split(/[_\-\s]+/),
    ...category.toLowerCase().split(/[_\-\s]+/),
  ].filter((t) => t.length > 1)

  return {
    id: `bioicons:${noExt.replace(/\//g, ':')}`,
    name: prettify(filename.replace(/_/g, ' ')),
    category: prettify(category.replace(/_/g, ' ')),
    tags: [...new Set(tags)],
    path,
    branch: BRANCH,
    license,
    author,
    requiresAttribution: license.startsWith('cc-by-') && !license.includes('sa'),
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

export function clearBioiconsCache() {
  localStorage.removeItem(CACHE_KEY)
  localStorage.removeItem(TREE_CACHE_KEY)
}

export async function fetchBioiconsIndex(): Promise<BioiconsIcon[]> {
  const cached = readCache()
  if (cached) return cached.icons

  const tree = await fetchBioiconsTree()
  const icons = tree
    .map((f) => pathToIcon(f.path))
    .filter((icon): icon is BioiconsIcon => {
      if (!icon) return false
      if (SHARE_ALIKE_LICENSES.has(icon.license)) return false // share-alike excluded — see module doc
      if (icon.license === 'cc-by-3.0' && icon.author === 'Servier') return false // covered by the Servier tab
      return true
    })

  if (icons.length === 0) {
    throw new Error('No Bioicons SVG files found after filtering.')
  }

  writeCache({ icons, cachedAt: Date.now() })
  return icons
}

export async function fetchBioiconsSvg(icon: BioiconsIcon): Promise<string> {
  const res = await fetch(bioiconsRawUrl(icon.path, icon.branch))
  if (!res.ok) throw new Error(`Failed to load icon: ${res.status}`)
  return res.text()
}

/** Looks up a Bioicons icon by id from the localStorage cache and fetches its SVG. */
export async function fetchBioiconsSvgById(
  iconId: string,
): Promise<{ svgContent: string; category: string; license: string; author: string } | null> {
  if (!iconId.startsWith('bioicons:')) return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { icons: BioiconsIcon[] }
    if (!Array.isArray(data?.icons)) return null
    const icon = data.icons.find((i) => i.id === iconId)
    if (!icon) return null
    const svgContent = await fetchBioiconsSvg(icon)
    return { svgContent, category: icon.category, license: icon.license, author: icon.author }
  } catch {
    return null
  }
}
