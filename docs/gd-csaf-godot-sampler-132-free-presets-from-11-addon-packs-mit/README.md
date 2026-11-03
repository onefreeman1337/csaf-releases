# Godot 4 Shader and VFX Sampler: 132 Free Presets — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Godot 4 Shader and VFX Sampler: 132 Free Presets  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# CSAF Godot 4 Sampler - 132 free presets from 11 addon packs (MIT)

Eleven free Godot 4 addons in one download: 11 folders, 132 real presets (12 from each pack), every one computed
at runtime by shaders, particles or `_draw()` code, with the parameters exposed so you can recolour and tune it. Each folder is the
free lite of a paid CSAF pack; together the 11 paid packs hold 604 presets. Built by Core Systems Asset Factory.

- **Godot version:** built and tested on **Godot 4.7.2**, under **both renderers: Forward+ and Compatibility**. Older 4.x versions
  were NOT run, so they are not claimed. 2D only.
- **Licence:** every folder carries its own `LICENSE.txt`, MIT. Three demo scenes use tiles from our own paid tilesets so they
  have a town or a dungeon to work on; those tiles are named in that folder's LICENSE.txt and are not MIT (see Licence below).
- **AI:** every shader, scene and script was written by an AI (see each LICENSE.txt).

## Try it

1. Unzip anywhere. Each folder holds a `godot/` folder that is a complete Godot 4.7 project.
2. In the Godot Project Manager press **Import**, pick `<folder>/godot/project.godot`, open it and press **Play**: the demo shows
   every free preset of that pack (the controls are listed in that folder's own `Readme_for_Users.md`).
3. To use one in your game, copy that folder's `godot/addons/<addon>/` into your project's `addons/` folder, as its Readme says.
   Keep the addon folder name: its scenes reference `res://addons/<addon>/` by path. The eleven addons do not depend on each other.

## What is inside

| folder | addon | what it is | free presets | full pack |
| --- | --- | --- | --- | --- |
| `Emberflux_Lite` | `addons/emberflux/` | combat VFX: slashes, bursts, projectiles, auras and status marks | 12 | 120 presets, $9.99: https://csaf.itch.io/emberflux |
| `SigilCore_Godot_Lite` | `addons/sigil_core/` | procedural magic circles and spell seals that cast, hold and break | 12 | 60 presets, $9.99: https://csaf.itch.io/sigil-core-godot |
| `Wrack_Godot_Lite` | `addons/wrack/` | aftermath recipes that burn, ruin, overgrow or flood your own TileMapLayer | 12 | 40 presets, $9.99: https://csaf.itch.io/wrack-godot |
| `Weatherglass_Godot_Lite` | `addons/weatherglass/` | 2D weather and atmosphere shaders: rain, snow, fog, storms | 12 | 48 presets, $9.99: https://csaf.itch.io/weatherglass-godot |
| `Verdigris_Godot_Lite` | `addons/verdigris/` | material ageing shaders: rust, patina, frost, moss and wear on your own sprites | 12 | 48 presets, $9.99: https://csaf.itch.io/verdigris-godot |
| `Tidewater_Godot_Lite` | `addons/tidewater/` | 2D water: top-down bodies, side-on liquids, falls and underwater filters | 12 | 48 presets, $9.99: https://csaf.itch.io/tidewater-godot |
| `Jigsaw_Godot_Lite` | `addons/jigsaw/` | jigsaw puzzles cut from any picture, a one-call minigame | 12 | 48 presets, $9.99: https://csaf.itch.io/jigsaw-godot |
| `Lantern_Godot_Lite` | `addons/lantern/` | 2D lighting: light shapes, living flames, a day clock and darkness layers | 12 | 48 presets, $9.99: https://csaf.itch.io/lantern-godot |
| `Cartography_Godot_Lite` | `addons/cartography/` | a journey map that draws itself as the player explores, PNG export | 12 | 48 presets, $9.99: https://csaf.itch.io/cartography-godot |
| `Fogbank_Godot_Lite` | `addons/fogbank/` | 2D fog of war with walls, vision cones and explored memory | 12 | 48 presets, $9.99: https://csaf.itch.io/fogbank-godot |
| `Smithereens_Godot_Lite` | `addons/smithereens/` | 2D breakables cut from your own sprite, broken the way their material would | 12 | 48 presets, $9.99: https://csaf.itch.io/smithereens-godot |

## The 132 preset ids, by folder

- **Emberflux_Lite** (12): `fire_impact`, `frost_impact`, `fire_slash`, `frost_slash`, `fire_nova`, `frost_nova`, `fire_shockwave`, `frost_shockwave`, `fire_orb`, `frost_orb`, `fire_aura`, `frost_aura`
- **SigilCore_Godot_Lite** (12): `ember_01`, `ember_02`, `ember_03`, `ember_04`, `ember_05`, `ember_06`, `tide_01`, `tide_02`, `tide_03`, `tide_04`, `tide_05`, `tide_06`
- **Wrack_Godot_Lite** (12): `burned_blaze`, `burned_smoulder`, `burned_scorched_fields`, `burned_firestorm`, `overgrown_ivy_creep`, `overgrown_reclaimed`, `overgrown_moss_hollow`, `overgrown_wild_bloom`, `flooded_rain_soaked`, `flooded_shallow`, `flooded_deep`, `flooded_swamp`
- **Weatherglass_Godot_Lite** (12): `drizzle`, `downpour`, `gentle_snow`, `fog_bank`, `dust_motes`, `embers`, `god_rays`, `starfield`, `lightning`, `falling_leaves`, `cherry_petals`, `fireflies`
- **Verdigris_Godot_Lite** (12): `rust_bloom`, `verdigris`, `gilded`, `hoarfrost`, `snow_cap`, `icicles`, `moss`, `ivy`, `mushrooms`, `peeling_paint`, `cracks`, `scorch`
- **Tidewater_Godot_Lite** (12): `lake`, `lagoon`, `lava`, `clear_pool`, `ocean_swell`, `mirror_lake`, `waterfall`, `lavafall`, `drip_ledge`, `shallow_dive`, `deep_dive`, `caustic_floor`
- **Jigsaw_Godot_Lite** (12): `parlour`, `casino`, `schoolhouse`, `scriptorium`, `herbarium`, `crown`, `midnight_club`, `shoji`, `teahouse`, `palace`, `adventurer`, `grimoire`
- **Lantern_Godot_Lite** (12): `cottage_window`, `leaf_dapple`, `door_ajar`, `candle`, `wall_torch`, `street_lamp`, `golden_hour`, `blue_hour`, `moonlit`, `torch_radius`, `fog_of_war`, `lamp_reveal`
- **Cartography_Godot_Lite** (12): `explorers_parchment`, `royal_atlas`, `treasure_map`, `admiralty_chart`, `portolan`, `pirate_chart`, `graph_paper`, `blueprint`, `crypt`, `star_chart`, `dreamscape`, `pixel_overworld`
- **Fogbank_Godot_Lite** (12): `smoke`, `river_mist`, `night_shroud`, `parchment`, `pencil_hatch`, `blueprint`, `square_tiles`, `pixel_dither`, `halftone`, `void_tendrils`, `starfield`, `static`
- **Smithereens_Godot_Lite** (12): `pot_burst`, `grain_spill`, `crate_planks`, `barrel_staves`, `rock_chunks`, `wall_bricks`, `crystal_facets`, `ice_slabs`, `pane_spiderweb`, `bush_cut`, `grass_mow`, `bone_clatter`

## Licence

Each folder is MIT (its own `LICENSE.txt`, copyright Core Systems Asset Factory). Not MIT, and named in that folder's licence:

- `Wrack_Godot_Lite/godot/demo/fixture/` and `Lantern_Godot_Lite/godot/demo/town/`: tiles from Verdant 09 Town, a paid tileset.
- `Fogbank_Godot_Lite/godot/demo/crypt/`: tiles from Verdant 05 Depths, a paid tileset.

You may use those demo tiles inside your own games but not redistribute them as a tileset, asset pack or template. The addons
themselves work on any TileSet, map or sprite of yours.

## More

All CSAF Godot addons: https://csaf.itch.io (collection "Godot Addons"). Follow the studio on itch to hear when a new pack ships.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
