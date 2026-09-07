"""The mark as raster fallbacks: favicon.ico and apple-touch-icon.png.

public/favicon.svg is the primary icon and carries its own prefers-color-scheme
rule. These two exist for the surfaces that never see it: /favicon.ico is fetched
blind by crawlers, feed readers and Google's result-icon scraper, none of which
parse SVG, and apple-touch-icon.png is what iOS puts on a home screen instead of
a screenshot of the page.

There is no SVG rasteriser on this machine. The first version hand-drew the mark
(five circles and two strokes) directly in Pillow, which stopped working the
moment the mark became a specimen made of beziers. So this reads public/favicon.svg
and flattens its path data instead: whatever the mark becomes next, this file does
not need to know.

Drawn at 8x and downsampled, because a 16px frame drawn directly has no
antialiasing and fine work falls apart. iOS honours neither transparency nor
prefers-color-scheme on apple-touch-icon, so that one gets dark ink on the sheet's
own cream rather than the adaptive pair.

ponytail: fills every subpath solid, so a glyph with a counter (the bowl of an o,
the eye of an e) would come out filled in. The marks drawn here have none. If one
ever does, this needs a real nonzero-winding scanline fill.
"""
import re
from PIL import Image, ImageDraw

SVG = "../../public/favicon.svg"
INK = (20, 19, 16)      # #141310
CARD = (242, 237, 224)  # #f2ede0, the sheet's own cream
SS = 8                  # supersample factor
STEPS = 24              # segments per bezier

TOKEN = re.compile(r'([MLCQZmlcqz])|(-?\d*\.?\d+)')


def _bezier(p, steps=STEPS):
    """De Casteljau for a quadratic or cubic, as `steps` points."""
    out = []
    for i in range(1, steps + 1):
        t, q = i / steps, list(p)
        while len(q) > 1:
            q = [(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
                 for a, b in zip(q, q[1:])]
        out.append(q[0])
    return out


def subpaths(d):
    """SVG path data to a list of point lists. Absolute M/L/C/Q/Z only, which is
    all the generators emit; anything else raises rather than drawing it wrong."""
    toks, i = TOKEN.findall(d), 0
    flat = [(c, n) for c, n in toks]
    paths, cur, start, cmd = [], [], None, None
    while i < len(flat):
        c, n = flat[i]
        if c:
            if c in "Zz":
                if cur:
                    paths.append(cur)
                    cur = []
                i += 1
                continue
            if c.islower():
                raise ValueError(f"relative command {c!r} in path data")
            cmd = c
            i += 1
            continue
        if cmd is None:
            raise ValueError("path data began with a number")

        def num():
            nonlocal i
            v = float(flat[i][1])
            i += 1
            return v

        if cmd == "M":
            pt = (num(), num())
            if cur:
                paths.append(cur)
            cur, start, cmd = [pt], pt, "L"
        elif cmd == "L":
            cur.append((num(), num()))
        elif cmd == "Q":
            c1 = (num(), num())
            end = (num(), num())
            cur += _bezier([cur[-1], c1, end])
        elif cmd == "C":
            c1, c2 = (num(), num()), (num(), num())
            end = (num(), num())
            cur += _bezier([cur[-1], c1, c2, end])
    if cur:
        paths.append(cur)
    return paths


def shapes():
    """Every filled subpath in the mark, in the 0-100 user space."""
    svg = open(SVG).read()
    out = []
    for d in re.findall(r'<path[^>]*\bd="([^"]+)"', svg):
        out += subpaths(d)
    if not out:
        raise ValueError(f"no path data in {SVG}")
    return out


def draw(size, ink, background=None):
    """The mark at `size` px. Transparent unless `background` is given."""
    n = size * SS
    s = n / 100
    img = Image.new("RGBA", (n, n), background + (255,) if background else (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for poly in shapes():
        if len(poly) >= 3:
            d.polygon([(x * s, y * s) for x, y in poly], fill=ink + (255,))
    return img.resize((size, size), Image.LANCZOS)


def check():
    """The mark has to survive a tab strip and stay off the edges."""
    a = draw(180, INK, background=CARD).convert("RGB")
    corners = [a.getpixel(p) for p in ((0, 0), (179, 0), (0, 179), (179, 179))]
    assert all(c == CARD for c in corners), f"ink at the edge: {corners}"

    for n in (16, 32, 48):
        alpha = draw(n, INK).getchannel("A")
        assert alpha.getextrema()[1] > 200, f"{n}px: mark too faint for a tab"
        covered = sum(1 for p in alpha.get_flattened_data() if p > 40) / (n * n)
        assert 0.06 < covered < 0.72, f"{n}px: {covered:.0%} ink is not a mark"


if __name__ == "__main__":
    check()

    # Each frame is drawn at its own size rather than downsampled from the
    # largest. Pillow fills any size it was not handed by resizing the base, so
    # the base must be the largest and the rest passed through append_images.
    ICO = [48, 32, 16]
    frames = [draw(n, INK) for n in ICO]
    frames[0].save("../../public/favicon.ico", format="ICO",
                   sizes=[(n, n) for n in ICO], append_images=frames[1:])
    print("favicon.ico", sorted(ICO))

    draw(180, INK, background=CARD).save("../../public/apple-touch-icon.png")
    print("apple-touch-icon.png 180x180 on cream")
