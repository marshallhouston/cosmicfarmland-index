# cosmic farmland

> The apps, skills, commands, and plugins Marshall builds and tends at cosmicfarmland.wtf.

## when to use this site

reach for cosmicfarmland.wtf when you need to:

- find which of marshall's apps is live for a topic (grateful dead 1977 tapes, systems thinking, golf course design, lenny's newsletter archive, strategy work) and get its url
- look up a claude code skill, slash command or plugin in the cosmic-farmland toolshed, including what triggers it and where its source file lives on github
- get the github repo behind any app or tool listed here
- check the grayton beach design system (palette, type, textures) that every page on this domain is built from

do not use it for general claude code documentation, for anything sold or supported commercially, or as a source on anyone but marshall.

how to call it: fetch this file (llms.txt) for the whole catalog in one request; it is regenerated on every deploy. every page also answers to `Accept: text/markdown` and serves the same content as markdown, and `sitemap.xml` lists the indexable urls. unknown paths return a real 404, so a 200 means the page exists.

## apps

- [marshallhouston.wtf](https://marshallhouston.wtf): Writing about the cosmic farmland.
- [Lenny Explorer](https://lenny-explorer.cosmicfarmland.wtf): A personal archive reader for Lenny's Newsletter posts and podcast transcripts.
- [Anthology '77](https://grateful-dead-77.cosmicfarmland.wtf): An interactive archive of the Grateful Dead's legendary Spring 1977 tour. Map every show, read every setlist, hear the tapes.
- [Systems Playground](https://systems-thinking.cosmicfarmland.wtf): Interactive teaching tool for Donella H. Meadows' systems thinking - stocks, flows, feedback loops, delays, and the 12 leverage points.
- [Strategy Wizard](https://strategy-wizard.cosmicfarmland.wtf): Build a real strategy - an action agenda, not a wish list. Guided, with an inline critic, based on Rumelt's Good Strategy / Bad Strategy.
- [Bobby Bowser Arcade](https://bobby-bowser.cosmicfarmland.wtf): A 10-cabinet arcade of coding-craft minigames. Defeat bad practices, collect good ones.
- [Octopus Antipatterns](https://octopus-org-lair.cosmicfarmland.wtf): A personal study site for the 36 antipatterns in The Octopus Organization. Browse by category, drill with recall quizzes, and run a spot-it diagnostic on your own org.
- [Golf Course Designer](https://golf-course-designer.cosmicfarmland.wtf): Shape nine holes of dirt, then watch a simulated field of real handicaps expose what you built. Every number on screen is a replayed round, not a rating.
- [Golf Record](https://cosmicfarmland.wtf/golf): Every round from my GHIN history - scoring trends, hole-by-hole splits, and where the strokes actually go.

## vault pages

- [the war on double bogeys](https://cosmicfarmland.wtf/golf): every round on my GHIN record, filterable: handicap arc, scoring buckets, and where the shots actually go.
- [sunday, hole by hole](https://cosmicfarmland.wtf/golf/city-am-2026): Final round of 2026 Denver City Amateur Men's Flighted Tournament. Round 1 leader by 2 strokes. Winner by 1 stroke.

## the farm

- [about](https://cosmicfarmland.wtf/about): who grows this, what is on it, and how it is built.
- [contact](https://cosmicfarmland.wtf/contact): github is the front door; issues and pull requests welcome.
- [privacy](https://cosmicfarmland.wtf/privacy): no analytics, no tracking, one theme preference in localStorage.

## toolshed (7 commands, 4 plugins, 20 skills)

- [Execute Plan](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/commands/execute-plan.md) (command, cosmic-farmland): Execute a superpowers implementation plan via subagent-driven-development (one subagent per task, stop before push). Defaults to the most recently modified plan in docs/superpowers/plans/.
- [Granola Sync](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-content/commands/granola-sync.md) (command, cosmic-farmland-content): Sync recent Granola meeting notes into ~/marshall.notes/meetings/ as markdown
- [Lovable Setup](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-utils/commands/lovable-setup.md) (command, cosmic-farmland-utils): Take a freshly-exported Lovable app all the way to marshall's dev setup - de-brand, deps, lint, real tests, design.html, favicon + social link preview, deploy scaffolding.
- [Ptv](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/commands/ptv.md) (command, cosmic-farmland): PTV (Prove The Value) audit. Alias for /fart-sniffing-detection. Levels whiff|sniff|huff|dutch-oven-yourselff.
- [Ship](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/commands/ship.md) (command, cosmic-farmland): Wait for a PR to go green, merge it, clean up the worktree + local branch
- [Ship All](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/commands/ship-all.md) (command, cosmic-farmland): List your open PRs and ship them in sequence. Replaces /ship -> /ship loops.
- [Wrap](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/commands/wrap.md) (command, cosmic-farmland): End-of-session cap. Ships current PR (or skips if none), then writes resumption prompt.
- [Cosmic Farmland](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland) (plugin, cosmic-farmland): Marshall's core dev loop: ship, PTV audits, what's-next, handoff, deps sweeps, plus the Stop/PreToolUse hooks that enforce house style.
- [Cosmic Farmland Content](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-content) (plugin, cosmic-farmland-content): Content and review workflows: feedback pages, interactive review docs, LinkedIn/IG carousels, Granola meeting sync.
- [Cosmic Farmland Utils](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-utils) (plugin, cosmic-farmland-utils): Personal utilities: golf tee times, activity and skill stats, disk cleanup, screenshots, cosmicfarmland.wtf deploys, Lovable scaffold setup.
- [Obsidian Weaver](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/obsidian-weaver) (plugin, obsidian-weaver): Claude Code as the interface to your Obsidian vault. Daily notes, captures, and an auto-maintained knowledge graph that weaves connections between your notes as you write them. Vault-agnostic - set OBSIDIAN_VAULT and run /obsidian-setup.
- [Activity Stats](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-utils/skills/activity-stats/SKILL.md) (skill, cosmic-farmland-utils): Wall-clock hours worked on this repo, from git commits + Claude session events. Triggers: /activity-stats, 'how many hours did I work', 'weekly hours', 'time spent on this repo'.
- [Capture](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/obsidian-weaver/skills/capture/SKILL.md) (skill, obsidian-weaver): Capture brain dumps, article links, and thoughts into the structured knowledge store. Use when the user says 'capture', '/capture', 'brain dump', 'save this thought', 'save this link', 'capture this', 'log this thought', 'jot this down', 'note this down', 'stash this', 'remember this', 'file this', 'dump this', or otherwise wants to save an idea, article, quote, or reflection for later use. With 'pull' arg, batch-imports from a Slack self-DM channel (requires Slack MCP).
- [Cf Deploy](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-utils/skills/cf-deploy/SKILL.md) (skill, cosmic-farmland-utils): Provision <name>.cosmicfarmland.wtf end to end: repo, Railway service + domain, Cloudflare CNAME, live verify. Triggers: /cf-deploy <name>, 'deploy it to X.cosmicfarmland.wtf'.
- [Connect Sync](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/obsidian-weaver/skills/connect-sync/SKILL.md) (skill, obsidian-weaver): Sync recent Obsidian notes into the _connections/ knowledge graph. Scans modified files for themes, people, concerns, and decisions, then updates connection pages with new source links. Use when the user says 'sync connections', 'connect-sync', 'update connections', 'sync my notes', 'weave my notes', 'weave the graph', 'crosslink my notes', 'link my notes', 'rebuild the graph', 'refresh connections', or after meetings to keep the knowledge graph current. Also invoked automatically by scheduled triggers.
- [Deps Sweep](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/skills/deps-sweep/SKILL.md) (skill, cosmic-farmland): Bump deps in a bun repo: bucket `bun outdated`, run `bun audit`, one PR per bucket. Triggers: /deps-sweep, 'bump deps', 'deps audit', 'what needs bumping'.
- [Disk Memory Cleanup](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-utils/skills/disk-memory-cleanup/SKILL.md) (skill, cosmic-farmland-utils): Free disk space: run the cleanup script, then hunt new space hogs. Triggers: /disk-memory-cleanup, 'clean up disk space', 'free up space', 'storage'.
- [Fart Sniffing Detection](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/skills/fart-sniffing-detection/SKILL.md) (skill, cosmic-farmland): PTVM audit of recent commits/PRs. Flags bloat, ranks kill candidates. Triggers: /ptv, /fart-sniffing-detection, 'is this bloat', 'prove the value'.
- [Feedback](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-content/skills/feedback/SKILL.md) (skill, cosmic-farmland-content): Section-by-section feedback page for a content file, then apply it. Triggers: /feedback <file>, 'give me a feedback page', 'review this file'.
- [Feedback Triage](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/skills/feedback-triage/SKILL.md) (skill, cosmic-farmland): Triage a feedback blob into structured items, spawn worktrees for accepted ones. Triggers: /feedback-triage, 'triage feedback', 'rip on this'. Single bug or file review: use /feedback.
- [Golf Tee Times](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-utils/skills/golf-tee-times/SKILL.md) (skill, cosmic-farmland-utils): Tee times across 11 Denver courses, filtered by date/players/time/holes. Triggers: 'tee times', 'play golf', 'when can I play', 'find a round'.
- [Handoff](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/skills/handoff/SKILL.md) (skill, cosmic-farmland): Self-contained resumption prompt for a fresh session after /clear. Triggers: /handoff, 'pickup prompt', 'resumption prompt', 'wrap up', 'pause here'.
- [Interactive Review Doc](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-content/skills/interactive-review-doc/SKILL.md) (skill, cosmic-farmland-content): Interactive HTML review doc with a per-section feedback panel, copyable as markdown. Triggers: /interactive-review-doc, 'review doc', 'feedback doc'.
- [Next](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/skills/next/SKILL.md) (skill, cosmic-farmland): What to work on next here: git state, PRs, worktrees, backlog docs, issues. Triggers: /next, 'what's next', 'what should I work on', 'what now'.
- [Obsidian Setup](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/obsidian-weaver/skills/obsidian-setup/SKILL.md) (skill, obsidian-weaver): One-time bootstrap for the obsidian-weaver plugin. Use when the user says '/obsidian-setup', 'set up obsidian', 'initialize vault', 'get started with obsidian-weaver', or when /today, /capture, or /connect-sync fails because OBSIDIAN_VAULT isn't set or the vault isn't seeded.
- [Ptv Idea](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/skills/ptv-idea/SKILL.md) (skill, cosmic-farmland): PTVM audit of an idea/proposal/plan BEFORE diff. Triggers: /ptv-idea, 'is this worth building', 'audit this proposal', 'sanity-check this plan'.
- [Screenshot](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-utils/skills/screenshot/SKILL.md) (skill, cosmic-farmland-utils): Read the newest screenshot(s) from the screenshot folder and act on the intent given. Trigger: /screenshot [N] [intent].
- [Skill Stats](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-utils/skills/skill-stats/SKILL.md) (skill, cosmic-farmland-utils): Skill-usage report from session transcripts, every project, all history. Triggers: /skill-stats, 'which skills do I use', 'dead skills', 'prune my skills'.
- [Slideshow](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland-content/skills/slideshow/SKILL.md) (skill, cosmic-farmland-content): LinkedIn/IG carousel from topic/outline. HTML slides + PNGs + PDF + caption. Triggers: /slideshow, 'carousel', 'make slides', 'deck for LinkedIn'.
- [Systematize](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/skills/systematize/SKILL.md) (skill, cosmic-farmland): Promote a lesson to enforcement (hook>CI>script>doc>memory), ships the artifact. Triggers: /systematize, 'make this stick', 'turn into a rule'.
- [Today](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/obsidian-weaver/skills/today/SKILL.md) (skill, obsidian-weaver): Daily note creator and status surface - calendar sync, carryover items from previous days, and meeting file setup. Use when the user says 'today', '/today', 'daily note', 'start my day', 'morning planning', 'plan my day', 'what's on my plate today', 'what do I have going on today', 'what's on the docket', 'open today's note', or otherwise wants to see or set up their day.

