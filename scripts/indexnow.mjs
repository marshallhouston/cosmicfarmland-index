#!/usr/bin/env node
// Ping IndexNow with every url in the sitemap. Bing, DuckDuckGo, Yandex and
// Seznam share the endpoint; Google does not participate (it wants the sitemap
// submitted in Search Console, which needs a login and cannot be scripted).
//
// The key is a file in public/ named <key>.txt whose body is the key: that file
// being reachable on the domain is the whole proof of ownership. Run after a
// deploy, once new urls are actually live:
//   node scripts/indexnow.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const HOST = 'cosmicfarmland.wtf'

const keyFile = readdirSync(join(REPO, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
if (!keyFile) throw new Error('no indexnow key file in public/ (expected <32 hex>.txt)')
const key = keyFile.replace('.txt', '')

const sitemap = readFileSync(join(REPO, 'public', 'sitemap.xml'), 'utf8')
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

// The key file has to be live on the host before the ping, or the whole batch
// is rejected. Check it rather than guessing from a 202.
const live = await fetch(`https://${HOST}/${keyFile}`)
if (!live.ok || (await live.text()).trim() !== key)
  throw new Error(`key file not live at https://${HOST}/${keyFile} — deploy first`)

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
})
console.log(`indexnow ${res.status} ${res.statusText} for ${urlList.length} urls`)
if (!res.ok) {
  console.error(await res.text())
  process.exit(1)
}
