# Design — the sheet

The design system for cosmicfarmland.wtf. A herbarium sheet: cream card stock
running to all four edges with no frame, black ink, and each entry mounted as a
print card inside a ruled cell.

It replaced Grayton Beach, which was sampled off a photograph of a hand-painted
welcome sign. That system is not deleted: `/grayton` is still up as a record of
what the site used to be, `public/grayton.css` is kept for that one page, and
nothing else links it.

## Where it lives

- **`public/sheet.css`** is the system: tokens, the paper, the ruled grid, the
  print card, the accession label, light and dark. One plain stylesheet, no
  build step. Any page adopts it with one tag:

  ```html
  <link rel="stylesheet" href="https://cosmicfarmland.wtf/sheet.css">
  ```

- `src/index.css` imports the same file, so the SPA and the standalone pages
  cannot drift.
- `public/golf-skin.css` and `public/city-am-skin.css` sit on top and only map
  the vault pages' own token names and style their components.
- **The rules that govern this design are in `design-explore/`**, and they win
  over this document:
  - `DIRECTION.md` is the brief.
  - `TASTE.md` is the page owner's own reactions. It is binding and beats
    everything, including a critic and including this file.
  - `CRITIC.md` is the critique prompt, including the list of decisions that
    are settled and must not be re-argued.
  - `critiques/` logs every critic run with the screenshots it was given.
  - `rejected/` holds every variant that lost, by pass.

## Tokens

Declared three times on purpose. Bare `:root` is the light palette, a
`prefers-color-scheme` block guarded with `:not([data-theme="light"])` covers
the viewer who has chosen nothing, and a `[data-theme]` block lets an explicit
choice win in both directions.

| token | what it is |
|---|---|
| `--sheet` | the card stock the whole page is printed on |
| `--stock` | the print card mounted on it |
| `--card` | the browser's own ground behind the sheet |
| `--ink`, `--ink-2`, `--ink-3` | the ink scale, darkest to faintest |
| `--rule` | every rule on the sheet, one weight and one dilution |
| `--pad` | the measure. Anything that bleeds past the text column offsets by exactly this |
| `--font-body`, `--font-display`, `--font-mono` | the two faces |

## Two registers, and no third

A typewriter for the institution's own marks (the wordmark, accession numbers,
locality, the section registers) and one serif for everything a person reads.
`--font-display` is the same serif as the body on purpose: the sheet's display
voice is the typewriter, not a third face.

## After dark

The room goes dark, the sheet does not. The card stays cream paper with black
ink on it, and only what is printed straight onto the board turns pale. This is
the only reading where the specimens need no re-lighting: their surface never
changes, so `multiply` keeps working. On a dark card, pressed ink vanishes under
multiply and has to be inverted and screened.

## The print card

One window, one caption band, every specimen at one scale. The card is the fixed
object and the link; the cell around it is not clickable.

- The card takes the sheet's own tone. Made lighter it turns each scan's
  background into a visible rectangle inside the window.
- The card's height is fixed and the caption takes the depth it needs; the
  window absorbs the difference. Pinning the band instead leaves slack under a
  short blurb.
- Hinges are percentages of the specimen, so they are positioned against the
  specimen's own box and not the window it is centred in. The `.sizer` wrapper
  carries the specimen's aspect ratio, driven by width with the height derived.
  Give it a definite height and the ratio is ignored and every hinge drifts off
  its stem by half the letterbox.
- Specimens differ in form, never in size. Scaling them per growth habit was
  built and rejected.

## The ruled grid

A hairline divides the plates. It is deliberate and it is settled: it reads as a
ruled page rather than a frame, and it was chosen over four looser layouts. The
banned frame is one drawn around the whole page, not the divisions inside it.
Every rule on the sheet is one weight and one dilution, and every rule closes
the measure.

## The cosmic

Lyra, plotted from real right ascension and declination at the coordinate
printed on the colophon. It is never announced in words: the sheet's speckle
simply resolves, in one place, into a real constellation. The magnitude ramp is
capped, because at full scale Vega drew as a hard dot the size of a blemish and
readers took it for one.

## Voice

Lowercase throughout, plainspoken, few words. No copy whose job is to explain
the metaphor, justify the design, or state the idea. No tagline under the
wordmark. No gloss beside a section heading. The design carries the idea or the
idea is not worth having.

No em-dashes or en-dashes anywhere.

## Charts

The sheet is monochrome by choice, and the golf pages are the exception, because
their colour encodes data. Chart series, and birdie against bogey against
double, stay as a small deliberate functional palette darkened to sit on cream.
A scorecard that cannot separate a birdie from a double has lost the information
it exists to carry. Everything else on those pages, paper, ink, rules and type,
comes from the sheet.

## Vault pages

`scripts/sync-vault.mjs` injects `sheet.css` first and the page skins after it,
each with a content hash in the query string so a deploy cannot serve a stale
stylesheet. The skins live in this repo, not in the vault source, because that
source is regenerated wholesale.
