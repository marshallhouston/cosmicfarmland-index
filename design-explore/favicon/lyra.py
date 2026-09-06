"""The lyra favicon, drawn for 16px first.

The first cut plotted five stars at their real relative magnitudes with hairline
joins, which is right on the sheet and unreadable in a tab: the faint stars drop
out and the lines disappear. This keeps the constellation's actual shape, the
parallelogram with Vega hanging off one corner, and pushes everything up to a
weight that survives a 16px raster.

A favicon renders in isolation, so currentColor resolves to black and inherits
nothing from the tab strip. The colour is set explicitly, with a
prefers-color-scheme rule inside the file for a dark strip.
"""
LIGHT, DARK = "#141310", "#e8e2d2"

# lyra's shape: vega, then the parallelogram
STARS = [(26, 20, 15), (60, 34, 9), (76, 66, 9), (44, 80, 9), (30, 50, 8)]
JOINS = "M60 34 L76 66 L44 80 L30 50 Z"
VEGA_JOIN = "M26 20 L30 50"

body = (
    f'<path d="{JOINS}" fill="none" stroke="var(--i)" stroke-width="6" '
    f'stroke-linejoin="round" opacity=".42"/>'
    f'<path d="{VEGA_JOIN}" fill="none" stroke="var(--i)" stroke-width="6" '
    f'stroke-linecap="round" opacity=".42"/>'
    + "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="var(--i)"/>' for x, y, r in STARS)
)

svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
    f'<style>:root{{--i:{LIGHT}}}'
    f'@media(prefers-color-scheme:dark){{:root{{--i:{DARK}}}}}</style>'
    f'{body}</svg>'
)
open("lyra.svg", "w").write(svg)
print("lyra.svg", len(svg), "bytes")

# the same mark as a data uri, url-encoded only where it must be
from urllib.parse import quote
data = "data:image/svg+xml," + quote(svg, safe="/:;=,{}()#'\"<>-. ")
open("lyra.datauri.txt", "w").write(data)
print("data uri", len(data), "chars")
