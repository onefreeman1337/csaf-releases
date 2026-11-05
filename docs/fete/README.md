# Fete - Festival Dressings for Your Own Towns, RPG Maker MZ: Bunting, Lanterns, Stalls, Placed From Your Map — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Fete - Festival Dressings for Your Own Towns, RPG Maker MZ: Bunting, Lanterns, Stalls, Placed From Your Map  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/fete  
**Docs published:** 2026-11-05


---

# Fete — Your Own Towns, Dressed for Their Festivals

**For RPG Maker MZ.** Version 1.0.0 · Core Systems Asset Factory

Every story has a festival day: the harvest fair, the lantern night, the spring blossom, midwinter,
all hallows. Until now that meant copying the town map, decorating the copy by hand, and keeping both
maps in step forever after.

Fete dresses the map you already built. It reads where your houses are (their roofs, eaves and front
walls), the gaps between them, your lanes and your square, and puts the festival there: bunting strung
eave to eave and zigzagged across the lanes, lamp posts along the house fronts and the roads with
lights strung between them, banners and wreaths on free wall, market stalls round the square and a
centrepiece in the middle of it, and leaves, petals, sky lanterns, motes or wisps drifting over it all.

Switch it on with a notetag, a switch or a plugin command, and it arrives on screen: strings run out
from post to post and the posts, stalls and centrepiece rise into place. Switch it off and your town is
exactly as you made it. Your map file is never written to.

Every decoration is drawn by the plugin's own code. There are no image files to import.

---

## The five dressings

| Dressing | Name | Strings | Lamps | Wall | Centrepiece | Stalls sell | Air |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `harvest` | Harvest Fair | autumn pennants, bulb festoons | paper lanterns | pointed banners with a wheat sheaf | maypole with ribbons | pumpkins, apples, loaves | falling leaves |
| `lantern` | Lantern Night | strings of paper lanterns | tall red lanterns | hanging scrolls with a moon | lantern gate | lanterns, sweets, fans | rising sky lanterns |
| `blossom` | Spring Blossom | flower garlands, pastel pennants | flower baskets | flower wreaths | flower arch | flowers, pots, honey | drifting petals |
| `midwinter` | Midwinter | evergreen garlands, bulb festoons | pierced star lanterns | evergreen wreaths with a bow | decorated tree with a star | gifts, candles, bread | floating motes |
| `hallows` | All Hallows | tattered pennants, strings of little jack-o'-lanterns | jack-o'-lanterns | tattered banners with a bat | bonfire with three jack-o'-lanterns | pumpkins, candy, apples | wisps |

Midwinter is deliberately dressed without snow.

---

## Install

1. Copy all **three** files from `js/plugins/` into your project's `js/plugins/` folder:
   - `FeteCore.js` (reads your map and plans where everything goes)
   - `FeteDraw.js` (draws the five dressings)
   - `Fete.js` (puts it into your game: notetags, commands, saving)
2. Add them in the Plugin Manager and turn all three ON. **The order does not matter**: `Fete.js` looks
   for the other two the first time it needs them, not when it loads.
3. Dress a map with a notetag, a switch binding or a plugin command (below).

---

## How Fete reads your map

Fete only looks at **which tile sits where**, using the same tile arithmetic as the engine itself. It
never reads your tileset images.

- **Houses**: connected roof and wall tiles (A3 and A4). The bottom row of roof over wall is the eave;
  the bottom row of wall is the front.
- **Doors**: any event standing on a front wall cell, or just below it. Nothing is ever placed on a door
  or on any event's cell.
- **Lanes**: thin runs (one to three tiles wide) of a ground tile that is not your map's most common
  ground. A junction, or a lane wider than three tiles, ends it.
- **The square**: the largest solid block (at least 3 x 3) of paving that is not your most common
  ground, centred on that paving. Paint a region and add `<Fete square region n>` to choose it yourself.
- **Objects**: a tile on the upper layers occupies its cell, so lamps, stalls and banners never stand on a
  barrel, a well, a window or a tree.

A town with no paved square holds its centrepiece on its open ground instead, as near the middle of it as
there is room. A map with no houses and no paved square (a forest, a dungeon) simply gets nothing, and
nothing breaks.

---

## Map notetags

Write these in **Map Properties → Note**:

| Notetag | Effect |
| --- | --- |
| `<Fete: harvest>` | The map is dressed whenever nothing else says otherwise. |
| `<Fete region 5: lantern>` | Region 5 takes its own dressing. Repeat for more regions. |
| `<Fete switch 12: hallows>` | The map is dressed while switch 12 is ON. |
| `<Fete switch 12 region 5: lantern>` | Region 5 only, while switch 12 is ON. |
| `<Fete square region 9>` | Region 9 is the square: the centrepiece and the stalls go there. |
| `<Fete mask region 3>` | Never decorate region 3. Repeat for more regions. |
| `<Fete solid: off>` | Decorations on this map never block movement. |
| `<Fete air: 0>` | No particles on this map (or any number up to 120). |
| `<Fete town>` | This map takes the plugin's switch bindings whose Map ID is 0. |

The dressing names are `harvest`, `lantern`, `blossom`, `midwinter` and `hallows`.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Set Dressing** | Dress the `map`, a `region` (by id) or a `rect` (x, y, width, height in tiles) in one of the five dressings. Map ID 0 means the current map; another map is dressed the next time the player arrives there. Transition `unspool`, `fade` or `none`, a duration in frames, and **Wait for completion**. |
| **Clear Dressing** | Take a dressing down from the `map`, a `region`, a `rect`, or `all`. It stays down until you set a dressing again or release the map. |
| **Release to Notes** | Forget every Set and Clear on a map, so its notetags and switch bindings decide again. |
| **Lamps On / Off / Auto** | Override the Lamps setting for the rest of the game (saved). |

### What decides a map's dressing

First match wins, for the whole map and for each region:

1. **Set Dressing / Clear Dressing** commands (saved with the game).
2. **Switch bindings** that are ON (the map's notetag bindings first, then the plugin's).
3. The plain **notetag** (`<Fete: …>`, `<Fete region n: …>`).

A rect set by command wins over a region, and a region wins over the whole map.

---

## Script calls

```js
Fete.set('map', 'harvest');
Fete.set('region', 'lantern', { regionId: 5, transition: 'fade', duration: 60 });
Fete.set('rect', 'blossom', { x: 3, y: 4, width: 8, height: 6 });
Fete.clear('all');
Fete.release();
Fete.lamps('on');            // 'on', 'off' or 'auto'
Fete.isBusy();               // true while a transition is playing
Fete.stateAt(x, y);          // 'harvest' ... or null
```

---

## Plugin parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Default transition | `unspool` | How a dressing arrives and leaves when a command does not say. |
| Default duration (frames) | `90` | Length of a transition (60 frames = one second). |
| Lamps | `auto` | `auto`: lamps shine as you tint the screen darker. `always`, `never`, or `switch`. |
| Lamp switch | `0` | With Lamps = `switch`, the lamps shine while this switch is ON. |
| Air particles | `36` | How many particles drift over a dressed map (0 to 120). |
| Solid decorations | `true` | Posts, stalls and the centrepiece block their cell, but only where every path round them stays open. |
| Wind sway | `true` | Strings and banners move gently in the wind. |
| Pixel size | `1` | `1` draws the decorations smooth (for 48 px art such as the RTP). `2` or `3` draws them in chunky pixels to sit with pixel-art tiles drawn at 2x or 3x. |
| Switch bindings | none | A map (or a region of it) is dressed while a switch is ON. Map ID 0 = every map whose note says `<Fete town>`. |

---

## Night

With **Lamps = auto** (the default), every lamp, lantern string, festoon bulb, the gate's lanterns, the
tree and the bonfire glow brighter the darker you tint the screen. Use **Tint Screen** with
`(-68, -68, 0, 68)` for a festival night. The glow is drawn above the tint, so the town goes dark and the
lights do not.

## Pixel size

If your tileset is pixel art drawn at 2x (each art pixel two screen pixels wide), set **Pixel size** to `2`:
every decoration is then drawn at half size and scaled up with each pixel kept square and hard-edged, so the
festival matches your tiles instead of looking painted on top of them. Places, sizes and everything else stay the
same; the lamp glow stays soft. `1` (the default) suits smooth 48 px art.

## Solid decorations

Lamp posts, stalls and the centrepiece block their own cell, but a decoration is only made solid where
blocking it keeps every neighbouring walkable cell connected to every other. A post in a one-tile
corridor stays walk-through. Characters set to Through ignore them, as with any obstacle. Turn it off
for the whole game with the parameter, or for one map with `<Fete solid: off>`.

## Transitions

- **unspool**: the decorations arrive nearest the player first. Strings run out from one end to the
  other, banners unroll downwards, posts, stalls and the centrepiece rise into place, and the air fades
  in. Taking a dressing down plays it in reverse. Changing from one dressing to another takes the old one
  down, then puts the new one up.
- **fade**: everything fades in or out together.
- **none**: instant.

A map that is dressed when the player arrives is dressed on its very first frame.

---

## Compatibility

Fete adds to the engine; it replaces nothing. It extends four engine methods, and each one calls the
engine's original first:

- `Spriteset_Map.prototype.createLowerLayer` (adds Fete's layers to the map)
- `Spriteset_Map.prototype.update` (moves Fete's sprites each frame)
- `Game_CharacterBase.prototype.isMapPassable` (solid decorations)
- `Game_Interpreter.prototype.updateWaitMode` (Wait for completion)

Recommended Plugin Manager position: after VisuStella MZ Core Engine and any other plugin that rebuilds
the map spriteset. Fete's decorations sit in the map's own tilemap, so they sort in front of and behind
characters exactly like events do.

Tile sizes other than 48 are supported: every drawing is authored at 48 pixels and scaled to your map's
tile size.

## Performance

Measured in the real MZ engine, on a 24 x 16 town dressed for Lantern Night under a night tint (31
decorations, 21 lights and 36 sky lanterns all live): **13 draw calls** per frame, **0 texture uploads**
per frame and **0 display objects added** per frame, with the per-frame update well inside the 2 ms
budget. All drawing happens once, when a dressing is built; after that, each frame only moves sprites
that already exist.

## Saved games

Fete's record lives in `$gameSystem._fete` (schema version 1): one entry per map that a command has
touched, plus the Lamps override. Saves made before Fete was installed load without it and simply follow
the notes.

---

## Files

| File | What it is |
| --- | --- |
| `js/plugins/FeteCore.js` | The plan. Pure analysis of a map; touches nothing in the engine. |
| `js/plugins/FeteDraw.js` | The look. Canvas drawing only. |
| `js/plugins/Fete.js` | The engine side: layers, notetags, commands, transitions, saving. |
| `LICENSE.txt` | Your licence. |
| `Readme_for_Users.md` | This file. |

The JavaScript ships readable and unminified.

---

## AI disclosure

The code and the graphics in this product were produced with AI assistance. No sounds and no authored
narrative text ship with it.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
