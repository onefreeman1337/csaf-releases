# Timber - Tree Cutting for RPG Maker MZ: Your Own Tileset Trees Topple, Burst and Split Into Logs — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Timber - Tree Cutting for RPG Maker MZ: Your Own Tileset Trees Topple, Burst and Split Into Logs  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/timber  
**Docs published:** 2026-11-05


---

# Timber for RPG Maker MZ

**Every tree in your own tileset can be cut down.** Face a tree and press OK: it shudders, a notch opens in its own
bark, chips and leaves fly. The last chop fells it with weight. It tips slowly, then fast, lands with a bounce and a
shake, its crown bursts into its own leaves, the trunk splits into logs, and a stump with rings stays on the spot. Over
play time a sapling grows from it and the tree comes back.

Every leaf, chip, log, splinter, stump and sapling is cut from the pixels of the tree you painted. No tree sprite
sheets, no events on every tree, no art to draw.

Version 1.0.0 · Core Systems Asset Factory

---

## Install

1. Copy the four files from `js/plugins` into your project's `js/plugins` folder:
   `TimberCore.js`, `SmithereensCore.js`, `SmithereensCut.js`, `Timber.js`.
2. In the Plugin Manager, add all four and switch them ON. Their order does not matter: Timber.js finds the other
   three the first time it needs them.
3. If you already own our Smithereens plugin, its `SmithereensCore.js` and `SmithereensCut.js` are the same two files.
   Keep one copy of each.

That is all for MZ's own trees. Start a test play on a map with the stock **Outside** tileset and chop one.

---

## Which trees can be cut

**MZ's stock trees work at once.** On the Outside tileset: the tree, the large tree, both snowy conifers, both dead
trees, the palm and both mushroom clusters. On SF Outside: the tree. Forest canopy fill tiles, streetlights and the
tree in a planter box are left alone.

**Your own tilesets: one terrain tag.**

1. Database, Tilesets tab, pick the tileset, switch the editor to **Terrain Tag** mode.
2. Give every tile of every tree the same tag, 1 to 7 (one click per tile).
3. Either set the parameter **Tree terrain tag** to that number, or write it in the tileset's **Note** box:

```
<Timber Tag 6>
```

To name the kind instead of letting Timber read it from the picture, add it after a colon. Several tags can be listed:

```
<Timber Tag 6>
<Timber Tag 5: conifer>
<Timber Tag 4: crystal>
```

Kinds: `broadleaf`, `conifer`, `palm`, `dead`, `mushroom`, `crystal`. Naming the kind is always exact. Read from the
picture, Timber called 24 of our 25 test trees right; the miss was a white quartz spire it read as a dead tree, so name
pale crystals.

**A region works too.** Set **Tree region** and paint that region on a tree's cells to make only those trees
choppable.

What makes a group of tiles one tree: the tiles you painted together from the palette, the way you would paint a two
or three tile tree, on the upper layers. The bottom row needs a tile without the star (the trunk). A 1 x 1 tile works
too (a mushroom cluster, a crystal). Two trees of the same tile standing side by side stay two trees.

---

## Cutting a tree down

Face the **bottom row** of a tree and press **OK** (Enter, Space, Z, or the gamepad's A button). The player leans into
each blow. Chops to fell:

| Kind | Chops |
| --- | --- |
| broadleaf | 3 |
| conifer | 4 |
| palm | 2 |
| dead | 2 |
| mushroom | 1 |
| crystal | 3 |

Or one number for every tree: **Chops to fell**.

**Which way it falls.** Struck from the side, a tree falls away from the player. Struck from the front or the back, it
falls to whichever side has more open ground. Trees always fall sideways: on MZ's tilted top-down view a tree lying
toward or away from the camera would be drawn at under half its height.

**Needing an axe.** **Needs weapon**, **Needs item** and **Needs switch** gate the chop. Without them, OK at a tree
does nothing, or runs **When not allowed** (a common event: "You need an axe.").

---

## How each kind comes down

| Kind | The fall | When it lands | What is left |
| --- | --- | --- | --- |
| broadleaf | topples about the cut | the crown bursts into its own leaves | 3 logs and a ringed stump |
| conifer | topples, faster | the crown breaks into wide boughs that slide apart | 4 thin logs and a stump |
| palm | whips over: the crown lags, then springs past | the fronds burst | 5 short segments and a stump |
| dead | snaps at the cut, drops into it, tips | shatters into splinters | a jagged stump |
| mushroom | flops over | the cap bursts into slow spores | the stem's stub |
| crystal | does not fall: shatters where it stands | facets fly | the crystal's base |

A snowy tree drops snow at every chop. The soft drawn shadow under a tree stays on the ground and fades as it falls.
The logs lie a few seconds (**Logs stay**), then go, and the wood item's icon rises from the pile if you set one.
Leaves, chips and splinters stay on the ground for **Debris stays** seconds.

**Stumps** stand where the trunk stood and block that cell (**Stumps block**). The rest of the tree's cells open up.

**Regrowing.** After **Regrow time** seconds of play (default 300), the tree is back. A sapling shows from the stump in
the last 60% of that time and grows in three steps. Set it to 0 and felled trees stay felled. A map note overrides it:

```
<Timber Regrow: 600>
```

---

## What it gives the player

**Wood item** and **Wood per tree** for broadleaf, conifer, palm and dead trees; **Mushroom item** and **Crystal item**
(one each) for those kinds. **Count variable** goes up by one for every tree felled. **Common event on fell** runs every
time a tree comes down.

---

## Map note

```
<Timber Off>
```

No tree on that map can be cut.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| Chop Tree In Front | one chop at the tree the player faces |
| Chop Tree At | one chop at a cell (a tree's bottom row) |
| Fell Tree At | fells a tree at once |
| Regrow All | every felled tree on this map grows back now |
| Allow Chopping | turns the OK-button chop off or on (saved) |

`Chop Tree At` and `Fell Tree At` take a fall direction: `player`, `east`, `west`, `north`, `south`. North and south
fall to the open side, like a chop from the front.

## Script calls (for Conditional Branch)

```
Timber.isTree(x, y)     // true when a standing tree's bottom row is at x, y
Timber.felledCount()    // trees felled on this map that have not grown back
```

---

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Chop with the OK button | true | face a tree's bottom and press OK to chop |
| Needs item | 0 | the party must hold this item (0 = none) |
| Needs weapon | 0 | the party must hold or wear this weapon (0 = none) |
| Needs switch | 0 | chopping only while this switch is ON (0 = always) |
| When not allowed | 0 | common event when OK is pressed without what is needed |
| Tree terrain tag | 0 | tiles with this terrain tag are trees, in every tileset |
| Tree region | 0 | upper-layer tiles on cells with this region are trees |
| Stock MZ trees | true | MZ's own stock tree tiles can be cut |
| Chops to fell | 0 | one number for every tree (0 = by kind) |
| Regrow time (seconds) | 300 | seconds of play before a felled tree is back (0 = never) |
| Stumps block | true | a stump blocks its cell |
| Wood item | 0 | given for broadleaf, conifer, palm and dead trees |
| Wood per tree | 3 | how many |
| Mushroom item | 0 | given for a mushroom |
| Crystal item | 0 | given for a crystal |
| Count variable | 0 | goes up by one per tree felled |
| Common event on fell | 0 | runs when a tree comes down |
| Shake on landing | true | a small screen shake when a tree lands |
| Sound: chop | Blow3 | a sound from your audio/se folder |
| Sound: fall | Crash | |
| Sound: shatter | Break | dead trees, crystals |
| Pieces on screen | 160 | leaves, chips and splinters at once |
| Debris stays (seconds) | 12 | then they fade (0 = until the map changes) |
| Logs stay (seconds) | 5 | |

The three sounds name MZ's own stock sound effects; pick any from your own `audio/se`.

---

## Saves, speed and compatibility

**Saves.** A save keeps which trees fell and when, nothing else: one small entry per felled tree. A chop that has not
felled its tree yet is kept while you stay on the map (the menu included) and resets when you leave it.

**Speed.** Each tree's picture is read once, while the map fades in. After that, chopping, falling and regrowing read
no pixels at all. Measured in the real engine on our showroom map, a tree felled every few seconds: about 13 draw calls a
frame and fewer than one texture upload every four frames, inside the limits we hold every plugin to.

**Compatibility.** Timber extends MZ's map, player and tilemap code without replacing any of it (every original is
called). It changes no window or menu. A Change Tileset event is handled: trees are found again in the new tileset and
felled trees stay felled.

---

## What it does not do

- Overworld forest autotiles (the A1 and A2 forest tiles) and trees placed as events are not cut.
- No touch or mouse chop: on touch devices, call **Chop Tree In Front** from an event or button.
- No skill levels or tool tiers. A switch, an item or a weapon can be required, and a common event runs on every fell.

---

## Credits, licence and AI disclosure

Core Systems Asset Factory. See LICENSE.txt. `SmithereensCore.js` and `SmithereensCut.js` are this studio's own code,
shared with its Smithereens plugin.

The code in this product was produced with AI assistance. No images, sounds or authored narrative text ship with it.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
