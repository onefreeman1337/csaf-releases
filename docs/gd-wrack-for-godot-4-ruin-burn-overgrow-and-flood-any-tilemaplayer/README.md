# Wrack for Godot 4: 40 Aftermaths for Your Own TileMap — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Wrack for Godot 4: 40 Aftermaths for Your Own TileMap  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Wrack for Godot 4 - Burned, Ruined, Overgrown and Flooded Towns From Your Own TileMapLayer

Wrack turns the town you already built into its aftermath: burned, ruined, overgrown, flooded, abandoned, blighted,
parched or haunted. It does not edit your map and ships no replacement tiles. It swaps each TileMapLayer's TileSet for a
**duplicate** whose tiles carry one shader, and that shader recomputes every pixel of YOUR tiles from what the tile is
(roof, wall, paving, grass...) and noise measured in world pixels, so a burn scar, an ash drift or a flood runs across
tile borders instead of repeating per tile. Smoke, sparks, mist, floating motes and the light spilling out of lit windows
are drawn over the map at runtime. `restore()` puts your own TileSet back.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**
  (Compatibility is the one web exports use). Older 4.x versions were NOT run, so they are not claimed.
- **What is in the box:** the `Wrack` node, the `WrackRecipe` resource, 40 recipes in 8 families, the Wrack shader, the
  role reader `WrackRoles`, the dressing layer `WrackDressing`, and a demo that burns a sample town.
- **Tile sizes:** effects are measured in world pixels and the cell size is read from your TileSet. Tested on a 16 px
  tileset and on a 32 px copy of the same tiles.

## Install

1. Copy `godot/addons/wrack/` into your project's `addons/` folder (you get `res://addons/wrack/`).
2. That is all: no plugin to enable. The classes `Wrack`, `WrackRecipe`, `WrackRoles` and `WrackDressing` register
   themselves.

To see everything first, open the `godot/` folder as a project in Godot 4.7 and press Play.

## Use it

Add a `Wrack` node AFTER your TileMapLayers (same parent is simplest), list the layers in its `layers` property and give
it a recipe. With `apply_on_ready` on (the default) the aftermath is there when the scene starts.

```gdscript
$Wrack.layers = [$Ground, $Buildings]
$Wrack.apply(load("res://addons/wrack/recipes/burned_blaze.tres"))

# play it in: a fire front sweeping across the map, years passing, a fade, or water rising
await $Wrack.transition_to(load("res://addons/wrack/recipes/overgrown_reclaimed.tres"), "years", 4.0)

$Wrack.set_region_rect(Rect2i(10, 4, 6, 5))   # only these cells (map coordinates of the first layer) change
$Wrack.clear_region()
$Wrack.restore()                               # your own TileSet back, dressing removed
```

| member | what it does |
| --- | --- |
| `layers`, `recipe`, `apply_on_ready` | exported: the TileMapLayers to change, the recipe, apply it in `_ready` |
| `apply(recipe)` | applies a recipe at once |
| `transition_to(recipe, mode, duration, from, to)` | plays it in: mode `"fire"` (a burning front from `from` to `to`, in the Wrack node's local pixels; defaults left to right), `"years"` (patches creep in), `"fade"`, `"flood"` (water rises; defaults from the bottom). Await it, or listen for `transition_finished` |
| `set_progress(p)` | shows the aftermath at a fraction 0..1 of its transition, for scrubbing or a still |
| `set_region_cells(cells)`, `set_region_rect(rect)`, `clear_region()` | only those cells change; the dressing follows |
| `restore()` | every layer's own TileSet back; your map was never edited |
| `describe_roles()` | what Wrack thinks your tiles are, counted per role, for checking your tagging |

## Tell Wrack what your tiles are

An aftermath treats a roof like a roof (holes, rafters, moss), a wall like a wall (soot, ivy, a waterline, windows) and
the ground like ground (ash, cracks, floods). Roles: `paving`, `soil`, `grass`, `foliage`, `water`, `wall`, `roof`,
`prop`. Wrack reads each tile's role in this order:

1. a **custom data layer named `wrack_role`** (type String) on your TileSet, set per tile - the best result;
2. a **keyword in the atlas texture's file name** (`roof`, `thatch`, `shingle`, `slate`, `wall`, `brick`, `plaster`,
   `water`, `river`, `tree`, `hedge`, `grass`, `meadow`, `dirt`, `mud`, `sand`, `cobble`, `road`, `stone`, `floor`,
   `prop`, `deco` and more, see `wrack_roles.gd`);
3. the **tile's own colours** (blue = water, green = grass or foliage, anything else = paving or prop).

Roofs and walls cannot be told apart by colour, so tag them (1) or name the texture (2) for the full effect.
**Windows** are found by colour inside wall and roof tiles (blue-dominant glass); lit-window recipes glow there and
throw a pool of light. The demo's fixture (`demo/fixture/hamlet_tiles.tres`) is tagged with `wrack_role`: copy that.

## Recipes

A recipe is a `WrackRecipe` resource (`.tres`). Every field is in the inspector, grouped: Grade (saturation,
brightness, tint) · Burn (char, char_roles, char_patch, char colours, soot, embers) · Roof holes (amount, scale, void,
rim, rim width, rafters) · Cracks (amount, roles, colour) · Drifts (ash/dust/sand amount, roles, colour, scale, crust) ·
Windows and doors (glow, glow colour, boards, board colour, broken) · Growth (ivy, moss, creep, growth colours, bloom,
foliage_dry, foliage_target) · Water (flood, shallow and deep colours, clarity, waterline, silt) · Craters · Veins ·
Dressing (smoke, sparks, mist, motes and their colours). `intensity` scales every amount at once (0 to 1.5) and `seed`
moves every pattern. Duplicate a recipe and change it to make your own; a colour change is a field, not a new recipe.

The 40 recipes, `res://addons/wrack/recipes/<id>.tres`:

- **Burned:** Blaze (`burned_blaze`), Smoulder (`burned_smoulder`), Cold Ash (`burned_cold_ash`), Scorched Fields
  (`burned_scorched_fields`), Firestorm Night (`burned_firestorm`).
- **Ruined:** Siege-Broken (`ruined_siege`), Earthquake (`ruined_quake`), Ancient Ruin (`ruined_ancient`), Bombarded
  (`ruined_bombarded`), Fallen Roofs (`ruined_fallen_roofs`).
- **Overgrown:** Ivy Creep (`overgrown_ivy_creep`), Reclaimed (`overgrown_reclaimed`), Moss Hollow
  (`overgrown_moss_hollow`), Wild Bloom (`overgrown_wild_bloom`), Autumn Wild (`overgrown_autumn_wild`).
- **Flooded:** Rain-Soaked (`flooded_rain_soaked`), Shallow Flood (`flooded_shallow`), Deep Flood (`flooded_deep`),
  Receding Waters (`flooded_receding`), Swamp (`flooded_swamp`).
- **Abandoned:** Dust and Silence (`abandoned_dust`), Boarded Up (`abandoned_boarded`), Ghost Town
  (`abandoned_ghost_town`), Weed-Choked (`abandoned_weed_choked`), Cobweb Dark (`abandoned_cobweb_dark`).
- **Blighted:** Void Veins (`blighted_void_veins`), Rot (`blighted_rot`), Plague Year (`blighted_plague_year`), Crystal
  Blight (`blighted_crystal`), Withered (`blighted_withered`).
- **Parched:** Sand Drifts (`parched_sand_drifts`), Dust Bowl (`parched_dust_bowl`), Volcanic Ashfall
  (`parched_volcanic_ashfall`), Sun-Bleached (`parched_sun_bleached`), Salt Crust (`parched_salt_crust`).
- **Haunted:** Moonlit Dread (`haunted_moonlit_dread`), Last Candles (`haunted_last_candles`), Wraith Fog
  (`haunted_wraith_fog`), Blood Moon (`haunted_blood_moon`), Cursed Ground (`haunted_cursed_ground`).

Each recipe also has a preview scene, `res://demo/presets/<id>.tscn` (the demo town with that recipe; open it, press F6).
`res://demo/untouched.tscn` is the same town with no recipe, the "before" picture.

## Demo controls

Left / Right recipe · Up / Down family · F play it in as a fire sweep · Y as years passing · W as a flood rising · T as a
fade · G only the market square (region) · A whole map again · R restore the town · H hide the help line.

## Notes

- The shader replaces the material of every tile **on the duplicate TileSet** (one ShaderMaterial per atlas source).
  If your tiles already use their own material, the aftermath view does not carry it; `restore()` brings it back.
- Cost is one shader per tile pixel; cracks, veins and salt crust do a little more work per pixel.
- The dressing (smoke, sparks, mist, motes, light pools) is a child of the Wrack node, drawn above the layers it follows.
- Alternative tiles get the shader too, and every animation frame of an animated tile gets its tile's role.

## Demo tiles

`demo/fixture/` holds the 98 tiles of "The High Street", the sample map of Verdant 09 Town (a 16 px tileset by the same
studio, sold separately at https://csaf.itch.io/verdant-09-town), so the demo has a town to burn. See
`demo/fixture/NOTICE.txt`. Wrack itself works on any TileSet.

## Licence and AI disclosure

See `LICENSE.txt`. Use in any number of your games, commercial or free; no resale or redistribution of the files as a
pack. This pack is AI-generated: the shader, scripts, scenes and recipes were written by an AI.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
