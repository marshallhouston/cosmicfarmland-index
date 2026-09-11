// Generate public/herbarium.html: every specimen the sheet holds, as itself.
//
// On the index a specimen is a stand-in, mounted on a plate so an app has a
// face. Here it is the subject. The two pages read the same data from opposite
// ends, which is why this is generated rather than hand-built: specimens.json
// already knows each scan's box and hinge placement, so a rescan moves the
// hinges on both pages at once, and herbarium.json carries the only thing the
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
const { gardens, specimens: entries } = read('data', 'herbarium.json')
const boxes = read('public', 'specimens.json')
const plates = read('data', 'plates.json')

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

// Which specimens the index has mounted, so the label can say so. A mounted
// specimen is doing a second job, and the herbarium is where you find out.
const mounted = {}
for (const group of ['apps', 'golf'])
  for (const [slug, m] of Object.entries(plates[group])) mounted[m.specimen] = slug

function card(e, i) {
  const box = boxes[e.id]
  if (!box) throw new Error(`${e.id} is in herbarium.json but not specimens.json`)
  const hinges = box.hinges
    .map(
      ([x, y, len, rot], j) =>
        `<span class="hinge h${(j % 3) + 1}" style="left:${x}%;top:${y}%;width:${len}px;height:${
          9 + (j % 3)
        }px;transform:translate(-50%,-50%) rotate(${rot}deg)"></span>`
    )
    .join('')
  const beds = e.beds.map((b) => gardens[b]).filter(Boolean)
  // Deterministic, from the accession number: a real sheet's plates are not
  // square to the board, but they do not move between visits either.
  const rot = (((i * 37) % 13) / 13 - 0.5) * 2.2
  return `<div class="sp">
  <div class="card" style="transform:rotate(${rot.toFixed(2)}deg)">
    <span class="mount">
      <span class="sizer" style="aspect-ratio:${box.w} / ${box.h}">
        <img class="ph" src="/specimens/${e.id}.webp" width="${box.w}" height="${box.h}"
             loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async"
             alt="a pressed and dried ${esc(e.name)} specimen">${hinges}
      </span>
    </span>
    <span class="lab">
      <span class="no">hb-${String(i + 1).padStart(3, '0')}${
        mounted[e.id] ? `&nbsp;&nbsp;/&nbsp;&nbsp;mounted` : ''
      }</span>
      <span class="name">${esc(e.name)}</span>
      <span class="sci">${esc(e.latin)}</span>
      <span class="d">${esc(e.note)}</span>
      ${
        beds.length
          ? `<span class="fld">bed. <em>${beds.map(esc).join(' &middot; ')}</em></span>`
          : '<span class="fld">bed. <em>not planted</em></span>'
      }
    </span>
  </div>
</div>`
}

const planted = entries.filter((e) => e.beds.length).length
const description = `Every specimen on cosmicfarmland.wtf, as itself: ${planted} plants growing in the beds at the house, pressed, scanned and mounted.`

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>herbarium — cosmicfarmland.wtf</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${ORIGIN}/herbarium">
<meta property="og:title" content="herbarium — cosmicfarmland.wtf">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${ORIGIN}/herbarium">
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
  .wrap { position: relative; z-index: 4; max-width: 1240px;
          margin: 0 auto; padding: 0 var(--pad) 6rem; }
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
  /* auto-fill, so a narrow window drops to one column instead of clipping the
     card: sheet.css fixes the card at 392px and the sheet clips its overflow. */
  .beds { display: grid; gap: 0;
          grid-template-columns: repeat(auto-fill, minmax(min(392px, 100%), 1fr));
          border-top: 1px solid var(--rule); margin-top: 2.6rem; }
  .beds .sp { padding: 40px 24px 44px; border-bottom: 1px solid var(--rule); }
  /* sheet.css fixes the card at 452px, which is right for the index: every
     plate carries the same three lines. Here the label also carries a binomial
     and a list of beds, and a plant in four gardens ran off the bottom edge.
     Let the card take the height its label needs, with the index's height as
     the floor so a one-bed card still reads as the same object. */
  .beds .card { height: auto; min-height: 452px; padding-bottom: 4px; }
  .beds .card .mount { min-height: 300px; }
  /* The binomial, which the index has no room for and no use for. */
  .lab .sci { display: block; font-style: italic; font-size: 13px;
              line-height: 1.3; color: var(--ink-3); margin-top: 2px; }
  .lab .fld em { font-style: normal; }
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
    <h1>herbarium</h1>
    <p>The index mounts a specimen on every plate, standing in for an app. These are
    the specimens themselves. All but one grow in the beds at the house, from the
    Garden in a Box plantings listed on each label, and each was pressed, scanned
    and hinged to its card the same way.</p>
  </header>
  <main class="beds">
${entries.map(card).join('\n')}
  </main>
  <footer>
    <span>${entries.length} specimens &#183; ${planted} in the beds</span>
    <span><a href="/">index</a> &#183; <a href="/about">about</a> &#183; <a href="/contact">contact</a> &#183; <a href="/llms.txt">llms.txt</a></span>
    <span class="slogan">nice dogs, strange people</span>
  </footer>
</div>
</div>
</body>
</html>
`

writeFileSync(join(REPO, 'public', 'herbarium.html'), html)
console.log(`wrote herbarium.html (${entries.length} specimens, ${planted} in the beds)`)
