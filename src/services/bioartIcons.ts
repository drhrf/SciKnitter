const CACHE_KEY = 'sciknitter:bioart:v2'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 1 week (static files don't change)

export interface BioartIcon {
  id: string
  name: string
  category: string
  tags: string[]
  path: string // filename relative to public/bioart-icons/
}

interface CacheData {
  icons: BioartIcon[]
  cachedAt: number
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

export async function fetchBioartIndex(): Promise<BioartIcon[]> {
  const cached = readCache()
  if (cached) return cached.icons
  const res = await fetch(`${import.meta.env.BASE_URL}bioart-icons/manifest.json`)
  if (!res.ok) throw new Error(`Could not load bioart manifest: ${res.status}`)
  const data: { icons: BioartIcon[] } = await res.json()
  if (!Array.isArray(data?.icons) || data.icons.length === 0) {
    throw new Error('No bioart icons found in manifest.')
  }
  writeCache({ icons: data.icons, cachedAt: Date.now() })
  return data.icons
}

export async function fetchBioartSvg(icon: BioartIcon): Promise<string> {
  const url = `${import.meta.env.BASE_URL}bioart-icons/${icon.path}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load icon SVG: ${res.status}`)
  return res.text()
}

export function clearBioartCache() {
  localStorage.removeItem(CACHE_KEY)
}

export function getCachedBioartIconsForPrompt(): Array<{ id: string; name: string }> {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return []
    const data: CacheData = JSON.parse(raw)
    if (!Array.isArray(data?.icons)) return []
    // Deduplicate by BIOART-XXXXXX number — one entry per concept
    const seen = new Set<string>()
    return data.icons.filter(i => {
      const m = i.id.match(/bioart:BIOART-(\d+)/)
      if (!m) return true
      if (seen.has(m[1])) return false
      seen.add(m[1])
      return true
    })
  } catch {
    return []
  }
}
