"""Second pass: monograms cut from the real fonts, and pressed silhouettes.

The first ten were line icons. Thin, symmetric, centred, schematic. TASTE.md
asks the reader to think a person made the sheet, and those read as rendered by
a system. They also illustrated the concept, which is the visual form of the
explanatory copy the taste doc bans.

Two directions here instead.

MONOGRAMS. The wordmark is IBM Plex Mono 500 and the sheet already abbreviates
itself in its own accession block: "cf 2026 / 001-012". So the monogram is cf,
cut from the actual font rather than drawn to look like it. Outlines come out of
the TTF through fontTools, so the curves are Plex's own.

SILHOUETTES. A pressed specimen is dense, irregular and asymmetric. Typing bezier
path data by hand produces the tidy symmetry that made the first ten look
generated, so these are grown from a seeded RNG: every blade, spike and lobe
carries its own jitter. Same seed, same mark, and the shape has the unevenness of
something real without anyone pretending to draw it freehand.
"""
import math
import os
import random

LIGHT, DARK = "#141310", "#e8e2d2"
# The two faces the sheet already uses, cached next to this file on first run.
# Google serves TTF rather than woff2 to an old user agent, and fontTools reads
# TTF directly, so this avoids both a vendored binary and a brotli dependency.
FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
TTF = {
    "plexmono500": "https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJ8lc.ttf",
    "spectral600": "https://fonts.gstatic.com/s/spectral/v15/rnCs-xNNww_2s0amA9vmtl3G.ttf",
}


def ttf(name):
    path = os.path.join(FONTS, f"{name}.ttf")
    if not os.path.exists(path):
        from urllib.request import urlretrieve
        os.makedirs(FONTS, exist_ok=True)
        urlretrieve(TTF[name], path)
    return path


# ---------------------------------------------------------------- monograms

def glyphs(name, chars):
    """SVG path data plus the real ink bounds for `chars`, in font units."""
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.boundsPen import BoundsPen
    font = TTFont(ttf(name))
    gs, cmap = font.getGlyphSet(), font.getBestCmap()
    out = {}
    for ch in chars:
        g = gs[cmap[ord(ch)]]
        pen, bounds = SVGPathPen(gs), BoundsPen(gs)
        g.draw(pen)
        g.draw(bounds)
        out[ch] = (pen.getCommands(), bounds.bounds)
    return out


def fit(glyph, x, y, w, h, align="center"):
    """Place a glyph's ink inside the box (x,y,w,h) of the 100x100 viewBox.

    The first cut guessed scale and offsets by eye, which is why the stacked and
    cut monograms came out mispositioned at every size. Measuring the real ink
    bounds and solving for the transform makes placement exact, so composing a
    ligature is arithmetic rather than nudging numbers until it looks right.
    """
    d, (x0, y0, x1, y1) = glyph
    bw, bh = x1 - x0, y1 - y0
    s = min(w / bw, h / bh)
    ox = {"center": (w - s * bw) / 2, "left": 0, "right": w - s * bw}[align]
    tx = x + ox - s * x0
    ty = y + (h - s * bh) / 2 + s * y1
    return (f'<g transform="translate({tx:.2f} {ty:.2f}) scale({s:.5f} {-s:.5f})">'
            f'<path d="{d}" fill="var(--i)"/></g>')


PLEX = glyphs("plexmono500", "cf")
SPEC = glyphs("spectral600", "cf")


def monograms():
    pc, pf, sc, sf = PLEX["c"], PLEX["f"], SPEC["c"], SPEC["f"]
    return {
        # c and f side by side, the wordmark's own letterfit
        "cf-pair": fit(pc, 6, 30, 40, 40) + fit(pf, 50, 18, 40, 64),

        # stacked, so the mark is a square block rather than a wide word
        "cf-stack": fit(pc, 26, 6, 48, 42) + fit(pf, 26, 52, 48, 42),

        # the f overlaps the c and its crossbar runs through: one letterform
        "cf-cut": fit(pc, 2, 28, 56, 52) + fit(pf, 40, 12, 44, 78),

        # the accession stamp: cf struck inside a ruled box. A ring around a
        # single c is the copyright glyph and reads as nothing else.
        "cf-box": ('<rect x="7" y="18" width="86" height="64" fill="none" '
                   'stroke="var(--i)" stroke-width="8"/>'
                   + fit(pc, 22, 38, 26, 26) + fit(pf, 51, 31, 26, 40)),

        # the same pair cut from Spectral instead: the sheet's other register
        "cf-serif": fit(sc, 6, 32, 40, 38) + fit(sf, 50, 14, 40, 70),
    }


# --------------------------------------------------------------- silhouettes

def blade(x, y, ang, length, width, bend, rng):
    """One tapered leaf: base at (x,y), curving to a point. Sides get separate
    control points so the two edges of a blade never match."""
    a = math.radians(ang)
    tx, ty = x + math.sin(a) * length, y - math.cos(a) * length
    p = math.radians(ang + 90)
    hx, hy = math.cos(p) * width, -math.sin(p) * width
    b1, b2 = bend * rng.uniform(0.6, 1.4), bend * rng.uniform(0.6, 1.4)
    mx, my = (x + tx) / 2, (y + ty) / 2
    return (f'M{x - hx:.1f} {y - hy:.1f} '
            f'Q{mx - hx * 1.5 + b1:.1f} {my - hy * 1.5 + b1 * .3:.1f} {tx:.1f} {ty:.1f} '
            f'Q{mx + hx * 1.5 + b2:.1f} {my + hy * 1.5 + b2 * .3:.1f} '
            f'{x + hx:.1f} {y + hy:.1f} Z')


def lobed(cx, cy, r, lobes, rough, rng):
    """A closed blob whose radius wanders: a seed head, a pod, a burr body."""
    pts = []
    for i in range(lobes):
        a = 2 * math.pi * i / lobes
        rr = r * (1 + rng.uniform(-rough, rough))
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr * 0.92))
    d = f'M{pts[0][0]:.1f} {pts[0][1]:.1f}'
    for i in range(len(pts)):
        x0, y0 = pts[i]
        x1, y1 = pts[(i + 1) % len(pts)]
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        k = 1 + rng.uniform(0.04, 0.20)
        d += f' Q{mx * k:.1f} {my * k:.1f} {x1:.1f} {y1:.1f}'
    return d + " Z"


def path(d, **kw):
    at = "".join(f' {k.replace("_","-")}="{v}"' for k, v in kw.items())
    return f'<path d="{d}" fill="var(--i)"{at}/>'


def silhouettes():
    out = {}

    # a clump of grass, splayed and uneven
    rng = random.Random(7)
    ds = [f'M50 96 C48 78 47 66 48 58']
    body = path("M46 96 C44 76 44 64 47 52 L53 52 C55 66 55 78 54 96 Z")
    blades = "".join(path(blade(50, 62, a + rng.uniform(-9, 9),
                                rng.uniform(38, 62), rng.uniform(5.5, 8.5),
                                rng.uniform(-7, 7), rng))
                     for a in (-46, -26, -6, 14, 34, 52))
    out["tuft"] = body + blades

    # a thistle: spiked head on a stem that does not stand up straight
    rng = random.Random(19)
    stem = path("M52 96 C50 82 47 74 44 62 L52 60 C55 74 57 84 58 96 Z")
    head = path(lobed(46, 40, 21, 11, 0.16, rng))
    spikes = "".join(path(blade(46 + math.cos(math.radians(a)) * 15,
                                40 + math.sin(math.radians(a)) * 14,
                                a + 90 + rng.uniform(-14, 14),
                                rng.uniform(14, 25), rng.uniform(3.2, 5.0),
                                rng.uniform(-4, 4), rng))
                    for a in range(-90, 271, 36))
    out["thistle"] = stem + spikes + head

    # a frond, pinnae shrinking toward the tip
    rng = random.Random(3)
    spine = path("M22 94 C34 74 44 52 56 20 L64 24 C52 56 40 78 28 96 Z")
    pinnae = []
    for i in range(9):
        t = i / 8
        x = 24 + t * 34
        y = 92 - t * 66
        L = 30 * (1 - t * 0.72) + rng.uniform(-3, 3)
        for side in (-1, 1):
            pinnae.append(path(blade(x, y, (60 * side) + rng.uniform(-12, 12) - 14,
                                     L, L * 0.20, rng.uniform(-5, 5), rng)))
    out["frond"] = spine + "".join(pinnae)

    # one blade, bent. Every other silhouette here is a cluster; this is the
    # quiet one. A plain crescent reads as a parenthesis, so it needs a real
    # belly and a stalk to be a leaf and not punctuation.
    rng = random.Random(31)
    out["blade"] = (path("M45 96 C44 86 45 78 47 70 L55 72 C53 80 52 87 52 96 Z")
                    + path(blade(50, 74, -16, 74, 19, 13, rng)))

    # a burr: one body, spines all round it. the same object reads as a seed and
    # as something with rays, which is the brief's rule about not stacking ideas
    rng = random.Random(11)
    spines = "".join(path(blade(50 + math.cos(math.radians(a)) * 17,
                                52 + math.sin(math.radians(a)) * 17,
                                a + 90 + rng.uniform(-10, 10),
                                rng.uniform(18, 31), rng.uniform(3.6, 6.0),
                                rng.uniform(-5, 5), rng))
                     for a in range(0, 360, 30))
    out["burr"] = spines + path(lobed(50, 52, 20, 10, 0.12, rng))
    return out


CANDIDATES = {**monograms(), **silhouettes()}


def svg(body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
            f'<style>:root{{--i:{LIGHT}}}'
            f'@media(prefers-color-scheme:dark){{:root{{--i:{DARK}}}}}</style>'
            f'{body}</svg>')


if __name__ == "__main__":
    os.makedirs("candidates2", exist_ok=True)
    for name, body in CANDIDATES.items():
        open(f"candidates2/{name}.svg", "w").write(svg(body))
        print(f"{name:12} {len(svg(body)):6} bytes")
