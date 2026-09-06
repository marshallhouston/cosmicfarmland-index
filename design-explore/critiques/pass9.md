# Pass 9 — base sheet after the pass 8 fixes

Same six scroll positions, shots in `pass9-shots/`. Prompt unchanged from pass 8.
Fixed since pass 8: the header frame seam, one termination for all rules, label
rules locked to 292, colophon on the left measure, duplicated kit line dropped.

Scored 5/10 against pass 8's 6/10. Different critic instance, so treat the
number as noise and read the gap list. Note it re-opened the label rule width
that pass 8 asked to lock, and it reports rule geometry (horizontals bleeding
right, stopping at a 132px left inset) that contradicts the measured DOM.
Verify its geometry claims before acting on them.

---

**Specimens are one species pretending to be nine.** cf-002, 003, 004, 006, 007 are the same herbaceous flowering stalk in the same three-quarter upright pose at the same scale, in the same sepia-to-black range. A real herbarium sheet has a compression fern, a grass with seed head, a single broad leaf, a root mass with soil, a woody twig, a moss clump. Vary organ type and silhouette family, not just species name. As it stands the page reads as one asset run through five prompts, which is the exact "rendered by a system" failure mode the brief bans.

**Plate scale is uniform and the composition dies of it.** Every specimen occupies roughly the same 40% of its cell, centred, with an even air margin. Herbarium sheets are cramped and irregular: a big specimen crowds its label and gets folded back on itself, a tiny one sits in the top-left third of an otherwise empty card. Break the scale ladder hard, at least 4x between smallest and largest, and let two specimens run off their cell edge rather than politely fitting.

**Paper hinges are the weakest object on the page and they are barely there.** They read as flat white rectangles with no shadow, no bleed of adhesive, no fold, no torn edge, placed at implausible spots (cf-006 has two floating on leaf blades, holding nothing). A hinge is a folded strip crossing a *stem or thick axis*, casting a hairline drop, slightly off-square, glue haloing the cream. Either execute them at full fidelity on the stems only, or delete them; half-rendered they read as artifact, not craft.

**Only cf-001 is off-axis; the rest are dead-centred.** The single best plate on the page is the horizontal specimen running left-to-right in shot 00, because it doesn't sit in the middle of anything. cf-008 in shot 03 is centred in a nearly empty full-width cell with the label parked far left — the label is orphaned, not restrained. Anchor labels to the specimen's own bounding box, not to a fixed cell gutter.

**Label block hierarchy has a redundant line.** `loc. marshallhouston.wtf` under the title `marshallhouston.wtf` says the same word twice in two type styles. Similar in cf-003 (`lenny explorer` / `loc. lenny-explorer`), cf-005, cf-006, cf-008. When the slug equals the title, the loc line is noise. Print the domain once; use the loc line for the actual URL path only where it differs, or drop it.

**Label rule length is arbitrary.** The hairline over each accession is a fixed ~285px stub that matches neither the description block below it (cf-005's text runs well past it) nor the cell width. Herbarium label rules either box the label or span its full measure. Set the rule to the label block's own measure, or to the cell gutter width, and be consistent.

**The ruled grid does not close.** In shot 01 and 04 the vertical centre rule stops short at the top of the section and again mid-page; in shot 03 the horizontals run to the right edge but the vertical is a stub floating below the header. Shot 05 shows a vertical rule that terminates in mid-air at y≈537 with nothing above or below aligning to it. Decide the rule's behaviour at the sheet edge and hold it everywhere: full bleed to both edges, or stopped at a consistent inset. Right now horizontals bleed right but stop at a 132px left inset, so the grid is asymmetric with no reason for it.

**The grain is a JPEG texture, not fiber.** Cream field carries a uniform fine speckle at one frequency, plus a few conspicuous dark blobs (the black dot at 1201,521 in shot 01 is 3x the size of anything else and reads as a dead pixel). Real laid paper has directional chain lines, an uneven deckle at the edge, and tonal drift across the sheet. Add a very low-frequency luminance gradient and a subtle vertical laid pattern; kill the outlier specks.

**Header nav is a website, not a sheet.** `apps golf toolshed` top right with an underlined active state is standard web chrome dropped on top of the herbarium. On a sheet, navigation would be marginalia: a small index of accession ranges, or nothing at the top and a printed index in the footer. At minimum, drop the underline for a lighter active marker and stop the header rule flush with the grid rules instead of at a different inset.

**The toolshed table is a different design.** Shot 05 is a two-column spec table with full-width horizontal rules on every row, monospace left column, serif right. It's competent but it is web-app table styling, not printed-sheet styling, and its rule density contradicts the restraint of the eight plates above it. Strip the row rules entirely, tighten leading, and set it as a printed index: hanging indent, no rules, the way a herbarium sheet's determination list is set.

**"Cosmic" is not embedded, it's absent.** The brief asks for the cosmic object present in the sheet as the same object, never named. I see none: no star field in the fiber, no plate-number that reads as a catalogue of the sky, no specimen that resolves at distance into a constellation, no faint ruled coordinate. The one gesture, `field 18h 36m 56s +38° 47' 01"` in the footer, is right-angled but buried and appears once. Push that idea into the sheet itself — coordinates on every accession label alongside the botanical loc, and specimen shadows that fall as if lit by one point source far off the sheet.

**Nine plates, eight shown.** The brief says nine; the page runs cf-001 through cf-010 with cf-009/010 under a separate "golf" heading. That's fine as an editorial decision but the section headers (`apps eight live`, `golf counted properly`, `toolshed 20 skills…`) introduce a fourth type register — bold monospace lowercase plus a grey monospace gloss — that appears nowhere else. It's the closest the page comes to explanatory copy and it's the weakest typography on it.

SCORE: 5/10
