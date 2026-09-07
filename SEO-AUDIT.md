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

**2. `X-Robots-Tag` / `noindex`: not reproducible at the origin.**

Every one of the 8 sitemap URLs was fetched twice, once as a normal client and once
with a Googlebot user agent, checking the response headers and the full response body
for any `noindex` in any form. None carries one. The string `noindex` does not appear
anywhere in this repository, and `git log -S noindex --all` returns no commit that
ever added or removed one. Every URL the sitemap has ever listed, across its whole
history, is one of the same 8 and all 8 are 200 with no robots directive.

So the `noindex` GSC saw was not served by this origin. See the Cloudflare item in
the dashboard checklist below: a Cloudflare challenge or block interstitial is served
with `<meta name="robots" content="noindex,nofollow">` in its body, which is the
usual way a site behind Cloudflare reports `Excluded by 'noindex' tag` while its own
HTML is clean. That is a dashboard setting, not a repo change, and it cannot be
verified from here.

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

- `server.mjs` — 301 `/<path>.html` to `/<path>` and `/index.html` to `/`, before
  any other routing. One page, one URL. Query strings are preserved.
- `scripts/sync-vault.mjs` — inject a canonical into every synced page. The city-am
  page already had one inside its share-metadata block; that now comes from the same
  `canonical()` helper, so the three golf pages cannot drift apart again. Regenerated
  `public/golf.html` and `public/golf/best-worst.html` (one line added to each).
- `public/grayton.html` — canonical added by hand; this page is authored directly in
  `public/`, not synced.
- `tests/seo.test.mjs` (new) — the sitemap invariant as a contract test, run by the
  repo's existing `bun test`: every sitemap URL is 200 with no redirect,
  self-canonical and not noindexed; every `.html` twin 301s to the pretty path; and
  no page links to a `.html` or trailing-slash URL. 19 tests pass across both files.
- `README.md` — the one-URL-per-page contract documented next to the existing ones.

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

- **The `noindex` GSC reported cannot be reproduced at the origin.** If it is still
  reported after the next crawl, the cause is at the Cloudflare edge, not in this
  repo. The checklist below says what to look at.
- **The homepage is a client-rendered SPA.** `scripts/seo-fragment.mjs` already
  injects a no-JS mirror into `#root` at build time, so this is handled, but it does
  mean the apex depends on that fragment staying in sync. Worth a glance if the apex
  ever reports thin content.

## Do in the GSC dashboard

Copy-paste checklist. Nothing here can be done from the repo.

1. **Cloudflare first, before anything in GSC.** Dashboard → the cosmicfarmland.wtf
   zone:
   - Security → Bots → **Bot Fight Mode off**. It challenges traffic it cannot
     verify, and a challenge page carries `<meta name="robots" content="noindex">`.
     This is the most likely source of `Excluded by 'noindex' tag` on a site whose
     own HTML has none.
   - Security → WAF → check no custom rule matches Googlebot, and that
     **Verified Bots are allowed**.
   - Confirm the zone is not in **Under Attack** mode.
   - Rules → Transform Rules → Modify Response Header: confirm nothing sets
     `X-Robots-Tag`.
2. **GSC → URL Inspection → Test Live URL** on `https://cosmicfarmland.wtf/golf`.
   Read the rendered HTML it returns. If it shows a Cloudflare interstitial rather
   than the page, item 1 is confirmed and is the whole fix.
3. **After this PR deploys, Request Indexing** for the three pages that had no
   canonical:

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
   - `Page with redirect` for the `.html` twins — they are redirects now by design,
     and were never in the sitemap.
   - `Page with redirect` for `http://` URLs — the http-to-https 301 is correct and
     permanent. This one will keep being reported as an exclusion and that is fine.
   - Duplicate/canonical reports on `/golf`, `/golf/best-worst` and `/grayton` — they
     now declare a canonical and their twins redirect.
6. **Only if `Excluded by 'noindex' tag` survives** both the Cloudflare check and a
   recrawl: re-run the live check (`curl -sSI` plus a body grep for `noindex` on all
   8 sitemap URLs, with and without a Googlebot user agent). If the origin is still
   clean, the answer is at the edge, and no code change in this repo will move it.
