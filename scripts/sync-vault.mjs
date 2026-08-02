#!/usr/bin/env node
// Copy standalone pages out of the Obsidian vault, apply the Cosmic Farmland
// skin, write them into public/. The vault files are regenerated wholesale from
// time to time, so nothing about the skin may live in them - every change here
// is an injection into a copy.
//
//   node scripts/sync-vault.mjs             # write every page
//   node scripts/sync-vault.mjs golf        # write one page
//   node scripts/sync-vault.mjs --check     # report what would be injected, write nothing
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VAULT = process.env.VAULT || join(process.env.HOME, 'marshall.notes')
const pub = (...p) => join(REPO, 'public', ...p)

// Cloudflare edge-caches static extensions for hours, so an unversioned
// stylesheet can pin a stale (or 404-fallback) response long after a deploy.
// Content hash in the query string sidesteps that entirely.
const version = (f) => createHash('sha1').update(readFileSync(pub(f))).digest('hex').slice(0, 8)

const FONT_LINKS = `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#9971;</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amarante&family=Figtree:ital,wght@0,300..800;1,300..800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">`

const head = (...skins) =>
  [FONT_LINKS, ...skins.map((s) => `<link rel="stylesheet" href="/${s}?v=${version(s)}">`)].join('\n')

const ATMOSPHERE = `<div class="board"></div><div class="canopy"></div><div class="straw"></div><div class="grain"></div>
<a class="cf-brand" href="https://cosmicfarmland.wtf">&#10023; cosmicfarmland.wtf</a>`

const FOOTER = `<div class="cf-footer">
  <span>grown by marshall</span>
  <span class="cf-slogan">nice dogs, strange people</span>
  <a href="https://cosmicfarmland.wtf">cosmicfarmland.wtf &#8599;</a>
</div>`

// Both golf pages carry the same strip, so either one reaches the other.
const strip = (here) => {
  const link = (href, label) =>
    `<a class="cf-golf-link${here === href ? ' on' : ''}" href="${href}">${label}</a>`
  return `<nav class="cf-golf-nav" aria-label="golf pages">
  <a class="cf-golf-link cf-home" href="https://cosmicfarmland.wtf">&#8592; cosmic farmland</a>
  ${link('/golf', 'the record')}
  ${link('/golf/city-am-2026', 'city am 2026')}
</nav>`
}

const CITY_AM_URL = 'https://cosmicfarmland.wtf/golf/city-am-2026'
// The unversioned photo URL can be pinned to a stale edge-cached response, so
// the card points at the same versioned URL the page itself renders.
const CHAMP = 'city-am-2026-champion.jpg'
const champVersion = createHash('sha1')
  .update(readFileSync(join(VAULT, 'denver-city-park-golf-tournament-2026', CHAMP)))
  .digest('hex').slice(0, 8)
const SHARE_META = `<link rel="canonical" href="${CITY_AM_URL}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="cosmic farmland">
<meta property="og:url" content="${CITY_AM_URL}">
<meta property="og:title" content="Sunday, hole by hole - 2026 Denver City Am, Flight 2">
<meta property="og:description" content="The final round of Flight 2, hole by hole: live 36-hole positions across the full 39-player field, every scorecard, and the notes written that morning.">
<meta property="og:image" content="${CITY_AM_URL.replace(/\/city-am-2026$/, '')}/${CHAMP}?v=${champVersion}">
<meta property="og:image:width" content="392">
<meta property="og:image:height" content="480">
<meta property="og:image:alt" content="Marshall Houston holding the 2026 Denver City Amateur men's second flight trophy">
<meta name="twitter:card" content="summary">`

const PAGES = [
  {
    slug: 'golf',
    src: join(VAULT, 'golf-rounds-deep-dive-ghin.html'),
    out: pub('golf.html'),
    skins: ['golf-skin.css'],
    steps: [
      ['dark default', (h) => h.replace(/<html([^>]*?)\sdata-theme="[^"]*"/, '<html$1 data-theme="dark"')],
      ['fonts + skin stylesheet', (h) => h.replace('</head>', `${head('golf-skin.css')}\n</head>`)],
      ['atmosphere + home link', (h) => h.replace(/<body[^>]*>/, (m) => `${m}\n${ATMOSPHERE}`)],
      ['theme button label', (h) => h.replace(/(<button[^>]*id="themebtn"[^>]*>)Dark(<\/button>)/, '$1Light$2')],
      ['golf nav strip', (h) => h.replace(/(<nav class="jump"[^>]*>)/, `$1\n  ${strip('/golf')}`)],
      // Gold italic on the last two words of the title, the way the index hero
      // italicises "Farmland". Skipped silently if the title is a single word.
      ['hero accent', (h) => h.replace(/<h1>(.*?)(\s+\S+\s+\S+)<\/h1>/, '<h1>$1<em>$2</em></h1>')],
      ['footer', (h) => h.replace(/(\s*<\/body>)/, `\n${FOOTER}$1`)],
    ],
  },
  {
    slug: 'city-am',
    src: join(VAULT, 'denver-city-park-golf-tournament-2026', 'Denver_City_Am_2026_Sunday_Hole_By_Hole.html'),
    out: pub('golf', 'city-am-2026.html'),
    skins: ['golf-skin.css', 'city-am-skin.css'],
    // Copied next to the page so one relative src works in the vault and here.
    assets: ['city-am-2026-champion.jpg'],
    steps: [
      ['dark default', (h) => h.replace(/<html([^>]*)>/, '<html$1 data-theme="dark">')],
      ['fonts + skin stylesheets', (h) => h.replace('</head>', `${head('golf-skin.css', 'city-am-skin.css')}\n</head>`)],
      ['share metadata', (h) => h.replace('</head>', `${SHARE_META}\n</head>`)],
      ['atmosphere + home link', (h) => h.replace(/<body[^>]*>/, (m) => `${m}\n${ATMOSPHERE}`)],
      ['golf nav strip', (h) => h.replace(/(<main class="wrap">)/, `$1\n${strip('/golf/city-am-2026')}`)],
      // Same Cloudflare edge-cache trap as the stylesheets: a URL polled before
      // the deploy lands caches the SPA fallback under an image extension for
      // hours. Version the src so a new file is always a new URL.
      ['version the champion photo', (h) => h.replace(/src="(city-am-2026-champion\.jpg)"/, `src="$1?v=${champVersion}"`)],
      // The scouting report is deliberately vault-only: it carries other players'
      // GHIN histories. Drop the link rather than shipping a 404 to it.
      ['drop the private back-link', (h) => h.replace(/<p class="lede"[^>]*><a href="Denver_City_Am_2026_Flight2_Report\.html">[\s\S]*?<\/p>\n?/, '')],
      ['hero accent', (h) => h.replace(/(<h1>Sunday, hole by hole)( —[^<]*)(<\/h1>)/, '$1<em>$2</em>$3')],
      // "Checkpoint" for a per-hole board read confused readers; say "after each
      // hole" everywhere it appeared (hero chip, two stat tiles, the moments list).
      ['rename checkpoints to per-hole language', (h) => h
        .replace('in front at 16 of the 19 checkpoints', 'in front after 16 of the 19 holes')
        .replace("lab:'Checkpoints in front'", "lab:'In front after each hole'")
        .replace("note:'only 3 were in it at all 19 checkpoints'", "note:'only 3 were in it after every hole'")
        .replace(
          'were inside at all 19 checkpoints. Nathan Bartell spent 11 checkpoints in it and finished 24th, undone by a 9 on the par-5 13th. Adam Seppala was outside it for 12 checkpoints and finished 9th.',
          'were inside after every hole. Nathan Bartell held a spot after 11 holes and finished 24th, undone by a 9 on the par-5 13th. Adam Seppala was outside it for 12 holes and finished 9th.',
        )],
      ['footer', (h) => h.replace(/(\s*<\/body>)/, `\n${FOOTER}$1`)],
    ],
  },
]

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const check = process.argv.includes('--check')
let failed = false

for (const page of PAGES) {
  if (only.length && !only.includes(page.slug)) continue
  let out = readFileSync(page.src, 'utf8')
  const missed = []
  for (const [name, step] of page.steps) {
    const next = step(out)
    if (next === out) missed.push(name)
    out = next
  }
  for (const skin of page.skins) {
    if (!out.includes(`/${skin}?v=${version(skin)}`)) {
      console.error(`FATAL: ${page.slug}: ${skin} was not injected, refusing to write`)
      process.exit(1)
    }
  }
  // A vault page that still points at a vault-only sibling must never ship.
  if (/href="[^"]*Flight2_Report\.html"/.test(out)) {
    console.error(`FATAL: ${page.slug}: still links to the vault-only scouting report, refusing to write`)
    process.exit(1)
  }
  for (const name of missed) console.warn(`warn: ${page.slug}: anchor not found, skipped "${name}"`)
  if (missed.length) failed = true
  const applied = `${page.steps.length - missed.length}/${page.steps.length} injections`
  if (check) { console.log(`${page.slug}: ${applied}`); continue }
  mkdirSync(dirname(page.out), { recursive: true })
  writeFileSync(page.out, out)
  for (const asset of page.assets || []) {
    copyFileSync(join(dirname(page.src), asset), join(dirname(page.out), asset))
  }
  console.log(`wrote ${page.out} (${applied}${page.assets ? `, ${page.assets.length} asset(s)` : ''})`)
}

if (check && failed) process.exit(1)
