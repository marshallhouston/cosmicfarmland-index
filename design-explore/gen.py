import os, json, base64, urllib.request, sys

key = None
for line in open(os.path.expanduser('~/.config/cf/env')):
    if line.startswith('GEMINI_API_KEY='):
        key = line.split('=',1)[1].strip()
MODEL = sys.argv[1] if len(sys.argv)>1 else 'gemini-3.1-flash-image'
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

JOBS = {
 "specimen-fern": "A single pressed and dried fern frond, photographed flat on a plain pure white background, herbarium specimen. Brittle and flattened, slightly translucent where the press thinned it, browned and torn at the tips, one pinna snapped off, crushed darkened veins. Muted olive and umber, desaturated. Even flat lighting, absolutely no shadow, no props, no text. Top down archival flatbed scan.",
 "specimen-grass": "A single pressed and dried stalk of wild grass with a seed head, flat on a plain pure white background, herbarium specimen. Bleached pale straw colour, nearly translucent, some seeds shed, stem slightly bent. Even flat lighting, absolutely no shadow, no props, no text. Top down archival flatbed scan.",
 "specimen-root": "A pressed and dried plant root mass, flat on a plain pure white background, herbarium specimen. Dark tangled fibrous roots spreading from a taproot, soil brushed away, several rootlets broken. Near black and umber. Even flat lighting, absolutely no shadow, no props, no text. Top down archival flatbed scan.",
 "specimen-seedhead": "A pressed and dried umbel seed head on a thin stem, flat on a plain pure white background, herbarium specimen. Fine radiating spokes, most seeds gone, a few remaining, dry and brittle, pale brown. Even flat lighting, absolutely no shadow, no props, no text. Top down archival flatbed scan.",
 "paper-tile": "A scan of blank antique cream laid paper, aged, with visible fibre flecks and faint horizontal chain lines and a few small brown foxing spots. Flat even lighting, no shadow, no objects, no text, no border. Straight on, high resolution seamless texture.",
}

for name, prompt in JOBS.items():
    body = json.dumps({"contents":[{"parts":[{"text":prompt}]}]}).encode()
    req = urllib.request.Request(URL, data=body, headers={"x-goog-api-key":key,"Content-Type":"application/json"})
    try:
        r = json.load(urllib.request.urlopen(req, timeout=180))
    except Exception as e:
        print(name, "FAIL", e); continue
    saved = False
    for p in r.get("candidates",[{}])[0].get("content",{}).get("parts",[]):
        if "inlineData" in p:
            ext = "png" if "png" in p["inlineData"].get("mimeType","") else "jpg"
            path = f"work/img/{name}.{ext}"
            open(path,"wb").write(base64.b64decode(p["inlineData"]["data"]))
            print(name, "ok", path, os.path.getsize(path))
            saved = True
    if not saved:
        print(name, "no image returned", json.dumps(r)[:300])
