# SEO audit: GSC indexing exclusions, 2026-09-06

Google Search Console raised two alerts for cosmicfarmland.wtf: one site-wide, one
scoped to URLs in the submitted sitemap.

- In sitemap: `Excluded by 'noindex' tag`
- Site-wide: that, plus `Page with redirect`

Ground truth came from the live site, not from the code: fetch `/sitemap.xml`, then
per URL record pre-redirect status, final status, canonical, `<meta name="robots">`
and `X-Robots-Tag`, then crawl every internal link and every outbound app link.

## What was broken

**1. Every page answered at two URLs, and three had no canonical to break the tie.**

`server.mjs` serves `dist/about.html` for both `/about` and `/about.html`, and
`dist/index.html` for both `/` and `/index.html`. All 8 sitemap URLs had a live
`.html` twin returning 200. `/golf`, `/golf/best-worst` and `/grayton` carried no
`<link rel="canonical">` at all, so on those three Google was free to pick the twin
over the URL in the sitemap.

This is the one origin defect the audit could reproduce, and it is a real duplicate-
content bug regardless of which alert it maps to.

**2. `X-Robots-Tag` / `noindex`: not reproducible anywhere, origin or edge.**

Every one of the 8 sitemap URLs was fetched twice, once as a normal client and once
with a Googlebot user agent, checking the response headers and the full response body
for any `noindex` in any form. None carries one. The string `noindex` does not appear
anywhere in this repository, and a history-wide search for a commit that added or
removed one returns nothing. Every URL the sitemap has ever listed, across its whole
history, is one of the same 8, and all 8 are 200 with no robots directive.

The Cloudflare zone was then read through the API on 2026-09-07, because a challenge
or block interstitial carries `<meta name="robots" content="noindex,nofollow">` and
is the usual way a site behind Cloudflare reports this while its own HTML is clean.
It is not that either:

- Bot Fight Mode: **off**. `crawler_protection`, `ai_bots_protection` and `enable_js`
  are all disabled.
- Custom WAF rules: **none**. Page rules: **none**. Transform rules, response-header
  rules and redirect rules: **none**.
- Three rulesets, all Cloudflare-managed: Normalization, Managed Free Ruleset, DDoS
  L7. The Free Ruleset is CVE signatures only (Log4j, Shellshock, WordPress, React).
- `browser_check: on`, `security_level: medium`, `development_mode: off`.
- 187 firewall events in the preceding 23 hours, **zero** involving Google: no
  Googlebot user agent, no ASN 15169. The busiest rule is `React - RCE -
  CVE-2025-55182` firing 167 times on `/` against datacenter ASNs, i.e. scanners.

Two limits on that evidence: free-plan firewall event retention is 24 hours, so the
window cannot speak to the crawl period GSC reported on, and Browser Integrity Check
challenges may not all land in `firewallEventsAdaptive` on a free plan. BIC being on
is the only challenge surface left, and nothing observed suggests it is firing at
Googlebot.

What the GSC "Discovered - currently not indexed" report shows instead: `/golf`,
`/golf/city-am-2026` and `/grayton` all have **Last crawled: N/A**. Google knows the
URLs and has never fetched them. A page that was never fetched cannot have been
excluded for a `noindex` it was served, so the likeliest reading of the whole alert
set is discovery priority on a young, low-authority domain rather than a directive
problem. The canonical fix in item 1 removes the one genuine reason Google had to
deprioritise these URLs.

A live URL inspection in GSC on 2026-09-07 settles it: `https://cosmicfarmland.wtf/golf`
returns **"URL is available to Google"** and **"Page can be indexed"**. Google's own
fetcher gets the page, with no interstitial and no robots directive. There is nothing
left to find at the origin or the edge.

No `noindex` was removed to silence this alert, because there is none to remove.

**3. `Page with redirect`: one redirect exists, and it is the correct one.**

`http://cosmicfarmland.wtf/` 301s to `https://`. That is Cloudflare doing the right
thing, and Google reports the `http://` URL as an exclusion for it. The sitemap
already lists only `https://` destinations. `www.cosmicfarmland.wtf` does not
resolve, so there is no www duplicate. Nothing to fix here. The `.html` twins fixed
in item 1 now redirect too, which is the intended shape: sitemaps list destinations,
so the twins are sources and were never in the sitemap.

## Violation counts

Over the 8 sitemap URLs, plus a link crawl of the rendered site and every outbound
app link.

| | Before (live site) | After (local `bun run start` on the built dist) |
|---|---|---|
| Sitemap URLs with no canonical | 3 | 0 |
| Sitemap URLs not self-canonical | 3 | 0 |
| Sitemap URLs non-200 or redirecting | 0 | 0 |
| Sitemap URLs noindexed at the origin | 0 | 0 |
| Duplicate `.html` twins serving 200 | 8 | 0 (all 301) |
| Internal links that redirect or 404 | 0 | 0 |
| Outbound app links non-200 | 0 | 0 |

## What changed

- `server.mjs`: 301 `/<path>.html` to `/<path>` and `/index.html` to `/`, before
  any other routing. One page, one URL. Query strings are preserved.
- `scripts/sync-vault.mjs`: inject a canonical into every synced page. The city-am
  page already had one inside its share-metadata block; that now comes from the same
  `canonical()` helper, so the three golf pages cannot drift apart again. Regenerated
  `public/golf.html` and `public/golf/best-worst.html` (one line added to each).
- `public/grayton.html`: canonical added by hand; this page is authored directly in
  `public/`, not synced.
- `tests/seo.test.mjs` (new): the sitemap invariant as a contract test, run by the
  repo's existing `bun test`: every sitemap URL is 200 with no redirect,
  self-canonical and not noindexed; every `.html` twin 301s to the pretty path; and
  no page links to a `.html` or trailing-slash URL. 19 tests pass across both files.
- `README.md`: the one-URL-per-page contract documented next to the existing ones.

Verified by rebuilding and running the real `server.mjs` over `dist/`, then re-running
the step-1 checks against it. Markdown content negotiation, the `.md` twins, the
real-404 behavior and `/api/health` are all unchanged.

## Deliberately excluded from the sitemap

- The sibling apps on `*.cosmicfarmland.wtf` subdomains. A cross-origin sitemap entry
  needs cross-submission verification to count, so each app owns its own sitemap.
  This is already documented in `scripts/gen-seo.mjs`.
- `.md` twins (`/about.md`, `/index.md`) and `/llms.txt`. They are the agent surface,
  served as `text/markdown`, and are duplicates of pages already listed. They stay
  reachable and stay out of the sitemap.
- `/api/health`.

## Flagged, not fixed here

- **The `noindex` GSC reported does not exist.** Origin, Cloudflare and Google's own
  live fetch were all checked directly (item 2 above); the last one returns "URL is
  available to Google". The affected URLs show `Last crawled: N/A`, so nothing was
  ever served to Google to carry a directive. This is crawl priority.
- **The real constraint is inbound links, and it is not in this repo.** Every sitemap
  URL is linked from the apex and the pages cross-link each other, but GSC reports
  "Referring page: None detected" because it has not crawled the rewritten apex yet.
  More to the point, `marshallhouston.wtf` (older, already crawled) linked here zero
  times while this site links out to it. That is fixed in
  marshallhouston.wtf#25, which links cosmicfarmland.wtf from its about page. Beyond
  that, inbound links are an off-repo activity.
- **The homepage is a client-rendered SPA.** `scripts/seo-fragment.mjs` already
  injects a no-JS mirror into `#root` at build time, so this is handled, but it does
  mean the apex depends on that fragment staying in sync. Worth a glance if the apex
  ever reports thin content.

## Do in the GSC dashboard

Copy-paste checklist. Nothing here can be done from the repo.

1. **Cloudflare is ruled out, no action needed.** Read via the API on 2026-09-07:
   Bot Fight Mode off, no custom WAF rules, no page rules, no transform or redirect
   rules, managed CVE ruleset only, and no Google traffic in the firewall log.
   `browser_check` is on, and the live test in step 2 shows it is not affecting
   Googlebot, so leave it alone.
2. **Already done, recorded here.** GSC -> URL Inspection -> Test Live URL on
   `https://cosmicfarmland.wtf/golf` returned "URL is available to Google" and
   "Page can be indexed" on 2026-09-07. Nothing is blocking the crawl.
3. **Request Indexing** for the three pages that had no canonical. Do this after this
   PR deploys, so Google fetches the version with the canonical on it:

   ```
   https://cosmicfarmland.wtf/golf
   https://cosmicfarmland.wtf/golf/best-worst
   https://cosmicfarmland.wtf/grayton
   ```

   And, if the quota allows, the rest of the sitemap:

   ```
   https://cosmicfarmland.wtf/
   https://cosmicfarmland.wtf/golf/city-am-2026
   https://cosmicfarmland.wtf/about
   https://cosmicfarmland.wtf/contact
   https://cosmicfarmland.wtf/privacy
   ```

4. **Sitemaps → confirm** `https://cosmicfarmland.wtf/sitemap.xml` is submitted and
   its status is Success. It is the only sitemap; it returns 200 and `robots.txt`
   already points at it.
5. **Clears on its own after recrawl, no action needed:**
   - `Page with redirect` for the `.html` twins. They are redirects now by design,
     and were never in the sitemap.
   - `Page with redirect` for `http://` URLs. The http-to-https 301 is correct and
     permanent. This one will keep being reported as an exclusion and that is fine.
   - Duplicate/canonical reports on `/golf`, `/golf/best-worst` and `/grayton`. They
     now declare a canonical and their twins redirect.
6. **Only if `Excluded by 'noindex' tag` survives** a recrawl: re-run the live check
   (`curl -sSI` plus a body grep for `noindex` on all 8 sitemap URLs, with and without
   a Googlebot user agent) and re-read the Cloudflare zone. Both were clean on
   2026-09-07, so a recurrence means something changed, not something missed.
7. **The fourth URL in the "Discovered - currently not indexed" list**,
   `https://golf-course-designer.cosmicfarmland.wtf/`, is a sibling app on its own
   subdomain and its own GSC property. Nothing in this repo serves it; it needs the
   same audit run against its own repo.
