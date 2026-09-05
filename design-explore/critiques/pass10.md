# Pass 10 — base sheet after the scale ladder and lyra fixes

Six scroll positions at 1490 wide, shots in `pass10-shots/`. Prompt unchanged.
Fixed since pass 9: per-plate scale ladder (1.1x to 3.1x), vega capped, the
eighteen random specks over the constellation removed, four redundant loc lines
dropped.

Scored 5/10, same as pass 9. Read the convergence, not the number:

- **The sticky header is now flagged by all three passes** (8: "a specimen sheet
  has no chrome", 9: "header nav is a website, not a sheet", 10: "the sticky
  header is a frame"). Three independent readers, same call. Acting on it.
- **Hinges floating free of stems: all three passes.** Acting on it.
- **The toolshed reads as a settings screen: all three passes.** Acting on it.
- **The cosmic does not register: all three passes**, and pass 10 says it outright
  while looking at a plotted Lyra that is on the page. Three readers failing to
  see it is the finding. The constellation is too faint to do its job.

Contradictions to note before acting: pass 9 demanded at least a 4x scale ladder,
pass 10 wants it clamped to 2.5:1. Current is 3.1x. Ignoring both.

---

**1. The sticky header is a frame.** The bar sits on an opaque cream band with a full-width hairline under it, riding over every plate in all six views. That is exactly the banned frame, just cropped to one edge: it turns the sheet into a windowed viewport instead of a card running to the edge. A studio would let the wordmark and nav be printed *on* the sheet at the top and scroll away with it, or reduce the sticky state to unbacked ink with no rule so nothing reads as chrome.

**2. Plate 001 has no label discipline; the rest do.** cf-001 shows `marshallhouston.wtf` + description and no `loc.` line. cf-003 and cf-005 also drop `loc.` cf-009 and cf-010 add a second field after the accession number (`/ the record`, `/ 2026 denver city am`) that appears nowhere else. An accession label is a form: same fields, same order, every time, blank where unknown. Fix: fixed three-line stack (acc. / name / determination) plus `loc.` on all ten, no optional extras.

**3. The label rule is inconsistent and arbitrary in length.** Above cf-002 it is ~305px; above cf-003 it is ~305px but sits at a different left offset relative to the plate; above cf-009 it is 302px, above cf-010 302px. The rules do not relate to the label text width, the column width, or each other. On a herbarium sheet the label is a pasted rectangle with a real edge. Fix: make the rule span the label block's measure exactly, or drop it and give the label a faint printed box.

**4. Vertical alignment of labels within a row is uncoordinated.** In 01.jpg the cf-002 label baseline sits ~100px above cf-003's; in 04.jpg cf-009 sits ~60px above cf-010. Specimens are hung at different heights (fine, that is naturalistic), but the *labels* are printed artifacts and should sit on a shared datum per row. Fix: labels anchored to a common baseline near the bottom of each cell; let the specimen float freely above it.

**5. Cell heights are wildly unequal and mostly empty in the wrong places.** cf-004 occupies a cell roughly 240px tall with no specimen visible at all in 02.jpg (the plant belongs to the cell above, off-screen), while cf-008 gets a near-full-viewport cell. The result is not restraint, it is an unmetered rhythm where some plates get a page and others get a strip. Fix: a fixed cell height module (say two heights, tall and half) applied deliberately, so variation reads as chosen rather than as content flow.

**6. Specimen scale is not controlled.** cf-005's sprig is ~40px wide; cf-007's spans ~470px; cf-001 runs ~800px. Real sheets are all one sheet size, and scale variance is information. Here the tiny ones just look like thumbnails that failed to load. Fix: clamp to a 2.5:1 max size ratio across the nine, and let the smallest specimens sit at genuine small scale with more surrounding void rather than looking undersized.

**7. The paper hinges are the weakest craft detail on the page.** They are flat cream rectangles with hard 90-degree corners, no shadow, no fiber, no adhesive shine, and they float *behind* stems at random rather than crossing them. In 04.jpg two hinges on cf-010 sit on empty space touching nothing. Fix: hinges must always straddle a stem, get a torn or slightly rotated edge, a 1px soft drop, and a subtly different paper tone from the sheet.

**8. The rules do not resolve at the edges.** The vertical divider in 01.jpg stops mid-cell at y≈510 with no join; in 03.jpg a horizontal rule and a vertical stub end at unrelated points, leaving an orphan L. The horizontals inset to the 103px margin, the header rule bleeds full width. Pick one logic: either every rule is inset to the text margin and closes its cell cleanly, or every rule bleeds. Currently it is both, and the joins are unmitered.

**9. Nothing cosmic is embedded.** The brief calls for something cosmic present as the same object. The only candidate is `field 18h 36m 56s +38° 47' 01"` in the colophon, which is words in a metadata block, not an embedded thing. Fix: the sheet's speck field could carry an actual star-field register (a faint plotted constellation at a fixed RA/dec, printed in the same ink weight as the rules), so the reading emerges from looking, not from a coordinate string.

**10. The speck texture is procedurally uniform.** The flecks are evenly distributed at a constant density and size across every viewport, with a few oversized black dots (visible at 1237,536 in 01.jpg) that read as dust on a scanner, not fiber in paper. Real handmade cream has clumping, directional grain, and a subtle tonal drift across the sheet. Fix: vary density spatially, kill the near-black outliers, add a low-frequency luminance gradient.

**11. The toolshed table breaks the material.** Two columns of `/command` + description with a hairline under every row is a settings screen, not a plate. It also mixes a mono column against serif descriptions with different baselines. Fix: set it as a printed index at the foot of the sheet, leader dots or a single column, no per-row rules, one shared rule above.

**12. Section markers are underweighted to the point of vanishing.** `apps eight live`, `golf counted properly`, `toolshed 20 skills…` are the page's only structural signposts and they sit at ~9px letterspaced grey, dimmer than the specimen labels beneath them. They also collide with the sticky header in 03.jpg. Give them the darkest ink on the page at small size, or set them rotated in the left margin like a sheet's file annotation.

**13. Wordmark letterspacing is overcooked.** `c o s m i c   f a r m l a n d` at that tracking in a mono face reads as generic 2020s minimal-portfolio, not as printed institutional type. Tighten to ~0.15em and let the mono do the work.

SCORE: 5/10
