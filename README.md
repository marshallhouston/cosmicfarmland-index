# cosmicfarmland-index

The apex landing for **cosmicfarmland.wtf** — routes to my apps and catalogs the
skills, commands, and plugins I build them with.

- Apps live on subdomains (`<slug>.cosmicfarmland.wtf`); this is the apex index.
- `data/apps.json` — hand-curated app list (live + coming-soon).
- `data/catalog.json` — generated from the cosmic-farmland plugin repo.

## Develop
```
bun install
bun run dev        # vite dev server
bun run gen        # regenerate data/catalog.json from ../cosmic-farmland
bun run build      # static SPA -> dist/
bun run start      # serve dist/ + /api/health (prod, Bun)
```

## Deploy
Railway, single-stage Bun Docker. Health: `/api/health`. Point apex `@` + `www`
(Cloudflare) at the service.

## Stack
React 19 · Vite · Tailwind v4 · Motion · lucide. Static — no backend.
