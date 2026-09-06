# Pass 11 — the print card sheet

Six scroll positions at 1490 wide, shots in `pass11-shots/`. First critique of
the card treatment. Prompt updated to hold the card and the single specimen
scale as settled.

Scored 5/10, the same as passes 9 and 10, which by now says more about the
critic instances than about the page. What is useful here is that the gaps have
moved off the sheet's structure and onto the card's execution.

Findings that check out against the DOM and are worth acting on: two cards use
a different geometry from the other eight, the scan backgrounds still show as
rectangles inside the window, the rule weights differ across jobs, and the
caption measure is unset so the description block is a different shape on every
card.

Findings held for the owner: the label form is deliberately uneven, because the
`loc.` line was dropped where it only restated the title. The critic wants it
back on every card as a blank-where-empty form. That is a real choice, not a
defect.

---

**Card rotation.** Every card is tilted, and the tilts read as a random function, not a hand: cf-001 and cf-008 use nearly the same wide-card angle, cf-009 and cf-010 mirror each other almost exactly. Worse, the tilt is applied to the card *and* its drop shadow as one rigid object, so nothing reads as physically placed. Alternative: kill rotation on at least half the cards, keep two or three at under 0.5 degrees, and let the variation come from mount position within the cell rather than from angle.

**The shadow.** Uniform soft grey box-shadow, offset down-right, identical on all ten cards. That is the single most system-rendered element on the page: a real mounted card on paper casts a tight, short, slightly warm shadow that is asymmetric to the lift of the corner. Alternative: drop the shadow to a 1-2px warm-grey contact edge on two sides only, or remove it entirely and let a hairline card edge do the work.

**Two cards do not obey the caption band.** cf-001 and cf-008 are landscape-wide with the caption inset left; the other eight are portrait with the caption at a fixed depth. The stated rule is one window, one caption band of fixed depth. These two break it and read as a different component, not as emphasis. Alternative: make all ten the same card geometry, or if 001 and 008 are meant to lead, give them the same portrait card and let cell width do the emphasis.

**Specimen scans have visible rectangles.** On cf-003, cf-008 and cf-010 you can see the scan's own background as a lighter/darker box inside the card window (clearest on cf-008, where a pale rectangle sits behind the yarrow and cuts across the caption rule). The knockout is incomplete. Alternative: properly matte the scans to the card tone, or hard-mask each specimen to its silhouette.

**Grid rules stop at the wrong places.** The horizontal rules run edge to edge, but the verticals appear only between paired cells and terminate mid-gutter with no relationship to the horizontals: at the cf-004/005 row the vertical ends well short of the rule below it, and in the toolshed block the vertical starts below the section rule at a different inset than the one above. Alternative: pick one system, either verticals that meet every horizontal at a true intersection, or verticals that stop consistently at a fixed inset from each; right now it is neither.

**Rule weight and colour vary.** The section rules under "apps" and "toolshed" are heavier and darker than the grid rules between plates, and the toolshed vertical is lighter still. Three weights doing one job. Alternative: one hairline weight, one ink dilution, everywhere.

**cf-008 sits alone in a full-width row with nothing balancing it.** After eight cards in a strict two-up, the ninth is centred in a wide cell with enormous dead space to both sides, then the "golf" section label appears below it. It reads as a layout that ran out of items rather than a deliberate plate. Alternative: nine items in three rows of three, or let 008 be the row and remove the centring so it hangs from the left column line like everything else.

**Accession labels are inconsistent.** cf-001, 003, 005 carry no `loc.` line; 002, 004, 006, 007, 009, 010 do. cf-009 and 010 add a second field after the number (`/ the record`, `/ 2026 denver city am`) that no other card has. A printed accession label is a form: same fields, same order, blank where empty. Alternative: every label carries acc. and loc., with the field label printed and the value blank when unknown, which is what a real sheet does.

**The paper texture is noise, not fibre.** Fine even speckle at uniform density across the whole viewport, including inside the cards. Real laid stock has directional fibre, occasional larger inclusions, and density that varies. Alternative: fewer, larger, irregular flecks; give the card stock a different grain from the sheet so the two surfaces separate.

**The cosmic element is missing, not embedded.** The `field 18h 36m 56s +38° 47' 01"` line in the colophon is the only trace, and it is a text field in a data block: announced in words, exactly what was ruled out. Nothing in the specimens, the sheet, or the mounting carries it. Alternative: put it in the object, a plate coordinate system, a star-chart puncture pattern in the sheet, a specimen whose silhouette is read as a constellation.

**Caption typography leaks.** Description lines break inconsistently: cf-004 and cf-006 wrap to two lines mid-phrase, cf-005 and cf-003 run a single long line to near the card edge, cf-007's two lines end ragged with a one-word tail. Alternative: a fixed measure of roughly 34-38 characters for every description, so the block is the same shape on all ten.

**Header hierarchy is soft.** "cosmic farmland" wordmark and the three nav items are the same mono face at similar tracking; the nav sits slightly higher than the wordmark's optical centre. Alternative: bring the nav onto the wordmark baseline and separate them by weight or ink density, not just size.

**Footer link is the only underlined thing on the page** and uses a default-looking underline at default offset. Alternative: a hairline matching the grid rules, offset clear of the descenders.

SCORE: 5/10
