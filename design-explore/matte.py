"""Clamp the scans' background alpha to zero.

These are cutouts, but the cut left the background at alpha 2 to 13 rather than
0: 92% of every image is partially transparent. Against the sheet that haze is
invisible, which is why it survived eleven passes. Against a card it paints a
faint rectangle at the image bounds. Only the floor is moved, so specimen edges
and pale flower heads, which sit far above it, are untouched.
"""
import glob
from PIL import Image

FLOOR = 26

for f in sorted(glob.glob("work/img/specimen-*.png")):
    im = Image.open(f).convert("RGBA")
    a = im.getchannel("A")
    h = a.histogram()
    below = sum(h[:FLOOR])
    if not below:
        print(f.split("/")[-1], "already clean"); continue
    im.putalpha(a.point(lambda v: 0 if v < FLOOR else v))
    im.save(f)
    print(f.split("/")[-1], "cleared", round(below / (im.size[0] * im.size[1]) * 100, 1), "% of the frame")
