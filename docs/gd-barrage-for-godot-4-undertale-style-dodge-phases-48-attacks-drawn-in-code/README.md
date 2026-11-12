# Barrage for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Barrage for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-12


---

# Barrage for Godot 4

**Version 1.0.0. Built and tested on Godot 4.7.2**, under both Forward+ and Compatibility (the web renderer). Older
Godot versions were not run, so none is claimed.

Barrage is the dodge phase of an Undertale-style battle for a Godot 4 game. When an enemy attacks, a framed arena opens (or
resizes from the last attack's size), the player steers a small soul through the attack, and every hit is counted. When it
ends, `finished` hands back the hits and a damage multiplier: no hits is a miss.

- **48 attacks** ready to use (`addons/barrage/attacks/*.tres`), 3 of them bosses that attack in phases.
- **14 patterns**: rain, sweep, wall, spiral, ring, bounce, aimed, cross, scatter, pinwheel, curtain, squeeze, meteor, orbit.
- **24 projectile forms**, every one drawn in code into one texture at runtime: ember, shard, spark, droplet, pebble, leaf, mote, wisp, blade, bone, feather, needle, stone, orb, coin, thorn, fang, note, petal, star, bubble, card, arrow, rune. No image files ship.
- **Attacks composed from your enemy's data** with `BarrageComposer`: what flies from the element or the name, how it flies
  from the move, how fierce from the stats, bosses in phases.
- **Every attack can be dodged.** `BarrageAttack.fairness()` runs a grid solver that proves a path exists which no shot
  touches; all 48 shipped attacks pass it.
- Keys, a gamepad stick or a held mouse button (or a finger) steer the soul.

## Install

1. Copy `addons/barrage/` into your project (keep the folder together; the fonts are found next to the scripts).
2. Nothing to enable. `BarrageArena`, `BarrageAttack`, `BarrageFoe` and `BarrageComposer` are ready to use.

Open `demo/demo.tscn` in this project to try everything first: a battle screen with ten foes whose attacks are composed from
their data, and every one of the 48 attacks.

## Use it in a battle

```gdscript
var arena := BarrageArena.new()
arena.arena_scale = 2.0
add_child(arena)
arena.open(load("res://addons/barrage/attacks/ember_spiral.tres"))
var result: Dictionary = await arena.finished
print(result.hits, " hits, damage x", result.multiplier)
```

`result` holds `hits`, `multiplier` (0.0 for a perfect dodge), `dodged`, `frames` and `attack`. Scale your own damage
by `multiplier`. Signals: `opened(attack)`, `hit(hits_so_far)`, `finished(result)`, `closed`. Methods: `open(attack)`,
`close()`, `is_running()`, `hits_taken()`, `soul_position()`, `preview(frame)` (a still moment, for menus and screenshots).

The arena runs at a fixed 60 steps a second (times `speed`), so an attack plays the same on every machine and frame rate.

## Compose attacks from your enemies

```gdscript
var foes: Array = [crow, goblin_archer, frost_wisp, lich_king]   # BarrageFoe resources, filled from your own data
var attack := BarrageComposer.compose(frost_wisp, {"name": "Rime Lance", "kind": "magical"}, foes)
arena.open(attack)
```

- **What flies:** the move's element by NAME (Fire, Ice, Thunder, Water, Earth, Wind, Light, Dark, Sound, Arcane, Nature,
  Cosmic...), else the foe's own name (a Crow throws feathers, an Archer arrows, a Skeleton bones, a Jester cards), else its
  strongest stat against the median of the list you pass.
- **How it flies:** the move's `kind` (`physical`, `magical`, `certain`) and `reach` (`one` or `all`) choose a set of
  patterns; foes take them in turn by `id`, so neighbouring foes never attack alike with the same kind of move.
- **How fierce:** tier 0 to 4 from attack (magic for a magical move) and agility, measured against the median of your list.
- **Bosses:** a foe with 3 times the median max HP (or `boss = true`) attacks in 2 phases of different patterns, 3 phases at
  6 times. The arena is sized for the first pattern and keeps that size through every phase.
- The same foe, move and seed always compose the same attack.

### BarrageFoe

| Parameter | Default | What it does |
| --- | --- | --- |
| `display_name` | `"Foe"` | The enemy's name. Read for what it would throw ("Crow" throws feathers, "Skeleton" bones, "Golem" stones). |
| `element` | `""` | Its element by NAME ("Fire", "Ice", "Thunder", "Water", "Earth", "Wind", "Light", "Dark", "Sound", ...). Empty or "Physical" means none. |
| `attack` | `10.0` | Physical attack, on your own game's scale: the composer measures every stat against the median of the foes you pass with it, never against fixed numbers. Sets how fierce a physical move is. |
| `magic` | `10.0` | Magic attack. Sets how fierce a magical move is. |
| `agility` | `10.0` | Agility. A quicker foe attacks more fiercely. |
| `max_hp` | `100.0` | Max HP. 3 times the median makes a boss (2 phases), 6 times a bigger one (3 phases). |
| `id` | `1` | Its place in your list. Neighbouring ids take different patterns for the same kind of move. |
| `form_override` | `""` | Override what flies (a form id; empty = choose). |
| `pattern_override` | `""` | Override how it flies (a pattern id; empty = choose). |
| `tier_override` | `-1` | Override how fierce, 0 to 4 (-1 = choose). |
| `boss` | `false` | Attacks in phases like a boss, whatever its HP. |

## Parameters

### BarrageArena

| Parameter | Default | What it does |
| --- | --- | --- |
| `autostart` | `false` | Open and run `attack` as soon as the arena enters the tree. |
| `arena_scale` | `1.0` | Size of one arena pixel on screen. |
| `speed` | `1.0` | Steps a second, as a share of 60. The soul and every shot speed up together, so the proof of fairness still holds. |
| `shot_scale` | `1.0` | Size every projectile is drawn at (its hit radius does not change: change the attack's form for that). |
| `trail` | `0.6` | Motion trails: faint copies of each projectile where it just was, so a still frame shows which way it flies. 0 turns them off. |
| `soul_shape` | `"heart"` | heart, diamond or star. |
| `soul_color` | `Color("#ff3b4e")` | The soul's colour. |
| `per_hit` | `0.5` | Each hit taken adds this share of the attack's damage. |
| `damage_cap` | `1.5` | The most the hits can multiply the damage by. |
| `open_frames` | `18` | Frames the arena takes to open or resize before the attack starts. |
| `show_label` | `true` | The attack's name above the arena, and the result when it ends. |
| `pointer_control` | `true` | Hold the mouse button (or a finger) anywhere and the soul follows it. |
| `action_left` | `&"ui_left"` | Input action that moves the soul left (any action in your Input Map). |
| `action_right` | `&"ui_right"` | Input action that moves the soul right. |
| `action_up` | `&"ui_up"` | Input action that moves the soul up. |
| `action_down` | `&"ui_down"` | Input action that moves the soul down. |
| `preview_frame` | `120` | The frame `csaf_preview()` photographs (a still moment of the attack, deterministic). |
| `idle_size` | `Vector2(384, 216)` | The arena's size while no attack is set (arena pixels). |

### BarrageAttack

| Parameter | Default | What it does |
| --- | --- | --- |
| `display_name` | `"Attack"` | The name shown above the arena while it runs. |
| `tier` | `2` | How fierce: 0 (gentle) to 4. Density and speed rise with it. |
| `attack_seed` | `"barrage"` | Changes where every gap falls and where every shot comes from. The same seed always composes the same attack. |
| `arena_size` | `Vector2(384, 216)` | The arena, in arena pixels (the soul moves 3 of them a frame). The arena opens or resizes to this before the attack. |
| `phase_frames` | `210` | Frames each phase runs (60 a second). |
| `boss_patterns` | `PackedStringArray()` | A boss: patterns of the phases that follow the first (empty = one phase). |
| `boss_forms` | `PackedStringArray()` | A boss: forms of those phases, in order (empty or short = the attack's own form). |
| `tint` | `Color(1, 1, 1, 1)` | Tints every projectile (white = as drawn). |
| `hue_shift` | `0.0` | Turns every projectile's hue, in turns (0 = as drawn, 0.5 = opposite). |
| `ground_top` | `Color(0.075, 0.07, 0.12)` | The arena ground's colour at the top. |
| `ground_bottom` | `Color(0.02, 0.02, 0.045)` | The arena ground's colour at the bottom. |
| `frame_color` | `Color(0.93, 0.9, 0.82)` | The arena frame's colour. |
| `pattern` | `"rain"` | How it flies: rain, sweep, wall, spiral, ring, bounce, aimed, cross, scatter, pinwheel, curtain, squeeze, meteor, orbit. |
| `form` | `"stone"` | What flies: one of the 24 drawn forms. |

## The 48 attacks

| Attack | Pattern | Form | Tier | Arena |
| --- | --- | --- | --- | --- |
| `cinder_rain` Cinder Rain | rain | ember | 3 | 300x216 |
| `hornet_rain` Hornet Rain | rain | needle | 2 | 300x216 |
| `petal_shower` Petal Shower | rain | petal | 1 | 300x216 |
| `arrow_rain` Arrow Rain | rain | arrow | 4 | 300x216 |
| `gale_of_feathers` Gale of Feathers | sweep | feather | 3 | 384x180 |
| `leaf_gust` Leaf Gust | sweep | leaf | 2 | 384x180 |
| `dealers_sweep` Dealer's Sweep | sweep | card | 4 | 384x180 |
| `ossuary_wall` Ossuary Wall | wall | bone | 3 | 320x216 |
| `toll_gate` Toll Gate | wall | coin | 2 | 320x216 |
| `glacier_wall` Glacier Wall | wall | shard | 4 | 320x216 |
| `ember_spiral` Ember Spiral | spiral | ember | 3 | 384x216 |
| `lichs_requiem` Lich's Requiem (boss) | spiral | wisp | 4 | 384x216 |
| `starwheel` Starwheel | spiral | star | 2 | 384x216 |
| `rune_spiral` Rune Spiral | spiral | rune | 3 | 384x216 |
| `chorus_rings` Chorus Rings | ring | note | 3 | 384x216 |
| `bubble_rings` Bubble Rings | ring | bubble | 2 | 384x216 |
| `archmages_hex` Archmage's Hex (boss) | ring | orb | 4 | 384x216 |
| `tide_rings` Tide Rings | ring | droplet | 3 | 384x216 |
| `ricochet` Ricochet | bounce | pebble | 4 | 288x216 |
| `loose_change` Loose Change | bounce | coin | 4 | 288x216 |
| `froth` Froth | bounce | bubble | 4 | 288x216 |
| `volley` Volley | aimed | arrow | 4 | 264x216 |
| `pack_hunt` Pack Hunt | aimed | fang | 4 | 264x216 |
| `static_snipe` Static Snipe | aimed | spark | 4 | 264x216 |
| `tesla_cross` Tesla Cross | cross | spark | 4 | 384x216 |
| `crossed_blades` Crossed Blades | cross | blade | 3 | 384x216 |
| `holy_cross` Holy Cross | cross | mote | 4 | 384x216 |
| `bramble_cross` Bramble Cross | cross | thorn | 3 | 384x216 |
| `fireworks` Fireworks | scatter | ember | 3 | 384x216 |
| `starburst` Starburst | scatter | star | 4 | 384x216 |
| `blossom_burst` Blossom Burst | scatter | petal | 3 | 384x216 |
| `hail_burst` Hail Burst | scatter | shard | 4 | 384x216 |
| `whirlwind` Whirlwind | pinwheel | leaf | 3 | 384x216 |
| `fan_of_cards` Fan of Cards | pinwheel | card | 4 | 384x216 |
| `will_o_wheel` Will-o-Wheel | pinwheel | wisp | 3 | 384x216 |
| `waltz` Waltz | pinwheel | note | 4 | 384x216 |
| `waterfall_cave` Waterfall Cave | curtain | droplet | 2 | 300x216 |
| `bramble_path` Bramble Path | curtain | thorn | 3 | 300x216 |
| `rune_corridor` Rune Corridor | curtain | rune | 3 | 300x216 |
| `crushing_walls` Crushing Walls | squeeze | stone | 3 | 384x196 |
| `ribcage` Ribcage | squeeze | bone | 4 | 384x196 |
| `iron_maiden` Iron Maiden | squeeze | blade | 4 | 384x196 |
| `rockfall` Rockfall | meteor | stone | 3 | 336x216 |
| `starfall` Starfall | meteor | star | 4 | 336x216 |
| `dragons_fury` Dragon's Fury (boss) | meteor | ember | 4 | 336x216 |
| `hex_halo` Hex Halo | orbit | orb | 4 | 384x216 |
| `seraph_ring` Seraph Ring | orbit | mote | 4 | 384x216 |
| `pincushion` Pincushion | orbit | needle | 4 | 384x216 |

Each is a `.tres` in `addons/barrage/attacks/` and a ready scene in `addons/barrage/presets/` (a BarrageArena holding it).
Change any field (form, tier, seed, tint, hue, arena size) and it is a new attack.

## Renderers

Every attack was photographed under Forward+ and Compatibility on Godot 4.7.2 and compared: the two renderers draw them alike.
The projectiles are drawn once, into one shared texture, when the first arena enters the tree; that takes about one frame,
inside the arena's opening, and the texture is freed when the last arena leaves the tree.

## Licence

See LICENSE.txt. AI-generated: every script, rule, form and the demo were written by an AI; the two fonts in
`addons/barrage/fonts/` are human-made typefaces under the SIL Open Font License 1.1.

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
