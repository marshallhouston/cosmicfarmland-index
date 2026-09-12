import os, json, base64, urllib.request
key=[l.split('=',1)[1].strip() for l in open(os.path.expanduser('~/.config/cf/env')) if l.startswith('GEMINI_API_KEY=')][0]
URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent"
# mat-forming groundcovers: drawn as a single upright stem they read as the
# wrong plant. these get MAT instead of BASE.
MAT=(" A low ground-hugging mat: dense crowded foliage spreading wider than it is tall,"
     " with the flowers sitting right on top of the cushion on very short stalks. Wider than tall."
     " No long bare stem, no cut single stem, no upright habit.")
MATS={"specimen-blue-spruce-sedum","specimen-basket-of-gold","specimen-prairie-winecups"}
BASE=" flat on a plain pure white background, herbarium specimen, dried and pressed. Even flat lighting, absolutely no shadow, no props, no text, no border. Top down archival flatbed scan, high resolution."
JOBS={
 "specimen-autumn-joy-sedum":"A pressed and dried Sedum 'Autumn Joy' stem: thick fleshy succulent oval leaves with toothed edges in opposite pairs up a stout stem, topped by one broad flat domed head of tiny dusty rose-bronze dried flowers. Not a fern, no feathery foliage.",
 "specimen-red-salvia":"A single pressed and dried autumn sage (Salvia greggii) stem with small oval leaves and a loose spike of tubular dried magenta-red flowers,",
 "specimen-moonbeam-coreopsis":"A single pressed and dried threadleaf coreopsis stem with fine needle-like threadlike leaves and one small dried daisy flower with pale yellow petals,",
 "specimen-prairie-winecups":"A pressed and dried prairie winecup (Callirhoe involucrata) mat: sprawling trailing runners forming a low tangle of deeply lobed palmate leaves, with two cup-shaped magenta dried flowers sitting on top.",
 "specimen-black-eyed-susan":"A single pressed and dried black-eyed Susan (Rudbeckia) stem with coarse hairy lance-shaped leaves and one dried flower head with drooping golden petals around a dark domed center,",
 "specimen-butterfly-blue-pincushion":"A single pressed and dried pincushion flower (Scabiosa) stem, slender and wiry, with narrow lobed leaves and one rounded dried lavender-blue pincushion flower head,",
 "specimen-blue-spruce-sedum":"A pressed and dried Sedum reflexum 'Blue Spruce' stonecrop mat: a dense creeping carpet of short plump blue-green cylindrical succulent leaves, with small flat clusters of dried yellow star flowers held just above the mat. A succulent stonecrop, not a conifer.",
 "specimen-blue-grama-grass":"A single pressed and dried blue grama grass (Bouteloua gracilis) stalk with thin blades and two curved one-sided eyebrow-shaped dried seed heads at the top,",
 "specimen-blue-flax":"A single pressed and dried blue flax (Linum lewisii) stem, very slender and wiry, with tiny narrow leaves and two flat five-petaled dried pale blue flowers,",
 "specimen-prairie-coneflower":"A single pressed and dried Mexican hat prairie coneflower (Ratibida columnifera) stem with deeply divided leaves and one flower with a tall columnar cone and a few drooping dried yellow petals,",
 "specimen-rabbitbrush":"A pressed and dried rabbitbrush (Ericameria nauseosa) branch: one woody grey stem with narrow thread-like grey-green leaves and a rounded cluster of tiny dried golden-yellow flowers at the tip.",
 "specimen-rigid-goldenrod":"A pressed and dried stiff goldenrod (Solidago rigida) stem: broad rough oval leaves clasping an upright stem, topped by one flat-topped corymb of tiny dried yellow flowers.",
 "specimen-rocky-mountain-penstemon":"A single pressed and dried Rocky Mountain penstemon (Penstemon strictus) stem with narrow smooth leaves and a one-sided spike of tubular dried deep blue-purple flowers,",
 "specimen-showy-fleabane":"A single pressed and dried showy fleabane (Erigeron speciosus) stem with narrow leaves and one dried daisy flower head with very many fine thread-thin lavender ray petals,",
 "specimen-yellow-columbine":"A pressed and dried golden columbine (Aquilegia chrysantha): a slender stem with rounded three-lobed blue-green leaflets and one saturated golden yellow nodding flower with five long straight backward-pointing spurs. Strong yellow colour, clearly visible, not bleached or white.",
 "specimen-walkers-low-catmint":"A single pressed and dried catmint (Nepeta) stem with small gray-green scalloped opposite leaves and a loose spike of tiny tubular dried lavender flowers,",
 "specimen-blanket-flower":"A single pressed and dried blanket flower (Gaillardia aristata) stem with coarse hairy lobed leaves and one dried daisy flower head with red petals tipped in yellow around a domed center,",
 "specimen-golden-baby-goldenrod":"A single pressed and dried goldenrod stem with narrow lance-shaped leaves and a tall plume-shaped arching spray of tiny dried yellow flowers,",
 "specimen-pineleaf-penstemon":"A single pressed and dried pineleaf penstemon (Penstemon pinifolius) stem with very fine needle-like pine leaves and slender tubular dried yellow flowers,",
 "specimen-rose-marvel-salvia":"A single pressed and dried meadow sage (Salvia nemorosa) stem with wrinkled lance-shaped leaves and a dense upright spike of small tubular dried rose-pink flowers,",
 "specimen-basket-of-gold":"A pressed and dried basket of gold (Aurinia saxatilis) mound: a dense cushion of small grey fuzzy spoon-shaped leaves, capped by tight clusters of tiny golden yellow four-petaled dried flowers.",
}
for name,prompt in JOBS.items():
    out=f"work/img/{name}.jpg"
    if os.path.exists(out): print(name,"skip"); continue
    body=json.dumps({"contents":[{"parts":[{"text":prompt+(MAT if name in MATS else "")+BASE}]}]}).encode()
    req=urllib.request.Request(URL,data=body,headers={"x-goog-api-key":key,"Content-Type":"application/json"})
    try: r=json.load(urllib.request.urlopen(req,timeout=300))
    except Exception as e: print(name,"FAIL",e); continue
    ok=False
    for p in r.get("candidates",[{}])[0].get("content",{}).get("parts",[]):
        if "inlineData" in p:
            open(out,"wb").write(base64.b64decode(p["inlineData"]["data"])); ok=True; print(name,"ok")
    if not ok: print(name,"no image",json.dumps(r)[:200])
