# Prompt Keys: 120 Keyboard, Mouse and Gamepad Prompts — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Prompt Keys: 120 Keyboard, Mouse and Gamepad Prompts  
**Engine:** Cross-engine UI/GUI kits generated from ONE theme spec by Kernel/ui/uikit_gen.js: pixel (hard pixels, palette-closed) and HD (SVG via headless Chrome) atlases + per-cell PNGs + atlas.json, exported as a Godot 4 Theme + self-screenshotting demo, Unity .meta spriteBorder + USS, Unreal margin CSV, GameMaker nine-slice JSON, RPG Maker MZ 192x192 Window.png and a Ren'Py gui/ set; PROVEN by Wings/UIKits/Tools/uikit_gate.js (stretch test at five sizes with zero edge drift, native redraw match, the widget x state matrix counted, contrast >= 4.5:1, a headless Godot screenshot the agent then LOOKS at). See Wings/UIKits/CLAUDE.md.  
**Docs published:** 2026-11-27


---

# Prompt Keys: 120 prompts for keyboard, mouse and gamepad

120 prompts in 3 groups (keyboard 74, mouse 10, gamepad (generic) 36), each drawn natively at **16 px and 32 px** in two states, **normal and pressed** (the key sinks, the button darkens), so a prompt can flash a two-frame press. Hard pixels, no anti-aliasing, one 17-colour palette, plus a flat SVG of every frame.

Made by Core Systems Asset Factory. The art is AI-generated (see LICENSE.txt). No console maker's logos, button shapes or colour codes are drawn: face buttons come as a positional diamond (top / right / bottom / left) and as plain lettered discs, and shoulder inputs say L or R.

## What is inside

| Folder | What |
| --- | --- |
| `png/16/<group>/<id>.png` and `<id>_pressed.png` | every prompt at 16 x 16, both states |
| `png/32/<group>/<id>.png` and `<id>_pressed.png` | every prompt at 32 x 32, both states |
| `svg/<group>/` | a flat vector of every frame (the same shapes, one tone per part, legend pixels as squares) |
| `atlas/atlas_16.png`, `atlas/atlas_pressed_16.png` | every prompt on one sheet, 16 columns, 256 x 128; a prompt sits in the SAME cell on both sheets |
| `atlas/atlas_32.png`, `atlas/atlas_pressed_32.png` | every prompt on one sheet, 16 columns, 512 x 256; a prompt sits in the SAME cell on both sheets |
| `atlas/atlas.json` | the index: id, name, group, the PNG and SVG paths of both states and the atlas cell of every prompt at both sizes |
| `palette.json` | the 17 colours every opaque pixel uses (cap, pressed cap, legend ink, the accent that marks the part to press, gamepad grey) |
| `palettes/arena-ticket/` | every prompt recoloured to match Arena Ticket: Monster Battle UI Kit: the four atlases (same layout as `atlas/`) and both MZ IconSet sheets |
| `palettes/casual-pop/` | every prompt recoloured to match Casual Pop: Chunky Bright Game UI Kit: the four atlases (same layout as `atlas/`) and both MZ IconSet sheets |
| `palettes/clean-slate/` | every prompt recoloured to match Clean Slate: Modern Minimal UI Kit: the four atlases (same layout as `atlas/`) and both MZ IconSet sheets |
| `palettes/codex-pages/` | every prompt recoloured to match Codex Pages: Book and Journal UI Kit: the four atlases (same layout as `atlas/`) and both MZ IconSet sheets |
| `palettes/dark-caps/` | Dark caps: dark keys with light legends: the four atlases (same layout as `atlas/`) and both MZ IconSet sheets |
| `palettes/night-terminal/` | every prompt recoloured to match Night Terminal: Sci-Fi HUD UI Kit: the four atlases (same layout as `atlas/`) and both MZ IconSet sheets |
| `palettes/phone-line/` | every prompt recoloured to match Phone Line: Visual Novel Phone and Chat UI Kit: the four atlases (same layout as `atlas/`) and both MZ IconSet sheets |
| `godot/` | a Godot 4 project: the four atlases, one AtlasTexture `.tres` per prompt, size and state, `press_16.tres` and `press_32.tres` (SpriteFrames with one two-frame animation per prompt) and a demo scene |
| `unity/` | the four atlases with `.meta` files: Sprite (Multiple), one named sprite per prompt (`<id>`, `<id>_pressed`), Point filter |
| `unreal/prompt_rects.csv` | name, group, size, state, atlas, pixel rectangle and 0..1 UVs of every frame |
| `gamemaker/strips/<size>/spr_<id>_strip2.png` | each prompt as a two-frame strip (normal, pressed); `gamemaker/prompts.json` lists them with atlas positions |
| `rpgmaker_mz/img/system/IconSet.png`, `IconSet_pressed.png` | RPG Maker MZ IconSet sheets (32 px cells, 16 columns): icon index 1 to 120, the same index on both; index 0 is empty as MZ expects |
| `rpgmaker_mz/iconset_index.csv` | which icon index is which prompt |
| `renpy/game/` | both 32 px atlases and `prompt_keys.rpy`: `image prompt_<id>`, `prompt_<id>_pressed` and a looping `prompt_<id>_press` |

## Two looks and six kit palettes

The master colours are light keys with dark legends. `palettes/dark-caps/` is the same set as dark keys with light legends, and 6 more palettes match CSAF UI kits. Every palette folder holds atlases with exactly the same layout as `atlas/`: swap the PNGs and every prompt takes those colours (in Godot copy all four over the ones in `prompt_keys/`; in Unity replace each atlas PNG and keep its `.meta`; in RPG Maker MZ use the palette's IconSet files).

## How we checked it

Every prompt was looked at, both states, at 32 px and at 16 px (enlarged), and at actual size on a light, a mid and a dark background. Two keyboard clusters (W A S D and the arrow keys in one icon) did not read at 16 px and were left out; build W A S D from the single keys. Our near-duplicate check (a 9 x 8 greyscale outline hash, the strictest one we run) finds 13 of the 120 prompts with no outline twin in the pack; `atlas/atlas.json` marks those `"pairFree": true` and lists each prompt's `outlineTwins`. The others share an outline on purpose: every key is the same keycap and only its legend differs (A and B, F1 and F2), every stick is the same well.

## The prompts

| Group | Prompts | Ids |
| --- | --- | --- |
| Keyboard | 74 | key_a, key_b, key_c, key_d, key_e, key_f, key_g, key_h, key_i, key_j, key_k, key_l, key_m, key_n, key_o, key_p, key_q, key_r, key_s, key_t, key_u, key_v, key_w, key_x, key_y, key_z, key_0, key_1, key_2, key_3, key_4, key_5, key_6, key_7, key_8, key_9, key_f1, key_f2, key_f3, key_f4, key_f5, key_f6, key_f7, key_f8, key_f9, key_f10, key_f11, key_f12, key_arrow_up, key_arrow_down, key_arrow_left, key_arrow_right, key_esc, key_tab, key_ctrl, key_alt, key_del, key_enter, key_shift, key_caps, key_backspace, key_space, key_minus, key_equals, key_bracket_left, key_bracket_right, key_semicolon, key_apostrophe, key_comma, key_period, key_slash, key_backslash, key_backtick, key_blank |
| Mouse | 10 | mouse_left, mouse_right, mouse_middle, mouse_any, mouse_scroll_up, mouse_scroll_down, mouse_scroll, mouse_move, mouse_side_back, mouse_side_forward |
| Gamepad (generic) | 36 | pad_face_north, pad_face_east, pad_face_south, pad_face_west, pad_btn_a, pad_btn_b, pad_btn_x, pad_btn_y, pad_dpad_up, pad_dpad_down, pad_dpad_left, pad_dpad_right, pad_dpad_horizontal, pad_dpad_vertical, pad_dpad_any, pad_stick_l, pad_stick_l_up, pad_stick_l_down, pad_stick_l_left, pad_stick_l_right, pad_stick_l_press, pad_stick_l_any, pad_stick_r, pad_stick_r_up, pad_stick_r_down, pad_stick_r_left, pad_stick_r_right, pad_stick_r_press, pad_stick_r_any, pad_bumper_l, pad_bumper_r, pad_trigger_l, pad_trigger_r, pad_menu, pad_back, pad_home |

## Using the prompts in your engine

Keep pixel art crisp: nearest-neighbour (point) filtering and whole-number scaling (x2, x3, x4). For a press animation, alternate the normal and pressed frame about twice a second.

### Godot 4 (tested in Godot 4.7.2)

1. Copy `godot/prompt_keys/` into your project (keep the folder name, or re-point the `.tres` files).
2. A still prompt: `load("res://prompt_keys/icons_32/key_e.tres")` on a TextureRect, a Button icon or a Sprite2D (`key_e_pressed.tres` for the pressed frame).
3. A pressing prompt: give an AnimatedSprite2D `res://prompt_keys/press_32.tres` as its Sprite Frames and call `play("key_e")`.
4. `godot/demo/` shows every prompt in both states and a row of press animations: open `godot/project.godot` and run it.

### Unity (files for Unity)

Copy an atlas PNG and its `.meta` into `Assets/` together (e.g. `atlas_32.png` + `atlas_pressed_32.png`). Each imports as a Sprite (Multiple) with one sprite per prompt named `<id>` or `<id>_pressed`; Pixels Per Unit is the prompt size. Swap the two sprites on an Image for a press.

### Unreal Engine (files for Unreal)

Import the atlas PNGs as textures (Texture Group: UI, Filter: Nearest, Compression: UserInterface2D), or the single PNGs from `png/32/`. `unreal/prompt_rects.csv` gives every frame's pixel rectangle and UVs for a Slate brush or a material that samples the atlas.

### GameMaker (files for GameMaker)

Import a strip from `gamemaker/strips/32/` as a sprite with "Import Strip Image": the `_strip2` ending tells GameMaker it holds 2 frames (frame 0 normal, frame 1 pressed). `image_speed` then animates the press, or set `image_index` yourself.

### RPG Maker MZ (tested in the RPG Maker MZ runtime)

Back up your project's `img/system/IconSet.png`, then replace it with ours or paste the rows you want into your own. Icon index N is row N / 16, column N % 16; `iconset_index.csv` names all 120. `IconSet_pressed.png` holds the pressed frame at the same index, for a plugin or a picture that swaps the sheet.

### Ren'Py (files for Ren'Py)

Copy the contents of `renpy/game/` into your game folder. Then `add "prompt_key_e"` in a screen, or `add "prompt_key_e_press"` for the looping press. Set `config.nearest_neighbor = True` for crisp scaling.

## Licence

Royalty free in your games, their trailers and store pages; no credit required. Not for resale or redistribution as an icon or prompt pack. Full text: LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
