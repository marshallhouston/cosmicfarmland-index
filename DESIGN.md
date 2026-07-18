# Design

Visual system for cosmicfarmland.wtf, captured from the shipped code (src/index.css, src/App.jsx).

## Theme

Warm dark, dark-only. A midnight farm: indigo soil ground, aurora glow sky, harvest-gold moonlight. Atmosphere is built from four fixed layers behind the content: `.sky` (aurora radial mesh), `.stars` (twinkling starfield), `.grain` (SVG noise at 6% overlay), `.field` (horizon silhouette).

## Color

Tokens live in `@theme` in src/index.css. OKLCH not used; hex tokens are the committed identity.

| Token | Value | Role |
|---|---|---|
| `--color-void` | `#08070f` | page background |
| `--color-soil` | `#0e0b1d` | surface 1 |
| `--color-soil-2` | `#161031` | surface 2 (cards, open states) |
| `--color-haze` | `#241a45` | borders, scrollbar thumb |
| `--color-cream` | `#f1ead9` | primary text |
| `--color-cream-dim` | `#b6ad97` | secondary text |
| `--color-gold` | `#f3c364` | accent: headings, stats, active filters, selection |
| `--color-gold-deep` | `#d99b3e` | deep accent |
| `--color-glow` | `#8ce6b6` | bioluminescent accent: live status, kickers, hover glow |
| `--color-glow-deep` | `#4cc88a` | glow hover borders |
| `--color-violet` | `#a78be0` | tertiary accent: triggers, hover borders |

Strategy: committed warm-dark drench with two saturated accents (gold = harvest, glow-green = crops). Gray-on-color is avoided; secondary text is a dimmed cream of the same warmth.

## Typography

- Display: `Fraunces` (serif, light weights, italic for emphasis) via `--font-display`
- Body: `Familjen Grotesk` via `--font-body`
- Mono: `DM Mono` via `--font-mono` for labels, counts, slugs, footer

Hero: `text-6xl sm:text-8xl` Fraunces light, tracking-tight, gold italic on the second line, `glow-text` gold text-shadow. Labels: mono, 10-12px, uppercase, wide tracking (0.2-0.4em). Body: 14-18px Familjen Grotesk, relaxed leading, `--color-cream-dim`.

Note: Fraunces and DM Mono are on impeccable's reflex-reject list, but they are the shipped identity here; identity-preservation wins. Do not swap fonts on refinement passes.

## Components

- **AppCard**: rounded-2xl, 1px haze border, soil-2/60 bg, hover lifts -6px and shows a blurred glow orb top-right. Coming-soon variant: dashed border, dimmed, no link.
- **CatalogCard**: rounded-xl accordion row; closed = circle icon + slug + truncated blurb, open = CircleDot, full blurb, args, trigger chips, source link.
- **Filter pills**: rounded-full mono pills; active = gold border + gold/10 bg.
- **Stat**: mono gold number over 10px uppercase tracked label.
- **Search**: rounded-full inset input, mono, search icon left.

## Motion

Library: `motion/react`. Entrances: fade + rise (y 18-24px), 0.6-0.9s, staggered ~0.08s per card, `whileInView` once with -60px margin. Hover: card lift, arrow nudge, color transitions. Ambient: 7s star twinkle loop. Reduced motion: honored via `MotionConfig reducedMotion="user"` and a `prefers-reduced-motion` CSS block.

## Layout

Single column, `max-w-5xl`, px-6. Hero fills ~78vh, then apps grid (`sm:grid-cols-2`, gap-5), toolshed (gap-3 two-col), footer with top hairline. Section rhythm: mt-12 / mt-24 / mt-28.

## Voice

All-lowercase interface copy, farm-metaphor language ("the toolshed", "nothing in this patch yet", "grown by marshall"). Keep it.
