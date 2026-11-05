# Journeywork: NPC Workplaces, 24 Trades for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Journeywork: NPC Workplaces, 24 Trades for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/journeywork  
**Docs published:** 2026-11-05


---

# Journeywork — a drawn workplace for every working NPC

**RPG Maker MZ.** Put `<journeywork: smith>` in an event's note. That event gets a smithy drawn
around it — an anvil on its stump with the billet still glowing, a hearth with the fire lit, a rack
of tools, a quench tub, crates, and a floor of ash and cinders — and the NPC standing at it faces
the work instead of turning at random.

**Nothing in it is a picture file.** Every anvil, loom, kiln, mash tun and stretching frame is drawn
at run time from the trade, in code, at your project's tile size. There are no PNGs to import, no
tileset pages to find room on, and nothing to recolour when you change your art direction.

---

## Install

1. Copy the five files in `js/plugins/` into your project's `js/plugins/` folder.
2. Add all five in the Plugin Manager and turn them on.
3. Put `<journeywork: smith>` (or any trade id below) in an event's **Note** box.

**Any load order works.** Every file resolves its siblings the first time it needs them rather than
when it loads, so it does not matter which order you add them in. The order below simply reads
sensibly in the list:

```
JourneyworkForms.js
JourneyworkCorpus.js
JourneyworkShop.js
JourneyworkPlace.js
Journeywork.js
```

---

## Compatibility

**This is the part most plugins do not tell you, so it is measured rather than promised.**
Generated from the shipped source by scanning it against the real MZ runtime — 164 core classes,
3,600 core methods:

| | |
| --- | --- |
| **Core methods EXTENDED** (original saved and called through) | `Game_Map.setup` · `Game_Event.updateSelfMovement` · `Spriteset_Map.createCharacters` · `Spriteset_Map.update` · `Spriteset_Map.destroy` |
| **Core methods REPLACED** | **none** |
| **New methods added** | `Spriteset_Map.createJourneyworkWorkplaces` · `Spriteset_Map.destroyJourneyworkWorkplaces` |
| **New scenes / windows** | none — it adds no scene and no window |
| **Global variables** | `Journeywork`, `JourneyworkForms`, `JourneyworkCorpus`, `JourneyworkShop`, `JourneyworkPlace` |
| **Save data** | one versioned slot on `$gameSystem`, `_journeywork`, holding only the trades you set by plugin command |

Because every patch calls the original through, a routine plugin that wraps the same methods keeps
working. **Journeywork owns no pathing, no schedule and no routine**, so it does not compete with
one — it furnishes the places your NPCs already walk to.

**Tested alongside:** the stock MZ scripts, on a clean project, with the plugin files loaded in the
worst order the Plugin Manager allows (the entry file first, before the four modules it uses).

**Verified in the real MZ runtime**, not only in tests: 30 in-engine assertions covering the sprite
layer, the tilemap depth sort, facing, per-frame cost, plugin commands and a full save/load round
trip through real save files. Engine performance gate: **11 draw calls per frame against a ceiling
of 60, 0 texture uploads, 0 display-object growth**, update half 0.124 ms mean against a 2 ms budget.

⚠️ Those millisecond figures are frame **costs** measured under a headless harness, not a presented
frame rate, and they move a little from run to run on any machine. The counts — draw calls, texture
uploads, display-object growth — are deterministic and do not.

---

## The trades

Twenty-four, each with its own furniture, its own arrangement and its own worked ground:

`apothecary` · `baker` · `bowyer` · `brewer` · `butcher` · `carpenter` · `chandler` ·
`charcoaler` · `cobbler` · `cooper` · `dyer` · `fishwife` · `fletcher` · `glassblower` ·
`grocer` · `mason` · `miller` · `potter` · `ropemaker` · `salter` · `scribe` · `smith` ·
`tanner` · `weaver`

An unknown trade id draws nothing and reports nothing — a typo in a note tag will never crash your
game.

---

## Parameters

| Parameter | What it does |
| --- | --- |
| **Trades in use** | Leave empty for all of them. Otherwise a comma-separated list, so a fishing village can carry only the trades it has. |
| **Draw worked ground** | The trodden patch each workplace stands on — ash under a forge, wet boards under a fish stall, swept flags in a scriptorium, churned mud in a tannery. Strongly recommended: it is what makes props read as a place rather than as objects near each other. |
| **Workplace scale** | 1.00 is tuned for 48px tiles. 0.8 is subtle, 1.2 imposing. |
| **Stay at the work** | See below. |

### Exactly what "Stay at the work" does

Measured, not summarised. `Game_Event.updateSelfMovement` is MZ's single dispatch for **both**
random walking and random turning — it calls `moveTypeRandom`, which does either. So while an NPC is
standing on its own work tile that method is skipped, and the effect is that **the worker keeps its
tile and stops turning at random**.

What it does not touch:

- the NPC anywhere other than its own work tile — normal movement, unchanged;
- forced move routes, custom routes, and anything a routine plugin drives — those do not go through
  that branch, so a routine can still walk the worker away and bring it back;
- any event without a Journeywork note tag.

Turn it off and Journeywork draws the workplace and touches movement not at all.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Set an event's trade** | Give an event a workplace at run time — a shop that opens in act two, a forge that starts cold. Saved with the game. Leave the trade empty to suppress a workplace the note tag asked for. |
| **Clear an event's trade** | Drop the override so the event's own note tag applies again. |

---

## How it is built, and why that matters to you

- **The workplace is a place.** It is anchored to the tile you put the event on, so the NPC can walk
  away and come back and the forge stays where the forge is.
- **Drawn once.** Each workplace is painted into a single bitmap when the map loads, so the
  per-frame cost is two number assignments — no redraw, no texture upload, nothing allocated.
- **Deterministic.** No `Math.random` anywhere in the product. The same workplace is identical every
  time the map loads, so a screenshot is reproducible and two smithies in one town still differ.
- **Depth for free.** Workplaces sit in the same sorting band as characters, so an NPC walking
  behind a hearth is drawn behind it and one walking in front is drawn in front, by the engine's own
  rule.
- **Readable source.** Five plain, commented, unminified files. Adding a trade is data, not code.

---

## Adding your own trade

Open `JourneyworkCorpus.js` and add an entry. No pixel coordinates: you name the **station** the
worker stands at and the **satellites** around it by ROLE, and the layout solver turns roles into
pixels.

```js
{
  id: 'chandler', name: 'Chandler', palette: 'bakehouse', ground: 'flags',
  workFrom: 'south',
  station: { prop: 'vat', opts: { liquor: '#e0d2a4' } },
  satellites: [
    { prop: 'hangingBeam', role: 'overhead', opts: { hangs: 'candles' } },
    { prop: 'wareStand',   role: 'behind-right' },
    { prop: 'hearth',      role: 'behind-left' }
  ]
}
```

Roles: `behind` · `behind-left` · `behind-right` · `beside-left` · `beside-right` · `fore-left` ·
`fore-right` · `onStation` · `overhead`.

Ground kinds: `ash` · `boards` · `flags` · `flour` · `clay` · `swept` · `mud` · `sand`.

---

## Terms

See `LICENSE.txt`. Free for commercial and non-commercial RPG Maker MZ projects, credit
appreciated but not required.

## AI disclosure

Code: **yes**. Graphics: **yes** (the plugin's drawing routines are AI-written, and they generate
every mark you see — no third-party art is included or required). Sounds: **no** — this product
contains no audio. Text and dialog: **no** — this product contains no narrative text.

---

**Core Systems Asset Factory** — <https://csaf.itch.io>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
