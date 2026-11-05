# Threshold - Animated Doors From Your Own Tileset for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Threshold - Animated Doors From Your Own Tileset for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/threshold  
**Docs published:** 2026-11-05


---

# Threshold for RPG Maker MZ

**Every door, gate, hatch and cave mouth in your own tileset opens the way it was drawn. No door sprite sheets.**

In stock MZ, the only way to get an opening door is a hand drawn character sheet (the `!Door` style) for every door
style you use. With a custom tileset you usually do not have those sheets. Threshold reads the door tile you already
placed, once, when the map loads, and draws its opening from that tile's own pixels: a hinged door foreshortens as
it swings and shows its edge, double doors part, a portcullis rises in steps, a hatch lifts and casts a shadow, a
shoji slides into the wall, a curtain parts, a vault door rolls aside, and a cave mouth gets depth and a breath of
cold air.

Made by Core Systems Asset Factory.

---

## Install

1. Copy `ThresholdCore.js` and `Threshold.js` into your project's `js/plugins/` folder.
2. In the Plugin Manager, turn on **ThresholdCore** first, then **Threshold** below it.

That is all the setup. There are no images to install.

## Mark a door

1. Make an event and give it a **tile** as its graphic: the door tile from your own tileset (the B to E tabs of the
   image picker).
2. In the event's **Note** box, write `<threshold: door>`.

When the map loads, Threshold reads that tile and builds every frame of its opening. Closed, it shows your tile
exactly, pixel for pixel.

A solid door opens onto darkness. A see-through one (bars or a grille drawn over nothing, like the cell fronts in
MZ's own tilesets) opens onto whatever you placed behind it, so a raised cell gate leaves the floor, never a shadow
of its bars.

The doors drawn into MZ's own wall sheets (the plank door, the arched double door, the arched window in Outside_B)
sit across two tiles, half a tile down. Mark both tiles, the top one above the bottom one, with the same kind, and
they open as one door.

## The eight kinds

The word after the colon picks how the tile opens.

| Note | What it does | Also accepted |
|---|---|---|
| `<threshold: door>` | a hinged door swinging inward, foreshortening, its edge in the door's own darkest colour | |
| `<threshold: double>` | double doors parting from the middle; mark both halves | `doubledoor` |
| `<threshold: portcullis>` | a portcullis or bar gate rising in steps, its chains running | `gate`, `bars` |
| `<threshold: hatch>` | a floor hatch or trapdoor lifting on its hinge, casting its own shadow | `trapdoor` |
| `<threshold: sliding>` | a shoji or sliding door sliding into the wall | `shoji`, `slide` |
| `<threshold: curtain>` | a curtain or hide flap parting and bunching at the sides | `flap`, `hide` |
| `<threshold: vault>` | a round vault door rolling aside inside its frame | `vaultdoor` |
| `<threshold: cave>` | a cave mouth or mountain entrance: it does not open, it gets depth and breathes cold air | `entrance`, `mouth` |

Options, written after the kind:

| Option | Effect |
|---|---|
| `right` | hinge on the right (for `door`), or slide the other way (for `sliding`): `<threshold: door right>` |
| `dust` | an old door that sheds dust into the doorway while it moves: `<threshold: door dust>` |
| `nogroup` | keep this door from opening together with a door of the same kind next to it |

An unknown kind (a typo) is ignored and the tile stays an ordinary tile, so a wrong word never draws a wrong door.

## Doors bigger than one tile

Put a door event on each tile of the door, all with the **same kind**. Side by side or stacked, they are treated as
one door: double doors two tiles wide part from their middle, and a gate two tiles tall rises as one gate. Opening
either part opens the whole door. Only full rectangles are grouped; an L shape opens as separate doors.

## Opening a door: your existing door events already work

The stock MZ door event opens a door by **turning** the event: Turn Left, Turn Right, Turn Up, with a short wait
between (this is exactly what the Quick Event "Door" builds). Threshold reads those four directions as the stages of
its own opening:

| Event direction | Door |
|---|---|
| down | closed |
| left | one third open |
| right | two thirds open |
| up | open |

So a door event you already have opens your tile instead of a `!Door` sheet, with no edits. An event page whose
graphic faces up shows the door already open, which is how you keep a door open after a switch.

## Plugin commands

For doors that open on a switch, a lever, a puzzle or a cutscene.

| Command | Arguments | What it does |
|---|---|---|
| Open Door | Event ID (0 = this event), Wait for completion | opens the door and every door grouped with it |
| Close Door | Event ID, Wait for completion | closes it, the opening played backwards |
| Toggle Door | Event ID, Wait for completion | opens a closed door, closes an open one |

A command on a cave mouth, or on an event that is not marked, does nothing. A command plays the sound you set for
that kind of door in the parameters below (it plays a little lower when closing). The stock door event plays its own
sound, as it always has.

## Parameters

| Parameter | Default | What it does |
|---|---|---|
| Command open time | 18 | frames an Open or Close Door command takes (60 = one second) |
| Stage glide | 3 | frames to glide between stages when a door event turns (the stock door waits 3) |
| Light spill at night | on | warm light in open doorways when the screen is tinted dark |
| Spill colour | #ffbe78 | the colour of that light |
| Spill strength | 70 | 0 to 100, the light at full night |
| Cave breath | on | cold air drifting out of cave mouths |
| Cave breath length | 120 | frames for one breath |
| Sound: door, double, portcullis, hatch, sliding, curtain, vault | none | a sound effect from your own `audio/se` folder for each kind, played by the commands |

## Night

When the screen is tinted dark (Tint Screen, or any day and night system that tints the screen), every open doorway
fills with warm light, stronger the darker the tint. The light is drawn in its own layer, so the tint does not
recolour it. A closed door shows no light. The room behind a door is never guessed: it is darkness by day and light
by night. The light stays in the doorway; it is not thrown onto the ground outside.

## Saving

A door's open state is saved with the event, so a save made with a door half open loads with it half open. Nothing
else is written into the save: the frames are rebuilt from your tiles when the map loads.

## What it does not do

- It does not find doors on its own. A door is the event you mark; a door drawn straight into a wall autotile (A3
  or A4) needs an event with the door tile on it, as in stock MZ.
- It does not change passability. Through, priority and triggers are yours, exactly as with any door event.
- Chests are not doors.
- The light at night stays inside the doorway; it does not light the ground outside.

## Compatibility

Threshold replaces no engine method. It **extends** these (the original always runs):
`Game_Event.prototype.setupPageSettings`, `Game_Event.prototype.update`, `Sprite_Character.prototype.updateBitmap`,
`Sprite_Character.prototype.updateFrame`, `Spriteset_Map.prototype.createLowerLayer`,
`Spriteset_Map.prototype.createCharacters`, `Spriteset_Map.prototype.update`.
It **adds** `Game_Event.prototype.thresholdSpec`, `Game_Event.prototype.thresholdProgress`,
`Sprite_Character.prototype.thrUpdateSpill` and `Sprite_Character.prototype.thrHideSpill`.

Sprite_Character only changes for events you marked; every other event, character and tile is drawn by MZ as
before. A plugin that replaces how tile events are drawn may conflict; load Threshold below it.

Performance: each door is read from your tileset once, one door per frame while the map settles, and every frame of
its opening is computed then. While doors open and close during play, nothing is read from the GPU and nothing is
rebuilt.

## Licence, the short version

Use it in any number of commercial and non commercial RPG Maker projects, royalty free. Credit is appreciated but not
required. You may not resell or redistribute the plugin itself. Full terms in `LICENSE.txt`.

*Core Systems Asset Factory · Threshold v1.0.0*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
