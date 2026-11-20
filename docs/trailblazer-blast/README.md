# Trailblazer Blast — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Trailblazer Blast  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-20


---

# Trailblazer Blast for RPG Maker MZ

**Bombs that open your own walls.** Mark a wall or a rock and the plugin draws a crack into it, from its own pixels, so
the player can spot it. Set a bomb: the fuse burns down, the bomb flashes red-hot and bursts in a fireball with a shock
ring and a scorch on the floor. The wall comes apart in blocks, bottom course first, and leaves a breach cut from its own
stones, with rubble in its own colours at its foot. A rock shatters into its own pieces and is gone. It stays open for
good and can be walked through.

No events on every wall, no cracked-wall tiles, no explosion sheets to draw. It works on its own. It is also part 1 of
Trailblazer, a set of plugins about things a player can do to your own map; you do not need any other part.

Version 1.0.0 · Core Systems Asset Factory

---

## Install

1. Copy the four files from `js/plugins` into your project's `js/plugins` folder:
   `TrailblazerBlastCore.js`, `SmithereensCore.js`, `SmithereensCut.js`, `TrailblazerBlast.js`.
2. In the Plugin Manager, add all four and switch them ON. Their order does not matter: TrailblazerBlast.js finds the
   other three the first time it needs them. If one is missing, the bomb key does nothing and the browser console
   (F8 in a playtest) asks you to switch on the other three.
3. The Plugin Manager descriptions of `SmithereensCore.js` and `SmithereensCut.js` say "Install with Smithereens.js".
   That line belongs to the shared file; with Trailblazer Blast you do not need Smithereens.js.
4. If you already own our Smithereens or Timber plugin, its `SmithereensCore.js` and `SmithereensCut.js` are these same
   two files, byte for byte. Keep one copy of each.

---

## Marking what can be blown open

Pick any of three ways. They can be mixed on one map.

**1. A region.** Set the parameter **Bombable region** (for example 50) and paint that region on the cells that should
open. Only wall and rock cells open; the region on plain floor does nothing.

**2. A terrain tag.** Set **Bombable terrain tag**, or name it in a tileset's **Note** box, and give that tag to tiles in
the Database (Tilesets tab, Terrain Tag mode):

```
<Blast Tag 6>
```

**3. An event note.** An event standing on the cell, with this in its **Note** box (or in a Comment on its first page):

```
<blast>
<blast: wall>
<blast: rock>
```

With `<blast>` the plugin decides from the tiles on that cell whether it is a wall or a rock; `wall` and `rock` say it
yourself.

**What opens, and how.**

- A **wall** is a wall face or a wall top drawn with the wall tiles of the A3 and A4 sheets (Database, Tilesets). Its
  tiles stay; the plugin draws the opening over them. Mark the face cells at the foot of the wall and the opening is a
  **dark hollow into the wall**, a secret passage or a cave mouth. Mark the wall-top cells behind them too and the opening
  is a **gap right through the wall**, showing the floor beyond it in shadow.
- A **rock** is an object painted from the B to E sheets on layer 2 or 3: a boulder, a rubble pile, a crate of stone.
  It is blown apart and its tiles leave the map.
- Marked cells that touch join into one opening, so a two-wide wall opens as one wide breach that you can walk into
  through either cell.

**The crack.** Every marked wall shows a crack drawn from its own pixels, so the player knows where to set a bomb. Turn
**Show cracks** off for secret walls nobody is told about.

---

## Bombs

Press the **bomb key** (B by default) to set a bomb on the cell in front of the player, or at the player's feet when
that cell is a wall. The fuse burns for **Fuse** frames (100, about a second and a half), the bomb flashes faster and
faster near the end, and it bursts. Everything marked within **Reach** (1 cell, diagonals included) opens.

- **Bomb item**: one is used per bomb; with none left, no bomb.
- **Needs switch**: bombs only while a switch is ON.
- **Bombs at once**: how many can burn at the same time.
- The **Place Bomb** command with x and y left blank sets one in front of the player exactly as the key does, item and
  switch included, so an item's common event, a skill's common event or a button event can set bombs too. **Place Bomb
  at a cell** (x and y filled in) does not check the Bomb item or the switch: the event decides.

**The key.** Bomb key can be A, B, C, D, F or V on the keyboard, or none. If another plugin already uses that key (a
WASD movement plugin takes A and D, for example), the key sets no bomb and the console says which key clashed: pick
another one. A gamepad button is not mapped; for a gamepad, touch or the mouse, set bombs with Place Bomb from an event
or a button.

**Its size.** The bomb, the fireball, the shock ring, the scorch and the flying pieces are drawn by the plugin. It reads
your art's pixel size from the marked wall itself: 16 px art drawn at 3x gets them in 3 px blocks, art drawn at a full
48 px gets them in single pixels. There is nothing to set.

---

## When it opens

- The cells become walkable, and stay so after a save, a load or leaving the map.
- Every event standing on the opened cells turns its **self switch A** ON (the parameter **Self switch on open**). A
  Transfer Player event behind a secret wall can wait on page 2, conditioned on self switch A, for the wall to open.
- Events within reach with `<blast: target>` in their note turn the same self switch ON: a lever, a sleeping guard, a
  barrel of powder.
- **Hurts the party** takes a share of every member's max HP when the player stands in reach (never below 1 HP). It is
  0 by default.
- **Common event on blast** runs at every burst.

---

## Map note

```
<Blast Off>
```

Nothing on that map opens, and no bomb can be set there.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| Place Bomb | sets a bomb: in front of the player when x and y are blank, as the bomb key does, or at a cell |
| Detonate At | a blast at a cell, now (a cannon, a trap, a cutscene) |
| Open At | opens the site at a cell, with its rubble, without a blast |
| Close All On Map | every opening on this map closes again, and rocks come back |
| Allow Bombs | turns the bomb key on or off (saved) |

The x and y of a command are plain numbers. For a position held in variables, use the script calls below in a
**Script** event command.

## Script calls

```
TrailblazerBlast.isOpen(x, y)    // true when the site at x, y is open (for Conditional Branch)
TrailblazerBlast.isSite(x, y)    // true when x, y is marked to open
TrailblazerBlast.openCount()     // sites open on this map
TrailblazerBlast.placeBomb(x, y) // set a bomb at a cell
TrailblazerBlast.detonate(x, y)  // a blast at a cell, now
TrailblazerBlast.open(x, y)      // open the site at a cell
```

For example, a cannon aimed by two variables: `TrailblazerBlast.detonate($gameVariables.value(1), $gameVariables.value(2))`

---

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Bomb key | B | the keyboard key that sets a bomb (none = only the command does) |
| Bomb item | 0 | one is used per bomb (0 = bombs are free) |
| Needs switch | 0 | bombs only while this switch is ON (0 = always) |
| Bombs at once | 1 | how many can burn at the same time |
| Fuse (frames) | 100 | frames from setting a bomb to the burst |
| Reach (cells) | 1 | marked cells this many cells from the bomb open, diagonals included |
| Bombable region | 0 | wall and rock cells with this region can be blown open (0 = off) |
| Bombable terrain tag | 0 | tiles with this terrain tag can be blown open, in every tileset (0 = off) |
| Show cracks | true | draw a crack into every marked wall |
| Self switch on open | A | turned ON for events on an opened site and `<blast: target>` events in reach |
| Hurts the party (%) | 0 | max HP lost by each member when caught in reach |
| Common event on blast | 0 | runs at every burst |
| Shake on blast | true | a screen shake at the burst |
| Sound: fuse lit | Fire1 | a sound from your audio/se folder |
| Sound: blast | Explosion1 | |
| Sound: wall gives way | Crash | |
| Pieces on screen | 200 | flying stones at once |
| Debris stays (seconds) | 12 | flying stones settle and stay this long, then fade (at most 3600) |

The three sounds name MZ's own stock sound effects; pick any from your own `audio/se`. The rubble heap at an opening
stays for good; only the flying stones fade.

---

## Saves, speed and compatibility

**Saves.** A save keeps which sites opened, nothing else: one small entry per opening. A save made with the plugin still
loads after the plugin is removed.

**Speed.** Each site's picture is read once, while the map fades in. After that, bombs, blasts and openings read no
pixels at all. A breaking wall is thrown a few blocks a frame, bottom course first, so the burst never lands in one
heavy frame. Measured in the real engine on our showroom map with a bomb going off every two seconds: about 17 draw
calls a frame and about one texture upload every thirty frames. The limits we hold every plugin to are 60 draw calls
and one texture upload every two frames.

**Compatibility.** Trailblazer Blast extends six MZ methods and replaces none of them (every original is called):
`Game_Map.setup`, `Game_Map.isPassable`, `Game_Player.moveByInput`, `Spriteset_Map.createTilemap`,
`Spriteset_Map.createLowerLayer` and `Spriteset_Map.update`. Walls are read through MZ's own tile drawing, so every
autotile shape of an A3 or A4 wall is read the way your map shows it. It changes no window or menu. A Change Tileset
event is handled. If another plugin replaces one of those six methods without calling the original, load it above
Trailblazer Blast.

---

## What it does not do

- Bombs do not hurt enemies or carry over into battle. A `<blast: target>` event's page decides what a hit does.
- Ground autotiles (A1, A2), A5 tiles and anything painted into a wall tile itself cannot be cleared.
- A marked cell built from B to E tiles is a rock: it is cleared from the map, not breached. Build walls you want to
  breach from A3 or A4 wall tiles.
- Walls painted into a parallax picture have no tiles to read, so they cannot be marked.
- No gamepad button, touch or mouse bomb: call **Place Bomb** from an event or a button.
- RPG Maker MZ only (tested on 1.10.0); it does not run in MV.

---

## Credits, licence and AI disclosure

Core Systems Asset Factory. See LICENSE.txt. `SmithereensCore.js` and `SmithereensCut.js` are this studio's own code,
shared with its Smithereens and Timber plugins.

Made with AI tools. The code in this product was produced with AI assistance, and everything it draws in your game (the
cracks, breaches, rubble, bombs, fireballs, shock rings, scorches and flying pieces) is drawn at run time by that
AI-written code. The store images were made with AI tools too. No image files, sounds or authored narrative text ship
with it.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
