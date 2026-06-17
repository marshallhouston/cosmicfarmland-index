#!/usr/bin/env node
// Generate data/catalog.json from the cosmic-farmland plugin repo.
// Walks each plugin's skills + commands, parses YAML frontmatter (name/description/
// argument-hint), and emits rich catalog entries with a GitHub source link.
//
// Run locally: node scripts/gen-catalog.mjs [path-to-cosmic-farmland]
// Default sibling checkout: ../cosmic-farmland
//
// The committed catalog.json is the build input for the index app. Re-run and
// commit when skills/commands change (or wire into cosmic-farmland CI later).

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = process.argv[2] || join(__dirname, '..', '..', 'cosmic-farmland')
const GH = 'https://github.com/marshallhouston/cosmic-farmland/blob/main'
const OUT = join(__dirname, '..', 'data', 'catalog.json')

function prettyName(slug) {
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// Strip em/en dashes from generated copy (house style: no em-dashes).
function deDash(s = '') {
  return s.replace(/\s*[—–]\s*/g, ' - ')
}

// Minimal frontmatter parser - first --- fenced block, flat key: value pairs.
function parseFrontmatter(text) {
  if (!text.startsWith('---')) return {}
  const end = text.indexOf('\n---', 3)
  if (end === -1) return {}
  const block = text.slice(3, end)
  const out = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!m) continue
    let [, key, val] = m
    val = val.trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

// Pull trigger-ish phrases out of a description: slash commands + quoted phrases.
function extractTriggers(desc = '') {
  const triggers = new Set()
  for (const m of desc.matchAll(/\/[a-z0-9-]+/gi)) triggers.add(m[0])
  for (const m of desc.matchAll(/['"]([^'"]{2,40})['"]/g)) triggers.add(m[1])
  return [...triggers].slice(0, 8)
}

function listDirs(p) {
  try {
    return readdirSync(p).filter((n) => statSync(join(p, n)).isDirectory())
  } catch {
    return []
  }
}
function listFiles(p, ext) {
  try {
    return readdirSync(p).filter((n) => n.endsWith(ext))
  } catch {
    return []
  }
}
function readPluginMeta(pluginDir) {
  try {
    return JSON.parse(readFileSync(join(pluginDir, 'plugin.json'), 'utf8'))
  } catch {
    return {}
  }
}

const entries = []
const pluginsRoot = join(REPO, 'plugins')

for (const plugin of listDirs(pluginsRoot)) {
  const pluginDir = join(pluginsRoot, plugin)
  const meta = readPluginMeta(pluginDir)

  const skillsDir = join(pluginDir, 'skills')
  for (const slug of listDirs(skillsDir)) {
    const file = join(skillsDir, slug, 'SKILL.md')
    let fm
    try {
      fm = parseFrontmatter(readFileSync(file, 'utf8'))
    } catch {
      continue
    }
    entries.push({
      slug: fm.name || slug,
      kind: 'skill',
      plugin,
      name: prettyName(fm.name || slug),
      blurb: deDash(fm.description || ''),
      triggers: extractTriggers(fm.description),
      argumentHint: fm['argument-hint'] ? deDash(fm['argument-hint']) : null,
      source: `${GH}/plugins/${plugin}/skills/${slug}/SKILL.md`,
    })
  }

  const cmdDir = join(pluginDir, 'commands')
  for (const fileName of listFiles(cmdDir, '.md')) {
    const slug = basename(fileName, '.md')
    const fm = parseFrontmatter(readFileSync(join(cmdDir, fileName), 'utf8'))
    entries.push({
      slug,
      kind: 'command',
      plugin,
      name: prettyName(slug),
      blurb: deDash(fm.description || ''),
      triggers: extractTriggers(fm.description),
      argumentHint: fm['argument-hint'] ? deDash(fm['argument-hint']) : null,
      source: `${GH}/plugins/${plugin}/commands/${fileName}`,
    })
  }

  entries.push({
    slug: plugin,
    kind: 'plugin',
    plugin,
    name: prettyName(plugin),
    blurb: deDash(meta.description || ''),
    triggers: [],
    argumentHint: null,
    source: `${GH}/plugins/${plugin}`,
  })
}

entries.sort((a, b) => a.kind.localeCompare(b.kind) || a.slug.localeCompare(b.slug))

const catalog = {
  generatedFrom: 'github.com/marshallhouston/cosmic-farmland',
  counts: entries.reduce((acc, e) => ((acc[e.kind] = (acc[e.kind] || 0) + 1), acc), {}),
  entries,
}

writeFileSync(OUT, JSON.stringify(catalog, null, 2) + '\n')
console.log(`wrote ${entries.length} entries -> ${OUT}`)
console.log(catalog.counts)
