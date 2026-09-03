// Contract tests for the static server: real 404s, markdown content negotiation
// (acceptmarkdown.com) and the Vary header that keeps a CDN from crossing the
// two variants. Run: bun test
import { test, expect, beforeAll } from 'bun:test'
import { handle } from '../server.mjs'
import { isFresh, sitemapDate } from '../scripts/indexnow.mjs'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const get = (path, accept) =>
  handle(new Request(`http://localhost${path}`, accept ? { headers: { accept } } : undefined))

beforeAll(() => {
  if (!existsSync(join(import.meta.dir, '..', 'dist', 'index.html')))
    throw new Error('run `bun run build` before `bun test`')
})

test('health endpoint answers', async () => {
  expect((await get('/api/health')).status).toBe(200)
})

test('unknown paths are real 404s with a markdown body pointing at llms.txt', async () => {
  const res = await get('/no-such-path')
  expect(res.status).toBe(404)
  const body = await res.text()
  expect(body).toContain('/llms.txt')
  expect(body).toContain('/sitemap.xml')
})

test('homepage serves html by default, with Vary: Accept', async () => {
  const res = await get('/', 'text/html')
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toContain('text/html')
  expect(res.headers.get('vary')).toContain('Accept')
})

test('homepage serves markdown when asked', async () => {
  const res = await get('/', 'text/markdown')
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
  expect(res.headers.get('vary')).toContain('Accept')
  expect(await res.text()).toContain('# cosmic farmland')
})

test('q-values decide the variant', async () => {
  const md = await get('/', 'text/html;q=0.5, text/markdown;q=0.9')
  expect(md.headers.get('content-type')).toContain('text/markdown')
  const html = await get('/', 'text/markdown;q=0.4, text/html;q=0.8')
  expect(html.headers.get('content-type')).toContain('text/html')
})

test('a browser Accept header still gets html', async () => {
  const res = await get('/', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
  expect(res.headers.get('content-type')).toContain('text/html')
})

test('trust pages serve both variants', async () => {
  for (const slug of ['about', 'contact', 'privacy']) {
    const html = await get(`/${slug}`, 'text/html')
    expect(html.status).toBe(200)
    expect(html.headers.get('content-type')).toContain('text/html')

    const md = await get(`/${slug}`, 'text/markdown')
    expect(md.status).toBe(200)
    expect(md.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
    // Trust anchors need real content, not a stub: Ora's bar is 500 chars.
    expect((await md.text()).length).toBeGreaterThan(500)
  }
})

test('markdown-only client gets 406 where no markdown variant exists', async () => {
  const res = await get('/grayton', 'text/markdown')
  expect(res.status).toBe(406)
  expect(res.headers.get('vary')).toContain('Accept')
})

test('llms.txt and sitemap.xml keep the short edge TTL', async () => {
  for (const p of ['/llms.txt', '/sitemap.xml', '/robots.txt']) {
    const res = await get(p)
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('public, max-age=300')
  }
})

test('path traversal cannot escape dist', async () => {
  expect((await get('/../package.json')).status).toBe(404)
})

test('sitemap ships a lastmod on every url', async () => {
  const xml = await (await get('/sitemap.xml')).text()
  const locs = xml.match(/<loc>/g)?.length ?? 0
  const mods = xml.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)?.length ?? 0
  expect(locs).toBeGreaterThan(0)
  expect(mods).toBe(locs)
})

test('indexnow pings only for a sitemap built today', () => {
  const dist = join(import.meta.dir, '..', 'dist')
  expect(isFresh(dist, sitemapDate(dist))).toBe(true)
  expect(isFresh(dist, '1999-01-01')).toBe(false)
  // No sitemap, no date, no ping. (A dir that exists but holds no sitemap.)
  expect(isFresh(import.meta.dir)).toBe(false)
})
