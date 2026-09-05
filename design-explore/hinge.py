"""Place each plate's paper hinges on the specimen's own stem.

The coordinates were hand-guessed, so hinges landed on leaf blades and on bare
card. Three critiques in a row caught it. A hinge holds a stem down, so find
the stems: scan the mask for lines where the ink narrows to a single short run,
which is what a stem is and what a leaf is not, then lay the strip across it.
"""
import json, glob, math
from PIL import Image

def runs(line, thresh):
    """contiguous ink runs in one row or column of the mask"""
    out, start = [], None
    for i, v in enumerate(line):
        if v > thresh and start is None: start = i
        elif v <= thresh and start is not None:
            out.append((start, i)); start = None
    if start is not None: out.append((start, len(line)))
    return out

def stem_points(mask, W, H, axis, tol, thresh):
    """(pos, centre, width) for every line whose ink is one narrow run"""
    px = mask.load()
    n, m = (H, W) if axis == "row" else (W, H)
    span = max(8, int(m * tol))            # a stem is a small fraction of the sheet
    found = []
    for i in range(int(n * .08), int(n * .92)):
        line = [px[j, i] if axis == "row" else px[i, j] for j in range(m)]
        r = [x for x in runs(line, thresh) if 2 <= x[1] - x[0] <= span]
        ink = sum(1 for v in line if v > thresh)
        if len(r) == 1 and ink and (r[0][1] - r[0][0]) / ink > .45:
            a, b = r[0]
            found.append((i, (a + b) / 2, b - a))
    return found

def place(path):
    im = Image.open(path).convert("RGBA")
    W, H = im.size
    # these are flatbed scans on white, not cutouts: the alpha channel is
    # opaque everywhere, so reading it gave every point a pass and hinges
    # landed on bare card. use alpha only when it is a real cutout.
    alpha = im.getchannel("A")
    clear = sum(h for v, h in enumerate(alpha.histogram()) if v < 200)
    mask = alpha if clear > W * H * .05 else im.convert("L").point(lambda v: 255 - v)

    # pick the scan that finds the LONGEST stem, not the most candidate lines.
    # counting lines picked whichever band was densest, which on a coneflower
    # is the seed head, and then the two hinges had nowhere to spread to.
    thresh = max(60, int(mask.getextrema()[1] * .45))
    bb = mask.point(lambda v: 255 if v > thresh else 0).getbbox() or (0, 0, W, H)
    bbox_w, bbox_h = bb[2] - bb[0], bb[3] - bb[1]
    best, axis, reach = [], "row", 0
    for tol in (.025, .05, .09):
        for a in ("row", "col"):
            p = stem_points(mask, W, H, a, tol, thresh)
            if len(p) < 2: continue
            r = (p[-1][0] - p[0][0]) / float(H if a == "row" else W)
            if (a == "row") != (bbox_h >= bbox_w): r *= .6   # against the grain
            if r > reach + .02 or (abs(r - reach) <= .02 and len(p) > len(best)):
                best, axis, reach = p, a, max(r, reach)
    if len(best) < 2:
        return None

    # spread the two hinges over the stem's actual extent, not over the list.
    # picking by list index put both strips on whatever band happened to hold
    # the most candidate lines, so several plates got two hinges a pixel apart.
    span_lo, span_hi = best[0][0], best[-1][0]
    if span_hi - span_lo < max(H, W) * .05:
        return None
    want_lo = span_lo + (span_hi - span_lo) * .22
    want_hi = span_lo + (span_hi - span_lo) * .78
    lo = min(best, key=lambda p: abs(p[0] - want_lo))
    hi = min(best, key=lambda p: abs(p[0] - want_hi))
    out = []
    for pos, ctr, w in (lo, hi):
        # local stem direction, from how the centre drifts either side
        near = [p for p in best if abs(p[0] - pos) <= max(14, H * .06)]
        d_pos = near[-1][0] - near[0][0] if len(near) >= 2 else 0
        d_ctr = near[-1][1] - near[0][1] if len(near) >= 2 else 0
        if abs(d_pos) < max(6, H * .02):     # no honest run to measure
            d_pos, d_ctr = 1, 0
        # the strip lies across the stem, so its long axis is the perpendicular
        if axis == "row":
            sx, sy = d_ctr, d_pos
            x, y = ctr, pos
        else:
            sx, sy = d_pos, d_ctr
            x, y = pos, ctr
        rot = math.degrees(math.atan2(-sx, sy))
        while rot > 90: rot -= 180
        while rot < -90: rot += 180
        out.append([round(x / W * 100, 1), round(y / H * 100, 1),
                    min(34, max(18, int(w * .9) + 14)), round(rot, 1)])
    return out

# hand corrections, for plates where the scan settles on something that is not
# a stem. the detector wins by default; these override it.
OVERRIDES = {
    # the aster's top candidate sat in the scan haze above the flower heads.
    "specimen-aster.png": [[50.5, 34.0, 20, -4.0], [49.8, 84.4, 28, -12.3]],
    # yarrow's feathery leaves flank the stem the whole way down, so no scan
    # line is ever a single narrow run. these two are read off the stem by hand
    # at 66% and 88% of the plate.
    "specimen-yarrow.png": [[48.7, 66.0, 20, -2.0], [50.2, 88.0, 22, 1.0]],
}

import os
res = json.load(open("work/hinges.json")) if os.path.exists("work/hinges.json") else {}
for f in sorted(glob.glob("work/img/specimen-*.png")):
    name = f.split("/")[-1]
    h = place(f)
    if h: res[name] = h          # a miss keeps whatever was placed before
    if name in OVERRIDES: res[name] = OVERRIDES[name]
    print(name, res.get(name))
json.dump(res, open("work/hinges.json", "w"), indent=1)
