// Generates responsive WebP variants for every photo the site uses.
//
//   node scripts/optimize-images.mjs        (also runs before `npm run build`)
//
// Reads public/images/<file>, writes public/img/<name>-<width>.webp, and records
// everything in src/data/image-manifest.json. Components look images up there
// (see src/lib/img.js) to get src / srcSet / width / height.
// Already-generated files are skipped, so re-runs are fast.
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const SRC_DIR = path.join(ROOT, 'public/images')
const OUT_DIR = path.join(ROOT, 'public/img')
const MANIFEST = path.join(ROOT, 'src/data/image-manifest.json')

// Candidate widths; each image gets those smaller than itself plus its own width (≤ 1600).
const WIDTHS = [160, 320, 640, 960, 1280, 1600]
const MAX_W = 1600
const QUALITY = 74

await mkdir(OUT_DIR, { recursive: true })

// Only process images the source code actually references (/images/<file>).
async function referencedImages(dir) {
  const found = new Set()
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) for (const f of await referencedImages(p)) found.add(f)
    else if (/\.(jsx?|json)$/.test(entry.name) && entry.name !== 'image-manifest.json') {
      const text = await (await import('node:fs/promises')).readFile(p, 'utf8')
      for (const m of text.matchAll(/\/images\/([A-Za-z0-9_.-]+\.(?:jpe?g|png|webp))/gi)) found.add(m[1])
    }
  }
  return found
}
const used = await referencedImages(path.join(ROOT, 'src'))
const files = (await readdir(SRC_DIR)).filter((f) => used.has(f))
const manifest = {}
let written = 0

for (const file of files.sort()) {
  const input = path.join(SRC_DIR, file)
  const meta = await sharp(input).rotate().metadata()
  const srcW = meta.autoOrient?.width ?? meta.width
  const srcH = meta.autoOrient?.height ?? meta.height
  const cap = Math.min(srcW, MAX_W)
  const widths = [...new Set([...WIDTHS.filter((w) => w < cap), cap])]
  const name = path.parse(file).name
  const variants = []

  for (const w of widths) {
    const out = path.join(OUT_DIR, `${name}-${w}.webp`)
    if (!existsSync(out) || (await stat(out)).mtimeMs < (await stat(input)).mtimeMs) {
      await sharp(input)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5, alphaQuality: 90 })
        .toFile(out)
      written++
    }
    variants.push([w, `/img/${name}-${w}.webp`])
  }

  manifest[`/images/${file}`] = { w: srcW, h: srcH, variants }
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 1) + '\n')
console.log(`images: ${files.length} sources, ${written} variants written → public/img`)
