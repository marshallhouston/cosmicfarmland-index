// A sitemap asserts that every URL in it is canonical, 200 and indexable.
// Google Search Console flagged this domain in Sept 2026; the origin defect was
// that every page answered at two URLs (/about and /about.html both 200) and
// three pages carried no canonical at all, so Google picked the winner.
//
// These run against handle() and dist/, the same pair a browser sees.
// Run: bun test  (build first, they read dist/)
import { test, expect, beforeAll } from 'bun:test'
import { handle } from '../server.mjs'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = join(import.meta.dir, '..', 'dist')
const ORIGIN = 'https://cosmicfarmland.wtf'

const get = (path) => handle(new Request(`http://localhost${path}`))

const sitemapPaths = () =>
  [...readFileSync(join(DIST, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)

// dist file behind a URL path: /about -> about.html, / -> index.html
const fileFor = (path) => join(DIST, path === '/' ? 'index.html' : `${path}.html`)

beforeAll(() => {
  if (!existsSync(join(DIST, 'sitemap.xml')))
    throw new Error('run `bun run build` before `bun test`')
})

test('sitemap is not empty', () => {
  expect(sitemapPaths().length).toBeGreaterThan(0)
})

test('every sitemap url is a 200 with no redirect', async () => {
  for (const path of sitemapPaths()) {
    const res = await get(path)
    expect(`${path} -> ${res.status}`).toBe(`${path} -> 200`)
  }
})

test('every sitemap url is self-canonical', () => {
  for (const path of sitemapPaths()) {
    const html = readFileSync(fileFor(path), 'utf8')
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
    // The apex is the one URL that keeps its slash; everything else is bare.
    const want = path === '/' ? `${ORIGIN}/` : ORIGIN + path
    expect(`${path} -> ${canonical}`).toBe(`${path} -> ${want}`)
  }
})

test('no sitemap url is noindexed', () => {
  for (const path of sitemapPaths()) {
    const html = readFileSync(fileFor(path), 'utf8')
    expect(`${path}: ${/<meta[^>]*noindex/i.test(html)}`).toBe(`${path}: false`)
  }
})

// Location is relative, so resolve against a dummy https base: an absolute
// Location here would mean the origin leaked its own http:// scheme.
const locationOf = (res) => new URL(res.headers.get('location'), 'https://base.invalid')

test('the .html twin of every sitemap url 301s to the pretty path', async () => {
  for (const path of sitemapPaths()) {
    const twin = path === '/' ? '/index.html' : `${path}.html`
    const res = await get(twin)
    expect(`${twin} -> ${res.status}`).toBe(`${twin} -> 301`)
    expect(`${twin} -> ${locationOf(res).pathname}`).toBe(`${twin} -> ${path}`)
  }
})

test('the trailing-slash twin of every sitemap url 301s to the pretty path', async () => {
  for (const path of sitemapPaths()) {
    if (path === '/') continue
    const res = await get(`${path}/`)
    expect(`${path}/ -> ${res.status}`).toBe(`${path}/ -> 301`)
    expect(`${path}/ -> ${locationOf(res).pathname}`).toBe(`${path}/ -> ${path}`)
  }
})

test('a redirect never sends the client to a bare http:// origin', async () => {
  for (const probe of ['/about.html', '/about/', '/index.html', '/about.html/']) {
    const loc = (await get(probe)).headers.get('location') ?? ''
    expect(`${probe}: ${loc.startsWith('http:')}`).toBe(`${probe}: false`)
  }
})

test('no page in dist links to a .html or trailing-slash url', () => {
  for (const path of sitemapPaths()) {
    const html = readFileSync(fileFor(path), 'utf8')
    const bad = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)]
      .map((m) => m[1])
      .filter((h) => h !== '/' && (h.endsWith('/') || h.endsWith('.html')))
    expect(`${path}: ${[...new Set(bad)].join(', ')}`).toBe(`${path}: `)
  }
})
