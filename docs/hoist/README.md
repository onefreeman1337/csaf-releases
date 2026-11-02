# Hoist — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Hoist  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-02


---

# Hoist for RPG Maker MZ

Pick up and throw, Zelda style. The hero lifts a pot, rock, bush or crate overhead, walks with it, and throws it; it flies in an arc with a shadow under it and breaks where it lands. The lift, carry and throw poses are made from each character's own walking sheet when the game loads, so there is no pose sheet to draw.

Three files: `Hoist.js` (the one you configure), `HoistCore.js` (the pose rules) and `PostureCore.js` (the shared pixel measurements; the same file ships with Posture and Embrace, and one copy serves all of them). A sample object sheet, `Demo/img/characters/!Hoist_Things.png`, has eight objects drawn for this plugin: a clay pot, a glazed urn, a crate, a barrel, a mossy rock, a bush, a sack and a training dummy.

## Install

1. Copy `Hoist.js`, `HoistCore.js` and `PostureCore.js` into your project's `js/plugins` folder.
2. Open the Plugin Manager and add all three, switched ON. Any order works; the recommended order is PostureCore, HoistCore, Hoist.
3. Optional: copy `!Hoist_Things.png` into `img/characters` to use the sample objects.

## Make something liftable

Make an event whose graphic is the object: a tile from your tileset or a frame of a character sheet. Put a tag in the event's **Note** box:

| Note tag | What it does |
| --- | --- |
| `<hoist>` | it can be lifted, and breaks where it lands |
| `<hoist: keep>` | it can be lifted, and lands whole where it lands |
| `<hoist target>` | not liftable: an event a thrown object can hit. When one lands on its tile, the event's self switch (parameter) turns ON, so its next page can react |

Give the event the priority "Same as characters" so it blocks the way until it is lifted.

## Playing it

- Face the object and press the action button (or tap it): the hero squats, takes hold and raises it overhead, then walks with it held up. No running while carrying.
- Press the action button again (or tap the object's tile, or your own tile): the hero throws it the way they face, up to **Throw range** tiles away.
- The throw stops short of a wall. It lands on the first tile holding an event that blocks (a `<hoist target>` included) and on the first water tile.
- Where it lands: on water it sinks with a splash ring; with `<hoist: keep>` it stays whole and solid again; otherwise it breaks.
- The break: with **Smithereens** installed, the landing hands the object to Smithereens, which breaks it the way its material would (give the event a `<smash>` tag as Smithereens asks). Without Smithereens, the object splits into nine pieces cut from its own picture that fly out and fade.
- A broken object comes back when the map is loaded again, like a classic pot, unless **Keep thrown objects gone** names a self switch.
- Moving to another map while carrying lets go: the object is back on its own map.

## The poses

Every walking sheet the player uses gets two sheets made for it when it loads, never during play:

- **Carry walk**, all four facings, three walk frames: the arms found from the character's own walk (the pixels that swing), erased and raised past the head in the sheet's own sleeve and outline colours, with hands in the face's own skin colour under the object, the legs still stepping. From the side, the near arm rises in front of the face and the far hand shows behind the head.
- **Lift and throw**, all four facings: a squat with the hands together low in front, the carry stand, and the throw's follow-through.

It works on 48 px sheets, big `$` sheets and tall sheets.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Throw range (tiles) | 3 | how far a throw carries (1 to 8) |
| Lift time (frames) | 22 | squat, reach and raise (60 frames = 1 second) |
| Break on landing | true | a thrown object breaks where it lands; `<hoist: keep>` overrides it per object |
| Self switch on a hit target | A | the self switch a `<hoist target>` gets when hit (none turns it off) |
| Keep thrown objects gone | none | none = a broken object returns on reload; A to D = set that self switch on it |

## Plugin commands

| Command | What it does |
| --- | --- |
| Lift object in front | the player lifts the `<hoist>` event in front, if the hands are free |
| Throw held object | the player throws what they carry, the way they face |
| Set held object down | the player sets it down whole on the free tile in front |

## Script calls

```
CSAF.Hoist.carrying()   // the held event's id, or 0
CSAF.Hoist.lift()       // same as the command; true if it lifted
CSAF.Hoist.throwHeld()
CSAF.Hoist.drop()
```

## Good to know

- Only the player lifts and throws; followers walk as usual.
- The throw is Hoist's own flight (an even pace over the ground, from overhead down to the landing tile). While it flies, the engine's `isJumping()` reads true, so other plugins see an ordinary jump.
- A save taken while carrying, or while an object is in the air, loads back to the same moment.

## Compatibility

Tested in RPG Maker MZ 1.x with Smithereens installed beside it. Hoist adds its own frames for the player's sprite only while a lift, carry or throw is on; at every other moment the engine's own sprite code runs unchanged. Pixel-movement plugins and plugins that redraw the player's sprite themselves are untested with it.

## Terms

See LICENSE.txt. Commercial and non-commercial use in RPG Maker projects. Written with AI assistance.

Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
