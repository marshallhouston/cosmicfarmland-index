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
<meta property="og:image" content="${origin}/sheet.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="text/markdown" href="${origin}/${slug}.md">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@300;400&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/sheet.css">
<style>
  /* Layout only. Every colour, face and rule comes from sheet.css: this is a
     page of the same sheet, set as one column of prose instead of a grid of
     mounted plates. */
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--sheet); color: var(--ink);
         font-family: Spectral, Georgia, serif; font-weight: 300;
         -webkit-font-smoothing: antialiased; }
  .wrap { position: relative; z-index: 4; max-width: 40rem;
          margin: 0 auto; padding: 0 var(--pad) 8rem; }
  nav.top { display: flex; gap: 1.5rem; padding: 30px 0 15px;
            border-bottom: 1px solid var(--rule); margin-bottom: 3.5rem;
            font-family: "IBM Plex Mono", monospace;
            font-size: 10px; letter-spacing: 0.24em; }
  nav.top a { color: var(--ink-3); text-decoration: none; }
  nav.top a:hover { color: var(--ink); }
  h1 { font-family: "IBM Plex Mono", monospace; font-weight: 500;
       font-size: 19px; letter-spacing: 0.34em; text-transform: lowercase;
       margin: 0 0 2.5rem; color: var(--ink); }
  h2 { font-family: "IBM Plex Mono", monospace; font-weight: 500;
       font-size: 10px; letter-spacing: 0.3em; text-transform: lowercase;
       margin: 3rem 0 0.8rem; color: var(--ink); }
  p, li { font-size: 15px; line-height: 1.7; color: var(--ink-2); max-width: 62ch; }
  ul { padding-left: 1.1rem; }
  li { margin-bottom: 0.5rem; }
  code { font-family: "IBM Plex Mono", monospace; font-size: 0.85em; color: var(--ink); }
  a.inline { color: inherit; border-bottom: 1px solid var(--rule); text-decoration: none; }
  a.inline:hover { border-bottom-color: var(--ink); }
  footer { margin-top: 5rem; padding-top: 1.6rem; border-top: 1px solid var(--rule);
           display: flex; flex-wrap: wrap; gap: 0.8rem; justify-content: space-between;
           font-family: "IBM Plex Mono", monospace; font-size: 9px;
           letter-spacing: 0.15em; color: var(--ink-3); }
  footer a { color: inherit; text-decoration: none;
             border-bottom: 1px solid var(--rule); }
  footer a:hover { color: var(--ink); }
  footer .slogan { letter-spacing: 0.28em; }
</style>
</head>
<body>
<div class="sheet">
<div class="wrap">
  <nav class="top"><a href="/">&#8592; cosmic farmland</a></nav>
  <main>
${renderMarkdown(md)}
  </main>
  <footer>
    <span>grown by marshall</span>
    <span><a href="/about">about</a> &#183; <a href="/contact">contact</a> &#183; <a href="/privacy">privacy</a> &#183; <a href="/llms.txt">llms.txt</a></span>
  </footer>
</div>
</div>
</body>
</html>
`
}
