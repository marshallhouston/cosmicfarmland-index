import { useEffect, useMemo, useState } from 'react'
import appsData from '../data/apps.json'
import catalogData from '../data/catalog.json'
import golfData from '../data/golf.json'
import platesData from '../data/plates.json'
import specimens from '../public/specimens.json'

/* The sheet is styled entirely by public/sheet.css, imported through
   src/index.css. Nothing here carries presentation: the markup emits the class
   names that stylesheet governs, so the page and the standalone pages that link
   sheet.css cannot drift apart. */

const KINDS = [
  { id: 'skill', label: 'skills' },
  { id: 'command', label: 'commands' },
  { id: 'plugin', label: 'plugins' },
]

/* One deterministic hash, so the paper's blemishes are in the same place on
   every load and every machine. A real sheet's foxing does not move. */
const rnd = (i) => {
  const v = Math.sin(i * 127.1 + 4.7) * 43758.5453
  return v - Math.floor(v)
}

/* Four discrete clusters, not a scatter: foxing spreads from a point. */
const FOXING = [
  [9, 320, 74],
  [71, 86, 58],
  [36, 1268, 66],
  [88, 1540, 52],
]

function Foxing() {
  return FOXING.map(([left, top, size], c) => (
    <span key={c} className="fox" style={{ left: `${left}%`, top, width: size, height: size }}>
      {Array.from({ length: 11 }, (_, i) => {
        const sz = 1.4 + rnd(c * 40 + i) * 4.6
        return (
          <i
            key={i}
            style={{
              position: 'absolute',
              left: rnd(c * 40 + i + 7) * (size - sz),
              top: rnd(c * 40 + i + 19) * (size - sz),
              width: sz,
              height: sz,
              borderRadius: '50%',
              background: `rgba(122,86,36,${(0.16 + rnd(c * 40 + i + 31) * 0.3).toFixed(2)})`,
              filter: 'blur(.4px)',
            }}
          />
        )
      })}
    </span>
  ))
}

/* Lyra, at the coordinate printed on the colophon. Right ascension in hours,
   declination in degrees, visual magnitude. Nothing announces it: the sheet's
   speckle simply resolves, in one place, into a real constellation. The
   magnitude ramp is capped because at full scale Vega drew as a hard dot the
   size of a blemish, and readers took it for one. */
const LYRA = [
  [18.6156, 38.784, 0.03], [18.8347, 33.363, 3.52], [18.9824, 32.69, 3.24],
  [18.9135, 36.899, 4.22], [18.746, 37.605, 4.36], [18.7373, 39.67, 4.67],
  [18.7462, 39.613, 4.59], [18.3299, 36.064, 4.33], [19.2745, 38.134, 4.36],
  [19.2203, 39.146, 4.39], [19.1216, 36.099, 5.28], [18.8887, 36.966, 5.58],
  [19.0788, 32.548, 5.65], [18.5387, 32.552, 5.9], [19.2929, 32.884, 5.6],
  [18.4444, 37.594, 5.94], [19.1657, 38.984, 5.6], [18.6752, 34.437, 6.1],
]

function Field() {
  const W = 380
  const H = 220
  return (
    <div id="field" aria-hidden="true">
      {LYRA.map(([ra, dec, m], i) => (
        <i
          key={i}
          style={{
            left: ((19.4 - ra) / 1.15) * W,
            top: ((40.6 - dec) / 9.0) * H,
            width: Math.min(3.6, Math.max(1.4, (7.0 - m) * 0.55)),
            height: Math.min(3.6, Math.max(1.4, (7.0 - m) * 0.55)),
            opacity: Math.min(0.78, Math.max(0.34, (7.0 - m) * 0.13)),
          }}
        />
      ))}
    </div>
  )
}

/* A mounted print. The card is the link and the fixed object: one window, one
   caption band, every specimen at one scale. The tilt is a fraction of what the
   data carries, because ten cards at full tilt read as mess. */
function Plate({ no, kicker, name, blurb, href, loc, mount, lead }) {
  const spec = specimens[mount.specimen]
  const slug = loc && loc.replace(/-/g, ' ')
  return (
    <span className="sp">
      <a className="card" href={href} style={{ transform: `rotate(${(mount.rot * 0.42).toFixed(2)}deg)` }}>
        <span className="mount">
          {/* The hinges are percentages of the specimen, so they have to be
              positioned against the specimen's own box and not against the
              window. object-fit letterboxes inside the window, and without
              this wrapper every hinge drifts off its stem by whatever the
              letterbox is. */}
          <span className="sizer" style={{ aspectRatio: `${spec.w} / ${spec.h}` }}>
          <img
            className={`ph${mount.pale ? ' pale' : ''}`}
            src={`/specimens/${mount.specimen}.webp`}
            width={spec.w}
            height={spec.h}
            loading={lead ? 'eager' : 'lazy'}
            fetchPriority={lead ? 'high' : undefined}
            decoding="async"
            alt={mount.alt || ''}
          />
          {spec.hinges.map(([x, y, len, rot], j) => (
            <span
              key={j}
              className={`hinge h${(j % 3) + 1}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: len,
                height: 9 + (j % 3),
                transform: `translate(-50%,-50%) rotate(${rot}deg)`,
              }}
            />
          ))}
          </span>
        </span>
        <span className="lab">
          <span className="no">
            {no}
            {kicker ? <>&nbsp;&nbsp;/&nbsp;&nbsp;{kicker}</> : null}
          </span>
          <span className="name">{name}</span>
          <span className="d">{blurb}</span>
          {loc && slug !== name ? (
            <span className="fld">
              loc. <em>{loc}</em>
            </span>
          ) : null}
        </span>
      </a>
    </span>
  )
}

/* A full-width plate takes its own row; the rest pair up. */
function Rows({ plates, lead }) {
  const rows = []
  let pair = []
  const flush = () => {
    if (pair.length) {
      rows.push(pair)
      pair = []
    }
  }
  plates.forEach((p) => {
    if (p.mount.full) {
      flush()
      rows.push([p])
    } else {
      pair.push(p)
      if (pair.length === 2) flush()
    }
  })
  flush()
  return rows.map((row, i) => (
    <div className={`row${row.length === 1 && row[0].mount.full ? ' full' : ''}`} key={i}>
      {row.map((p) => (
        <Plate key={p.no} {...p} lead={i === 0 && lead} />
      ))}
    </div>
  ))
}

/* The blurbs are sentence-cased in the data because they are also read as
   prose in llms.txt. The sheet is lowercase throughout. */
const lower = (s) => (s || '').replace(/\.$/, '').toLowerCase()

function appPlates() {
  const bySlug = Object.fromEntries(appsData.apps.map((a) => [a.slug, a]))
  return platesData.order.apps
    .map((slug, i) => {
      const app = bySlug[slug]
      const mount = platesData.apps[slug]
      if (!app || app.status !== 'live' || !mount) return null
      return {
        no: `cf-${String(i + 1).padStart(3, '0')}`,
        name: app.name.toLowerCase(),
        blurb: lower(app.blurb),
        href: app.url,
        loc: app.url.startsWith('http')
          ? app.url.replace(/^https?:\/\//, '').replace(/\.cosmicfarmland\.wtf$/, '')
          : app.url,
        mount: { ...mount, alt: `a pressed specimen standing for ${app.name.toLowerCase()}` },
      }
    })
    .filter(Boolean)
}

function golfPlates(offset) {
  const bySlug = Object.fromEntries(golfData.pages.map((p) => [p.slug, p]))
  return platesData.order.golf
    .map((slug, i) => {
      const page = bySlug[slug]
      const mount = platesData.golf[slug]
      if (!page || !mount) return null
      return {
        no: `cf-${String(offset + i + 1).padStart(3, '0')}`,
        kicker: page.kicker,
        name: page.name.toLowerCase(),
        blurb: lower(page.blurb),
        href: page.url,
        loc: page.url,
        mount: { ...mount, alt: `a pressed specimen standing for ${page.name.toLowerCase()}` },
      }
    })
    .filter(Boolean)
}

/* The reader's own choice of light. Nothing stored means the sheet follows the
   system, which is what most readers want and what sheet.css does on its own;
   a stored choice writes data-theme and wins in both directions. */
function useLamp() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('cf-theme') || ''
    } catch {
      return ''
    }
  })
  useEffect(() => {
    const root = document.documentElement
    if (theme) root.setAttribute('data-theme', theme)
    else root.removeAttribute('data-theme')
    try {
      if (theme) localStorage.setItem('cf-theme', theme)
      else localStorage.removeItem('cf-theme')
    } catch {
      /* private windows and blocked site data: the sheet still renders */
    }
  }, [theme])
  return [theme, setTheme]
}

function Lamp() {
  const [theme, setTheme] = useLamp()
  const dark =
    theme === 'dark' ||
    (!theme &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  return (
    <button
      type="button"
      className="lamp"
      aria-label={dark ? 'light the sheet' : 'put the sheet under a dark room'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? 'daylight' : 'lamp'}
    </button>
  )
}

/* Toolshed filters live in the query string, so a filtered view is a link you
   can send someone. ?kind= is validated against KINDS, and unlike the old
   toolshed an absent kind now means all three registers rather than skills
   only: the sheet shows every entry it claims to hold. Old ?kind= links keep
   working. */
function initialFilters() {
  const p = new URLSearchParams(window.location.search)
  const kind = p.get('kind')
  return {
    kind: KINDS.some((k) => k.id === kind) ? kind : '',
    q: p.get('q') || '',
  }
}

export default function App() {
  const [initial] = useState(initialFilters)
  const [kind, setKind] = useState(initial.kind)
  const [q, setQ] = useState(initial.q)

  // replaceState, not pushState: filtering is not navigation, and a push per
  // keystroke would bury the back button. Defaults stay out of the URL so the
  // untouched page is a clean '/', and any #anchor is preserved.
  useEffect(() => {
    const p = new URLSearchParams()
    if (kind) p.set('kind', kind)
    if (q.trim()) p.set('q', q.trim())
    const qs = p.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`
    )
  }, [kind, q])

  const apps = useMemo(appPlates, [])
  const golf = useMemo(() => golfPlates(apps.length), [apps.length])

  const shed = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return KINDS.map((k) => ({
      ...k,
      entries: catalogData.entries
        .filter((e) => e.kind === k.id)
        .filter(
          (e) =>
            !needle ||
            e.slug.toLowerCase().includes(needle) ||
            e.name.toLowerCase().includes(needle) ||
            e.blurb.toLowerCase().includes(needle)
        ),
    })).filter((k) => !kind || k.id === kind)
  }, [kind, q])

  const found = shed.reduce((n, k) => n + k.entries.length, 0)

  return (
    <main className="sheet">
      <Foxing />

      <header className="head">
        <div className="stamp">cosmic farmland</div>
        <nav className="idx">
          <a href="#apps">apps</a>
          <a href="#golf">golf</a>
          <a href="#toolshed">toolshed</a>
          <a href="/plant-prints">plant prints</a>
          <Lamp />
        </nav>
      </header>

      <section className="reg" id="apps">
        <h2>apps</h2>
        <div className="plate">
          <Rows plates={apps} lead />
          <Field />
        </div>
      </section>

      <section className="reg" id="golf">
        <h2>golf</h2>
        <div className="plate">
          <Rows plates={golf} />
        </div>
      </section>

      <section className="reg" id="toolshed">
        <h2>
          toolshed
          <span className="ct">
            {catalogData.counts.skill} skills, {catalogData.counts.command} commands,{' '}
            {catalogData.counts.plugin} plugins
          </span>
        </h2>

        <div className="sift">
          <input
            type="search"
            aria-label="search the toolshed"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search"
          />
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={kind === k.id}
              className={kind === k.id ? 'on' : ''}
              onClick={() => setKind(kind === k.id ? '' : k.id)}
            >
              {k.label}
            </button>
          ))}
        </div>

        {shed.map((k) => (
          <div className="shed" key={k.id}>
            <h3>{k.label}</h3>
            {k.entries.map((e) => (
              <a key={`${e.kind}-${e.slug}`} href={e.source}>
                <b>{e.slug}</b>
                <span>{lower(e.blurb)}</span>
              </a>
            ))}
          </div>
        ))}

        {found === 0 && <p className="empty">nothing in this patch yet.</p>}
      </section>

      <div className="colwrap">
        <div className="col">
          <div className="hd">cosmic farmland</div>
          <div>
            <span>acc.</span>
            <em>cf 2026 / 001-{String(apps.length + golf.length).padStart(3, '0')}</em>
          </div>
          <div>
            <span>coll.</span>
            <em>m. houston</em>
          </div>
          <div>
            <span>loc.</span>
            <em>cosmicfarmland.wtf</em>
          </div>
          <div>
            <span>field</span>
            <em>18h 36m 56s &nbsp;+38&deg; 47&prime; 01&Prime;</em>
          </div>
          <div>
            <span>det.</span>
            <em>m. houston, 2026</em>
          </div>
        </div>
      </div>

      <footer>
        <a href="https://github.com/marshallhouston/cosmic-farmland">
          cosmicfarmland.wtf / source on github
        </a>
      </footer>
    </main>
  )
}
