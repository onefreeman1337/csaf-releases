# Scathe: Battle Damage Drawn Into Your Sprites for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Scathe: Battle Damage Drawn Into Your Sprites for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Scathe for Godot 4

**Battle damage you can see, drawn into your own sprites as their health falls.** Version 1.0.1, for Godot 4.7.

Every hit leaves a mark of its kind on the sprite that took it: a sword leaves a gash that bleeds, a hammer cracks it,
fire chars it, ice frosts it, lightning burns a branching scar into it, poison spreads a bruise with veins, acid pits it
and eats through. As its health falls the whole sprite looks more and more worn. Nothing to draw: one canvas shader
computes every mark from the sprite's own pixels, inside its own outline, every frame on the GPU. Your enemies, your
art, no damaged variants to paint.

## What is in the box

| | |
| --- | --- |
| `addons/scathe/scathe.gdshader` | The damage itself: 7 kinds of mark, 7 material responses, the HP-band wear. |
| `addons/scathe/scathe.gd` | The `Scathe` node: places each mark, keeps the list, maps element names, runs the HP bands. |
| `addons/scathe/scathe_material.gd` | The `ScatheMaterial` resource: what a body is made of. |
| `addons/scathe/materials/` | 7 materials: `flesh`, `scale`, `shell`, `stone`, `metal`, `slime`, `spirit`. |
| `addons/scathe/presets/` | 49 preset scenes, one per material and kind (7 x 7), each a short fight on a demo creature. |
| `addons/scathe/demo_cast/` | Seven painted demo creatures (Ogre, Wyvern, Scarab, Golem, Haunted Armour, Ooze, Wraith). |
| `demo/demo.tscn` | A fight you can drive, on a painted battleback (`demo/art/`). |
| `demo/clean/` | Each demo creature untouched, the "before" of its seven presets. |

## Install

1. Copy the `addons/scathe/` folder into your project's `addons/` folder. Keep the folder name `scathe`: the
   materials and preset scenes refer to `res://addons/scathe/` by path.
2. There is no plugin to enable. `Scathe` and `ScatheMaterial` are ordinary script classes.
3. Optional: copy `demo/` too and run `demo/demo.tscn` to try it.

## Use it

Add a `Scathe` node as a **child** of a `Sprite2D` or a `TextureRect`. It replaces that node's `material` with its own
ShaderMaterial. Set its `scathe_material` to one of the seven `.tres` files (empty = flesh). Then from your combat code:

```gdscript
@onready var scathe: Scathe = $Enemy/Scathe

func on_hit(amount: float, element: String) -> void:
    scathe.take_damage(amount, enemy_max_hp, element)   # lowers health and draws a mark from the element NAME

# or drive the two halves yourself:
scathe.hit(Scathe.Kind.SCORCH, 0.6)        # one mark, power 0 to 1 sets its size
scathe.health = enemy_hp / enemy_max_hp    # 0 to 1, the HP bands wear the whole body
scathe.mend()                              # clears every mark (the wear still follows health)
```

`hit()` takes an optional third argument, a point in texture pixels, for a scripted blow; without it Scathe picks a part
of the body thick enough to hold the mark, away from the marks already there. It returns `false` once the sprite holds
`max_marks` marks. `get_band()` returns the HP band health is in (0 above every band, 3 below the last of the default
three) and `get_mark_count()` how many marks the sprite holds. Signals: `marked(kind, at)` after each mark,
`band_changed(band)` when health crosses a band.

## The kind of mark comes from the element

`take_damage()` and `hit_element()` read the **name** of the element, so your own element list still works.

| Element name contains | Kind | Mark |
| --- | --- | --- |
| acid, corro, melt, caustic | `ACID` | pitted corrosion that eats holes through the sprite, with acid running down |
| fire, flame, burn, heat, lava, inferno, blaze | `SCORCH` | char with a smouldering ember rim and sparks |
| ice, frost, cold, water, snow, freez, chill | `RIME` | frost that keeps the form under it, feathering out, with crystals |
| thunder, lightning, electric, spark, storm, bolt, shock | `SHOCK` | a charred strike and a branching lightning burn |
| poison, venom, dark, shadow, blight, toxic, curse, death, plague | `BLIGHT` | a creeping bruise with a sore and dark veins |
| earth, stone, rock, blunt, crush, impact, hammer | `CRACK` | a crack network in the body's own colour in shadow |
| anything else | `CUT` | a gash (a gouge on stone and shell, a bright score on metal) |

The size of a mark follows the damage in `take_damage()`: a hit for a third of max HP or more draws the biggest mark.

## Materials

| Material | Shown on | How marks land on it |
| --- | --- | --- |
| `flesh` | Ogre | cuts bleed and run straight down the sprite |
| `scale` | Wyvern | cuts open pale under-scale and bleed dark |
| `shell` | Scarab | cuts and cracks chip to pale chitin, with a crater at the blow |
| `stone` | Golem | cuts gouge, cracks open a chipped crater |
| `metal` | Haunted Armour | cuts score to bright steel; fire tempers it in straw, bronze, purple and blue instead of charring |
| `slime` | Ooze | cuts split wet; fire scalds it and raises blisters |
| `spirit` | Wraith | wounds give light; fire burns straight through |

A `ScatheMaterial` is colours plus five flags (`hard`, `metal`, `drips`, `glow`, `gel`) and `dark_below`: on a surface
darker than that, a crack or chip shows the bare material instead of a shadow, so marks read on black armour and dark
shells. Duplicate a material and change its colours for your own creature.

## HP bands

Below each band (75%, 50% and 25% of health by default, `hp_bands`) the whole sprite looks one step more worn: its colour
drains, its outline darkens, from the second band grime sinks into it in patches, and at the last band the outline takes
bites. Marks stay until `mend()`; raising `health` lifts the wear and keeps the marks.

## Scathe node properties

| Property | Default | |
| --- | --- | --- |
| `scathe_material` | empty (flesh) | What the body is made of. |
| `health` | 1.0 | 0 to 1. Drives the HP bands. |
| `hp_bands` | 0.75, 0.5, 0.25 | Highest first. |
| `max_marks` | 16 | 1 to 24. New hits past this stop adding marks (the bands still deepen). |
| `mark_scale` | 1.0 | 0.25 to 3. Multiplies every mark's size. |
| `wear_strength` | 1.0 | 0 to 2. 0 = marks only. |
| `mark_opacity` | 1.0 | 0 to 1. Fades every mark. |
| `pixel_grid` | 1 | 1 to 8. Pixel art drawn at 2x, 3x or 4x: set the same number and marks snap to its pixel grid. |
| `placement_seed` | 0 | The same seed and the same hits draw the same damage. |

## The presets

49 scenes in `addons/scathe/presets/<material>/<material>_<kind>.tscn`, for every material `flesh scale shell stone
metal slime spirit` and every kind `cut crack scorch rime shock blight acid` (for example `metal_scorch.tscn`). Each shows
its creature after a fight of that kind (10 hits for cut, crack, shock and acid, 9 for blight, 7 for scorch, 6 for rime,
so the thin marks and the broad ones show about as much) at 80% health (above every HP band, so you see the marks alone; set the
preset's `health` to 0.2 to see the wear too). The seven presets of one creature share a seed, so their marks land in
the same places and differ only by kind. Open one and press F6. To use a preset on your own sprite,
copy its two choices (the material and the kind) onto your `Scathe` node. Exported on every preset: `creature`,
`scathe_material`, `kind`, `hits`, `health`, `showcase_seed`, `display_height`.

## Demo keys

`1` to `7` strike with cut, crack, scorch, rime, shock, blight, acid · `Left` / `Right` change creature · `H` heal 25% ·
`M` mend · `Space` toggles the automatic fight (on at start).

## Renderers and versions

Tested on **Godot 4.7.2** under **Forward+** and **Compatibility** (OpenGL 3, the web renderer): every preset photographed
under both with zero engine errors. Older Godot 4 versions were NOT run. Works on `Sprite2D` (one whole texture, no
`region`, no `hframes`/`vframes`) and `TextureRect`; other nodes were not tested. The shader replaces the node's own
material.

## How it runs

- The sprite's outline is read once per texture (a coarse map of how far each part is from the edge, used to place
  marks). Measured on Godot 4.7.2 on the test machine: the first hit on a texture took under 20 ms on the seven demo
  creatures, later hits under 0.5 ms. All drawing is the shader's.
- 50 damaged creatures on screen at once (16 marks each, the last HP band) averaged under 15 ms a frame on both
  renderers, no frame over 40 ms (vsync off, 1280 x 720, an AMD Radeon integrated GPU).
- Marks are never drawn outside the sprite's outline, on its thin edges or on its soft anti-aliased fringe.
- Nothing is added to save files; store `health` and call `hit()` again if you want damage to persist.

## Licence

See `LICENSE.txt`. AI-generated: the code, the presets and the demo were written by an AI; the demo creatures and the
battleback were painted by an AI image model. Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
