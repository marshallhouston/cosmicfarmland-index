"""Favicon candidates, drawn rather than borrowed from an emoji font.

The current mark is a seedling emoji in an SVG <text> node, so it renders as
whatever emoji font the reader's OS ships and looks like a different icon on
every platform. These are drawn paths: one file, same everywhere, and legible
at 16px, which is the only size that really matters.

currentColor throughout, so the mark follows the tab strip's own light or dark
rather than carrying a background of its own.
"""
import os

W = 100
CANDIDATES = {
    # the sheet's own structure: a ruled cell with one specimen mounted in it
    "cell": '''<rect x="8" y="8" width="84" height="84" fill="none" stroke="currentColor" stroke-width="5" opacity=".38"/>
<path d="M50 78 L50 34" stroke="currentColor" stroke-width="7" stroke-linecap="round" fill="none"/>
<path d="M50 46 C38 40 32 30 32 22 C42 24 49 32 50 44 Z" fill="currentColor"/>
<path d="M50 56 C62 50 68 40 68 32 C58 34 51 42 50 54 Z" fill="currentColor"/>''',

    # the accession label: the hairline and the number under it
    "label": '''<rect x="10" y="26" width="80" height="6" rx="3" fill="currentColor"/>
<rect x="10" y="48" width="56" height="9" rx="4" fill="currentColor"/>
<rect x="10" y="66" width="76" height="6" rx="3" fill="currentColor" opacity=".45"/>
<rect x="10" y="80" width="40" height="6" rx="3" fill="currentColor" opacity=".45"/>''',

    # lyra, the constellation already plotted on the sheet
    "lyra": '''<circle cx="30" cy="20" r="11" fill="currentColor"/>
<circle cx="62" cy="38" r="6" fill="currentColor"/>
<circle cx="40" cy="52" r="6" fill="currentColor"/>
<circle cx="70" cy="74" r="6" fill="currentColor"/>
<circle cx="44" cy="84" r="6" fill="currentColor"/>
<path d="M30 20 L62 38 L70 74 L44 84 L40 52 Z" fill="none" stroke="currentColor" stroke-width="3.5" opacity=".5"/>''',

    # a single pressed stem, hinged
    "stem": '''<path d="M50 90 C50 64 48 44 44 20" stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M46 44 C32 40 24 30 22 20 C36 22 46 32 47 42 Z" fill="currentColor"/>
<path d="M49 62 C64 58 74 48 76 38 C62 40 51 50 50 60 Z" fill="currentColor"/>
<rect x="30" y="68" width="40" height="12" rx="2" fill="currentColor" opacity=".55"/>''',
}

os.makedirs(".", exist_ok=True)
for name, body in CANDIDATES.items():
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {W}">'
           f'{body}</svg>')
    open(f"{name}.svg", "w").write(svg)
    print(f"{name}.svg  {len(svg)} bytes")

rows = "\n".join(
    f'''<tr>
  <th>{n}</th>
  <td><img src="{n}.svg" width="16" height="16"></td>
  <td><img src="{n}.svg" width="24" height="24"></td>
  <td><img src="{n}.svg" width="32" height="32"></td>
  <td><img src="{n}.svg" width="64" height="64"></td>
  <td class="tab"><img src="{n}.svg" width="16" height="16"><span>cosmic farmland</span></td>
</tr>''' for n in CANDIDATES)

open("index.html", "w").write(f'''<!doctype html><meta charset=utf-8>
<title>favicon candidates</title>
<style>
 body{{background:#f2ede0;color:#141310;font:13px "IBM Plex Mono",ui-monospace,monospace;
      margin:0;padding:36px}}
 table{{border-collapse:collapse;width:100%;max-width:760px}}
 th,td{{text-align:left;padding:16px 14px;border-top:1px solid rgba(20,19,16,.18);vertical-align:middle}}
 th{{font-weight:500;letter-spacing:.18em;width:90px}}
 img{{display:block}}
 .tab{{width:230px}}
 .tab img{{display:inline-block;vertical-align:-3px;margin-right:8px}}
 .tab span{{font-size:12px}}
 .dark{{background:#1c1a16;color:#e8e2d2;margin-top:40px;padding:24px;border-radius:2px}}
 .dark table{{color:#e8e2d2}}
 .dark th,.dark td{{border-top-color:rgba(232,226,210,.2)}}
 caption{{text-align:left;padding-bottom:14px;letter-spacing:.2em;font-size:10px;opacity:.6}}
</style>
<table><caption>on cream, the sizes a tab actually uses</caption>{rows}</table>
<div class="dark"><table><caption>on a dark tab strip</caption>{rows}</table></div>
''')
print("wrote index.html")
