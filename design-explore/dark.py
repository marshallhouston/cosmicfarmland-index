"""Three readings of the sheet after dark.

The sheet is cream card with black ink, which taste.md calls the strongest
positive signal in the whole set, so dark mode cannot simply invert it. Each
variant decides a different thing about what the dark is: the room, the light,
or the stock itself.

The page has two surfaces, the sheet and the print card mounted on it, and they
do not have to go dark together. Ink is defined on the sheet and redefined
inside .card, so a variant can keep dark ink on a light card while everything
printed directly on the sheet goes pale.
"""
import re, json

BASE = open("work/index.html").read()
FILES = ["d-1-board.html", "d-2-inverted.html", "d-3-dim.html"]
NAMES = ["night board", "inverted", "dim lamp"]

# what every variant shares: the browser ground behind the sheet
COMMON = """
  /* ---------- after dark ---------- */
  :root{
"""


def variant(n):
    s = BASE

    if n == 0:
        # the room went dark, the sheet did not. the card is still cream paper
        # with black ink on it; only what is printed straight onto the board
        # turns pale. the specimens keep multiply because their surface is
        # unchanged.
        theme = """
    --sheet:#1c1a16;
    --stock:#f2ede0;
    --card:#141310;
    --ink:#e8e2d2;
    --ink-2:#bdb5a2;
    --ink-3:#8d8676;
    --rule:rgba(232,226,210,.20);
  }
  .card{
    --ink:#141310;
    --ink-2:#3a352b;
    --ink-3:#6c6453;
  }
  .lab{ border-top-color:rgba(20,19,16,.55) }
  .sheet::after{ opacity:.32 }
  .sheet::before{ mix-blend-mode:screen; opacity:.05 }
  .card{ box-shadow:0 0 0 .5px rgba(0,0,0,.5), 8px 10px 20px -10px rgba(0,0,0,.7) }
  .col{ color:var(--ink-2) }
  footer{ color:var(--ink-3) }
  footer a{ border-bottom-color:rgba(232,226,210,.3) }
"""

    elif n == 1:
        # the stock itself is dark. the specimens have to be re-lit: pressed ink
        # on a dark card would vanish under multiply, so they are inverted and
        # screened, and read as a photographic negative of the plate.
        theme = """
    --sheet:#15130f;
    --stock:#24211a;
    --card:#0e0d0b;
    --ink:#ece6d6;
    --ink-2:#c2baa6;
    --ink-3:#8f8878;
    --rule:rgba(236,230,214,.18);
  }
  .lab{ border-top-color:rgba(236,230,214,.45) }
  .sheet::after{ opacity:.3 }
  .sheet::before{ mix-blend-mode:screen; opacity:.06 }
  .ph, .ph.pale, .ph.faint{
    mix-blend-mode:screen;
    filter:invert(1) grayscale(1) sepia(.32) saturate(1.4) hue-rotate(-14deg) contrast(.94) brightness(1.02);
    opacity:.92;
  }
  .lab .fld em{ color:inherit }
  .col{ color:var(--ink-2) }
  footer{ color:var(--ink-3) }
  footer a{ border-bottom-color:rgba(236,230,214,.3) }
  .hinge{ background:linear-gradient(180deg, rgba(84,76,58,.9), rgba(64,58,44,.85)) }
  .hinge::after{ background:rgba(0,0,0,.45) }
  #field i{ background:#f4efe0 }
  .card{ box-shadow:0 0 0 .5px rgba(0,0,0,.6), 8px 10px 20px -10px rgba(0,0,0,.8) }
"""

    else:
        # the same cream stock under one low lamp. nothing is inverted; the
        # whole sheet is simply further down the exposure, so the card is a
        # dimmed paper rather than a dark one and the ink stays ink.
        theme = """
    --sheet:#2a2620;
    --stock:#cfc7b2;
    --card:#1b1915;
    --ink:#ddd6c5;
    --ink-2:#b3ab98;
    --ink-3:#8a8271;
    --rule:rgba(221,214,197,.19);
  }
  .card{
    --ink:#211e18;
    --ink-2:#463f33;
    --ink-3:#6f6857;
  }
  .lab{ border-top-color:rgba(33,30,24,.5) }
  .sheet::after{ opacity:.4 }
  .sheet::before{ mix-blend-mode:screen; opacity:.05 }
  .ph{ opacity:.82 }
  .col{ color:var(--ink-2) }
  footer{ color:var(--ink-3) }
  footer a{ border-bottom-color:rgba(221,214,197,.3) }
  .card{ box-shadow:0 0 0 .5px rgba(0,0,0,.45), 7px 9px 18px -10px rgba(0,0,0,.65) }
"""

    s = s.replace("  /* ---------- section register",
                  COMMON.rstrip("\n") + theme + "\n  /* ---------- section register")

    nav = ("""
<div id="vnav" style="position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:99999;font:12px/1 ui-monospace,monospace;letter-spacing:.08em;background:#f2ede0;color:#141310;padding:9px 16px;border-radius:999px;opacity:.8;user-select:none">
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
