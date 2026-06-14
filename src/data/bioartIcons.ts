import type { Icon } from '../types'

// Vite picks up every .svg under src/data/bioart/ at build time.
// Organize by subdirectory to set categories:
//   src/data/bioart/Cell Biology/BIOART-000001_Cell.svg  → category "Cell Biology"
//   src/data/bioart/BIOART-000002_Antibody.svg           → category "BioArt"
const svgModules = import.meta.glob<string>('./bioart/**/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getBundledBioartIcons(): Icon[] {
  return Object.entries(svgModules).map(([path, svgContent]) => {
    const parts = path.split('/')
    const filename = parts[parts.length - 1].replace(/\.svg$/i, '')
    const category = parts.length > 3 ? parts[parts.length - 2] : 'BioArt'

    // NIH BioArt filenames: BIOART-000658_Some_Title_741470
    const bioartMatch = filename.match(/^BIOART-\d+_(.+)$/)
    let name: string
    if (bioartMatch) {
      name = bioartMatch[1]
        .replace(/_\d+$/, '')
        .replace(/_/g, ' ')
    } else {
      name = filename.replace(/[_-]+/g, ' ')
    }

    return {
      id: `bioart:${filename}`,
      name,
      category,
      tags: name.toLowerCase().split(/\s+/).filter(Boolean),
      source: 'bioart' as const,
      svgContent,
    }
  })
}
