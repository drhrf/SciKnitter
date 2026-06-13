/**
 * Fetch Servier Medical Art icons from GitHub and build the icon index.
 *
 * Run once with:  node scripts/fetch-servier-icons.mjs
 *
 * What it does:
 *  1. Fetches the file tree from the holtzy/servier GitHub repository
 *  2. Downloads all SVG files into public/icons/servier/
 *  3. Writes src/data/iconsIndex.generated.json
 *
 * After running, import the generated index in src/data/iconsIndex.ts:
 *   import generated from './iconsIndex.generated.json'
 *   const ICONS = [...CUSTOM_ICONS, ...generated]
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'public', 'icons', 'servier')
const INDEX_OUT = join(ROOT, 'src', 'data', 'iconsIndex.generated.json')

const REPO_OWNER = 'holtzy'
const REPO_NAME = 'servier'
const BRANCH = 'master'
const TREE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'SciKnitter' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json()
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'SciKnitter' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
}

function pathToTags(filePath) {
  const parts = filePath.replace(/\.svg$/i, '').split('/')
  const tags = []
  for (const part of parts) {
    tags.push(...part.replace(/[_-]/g, ' ').toLowerCase().trim().split(/\s+/))
  }
  return [...new Set(tags.filter(Boolean))]
}

function pathToCategory(filePath) {
  const parts = filePath.split('/')
  return parts.length > 1
    ? parts[parts.length - 2].replace(/_/g, ' ')
    : 'Uncategorized'
}

function pathToName(filePath) {
  const base = filePath.split('/').pop() ?? filePath
  return base
    .replace(/\.svg$/i, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

async function main() {
  console.log('Fetching Servier icon tree from GitHub…')
  const tree = await fetchJson(TREE_URL)

  const svgFiles = tree.tree
    .filter((f) => f.type === 'blob' && f.path.endsWith('.svg'))

  console.log(`Found ${svgFiles.length} SVG files. Downloading…`)
  await mkdir(OUT_DIR, { recursive: true })

  const icons = []
  let downloaded = 0
  let failed = 0

  for (const file of svgFiles) {
    const url = `${RAW_BASE}/${file.path}`
    const localPath = join(OUT_DIR, file.path.replace(/\//g, '__'))
    const publicPath = `/SciKnitter/icons/servier/${file.path.replace(/\//g, '__')}`

    try {
      const svg = await fetchText(url)
      await writeFile(localPath, svg, 'utf8')

      icons.push({
        id: `servier__${file.path.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`,
        name: pathToName(file.path),
        category: pathToCategory(file.path),
        tags: pathToTags(file.path),
        source: 'servier',
        url: publicPath,
      })

      downloaded++
      if (downloaded % 50 === 0) console.log(`  ${downloaded}/${svgFiles.length}…`)

      // Gentle rate limiting
      await new Promise((r) => setTimeout(r, 50))
    } catch (err) {
      failed++
      console.warn(`  SKIP ${file.path}: ${err.message}`)
    }
  }

  await writeFile(INDEX_OUT, JSON.stringify(icons, null, 2), 'utf8')
  console.log(`\nDone! ${downloaded} icons downloaded, ${failed} failed.`)
  console.log(`Index written to: ${INDEX_OUT}`)
  console.log('\nNext steps:')
  console.log('  Import the generated index in src/data/iconsIndex.ts')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
