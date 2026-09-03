// Build a plain-HTML mirror of the farm for crawlers and no-JS clients.
//
// The index is a client-rendered SPA: index.html ships an empty #root, so a
// client that doesn't run JS sees a title and one meta description. This
// fragment is injected into #root at build time (see vite.config.js) from the
// same committed data as llms.txt. React's createRoot clears #root on mount, so
// JS clients never keep it; a .js-gated style hides it before paint so there is
// no flash. Everything here is real, per PRODUCT.md.
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deDash } from './dedash.mjs'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...p) => JSON.parse(readFileSync(join(REPO, ...p), 'utf8'))

const esc = (s = '') =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export function seoFragment(tagline = '') {
  const apps = read('data', 'apps.json').apps.filter((a) => a.status === 'live')
  const golf = read('data', 'golf.json').pages
  const catalog = read('data', 'catalog.json')
  const origin = 'https://cosmicfarmland.wtf'
  const abs = (u) => (u.startsWith('/') ? origin + u : u)

  const li = (href, name, blurb) =>
    `<li><a href="${esc(href)}">${esc(name)}</a>: ${esc(deDash(blurb))}</li>`

  const kinds = { skill: 'skills', command: 'commands', plugin: 'plugins' }
  const counts = Object.entries(catalog.counts)
    .map(([k, n]) => `${n} ${n === 1 ? k : kinds[k] ?? k + 's'}`)
    .join(', ')

  return [
    '<div data-seo-fallback>',
    '<h1>Cosmic Farmland</h1>',
    `<p>${esc(deDash(tagline))}</p>`,
    '<h2>Apps</h2><ul>',
    ...apps.map((a) => li(abs(a.url), a.name, a.blurb)),
    '</ul><h2>Vault pages</h2><ul>',
    ...golf.map((p) => li(origin + p.url, p.name, p.blurb)),
    `</ul><h2>Toolshed (${esc(counts)})</h2><ul>`,
    ...catalog.entries.map((e) => li(e.source, e.name, `${e.kind}, ${e.plugin}: ${e.blurb}`)),
    '</ul>',
    // The trust pages, so a crawler that only reads the homepage still finds them.
    '<h2>The farm</h2><ul>',
    li(origin + '/about', 'About', 'who grows this and how the site is built'),
    li(origin + '/contact', 'Contact', 'github is the front door; issues and pull requests welcome'),
    li(origin + '/privacy', 'Privacy', 'no analytics, no tracking, one theme preference in localStorage'),
    li(origin + '/grayton', 'Grayton Beach', 'the design system every page here is sampled from'),
    li(origin + '/llms.txt', 'llms.txt', 'the whole farm in one machine-readable file, with when-to-use guidance'),
    '</ul>',
    '</div>',
  ].join('')
}
