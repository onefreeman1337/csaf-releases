# Trailblazer Reap: cut tall grass, reeds and vines from your own tileset, for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Trailblazer Reap: cut tall grass, reeds and vines from your own tileset, for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-21


---

# Trailblazer Reap for RPG Maker MZ

**A swing that cuts your own map.** The tall grass your Database already marks as Bush, and any bush, fern, reed, vine or
bramble you mark, can be cut. The blade sweeps across the cells in front of the player, the cut part flies as clippings
of its own pixels, and what is left is drawn from the cell itself: tall grass is mown down to the ground beneath it with
cut stalks in its own colours, and a tuft is cut to a stub of its own base with a pale fresh-cut end (a vine that hangs
from the top of its cell and ends well above the bottom keeps its top instead). A bramble that blocked the path can be walked through while it is cut. Cut grass stops hiding the
party's feet. A cut can drop an item, shown with that item's own icon. Then it all grows back, in stages, on a timer
that is saved with the game.

No events on every tuft, no cut-grass tiles, no clipping sheets to draw. It works on its own. It is also part 2 of
Trailblazer, a set of plugins about things a player can do to your own map; you do not need any other part.

Version 1.0.0 · Core Systems Asset Factory

---

## Install

1. Copy the four files from `js/plugins` into your project's `js/plugins` folder:
   `TrailblazerReapCore.js`, `SmithereensCore.js`, `SmithereensCut.js`, `TrailblazerReap.js`.
2. In the Plugin Manager, add all four and switch them ON. Their order does not matter: TrailblazerReap.js finds the
   other three the first time it needs them. If one is missing, nothing can be cut and the browser console (F8 in a
   playtest) asks you to switch on the other three.
3. The Plugin Manager descriptions of `SmithereensCore.js` and `SmithereensCut.js` say "Install with Smithereens.js".
   That line belongs to the shared file; with Trailblazer Reap you do not need Smithereens.js.
4. If you already own our Smithereens, Timber or Trailblazer Blast plugin, its `SmithereensCore.js` and
   `SmithereensCut.js` are these same two files, byte for byte. Keep one copy of each.

---

## What can be cut

**1. Bush tiles (on by default).** Every tile with the **Bush** setting in the Database (Tilesets tab) can be cut: that
is MZ's own "tall grass", the tiles that hide characters' feet. Turn **Cut Bush tiles** off to choose cells only by
region or tag. Water is never cut, even though MZ's own tilesets mark shallow water as Bush.

**2. A region.** Set **Cuttable region** (for example 51) and paint that region on the cells that can be cut.

**3. A terrain tag.** Set **Cuttable terrain tag**, or name it in a tileset's **Note** box, and give that tag to tiles
in the Database. When the parameter is set it applies to every tileset and the notes are not read; leave it at 0 to give
each tileset its own tag with a note:

```
<Reap Tag 5>
```

**Grass or tuft.** A marked cell with an object on it from the B to E tabs (a bush, a fern, reeds, a vine, a bramble)
is a **tuft**: the object is cut down to a stub, and while it is cut the map's passability falls through to the ground
under it, so a bramble that blocked a path can be walked through. Any other marked cell is **grass**: its ground tile
(A2 or A5) is mown. Grass painted on layer 1 over another ground (MZ's own tall grass sits over a meadow) is mown down
to that ground; grass on layer 1 alone is flattened into a stubble in its own colours. An unmarked object standing in
the grass (a flower) stays. Walls (A3, A4), water (A1) and star tiles (tree tops, roofs) are never cut.

---

## Swinging

The player swings with the **swing key** (C by default), or by pressing **OK** while facing a cell that can be cut, when
OK starts no event there (**Swing with OK**, on by default; the swing then sweeps its whole width). The party stands still for the length of the swing.

- **Swing width**: `arc` (the default) cuts the cell in front and the two beside it; `front` cuts only the cell in front.
- **Needs item**: the party must hold an item to swing.
- **Needs weapon**: the party must hold or wear a weapon (a sickle, a sword) to swing.
- **Needs switch**: swinging only while a switch is ON.

Any event can swing with the **Swing** command (it does not check the three needs above: the event decides), or cut a
single cell with **Cut At**.

**The key.** The swing key can be A, C, D, F, S or V on the keyboard, or none. If another plugin already uses that key,
Trailblazer Reap does not take it from that plugin: the key does not swing, and the browser console (F8) says once
which key and why. Pick another key, or swing with OK or the Swing command.

---

## Growing back

A cut cell grows back after **Regrow (seconds)** (90 by default) in three stages: at half the time a few clumps come
back, at four fifths most of it, and then it is whole. Set it to 0 and what is cut stays cut for good. A bramble that
blocks never grows back onto a character standing in it: it waits until the cell is clear.

The clock is the game's own play time, so it is saved with the game and it does not run while the game is closed.

**Regrow on re-entry** makes a map's grass whole again every time the party enters it (the classic "the grass is back
when you come back" rule).

---

## Drops

**Drops** is a list of items, each with a chance in percent. When a cell is cut the list is tried in order, and the
first item whose chance comes up drops: it pops out of the cut, bounces once and waits on the ground, shown with its
own icon from your IconSet. The player picks it up by walking onto it. A drop not picked up fades out over the last
second of **Drops stay (seconds)**. Up to 16 drops can lie on the ground at once; a 17th replaces the oldest. Drops stay
through the menu, a battle or a shop, and are gone when the party enters another map or a game is loaded.

**Common event on cut** runs after each swing that cut something.

---

## Map note

```
<Reap Off>          nothing is cut on this map
<Reap Regrow: 300>  this map's own regrowth time in seconds (0 = never)
```

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Swing** | A swing in front of the player, as the key does. |
| **Cut At** | Cut one cell, now (a scythe trap, a cutscene). |
| **Regrow All On Map** | Everything cut on this map is whole again. |
| **Allow Swinging** | Turn the swing key and the OK swing on or off (saved with the game). |

---

## Script calls

For a Conditional Branch (Script) or a Script event command:

```
TrailblazerReap.isCut(x, y)       true while the cell at x, y is cut
TrailblazerReap.isCuttable(x, y)  true when the cell is one Reap cuts (cut right now or not)
TrailblazerReap.cutCount()        cells cut on this map right now
TrailblazerReap.cutAt(x, y)       cut one cell
TrailblazerReap.swing()           a swing in front of the player
TrailblazerReap.regrowAll()       everything on this map grows back
```

---

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Swing key | C | A, C, D, F, S, V or none |
| Swing with OK | ON | press OK facing something that can be cut |
| Swing width | arc | arc (three cells) or front (one) |
| Needs item | 0 | an item the party must hold (0 = none) |
| Needs weapon | 0 | a weapon held or worn (0 = none) |
| Needs switch | 0 | a switch that must be ON (0 = none) |
| Cut Bush tiles | ON | the Database's Bush tiles can be cut |
| Cuttable region | 0 | a region id (0 = off) |
| Cuttable terrain tag | 0 | a terrain tag 1-7 (0 = off) |
| Regrow (seconds) | 90 | 0 = stays cut for good |
| Regrow on re-entry | OFF | a map is whole again each time it is entered |
| Drops | none | items and their chances, tried in order |
| Drops stay (seconds) | 12 | 2 to 600 |
| Common event on cut | 0 | runs after a swing that cut something |
| Sound: swing / cut / pick up | Wind7 / Slash1 / Item3 | any sound in your audio/se folder, played as chosen (volume 90, pitch 100) |
| Clippings on screen | 160 | 32 to 512 |
| Clippings stay (seconds) | 2 | 0 = they fade as they land |

---

## Saves, speed and compatibility

**Saves.** A save keeps which cells are cut and when, nothing else: one small entry per cut cell. An entry is removed
once that map has seen its cell grow back (with Regrow 0 it stays, because the cell stays cut). A save made before the plugin was installed loads with nothing cut.

**Speed.** Every picture on a map is read from the tileset in one pass while the map fades in. After that, swinging,
cutting and growing back read no pixels at all, and the frame loop allocates nothing. Measured in the real engine
(headless Chrome, mowing a route through the demo field with a swing every 18 frames): **10** draw calls a frame, inside
the 60 the studio's gate allows.

**Compatibility.** Trailblazer Reap extends eight MZ methods and replaces none of them (every original is called):
`Game_Map.prototype.setup`, `Game_Map.prototype.isBush`, `Game_Player.prototype.moveByInput`,
`Game_Player.prototype.canMove`, `Game_Player.prototype.triggerButtonAction`, `Spriteset_Map.prototype.createTilemap`,
`Spriteset_Map.prototype.createLowerLayer` and `Spriteset_Map.prototype.update`. Put it below VisuStella's Core Engine
if you use it; it has no other order requirements. A plugin that draws its own grass over Bush tiles (Aether Foliage
does) keeps drawing its blades over a cut cell: exclude that field in the other plugin (Aether Foliage names a region
for that).

---

## What it does not do

- A swing is not an attack. It does not hurt events or enemies; an event can check `TrailblazerReap.isCut` in its own
  page.
- Drops are not saved: a drop still lying on the ground is gone after a load or when the party enters another map.
- A tile painted into a parallax picture has no tiles to read and cannot be cut.
- The swing key is a keyboard key. On a gamepad, OK swings. With touch or the mouse there is no OK on the map: swing with
  the Swing command from an event or a button.
- RPG Maker MZ only (tested on 1.10.0), not MV.

---

## Credits, licence and AI disclosure

Made by Core Systems Asset Factory. See `LICENSE.txt` for the full terms: use it in any number of games, commercial or
free, with no royalty; do not resell or redistribute the plugin files.

This product was made with AI tools. The code was produced with AI assistance, and everything it draws in your game
(the stubble, the stubs, the clippings, the swing, the drop shadows and the sparkles) is drawn at run time by that
AI-written code. The store images were made with AI tools too. No image files, no sounds and no authored narrative text
ship with it.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
