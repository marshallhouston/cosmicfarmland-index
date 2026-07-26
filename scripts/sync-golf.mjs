#!/usr/bin/env node
// Copy the golf page out of the Obsidian vault, apply the Cosmic Farmland skin,
// write public/golf.html. The vault file is regenerated wholesale from time to
// time, so nothing about the skin may live in it - every change here is an
// injection into a copy.
//
//   node scripts/sync-golf.mjs           # write public/golf.html
//   node scripts/sync-golf.mjs --check   # report what would be injected, write nothing
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VAULT = process.env.VAULT || join(process.env.HOME, 'marshall.notes')
const SRC = join(VAULT, 'golf-rounds-deep-dive-ghin.html')
const OUT = join(REPO, 'public', 'golf.html')
const SKIN = join(REPO, 'public', 'golf-skin.css')

// Cloudflare edge-caches static extensions for hours, so an unversioned
// /golf-skin.css can pin a stale (or 404-fallback) response long after a
// deploy. Content hash in the query string sidesteps that entirely.
const skinVersion = createHash('sha1').update(readFileSync(SKIN)).digest('hex').slice(0, 8)

const FONTS = `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#9971;</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..700&family=Familjen+Grotesk:ital,wght@0,400..700;1,400..600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/golf-skin.css?v=${skinVersion}">`

const ATMOSPHERE = `<div class="sky"></div><div class="stars"></div><div class="grain"></div>
<a class="cf-brand" href="https://cosmicfarmland.wtf">&#10023; cosmicfarmland.wtf</a>`

const BACK_LINK = `\n  <a class="cf-home" href="https://cosmicfarmland.wtf">&#8592; cosmic farmland</a>`

const FOOTER = `<div class="cf-footer">
  <span>grown by marshall</span>
  <a href="https://cosmicfarmland.wtf">cosmicfarmland.wtf &#8599;</a>
</div>`

// Each step is (html) => html | null. null means the anchor moved: warn, skip,
// keep going. A missing back-link anchor should not block the whole deploy.
const steps = [
  ['dark default', (h) => h.replace(/<html([^>]*?)\sdata-theme="[^"]*"/, '<html$1 data-theme="dark"')],
  ['fonts + skin stylesheet', (h) => h.replace('</head>', `${FONTS}\n</head>`)],
  ['atmosphere + home link', (h) => h.replace(/<body[^>]*>/, (m) => `${m}\n${ATMOSPHERE}`)],
  ['theme button label', (h) => h.replace(/(<button[^>]*id="themebtn"[^>]*>)Dark(<\/button>)/, '$1Light$2')],
  ['nav back link', (h) => h.replace(/(<nav class="jump"[^>]*>)/, `$1${BACK_LINK}`)],
  // Gold italic on the last two words of the title, the way the index hero
  // italicises "Farmland". Skipped silently if the title is a single word.
  ['hero accent', (h) => h.replace(/<h1>(.*?)(\s+\S+\s+\S+)<\/h1>/, '<h1>$1<em>$2</em></h1>')],
  ['footer', (h) => h.replace(/(\s*<\/body>)/, `\n${FOOTER}$1`)],
]

const src = readFileSync(SRC, 'utf8')
let out = src
const missed = []
for (const [name, step] of steps) {
  const next = step(out)
  if (next === out) missed.push(name)
  out = next
}

if (out.includes(`/golf-skin.css?v=${skinVersion}`) === false) {
  console.error('FATAL: skin stylesheet was not injected, refusing to write')
  process.exit(1)
}
for (const name of missed) console.warn(`warn: anchor not found, skipped "${name}"`)

if (process.argv.includes('--check')) {
  console.log(`${steps.length - missed.length}/${steps.length} injections applied`)
  process.exit(missed.length ? 1 : 0)
}

writeFileSync(OUT, out)
console.log(`wrote ${OUT} (${steps.length - missed.length}/${steps.length} injections)`)
