# Design — Grayton Beach

Visual system for cosmicfarmland.wtf, captured from the shipped code
(`src/index.css`, `src/App.jsx`, `public/golf-skin.css`,
`public/city-am-skin.css`).

## Origin

One photograph: a hand-painted **WELCOME TO GRAYTON BEACH** sign. A dark-stained
reclaimed board, lettering in marigold, forest green and bone, leaned on
weathered fence rails in wet Florida foliage over pine straw and bark mulch,
under a flat overcast sky.

Everything here comes off that photo. Nothing else is a source: no other
palette, no other typographic reference, no stock "coastal" vocabulary.

The system is named for the sign, and it answers to the town's slogan:

> **nice dogs, strange people**

Nice dogs = the interface is friendly, plainspoken, unguarded. Strange people =
the personality is not sanded off. A hand-painted woodtype wordmark is a strange
choice for a developer's index page. That is the point. Weirdness lives in the
type, the texture and the copy; the layout and the contrast stay well-behaved.

## Theme

Two readings of the same photograph, both shipped.

- **board** (default) — the page *is* the stained board. Dark brown-black
  ground, long vertical grain, marigold and bone letters, foliage green pushing
  in at the edges.
- **daylight** — the page is the day the sign was standing in. Overcast bone
  ground, the same foliage, mulch banked at the bottom, the letters now dark
  brown and deep gold *on* the light.

Board-first: `data-theme` is stamped on `<html>` by an inline script in
`index.html` before paint, defaulting to `dark`, and the choice persists in
`localStorage` under `cf-theme`. System preference is deliberately not consulted
— the board is the identity, daylight is opt-in via the nav toggle.

Atmosphere is four fixed layers behind the content, present in both themes:
`.board` (stain + three-pass wood grain), `.canopy` (blurred foliage crowding
the edges, 19s sway), `.straw` (feathered pine-straw bank along the bottom),
`.grain` (SVG noise, overlay).

## Color

Tokens live in `src/index.css`. Two layers: material constants sampled from the
photo in `@theme`, then semantic tokens in `:root` (board) and
`:root[data-theme='light']` (daylight). Components only ever reference the
semantic layer, so a component is written once and is correct in both themes.

### Material constants (never change per theme)

| Token | Value | Sampled from |
|---|---|---|
| `--paint-gold` | `#edb32a` | the marigold letters |
| `--paint-gold-deep` | `#b9760f` | their shaded edge |
| `--paint-green` | `#2d6b31` | the forest-green letters |
| `--paint-green-leaf` | `#9ecf6a` | new growth catching light |
| `--paint-bone` | `#f4e8c8` | the pale "WELCOME TO" letters |
| `--board-stain` | `#150e07` | the darkest stain |
| `--board-wood` | `#241708` | the board face |
| `--board-raised` | `#33220f` | where the plane skipped |
| `--fence-gray` | `#b9b0a0` | the weathered rails |
| `--straw-rust` | `#8a5a30` | pine straw and mulch |
| `--overcast` | `#eceadf` | the flat white sky |

### Semantic tokens

| Token | board | daylight | Role |
|---|---|---|---|
| `--color-bg` | `#150e07` | `#eceadf` | page ground |
| `--color-surface` | `#1d1309` | `#f6f3e9` | recessed surface (closed catalog rows, inputs) |
| `--color-surface-2` | `#2a1c0e` | `#fdfbf2` | raised surface (cards, open rows) |
| `--color-line` | `#4a3520` | `#cfc7b4` | borders, scrollbar thumb |
| `--color-line-soft` | bone 14% | ink 14% | inset top hairline on cards |
| `--color-ink` | `#f4e8c8` | `#241708` | primary text |
| `--color-ink-dim` | `#c0ab85` | `#5f5040` | secondary text |
| `--color-gold` | `#edb32a` | `#8a5b06` | accent: stats, active filters, links on hover |
| `--color-gold-strong` | `#f7c948` | `#6d4704` | the hero's second line |
| `--color-moss` | `#9ecf6a` | `#2d6b31` | live status, kickers, sprouts |
| `--color-moss-strong` | `#78b04c` | `#1f4f24` | hover borders, focus |
| `--color-straw` | `#c9793d` | `#7a4a26` | tertiary: trigger chips, catalog hover |
| `--color-fence` | `#b9b0a0` | `#6d6558` | reserved neutral |

Strategy: full-drench of one material (wood, or the daylight on it) with the
sign's own three paints as the only accents — gold, green, bone. Gray is never
used as a text color; secondary text is a dimmed version of the ground's own
warmth. The violet/aurora accent of the previous system is gone; the tertiary
accent is now pine-straw rust, which exists in the photo.

Contrast, checked against each theme's page ground: ink 15.7 / 14.5, ink-dim
8.6 / 6.4, gold 10.1 / 4.9, moss 10.6 / 5.3, straw 5.7 / 6.1. All body and
accent text clears WCAG AA in both themes.

## Typography

- Display: **Rye** via `--font-display` — hand-painted woodtype, the closest
  available match to the carved-and-painted letters on the board. Used only for
  the hero wordmark and section heads, never for body copy or anything below
  ~20px.
- Body: **Figtree** via `--font-body` — warm humanist sans, quiet enough to sit
  under the display face.
- Mono: **Space Mono** via `--font-mono` — labels, counts, slugs, nav, footer.
  Its quirks are on-brand; leave them.

Apply the display face with the `font-display` utility, **not**
`font-[var(--font-display)]` — Tailwind v4 resolves that arbitrary value to
`font-weight`, silently dropping the family.

Hero: `text-5xl sm:text-7xl` Rye, "Farmland" in `--color-gold-strong`, with the
`.painted` treatment. Section heads: Rye, `text-2xl`, lowercase, over a
`.brushrule` (a 2px gold→green brushed hairline, 7rem wide). Labels: mono,
10–12px, uppercase, 0.2–0.4em tracking. Body: 14–18px Figtree, relaxed leading,
`--color-ink-dim`.

`.painted` is the routed-sign effect: a hard dark shadow 1px below the glyph, a
soft one below that, plus a wide gold bloom in board mode; in daylight it flips
to a white top-bounce and a short brown drop, the way raised paint reads in flat
light.

## Components

- **AppCard**: rounded-2xl, 1px line border, surface-2/70, inset bone hairline
  along the top edge (the routed lip). Hover lifts -6px, border goes moss, and a
  blurred leaf-green orb blooms top-right. Coming-soon variant: dashed border,
  dimmed, no link.
- **CatalogCard**: rounded-xl accordion row; closed = circle icon + mono slug +
  truncated blurb, open = CircleDot, full blurb, args in gold, trigger chips in
  straw, source link. Hover border is straw; open border is moss.
- **PageCard** (back forty): moss kicker, medium-weight name, arrow nudge.
- **Filter pills**: rounded-full mono; active = gold border + gold/10 fill.
- **Stat**: mono gold number over a 10px uppercase tracked label.
- **Search**: rounded-full inset input, mono, search icon left.
- **ThemeToggle**: rounded-full mono pill in the nav, sun/moon icon plus the
  name of the *destination* theme ("daylight" / "board"). The word is hidden
  below `sm`; the icon and `aria-label` carry it.

Every grid child carries `min-w-0` — without it a long slug or blurb blows the
grid column out past the viewport instead of truncating.

## Motion

Library: `motion/react`. Entrances: fade + rise (y 18–24px), 0.6–0.9s, staggered
~0.08s per card, `whileInView` once with -60px margin. Hover: card lift, arrow
nudge, color transitions. Ambient: 19s canopy sway (the only looping animation;
the old starfield twinkle is gone with the night sky). Reduced motion: honored
via `MotionConfig reducedMotion="user"` and a `prefers-reduced-motion` block
that stops the sway.

## Layout

Single column, `max-w-5xl`, px-6. Hero fills ~70vh, then apps grid
(`sm:grid-cols-2`, gap-5), back forty, toolshed (gap-3 two-col), footer with a
top hairline. Section rhythm: mt-12 / mt-24 / mt-28.

## Voice

All-lowercase interface copy, farm-metaphor language ("the toolshed", "the back
forty", "nothing in this patch yet", "grown by marshall"). Keep it — the farm
metaphor and the Grayton material are not in conflict; the sign is a farm sign.
The slogan **nice dogs, strange people** sits in the footer of the index and of
both golf pages, in mono, gold, wide tracking. It is the brand line, not a
tagline for the product: the hero tagline stays "apps, tools, and writing.
entrypoint to the cosmic farmland".

## Charts

The golf pages ship their own chart tokens; the skin repaints them. Categorical
series are the sign's three paints — `--series-1` moss (the data), `--series-2`
gold (the emphasized line), `--series-3` straw — and the "under par" sequential
ramp (`--seq-*`, `--u*`) is a foliage ramp instead of the stock blue. The
over-par ramp (`--o*`) and `--critical` stay red: severity has to read as a
warning, and red is the one hue the photograph doesn't supply. That exception is
deliberate; don't "fix" it by making bad scores brown.

## Vault pages

`public/golf-skin.css` and `public/city-am-skin.css` carry the same palette,
fonts, atmosphere and footer to the golf pages. Those pages ship light-first
(bare `:root` = daylight, `[data-theme="dark"]` = board), the inverse of the
index — that's the vault page's own toggle and it stays that way. The injected
font links, atmosphere divs and footer live in `scripts/sync-vault.mjs`; the
published HTML in `public/` is stamped to match, with `?v=` hashes refreshed
whenever a skin changes.
