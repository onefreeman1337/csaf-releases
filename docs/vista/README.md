# Vista: Generated Battle Backgrounds for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Vista: Generated Battle Backgrounds for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/vista  
**Docs published:** 2026-11-05


---

# Vista — Procedural Illustrated Battle Arenas

**for RPG Maker MZ · version 1.0.1**
Core Systems Asset Factory

---

Every battle opens on an illustrated landscape the plugin **drew**: layered
silhouette strata, a sky that belongs to the hour, rim light along every ridge,
water that reflects the sun, weather driven across the whole frame.

There are no PNGs. Nothing to import, nothing to resize, nothing that breaks
when you change your game's resolution — the arena is drawn at whatever size
the engine asks for, so it is exactly as sharp at 1920×1080 as at 816×624.

**44 authored silhouette motifs · 8 biomes · 5 hour bands · 6 weathers ·
240 combinations, every one of them a different picture.**

---

## COMPATIBILITY

**Tested against:** RPG Maker MZ core scripts (`rmmz_core`, `rmmz_managers`,
`rmmz_objects`, `rmmz_scenes`, `rmmz_sprites`, `rmmz_windows`) running in the
stock engine, and alongside VisuStella MZ Core Engine.

**Plugin Manager import order — this matters, and Vista will refuse to load in
the wrong order rather than misbehave quietly:**

```
1.  VistaRender.js      the drawing engine
2.  VistaAtlas.js       the motifs and palettes
3.  VistaScene.js       the composer
4.  Vista.js            the engine integration   <- must be LAST of the four
```

Place all four **below** your core/library plugins (VisuStella MZ Core Engine
and similar) and anywhere you like relative to everything else.

**What Vista touches.** Exactly two core methods, both EXTENDED with the
original saved and called, neither clobbered:

| Method | What Vista does |
| --- | --- |
| `Sprite_Battleback.prototype.battleback1Bitmap` | returns the generated arena |
| `Sprite_Battleback.prototype.battleback2Bitmap` | returns a blank, so the engine's stock backdrop cannot paint over the arena |

**Both are required.** MZ draws battleback layer 2 *on top of* layer 1, so a
plugin that replaces only the first leaves the engine's own backdrop across the
top of your picture.

**Vista adds no update-loop code whatsoever.** The arena is composed **once**
when a battle starts, into a cached bitmap, and re-used from cache for as long
as the biome, hour, weather and seed stay the same. It cannot cost you a frame
during play.

**Conflicts.** Any other plugin that replaces `battleback1Bitmap` or
`battleback2Bitmap` will conflict — load Vista **after** it to win, or before it
to yield. If a plugin changes the battleback by setting a battleback *name*
(rather than patching the sprite), Vista cooperates with it automatically: see
"Respect Map Battleback" below.

---

## INSTALLATION

1. Copy all four `.js` files into your project's `js/plugins/` folder.
2. In the Plugin Manager, add them in the order listed above.
3. Set **Default Biome** and **Default Hour**. That is enough to see it working
   — start a battle.

---

## HOW AN ARENA IS CHOSEN

Four things decide what a battle looks like: **biome, hour, weather, seed**.
Each is resolved from the first source below that has an answer.

| | order of precedence |
| --- | --- |
| **Biome** | plugin command → map notetag `<vistaBiome:forest>` → terrain tag under the player → Default Biome |
| **Hour** | plugin command → `<vistaHour:dusk>` → Hour Variable → Default Hour |
| **Weather** | plugin command → `<vistaWeather:rain>` → Weather Variable → `clear` |
| **Seed** | plugin command → `<vistaSeed:hollow-road>` → Seed Mode |

The same four inputs always produce the same picture, forever. That is a
guarantee rather than a coincidence: every random number in the generator comes
from a seeded stream, so a place your player fought in at dawn looks like the
**same place** when they come back at dusk.

### The three ways to drive it

**Hands-off — terrain tags.** Set terrain tags on your tileset, fill in the
*Terrain Tag → Biome* table, and every region of your world fights differently
with no per-map work at all.

**Per map — notetags.** Put `<vistaBiome:cave>` in a map's note box. Add
`<vistaHour:night>` and `<vistaWeather:fog>` if that map is always night and
always foggy.

**Story-driven — variables and plugin commands.** Point *Hour Variable* at your
day/night clock and the arenas follow it automatically. Or use the plugin
commands from an event when the volcano erupts:

```
Plugin Command: Vista → Set Biome   → ashland
Plugin Command: Vista → Set Hour    → storm
Plugin Command: Vista → Set Weather → embers
```

Overrides are saved with the game and survive a reload — if the world has
changed, it stays changed. `Clear Overrides` hands control back to your
notetags, variables and parameters.

---

## THE REPERTOIRE

**Biomes** — `forest` `coast` `desert` `cave` `ruin` `marsh` `tundra` `ashland`

**Hours** — `dawn` `day` `dusk` `night` `storm`

**Weathers** — `clear` `rain` `snow` `fog` `embers` `drip`

`storm` is an **hour** rather than a weather, because it changes the light
across the whole scene and not merely what is falling through it. Combine it
with `rain` or `fog` for the full effect.

`drip` is cave water falling from the ceiling. **Rain and snow are remapped
automatically underground** — snow becomes clear, rain becomes drip — because
neither falls indoors, and you should not have to remember that.

Each biome gets its own ground: forest earth, desert sand, tundra snow, ashland
ash, ruin flagstone, cave stone, and real **water** for coast and marsh, with a
specular path running from the sun or moon down toward the viewer.

---

## PARAMETERS

| Parameter | What it does |
| --- | --- |
| **Default Biome / Default Hour** | used when nothing else specifies one |
| **Terrain Tag → Biome** | maps the terrain tag under the player to a biome |
| **Hour Variable** | a variable holding 1=dawn 2=day 3=dusk 4=night 5=storm. `0` means OFF |
| **Weather Variable** | 1=clear 2=rain 3=snow 4=fog 5=embers 6=drip. `0` means OFF |
| **Seed Mode** | *Map Id* gives every map its own permanent landscape; *Map Id + Troop Id* varies it per encounter; *Fixed* uses one arena everywhere |
| **Respect Map Battleback** | ON: a battleback set by the map or by a *Change Battle Back* command wins and Vista stands aside. OFF: Vista always draws |
| **Render Scale** | 100 draws at full resolution. Lower values draw smaller and let the engine scale up — cheaper on weak machines, slightly softer |

**Respect Map Battleback** is what lets you use Vista everywhere and still
hand-place a specific painted image for one boss room. Leave it ON.

---

## FOR PROGRAMMERS

The generator has **no engine dependencies at all** — `VistaRender`,
`VistaAtlas` and `VistaScene` contain zero RPG Maker code. You can draw an
arena onto any canvas you like:

```js
CSAF.VistaScene.draw(ctx, {
  width: 1000, height: 740,
  biome: 'ruin', hour: 'dusk', weather: 'fog', seed: 'my-seed'
});
```

and `Vista.js` adds a convenience that fills in your game's current context and
hands back a ready `Bitmap`:

```js
const bmp = CSAF.Vista.makeBitmap(1000, 740);            // current context
const bmp = CSAF.Vista.makeBitmap(400, 300, {            // or specify it
  biome: 'tundra', hour: 'night', weather: 'snow', seed: 7
});
```

Use it for title screens, cutscene backdrops, menu panels, map thumbnails —
anywhere you would otherwise have needed an artist and a PNG.

**Adding your own motifs.** Push a function onto
`CSAF.VistaAtlas.MOTIFS.<family>`. It receives
`(ctx, x, baseY, scale, colour, rand)` and should draw one object standing on
`baseY`. Anything you add is picked up by the composer with no other change.

Two rules if you do:

- **Lead with a large filled shape.** Thin strokes dissolve into grey mush at
  thumbnail size and behind battlers. The atlas ships a measuring helper —
  `CSAF.VistaAtlas.motifInkArea('family.name')` returns a `thickness` figure;
  anything under `0.02` is a hairline.
- **Consume a fixed number of `rand()` calls.** The composer draws motifs in
  sequence from one stream, so a motif whose draw count varies would
  desynchronise every motif after it and break the "same seed, same arena"
  guarantee for some seeds and not others.

---

## TROUBLESHOOTING

**The arena does not appear.** Check the Plugin Manager order — `Vista.js` must
be last of the four. If it is first, the other three have not defined
`CSAF.VistaScene` yet and Vista throws on load with a message saying so.

**My hand-painted battleback stopped showing.** That is *Respect Map
Battleback* being OFF. Turn it on, or clear the biome override.

**The arena is the same on every map.** *Seed Mode* is probably *Fixed*. Set it
to *Map Id*.

**A cave map is showing snow.** It is not — snow is remapped to `clear`
underground on purpose. Use `drip` or `fog` for weather in a cave.

**Performance.** Vista runs no per-frame code. If you are seeing a hitch at the
moment a battle starts on a very old machine, lower **Render Scale** to 75 or
50; the arena is then drawn smaller and scaled up by the engine.

---

## LICENCE

See `LICENSE.txt`. Short version: use it in unlimited games, commercial or
free, keep 100% of your revenue, modify it freely for your own projects. Do not
resell or republish the plugin itself.

**AI disclosure.** The code and the generated graphics in this product were
produced with AI assistance. Sound: none. Text and dialogue: none.

---

*Core Systems Asset Factory · https://csaf.itch.io*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
