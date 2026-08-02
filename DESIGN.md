# Design — Grayton Beach

Visual system for cosmicfarmland.wtf.

## Where it lives

**`public/grayton.css` is the design system.** Tokens, type, the atmosphere
layers, the sign treatment and the interface chrome — one plain stylesheet, no
Tailwind at-rules, no build step, so any page can adopt it with one line:

```html
<link rel="stylesheet" href="https://cosmicfarmland.wtf/grayton.css">
<html data-theme="dark">   <!-- or "light"; board is the default -->
```

The SPA imports that same file from `src/index.css`, so there is exactly one
source of truth. Everything else is a consumer:

| File | Owns |
|---|---|
| `public/grayton.css` | the system: tokens, type, atmosphere, sign treatment, chrome |
| `public/grayton.html` | `/grayton` — the source photo and the system, built *with* the system |
| `src/index.css` | Tailwind entry: imports the system, maps its font namespace |
| `src/App.jsx` | the index's own components |
| `public/golf-skin.css` | maps the golf pages' token names onto Grayton, styles their components |
| `public/city-am-skin.css` | the City Am page's own components |

A page skin never redefines a system value. Note that the vault pages declare
their own tokens under `[data-theme=...]`, so a skin's mappings have to match
that specificity to win on source order — a bare `:root` loses.

## Origin

One photograph, and nothing else: a hand-painted **WELCOME TO GRAYTON BEACH**
sign. A long dark-stained board bolted to three weathered fence posts, standing
in a wall of wet Florida shrub over pine straw and bark mulch, shot on a flat
overcast morning.

Two things about that photo drive everything here, and both of them are easy to
get wrong from memory:

1. **The light is cool and the picture is desaturated.** The board is not
   chocolate brown — sampled, it runs `#4d484c` / `#46444b` / `#363841`, a
   near-neutral gray-brown. The painted green is `#547554`, a muted sage, not a
   leaf green. The mulch is `#524f45`, gray taupe, not rust. The fence posts are
   silver, `#9f9b97`. The only saturated thing in the entire frame is the
   marigold lettering, `#e9bb47`. That is why gold is the only loud color in
   this system and everything else is a warm neutral.
2. **The lettering is psychedelic, not woodtype.** "GRAYTON BEACH" is
   art-nouveau hand lettering — flared stems, blobby bowls, organic terminals,
   letters that bounce off the baseline and interlock. Every letter is a **cream
   outline** around a fill that runs **marigold at the top into sage at the
   bottom**. "WELCOME TO" is the same hand, smaller, in flat cream.

Every token below was sampled from those pixels. If a value ever needs to
change, sample the photo again — don't eyeball it.

The system answers to the town's slogan:

> **nice dogs, strange people**

Nice dogs = the interface is friendly, plainspoken, unguarded. Strange people =
the personality is not sanded off. Weirdness lives in the lettering, the texture
and the copy; the layout, the contrast and the interaction stay well-behaved.

## Theme

Two readings of the same photograph, both shipped.

- **board** (default) — the page *is* the stained board. The letters are painted
  straight onto it.
- **daylight** — the page is the overcast morning around the sign. The wordmark
  gets its own board to sit on, because a cream outline over a pale sky is no
  outline at all — and because a dark board in flat daylight is literally what
  the photo shows.

Board-first: `data-theme` is stamped on `<html>` by an inline script in
`index.html` before paint, defaults to `dark`, and persists in `localStorage`
under `cf-theme`. System preference is deliberately not consulted — the board is
the identity, daylight is opt-in via the nav toggle.

Atmosphere is four fixed layers behind the content, present in both themes:
`.board` (stain plus long grain running *along* the board, i.e. horizontal, the
way the real one does), `.canopy` (the shrub crowding the edges, 19s sway),
`.straw` (mulch banked and feathered along the bottom), `.grain` (film noise).

`public/board.jpg` is a seamless tile cut from a bare patch of the sign's own
board, mirrored four ways. It backs the daylight `.plank` so the wordmark sits on
photographed wood rather than a flat dark rectangle. It is deliberately *not*
tiled across the page: at full-viewport scale the repeat is obvious.

## Color

Two token layers in `public/grayton.css`: materials sampled from the photo,
then semantic tokens under `:root, :root[data-theme='dark']` (board) and
`:root[data-theme='light']` (daylight). Components reference only the semantic layer, so each component is
written once and is correct in both themes.

### Materials (sampled; never change per theme)

| Token | Value | Sampled from |
|---|---|---|
| `--paint-gold` | `#e9bb47` | the marigold letters, top half |
| `--paint-gold-deep` | `#b98a1e` | their shaded edge |
| `--paint-green` | `#547554` | the letters' bottom half |
| `--paint-cream` | `#f3e7c9` | the outline, and "WELCOME TO" |
| `--board-dark` | `#1b191c` | where the stain pooled |
| `--board` | `#322f34` | the board face |
| `--board-lit` | `#4d484c` | where the stain thinned |
| `--post` | `#9f9b97` | the weathered fence posts |
| `--post-shadow` | `#59575c` | their shadowed side |
| `--mulch` | `#524f45` | pine straw and bark |
| `--foliage-deep` | `#2e3a2b` | inside the shrub |
| `--foliage` | `#485c4b` | the leaf mass |
| `--foliage-lit` | `#718865` | leaves catching light |
| `--foliage-pale` | `#a7b79c` | new growth |
| `--overcast` | `#e4e5df` | the sky that morning |

### Semantic tokens

| Token | board | daylight | Role |
|---|---|---|---|
| `--color-bg` | `#2a2621` | `#e4e5df` | page ground |
| `--color-surface` | `#332e27` | `#eeefe9` | recessed surface (closed rows, inputs) |
| `--color-surface-2` | `#3d372f` | `#f8f8f3` | raised surface (cards, open rows) |
| `--color-line` | `#5b5346` | `#c8c8c0` | borders, scrollbar thumb |
| `--color-line-soft` | cream 12% | ink 12% | hairlines |
| `--color-ink` | `#f3e7c9` | `#24222a` | primary text |
| `--color-ink-dim` | `#c2b8a3` | `#575360` | secondary text |
| `--color-gold` | `#e9bb47` | `#7d5a0c` | active state, stats, links on hover |
| `--color-gold-strong` | `#f2c95f` | `#6e4f08` | emphasis |
| `--color-moss` | `#a8bd97` | `#3f5c3f` | live status, kickers, sprouts |
| `--color-moss-strong` | `#8aa87c` | `#2f4a30` | hover borders |
| `--color-post` | `#b4b0aa` | `#615e58` | tertiary neutral (trigger chips) |
| `--card-shadow` | inset cream lip | white lip + paper shadow | how a card sits on its ground |

The board ground is deliberately a step **warmer and deeper** than the sampled
board face. The sampled values stay in the materials layer, but a page painted
literally `#363841` reads as a black screen rather than as wood — so the ground
runs `#37322c → #2a2621 → #201d1a` with the shrub washing green in from the
edges. Warm wood and verdant green, which is what the photo *feels* like even
though a colour-picker on a single pixel doesn't say so.

Contrast against each theme's page ground: ink 11.8 / 12.4, ink-dim 7.4 / 5.9,
gold 8.1 / 5.0, moss 7.2 / 5.9, post 6.7 / 5.1. All body and accent text clears
WCAG AA in both themes, on the ground and on raised surfaces. `--paint-green` at 3.4 on the board is a *fill* color
only — it never carries text.

### Interaction language

Two accents, two jobs, everywhere:

- **moss** = alive and hoverable. Card hover borders, live dots, kickers, the
  sprout icon.
- **gold** = active and current. The open catalog row, the selected filter pill,
  focus rings, the search field in focus, stats.

Nothing else signals state. Gray-on-color is never used; secondary text is a
dimmed version of the ground's own warmth.

## Typography

- Display: **Amarante** via `--font-display` — art-nouveau, flared stems,
  organic curves. The closest available skeleton to the sign's hand. Used for
  the hero wordmark and section heads only, never for body copy.
- Body: **Figtree** via `--font-body` — warm humanist sans, quiet under the
  display face.
- Mono: **Space Mono** via `--font-mono` — labels, counts, slugs, nav, footer.
  Its quirks are on-brand; leave them.

The first pass of this system used Rye, a western woodtype. That was wrong: the
sign is psychedelic/nouveau, not Wild West. If the display face is ever
revisited, bake off candidates *against a crop of the photo* rather than from
description — the two lanes look nothing alike side by side.

Apply the display face with the `font-display` utility, **not**
`font-[var(--font-display)]` — Tailwind v4 resolves that arbitrary value to
`font-weight` and silently drops the family.

## The sign treatment

Three pieces reproduce how the board was painted. The CSS is in `grayton.css`,
so any page can use it — one `.glyph` per letter, `.glyph-space` for the gaps,
the per-letter rotation inline, all wrapped in `.plank`:

- **`.glyph`** — one per letter. Cream `-webkit-text-stroke` with
  `paint-order: stroke fill` so the outline sits behind the fill, over a
  `background-clip: text` gradient that runs `--paint-gold` to 34%, blends
  through `#8ea063`, and lands on `--paint-green` by 64%. Plus a hard drop
  shadow, because the letters are painted into routed wood. An `@supports` guard
  paints solid gold if `background-clip: text` is missing.
- **`SignWord`** (in `App.jsx`) — wraps each letter and applies a fixed rotation
  and vertical offset from `LETTER_JITTER`. Fixed, not random: the wordmark must
  be identical on every load. This is what separates "hand-painted" from "a font
  with an effect".
- **`.plank`** — the stained board. Padding, horizontal grain, a lit top edge, a
  shadow, and a 0.7° tilt. Daylight only.

The wordmark's visible letters are `aria-hidden` and `user-select: none`; an
`sr-only` "Cosmic Farmland" carries the accessible name and the copy buffer. The
`h1` computes to `heading "Cosmic Farmland" [level=1]`.

`.painted-cream` is the "WELCOME TO" treatment — flat cream with a carved edge —
used on section heads, and flipped to a white top-bounce in daylight.

## Components

- **AppCard**: rounded-2xl, 1px line border, surface-2/70, `--card-shadow` (a
  routed lip on the board, a paper lift in daylight). Hover lifts -6px, border
  goes moss, a blurred foliage orb blooms top-right, the arrow goes gold.
  Coming-soon variant: dashed border, dimmed, no link.
- **CatalogCard**: rounded-xl accordion row; closed = circle icon + mono slug +
  truncated blurb, open = gold border, gold CircleDot, full blurb, args in gold,
  trigger chips in post-gray. Grids use `items-start` so an open row doesn't
  stretch its neighbour into a tall empty box.
- **PageCard** (back forty): moss kicker, medium-weight name, arrow nudge.
- **Filter pills**: rounded-full mono; active = gold border + gold/10 fill.
- **Stat**: mono gold number over a 10px uppercase tracked label
  (`whitespace-nowrap`, so "apps live" doesn't break in half on a phone).
- **Search**: rounded-full inset input, mono, gold focus border. The WebKit
  clear button is repainted from its default blue system glyph to an ink X that
  goes gold on hover.
- **ThemeToggle**: rounded-full mono pill in the nav, sun/moon plus the name of
  the *destination* theme ("daylight" / "board"). The word is hidden below `sm`;
  the icon and `aria-label` carry it there.

Every grid child carries `min-w-0` — without it a long slug or blurb blows the
column out past the viewport instead of truncating.

## Motion

Library: `motion/react`. Entrances: fade + rise (y 18–24px), 0.6–0.9s, staggered
~0.08s per card, `whileInView` once with -60px margin. Hover: card lift, arrow
nudge, color transitions. Ambient: 19s canopy sway, the only looping animation.
Reduced motion: honored via `MotionConfig reducedMotion="user"` and a
`prefers-reduced-motion` block that stops the sway.

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
product tagline: the hero tagline stays "apps, tools, and writing. entrypoint to
the cosmic farmland".

## Charts

The golf pages ship their own chart tokens; the skin repaints them. Categorical
series are the sign's own paints — `--series-1` sage (the data), `--series-2`
gold (the emphasized line), `--series-3` post-gray — and the "under par"
sequential ramp (`--seq-*`, `--u*`) is a foliage ramp instead of the stock blue.
The over-par ramp (`--o*`) and `--critical` stay red: severity has to read as a
warning, and red is the one hue the photograph doesn't supply. That exception is
deliberate; don't "fix" it by making bad scores sage.

## Vault pages

`public/golf-skin.css` and `public/city-am-skin.css` carry the same palette,
fonts, atmosphere and footer to the golf pages. Those pages ship light-first
(bare `:root` = daylight, `[data-theme="dark"]` = board), the inverse of the
index — that's the vault page's own toggle and it stays that way. The injected
font links, `grayton.css`, the atmosphere divs and the slogan footer live in
`scripts/sync-vault.mjs`; the published HTML in `public/` is stamped to match,
with `?v=` hashes refreshed whenever a stylesheet changes.

A *new* vault page inherits the palette, type and atmosphere for free from
`grayton.css`, but its own components are its own problem: `golf-skin.css` is
written against the golf pages' class names. Give a genuinely different page its
own thin skin rather than widening the golf one.
