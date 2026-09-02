import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoFragment } from './scripts/seo-fragment.mjs'

// Inject a plain-HTML mirror of the farm into #root at build time, so a crawler
// or no-JS client sees real content instead of an empty div. React's createRoot
// clears #root on mount; a .js-gated style (in index.html) hides it before
// paint, so JS clients never see it. Build-only: dev keeps the live SPA.
function seoPrerender() {
  return {
    name: 'seo-prerender',
    apply: 'build',
    transformIndexHtml(html) {
      const tagline = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''
      return html.replace(
        '<div id="root"></div>',
        `<div id="root">${seoFragment(tagline)}</div>`,
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPrerender()],
})
