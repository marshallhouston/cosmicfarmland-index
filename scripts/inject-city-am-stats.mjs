// The scoring-breakdown and per-hole detail tables at the foot of the City Am
// page. Kept out of sync-vault.mjs (and out of the vault source) because the
// render block is itself full of template literals - storing it as raw partial
// files sidesteps a wall of backtick escaping and keeps the sync script's copy
// byte-identical to the committed public/ copy.
//
// Three separate steps, one per anchor, so a moved anchor warns on its own
// rather than silently dropping the whole feature.
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const read = (f) => readFileSync(join(HERE, 'city-am-stats', f), 'utf8').replace(/\n$/, '')

export const STATS_CSS = read('styles.css')
export const STATS_SECTIONS = read('sections.html')
export const STATS_SCRIPT = read('render.js')

export const statsSteps = [
  ['scoring detail styles', (h) => h.replace('</style>', `${STATS_CSS}\n</style>`)],
  ['scoring detail sections', (h) => h.replace('<footer class="foot">', `${STATS_SECTIONS}\n\n<footer class="foot">`)],
  ['scoring detail script', (h) => h.replace('// ---- moments ----', `${STATS_SCRIPT}\n\n// ---- moments ----`)],
]

export const injectCityAmStats = (h) => statsSteps.reduce((acc, [, fn]) => fn(acc), h)
