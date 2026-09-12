# Plant inventory

What is actually planted at the house, and which of it has a print on
[/plant-prints](https://cosmicfarmland.wtf/plant-prints).

The source is the Resource Central *Garden in a Box* sheets that came with each
planting, kept in `~/Downloads/garden-in-a-box/`. Seven gardens went in across
2024 and 2025, several sharing plants, for 39 distinct species. This file is the
audit that produced `data/plant-prints.json`: it says what was planted, what
survived, and why a plant might be in a garden sheet but not on the page.

## Gardens

| Garden | Year |
|---|---|
| Bees & Blooms | 2024 |
| Butterfly Daydream | 2024 |
| Golden Hour | 2024 |
| Butterfly Haven | 2025 |
| Color Pop | 2025 |
| Sunlit Fiesta | 2025 |
| Mosaic Combo | 2025 |

Mosaic is a combination garden and repeats most of Butterfly Haven, Sunlit
Fiesta and Color Pop.

## Printed (31)

Every plant below has a specimen in `public/specimens/` and a card on
`/plant-prints`. The eleven marked **mounted** are also doing a second job on the
index, standing in for an app or a golf page.

| Plant | Latin | Specimen | Gardens |
|---|---|---|---|
| Fire Spinner ice plant | *Delosperma* 'Fire Spinner' | specimen-ice-plant (mounted) | Sunlit Fiesta, Mosaic |
| Purple coneflower | *Echinacea purpurea* | specimen-echinacea (mounted) | Bees & Blooms, Butterfly Daydream, Sunlit Fiesta, Mosaic |
| Aromatic aster | *Symphyotrichum oblongifolium* | specimen-aster (mounted) | Bees & Blooms, Color Pop, Butterfly Haven, Mosaic |
| May Night salvia | *Salvia nemorosa* 'May Night' | specimen-blue-salvia (mounted) | Bees & Blooms, Butterfly Daydream |
| Furman's Red salvia | *Salvia greggii* 'Furman's Red' | specimen-furmans-red-sage (mounted) | Color Pop, Sunlit Fiesta, Mosaic |
| Blue Fortune hyssop | *Agastache* 'Blue Fortune' | specimen-hyssop (mounted) | Butterfly Daydream, Sunlit Fiesta, Mosaic |
| Sunset hyssop | *Agastache rupestris* | specimen-hummingbird-mint (mounted) | Bees & Blooms |
| Yarrow | *Achillea millefolium* | specimen-yarrow (mounted) | Bees & Blooms, Golden Hour |
| Blue pitcher sage | *Salvia azurea* | specimen-pitcher-salvia (mounted) | Butterfly Haven, Mosaic |
| Native lavender bee balm | *Monarda fistulosa menthifolia* | specimen-bee-balm (mounted) | Golden Hour |
| Blue grama grass | *Bouteloua gracilis* | specimen-blue-grama-grass (mounted) | Mosaic |
| Autumn Joy sedum | *Sedum* 'Autumn Joy' | specimen-autumn-joy-sedum | Bees & Blooms |
| Red salvia | *Salvia greggii* | specimen-red-salvia | Bees & Blooms |
| Moonbeam coreopsis | *Coreopsis verticillata* 'Moonbeam' | specimen-moonbeam-coreopsis | Bees & Blooms, Sunlit Fiesta, Mosaic |
| Prairie winecups | *Callirhoe involucrata* | specimen-prairie-winecups | Bees & Blooms |
| Black-eyed Susan | *Rudbeckia fulgida* 'Goldsturm' | specimen-black-eyed-susan | Butterfly Daydream, Color Pop, Mosaic |
| Butterfly Blue pincushion | *Scabiosa columbaria* 'Butterfly Blue' | specimen-butterfly-blue-pincushion | Butterfly Daydream, Sunlit Fiesta, Mosaic |
| Blue Spruce sedum | *Sedum reflexum* 'Blue Spruce' | specimen-blue-spruce-sedum | Butterfly Daydream |
| Blue flax | *Linum lewisii* | specimen-blue-flax | Butterfly Haven, Mosaic |
| Prairie coneflower | *Ratibida columnifera* | specimen-prairie-coneflower | Butterfly Haven, Mosaic |
| Rabbitbrush | *Ericameria nauseosa* | specimen-rabbitbrush | Butterfly Haven, Mosaic |
| Rigid goldenrod | *Solidago rigida* | specimen-rigid-goldenrod | Butterfly Haven, Mosaic |
| Rocky Mountain penstemon | *Penstemon strictus* | specimen-rocky-mountain-penstemon | Butterfly Haven, Mosaic |
| Showy fleabane | *Erigeron speciosus* | specimen-showy-fleabane | Butterfly Haven, Mosaic |
| Golden columbine | *Aquilegia chrysantha* | specimen-yellow-columbine | Color Pop |
| Walker's Low catmint | *Nepeta racemosa* 'Walker's Low' | specimen-walkers-low-catmint | Color Pop, Mosaic |
| Blanket flower | *Gaillardia aristata* | specimen-blanket-flower | Golden Hour |
| Golden Baby goldenrod | *Solidago* 'Golden Baby' | specimen-golden-baby-goldenrod | Golden Hour |
| Mersea Yellow pineleaf penstemon | *Penstemon pinifolius* 'Mersea Yellow' | specimen-pineleaf-penstemon | Golden Hour |
| Rose Marvel salvia | *Salvia nemorosa* 'Rose Marvel' | specimen-rose-marvel-salvia | Sunlit Fiesta, Mosaic |
| Basket of gold | *Aurinia saxatilis* | specimen-basket-of-gold | Mosaic |

## Not printed (7)

In a garden sheet, but never established here: either substituted at pickup or
it did not take. No specimen, deliberately.

| Plant | Latin | Gardens |
|---|---|---|
| Gayfeather | *Liatris punctata* | Butterfly Haven, Mosaic |
| Small leaf pussytoes | *Antennaria parvifolia* 'McClintock' | Butterfly Haven, Mosaic |
| Pink phlox | *Phlox subulata* 'Emerald Pink' | Color Pop, Mosaic |
| Little bluestem grass | *Schizachyrium scoparium* | Butterfly Daydream |
| Prairie dropseed | *Sporobolus heterolepis* | Butterfly Daydream |
| Shenandoah switchgrass | *Panicum virgatum* 'Shenandoah' | Sunlit Fiesta |
| False indigo | *Baptisia australis* | Golden Hour |

## Adding a plant

1. Add a prompt to `design-explore/gen3.py` and run it. Mat-forming
   groundcovers go in `MATS` so they are drawn as a low carpet rather than a
   cut stem, which is the single most common way a specimen comes back as the
   wrong plant.
2. `python3 proc.py && python3 matte.py && python3 hinge.py`. If `hinge.py`
   prints `None`, the detector found no stem to tape, which happens on mounded
   and sprawling plants. Add hand coordinates to its `OVERRIDES`.
3. Add the name to `USED` in `design-explore/export.py` and run it.
4. Add the entry to `data/plant-prints.json`, then `bun run gen`.
