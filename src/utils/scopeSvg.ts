// Scopes an SVG's internal CSS class names and element IDs to a unique prefix.
//
// BioArt / Illustrator SVGs all reuse the same generic names — `.cls-1`,
// `.cls-2`, `id="clippath-1"`, `id="mask"`, gradients, etc. When several such
// SVGs are inlined into the SAME document (every icon on the canvas, or every
// icon in one exported SVG) those names collide: the last `<style>` wins
// globally and clip-path / mask / gradient IDs resolve to the wrong element,
// so icons render with wrong colours or vanish entirely.
//
// Prefixing every class selector, `id`, `url(#…)` and `href="#…"` reference
// with a per-instance token isolates each icon. Works on a full `<svg>…</svg>`
// string or a wrapper-stripped inner fragment.

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function scopeSvgIds(svg: string, rawPrefix: string): string {
  // CSS identifiers can't start with a digit and allow only [A-Za-z0-9_-].
  const prefix = `s${rawPrefix.replace(/[^a-zA-Z0-9_-]/g, '-')}`

  // Collect every declared id so we can rewrite back-references to them.
  const ids: string[] = []
  svg.replace(/\bid="([^"]+)"/g, (m, id) => { ids.push(id); return m })

  let out = svg

  // 1. Rename id attributes
  out = out.replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}-${id}"`)

  // 2. Update url(#id) and href="#id" references to the renamed ids
  for (const id of ids) {
    out = out.replace(new RegExp(`url\\(\\s*#${escapeRe(id)}\\s*\\)`, 'g'), `url(#${prefix}-${id})`)
    out = out.replace(new RegExp(`href="#${escapeRe(id)}"`, 'g'), `href="#${prefix}-${id}"`)
  }

  // 3. Scope CSS class selectors inside <style> blocks
  out = out.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, open, css, close) => {
    const scoped = (css as string).replace(/\.([\w-]+)/g, (_m, cls) => `.${prefix}-${cls}`)
    return `${open}${scoped}${close}`
  })

  // 4. Prefix class="" attribute values on elements
  out = out.replace(/\bclass="([^"]+)"/g, (_, classes: string) => {
    const scoped = classes.trim().split(/\s+/).map((c) => `${prefix}-${c}`).join(' ')
    return `class="${scoped}"`
  })

  return out
}
