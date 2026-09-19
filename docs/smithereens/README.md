# Smithereens — every pot, crate, rock and bush breaks the way its material would — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Smithereens — every pot, crate, rock and bush breaks the way its material would  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-09-19


---

# Smithereens for RPG Maker MZ

**Everything breaks the way its material would.** Pots burst into curved sherds, barrels split into staves along the
grain, rocks crack into heavy chunks, crystals shatter into bright facets, ice breaks into a few wide slabs that slide,
and bushes are cut down to a stub while their clippings flutter away. Every fragment is cut from the exact frame your
event is showing, so the break always matches your art, in any style.

Gathering nodes take visible damage before they break: `<smash: stone hits:3 regrow:120>` makes an ore node crack a
little more with every strike, knock a chip off, shake, break on the third hit, and grow back two minutes of play time
later, even if the player leaves the map and comes back.

Made by Core Systems Asset Factory. Version 1.0.0.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder:
   `Smithereens.js`, `SmithereensCore.js`, `SmithereensCut.js`.
2. Open **Plugin Manager** and add all three. **The order does not matter**; each file finds the others when a
   map first loads.
3. That is all. Nothing breaks until you mark an event breakable.

Requires RPG Maker MZ (tested on the 1.x core scripts). No other plugin is required.

## Quick start

1. Make an event and give it a graphic: a pot, crate, barrel, rock, crystal or bush. It can be a **tile** graphic
   (chosen from the tileset in the image picker) or a **character / object sheet**.
2. In the event's **Note** box, write `<smash>`.
3. In the event's page, add the plugin command **Smithereens > Smash event** with Event ID `0` (this event), and set
   the page trigger to **Action Button**.

Walk up to it, press the action button, and it breaks. By default it comes back when the map is reloaded, like a
classic pot.

## Note tags

| Note tag | What it does |
| --- | --- |
| `<smash>` | Breakable. The material is found for you (see below). |
| `<smash: ceramic>` | Breakable as ceramic. Also `wood`, `stone`, `crystal`, `ice`, `foliage`, `generic`. |
| `<smash: stone hits:3>` | A gathering node: it cracks on each hit and breaks on the third. `hits` can be 1 to 12. |
| `<smash: stone hits:3 regrow:120>` | The same node, and it grows back 120 seconds of play time after it breaks. |

`hits:0`, a blank value or a negative number count as one hit. An unknown material word is ignored and the material is
found as if you had written `<smash>`.

## The seven materials

| Material | For | Breaks into | Moves |
| --- | --- | --- | --- |
| `ceramic` | pots, jars, vases, urns | curved sherds that spiral out from where it was struck | burst, skitter and bounce |
| `wood` | crates, barrels, stumps, logs | staves split along the grain, each with a slanted tip | tumble in quarter turns and slide |
| `stone` | rocks, boulders, ore | angular chunks, more of them on bigger rocks | heavy: a short hop, no bounce |
| `crystal` | crystals, gems, glass | bright facets fanning out from the blow | fast and far |
| `ice` | ice blocks and shards | a few wide slabs split by one straight crack | slide a long way on landing |
| `foliage` | bushes, grass, flowers | a rooted stub stays; the top becomes small clippings | flutter down, swaying |
| `generic` | anything else | plain pixel chunks | burst and settle |

## How the material is chosen

First match wins:

1. The note tag, if it names a material.
2. **Materials by terrain tag** and **Materials by region** (plugin parameters), read at the event's tile.
3. The built-in table of RPG Maker MZ's own stock breakables: **171 stock tiles** across
   10 stock tile sheets and **10 stock object-sheet cells** (pots, jars, crates,
   barrels, rocks, crystals, ice, bushes and grass). The table holds sheet names and index numbers only, never any art.
4. `generic`: plain pixel chunks. Smithereens never guesses a material from colours, because a crate bursting into
   pottery sherds looks worse than a neutral break.

For your own art, write the material in the note tag. For stock art, `<smash>` is enough.

## Gathering nodes

`<smash: MATERIAL hits:N>` gives an object N hits. Each hit before the last:

- draws a crack network that starts on the side the first blow landed and spreads further with every hit (older cracks
  open wider; the lit edge of each crack catches the light),
- knocks a chip off the struck side and leaves a darker scar where it came from,
- shakes the object for a moment (turn off with **Shake struck nodes**).

The last hit breaks it. The cracks are drawn from the object's own colours, cut along the art's own pixel grid.

Add `regrow:SECONDS` and the node grows back after that many seconds of **play time**. The timer is saved with the game
and survives leaving the map, saving and loading. A node that has not regrown yet stays broken when the player returns.

## Pixel art

If your art is pixel art drawn at 2x, 3x or 4x (a 16 px tile shown at 48 px, for example), Smithereens detects it and
breaks along the art's own pixel grid, so no fragment ever cuts an art pixel in half. Cracks on gathering nodes follow
the same grid.

## Plugin commands

| Command | Arguments | What it does |
| --- | --- | --- |
| **Smash event** | Event ID (0 = this event), Break at once | Hits the event once. A node with `hits:N` cracks until its last hit; **Break at once** ignores `hits` and breaks it now. |
| **Smash in front of player** | none | Hits the breakable event on the tile the player is facing. |
| **Clear debris** | none | Removes every fragment on the map now. |

## Plugin parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Max fragments on screen | 192 | Pieces flying or lying at once (32 to 1024). When full, the oldest settled debris is reused first; a piece in flight never is. |
| Debris lifetime (seconds) | 20 | How long settled pieces lie before fading. 0 = until the map changes. |
| Materials by terrain tag | (blank) | For example `1=stone, 2=wood`. |
| Materials by region | (blank) | For example `10=ceramic, 11=crystal`. |
| Persist with self switch | none | `none`: a broken object returns when the map reloads. `A` to `D`: set that self switch instead, so you can keep it broken with a second event page conditioned on the switch. Nodes with `regrow` use their own timer instead. |
| Shake struck nodes | true | A node shakes for a moment when struck. |

## Action battle systems and other plugins

Smithereens draws what happens when something breaks; it does not detect hits. Your action battle system or gathering
plugin detects the hit, and you pass it on:

- **From a common event** that your action battle system runs on a hit: add **Smash event** with the Event ID of the
  object that was hit (most systems store it in a variable; use **Control Variables** and a script call if needed).
- **From a script call** or another plugin:

  ```
  CSAF.Smithereens.smash(eventId, { dirX: 1, dirY: 0 });   // returns 'struck', 'broke' or ''
  CSAF.Smithereens.smash(eventId, { force: true });         // break a node at once
  CSAF.Smithereens.hitsLeft(eventId);                       // hits left before it breaks
  ```

  `dirX` / `dirY` is the direction of the blow (pieces fly away from it). Leave them out and the blow comes from the
  player.

## Compatibility

**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by running the plugin in the real engine rather than only in tests.

**Plugin Manager order:**

1. `SmithereensCore.js` — [CSAF] Smithereens core: materials and seeded fracture maps. Install with Smithereens.js.

2. `SmithereensCut.js` — [CSAF] Smithereens cut: fragments cut from your own graphics. Install with Smithereens.js.

3. `Smithereens.js` — [CSAF] Smithereens: pots, crates, rocks, crystals, ice and bushes break the way their material would, cut from your own art.

This order reads sensibly in the list and **nothing depends on it**. Every file resolves its siblings the first time a map loads, so Smithereens works in whatever order the Plugin Manager gives you, including the alphabetical order you get by dragging the folder in, which puts the entry file `Smithereens.js` *first*. That is tested: the engine probes, the frame-cost gate and a fresh install of the shipped zip into a blank MZ project all load the three files alphabetically. `Smithereens.js` is the only file that touches RPG Maker; the other two are the fracture and physics, and the pixel cutter, and neither knows the engine exists.

**Core methods extended — 4 by saved-original prototype extension, *none replaced*:** `Spriteset_Map.prototype.createLowerLayer`, `Spriteset_Map.prototype.update`, `Sprite_Character.prototype.updatePosition`, `Game_Map.prototype.setup`.

Because nothing is clobbered, Smithereens — every pot, crate, rock and bush breaks the way its material would co-exists with other plugins that patch the same seams, including large suites.

- **MOG_CharShatterEffect** and other shatter plugins: no shared code. Smithereens only acts on events with a
  `<smash>` tag, so both can run in one project.
- Events that change graphic or page while cracked lose their cracks (the cracks belong to one graphic).
- Breaking a pot that is painted directly on the map's tile layer (not an event) is **not** included; make it an event.
- Bush-depth tiles work; the fragments are cut from the whole graphic.

## Performance

Fragments come from a fixed pool made once per map, and every break is baked into one shared texture, so the scene does
not grow and the per-frame update allocates nothing. Measured in RPG Maker MZ with the engine stepped frame by frame
(these are frame **costs**, not a frame rate): mowing a field of 40 bushes at one break every three frames cost
0.4 ms of update time per frame on average, with 10 draw calls per frame and no growth in the scene's object count.

## Save files

Smithereens saves one small object in the save file (the regrowth timers, versioned) plus a hit count on struck
events. Saves made before installing it load normally. Removing the plugin leaves that data unused and harmless.

## Licence and credits

See `LICENSE.txt`. You may use Smithereens in commercial and non-commercial games. Credit is appreciated but not
required.

The code and the graphics of this product were produced with AI assistance. No sounds and no authored narrative text
ship with it.

The props and tiles in the store images are from the Verdant tilesets by Core Systems Asset Factory and are not part
of this download.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
