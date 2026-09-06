"""Four ways of making lyra visible, from the same base sheet.

The constellation has been on the page since pass 8 and three critics in a row
failed to see it. Each variant changes only how present it is, nothing else, so
they can be compared by arrowing between them.
"""
import re, json

BASE = open("work/index.html").read()
FILES = ["c-1-larger.html", "c-2-sheet.html", "c-3-keyed.html", "c-4-light.html"]
NAMES = ["larger", "sheet scale", "keyed to the plates", "one hard light"]

FIELD_CSS = ('  #field{ position:absolute; right:2%; top:38%; width:380px; height:220px; '
             'pointer-events:none; z-index:3 }')
FIELD_JS_HEAD = 'const fld = document.getElementById("field"), W = 380, H = 220;'


def variant(n):
    s = BASE

    if n == 0:
        # same object, same place on the sheet, simply drawn at a size a reader
        # can register. nothing else moves.
        s = s.replace(FIELD_CSS,
            '  #field{ position:absolute; right:1%; top:30%; width:900px; height:520px; '
            'pointer-events:none; z-index:3 }')
        s = s.replace(FIELD_JS_HEAD,
            'const fld = document.getElementById("field"), W = 900, H = 520;')
        s = s.replace("Math.min(3.6, Math.max(1.4, (7.0 - m) * 0.55))",
                      "Math.min(5.2, Math.max(1.8, (7.0 - m) * 0.80))")

    elif n == 1:
        # the sheet is the plate. lyra is printed across the whole card at the
        # sheet's own scale, so it reads in the empty space between specimens
        # and nowhere needs a box of its own.
        s = s.replace(FIELD_CSS,
            '  #field{ position:absolute; inset:0; pointer-events:none; z-index:3 }')
        s = s.replace(FIELD_JS_HEAD,
            'const fld = document.getElementById("field"),\n'
            '      W = document.querySelector(".sheet").clientWidth,\n'
            '      H = document.querySelector(".sheet").scrollHeight;')
        s = s.replace("Math.min(3.6, Math.max(1.4, (7.0 - m) * 0.55))",
                      "Math.min(6.5, Math.max(2.0, (7.0 - m) * 1.0))")
        s = s.replace("Math.min(.78, Math.max(.34, (7.0 - m) * .13))",
                      "Math.min(.5, Math.max(.2, (7.0 - m) * .085))")

    elif n == 2:
        # the specimens are the stars. each plate takes the star that falls
        # nearest it and prints its coordinate in the label's own voice, so the
        # sheet is an accession of the sky and of the ground at once.
        s = s.replace(FIELD_CSS,
            '  #field{ position:absolute; right:2%; top:34%; width:520px; height:300px; '
            'pointer-events:none; z-index:3 }\n'
            '  .lab .ra{ display:block; margin-top:5px; font-family:"IBM Plex Mono", monospace;\n'
            '    font-size:8.5px; letter-spacing:.18em; color:var(--ink-3) }')
        s = s.replace(FIELD_JS_HEAD,
            'const fld = document.getElementById("field"), W = 520, H = 300;')
        s = s.replace("Math.min(3.6, Math.max(1.4, (7.0 - m) * 0.55))",
                      "Math.min(4.4, Math.max(1.6, (7.0 - m) * 0.66))")
        # one star per plate, in accession order, printed as a coordinate
        s = s.replace('      <span class="name">${a.n}</span>',
                      '      <span class="name">${a.n}</span>\n'
                      '      <span class="ra">${a.ra || ""}</span>')

    elif n == 3:
        # light, hard and physical, doing a job: one source far off the sheet,
        # so every specimen throws the same shadow and the card reads as a
        # thing under a sky rather than a picture of one.
        # the shadow has to join the end of each duotone chain. set as its own
        # filter declaration it was simply overwritten by the one below it.
        s = re.sub(r"(filter:grayscale\(1\) sepia[^;]*)", 
                   r"\1 drop-shadow(14px 10px 0.5px rgba(40,31,14,.26))", s)
        s = s.replace(FIELD_CSS,
            '  #field{ position:absolute; right:2%; top:36%; width:460px; height:265px; '
            'pointer-events:none; z-index:3 }')
        s = s.replace(FIELD_JS_HEAD,
            'const fld = document.getElementById("field"), W = 460, H = 265;')
        s = s.replace("Math.min(3.6, Math.max(1.4, (7.0 - m) * 0.55))",
                      "Math.min(4.2, Math.max(1.5, (7.0 - m) * 0.62))")

    nav = ("""
<div id="vnav" style="position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:99999;font:12px/1 ui-monospace,monospace;letter-spacing:.08em;background:#141310;color:#f2ede0;padding:9px 16px;border-radius:999px;opacity:.72;user-select:none">
&larr;&nbsp;&nbsp;{n}/4&nbsp; {name} &nbsp;&rarr;
</div>
<script>
(function(){{
  var files = {files};
  var i = {i};
  addEventListener("keydown", function(e){{
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName; if (t === "INPUT" || t === "TEXTAREA") return;
    if (e.key === "ArrowLeft")  location.href = files[(i + files.length - 1) % files.length];
    if (e.key === "ArrowRight") location.href = files[(i + 1) % files.length];
  }}, true);
}})();
</script>
""").format(n=n + 1, name=NAMES[n], files=json.dumps(FILES), i=n)

    # the base page steals the arrows to step between registers. in the explore
    # set the arrows belong to the switcher.
    s = re.sub(r'/\* -+ arrows step between registers -+ \*/\n'
               r'addEventListener\("keydown".*?\n\}\);\n', '', s, flags=re.S)
    return s.replace("</body>", nav + "</body>")


# the star each plate is keyed to, for variant 3
LYRA_RA = ["18h 37m 02s  +38 47", "18h 50m 05s  +33 22", "18h 58m 57s  +32 41",
           "18h 54m 49s  +36 54", "18h 44m 46s  +37 36", "18h 44m 14s  +39 40",
           "18h 44m 46s  +39 37", "18h 19m 52s  +36 04", "19h 16m 28s  +38 08",
           "19h 13m 13s  +39 09"]

for i, f in enumerate(FILES):
    out = variant(i)
    if i == 2:
        k = iter(LYRA_RA)
        out = re.sub(r'(\{ no:"cf-0\d\d",)', lambda m: m.group(1) + ' ra:"%s",' % next(k), out)
    open("work/" + f, "w").write(out)
    print("wrote work/" + f)
