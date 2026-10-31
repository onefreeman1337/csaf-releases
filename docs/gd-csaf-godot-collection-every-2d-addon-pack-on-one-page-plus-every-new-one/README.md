# CSAF Godot Collection: Every 2D Addon Pack on One Page, Plus Every New One — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** CSAF Godot Collection: Every 2D Addon Pack on One Page, Plus Every New One  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-10-31


---

# CSAF Godot Collection - 21 addon packs for Godot 4 in one project

Every paid Godot addon pack from Core Systems Asset Factory in one download: **21 addons, 1,127 presets**, all loading together in one
Godot 4.7 project. Weather, water, fog of war, lighting, shadows, occlusion, movement dust, combat VFX, spell seals, breakables, doors, small life,
sea life, journey maps, tapestries, tarot, notices, jigsaw puzzles, battle damage and material ageing. 2D only. Every preset is computed at runtime by
shaders, particles or `_draw()` code, with its parameters exposed.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**. Older 4.x versions were NOT run, so they are not claimed.
- **The addons are the same files as the single packs:** each `addons/<name>/` folder here is byte for byte the folder in that pack's own download.
  The demos moved from `demo/` to `demos/<name>/`; two demo walkers were renamed so they can share a project.
- **AI:** every shader, scene and script was written by an AI (see LICENSE.txt).

## Try it

1. Unzip anywhere. In the Godot Project Manager press **Import** and pick `godot/project.godot`. The first import takes a minute or two.
2. Press **Play**. The browser shows one card per addon; arrows or the mouse choose, **Enter** or a click opens that pack's own demo, and **F10** comes back from any demo.
   A demo's own keys are listed in `docs/<name>/Readme_for_Users.md`.
3. Open **The World**, the bar under the cards: one town at dusk with 18 of the addons running at once, each through the public calls its own Readme shows.
   A traveller walks it by itself; arrows or WASD take over. The source is `godot/collection/world.gd`, about 580 lines, and it is a fair example of how they combine.

The first time a scene opens, the screen says it is drawing while shaders compile. That can take a few seconds once, and Godot keeps the result.

## Use one in your game

Copy `godot/addons/<name>/` into your own project's `addons/` folder, as that pack's Readme says. There is no plugin to enable; the classes register themselves. Keep the folder name, because each addon's scenes reference
`res://addons/<name>/` by path. Copy one, some or all of them: no addon depends on another, none uses `demos/` or `collection/`, and all 21 load together with no class name clash.

## Memory

Vivarium and Fathom paint each species into a texture once and keep it, shared between nodes. A game showing a few species at game size uses little. At the large size the store pictures use, opening all 60 Fathom presets one after another in one run reached about 900 MB of textures, and Vulkan on our test machine's integrated AMD Radeon then began refusing buffers. If you swap species a lot, call `FathomAtlas.clear_cache()` or `VivariumAtlas.clear_cache()` after a scene change: with that call the same 60 presets stayed under 30 MB with no errors.

## What is inside

| addon | what it is | presets | page |
| --- | --- | --- | --- |
| `addons/emberflux/` | Combat VFX: slashes, bursts, projectiles, auras and status marks | 120 | [its page](https://csaf.itch.io/emberflux) |
| `addons/sigil_core/` | Procedural magic circles and spell seals that cast, hold and break | 60 | [its page](https://csaf.itch.io/sigil-core-godot) |
| `addons/wrack/` | Aftermath recipes that burn, ruin, overgrow or flood your own TileMapLayer | 40 | [its page](https://csaf.itch.io/wrack-godot) |
| `addons/weatherglass/` | 2D weather and atmosphere shaders: rain, snow, fog, storms | 48 | [its page](https://csaf.itch.io/weatherglass-godot) |
| `addons/verdigris/` | Material ageing shaders: rust, patina, frost, moss and wear on your own sprites | 48 | [its page](https://csaf.itch.io/verdigris-godot) |
| `addons/tidewater/` | 2D water: top-down bodies, side-on liquids, falls and underwater filters | 48 | [its page](https://csaf.itch.io/tidewater-godot) |
| `addons/jigsaw/` | Jigsaw puzzles cut from any picture, a one-call minigame | 48 | [its page](https://csaf.itch.io/jigsaw-godot) |
| `addons/lantern/` | 2D lighting: light shapes, living flames, a day clock and darkness layers | 48 | [its page](https://csaf.itch.io/lantern-godot) |
| `addons/cartography/` | A journey map that draws itself as the player explores, PNG export | 48 | [its page](https://csaf.itch.io/cartography-godot) |
| `addons/arras/` | The playthrough woven into a tapestry, 48 scenes, acts frozen when woven | 48 | [its page](https://csaf.itch.io/arras-godot) |
| `addons/broadsheet/` | Letters, notices and coins drawn from your game data | 48 | [its page](https://csaf.itch.io/broadsheet-godot) |
| `addons/augury/` | 78 tarot cards drawn in code, eight deck styles, upright and reversed | 78 | [its page](https://csaf.itch.io/augury-godot) |
| `addons/fogbank/` | 2D fog of war with walls, vision cones and explored memory | 48 | [its page](https://csaf.itch.io/fogbank-godot) |
| `addons/gnomon/` | Sprite shadows cast from your own sprites, y-sorted and non-stacking | 48 | [its page](https://csaf.itch.io/gnomon-godot) |
| `addons/glimpse/` | See characters behind trees, walls and roofs, 48 occlusion styles | 48 | [its page](https://csaf.itch.io/glimpse-godot) |
| `addons/smithereens/` | 2D breakables cut from your own sprite, broken the way their material would | 48 | [its page](https://csaf.itch.io/smithereens-godot) |
| `addons/kickup/` | Surface aware movement dust: steps, landings, skids, dashes, wall slides | 48 | [its page](https://csaf.itch.io/kickup-godot) |
| `addons/scathe/` | Battle damage drawn into your own sprites as HP falls | 49 | [its page](https://csaf.itch.io/scathe-godot) |
| `addons/vivarium/` | 48 species of small life drawn in code, placed from your TileMapLayer | 48 | [its page](https://csaf.itch.io/vivarium-godot) |
| `addons/threshold/` | 48 door, gate and chest openings rebuilt from your own tiles | 48 | [its page](https://csaf.itch.io/threshold-godot) |
| `addons/fathom/` | Underwater levels: 48 sea creatures and 12 seas drawn in code | 60 | [its page](https://csaf.itch.io/fathom-godot) |

That is **1,127 presets** in all. Each addon's full preset list and every parameter are in `docs/<name>/Readme_for_Users.md`.

## New packs

New CSAF Godot addon packs are added to this download on the day they launch, at no extra cost if you already own it. No promise is made about how many or how often. itch shows the new file on your download page.

## Licence

See `LICENSE.txt`. Short version: use everything in any number of your games, royalty free, no credit required; no resale or redistribution of the files as a pack; no AI training.
Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
