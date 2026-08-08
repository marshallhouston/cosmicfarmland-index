import { useEffect, useMemo, useState } from 'react'
import { motion, MotionConfig } from 'motion/react'
import {
  ArrowUpRight,
  Sprout,
  Terminal,
  Puzzle,
  Wand2,
  Search,
  Circle,
  CircleDot,
  Flag,
  Sun,
  Moon,
} from 'lucide-react'
import appsData from '../data/apps.json'
import catalogData from '../data/catalog.json'
import golfData from '../data/golf.json'

const KINDS = [
  { id: 'skill', label: 'Skills', icon: Wand2 },
  { id: 'command', label: 'Commands', icon: Terminal },
  { id: 'plugin', label: 'Plugins', icon: Puzzle },
]

/** Board (dark) is the default reading of the sign; daylight is the other one. */
function useTheme() {
  const [theme, setTheme] = useState(
    () =>
      (typeof document !== 'undefined' && document.documentElement.dataset.theme) ||
      'dark'
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('cf-theme', theme)
    } catch {
      /* private mode: the board just comes back next visit */
    }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

function ThemeToggle() {
  const [theme, toggle] = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'switch to daylight' : 'switch to the board'}
      className="ml-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
    >
      {dark ? <Sun size={13} aria-hidden="true" /> : <Moon size={13} aria-hidden="true" />}
      <span className="hidden sm:inline">{dark ? 'daylight' : 'board'}</span>
    </button>
  )
}

/* No two letters on the sign sit on the same baseline or the same angle.
   Fixed offsets, not random ones, so the wordmark is the same every load. */
const LETTER_JITTER = [
  [-2, 2], [1.5, -3], [-1, 1.5], [2, -1.5], [-1.5, 3], [1, -2], [-2.5, 1],
  [1.8, 2], [-1.2, -1.5], [2.2, 1.5], [-1.8, -2], [1, 3], [-2, -1],
]

/** A hand-lettered word: cream outline, marigold-into-sage fill, per-letter bounce. */
function SignWord({ children, offset = 0 }) {
  return [...children].map((ch, i) => {
    if (ch === ' ') return <span key={i} className="glyph-space" aria-hidden="true"> </span>
    const [rot, dy] = LETTER_JITTER[(i + offset) % LETTER_JITTER.length]
    return (
      <span
        key={i}
        className="glyph"
        style={{ transform: `rotate(${rot}deg) translateY(${dy}px)` }}
      >
        {ch}
      </span>
    )
  })
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-2xl text-[var(--color-gold)]">{value}</span>
      <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-dim)]">
        {label}
      </span>
    </div>
  )
}

function SectionHead({ icon: Icon, tint, children }) {
  return (
    <div className="mb-6">
      <h2 className="painted-cream flex items-center gap-3 font-display text-2xl lowercase text-[var(--color-ink)]">
        <Icon size={17} aria-hidden="true" className={tint} /> {children}
      </h2>
      <div className="brushrule mt-3 w-28" />
    </div>
  )
}

function PageCard({ page, index }) {
  return (
    <motion.a
      href={page.url}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group flex h-full min-w-0 flex-col gap-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)]/70 px-5 py-4 shadow-[var(--card-shadow)] transition-colors hover:border-[var(--color-moss-strong)]"
    >
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-moss)]">
        {page.kicker}
      </span>
      <span className="flex items-center gap-2 text-lg font-medium text-[var(--color-ink)]">
        {page.name}
        <ArrowUpRight
          size={15}
          aria-hidden="true"
          className="text-[var(--color-ink-dim)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
      <span className="text-sm text-[var(--color-ink-dim)]">{page.blurb}</span>
    </motion.a>
  )
}

function AppCard({ app, index }) {
  const live = app.status === 'live'
  const Body = live ? motion.a : motion.div
  const props = live ? { href: app.url } : {}
  return (
    <Body
      {...props}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={live ? { y: -6 } : {}}
      className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-colors ${
        live
          ? 'cursor-pointer border-[var(--color-line)] bg-[var(--color-surface-2)]/70 shadow-[var(--card-shadow)] hover:border-[var(--color-moss-strong)]'
          : 'border-dashed border-[var(--color-line)]/70 bg-[var(--color-surface)]/50'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: live ? 'var(--foliage-lit)' : 'transparent' }}
      />
      <div className="mb-4 flex items-center justify-between">
        <Sprout
          aria-hidden="true"
          className={live ? 'text-[var(--color-moss)]' : 'text-[var(--color-ink-dim)]'}
          size={22}
        />
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
            live ? 'text-[var(--color-moss)]' : 'text-[var(--color-ink-dim)]'
          }`}
        >
          {live ? '● live' : '○ soon'}
        </span>
      </div>
      <h3 className="mb-2 text-2xl font-semibold leading-tight tracking-tight">
        {app.name}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-[var(--color-ink-dim)]">
        {app.blurb}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-3">
        {(app.tags || []).map((t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--color-line)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-dim)]"
          >
            {t}
          </span>
        ))}
        {live && (
          <ArrowUpRight
            size={18}
            className="ml-auto text-[var(--color-ink-dim)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-gold)]"
          />
        )}
      </div>
    </Body>
  )
}

function CatalogCard({ entry }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`min-w-0 rounded-xl border transition-colors ${
        open
          ? 'border-[var(--color-gold)] bg-[var(--color-surface-2)]/90'
          : 'border-[var(--color-line)] bg-[var(--color-surface)]/70 hover:border-[var(--color-moss-strong)]'
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        {open ? (
          <CircleDot size={16} aria-hidden="true" className="mt-1 shrink-0 text-[var(--color-gold)]" />
        ) : (
          <Circle size={16} aria-hidden="true" className="mt-1 shrink-0 text-[var(--color-ink-dim)]" />
        )}
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="shrink-0 font-mono text-sm text-[var(--color-ink)]">{entry.slug}</span>
            <span className="truncate text-sm italic text-[var(--color-ink-dim)]">
              {entry.name}
            </span>
          </span>
          {!open && (
            <span className="mt-1 block truncate text-xs text-[var(--color-ink-dim)]">
              {entry.blurb}
            </span>
          )}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pl-11">
          <p className="mb-3 text-sm leading-relaxed text-[var(--color-ink)]">{entry.blurb}</p>
          {entry.argumentHint && (
            <p className="mb-3 font-mono text-xs text-[var(--color-gold)]">
              args: {entry.argumentHint}
            </p>
          )}
          {entry.triggers?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {entry.triggers.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)]/70 px-2 py-0.5 font-mono text-[11px] text-[var(--color-post)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <a
            href={entry.source}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-gold)]"
          >
            view source <ArrowUpRight size={13} />
          </a>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [kind, setKind] = useState('skill')
  const [q, setQ] = useState('')

  const counts = catalogData.counts || {}
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return catalogData.entries
      .filter((e) => e.kind === kind)
      .filter(
        (e) =>
          !needle ||
          e.slug.toLowerCase().includes(needle) ||
          e.blurb.toLowerCase().includes(needle)
      )
  }, [kind, q])

  return (
    <MotionConfig reducedMotion="user">
      <div className="board" />
      <div className="canopy" />
      <div className="straw" />
      <div className="grain" />

      <main className="mx-auto max-w-5xl px-6 pb-32">
        {/* Nav */}
        <nav className="flex items-center gap-4 pt-8 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-ink-dim)] sm:gap-6">
          <a href="#apps" className="hover:text-[var(--color-gold)]">apps</a>
          <a href="#catalog" className="hover:text-[var(--color-gold)]">toolshed</a>
          <a href="#golf" className="hover:text-[var(--color-gold)]">golf</a>
          <ThemeToggle />
        </nav>

        {/* Hero */}
        <header className="flex min-h-[70vh] flex-col justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-moss)]"
          >
            ✧ cosmicfarmland.wtf
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mr-[calc(50%-50vw+1.5rem)] font-display text-[clamp(2.6rem,11vw,7.5rem)] font-normal leading-[1.25] tracking-[-0.015em]"
          >
            <span className="plank">
              <span className="sr-only">Cosmic Farmland</span>
              {/* One line when there's room for it, two when there isn't. The
                  negative right margin lets the sign run past the text column
                  into the gutter; flex wrapping picks the break itself. */}
              <span aria-hidden="true" className="flex flex-wrap gap-x-[0.24em]">
                <span><SignWord>COSMIC</SignWord></span>
                <span><SignWord offset={6}>FARMLAND</SignWord></span>
              </span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-8 max-w-md text-lg leading-relaxed text-[var(--color-ink-dim)]"
          >
            apps, tools, and writing. entrypoint to the cosmic farmland
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-4 font-mono text-xs tracking-[0.12em] text-[var(--color-ink-dim)]"
          >
            inspired by{' '}
            <a
              href="/grayton"
              className="text-[var(--color-moss)] underline decoration-[var(--color-moss)]/40 underline-offset-4 transition-colors hover:text-[var(--color-gold)] hover:decoration-[var(--color-gold)]/60"
            >
              grayton beach ↗
            </a>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-5"
          >
            <Stat value={appsData.apps.filter((a) => a.status === 'live').length} label="apps live" />
            <Stat value={counts.skill || 0} label="skills" />
            <Stat value={counts.command || 0} label="commands" />
            <Stat value={counts.plugin || 0} label="plugins" />
          </motion.div>
        </header>

        {/* Apps */}
        <section id="apps" className="mt-12">
          <SectionHead icon={Sprout} tint="text-[var(--color-moss)]">
            apps
          </SectionHead>
          <div className="grid gap-5 sm:grid-cols-2">
            {appsData.apps.map((app, i) => (
              <AppCard key={app.slug} app={app} index={i} />
            ))}
          </div>
        </section>

        {/* Golf */}
        <section id="golf" className="mt-24">
          <SectionHead icon={Flag} tint="text-[var(--color-moss)]">
            golf looping
          </SectionHead>
          <p className="mb-8 max-w-lg text-sm text-[var(--color-ink-dim)]">
            golf, counted properly. every round i post and every hole of the
            tournaments worth writing down.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {golfData.pages.map((page, i) => (
              <PageCard key={page.slug} page={page} index={i} />
            ))}
          </div>
        </section>

        {/* Catalog */}
        <section id="catalog" className="mt-24">
          <SectionHead icon={Terminal} tint="text-[var(--color-gold)]">
            the toolshed
          </SectionHead>
          <p className="mb-8 max-w-lg text-sm text-[var(--color-ink-dim)]">
            the skills, commands, and plugins i use across every project. browse here,
            then jump to source on github when you want the code.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            {KINDS.map((k) => {
              const Icon = k.icon
              const active = kind === k.id
              return (
                <button
                  key={k.id}
                  onClick={() => setKind(k.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-colors ${
                    active
                      ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
                      : 'border-[var(--color-line)] text-[var(--color-ink-dim)] hover:border-[var(--color-moss-strong)]'
                  }`}
                >
                  <Icon size={14} aria-hidden="true" /> {k.label}
                  <span className="opacity-60">{counts[k.id] || 0}</span>
                </button>
              )
            })}
            <div className="relative ml-auto">
              <Search
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]"
              />
              <input
                type="search"
                aria-label="filter the toolshed"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="filter…"
                className="w-40 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/70 py-2 pl-9 pr-3 font-mono text-xs text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-dim)] focus:border-[var(--color-gold)]"
              />
            </div>
          </div>

          <div className="grid items-start gap-3 sm:grid-cols-2">
            {filtered.map((entry) => (
              <CatalogCard key={`${entry.kind}-${entry.slug}`} entry={entry} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center font-mono text-sm text-[var(--color-ink-dim)]">
              nothing in this patch yet.
            </p>
          )}
        </section>

        <footer className="mt-28 border-t border-[var(--color-line)]/60 pt-8 font-mono text-xs text-[var(--color-ink-dim)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>grown by marshall · {new Date().getFullYear()}</span>
            <span className="uppercase tracking-[0.28em] text-[var(--color-gold)]">
              nice dogs, strange people
            </span>
            <div className="flex gap-5">
              <a href="/grayton" className="hover:text-[var(--color-gold)]">
                grayton beach ↗
              </a>
              <a
                href="https://github.com/marshallhouston/cosmic-farmland"
                className="hover:text-[var(--color-gold)]"
              >
                github ↗
              </a>
            </div>
          </div>
        </footer>
      </main>
    </MotionConfig>
  )
}
