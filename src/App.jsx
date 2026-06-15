import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowUpRight,
  Sprout,
  Terminal,
  Puzzle,
  Wand2,
  Search,
  Circle,
  CircleDot,
} from 'lucide-react'
import appsData from '../data/apps.json'
import catalogData from '../data/catalog.json'

const KINDS = [
  { id: 'skill', label: 'Skills', icon: Wand2 },
  { id: 'command', label: 'Commands', icon: Terminal },
  { id: 'plugin', label: 'Plugins', icon: Puzzle },
]

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-2xl text-[var(--color-gold)]">{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-cream-dim)]">
        {label}
      </span>
    </div>
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
      className={`group relative block overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-colors ${
        live
          ? 'cursor-pointer border-[var(--color-haze)] bg-[var(--color-soil-2)]/60 hover:border-[var(--color-glow-deep)]'
          : 'border-dashed border-[var(--color-haze)]/60 bg-[var(--color-soil)]/40'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: live ? 'var(--color-glow)' : 'transparent' }}
      />
      <div className="mb-4 flex items-center justify-between">
        <Sprout
          className={live ? 'text-[var(--color-glow)]' : 'text-[var(--color-cream-dim)]'}
          size={22}
        />
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
            live ? 'text-[var(--color-glow)]' : 'text-[var(--color-cream-dim)]'
          }`}
        >
          {live ? '● live' : '○ soon'}
        </span>
      </div>
      <h3 className="mb-2 font-[var(--font-display)] text-2xl font-semibold leading-tight">
        {app.name}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-[var(--color-cream-dim)]">
        {app.blurb}
      </p>
      <div className="flex items-center gap-3">
        {(app.tags || []).map((t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--color-haze)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--color-cream-dim)]"
          >
            {t}
          </span>
        ))}
        {live && (
          <ArrowUpRight
            size={18}
            className="ml-auto text-[var(--color-cream-dim)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-gold)]"
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
      className={`rounded-xl border transition-colors ${
        open
          ? 'border-[var(--color-glow-deep)] bg-[var(--color-soil-2)]/70'
          : 'border-[var(--color-haze)]/70 bg-[var(--color-soil)]/40 hover:border-[var(--color-violet)]'
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        {open ? (
          <CircleDot size={16} className="mt-1 shrink-0 text-[var(--color-glow)]" />
        ) : (
          <Circle size={16} className="mt-1 shrink-0 text-[var(--color-cream-dim)]" />
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-sm text-[var(--color-cream)]">{entry.slug}</span>
            <span className="truncate font-[var(--font-display)] text-sm italic text-[var(--color-cream-dim)]">
              {entry.name}
            </span>
          </span>
          {!open && (
            <span className="mt-1 block truncate text-xs text-[var(--color-cream-dim)]">
              {entry.blurb}
            </span>
          )}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pl-11">
          <p className="mb-3 text-sm leading-relaxed text-[var(--color-cream)]">{entry.blurb}</p>
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
                  className="rounded-md bg-[var(--color-haze)]/50 px-2 py-0.5 font-mono text-[11px] text-[var(--color-violet)]"
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
            className="inline-flex items-center gap-1 font-mono text-xs text-[var(--color-cream-dim)] transition-colors hover:text-[var(--color-gold)]"
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
    <>
      <div className="sky" />
      <div className="stars" />
      <div className="grain" />
      <div className="field" />

      <main className="mx-auto max-w-5xl px-6 pb-32">
        {/* Hero */}
        <header className="flex min-h-[78vh] flex-col justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-glow)]"
          >
            ✧ cosmicfarmland.wtf
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="glow-text font-[var(--font-display)] text-6xl font-light leading-[0.95] tracking-tight sm:text-8xl"
          >
            Cosmic
            <br />
            <span className="italic text-[var(--color-gold)]">Farmland</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-8 max-w-md text-lg leading-relaxed text-[var(--color-cream-dim)]"
          >
            Things I grow online — apps I build, and the skills, commands, and
            plugins I tend to build them with.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-12 flex gap-10"
          >
            <Stat value={appsData.apps.filter((a) => a.status === 'live').length} label="apps live" />
            <Stat value={counts.skill || 0} label="skills" />
            <Stat value={counts.command || 0} label="commands" />
            <Stat value={counts.plugin || 0} label="plugins" />
          </motion.div>
        </header>

        {/* Apps */}
        <section id="apps" className="mt-12">
          <h2 className="mb-8 flex items-center gap-3 font-mono text-sm uppercase tracking-[0.3em] text-[var(--color-cream-dim)]">
            <Sprout size={16} className="text-[var(--color-glow)]" /> the field — apps
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {appsData.apps.map((app, i) => (
              <AppCard key={app.slug} app={app} index={i} />
            ))}
          </div>
        </section>

        {/* Catalog */}
        <section id="catalog" className="mt-24">
          <h2 className="mb-2 flex items-center gap-3 font-mono text-sm uppercase tracking-[0.3em] text-[var(--color-cream-dim)]">
            <Terminal size={16} className="text-[var(--color-gold)]" /> the toolshed
          </h2>
          <p className="mb-8 max-w-lg text-sm text-[var(--color-cream-dim)]">
            The skills, commands, and plugins I use across every project. Browse here —
            jump to source on GitHub when you want the code.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            {KINDS.map((k) => {
              const Icon = k.icon
              const active = kind === k.id
              return (
                <button
                  key={k.id}
                  onClick={() => setKind(k.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
                      : 'border-[var(--color-haze)] text-[var(--color-cream-dim)] hover:border-[var(--color-violet)]'
                  }`}
                >
                  <Icon size={14} /> {k.label}
                  <span className="opacity-60">{counts[k.id] || 0}</span>
                </button>
              )
            })}
            <div className="relative ml-auto">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-cream-dim)]"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="filter…"
                className="w-40 rounded-full border border-[var(--color-haze)] bg-[var(--color-soil)]/60 py-1.5 pl-9 pr-3 font-mono text-xs text-[var(--color-cream)] outline-none placeholder:text-[var(--color-cream-dim)] focus:border-[var(--color-glow-deep)]"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((entry) => (
              <CatalogCard key={`${entry.kind}-${entry.slug}`} entry={entry} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center font-mono text-sm text-[var(--color-cream-dim)]">
              nothing in this patch yet.
            </p>
          )}
        </section>

        <footer className="mt-28 border-t border-[var(--color-haze)]/50 pt-8 font-mono text-xs text-[var(--color-cream-dim)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>grown by marshall · {new Date().getFullYear()}</span>
            <div className="flex gap-5">
              <a href="https://marshallhouston.wtf" className="hover:text-[var(--color-gold)]">
                writing ↗
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
    </>
  )
}
