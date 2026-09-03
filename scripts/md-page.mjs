// Render a content/*.md file into a standalone HTML page on the Grayton Beach
// skin. The markdown is the source of truth: the same file is copied to
// public/<slug>.md and served to agents that ask for text/markdown, so the HTML
// and the markdown variant can never drift.
//
// The renderer only covers what the trust pages use: h1, h2, bullet lists,
// paragraphs, links, bold, inline code. Anything richer belongs in a hand-built
// page like grayton.html, not here.
const esc = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="inline" href="$2">$1</a>')

export function renderMarkdown(md) {
  const out = []
  // Blank lines separate blocks; single newlines inside a block are soft wraps.
  for (const block of md.trim().split(/\n{2,}/)) {
    const lines = block.split('\n')
    if (lines[0].startsWith('# ')) out.push(`<h1>${inline(lines[0].slice(2))}</h1>`)
    else if (lines[0].startsWith('## ')) out.push(`<h2>${inline(lines[0].slice(3))}</h2>`)
    else if (lines[0].startsWith('- ')) {
      // A continuation line (indented, no leading dash) belongs to the item above.
      const items = []
      for (const line of lines) {
        if (line.startsWith('- ')) items.push(line.slice(2))
        else items[items.length - 1] += ' ' + line.trim()
      }
      out.push(`<ul>${items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`)
    } else out.push(`<p>${inline(lines.join(' '))}</p>`)
  }
  return out.join('\n')
}

// First heading and first paragraph double as <title> and meta description.
export function pageMeta(md) {
  const title = md.match(/^# (.+)$/m)?.[1] ?? 'cosmic farmland'
  const body = md.replace(/^#.*$/gm, '').trim().split(/\n{2,}/)[0]
  return { title, description: body.replace(/\s+/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') }
}

export function htmlPage(md, { slug, origin }) {
  const { title, description } = pageMeta(md)
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — cosmicfarmland.wtf</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${origin}/${slug}">
<meta property="og:title" content="${esc(title)} — cosmicfarmland.wtf">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${origin}/${slug}">
<meta property="og:image" content="${origin}/grayton-beach.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="text/markdown" href="${origin}/${slug}.md">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#127793;</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amarante&family=Figtree:ital,wght@0,300..800;1,300..800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/grayton.css">
<style>
  /* Layout only. Every colour, face and texture comes from grayton.css. */
  * { box-sizing: border-box; }
  body { margin: 0; font-family: var(--font-body); color: var(--color-ink);
         background: var(--color-surface); -webkit-font-smoothing: antialiased; }
  .wrap { position: relative; z-index: 1; max-width: 46rem; margin: 0 auto; padding: 0 1.5rem 8rem; }
  nav.top { display: flex; gap: 1.5rem; padding: 2rem 0 0; font-family: var(--font-mono);
            font-size: 0.72rem; letter-spacing: 0.25em; }
  nav.top a { color: var(--color-moss); text-decoration: none; }
  nav.top a:hover { color: var(--color-gold); }
  h1 { font-family: var(--font-display); font-weight: 400; text-transform: lowercase;
       font-size: clamp(2rem, 7vw, 3.2rem); margin: 3rem 0 1.5rem; color: var(--color-gold); }
  h2 { font-family: var(--font-display); font-weight: 400; text-transform: lowercase;
       font-size: 1.6rem; margin: 3rem 0 0.6rem; }
  p, li { line-height: 1.75; color: var(--color-ink-dim); max-width: 62ch; }
  ul { padding-left: 1.1rem; }
  li { margin-bottom: 0.5rem; }
  code { font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-ink); }
  a.inline { color: var(--color-gold); text-underline-offset: 3px; }
  footer { margin-top: 5rem; padding-top: 1.6rem; border-top: 1px solid var(--color-line);
           display: flex; flex-wrap: wrap; gap: 0.8rem; justify-content: space-between;
           font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.1em;
           text-transform: uppercase; color: var(--color-ink-dim); }
  footer a { color: var(--color-moss); text-decoration: none; }
  footer a:hover { color: var(--color-gold); }
  footer .slogan { color: var(--color-gold); letter-spacing: 0.28em; }
</style>
</head>
<body>
<div class="board"></div><div class="canopy"></div><div class="straw"></div><div class="grain"></div>
<div class="wrap">
  <nav class="top"><a href="/">&#8592; cosmic farmland</a></nav>
  <main>
${renderMarkdown(md)}
  </main>
  <footer>
    <span>grown by marshall</span>
    <span><a href="/about">about</a> &#183; <a href="/contact">contact</a> &#183; <a href="/privacy">privacy</a> &#183; <a href="/llms.txt">llms.txt</a></span>
    <span class="slogan">nice dogs, strange people</span>
  </footer>
</div>
</body>
</html>
`
}
