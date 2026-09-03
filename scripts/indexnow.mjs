#!/usr/bin/env node
// Ping IndexNow with every url in the sitemap. Bing, DuckDuckGo, Yandex and
// Seznam share the endpoint; Google does not participate (it wants the sitemap
// submitted in Search Console, which needs a login and cannot be scripted).
//
// The key is a file named <key>.txt whose body is the key: that file being
// reachable on the domain is the whole proof of ownership.
//
// The server calls this on boot after a fresh deploy (see server.mjs), so there
// is nothing to remember. Run it by hand against the source tree if you want:
//   node scripts/indexnow.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const HOST = 'cosmicfarmland.wtf'

// The date every url in the sitemap carries, or '' if there is no sitemap.
export function sitemapDate(dir) {
  try {
    return readFileSync(join(dir, 'sitemap.xml'), 'utf8').match(/<lastmod>([^<]+)</)?.[1] ?? ''
  } catch {
    return ''
  }
}

// Only ping for a sitemap built today: a deploy regenerates it with the build
// date, so this fires once per deploy day and stays quiet when the container is
// merely restarted weeks later.
export const isFresh = (dir, today = new Date().toISOString().slice(0, 10)) =>
  sitemapDate(dir) === today

export async function ping(dir, { host = HOST } = {}) {
  const keyFile = readdirSync(dir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  if (!keyFile) throw new Error(`no indexnow key file in ${dir} (expected <32 hex>.txt)`)
  const key = keyFile.replace('.txt', '')

  const urlList = [
    ...readFileSync(join(dir, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((m) => m[1])

  // The key file has to be live on the host before the ping, or the whole batch
  // is rejected. Check it rather than guessing from a 202.
  const live = await fetch(`https://${host}/${keyFile}`)
  if (!live.ok || (await live.text()).trim() !== key)
    throw new Error(`key file not live at https://${host}/${keyFile}`)

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation: `https://${host}/${keyFile}`, urlList }),
  })
  return { status: res.status, urls: urlList.length, body: res.ok ? '' : await res.text() }
}

if (import.meta.main) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
  const r = await ping(dir)
  console.log(`indexnow ${r.status} for ${r.urls} urls ${r.body}`)
  if (r.status >= 300) process.exit(1)
}
