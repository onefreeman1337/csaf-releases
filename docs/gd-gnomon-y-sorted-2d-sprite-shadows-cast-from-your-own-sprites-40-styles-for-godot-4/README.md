# Gnomon: 2D Sprite Shadows for Godot 4, 48 Styles — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Gnomon: 2D Sprite Shadows for Godot 4, 48 Styles  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Gnomon - 48 Y-Sorted 2D Sprite Shadow Styles for Godot 4

Gnomon is a Godot 4.7 addon that gives every 2D sprite a shadow cast from its own pixels. It contains 48 shadow styles
(six families of eight), three nodes (GnomonLayer, GnomonCaster2D, GnomonReceiver2D) and four shaders,
written in plain GDScript and Godot shading language. Shadows follow a sun angle, an hour of the day or the lights in your
scene, stop at a set length, never darken where they overlap, and sort with your y-sorted world. It works with Sprite2D,
AnimatedSprite2D (every frame) and TileMapLayer, under the Forward+ and Compatibility renderers.
Licence: use in any number of games; see LICENSE.txt. A free 12-style lite (MIT) ships alongside it.

## Install

1. Copy `addons/gnomon/` into your project's `addons/` folder. There is no plugin to enable; the three node types appear
   in the Add Node dialog (search "Gnomon").
2. Optional: open `demo/demo.tscn` in this folder's project to see every style (LEFT / RIGHT to change style).

Tested on Godot **4.7.2** (Forward+ on Vulkan, Compatibility on OpenGL 3.3, and Mobile). Older 4.x versions were not run.

## Quick start

```
Level (Node2D)
  Ground            TileMapLayer or Sprite2D: receives shadows
  GnomonLayer       draws all shadows, once, between the ground and your sprites
  YSort             Node2D with y_sort_enabled
    Player          Sprite2D or AnimatedSprite2D
      GnomonCaster2D
    Tree            Sprite2D
      GnomonCaster2D
    Wall            Sprite2D
      GnomonCaster2D
      GnomonReceiver2D   also darkened by casters standing IN FRONT of it
    Fence           TileMapLayer
      GnomonCaster2D     every used tile casts (or only tiles whose custom data names it)
```

Then pick a look: select the GnomonLayer and drag a style from `res://addons/gnomon/styles/` onto its **Style**, or in
code: `$GnomonLayer.style = GnomonCatalog.load_style("long_evening")`.

Sprites are measured from the bottom of their frame: the feet are the bottom edge. If your sprite has empty rows under
the feet, raise **Foot Offset** on its caster.

## How it works (and why it does not stack)

Each caster draws its silhouette (the current frame, flips included) into one mask in a SubViewport: coverage, how far
along the shadow each pixel is, the caster's strength and its screen depth. Where shadows overlap, the mask keeps the one
in front, so two overlapping shadows are exactly as dark as one. The GnomonLayer then draws the mask once over the ground
in the style's look. A GnomonReceiver2D draws a shaded copy of its sprite's frame over it, but only where the shadow
belongs to a caster lower on the screen than the receiver: a shadow climbs the wall behind its caster, never the sprite in
front of it.

## Nodes and parameters

**GnomonLayer** (Node2D): `style` (GnomonStyle) · Sun: `override_sun` (use the values below instead of the style's own),
`sun_angle` (degrees the shadow falls: 0 up the screen, 90 right, -90 left, 180 down), `sun_length` (fraction of each
caster's height), `use_time_of_day` + `hour` (5 to 19: long to the left at dawn, short at noon, long to the right at dusk) ·
Lights: `light_mode` (SUN or LIGHTS; LIGHTS casts away from every Node2D in the group `gnomon_lights`, reading a
PointLight2D's `enabled` and `energy`), `light_range`, `light_height` (shadows lengthen as a caster walks away),
`max_lights_per_caster` (1 to 4) · Quality: `mask_scale` (0.25 to 1; the mask's resolution relative to the screen).
Methods: `refresh_now()`, `style_changed()` (after editing a style's values from code), `sun()`.

**GnomonCaster2D** (Node2D, child of a Sprite2D, AnimatedSprite2D or TileMapLayer): `layer_path` (empty = the first
GnomonLayer), `foot_offset`, `height` (pixels off the ground right now: the shadow stays down, shrinks and fades; set it
from your jump code), `height_falloff`, `intensity` (0 to 1), `blob_scale`, `tile_custom_data` (TileMapLayer only: a
bool custom data layer naming the tiles that cast; empty = all). Method: `refresh_tiles()`.

**GnomonReceiver2D** (Node2D, child of a Sprite2D or AnimatedSprite2D): `layer_path`, `foot_offset`. It never changes the
parent's own material.

**GnomonStyle** (Resource), every value exported: `shape` (CAST, BLOB, RING, BLOB_AND_CAST, DROP), `length`, `angle`,
`thickness`, `width_scale`, `blob_size`, `blob_strength`, `drop_offset` · `color`, `tip_color`, `opacity`, `fade`,
`contact`, `density`, `softness`, `hardening`, `pattern` (SOLID, BAYER_2, BAYER_4, BAYER_8, HATCH, CROSSHATCH, HALFTONE, STIPPLE, WOODCUT, BANDS, SCRIBBLE),
`pattern_scale`, `pattern_angle`, `pixel_size`, `outline`, `outline_color`, `outline_width`, `core`, `wobble`, `dapple`, `dapple_scale`.

**GnomonCatalog**: `ids()`, `ids_in(family)`, `path_of(id)`, `load_style(id)`.

## The 48 styles

Styles marked in the light family are made for LIGHTS mode; every style works under the sun too.

**Sun** (naturalistic casts from the sun: soft, hard, long, short, tinted)

| id | style | what it looks like |
| --- | --- | --- |
| `afternoon` | Afternoon | a soft violet cast up and to the left, sharp at the feet |
| `long_evening` | Long Evening | a long low-sun cast to the right that fades and warms toward its tip |
| `high_noon` | High Noon | a short crisp cast straight up over a dark contact blob |
| `morning_mist` | Morning Mist | a long cool blue cast to the left, blurred and fading into mist |
| `hard_sun` | Hard Sun | a razor-edged near-black cast with a darker contact at the feet |
| `overcast` | Overcast | a wide, very soft short shadow pooled around the feet |
| `penumbra` | Soft Penumbra | contact hardening: sharp where the sprite meets the ground, soft at the far end |
| `moonlight` | Moonlight | a deep blue cast falling toward the viewer |

**Pixel art** (snapped, dithered and posterised shadows that sit on a pixel grid)

| id | style | what it looks like |
| --- | --- | --- |
| `pixel_crisp` | Pixel Crisp | a flat cast snapped to the 2 px art grid |
| `bayer_fade` | Bayer Fade | a 4x4 ordered dither whose density falls off along the shadow |
| `checker` | Checkerboard | a 50% checker shadow, the classic 8-bit transparency |
| `ordered_soft` | Ordered Soft | a blurred cast quantised by an 8x8 dither into a pixel gradient |
| `pixel_blob` | Pixel Blob | a chunky stepped oval under the feet |
| `posterised` | Posterised | a soft cast stepped into three flat tones |
| `one_bit` | 1-Bit Stipple | hard black speckles that thin out toward the tip |
| `pixel_outline` | Pixel Outline | a faint fill ringed by a 2 px dark contour on the grid |

**Ink and print** (hatched, halftoned, inked and brushed shadows for illustrated games)

| id | style | what it looks like |
| --- | --- | --- |
| `hatched` | Hatched | diagonal pen hatching that thins toward the tip |
| `crosshatch` | Crosshatch | two layers of hatching, crossed where the shadow is deepest |
| `halftone` | Halftone | print dots that shrink along the shadow |
| `ink_contour` | Ink Contour | a black inked outline around a pale wash |
| `ink_brush` | Ink Brush | a dense brush-stroke shadow with a wobbling edge |
| `comic` | Comic Two-Tone | a dark core inside a lighter band, inked around the edge |
| `woodcut` | Woodcut | wavy carved lines that swell where the shadow is dark |
| `pencil` | Pencil Scribble | loose graphite strokes with uneven pressure |

**Contact** (blobs, rings and drops under the feet, for top-down RPGs and side views)

| id | style | what it looks like |
| --- | --- | --- |
| `soft_blob` | Soft Blob | a soft dark oval under every foot, the top-down RPG staple |
| `crisp_oval` | Crisp Oval | a flat hard-edged oval |
| `contact_ring` | Contact Ring | a dark ring on the ground around the feet |
| `rune_ring` | Selection Ring | a bright cyan ring under each sprite, a shadow that reads as a selection marker |
| `blob_and_cast` | Blob and Cast | a contact blob plus a short soft cast |
| `dither_blob` | Dithered Blob | a wide oval dissolved into a 4x4 dither at its edge |
| `offset_drop` | Offset Drop | the classic drop shadow: an offset copy, y-sorted and never stacking |
| `retro_drop` | Retro Drop | a pixel-snapped violet drop to the lower left |

**Light driven** (shadows thrown away from campfires, lamps and torches (LIGHTS mode))

| id | style | what it looks like |
| --- | --- | --- |
| `campfire` | Campfire | soft warm-edged shadows radiating away from a fire |
| `two_lamps` | Two Lamps | every sprite throws two shadows, one from each lamp |
| `torchlight` | Torchlight | long hard shadows from a torch at the left edge |
| `fire_dither` | Firelight Dither | fire shadows quantised into a pixel dither |
| `lamplit_ink` | Lamplit Ink | two lamps, both shadows hatched in ink |
| `torch_halftone` | Torch Halftone | torch shadows printed as fading dots |
| `fire_contour` | Firelit Contour | fire shadows drawn as a warm contour over a thin wash |
| `lamplit_pixel` | Lamplit Pixel | two lamp shadows snapped to 3 px blocks |

**Stylised** (coloured, dappled, haunted and painterly shadows)

| id | style | what it looks like |
| --- | --- | --- |
| `canopy` | Under the Canopy | shadows broken by drifting patches of light, as under leaves |
| `violet_dusk` | Violet Dusk | a saturated purple cast that blushes pink at its tip |
| `watercolour` | Watercolour | a bled, wobbly blue wash with a darker pooled edge |
| `neon` | Neon | a deep indigo shadow edged in hot magenta |
| `sepia` | Sepia Stain | a brown three-tone stain, like an old print |
| `frost` | Cold Shadow | an icy blue shadow, darkest at the feet |
| `blood_moon` | Blood Moon | a crimson pixel cast falling toward the viewer |
| `sunset_haze` | Sunset Haze | a very long faint orange haze stretched to the left |

## Renderers and limits

- Forward+, Mobile and Compatibility (web) draw the same shadows; every style was photographed under Forward+ and
  Compatibility from the shipped files.
- Put the GnomonLayer in the same canvas as your sprites (not inside a CanvasLayer). One layer per level.
- Receivers are sprites. A TileMapLayer can cast but not receive.
- Screen depth is stored in 8 bits: two sprites whose feet are closer than about 1/255 of the screen height sort as one.
- Rotated casters cast as if upright.
- Cost: one extra 2D pass at screen resolution for the mask, plus one small node per caster (one per tile for a
  TileMapLayer caster). Lower `mask_scale` on big screens.

## Credits

AI-generated: every script, shader and demo sprite in this pack was written by an AI. Copyright (c) 2026 Core Systems Asset
Factory. See LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
