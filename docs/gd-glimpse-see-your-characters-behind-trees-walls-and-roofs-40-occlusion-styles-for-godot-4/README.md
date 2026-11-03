# Glimpse: See Behind Trees, Walls and Roofs in Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Glimpse: See Behind Trees, Walls and Roofs in Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Glimpse - 48 Occlusion Styles for Godot 4: See Characters Behind Trees, Walls and Roofs

Glimpse is a Godot 4.7 addon for top-down and 3/4-view 2D games. When a character walks behind a tree, a wall or a roof,
the thing in front of it opens (a window, a dissolving pattern, or the whole object turning to glass, a wireframe or
paper) and the part of the character that is still covered is drawn through it as a silhouette. A character standing in
FRONT of the same tree changes nothing. It contains 48 styles (six families of eight), three nodes (GlimpseLayer,
GlimpseOccluder2D, GlimpseWatcher2D), a style resource and three shaders plus one shader include, all plain GDScript and
Godot shading language. Occluders can be a Sprite2D, an AnimatedSprite2D or a TileMapLayer (every tile is its own
occluder, y-sort aware); characters can be a Sprite2D or an AnimatedSprite2D (every frame, flips included). It runs under
the Forward+ and Compatibility renderers.
Licence: use in any number of games; see LICENSE.txt. A free 12-style lite (MIT) ships alongside it.

## Install

1. Copy `addons/glimpse/` into your project's `addons/` folder and keep it at `res://addons/glimpse/` (the style files
   point there). There is no plugin to enable; the node types appear in the Add Node dialog (search "Glimpse").
2. Optional: open this folder's project and run `demo/demo.tscn`: WASD walks the red hero, Q / E change style, 1 to
   6 jump to a family, Space turns Glimpse off to compare, F makes the villagers wander.

Tested on Godot **4.7.2** (Forward+ and Compatibility, every style photographed under both from the shipped files).
Older 4.x versions were not run.

## Quick start

```
Level (Node2D)
  Ground              TileMapLayer or Sprite2D
  YSort               Node2D with y_sort_enabled
    Player            Sprite2D or AnimatedSprite2D
      GlimpseWatcher2D
    Villager          AnimatedSprite2D
      GlimpseWatcher2D
    Tree              Sprite2D
      GlimpseOccluder2D
    Walls             TileMapLayer (y_sort_enabled)
      GlimpseOccluder2D      every used tile is an occluder (or only tiles whose custom data names it)
    Roof              Sprite2D
      GlimpseOccluder2D      trigger = INSIDE: opens while someone stands inside its footprint
  GlimpseLayer        one per level, anywhere in the tree
```

Then pick a look: select the GlimpseLayer and drag a style from `res://addons/glimpse/styles/` onto its **Style**, or in
code: `$GlimpseLayer.style = GlimpseCatalog.load_style("leaf_part")`.

"Behind" is Godot's own y-sort rule: a character whose y position is above (smaller than) an occluder's y position, and
whose sprite overlaps it, is behind it. For art whose feet are not at the node's origin, set **Depth Offset** on the
occluder or the watcher.

## How it works

Each frame the GlimpseLayer draws every occluder (each tile separately) and every watched character into one depth mask
in a SubViewport: coverage, a 16-bit screen depth and how open each object is. Where things overlap, the mask keeps the
one in front. The occluder's material (one shared material, so occluders still batch) reads the mask: where the frontmost
occluder stands in front of a watched character, it opens around that character in the style's shape and pattern, or, in
whole-object styles, the entire object changes while it covers someone. Each watcher draws a copy of its current frame
above the level that shows only where an occluder in front of it is still shut, so a half-open window shows half the
character and half the silhouette, and two characters behind one tree each keep their own silhouette in depth order.
Windows fade in and out over the style's `fade_time`. Up to 8 watched characters open windows at once (more still hide
and still block, they just do not open anything).

## Nodes and parameters

**GlimpseLayer** (Node2D): `style` (GlimpseStyle) · `enabled` (off = everything draws as before, instantly) ·
`mask_scale` (0.25 to 1; the mask's resolution relative to the screen) · `overlay_z` (absolute z index of the
silhouettes, default 4000) · `time_scale` (speed of animated edges). Methods: `refresh_now()`, `settle_now()` (every
window jumps to its final state this frame), `freeze_time(seconds)` (stop animated edges; negative to run),
`style_changed()` (after editing a style's values from code), `depth_of(world_position)`.

**GlimpseOccluder2D** (Node2D, child of a Sprite2D, AnimatedSprite2D or TileMapLayer): `layer_path` (empty = the first
GlimpseLayer) · `trigger` (BEHIND, or INSIDE for roofs) · `inside_rect` (INSIDE footprint in the parent's local space;
empty = the parent's whole rect) · `always_in_front` (for a roof drawn on its own top layer, outside the y-sort) ·
`depth_offset` · `tile_custom_data` (TileMapLayer only: a bool custom data layer naming the tiles that occlude; empty =
all) · `keep_parent_material` (the parent keeps its own material and never opens, but still hides characters). The
parent's material is replaced by the layer's reveal material and put back when the node leaves the tree. Method:
`refresh_tiles()`.

**GlimpseWatcher2D** (Node2D, child of a Sprite2D or AnimatedSprite2D): `layer_path` · `reveal` (off: opens nothing and
draws no silhouette, but still counts as a body, so silhouettes of characters behind it are not drawn over it) ·
`team_color` (used by styles with `team_colors`) · `depth_offset` · `hole_scale` and `hole_offset` (this character's
window size and centre).

**GlimpseStyle** (Resource), every value exported: Reveal: `scope` (HOLE, WHOLE, NONE), `shape` (CIRCLE, KEYHOLE,
SQUARE, DIAMOND, CAPSULE, PETALS, WINDOW, STAR), `radius`, `aspect`, `softness`, `edge_noise`, `noise_cell`, `jag`, `jag_points`, `flow`, `pattern` (NONE, BAYER,
CHECKER, LINES_H, LINES_V, HALFTONE, STIPPLE, HEX, RINGS, DIAGONAL), `pattern_scale`, `fill`, `min_alpha`, `pixel_size` · Edge: `rim_width`,
`rim_color`, `rim_glow`, `darken`, `darken_reach` · Whole object: `tint`, `tint_amount`, `wire`, `grid`, `sketch`, `burn`, `sheen` · Silhouette:
`silhouette` (OFF, SOLID, OUTLINE, PIXEL_OUTLINE, GLOW, SCANLINES, HATCH, GHOST, DOTS), `sil_color`, `sil_alpha`, `sil_line_color`,
`sil_width`, `sil_scale`, `team_colors` · Timing: `fade_time`.

**GlimpseCatalog**: `ids()`, `ids_in(family)`, `path_of(id)`, `load_style(id)`.

## The 48 styles

**Cutouts** (a clean window opens through the tree, wall or roof around each hidden character)

| id | style | what it looks like |
| --- | --- | --- |
| `soft_circle` | Soft Circle | a soft round window that fades in at its edge |
| `pixel_circle` | Pixel Circle | a hard round window on a 4 px grid, ringed in ink |
| `keyhole` | Keyhole | a keyhole-shaped window with a gold rim |
| `diamond` | Diamond | a pixel-stepped diamond window with a pale rim |
| `capsule` | Capsule | a tall narrow window hugging the body, with a cyan glow |
| `wide_window` | Wide Window | a large soft window that opens most of the occluder |
| `porthole` | Porthole | a round window in a thick brass ring |
| `arched_window` | Arched Window | an arched window with a transom, a sill and a wooden frame |

**Dither and print** (the occluder dissolves in a pattern: Bayer, checker, halftone, blinds, stipple, hex)

| id | style | what it looks like |
| --- | --- | --- |
| `bayer_fade` | Bayer Fade | a wide window that dissolves into a 4x4 ordered dither toward its edge |
| `checker_veil` | Checker Veil | the whole occluder turns into a 50% checkerboard |
| `halftone` | Halftone | print dots that grow toward the character |
| `blinds` | Venetian Blinds | horizontal slats open in a square around the character |
| `slats` | Slats | the whole occluder opens in vertical slats |
| `stipple` | 1-Bit Stipple | a random 1-bit dissolve that thins toward the edge |
| `honeycomb` | Honeycomb | hex cells open around the character, leaving a honeycomb |
| `crt` | CRT Scanlines | the whole occluder turns into tinted scanlines |

**Whole object** (the whole occluding object turns to glass, a wireframe, a blueprint or paper)

| id | style | what it looks like |
| --- | --- | --- |
| `ghost_fade` | Ghost Fade | the whole occluder fades to a faint ghost |
| `glass` | Glass | the occluder turns to pale cyan glass with diagonal glints and bright edges |
| `wireframe` | Wireframe | only the occluder's own outline stays, in bright green |
| `blueprint` | Blueprint | the occluder becomes a blue drawing with a grid, and the hidden figures are drawn on it in white |
| `blackout` | Blackout | the occluder turns to a black cut-out and the hidden figure is outlined in white |
| `shadow_puppet` | Shadow Puppet | the occluder lights up like paper and the character is a dark shadow behind it |
| `sketch` | Pen Sketch | the occluder is redrawn as loose pen hatching you can see through |
| `burn` | Burn Away | the occluder burns away in speckles with glowing edges |

**Organic edges** (leaves part, ink bleeds, smoke curls, frost and paper tear around the window)

| id | style | what it looks like |
| --- | --- | --- |
| `leaf_part` | Leaf Part | the leaves part in a jagged window with a dark inner edge |
| `ink_bleed` | Ink Bleed | a blot-shaped window edged in black ink |
| `smoke` | Smoke | a window that curls open like smoke, with a pale haze |
| `frost` | Frost Window | a window rimmed with icy crystals |
| `torn_paper` | Torn Paper | a torn-out window with a pale paper edge |
| `ripple` | Ripple | a window of open rings, like ripples on water |
| `petals` | Petals | a five-petal flower window with a pink rim |
| `cloud` | Cloud | a billowing window with a soft white glow |

**Silhouettes** (the occluder stays solid and the hidden character is drawn through it)

| id | style | what it looks like |
| --- | --- | --- |
| `xray` | X-Ray | a flat bright cyan silhouette through the occluder |
| `outline` | Outline | a gold outline around the hidden body over a faint fill |
| `glow` | Glow | a magenta glow that spills out around the hidden body |
| `hologram` | Hologram | green scanlines with a bright edge, like a hologram |
| `hatched` | Hatched | the hidden body drawn in white pen hatching |
| `ghost` | Ghost | the character's own colours, faded and cooled, seen through the occluder |
| `team_colours` | Team Colours | every character in its own team colour |
| `pixel_outline` | Pixel Outline | a deep navy fill with a crisp one-pixel white outline, the classic RPG look |

**Combined** (a window and a silhouette designed together: spotlight, lens, neon, comic, night vision)

| id | style | what it looks like |
| --- | --- | --- |
| `spotlight` | Spotlight | a soft window inside a dark pool cast on the occluder |
| `lens` | Magnifier | a round lens in a dark frame, the rest of the body outlined in white |
| `neon` | Neon | a window in a hot magenta neon ring, the body glowing cyan |
| `comic` | Comic Burst | a star-burst window inked in thick black |
| `rune_ring` | Rune Ring | a gold ringed window in a darkened band, the body outlined in gold |
| `night_vision` | Night Vision | the occluder turns to green scanlines and the body to a bright phosphor ghost |
| `stealth` | Stealth | the hidden body shown as a field of pale dots |
| `ember` | Ember Hole | a ragged window whose edge glows like burning paper |

## Renderers and limits

- Forward+ and Compatibility (web) draw the same windows and silhouettes; every style was photographed under both from
  the shipped files.
- Put the GlimpseLayer in the same canvas as your level (not inside a CanvasLayer). One layer per level.
- An occluder's own material is replaced while Glimpse runs (set `keep_parent_material` to keep yours).
- Occluders that overlap each other: the window follows the frontmost one at each pixel.
- Up to 8 watched characters open windows at once.
- Cost: one extra 2D pass at screen resolution for the mask, one small node per occluder (one per visible tile for a
  TileMapLayer occluder) and one silhouette copy per watched character. Lower `mask_scale` on big screens.

## Credits

AI-generated: every script, shader and demo sprite in this pack was written by an AI. Copyright (c) 2026 Core Systems Asset
Factory. See LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
