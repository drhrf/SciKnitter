const CACHE_KEY = 'sciknitter:bioart:v1'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export interface BioartIcon {
  id: string
  name: string
  category: string
  tags: string[]
  path: string
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
  const res = await fetch('/bioart-icons/manifest.json')
  if (!res.ok) throw new Error(`Could not load bioart manifest: ${res.status}`)
  const data: { icons: BioartIcon[] } = await res.json()
  if (!Array.isArray(data?.icons) || data.icons.length === 0) {
    throw new Error('No bioart icons found in manifest. Please add icons to public/bioart-icons/')
  }
  writeCache({ icons: data.icons, cachedAt: Date.now() })
  return data.icons
}

export async function fetchBioartSvg(icon: BioartIcon): Promise<string> {
  const res = await fetch(icon.path)
  if (!res.ok) throw new Error(`Failed to load icon: ${res.status}`)
  return res.text()
}

export function clearBioartCache() {
  localStorage.removeItem(CACHE_KEY)
}
