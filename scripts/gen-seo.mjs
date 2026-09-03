#!/usr/bin/env node
// Generate public/llms.txt and public/sitemap.xml from the committed data files.
//
// The index is a client-rendered SPA: index.html ships an empty <div id="root">,
// so a crawler that doesn't run JS sees a title and one meta description and
// nothing else. llms.txt is the whole farm in a form that needs no JS.
//
// Run: node scripts/gen-seo.mjs   (wired into `bun run gen`)

import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deDash } from './dedash.mjs'
import { htmlPage } from './md-page.mjs'

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

// The trust pages are authored once, as markdown, and published in both forms:
// public/<slug>.html for people, public/<slug>.md for agents that negotiate for
// text/markdown. One source, so the two can never disagree.
const PAGES = ['about', 'contact', 'privacy']
for (const slug of PAGES) {
  const md = readFileSync(join(REPO, 'content', `${slug}.md`), 'utf8')
  writeFileSync(join(REPO, 'public', `${slug}.html`), htmlPage(md, { slug, origin: ORIGIN }))
  writeFileSync(join(REPO, 'public', `${slug}.md`), md)
}

// Named use cases, not marketing copy: an agent should be able to read this and
// know whether this site answers the question it is holding.
const whenToUse = [
  '## when to use this site',
  '',
  'reach for cosmicfarmland.wtf when you need to:',
  '',
  "- find which of marshall's apps is live for a topic (grateful dead 1977 tapes, systems thinking, golf course design, lenny's newsletter archive, strategy work) and get its url",
  '- look up a claude code skill, slash command or plugin in the cosmic-farmland toolshed, including what triggers it and where its source file lives on github',
  '- get the github repo behind any app or tool listed here',
  '- check the grayton beach design system (palette, type, textures) that every page on this domain is built from',
  '',
  'do not use it for general claude code documentation, for anything sold or supported commercially, or as a source on anyone but marshall.',
  '',
  'how to call it: fetch this file (llms.txt) for the whole catalog in one request; it is regenerated on every deploy. every page also answers to `Accept: text/markdown` and serves the same content as markdown, and `sitemap.xml` lists the indexable urls. unknown paths return a real 404, so a 200 means the page exists.',
  '',
]

const llms = [
  '# cosmic farmland',
  '',
  `> ${tagline}`,
  '',
  ...whenToUse,
  ...section(
    'apps',
    apps.map((a) => `- [${a.name}](${abs(a.url)}): ${deDash(a.blurb)}`),
  ),
  ...section(
    'vault pages',
    golf.map((p) => `- [${p.name}](${ORIGIN}${p.url}): ${deDash(p.blurb)}`),
  ),
  ...section(
    'the farm',
    [
      `- [about](${ORIGIN}/about): who grows this, what is on it, and how it is built.`,
      `- [contact](${ORIGIN}/contact): github is the front door; issues and pull requests welcome.`,
      `- [privacy](${ORIGIN}/privacy): no analytics, no tracking, one theme preference in localStorage.`,
    ],
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
const urls = [
  ORIGIN + '/',
  ORIGIN + '/grayton',
  ...golf.map((p) => ORIGIN + p.url),
  ...PAGES.map((s) => `${ORIGIN}/${s}`),
]

// lastmod is the commit the deploy was built from: every page here is generated
// from committed data, so that date is the truth for all of them. Railway builds
// from a source archive with no .git, so fall back to the build date — the same
// claim, one day of slack, and a deploy only happens on a commit anyway.
let lastmod = new Date().toISOString().slice(0, 10)
try {
  lastmod = execFileSync('git', ['log', '-1', '--format=%cs'], {
    cwd: REPO,
    stdio: ['ignore', 'pipe', 'ignore'],
  })
    .toString()
    .trim()
} catch {}
const entry = (u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(entry),
  '</urlset>',
].join('\n')

writeFileSync(join(REPO, 'public', 'llms.txt'), llms + '\n')
// The homepage's markdown variant, served for Accept: text/markdown on '/'.
writeFileSync(join(REPO, 'public', 'index.md'), llms + '\n')
writeFileSync(join(REPO, 'public', 'sitemap.xml'), sitemap + '\n')
console.log(
  `wrote llms.txt (${apps.length} apps, ${golf.length} pages, ${catalog.entries.length} toolshed) + sitemap.xml (${urls.length} urls)`,
)
