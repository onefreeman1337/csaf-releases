# Warhost for Godot 4: Regiment Battles, Every Soldier, Banner and Field Drawn in Code — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Warhost for Godot 4: Regiment Battles, Every Soldier, Banner and Field Drawn in Code  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Warhost for Godot 4

**Army battles for your 2D Godot game.** Two hosts of regiments meet on a battlefield: foot, pikes, archers, horse and
mages, every soldier drawn in its army's colours, every regiment under a banner whose arms are generated from its name.
The battle plays out soldier by soldier at a fixed 60 steps a second: volleys arc overhead, spells burst, riders charge,
regiments break and run. When it ends, the survivors of every regiment are handed back to your game by a signal.

Nothing is loaded: no image files, no sprite sheets, no battlebacks. The soldiers, banners, arrows, spells and the field
itself are drawn by code at run time. 48 staged battles ship as presets on 12 fields.

Version 1.0.1 · Godot 4.7 (run on 4.7.2; older 4.x versions were not run) · Core Systems Asset Factory

---

## Install

1. Copy `addons/warhost/` into your project's `addons/` folder. There is no plugin to enable. Keep that path: the preset
   and field scenes name `res://addons/warhost/`, so a renamed folder cannot load them (Godot names the path it tried).
   The scripts themselves are classes (`WarhostBattle`, `WarhostPreset`, ...) and work from any folder.
2. Open `demo/demo.tscn` in this project to see it first: LEFT and RIGHT go through the 48 battles.

`addons/warhost/presets/` and `addons/warhost/fields/` are the staged battles and their fields; you can delete them once
you stage your own. Keep the `warhost_*.gd` scripts.

---

## A battle in three lines

```gdscript
var battle := WarhostBattle.new()
battle.player_army = [{"name": "Iron Company", "role": "foot", "count": 120}, {"name": "Sallow Bows", "role": "archer", "count": 60}]
battle.enemy_army = [{"name": "Red Hand", "role": "foot", "count": 140}, {"name": "Grey Lances", "role": "horse", "count": 30}]
battle.battle_finished.connect(func(result): print(result["winner"], result["sides"]))
add_child(battle)   # it starts on its own (autostart)
```

Or drop any preset scene from `addons/warhost/presets/` into your scene: it plays its battle from the start, centred on the
preset's position.

### A regiment

| Key | Meaning |
| --- | --- |
| `name` | Shown nowhere by the node, but it decides the banner: the same name and side always fly the same arms. |
| `role` | `foot`, `pike`, `archer`, `horse` or `mage`. Anything else is fielded as foot. |
| `count` | Soldiers, 1 to 99,999. A regiment under 1 stays home. Text that reads as a number is read. |
| `strength` | 1 = ordinary troops, 1.5 = veterans, 0.5 = levies. Clamped to 0.25 to 4. |

Up to `figures_per_side` figures a side are drawn (240 by default). A bigger army is carried at several soldiers per
figure, and every number in the result is still in soldiers: a 99,999-man host is accounted for to the man.

---

## WarhostBattle

The node. Its position is the top left corner of the soldiers' lane (`FIELD_SIZE`, 816 x 376 at scale 1); the drawn field
reaches `LANE_TOP` (174 px) above it for the sky, hills and keep. Scale the node to fit your screen.

| Property | Default | Meaning |
| --- | --- | --- |
| `player_army` | `[]` | Your regiments (see A regiment). |
| `enemy_army` | `[]` | The enemy's regiments. |
| `player_formation` | `line` | `line`, `wedge`, `square` or `loose`. |
| `enemy_formation` | `auto` | `auto` reads the enemy's own make-up (many bows: loose; many riders: wedge; many pikes: square) with a seeded coin; or fix it. |
| `battle_seed` | `1` | The same seed fights the same battle, step for step. |
| `player_colour`, `player_trim` | blue, cream | Tunic and trim of your army. Alpha 0 keeps the default. |
| `enemy_colour`, `enemy_trim` | red, black | Tunic and trim of the enemy. |
| `figures_per_side` | `240` | Figures drawn per side (8 to 600). |
| `autostart` | `true` | Start when the node enters the tree. Otherwise call `start()`. |
| `terrain` | `meadow` | `meadow`, `steppe`, `snow`, `desert` or `moor`. |
| `field_seed` | `0` | The field's own seed; 0 uses `battle_seed`. |
| `show_field` | `true` | Draw the battlefield behind the soldiers (off: soldiers on your own backdrop). |
| `steps_per_second` | `60` | How fast it plays (15 to 240). The result does not depend on it. |
| `show_banners` | `true` | Every regiment carries its banner. |

| Method / signal | Meaning |
| --- | --- |
| `start()` | Sets up the battle from the properties and starts it. Call again to fight again. |
| `advance(steps)` | Runs that many steps at once (a seek): the result is the same as playing them. |
| `battle_finished(result)` | Emitted once, when one side has no one left standing or the time limit (3,600 steps) is reached. |

### The result

```gdscript
{
	"winner": 0,            # 0 = your army, 1 = the enemy, -1 = neither held the field
	"steps": 630, "seconds": 11,
	"formations": ["line", "wedge"],
	"sides": [{"count": 180, "survived": 124, "fled": 0, "dead": 56}, {...}],
	"regiments": [{"name": "Iron Company", "role": "foot", "side": 0, "count": 120, "survived": 84, "fled": 0, "dead": 36, "routed": false}, ...],
}
```

For every regiment `survived + fled + dead == count`. Those who fled come home: write `survived + fled` back into your
game if you want deserters to return.

### The arms

| Arm | What it does |
| --- | --- |
| foot | Shield and sword. Strikes at close quarters. |
| pike | Long reach. Deals 2.6 times its blow to horse, and a rider's charge does not land on pikes. |
| archer | Shoots arrows that arc over the field at 42 to 210 px; fights badly up close. |
| horse | Fast. The first blow of a charge lands at 1.6 times, except on pikes. Deals 1.8 times to archers, 2 times to mages. |
| mage | Casts a burst that hurts every enemy within 30 px of where it lands, at 42 to 190 px. Fragile. |

A regiment breaks and runs for its own edge when it has lost most of its men while its side is losing; its banner leans
back as it goes and falls where its last man falls.

### The formations

| Formation | How it fights |
| --- | --- |
| line | Steady ranks. Its blows land at 1.4 times on a loose formation. |
| wedge | Packed and driving: its blows land at 1.1 times, and at 1.4 times on a line. |
| square | Shields locked: takes 0.6 times from riders and 0.95 times in melee; its blows land at 1.4 times on a wedge. |
| loose | Spread out: takes 0.82 times from arrows and 0.8 times from spells; its blows land at 0.9 times, and at 1.4 times on a square. |

A formation also takes 0.8 times from the formation it beats. These are the rules, not promises about who wins: numbers,
arms and the seed decide battles.

---

## WarhostPreset

A staged battle in one scene: a `WarhostBattle` with its armies, formations, colours, field and framing. Every value is an
exported property, so a preset is also a template.

| Property | Meaning |
| --- | --- |
| `title`, `note` | The battle's name and what it is. |
| `player_army` ... `figures_per_side` | As on WarhostBattle. |
| `focus`, `zoom` | The point of the field shown at the preset's position, and the scale. |
| `frame_size` | The frame it is composed for (480 x 320); the focus is kept far enough from the edges that this frame stays on the field. |
| `moment` | The step its picture is taken at. |
| `autostart` | Play from the start when it enters the tree. |
| `field_only` | The field alone, framed the same way, with no soldiers. |

| Method | Meaning |
| --- | --- |
| `restart()` | Plays the battle again from its start with the current values. |
| `seek_to_moment()` | Restarts and goes straight to `moment`, then holds there. |

## Banners

`WarhostHeraldry.arms(name, side)` returns a regiment's arms: a field, an ordinary (pale, fess, bend, chevron, cross,
saltire, quarterly, chief, bordure, pile, barry, paly and more), a charge (star, crescent, tower, sword, key, bird, fleur
and more) and a flag shape (swallowtail, square, pennon, gonfalon). The field and what lies on it keep to the rule of tincture, a metal on a
colour or a colour on a metal. A charge on an ordinary can be metal on metal, such as a gold star on a white fess.
`WarhostHeraldry.paint(canvas_item, rect, arms)` draws one banner's cloth anywhere (a menu, a war record, a map).

---

## The 48 staged battles

<!-- presets:begin -->
| Field | Battles (scene id in `addons/warhost/presets/`) |
| --- | --- |
| Meadow, the whole field | Drawn Up at Larkfield (`drawn_up_at_larkfield`) · The Host of Two Thousand (`the_host_of_two_thousand`) · The Breaking at Millbrook (`the_breaking_at_millbrook`) · Riders at the Mill (`riders_at_the_mill`) |
| Meadow, the centre | Arrow Storm (`arrow_storm`) · Lances Into the Hedge (`lances_into_the_hedge`) · Larkfield, After (`larkfield_after`) · Fire on the Square (`fire_on_the_square`) |
| Meadow, up close | Ditch Fight (`ditch_fight`) · Horse Against Horse (`horse_against_horse`) · The Last Square (`the_last_square`) · Push of Pike (`push_of_pike`) |
| Steppe, the whole field | Two Hosts on the Grass Sea (`two_hosts_on_the_grass_sea`) · Through the Bowmen (`through_the_bowmen`) · The Rearguard Holds (`the_rearguard_holds`) · The Steppe Horde (`the_steppe_horde`) |
| Steppe, the centre | The Grass Sea, After (`the_grass_sea_after`) · Bow Against Bow (`bow_against_bow`) · The Ford Line (`the_ford_line`) · Circle Against Circle (`circle_against_circle`) |
| Snow, the centre | The Winter Crossing (`the_winter_crossing`) · Arrows Over the Snow (`arrows_over_the_snow`) · Charge on the Ice Road (`charge_on_the_ice_road`) · The Frozen Rout (`the_frozen_rout`) |
| Snow, up close | Stand at the Cairn (`stand_at_the_cairn`) · Snowbound Patrols (`snowbound_patrols`) · Fire in the Snow (`fire_in_the_snow`) · Hedge of Iron (`hedge_of_iron`) |
| Desert, the whole field | Hosts on the Salt Flats (`hosts_on_the_salt_flats`) · The Dune Horde (`the_dune_horde`) · Riders Through the Dust (`riders_through_the_dust`) · The Rout at the Wells (`the_rout_at_the_wells`) |
| Desert, the centre | Sunfire (`sunfire`) · Volleys Over the Dunes (`volleys_over_the_dunes`) · The Salt Flats, After (`the_salt_flats_after`) · Holding the Pass (`holding_the_pass`) |
| Moor, the centre | Bog Line (`bog_line`) · Witchfire on the Moor (`witchfire_on_the_moor`) · Arrows in the Mist (`arrows_in_the_mist`) · The Moorland Charge (`the_moorland_charge`) |
| Moor, up close | Lances in the Heather (`lances_in_the_heather`) · The Standing Stones (`the_standing_stones`) · Peat Cutters (`peat_cutters`) · Duel of Circles (`duel_of_circles`) |
| Steppe, up close | Against the Spears (`against_the_spears`) · Blades in the Grass (`blades_in_the_grass`) · Outriders (`outriders`) · Close Volleys (`close_volleys`) |
<!-- presets:end -->

---

## Renderers

Every preset is photographed under **Forward+** and **Compatibility** (OpenGL 3, the web renderer) with zero engine error
lines. No shaders ship: everything is drawn with Godot's 2D drawing calls.

## Licence

Use it in any number of games, commercial or free; edit it freely; no credit required. No resale or redistribution of the
files as a pack, addon, template or preset collection, free or paid. See `LICENSE.txt`.

Every script, preset and scene in this pack was written by an AI, and everything it draws is computed at runtime by that code.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
