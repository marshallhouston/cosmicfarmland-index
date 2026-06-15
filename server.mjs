// Tiny Bun static server: serves the built SPA + a health endpoint for Railway.
// No backend needed — the index is fully static. Mirrors the sibling apps'
// Railway deploy contract (healthcheckPath: /api/health) without dragging in
// the FastAPI/auth stack those carry.
import { serve, file } from 'bun'
import { join, normalize } from 'node:path'

const DIST = join(import.meta.dir, 'dist')
const PORT = process.env.PORT || 8080

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    if (url.pathname === '/api/health') {
      return Response.json({ status: 'ok' })
    }
    // Serve static asset if it exists, else fall back to index.html (SPA).
    const safe = normalize(url.pathname).replace(/^(\.\.(\/|\\|$))+/, '')
    const asset = file(join(DIST, safe))
    if (safe !== '/' && (await asset.exists())) {
      return new Response(asset)
    }
    return new Response(file(join(DIST, 'index.html')), {
      headers: { 'content-type': 'text/html' },
    })
  },
})
console.log(`cosmic-farmland index serving on :${PORT}`)
