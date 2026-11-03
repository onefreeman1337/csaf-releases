# Smithereens: 48 2D Breakables for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Smithereens: 48 2D Breakables for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Smithereens - 2D Breakables That Break the Way Their Material Would, for Godot 4

Pots, crates, barrels, rocks, crystals, ice, windows, bushes, sacks and bones that come apart the way their material
would, cut from YOUR sprite at the moment it breaks. A clay pot bursts into curved sherds that skitter; a crate splits
into planks along its grain and throws splinters; a barrel's staves spring apart and its iron hoops drop; a rock cracks on
the first blow and crumbles into angular chunks on the second; a crystal flies apart in glinting facets; an ice block
parts into slabs that skate away and leave meltwater; a pane webs out from the blow and rains down; a bush is cut to a
stub while its leaves flutter down. 48 break styles in 8 materials.

Nothing is a frame animation. Every break is computed at runtime from the sprite being broken: a fracture map built for
its material, pieces cut from the sprite's own pixels (so the pieces always match your art style, at any resolution),
their flight, bounce and slide, and what is left on the ground: dust, glints, splinters, straw, petals, spores, embers,
spilt grain, a pool, a melt puddle. Multi-hit styles draw a crack network over the sprite on every hit before the last,
and the final pieces keep those cracks. Every number is a parameter of a `SmashStyle` resource.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** 48 styles (`styles/<material>/<id>.tres`) with a preview scene each
  (`presets/<material>/<id>.tscn`), in 8 materials of six; six classes (`Breakable2D`, `SmashStyle`,
  `SmashDebris`, `SmashFracture`, `SmashCracks`, and the `Smithereens` catalogue); 47 sample props
  (`props/*.png`, pixel art painted by code, yours to use); a demo with a page per material.
- **No shaders, no GDExtension, no plugin to enable.** Plain GDScript, readable.

## Install

1. Copy `godot/addons/smithereens/` into your project's `addons/` folder (you get `res://addons/smithereens/`).
2. That is all: no plugin to enable. The classes register themselves. Keep the folder name: the styles and preview
   scenes reference `res://addons/smithereens/` by path.

To see everything first, open the `godot/` folder as a project in Godot 4.7 and press Play: click a prop to strike it
(from the side you click), **Space** breaks the whole page in a cascade, **R** restores it, **Left / Right** change
the page (page 0 is all 48 at once).

## Use it

```gdscript
# 1. Make a sprite breakable: a Breakable2D as its child, with a style.
var b := Breakable2D.new()
b.style = Smithereens.style("pot_burst")
$Pot.add_child(b)                       # $Pot is a Sprite2D or an AnimatedSprite2D

# 2. Hit it. The blow lands on the side facing `from`; pieces fly away from it.
b.hit(player.global_position)           # multi-hit styles crack first, the last hit breaks
b.smash()                               # or break it now, whatever hits remain

# 3. Or break any sprite in one call, no node set up beforehand.
Smithereens.break_node($Crate, "crate_planks", player.global_position)

# 4. React.
b.struck.connect(func(taken: int, left: int) -> void: print("hit ", taken, ", ", left, " to go"))
b.broken.connect(func(debris: SmashDebris) -> void: drop_loot(debris.global_position))
```

**Side view or top down.** `b.view = Breakable2D.View.SIDE` (default) drops the pieces on the object's base line, as in a
platformer. `Breakable2D.View.TOP_DOWN` scatters them on the ground around it, as in a top down RPG. The style does not
change; the same `pot_burst` works in both.

**Gathering nodes.** `b.on_break = Breakable2D.OnBreak.HIDE` and `b.regrow_seconds = 30.0`: an ore rock takes its hits,
cracks spreading over its own sprite, breaks, and comes back whole 30 seconds later. `restore()` brings it back yourself.

**What it breaks.** A `Sprite2D` (with or without a texture region, hframes/vframes and flips) or an `AnimatedSprite2D`
(the frame showing when it breaks). The pieces are cut from that exact frame, so any art works: pixel art at 16 px,
painted sprites at 256 px. Transparent pixels are never pieces.

**The debris.** Each break makes one `SmashDebris` node beside the sprite (the sprite's parent, or `debris_parent`), with
the sprite's transform, so it y-sorts and scales with your world. It stays for the style's `debris_seconds`, fades out
over `fade_seconds` and frees itself; with `debris_seconds = 0` the debris stays (a cleared room looks cleared). When more
than `SmashDebris.max_pieces_total` pieces (1600 by default) are on screen, the oldest debris fades early.
`debris.retire()` clears one yourself.

**Changing the look.** `Smithereens.style(id)` returns a private copy; change any property and assign it. Or duplicate a
`.tres` in `styles/` and edit it in the inspector. `Smithereens.ids()` lists every id, `Smithereens.ids_for_material("glass")`
one material. A recolour (`tint`, `dust_color`, `bits_color`, `spill_color`) or a harder blow (`burst`, `lift`) is a
parameter, never a new style.

**Breakable2D properties:** `style`, `target` (defaults to the parent), `view`, `hits_override` (0 = the style's hits),
`on_break` (`FREE`, `HIDE`, `KEEP`), `regrow_seconds`, `debris_parent`, `fracture_seed` (0 = from the node's path, so two
pots side by side never break alike), `shake_target`, `flash_target`. Methods: `hit(from_global, damage)`,
`smash(from_global)`, `crack_to(taken, from_global)` (draw a crack stage without the chips, for loading a saved node),
`restore()`, `is_broken()`, `hits_needed()`, `frame()`. Signals: `struck(hits_taken, hits_left)`, `broken(debris)`,
`restored`.

**SmashStyle properties** (all exported, grouped in the inspector; `material_name` is a free label such as `ceramic`):
- *Fracture:* `fracture` (`SHERDS` curved shards round the blow, `STRIPS` long pieces along the grain, `CHUNKS` angular
  cells, `FACETS` triangles, `SPIDERWEB` spokes and rings, `BRICKS` running bond, `SPLIT` a few long jagged cuts),
  `pieces`, `curve`, `rings`, `grain_angle`, `jag`, `bow`, `cross_breaks`, `stretch`, `impact_bias`, `cuts`, `cut`
  (`NONE`, `STUB` the base stays rooted, `TOPPLE` the top falls whole), `cut_height`, `cut_angle`, `land_break`.
- *Motion:* `burst`, `lift`, `gravity`, `bounce`, `friction`, `spin`, `spin_mode` (`FREE`, `QUARTER` lands square,
  `NONE`), `spread`, `collapse`, `drag`, `flutter`, `melt`.
- *Debris:* `debris_seconds`, `fade_seconds`, `settle_darken`, `shadows`, `inner_glow`, `tint`.
- *Extras:* `dust`, `dust_color`, `dust_size`, `bits` (`LEAVES`, `PETALS`, `SPLINTERS`, `STRAW`, `SPORES`, `SPARKS`,
  `CHIPS`, `SNOW`, `SEEDS`, `DROPLETS`, `HOOPS`, `GLITTER`, `EMBERS`), `bits_amount`, `bits_color`, `spill` (`GRAIN`,
  `LIQUID`, `ASH`, `PUDDLE`), `spill_color`, `spill_size`, `glints`, `glint_color`, `shockwave`, `flash`.
- *Hits:* `hits`, `crack` (`NONE`, `HAIRLINE`, `GRAIN`, `JAGGED`, `FACET`, `SPIDERWEB`), `crack_color`, `crack_glow`,
  `chips_per_hit`, `shake`.

Distances are authored for a 48 px tall sprite and scale with the sprite's height, so the same style reads the same on a
16 px tile and a 128 px prop.

## The 48 styles

**Ceramic**

| id | sample prop | hits | how it breaks |
| --- | --- | --- | --- |
| `pot_burst` | clay pot | 1 | curved sherds burst away from the blow and skitter (sherds) |
| `grain_spill` | grain jar | 1 | the jar splits and its grain pours out in a fan (sherds) |
| `jug_splash` | water jug | 1 | glazed sherds and a splash that spreads into a pool (sherds) |
| `vase_shatter` | vase | 1 | a fine glazed vase into many small spinning sherds (sherds) |
| `urn_ash` | urn | 1 | heavy sherds drop and a cloud of ash rolls out (sherds) |
| `amphora_topple` | amphora | 2 | two blows: the neck snaps, falls and shatters on the floor (topple + sherds) |

**Wood**

| id | sample prop | hits | how it breaks |
| --- | --- | --- | --- |
| `crate_planks` | crate | 1 | planks split along the grain, splinters fly (strips) |
| `barrel_staves` | barrel | 1 | bowed staves spring apart and the iron hoops drop (strips) |
| `log_split` | log | 2 | two axe blows split the log lengthwise into halves (split) |
| `stump_kindling` | stump | 3 | three chops, then kindling: long chunks along the grain (chunks) |
| `signpost_snap` | signpost | 1 | the post snaps on a slant; the board falls and splits (topple + strips) |
| `cargo_blast` | cargo crate | 1 | an explosive hit: a storm of narrow splinters (strips) |

**Stone**

| id | sample prop | hits | how it breaks |
| --- | --- | --- | --- |
| `rock_chunks` | boulder | 2 | angular chunks, heavy, no bounce, a puff of grit (chunks) |
| `boulder_halves` | big boulder | 3 | three blows crack it; it parts into big halves that grind apart (split) |
| `pillar_crumble` | pillar | 1 | the column crumbles where it stands in a cloud of dust (chunks) |
| `ore_vein` | ore rock | 4 | a mining node: four strikes, then ore that glints (chunks) |
| `wall_bricks` | brick wall | 1 | bricks come away in their courses, some still mortared (bricks) |
| `stele_topple` | stele | 2 | the stone snaps, topples and breaks again where it lands (topple + chunks) |

**Crystal**

| id | sample prop | hits | how it breaks |
| --- | --- | --- | --- |
| `crystal_facets` | crystal cluster | 1 | triangular facets fly far, catching the light (facets) |
| `crystal_spire` | crystal spike | 1 | a spire splits into long clean shafts (strips) |
| `emerald_glitter` | emerald cluster | 1 | it bursts into fine pieces that dissolve into glitter (chunks) |
| `prism_split` | prism | 1 | three clean cuts; the prisms slide apart scattering colour (split) |
| `geode_pop` | geode | 1 | the shell bursts and its core glows as it flies (sherds) |
| `resonance_burst` | rose crystal | 3 | three strikes ring it with glowing cracks, then a shockwave (facets) |

**Ice**

| id | sample prop | hits | how it breaks |
| --- | --- | --- | --- |
| `ice_slabs` | ice block | 2 | a few wide slabs that slide far and leave meltwater (chunks) |
| `ice_spike_fall` | ice spike | 1 | the spike snaps, falls and bursts into shards and snow (topple + facets) |
| `frost_shatter` | ice boulder | 1 | a spiderweb burst with a cold puff of frost (spiderweb) |
| `ice_melt` | ice cube | 1 | chunks that shrink away into a spreading puddle (chunks) |
| `snowman_burst` | snowman | 1 | soft clumps and a big burst of snow (chunks) |
| `ice_crack_slide` | ice block | 3 | three blows web it with cracks; panes skate across the floor (spiderweb) |

**Glass**

| id | sample prop | hits | how it breaks |
| --- | --- | --- | --- |
| `pane_spiderweb` | glass pane | 1 | the pane webs out from the blow and rains down (spiderweb) |
| `bottle_smash` | bottle | 1 | curved green shards and a red wine pool (sherds) |
| `window_blowout` | window | 1 | the window blows out in one direction, glinting (spiderweb) |
| `mirror_crack` | mirror | 3 | three blows craze the mirror, then it falls apart in facets (facets) |
| `orb_glass_rain` | glass orb | 1 | the orb bursts into tiny shards that fade as they fall (facets) |
| `lantern_pop` | lantern | 1 | the glass pops, the flame flares out in embers and smoke (sherds) |

**Foliage**

| id | sample prop | hits | how it breaks |
| --- | --- | --- | --- |
| `bush_cut` | bush | 1 | cut to a stub; leafy clumps and leaves flutter down (stub + chunks) |
| `grass_mow` | grass tuft | 1 | mown: the blades fly as clippings, the stubble stays (stub + strips) |
| `flower_petals` | flowers | 1 | cut flowers burst into drifting petals (stub + chunks) |
| `mushroom_pop` | mushroom | 1 | the cap pops off spinning and spores drift up (topple + sherds) |
| `hedge_burst` | hedge | 2 | two blows and the hedge bursts into clumps and leaves (chunks) |
| `hay_scatter` | hay bale | 1 | the bale bursts into hanks of straw that drift down (strips) |

**Sacks, Bones & Gourds**

| id | sample prop | hits | how it breaks |
| --- | --- | --- | --- |
| `sack_tear` | sack | 1 | the sack tears open in a cloud of flour and spilt grain (split) |
| `pumpkin_smash` | pumpkin | 1 | wet chunks, seeds and a splat of pulp (chunks) |
| `bone_clatter` | bone pile | 1 | bones clatter and bounce, landing square (chunks) |
| `skull_crack` | skull | 2 | a crack on the first blow, sherds of bone on the second (sherds) |
| `egg_hatch` | egg | 3 | three taps crack the shell; the top pops off (topple + sherds) |
| `banner_tear` | banner | 1 | the banner tears into strips that drift down like cloth (strips) |


## Good to know

- **Cost.** Breaking one 48 px prop (fracture, cutting and the debris setup, once, at the blow) takes under 8 ms; with 50 breaks in flight at once a frame took under 30 ms on average with vsync off (Godot 4.7.2, Forward+ on Vulkan and Compatibility, an integrated AMD Radeon). Forward+ on the d3d12 driver is slower on the same machine: about 40 ms with the same 50 breaks. Settled debris stops processing and costs only its draw.
- **Cracks belong to the frame they were struck on.** On an AnimatedSprite2D that keeps animating between hits, the crack
  overlay stays where it was drawn. Pause the animation of a breakable, or call `smash()` directly.
- **Not broken in v1:** TileMapLayer cells, Polygon2D, TextureRect and 3D. Put the tile's art on a Sprite2D to break it.
- **Same seed, same break.** A given sprite, style, seed and blow direction always breaks the same way.
- **Renderer note:** everything is drawn with the CanvasItem API (no custom shader); the gate photographed every style
  under Forward+ and Compatibility on Godot 4.7.2 with zero engine errors.

## Licence

See `LICENSE.txt`: use it in any number of games, commercial or free; do not resell or redistribute the files as a
pack. AI-generated (code and the sample props), disclosed on the store page. Copyright Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
