"""Ten favicon candidates, drawn for 16px and judged there.

The constraint from DIRECTION.md holds: the cosmic thing and the farm thing have
to be one object, not two ideas stacked. A star next to a leaf is two ideas. A
seed head whose grains are stars is one.

A tab renders the mark at 16px, so nothing here is thinner than 6 user units or
smaller than a 7-unit radius. Hairlines and small counters vanish; the shapes
that survive are the ones a reader can name from across the room.

Everything is var(--i) with a prefers-color-scheme rule, same as lyra.svg, so the
mark follows a light or dark tab strip without carrying a background.
"""
import os

LIGHT, DARK = "#141310", "#e8e2d2"
W = 100
S, F = 'stroke="var(--i)" fill="none"', 'fill="var(--i)"'
CAP = 'stroke-linecap="round" stroke-linejoin="round"'

CANDIDATES = {
    # a grass seed head, and the grains are the stars
    "seedhead": f'''<path d="M50 94 C50 72 50 58 48 40" {S} stroke-width="7" {CAP}/>
<circle cx="34" cy="52" r="8" {F}/><circle cx="63" cy="45" r="8" {F}/>
<circle cx="36" cy="30" r="8" {F}/><circle cx="62" cy="24" r="8" {F}/>
<circle cx="48" cy="10" r="10" {F}/>''',

    # plowed rows running to a horizon, with the sun already up
    "furrow": f'''<circle cx="50" cy="24" r="13" {F}/>
<path d="M10 60 Q50 46 90 60" {S} stroke-width="8" {CAP}/>
<path d="M8 78 Q50 62 92 78" {S} stroke-width="8" {CAP}/>
<path d="M8 94 Q50 78 92 94" {S} stroke-width="8" {CAP}/>''',

    # a seed with a ring: the planet and the thing you plant, same body
    "ringed-seed": f'''<circle cx="50" cy="50" r="21" {F}/>
<ellipse cx="50" cy="50" rx="44" ry="16" {S} stroke-width="7"
  transform="rotate(-24 50 50)"/>''',

    # a pod, and the seeds in it are a constellation
    "pod": f'''<path d="M26 20 C52 28 68 56 74 88 C46 82 30 54 26 20 Z" {S} stroke-width="7" {CAP}/>
<circle cx="41" cy="41" r="7" {F}/><circle cx="50" cy="58" r="7" {F}/>
<circle cx="59" cy="75" r="7" {F}/>''',

    # one specimen mounted in a ruled cell, the sheet's own structure
    "cell": f'''<path d="M12 32 L12 12 L32 12 M68 12 L88 12 L88 32
  M88 68 L88 88 L68 88 M32 88 L12 88 L12 68" {S} stroke-width="7" {CAP}/>
<circle cx="50" cy="38" r="14" {F}/>
<path d="M50 52 L50 74" {S} stroke-width="7" {CAP}/>''',

    # paper hinges holding a stem down, the herbarium's own gesture. The stem runs
    # on the diagonal: upright with square straps it reads as a crucifix.
    "hinge": f'''<g transform="rotate(-24 50 50)">
<path d="M50 10 L50 90" {S} stroke-width="7" {CAP}/>
<rect x="20" y="26" width="60" height="13" rx="3" {F} opacity=".45"/>
<rect x="20" y="61" width="60" height="13" rx="3" {F} opacity=".45"/>
<circle cx="50" cy="10" r="9" {F}/></g>''',

    # a sprout whose two leaves are a full moon and a crescent
    "sprout-moon": f'''<path d="M50 94 L50 44" {S} stroke-width="7" {CAP}/>
<circle cx="27" cy="34" r="15" {F}/>
<path d="M64 14 A19 19 0 1 0 64 52 A13 19 0 1 1 64 14 Z" {F}/>''',

    # an ear of grain, chevrons all the way up
    "grain": f'''<path d="M50 94 L50 14" {S} stroke-width="7" {CAP}/>
<path d="M22 62 L50 44 L78 62 M22 42 L50 24 L78 42" {S} stroke-width="8" {CAP}/>''',

    # the field, and the sun going down into it
    "horizon": f'''<path d="M26 58 A24 24 0 0 1 74 58 Z" {F}/>
<path d="M6 58 L94 58" {S} stroke-width="8" {CAP}/>
<path d="M14 78 Q50 68 86 78" {S} stroke-width="8" {CAP}/>
<path d="M14 94 Q50 84 86 94" {S} stroke-width="8" {CAP}/>''',

    # a taproot hanging off a planet, forking off-centre so it is a root and not
    # a pair of legs under a head
    "taproot": f'''<circle cx="44" cy="28" r="20" {F}/>
<path d="M44 48 C46 66 52 76 62 92 M50 62 L30 76 M56 76 L74 68" {S}
  stroke-width="7" {CAP}/>''',
}


def svg(body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
            f'<style>:root{{--i:{LIGHT}}}'
            f'@media(prefers-color-scheme:dark){{:root{{--i:{DARK}}}}}</style>'
            f'{body}</svg>')


if __name__ == "__main__":
    os.makedirs("candidates", exist_ok=True)
    for name, body in CANDIDATES.items():
        out = svg(body)
        open(f"candidates/{name}.svg", "w").write(out)
        print(f"{name:14} {len(out):5} bytes")
