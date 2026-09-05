from PIL import Image, ImageChops
import os, glob

os.makedirs("work/img", exist_ok=True)

# 1. paper: crop deckle edges, keep interior for tiling
p = Image.open("work/img/paper-tile.jpg").convert("RGB")
w,h = p.size
m = int(min(w,h)*0.10)
p.crop((m,m,w-m,h-m)).resize((900, int(900*(h-2*m)/(w-2*m)))).save("work/img/paper.jpg", quality=88)
print("paper", p.size, "->", Image.open("work/img/paper.jpg").size)

# 2. specimens: white -> alpha, keep colour, trim to content
for f in sorted(glob.glob("work/img/specimen-*.jpg")):
    im = Image.open(f).convert("RGB")
    g  = im.convert("L")
    # alpha: fully opaque at ink, transparent at paper white
    lo, hi = 120, 252
    alpha = g.point(lambda v: 255 if v <= lo else (0 if v >= hi else int(255*(hi-v)/(hi-lo))))
    out = im.convert("RGBA")
    out.putalpha(alpha)
    bbox = alpha.getbbox()
    if bbox: out = out.crop(bbox)
    # cap width so files stay light
    if out.width > 1200:
        out = out.resize((1200, int(out.height*1200/out.width)), Image.LANCZOS)
    name = os.path.basename(f).replace(".jpg",".png")
    out.save(f"work/img/{name}")
    print(name, out.size, os.path.getsize(f"work/img/{name}")//1024, "kb")
