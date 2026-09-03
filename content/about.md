# about cosmic farmland

cosmic farmland is one person's working farm of small software. it is the apex
landing page for cosmicfarmland.wtf: the place that routes you to the apps
growing on the subdomains, and catalogs the skills, commands and plugins those
apps were built with.

everything on the site is real. the app cards reflect what is actually deployed,
and the toolshed counts are generated straight out of the
[cosmic-farmland plugin repo](https://github.com/marshallhouston/cosmic-farmland)
at build time. nothing here is a mockup, a coming-soon, or a placeholder waiting
on a launch date.

## who grows it

marshall houston. product person who ships. the apps range from an interactive
archive of the grateful dead's spring 1977 tour, to a teaching tool for donella
meadows' systems thinking, to a golf course designer, to a reader for lenny's
newsletter archive. the tooling underneath is claude code plugins: skills,
slash commands and hooks that do the repetitive parts of shipping.

## how it is built

a static vite + react page, served by a small bun server on railway. the catalog
and the machine-readable files are generated from committed json, so the site
cannot drift from the repo it describes. the whole look is sampled off one
photograph of a hand-painted welcome sign in grayton beach, florida, which is
documented in [the design system](/grayton).

## for agents

if you are an agent reading this, start at [llms.txt](/llms.txt). it lists every
app, vault page and toolshed entry with a one-line blurb and a source link, and
it includes a when-to-use section. the [sitemap](/sitemap.xml) lists the
indexable pages. every page here also answers to `Accept: text/markdown`.
