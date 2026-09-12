// Generate public/plant-prints.html: every specimen the sheet holds, as itself.
//
// On the index a specimen is a stand-in, mounted on a plate so an app has a
// face. Here it is the subject. The two pages read the same data from opposite
// ends, which is why this is generated rather than hand-built: specimens.json
// already knows each scan's box and hinge placement, so a rescan moves the
// hinges on both pages at once, and plant-prints.json carries the only thing the
// sheet never needed, which is what the plant actually is.
//
// The cards are sheet.css's own .sp .card geometry, not a second set of styles.
// Only the grid that holds them is new: the index pairs plates two to a ruled
// row, and 32 specimens want a gallery instead.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...p) => JSON.parse(readFileSync(join(REPO, ...p), 'utf8'))

const ORIGIN = 'https://cosmicfarmland.wtf'
const { gardens, specimens: entries } = read('data', 'plant-prints.json')
const boxes = read('public', 'specimens.json')

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

function card(e, i) {
  const box = boxes[e.id]
  if (!box) throw new Error(`${e.id} is in plant-prints.json but not specimens.json`)
  const hinges = box.hinges
    .map(
      ([x, y, len, rot], j) =>
        `<span class="hinge h${(j % 3) + 1}" style="left:${x}%;top:${y}%;width:${len}px;height:${
          9 + (j % 3)
        }px;transform:translate(-50%,-50%) rotate(${rot}deg)"></span>`
    )
    .join('')
  // Name only. The binomial, the note and the beds are still in the data,
  // where they caption the image for a reader who cannot see it and feed the
  // page's description, but four to a row there is no room for any of it and
  // the plants are the point.
  return `<div class="sp">
  <div class="card">
    <span class="mount">
      <span class="sizer" style="aspect-ratio:${box.w} / ${box.h}">
        <img class="ph" src="/specimens/${e.id}.webp" width="${box.w}" height="${box.h}"
             loading="${i < 8 ? 'eager' : 'lazy'}" decoding="async"
             alt="a pressed and dried ${esc(e.name)} specimen, ${esc(e.latin)}">${hinges}
      </span>
    </span>
    <span class="lab"><span class="name">${esc(e.name)}</span></span>
  </div>
</div>`
}

const description = `The ${entries.length} plants growing around the yard at cosmicfarmland.wtf, each one pressed, scanned and hinged to its card.`

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>plant prints — cosmicfarmland.wtf</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${ORIGIN}/plant-prints">
<meta property="og:title" content="plant prints — cosmicfarmland.wtf">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${ORIGIN}/plant-prints">
<meta property="og:image" content="${ORIGIN}/sheet.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@300;400&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/sheet.css">
<style>
  /* Layout only. The cards, the hinges, the paper and the type are sheet.css's,
     and this page must not grow a second opinion about any of them. */
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--sheet); color: var(--ink);
         font-family: var(--font-body); font-weight: 300;
         -webkit-font-smoothing: antialiased; }
  /* .sheet already carries --pad, which centres the 1240px measure the index
     uses. Repeating it here paid the gutter twice and left 968px of grid:
     three columns where four fit. Vertical padding only. */
  .wrap { position: relative; z-index: 4; padding: 0 0 6rem; }
  nav.top { display: flex; gap: 1.5rem; padding: 30px 0 15px;
            border-bottom: 1px solid var(--rule);
            font-family: var(--font-mono); font-size: 10px; letter-spacing: .24em; }
  nav.top a { color: var(--ink-3); text-decoration: none; }
  nav.top a:hover { color: var(--ink); }
  header.h { padding: 3.5rem 0 0; }
  h1 { font-family: var(--font-mono); font-weight: 500; font-size: 19px;
       letter-spacing: .34em; text-transform: lowercase; margin: 0; color: var(--ink); }
  header.h p { font-size: 15px; line-height: 1.7; color: var(--ink-2);
               max-width: 52ch; margin: 1.2rem 0 0; }
  /* Four to a row on a normal screen, dropping a column at a time as the
     window narrows. minmax with min() rather than a fixed track, so the last
     column collapses instead of clipping: sheet.css fixes the card at 392px
     and the sheet clips its overflow. */
  .beds { display: grid; gap: 0;
          grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
          border-top: 1px solid var(--rule); margin-top: 2.6rem; }
  .beds .sp { padding: 18px 12px 22px; }
  /* The index's card is one fixed object, 392 by 452, because a plate there
     carries three lines of catalogue. Here the card is a frame around a print
     and nothing else, so it takes the column's width and the height its
     specimen needs. No tilt either: a wall of tilted frames is noise, and at
     this size the rotation only cost the plants their alignment. */
  .beds .card { width: 100%; height: auto; padding: 14px 14px 0; }
  .beds .card .mount { height: 200px; min-height: 0; }
  .beds .card .lab { padding: 10px 0 12px; }
  .beds .card .lab .name { font-size: 15px; line-height: 1.2; }
  /* No rule of its own: the grid already closes on one, and two hairlines with
     four rems of nothing between them read as a mistake. */
  footer { margin-top: 1.6rem; padding-top: 0; border-top: 0;
           display: flex; flex-wrap: wrap; gap: .8rem; justify-content: space-between;
           font-family: var(--font-mono); font-size: 9px;
           letter-spacing: .15em; color: var(--ink-3); }
  footer a { color: inherit; text-decoration: none; border-bottom: 1px solid var(--rule); }
  footer a:hover { color: var(--ink); }
  footer .slogan { letter-spacing: .28em; }
</style>
</head>
<body>
<div class="sheet">
<div class="wrap">
  <nav class="top"><a href="/">&#8592; cosmic farmland</a></nav>
  <header class="h">
    <h1>plant prints</h1>
    <p>Plants from around the yard. Yay for low-water and native plants that make
    pollinators happy.</p>
  </header>
  <main class="beds">
${entries.map(card).join('\n')}
  </main>
  <footer>
    <span>${entries.length} prints</span>
    <span><a href="/">index</a> &#183; <a href="/about">about</a> &#183; <a href="/contact">contact</a> &#183; <a href="/llms.txt">llms.txt</a></span>
    <span class="slogan">nice dogs, strange people</span>
  </footer>
</div>
</div>
</body>
</html>
`

writeFileSync(join(REPO, 'public', 'plant-prints.html'), html)
console.log(`wrote plant-prints.html (${entries.length} prints)`)
