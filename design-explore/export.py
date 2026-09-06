"""Export the ten mounted specimens for the live site.

The scans are 1200px canvases with the specimen floating inside a wide margin,
which is dead weight and also makes the plant sit small in its window. Cropping
to the alpha bbox moves the hinge coordinates, since those are percentages of
the image, so they are transformed by the same crop rather than re-derived:
hinge.py's two hand-placed overrides survive that, and would not survive a
re-run against different pixels.

Output is webp with alpha at 2x the rendered window. avif would be smaller but
the plugin is not installed and webp already carries alpha everywhere it counts.
"""
import json, os
from PIL import Image

SRC = "work/img"
OUT = "../public/specimens"
MAX_W, MAX_H = 760, 660          # 2x the ~348x300 card window, longest side wins
PAD = 0.015                      # a little air, so nothing is cut at the bbox

used = json.load(open("used.json")) if os.path.exists("used.json") else None
hinges = json.load(open("work/hinges.json"))

# the ten the sheet actually mounts, in accession order
USED = ["specimen-ice-plant", "specimen-bee-balm", "specimen-aster",
        "specimen-blue-salvia", "specimen-furmans-red-sage", "specimen-hyssop",
        "specimen-hummingbird-mint", "specimen-yarrow", "specimen-echinacea",
        "specimen-pitcher-salvia"]

os.makedirs(OUT, exist_ok=True)
manifest = {}
total = 0
for name in USED:
    src = f"{SRC}/{name}.png"
    im = Image.open(src).convert("RGBA")
    W, H = im.size
    box = im.getchannel("A").getbbox()
    if not box:
        print(name, "no content"); continue
    px, py = int(W * PAD), int(H * PAD)
    l, t, r, b = (max(0, box[0] - px), max(0, box[1] - py),
                  min(W, box[2] + px), min(H, box[3] + py))
    im = im.crop((l, t, r, b))
    cw, ch = im.size

    scale = min(MAX_W / cw, MAX_H / ch, 1.0)
    if scale < 1:
        im = im.resize((round(cw * scale), round(ch * scale)), Image.LANCZOS)

    dst = f"{OUT}/{name}.webp"
    im.save(dst, "WEBP", quality=82, method=6)
    kb = os.path.getsize(dst) // 1024
    total += kb

    # the hinges are percentages of the old canvas; move them onto the new one
    moved = []
    for x, y, ln, rot in hinges[f"{name}.png"]:
        moved.append([round((x / 100 * W - l) / cw * 100, 1),
                      round((y / 100 * H - t) / ch * 100, 1), ln, rot])
    manifest[name] = {"w": im.width, "h": im.height, "hinges": moved}
    print(f"{name:34} {W}x{H} -> {im.width}x{im.height}  {kb}kb")

# the sheet's fibre, tiled under everything
paper = Image.open(f"{SRC}/paper.jpg").convert("RGB")
paper.save(f"{OUT}/../paper.webp", "WEBP", quality=76, method=6)
print("paper", paper.size, os.path.getsize(f"{OUT}/../paper.webp") // 1024, "kb")

json.dump(manifest, open(f"{OUT}/../specimens.json", "w"), indent=1)
print("total", total, "kb across", len(manifest), "specimens")
