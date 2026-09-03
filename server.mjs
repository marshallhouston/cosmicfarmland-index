// Tiny Bun static server: serves the built SPA + a health endpoint for Railway.
// No backend needed — the index is fully static. Mirrors the sibling apps'
// Railway deploy contract (healthcheckPath: /api/health) without dragging in
// the FastAPI/auth stack those carry.
import { serve, file } from 'bun'
import { join, normalize } from 'node:path'
import { isFresh, ping } from './scripts/indexnow.mjs'

const DIST = join(import.meta.dir, 'dist')
const PORT = process.env.PORT || 8080

// Cloudflare applies a 4h default TTL to static extensions when the origin
// sends no cache-control, and it will happily pin whatever it saw first. These
// were soft-404s (200 + homepage HTML) until #28, so the edge cached HTML as
// robots.txt and served it for hours after the fix deployed. They are small,
// they change on every deploy, and being wrong about robots.txt is expensive,
// so cap the edge TTL. Hashed assets keep the long default.
const SHORT_CACHE = new Set(['/robots.txt', '/sitemap.xml', '/llms.txt', '/index.md'])

// Every negotiated response carries this. Without Accept in Vary, a CDN can
// hand the cached HTML to an agent that asked for markdown, or the reverse,
// depending on which variant landed in the cache first (acceptmarkdown.com).
const VARY = 'Accept, Accept-Encoding'

// Parse Accept into a q-value lookup. RFC 9110: a missing q is 1, and params
// after the media type (charset, q) are dropped from the key.
function accepts(header = '') {
  const q = {}
  for (const part of header.split(',')) {
    const [type, ...params] = part.trim().split(';')
    if (!type) continue
    const qp = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
    q[type.toLowerCase()] = qp ? parseFloat(qp.slice(2)) || 0 : 1
  }
  return q
}

const qFor = (q, ...types) => Math.max(...types.map((t) => q[t] ?? 0), q['*/*'] ?? 0)

// The .md twin of a page path: '/' -> index.md, '/about' -> about.md.
const mdTwin = (path) => (path === '/' ? '/index.md' : `${path}.md`)

const NOT_FOUND = `# 404 — nothing grows at this path

This page does not exist on cosmicfarmland.wtf.

- [/llms.txt](https://cosmicfarmland.wtf/llms.txt) — the whole site in one machine-readable file, with when-to-use guidance
- [/sitemap.xml](https://cosmicfarmland.wtf/sitemap.xml) — every indexable url
- [/](https://cosmicfarmland.wtf/) — the index
`

export async function handle(req) {
  const url = new URL(req.url)
  if (url.pathname === '/api/health') return Response.json({ status: 'ok' })

  const safe = normalize(url.pathname).replace(/^(\.\.(\/|\\|$))+/, '')
  const q = accepts(req.headers.get('accept') ?? '')
  const wantsMd = qFor(q, 'text/markdown') > qFor(q, 'text/html', 'application/xhtml+xml')
  const mdOnly = wantsMd && qFor(q, 'text/html', 'application/xhtml+xml') === 0

  const html = (f, headers) =>
    new Response(f, { headers: { 'content-type': 'text/html; charset=utf-8', vary: VARY, ...headers } })

  // Markdown variant, when the client prefers it and one exists.
  if (wantsMd && !safe.endsWith('.md')) {
    const md = file(join(DIST, mdTwin(safe)))
    if (await md.exists()) {
      return new Response(md, {
        headers: {
          'content-type': 'text/markdown; charset=utf-8',
          vary: VARY,
          ...(SHORT_CACHE.has(mdTwin(safe)) ? { 'cache-control': 'public, max-age=300' } : {}),
        },
      })
    }
  }

  if (safe === '/') {
    // A client that will take markdown and nothing else gets 406, not HTML it
    // cannot read. Anything that also accepts HTML falls through to the page.
    if (mdOnly) return notFound(406, 'no markdown variant for this path')
    return html(file(join(DIST, 'index.html')))
  }

  const asset = file(join(DIST, safe))
  if (await asset.exists()) {
    const headers = {
      vary: VARY,
      ...(SHORT_CACHE.has(safe) ? { 'cache-control': 'public, max-age=300' } : {}),
      ...(safe.endsWith('.md') ? { 'content-type': 'text/markdown; charset=utf-8' } : {}),
    }
    return new Response(asset, { headers })
  }

  // Pretty URL for standalone pages: /golf serves dist/golf.html.
  const page = file(join(DIST, `${safe}.html`))
  if (!safe.includes('.') && (await page.exists())) {
    if (mdOnly) return notFound(406, 'no markdown variant for this path')
    return html(page)
  }

  // The index app has no client-side routes, so nothing unmatched is real.
  // Falling through to index.html here would make every miss a soft 404.
  return notFound(404)
}

function notFound(status = 404, reason) {
  const body = reason ? `${NOT_FOUND}\n(${reason})\n` : NOT_FOUND
  // Markdown body, text/plain type: agents read the pointers either way, and a
  // person who mistyped a url sees the page instead of downloading a file.
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', vary: VARY },
  })
}

if (import.meta.main) {
  serve({ port: PORT, fetch: handle })
  console.log(`cosmic-farmland index serving on :${PORT}`)

  // Tell IndexNow (Bing, DuckDuckGo, Yandex, Seznam) about the new build. This
  // is the only moment that knows a deploy both happened and is serving: the
  // ping has to come after the key file is reachable, which is this process.
  // isFresh keeps it to one deploy-day, so a plain restart is silent.
  // ponytail: same-day restarts re-submit. Harmless at this volume; give it a
  // marker file on a volume if the restart count ever climbs.
  if (isFresh(DIST)) {
    ping(DIST).then(
      (r) => console.log(`indexnow ${r.status} for ${r.urls} urls ${r.body}`),
      (e) => console.warn(`indexnow skipped: ${e.message}`),
    )
  }
}
