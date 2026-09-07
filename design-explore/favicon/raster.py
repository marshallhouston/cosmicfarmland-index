"""The lyra mark as raster fallbacks: favicon.ico and apple-touch-icon.png.

The SVG in public/ is the primary icon and carries its own prefers-color-scheme
rule. These two files exist for the surfaces that never see it: /favicon.ico is
fetched blind by crawlers, feed readers and Google's result-icon scraper, none
of which parse SVG, and apple-touch-icon.png is what iOS puts on a home screen
instead of a screenshot of the page.

No SVG rasteriser on this machine, so the geometry from lyra.py is redrawn
directly. It is five circles and two strokes, which is less code than a
dependency. Drawn at 8x and downsampled, because a 16px .ico frame drawn
directly has no antialiasing and the parallelogram falls apart.

iOS ignores transparency and prefers-color-scheme on apple-touch-icon, so that
one gets the cream card stock behind dark ink rather than the adaptive pair.
"""
from PIL import Image, ImageDraw

# same numbers as lyra.py: vega, then the parallelogram
STARS = [(26, 20, 15), (60, 34, 9), (76, 66, 9), (44, 80, 9), (30, 50, 8)]
JOINS = [(60, 34), (76, 66), (44, 80), (30, 50)]
VEGA_JOIN = [(26, 20), (30, 50)]
STROKE, JOIN_ALPHA = 6, 107  # .42 * 255

INK_LIGHT = (20, 19, 16)     # #141310
CARD = (242, 237, 224)       # #f2ede0, the sheet's own cream
SS = 8                       # supersample factor


def draw(size, ink, background=None):
    """The mark at `size` px. Transparent unless `background` is given."""
    n = size * SS
    s = n / 100  # user units to device px
    img = Image.new("RGBA", (n, n), background + (255,) if background else (0, 0, 0, 0))

    # The joins are one path at 42% in the SVG, so they are drawn on their own
    # layer at full alpha and composited once. Stroking them directly would
    # double the alpha everywhere two segments meet.
    joins = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    jd = ImageDraw.Draw(joins)
    w = max(1, round(STROKE * s))
    pts = [(x * s, y * s) for x, y in JOINS]
    vega = [(x * s, y * s) for x, y in VEGA_JOIN]
    jd.line(pts + [pts[0]], fill=ink + (255,), width=w, joint="curve")
    jd.line(vega, fill=ink + (255,), width=w)
    # Pillow strokes butt ends and mitreless corners; the SVG rounds both.
    for x, y in pts + vega:
        jd.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=ink + (255,))
    joins.putalpha(joins.getchannel("A").point(lambda a: a * JOIN_ALPHA // 255))
    img.alpha_composite(joins)

    d = ImageDraw.Draw(img)
    for x, y, r in STARS:
        d.ellipse([(x - r) * s, (y - r) * s, (x + r) * s, (y + r) * s], fill=ink + (255,))

    return img.resize((size, size), Image.LANCZOS)


def check():
    """The first cut drew the vega end caps in user units instead of device px,
    which parked a stray dot in the top-left corner of every frame. Cheap to
    catch, invisible at 16px until it is on a tab strip."""
    a = draw(180, INK_LIGHT, background=CARD).convert("RGB")
    corners = [a.getpixel(p) for p in ((0, 0), (179, 0), (0, 179), (179, 179))]
    assert all(c == CARD for c in corners), f"ink at the edge: {corners}"

    ink = [draw(n, INK_LIGHT).getchannel("A").getextrema()[1] for n in (16, 32, 48)]
    assert all(m > 200 for m in ink), f"mark too faint to survive a tab: {ink}"


if __name__ == "__main__":
    check()

    # Each frame is drawn at its own size rather than downsampled from the
    # largest, so the 16px one keeps the weight lyra.py tuned for it. Pillow
    # fills any size it was not handed by resizing the base image, so the base
    # must be the largest and the rest passed through append_images.
    ICO = [48, 32, 16]
    frames = [draw(n, INK_LIGHT) for n in ICO]
    frames[0].save("../../public/favicon.ico", format="ICO",
                   sizes=[(n, n) for n in ICO], append_images=frames[1:])
    print("favicon.ico", sorted(ICO))

    draw(180, INK_LIGHT, background=CARD).save("../../public/apple-touch-icon.png")
    print("apple-touch-icon.png 180x180 on cream")
