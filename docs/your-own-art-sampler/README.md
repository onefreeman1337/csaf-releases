# Your Own Art Sampler - Free RPG Maker MZ Plugins: Doors, Breakable Pots and Sitting Poses From Your Own Art — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Your Own Art Sampler - Free RPG Maker MZ Plugins: Doors, Breakable Pots and Sitting Poses From Your Own Art  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/your-own-art-sampler  
**Docs published:** 2026-11-05


---

# Your Own Art Sampler for RPG Maker MZ (free)

Three free RPG Maker MZ plugins that draw from the art your project already has. **Threshold Lite** swings open a door
tile from your own tileset. **Smithereens Lite** bursts a pot, jar or urn of your own art into curved sherds cut from its
own pixels. **Posture Lite** sits a character down on a chair or bench, the seated pose made from the walking sheet that
character already has. No sprite sheets to draw, no images to install. Free to use in commercial and non commercial games.
Each one is a single mode of a paid plugin from the same studio, and the last section lists what the full versions add.

Made by Core Systems Asset Factory. Version 1.0.0. Tested on RPG Maker MZ 1.x core scripts.

---

## What is in the zip

| File | What it does | Needs |
| --- | --- | --- |
| `js/plugins/CSAF_ThresholdLite.js` | a door tile from your tileset swings open when its door event turns | nothing else |
| `js/plugins/CSAF_SmithereensLite.js` | a pot of your own art breaks into ceramic sherds | nothing else |
| `js/plugins/CSAF_PostureLite.js` | a character sits, the pose made from their own walking sheet | nothing else |
| `LICENSE.txt` | the licence | |

## Install

1. Copy the plugin files you want into your project's `js/plugins/` folder. Take one, two or all three: they do not
   depend on each other.
2. Open **Plugin Manager**, add each one and switch it ON. The order does not matter.

---

## Threshold Lite: a door that opens from your own tile

1. Make an event and give it a **tile** as its graphic: the door tile from your own tileset (the B to E tabs of the image
   picker).
2. In the event's **Note** box, write `<threshold: door>`.

When the map loads, the plugin reads that tile once and builds all thirteen frames of a hinged door swinging inward
from it: the leaf foreshortens as it turns, its edge shows in the door's own darkest colour, and the doorway behind it
is darkness made from the door's own colours. Closed, the door is your tile exactly, pixel for pixel.

**Opening it: your existing door events already work.** The stock MZ door event opens a door by turning the event: Turn
Left, Turn Right, Turn Up, with a short wait between (exactly what the Quick Event "Door" builds). Threshold Lite reads
those four directions as the four stages of its swing:

| Event direction | Door |
| --- | --- |
| down | closed |
| left | one third open |
| right | two thirds open |
| up | open |

An event page whose graphic faces up shows the door already open. The door's open state is saved with the game.

**Parameter:** **Stage glide**, default 3: frames to glide from one stage to the next when the door event turns (the
stock door waits 3).

**Doors two tiles tall.** MZ's own wall doors sit across two tiles. Put a door event on each tile, the top one above the
bottom one, both with `<threshold: door>`: they open as one door, whichever of the two events turns.

**What the free version leaves alone.** It opens one kind of door: hinged on the left, one tile wide, one or two tiles
tall. Any other word (`<threshold: portcullis>`, `<threshold: door right>`, a typo) leaves the event exactly as stock MZ
draws it, so a wrong word never draws a wrong door. Any other shape of marked doors (two side by side, a column of
three) is left alone too, rather than opening half a door.

---

## Smithereens Lite: a pot that breaks from your own art

1. Make an event and give it the pot's graphic: a **tile** from your tileset or a **character / object sheet**.
2. In the event's **Note** box, write `<smash: ceramic>`.
3. On the event's page, set the trigger to **Action Button** and add the plugin command **CSAF_SmithereensLite > Smash
   event** with Event ID `0` (this event).

Walk up to it, press the action button, and it breaks. The pot bursts into curved sherds that spiral out from the side
it was struck and skitter away from the player. Every sherd is cut from the exact frame your event is showing, so the
break matches your art in any style, and upscaled pixel art breaks along its own pixel grid. The sherds lie where they
land for the **Debris lifetime**, then fade.

A bare `<smash>` also breaks as ceramic in the free version. If you plan to upgrade, write `<smash: ceramic>`: the full
Smithereens reads a bare `<smash>` as "find the material for me".

| Parameter | Default | What it does |
| --- | --- | --- |
| Debris lifetime (seconds) | 20 | how long the sherds stay before fading. 0 = until the map changes |
| Persist with self switch | none | none = a broken pot comes back when the map reloads, like a classic pot. A to D = set that self switch instead, so it stays broken |

**Script call:** `CSAF.SmithereensLite.smash(eventId)` breaks an event from a script.

**What the free version leaves alone.** It breaks one material: ceramic, in one hit. Any other material word
(`<smash: wood>`, `<smash: stone>`, a typo) leaves the event as it is drawn, because a crate bursting into pottery would
look worse than no break. `hits:` and `regrow:` are ignored.

---

## Posture Lite: a character who sits, from their own sheet

Put the event on the chair or bench tile and write `<pose: sit>` in its **Note** box, or in a **Comment** command on an
event page (then it sits while that page is active; a page without one uses the Note box).

The first time a character sits, the plugin reads that character's standing frames and builds the seated frame from the
same pixels: whole pixels moved, never resampled or blended, so the pose keeps your sheet's own outline and colours.
The character's facing picks the frame (four facings). Your image files are never changed. The pose is saved with the
game.

| Parameter | Default | What it does |
| --- | --- | --- |
| Seat height | 6 | pixels a seated character is raised so the body rests on the seat, 0 to 24 (0 = on the floor) |
| Stand up on move | Stand up | a seated character who takes a step stands and walks normally |

Works with normal 8 character sheets and `$` one character sheets, at the cell size MZ reads.

**What the free version leaves alone.** It has one pose: `sit`. Any other pose word leaves the character exactly as
stock MZ draws them.

---

## Upgrading to the full plugins

Each Lite reads the same note tags as its full plugin, and stands aside by itself when the full plugin is installed. Add
the full plugin and nothing in your events changes:

- **Threshold:** your `<threshold: door>` doors open the same way, and the door's saved state carries over. You can switch
  Threshold Lite off or leave it on.
- **Smithereens:** keep Smithereens Lite switched on if your events use its **Smash event** command: with Smithereens
  installed, that command hands the hit to Smithereens.
- **Posture:** your `<pose: sit>` tags and the saved pose carry over. You can switch Posture Lite off or leave it on.

## What the full versions add

| Plugin | Price | What it adds |
| --- | --- | --- |
| [Threshold](https://csaf.itch.io/threshold) | $11.99 | seven more ways a tile opens: double doors that part, a portcullis that rises in steps, a floor hatch that lifts and casts its shadow, a shoji that slides, a curtain that parts, a vault door that rolls aside, a cave mouth that breathes cold air; doors of any size open as one; right hinges; dust from old doors; warm light in open doorways at night; Open, Close and Toggle Door commands with a sound per kind |
| [Smithereens](https://csaf.itch.io/smithereens) | $9.99 | six more materials that each come apart their own way (wood staves, stone chunks, crystal facets, ice slabs, foliage clippings, generic chunks); a table of 171 of MZ's own stock breakables so a bare `<smash>` finds the material; gathering nodes that crack with every hit and grow back over play time; materials by terrain tag and region |
| [Posture](https://csaf.itch.io/posture) | $11.99 | eight more poses from the same sheets: sit on the floor, kneel, read, lie, sleep in a bed, collapsed, wave and cheer; chair and bed regions that pose a character by themselves; plugin commands to pose the player or any event |

The same idea, more of your own art put to work:

| Plugin | Price | What it does |
| --- | --- | --- |
| [Timber](https://csaf.itch.io/timber) | $9.99 | every tree in your own tileset can be cut down: it topples, bursts into its own leaves and splits into logs |
| [Wrack](https://csaf.itch.io/wrack) | $12.99 | burned, ruined, overgrown and abandoned versions of your own towns |
| [Ajar](https://csaf.itch.io/ajar) | $11.99 | the drawers, barrels, jars, sacks and shelves in your own tileset open the way they were drawn when searched |
| [Plinth](https://csaf.itch.io/plinth) | $11.99 | your own characters and monsters as statues in stone, bronze, marble, ice or gold |
| [Stature](https://csaf.itch.io/stature) | $11.99 | taller side view battlers from your own character sheets |
| [Scathe](https://csaf.itch.io/scathe) | $12.99 | battle damage drawn into your own enemy art |
| [Fray](https://csaf.itch.io/fray) | $12.99 | battle wear on your own heroes' faces and battlers |
| [Fete](https://csaf.itch.io/fete) | $11.99 | festival dressings placed from your own town maps |
| [Hedgerow](https://csaf.itch.io/hedgerow) | $12.99 | ambient animals that flee the party, placed by your own tiles |

---

## Compatibility

None of the three replaces an engine method. Each extends these (the original always runs):

- **Threshold Lite:** `Game_Event.prototype.setupPageSettings`, `Game_Event.prototype.update`,
  `Spriteset_Map.prototype.createCharacters`, `Spriteset_Map.prototype.update`, `Sprite_Character.prototype.updateBitmap`,
  `Sprite_Character.prototype.updateFrame`.
- **Smithereens Lite:** `Spriteset_Map.prototype.createLowerLayer`, `Spriteset_Map.prototype.update`.
- **Posture Lite:** `Game_CharacterBase.prototype.increaseSteps`, `Game_Event.prototype.setupPageSettings`,
  `Sprite_Character.prototype.updateBitmap`, `Sprite_Character.prototype.characterBlockX`,
  `Sprite_Character.prototype.characterBlockY`, `Sprite_Character.prototype.patternWidth`,
  `Sprite_Character.prototype.patternHeight`, `Sprite_Character.prototype.characterPatternX`. It adds
  `Game_CharacterBase.prototype.pslPose`.

Each Lite changes only the events you mark; every other event, character and tile is drawn by MZ as before. A plugin
that replaces how events are drawn may conflict: load the Lite below it. Pixels are read once per door tile, pot frame
or character sheet while the map settles; nothing is read during play.

## Licence, the short version

Free. Use the plugins in any number of commercial and non commercial RPG Maker projects, royalty free. Credit is
appreciated but not required. Do not resell or re-upload the plugin files themselves; link people to the page instead.
Full terms in `LICENSE.txt`. The code was written with AI assistance; no images, sounds or story text ship with it.

*Core Systems Asset Factory · Your Own Art Sampler v1.0.0*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
