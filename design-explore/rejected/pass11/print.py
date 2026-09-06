"""Each plate as a mounted print, sitting inside the ruled cell.

Three notes from the page owner drove this: the label type reads tiny against
the specimens, the labels feel randomly placed down each section, and the
varied specimen sizes read as odd rather than as habit. A print card fixes all
three at once, because a card is a fixed object: every specimen is scaled to
one window, and every caption sits in the same band.
"""
import re, json

BASE = open("work/index.html").read()
FILES = ["p-1-card.html", "p-2-onsheet.html", "p-3-corners.html"]
NAMES = ["caption in the card", "caption on the sheet", "photo corners"]

CARD_CSS = """
  /* ---------- the print: one object, one window, one caption band ---------- */
  .card{
    position:relative; display:block; width:%(w)dpx; max-width:100%%;
    background:#f2ede0;
    padding:%(pad)dpx %(pad)dpx 0;
    box-shadow:0 0 0 .5px rgba(58,45,22,.34), 6px 8px 14px -10px rgba(40,31,14,.55);
  }
  .card .mount{
    --s:1;                      /* one window. the print is the fixed thing. */
    width:100%%; height:%(win)dpx; margin:0;
    display:flex; align-items:center; justify-content:center;
  }
  .card .mount img{ max-width:100%%; max-height:100%% }
  .row.full .card .mount, .row.full .card .mount img{ height:%(win)dpx; max-height:%(win)dpx }
  .card .lab{ height:%(cap)dpx; overflow:hidden }
  .sp{ align-items:center; justify-content:flex-start }
  .row.full .sp .card{ width:%(wfull)dpx }
"""

# the type was set against a 340px specimen and read tiny beside it. against a
# print card it can sit at reading size.
TYPE = [
    ('    font-weight:500; font-size:8.5px; letter-spacing:.2em;\n    color:var(--ink-3); display:block;',
     '    font-weight:500; font-size:9.5px; letter-spacing:.2em;\n    color:var(--ink-3); display:block;'),
    ('    font-weight:400; font-size:16px; line-height:1.15;',
     '    font-weight:400; font-size:20px; line-height:1.12;'),
    ('    display:block; font-size:11px; line-height:1.4;',
     '    display:block; font-size:13px; line-height:1.45;'),
    ('    font-size:9px; letter-spacing:.14em; color:var(--ink-2);',
     '    font-size:10px; letter-spacing:.14em; color:var(--ink-2);'),
]


def variant(n):
    s = BASE
    for a, b in TYPE:
        s = s.replace(a, b)

    # the specimen sizes were set per habit. the owner reads them as odd, and a
    # print card makes them one size anyway.
    s = re.sub(r'\{ no:"(cf-0\d\d)", s:[\d.]+,', r'{ no:"\1",', s)

    caption_in_card = n != 1
    pad = 22
    win = 300
    s = s.replace("  /* ---------- section register", CARD_CSS % dict(
        w=392, wfull=560, pad=pad, win=win, cap=124) + "\n  /* ---------- section register")

    if caption_in_card:
        # polaroid proportion: the caption band is deeper than the margins
        s = s.replace("  .lab{ margin-top:14px; align-self:flex-start }",
                      "  .lab{ margin-top:0; align-self:stretch; width:100%%; border-top:0;\n"
                      "        padding:16px 0 %dpx }" % (pad + 14))
    else:
        s = s.replace("  .lab{ margin-top:14px; align-self:flex-start }",
                      "  .lab{ margin-top:20px; align-self:flex-start; width:392px }")

    if n == 2:
        # photo corners, holding the print to the card the way a print is held
        s = s.replace("  .fox{", """  .cnr{
    position:absolute; width:19px; height:19px; z-index:7;
    background:linear-gradient(135deg, rgba(52,40,18,.42), rgba(52,40,18,.30));
    pointer-events:none;
  }
  .cnr.tl{ left:-1px;  top:-1px;    clip-path:polygon(0 0,100% 0,0 100%) }
  .cnr.tr{ right:-1px; top:-1px;    clip-path:polygon(0 0,100% 0,100% 100%) }
  .cnr.bl{ left:-1px;  bottom:-1px; clip-path:polygon(0 0,0 100%,100% 100%) }
  .cnr.br{ right:-1px; bottom:-1px; clip-path:polygon(100% 0,100% 100%,0 100%) }
  .fox{""")

    corners = ('<span class="cnr tl"></span><span class="cnr tr"></span>'
               '<span class="cnr bl"></span><span class="cnr br"></span>') if n == 2 else ""

    # the print is the object now, so it carries the tilt, and the specimen
    # inside it sits square in its window.
    old = re.search(r'  return `<a class="sp".*?</a>`;\n\}', s, re.S).group(0)
    lab = ('''    <span class="lab">
      <span class="no">${a.no}${a.kick?" &nbsp;/&nbsp; "+a.kick:""}</span>
      <span class="name">${a.n}</span>
      <span class="d">${a.d}</span>
      ${a.loc.replace(/-/g," ") === a.n ? "" : `<span class="fld">loc. <em>${a.loc}</em></span>`}
    </span>''')
    inner = ('''    <span class="card" style="transform:rotate(${(a.rot*0.42).toFixed(2)}deg)">
      <span class="mount">
        <img class="ph${a.pale?" pale":""}" src="img/${a.img}" alt="${a.alt}">
      </span>
%s      ''' + corners + '''
    </span>%s''') % ((lab + "\n", "") if caption_in_card else ("", "\n" + lab))
    s = s.replace(old, '  return `<a class="sp" href="${a.u}">\n' + inner + '\n  </a>`;\n}')

    nav = ("""
<div id="vnav" style="position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:99999;font:12px/1 ui-monospace,monospace;letter-spacing:.08em;background:#141310;color:#f2ede0;padding:9px 16px;border-radius:999px;opacity:.72;user-select:none">
&larr;&nbsp;&nbsp;{n}/3&nbsp; {name} &nbsp;&rarr;
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

    s = re.sub(r'/\* -+ arrows step between registers -+ \*/\n'
               r'addEventListener\("keydown".*?\n\}\);\n', '', s, flags=re.S)
    return s.replace("</body>", nav + "</body>")


for i, f in enumerate(FILES):
    open("work/" + f, "w").write(variant(i))
    print("wrote work/" + f)
