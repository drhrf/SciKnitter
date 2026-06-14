const CACHE_KEY = 'sciknitter:bioart:v2'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 1 week (static files don't change)

/**
 * Strips Adobe Illustrator metadata and normalises namespace prefixes so the
 * SVG is valid both on-canvas (HTML parser via `dangerouslySetInnerHTML`) and
 * when embedded inside an exported SVG (strict `image/svg+xml` parser).
 *
 * BioArt SVGs typically declare prefixed namespaces:
 *   `<ns0:svg xmlns:ns0="…/2000/svg" xmlns:ns1="…/1999/xlink">`
 *   …with `<ns0:image ns1:href="data:image/png;base64,…">` for raster icons.
 *
 * Two problems this causes:
 *  1. The HTML parser only recognises a bare `<svg>` (no prefix) as foreign
 *     SVG content — with `<ns0:svg>` every child (including `<metadata>`) is
 *     parsed as unknown HTML and its text renders visibly.
 *  2. On export the wrapper `<svg>` tag (and its `xmlns:ns1` declaration) is
 *     stripped, so a leftover `ns1:href` becomes an UNDECLARED prefix — a
 *     fatal namespace error that makes the whole SVG render empty (and breaks
 *     PNG export, whose image load then fails).
 *
 * Strategy (pure string transform — more reliable than DOMParser/Serializer,
 * which may re-emit prefixes):
 *  1. Drop the `<?xml?>` declaration.
 *  2. Remove the `<metadata>…</metadata>` block.
 *  3. Map the SVG-namespace prefix to the default namespace (strip it).
 *  4. Rewrite xlink-namespace `href`s to bare `href` (valid SVG2, supported
 *     by all modern browsers) and drop the now-unused xlink declaration, so
 *     no namespace prefix survives anywhere.
 */
export function sanitizeSvg(raw: string): string {
  // 1. Remove XML declaration (handles single- or double-quoted attributes)
  let s = raw.replace(/^\s*<\?xml[^?]*\?>\s*/i, '')

  // 2. Remove Adobe Illustrator metadata block (contains visible plain-text)
  s = s.replace(/<metadata[\s\S]*?<\/metadata>/gi, '')

  // 3. SVG-namespace prefix → default namespace (so root is a bare <svg>)
  const svgPrefix = s.match(/xmlns:([\w-]+)\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/)
  if (svgPrefix) {
    const p = svgPrefix[1]
    s = s
      .replace(new RegExp(`<${p}:`, 'g'), '<')
      .replace(new RegExp(`</${p}:`, 'g'), '</')
      .replace(
        new RegExp(`xmlns:${p}\\s*=\\s*["']http://www\\.w3\\.org/2000/svg["']`),
        'xmlns="http://www.w3.org/2000/svg"',
      )
  }

  // 4. xlink-namespace prefix → bare href, then drop the xlink declaration
  const xlinkPrefix = s.match(/xmlns:([\w-]+)\s*=\s*["']http:\/\/www\.w3\.org\/1999\/xlink["']/)
  if (xlinkPrefix) {
    const p = xlinkPrefix[1]
    s = s
      .replace(new RegExp(`\\b${p}:href`, 'g'), 'href')
      .replace(new RegExp(`\\s*xmlns:${p}\\s*=\\s*["']http://www\\.w3\\.org/1999/xlink["']`), '')
  }
  // Any remaining literal `xlink:href` → bare href (some files use the prefix
  // directly); leaving it would require an xmlns:xlink that export strips.
  s = s
    .replace(/\bxlink:href/g, 'href')
    .replace(/\s*xmlns:xlink\s*=\s*["']http:\/\/www\.w3\.org\/1999\/xlink["']/g, '')

  // 5. Drop any remaining foreign-namespace declarations and the elements that
  //    use them — e.g. Adobe Illustrator private data:
  //      <i:aipgfRef …/>  and  <i:aipgf …>…</i:aipgf>
  //    These never render, but once the wrapper <svg> (carrying `xmlns:i`) is
  //    stripped on export their prefix becomes undeclared and breaks the SVG.
  const leftover = [...s.matchAll(/xmlns:([\w-]+)\s*=\s*["'][^"']*["']/g)].map((m) => m[1])
  for (const p of new Set(leftover)) {
    // Self-closing elements: <p:tag …/>
    s = s.replace(new RegExp(`<${p}:[^<>]*?/>`, 'g'), '')
    // Paired elements: <p:tag …>…</p:tag> (loop for any nesting, innermost first)
    const paired = new RegExp(`<${p}:([\\w-]+)\\b[^>]*>[\\s\\S]*?</${p}:\\1>`, 'g')
    let prev: string
    do {
      prev = s
      s = s.replace(paired, '')
    } while (s !== prev)
    // Stray prefixed attributes, then the namespace declaration itself
    s = s
      .replace(new RegExp(`\\s${p}:[\\w-]+\\s*=\\s*["'][^"']*["']`, 'g'), '')
      .replace(new RegExp(`\\s*xmlns:${p}\\s*=\\s*["'][^"']*["']`, 'g'), '')
  }

  return s.trim()
}

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
  return sanitizeSvg(await res.text())
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
