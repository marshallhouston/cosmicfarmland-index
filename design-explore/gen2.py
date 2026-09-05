import os, json, base64, urllib.request
key=[l.split('=',1)[1].strip() for l in open(os.path.expanduser('~/.config/cf/env')) if l.startswith('GEMINI_API_KEY=')][0]
URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent"
BASE=" flat on a plain pure white background, herbarium specimen, dried and pressed. Even flat lighting, absolutely no shadow, no props, no text, no border. Top down archival flatbed scan, high resolution."
JOBS={
 "specimen-yarrow":"A single pressed and dried yarrow (Achillea millefolium) stem with feathery fern-like leaves and a flat cluster of tiny dried flower heads,"+BASE,
 "specimen-echinacea":"A single pressed and dried echinacea (coneflower) stem with one flower head, drooping dried petals radiating around a spiky cone center, and a few lance-shaped leaves,"+BASE,
 "specimen-aster":"A single pressed and dried aster stem with narrow leaves and several small daisy-like dried flower heads with thin radiating petals,"+BASE,
 "specimen-furmans-red-sage":"A single pressed and dried Furman's Red autumn sage (Salvia greggii) stem with small oval leaves and a spike of tubular dried red flowers,"+BASE,
 "specimen-blue-salvia":"A single pressed and dried blue salvia stem with narrow leaves and a tall spike of small tubular dried flowers,"+BASE,
 "specimen-pitcher-salvia":"A single pressed and dried pitcher sage (Salvia azurea) stem, slender and airy, with narrow leaves and widely spaced tubular dried flowers along the spike,"+BASE,
 "specimen-hyssop":"A single pressed and dried anise hyssop stem with pointed serrated leaves and a dense bottlebrush spike of tiny dried flowers,"+BASE,
 "specimen-ice-plant":"A single pressed and dried Hardy Ice Plant (Delosperma) stem, low and trailing, with thick fleshy succulent leaves and one flattened star-shaped dried flower,"+BASE,
 "specimen-hummingbird-mint":"A single pressed and dried hummingbird mint (Agastache) stem with triangular toothed leaves and a loose spike of tubular dried flowers,"+BASE,
 "specimen-bee-balm":"A single pressed and dried bee balm (Monarda) stem with one shaggy dried flower head made of many thin tubular petals radiating outward, and a pair of opposite leaves,"+BASE,
}
for name,prompt in JOBS.items():
    body=json.dumps({"contents":[{"parts":[{"text":prompt}]}]}).encode()
    req=urllib.request.Request(URL,data=body,headers={"x-goog-api-key":key,"Content-Type":"application/json"})
    try: r=json.load(urllib.request.urlopen(req,timeout=180))
    except Exception as e: print(name,"FAIL",e); continue
    ok=False
    for p in r.get("candidates",[{}])[0].get("content",{}).get("parts",[]):
        if "inlineData" in p:
            open(f"work/img/{name}.jpg","wb").write(base64.b64decode(p["inlineData"]["data"])); ok=True
            print(name,"ok")
    if not ok: print(name,"no image",json.dumps(r)[:200])
