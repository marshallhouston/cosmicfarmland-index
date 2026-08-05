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

## Design system

**`public/grayton.css` is the Grayton Beach design system** — tokens, type, the
atmosphere layers, the hand-painted sign treatment and the interface chrome, in
one plain stylesheet with no build step. Any page can adopt it:

```html
<link rel="stylesheet" href="https://cosmicfarmland.wtf/grayton.css">
<html data-theme="dark">   <!-- or "light"; board is the default -->
```

The SPA imports the same file from `src/index.css`, so there is one source of
truth. `golf-skin.css` and `city-am-skin.css` sit on top of it and only map the
vault pages' own token names and style their components. `DESIGN.md` is the
spec — palette provenance, type, components, voice — and
[`/grayton`](https://cosmicfarmland.wtf/grayton) is the public version of it:
the source photograph, the sampled palette read live out of `grayton.css`, type
specimens and the sign treatment. That page is itself built with a single
`<link>` to `grayton.css`, so it doubles as the proof that one line is enough.

## Vault pages

Standalone HTML pages written in the Obsidian vault (`~/marshall.notes`) are
served here under their own URLs. The vault file is the source and gets
regenerated wholesale, so **nothing about the site may live in it** — the skin,
nav and footer are injected on the way in, by `scripts/sync-vault.mjs`.

| URL | Vault source | Skins |
|---|---|---|
| `/golf` | `golf-rounds-deep-dive-ghin.html` | `golf-skin.css` |
| `/golf/city-am-2026` | `denver-city-park-golf-tournament-2026/Denver_City_Am_2026_Sunday_Hole_By_Hole.html` | `golf-skin.css` + `city-am-skin.css` |

```
npm run sync:vault              # both pages: skin, commit, push (Railway deploys)
npm run sync:vault city-am      # one page
node scripts/sync-vault.mjs --check   # report injections, write nothing
```

To add a page: drop an entry in the `PAGES` table in `scripts/sync-vault.mjs`
(source, output, skins, injection steps, any sibling `assets` to copy), add a
row to `data/golf.json` if it belongs in golf looping, and run the sync. Each
injection step is anchored to markup in the vault file; if an anchor moves the
sync warns and skips that step rather than failing the deploy, so read the
output. Missing skins and links to vault-only siblings are hard failures.

The Flight 2 scouting report is deliberately **not** published — it carries
other players' GHIN histories — so the City Am sync strips the link to it and
refuses to write a page that still points at one.

## Deploy
Railway, single-stage Bun Docker. Health: `/api/health`. Point apex `@` + `www`
(Cloudflare) at the service.

## Stack
React 19 · Vite · Tailwind v4 · Motion · lucide. Static — no backend.
