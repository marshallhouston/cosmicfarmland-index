# Pass 8 — base sheet, work/index.html

Judged on six screenshots at 1440x900, scroll 0 / 780 / 1560 / 2340 / 3120 / 3619,
saved in `pass8-shots/`. Prompt: CRITIC.md as of 9a00135, the first run with the
settled list.

---

**Sheet edges.** The card does not run to the edge. There is a visibly lighter vertical band left of the ~132px margin and right of ~1340px, and the sticky header's cream band terminates on a hard vertical seam at 1340 with a different tone beyond it. That seam draws a frame around the whole page, which is the one thing the aesthetic bans. Fix: one ground tone, no inset panel, header band either full-bleed or gone.

**The sticky header.** A specimen sheet has no chrome. A persistent opaque bar with underlined active nav is web furniture pasted onto a herbarium object, and plates slide under it and get cut. Alternative: let the wordmark and the three words sit at the top of the sheet and scroll away, or make the bar the same paper with no fill and no bottom rule.

**Rules that start and stop arbitrarily.** Shot 03 has a horizontal rule fragment floating directly under the header with nothing below it. Shot 05 has the column rule at x=736 hanging at the top of the frame, unattached, and again dying mid-air around y=520 with no horizontal to close it. The header's own rule goes edge to edge while every section rule stops at 132/1340. Pick one termination logic: rules run to the sheet edge and bleed, or they close a cell. Right now they do both, inconsistently, and the loose ends read as CSS accident, not ruling.

**Label rules are ragged.** The hairline above each accession label varies in width: cf-002 292px, cf-003 278, cf-005 267, cf-007 292. Nothing motivates the variance. Either lock one measure across all ten, or tie it to the widest line of the label block deliberately and let it be visibly text-derived.

**The specimens are not genuinely distinct.** cf-002, cf-004 and cf-006 are the same upright opposite-leaved mint silhouette three times. cf-001 and cf-010 are the same diagonal spray. Worse, they are not one collection: cf-003 is saturated orange, cf-006 and cf-007 are near-black, cf-008 is pale gold. Different sources, different light, different presses. A studio would grade all ten to a single ink range (a narrow warm-sepia to near-black) and swap two of the mint duplicates for genuinely different forms: a broad single leaf, a seed head, a grass, a root.

**Paper hinges read as stickers.** The white tape strips are brighter than the sheet and sit on top of it with a hard edge. On cf-006 one hinge floats in empty space, holding nothing. On cf-007 a hinge sits half off the specimen at bottom left. Hinges should be the sheet's own cream, slightly warmer, with a soft torn edge and a one-pixel contact shadow, and every one must cross a stem.

**Plate mass is unmanaged.** cf-001 is enormous and near-bleeds; cf-005 is a thumbnail that leaves its cell almost entirely bald and clips at the row top. Within a row, plates should share an optical mass and a common baseline band even at different scales. As drawn, row two reads as a layout error.

**The toolshed section abandons the conceit.** Two columns of ruled key/value rows with mono keys is a settings screen. Nothing about it is a pressed sheet. Either give it the same treatment (a single plate of ranked specimen fragments, or an index in the label typeface with no row rules), or drop the row rules entirely and set it as a hand-listed determination slip. The header count "20 skills, 7 commands, 4 plugins" then repeats verbatim in the colophon three hundred pixels later.

**The cosmic is not there.** The only candidates are faint speckle and one hard black dot at roughly (1201, 521) in shot 01. That dot reads as a dust blemish, not a star, and the speckle reads as JPEG noise. Embed it in the paper itself: the fiber flecks resolving into a real field at one density, a specimen whose seed head is a coordinate scatter, a plate whose pressed form is unmistakably not terrestrial. Currently it is absent, so the concept is carried by nothing.

**Colophon orphaned.** The acc./coll./loc./field/kit/det. block is right-aligned bottom right while every other element on the page hangs off the left measure at 165. It also reads as a generated key-value dump. Set it on the same left measure as the labels, or place it deliberately as a determination slip in the sheet's bottom-right corner with its own rule and hinge so the placement is a decision, not a float.

**Overdone tell.** The wide-tracked lowercase mono wordmark plus mono nav plus mono accession plus mono "loc." plus mono colophon is one gesture used five times. Keep mono for accession and locality only; the wordmark and nav should be the same serif as the labels, small, untracked.

SCORE: 6/10
