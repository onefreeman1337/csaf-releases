# Hearsay: Rumour Maps of Unvisited Places for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Hearsay: Rumour Maps of Unvisited Places for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/hearsay  
**Docs published:** 2026-11-05


---

# Hearsay — the map your party believes in

**RPG Maker MZ · four plugin files · raw uncompressed JavaScript**
Core Systems Asset Factory · <https://csaf.itch.io>

Your world map shows where the party has been. Hearsay draws the part they have only been *told
about*: the places named in dialogue, in quests and in found documents but never entered, each set
down the way a cartographer sets down a report he cannot verify.

A place the party has heard of once is dotted, with an open outline and a hedged label. A place two
separate people have described closes into dashes. A place somebody knows the road to gets a
committed line, hachure, and whatever hazard they warned you about. And when the party finally
arrives somewhere, the chart redraws it at its true size and **strikes the old guess underneath as
a ghost** — because arriving does not unsay what you were told.

---

## What it reads, and what you have to author

**Nothing. There is no rumour table to fill in.** Hearsay reads the project you already have:

| It reads | And treats it as |
| --- | --- |
| every map carrying a display name | a place |
| Show Text, Show Choice and document lines that name a place | an informant |
| every direct Transfer Player command | a route somebody knows |
| the party actually arriving somewhere | a survey |

Stock `MAP001`-style names are ignored, so only maps you have actually named become places.

**Confidence is earned from distinct informants, not from a mention count.** One villager repeating
himself six times is still one rumour. That is the difference between a chart and a tally.

---

## Install

1. Copy the four files from `js/plugins/` into your project's `js/plugins/` folder.
2. Add them in the Plugin Manager.
3. Call the `openChart` plugin command wherever the party should be able to look at the map.

**Recommended order** — reads sensibly bottom-up in the list, and **nothing depends on it**:

1. `HearsayRender.js`
2. `HearsayBelief.js`
3. `HearsayChart.js`
4. `Hearsay.js`

Every file resolves its siblings the first time it needs them rather than when it loads, so Hearsay
works in whatever order the Plugin Manager gives you. That is tested rather than hoped for: the
headless suites, the capture pipeline and the in-engine verification all load the four files
**alphabetically**, which puts the entry file `Hearsay.js` *first* — ahead of the belief model, the
chart and the drawing kit it uses — and the in-engine run asserts all four resolved anyway.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| `openChart` | Opens the chart scene. |
| `markVisited` | Records an arrival by map id. Usually unnecessary — arrivals are recorded automatically. |
| `forgetPlace` | Removes an arrival by map id, so the place returns to being believed rather than known. |

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| `chartTitle` | `What We Have Been Told` | The heading drawn at the top of the page. |
| `autoRecord` | on | Record an arrival whenever the party transfers to a map. |
| `includeCurrent` | on | Treat the map the party is standing on as visited. |
| `maxPlaces` | `12` | How many places fit on one page. The grid is solved for the count, not hard-coded. |
| `menuCommand` | off | Add Hearsay to the main menu. |
| `menuLabel` | `Hearsay` | What that menu entry is called. |

---

## Compatibility

**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by running the plugin in
the real engine rather than only in tests.

**Three core methods are extended by saved-original prototype extension, and none is replaced:**
`Game_System.prototype.initialize`, `Game_Player.prototype.performTransfer`,
`Game_Map.prototype.setup`. Each saved original is actually called through. Because nothing is
clobbered, Hearsay co-exists with other plugins that patch the same seams, including large suites.

Switch `Hearsay.js` off and nothing is patched at all — the other three files do not know the engine
exists.

---

## What is drawn

Every mark is **drawn by code**. There are no PNG assets, so nothing is fixed to one resolution and
nothing clashes with your art.

- **10 coast forms**, separated by topology rather than by a wobble parameter — an isle, a bay bitten
  out of one side, a peninsula with a real waist, an archipelago of separate rings, a cape, a sound,
  a delta, an atoll with a hole, a fjord, a spit.
- **12 devices** — what the informant said is there: city, keep, ruin, shrine, mine, pass, spring,
  grave, harbour, tower, forest, marsh.
- **10 hazards**, drawn in rubric red — serpent, whirlpool, storm, rocks, wreck, ice, firemount,
  quicksand, wolves, void.
- **8 informant traditions** — who told you, drawn as a small ornament beside the label: sailor,
  pilgrim, soldier, trader, scholar, poacher, herald, child.
- **1 waymark**, for a place nobody spoke about, believed only because a road leads there. It is a
  separate mark rather than a ninth tradition, so the chart never claims a person described
  somewhere that no person mentioned.

**41 marks in total, and all 41 were measured to draw a distinct picture** rather than merely to
exist. The coast form assigned to each place also de-collides across a single chart, so two places
side by side do not come out as the same hook.

---

## Under the hood

- **No `Math.random()` in game logic.** Every mark derives from a hash of the place's own name or its
  informant's identity, so the same beliefs redraw identically forever and a screenshot is
  reproducible.
- **Saves are versioned and lossless.** The party's travel history is ordinary save data and survives
  a round trip.
- **Raw, readable, uncompressed source.** No minification, no build step, no obfuscation. Read it,
  change it, learn from it.

---

## Licence

See `LICENSE.txt`. Use it in commercial and non-commercial RPG Maker games; do not resell the plugin
files themselves as an asset.

## AI disclosure

This product's **code and graphics** were produced with AI assistance. Sounds: none ship. Text and
dialog: none ship. Stated here as well as on the store page.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
