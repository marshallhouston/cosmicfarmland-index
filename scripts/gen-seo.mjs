#!/usr/bin/env node
// Generate public/llms.txt and public/sitemap.xml from the committed data files.
//
// The index is a client-rendered SPA: index.html ships an empty <div id="root">,
// so a crawler that doesn't run JS sees a title and one meta description and
// nothing else. llms.txt is the whole farm in a form that needs no JS.
//
// Run: node scripts/gen-seo.mjs   (wired into `bun run gen`)

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deDash } from './dedash.mjs'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://cosmicfarmland.wtf'

const read = (...p) => JSON.parse(readFileSync(join(REPO, ...p), 'utf8'))
const apps = read('data', 'apps.json').apps.filter((a) => a.status === 'live')
const golf = read('data', 'golf.json').pages
const catalog = read('data', 'catalog.json')

// The tagline is authored once, in index.html's meta description. Read it back
// rather than keeping a second copy in sync by hand.
const html = readFileSync(join(REPO, 'index.html'), 'utf8')
const tagline = deDash(
  html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '',
)

// Relative app urls (the vault pages) live on the apex; the rest are their own origins.
const abs = (u) => (u.startsWith('/') ? ORIGIN + u : u)

const section = (title, lines) => (lines.length ? [`## ${title}`, '', ...lines, ''] : [])

const kinds = { skill: 'skills', command: 'commands', plugin: 'plugins' }
const counts = Object.entries(catalog.counts)
  .map(([kind, n]) => `${n} ${n === 1 ? kind : kinds[kind] ?? kind + 's'}`)
  .join(', ')

const llms = [
  '# cosmic farmland',
  '',
  `> ${tagline}`,
  '',
  ...section(
    'apps',
    apps.map((a) => `- [${a.name}](${abs(a.url)}): ${deDash(a.blurb)}`),
  ),
  ...section(
    'vault pages',
    golf.map((p) => `- [${p.name}](${ORIGIN}${p.url}): ${deDash(p.blurb)}`),
  ),
  ...section(
    `toolshed (${counts})`,
    catalog.entries.map(
      (e) => `- [${e.name}](${e.source}) (${e.kind}, ${e.plugin}): ${deDash(e.blurb)}`,
    ),
  ),
].join('\n')

// Apex + the standalone pages only. The apps live on sibling subdomains, and a
// cross-origin sitemap entry needs cross-submission verification to count.
const urls = [ORIGIN + '/', ORIGIN + '/grayton', ...golf.map((p) => ORIGIN + p.url)]
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
  '</urlset>',
].join('\n')

writeFileSync(join(REPO, 'public', 'llms.txt'), llms + '\n')
writeFileSync(join(REPO, 'public', 'sitemap.xml'), sitemap + '\n')
console.log(
  `wrote llms.txt (${apps.length} apps, ${golf.length} pages, ${catalog.entries.length} toolshed) + sitemap.xml (${urls.length} urls)`,
)
