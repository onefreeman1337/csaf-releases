# UI Glyphs: 412 Pixel Game Icons for Godot and RPG Maker — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** UI Glyphs: 412 Pixel Game Icons for Godot and RPG Maker  
**Engine:** Cross-engine UI/GUI kits generated from ONE theme spec by Kernel/ui/uikit_gen.js: pixel (hard pixels, palette-closed) and HD (SVG via headless Chrome) atlases + per-cell PNGs + atlas.json, exported as a Godot 4 Theme + self-screenshotting demo, Unity .meta spriteBorder + USS, Unreal margin CSV, GameMaker nine-slice JSON, RPG Maker MZ 192x192 Window.png and a Ren'Py gui/ set; PROVEN by Wings/UIKits/Tools/uikit_gate.js (stretch test at five sizes with zero edge drift, native redraw match, the widget x state matrix counted, contrast >= 4.5:1, a headless Godot screenshot the agent then LOOKS at). See Wings/UIKits/CLAUDE.md.  
**Store page:** https://csaf.itch.io/ui-glyphs-pixel-game-icons  
**Docs published:** 2026-11-20


---

# UI Glyphs: 412 pixel game icons

412 icons in 21 categories, each drawn natively at **16 px and 32 px** (hard pixels, no scaling, no anti-aliasing) plus a flat **SVG** of the same shapes. One style and one 26-colour palette across the whole pack: a 1 px dark outline, a light top-left edge and a dark bottom-right edge.

Made by Core Systems Asset Factory. The art is AI-generated (see LICENSE.txt).

## What is inside

| Folder | What |
| --- | --- |
| `png/16/<category>/<id>.png` | 412 icons at 16 x 16 |
| `png/32/<category>/<id>.png` | 412 icons at 32 x 32 |
| `svg/<category>/<id>.svg` | 412 flat vector versions (the same shapes, one tone per part, detail pixels as squares) |
| `atlas/atlas_16.png` | every icon on one sheet, 16 columns, 256 x 416 |
| `atlas/atlas_32.png` | every icon on one sheet, 16 columns, 512 x 832 |
| `atlas/atlas.json` | the index: id, name, category, the PNG and SVG paths and the atlas rectangle of every icon at both sizes |
| `palette.json` | the 26 colours every opaque pixel uses |
| `palettes/arena-ticket/` | every icon recoloured to match Arena Ticket: Monster Battle UI Kit: `atlas_16.png`, `atlas_32.png` (same layout as `atlas/`) and an MZ `IconSet.png` |
| `palettes/casual-pop/` | every icon recoloured to match Casual Pop: Chunky Bright Game UI Kit: `atlas_16.png`, `atlas_32.png` (same layout as `atlas/`) and an MZ `IconSet.png` |
| `palettes/clean-slate/` | every icon recoloured to match Clean Slate: Modern Minimal UI Kit: `atlas_16.png`, `atlas_32.png` (same layout as `atlas/`) and an MZ `IconSet.png` |
| `palettes/codex-pages/` | every icon recoloured to match Codex Pages: Book and Journal UI Kit: `atlas_16.png`, `atlas_32.png` (same layout as `atlas/`) and an MZ `IconSet.png` |
| `palettes/night-terminal/` | every icon recoloured to match Night Terminal: Sci-Fi HUD UI Kit: `atlas_16.png`, `atlas_32.png` (same layout as `atlas/`) and an MZ `IconSet.png` |
| `palettes/phone-line/` | every icon recoloured to match Phone Line: Visual Novel Phone and Chat UI Kit: `atlas_16.png`, `atlas_32.png` (same layout as `atlas/`) and an MZ `IconSet.png` |
| `godot/` | a Godot 4 project: both atlases, one AtlasTexture `.tres` per icon per size, and a demo scene that shows every icon |
| `unity/` | both atlases with `.meta` files: Sprite (Multiple), one named sprite per icon, Point filter |
| `unreal/icon_rects.csv` | name, category, size, pixel rectangle and 0..1 UVs of every icon on each atlas |
| `gamemaker/icons.json` | every icon's PNG paths and atlas positions, with a suggested sprite name |
| `rpgmaker_mz/img/system/IconSet.png` | an RPG Maker MZ IconSet (32 px cells, 16 columns): icon index 1 to 412; index 0 is left empty as MZ expects |
| `rpgmaker_mz/iconset_index.csv` | which icon index is which icon |
| `renpy/game/` | the 32 px atlas and `ui_glyphs_icons.rpy`: one `image icon_<id>` per icon |

## Kit palettes

Besides the master colours, the whole set comes in 6 palettes that match CSAF UI kits. Each palette folder holds atlases with exactly the same layout as `atlas/`, so you swap the PNGs and every icon takes the kit's colours: in Godot, copy the palette's `atlas_16.png` AND `atlas_32.png` over the two in `ui_glyphs/` (swap only one and that size alone changes); in Unity, replace each atlas texture's PNG and keep its `.meta`; in RPG Maker MZ, use the palette's `IconSet.png`. Icons keep their meaning colours: a heart stays red, in that kit's red.

## Categories

| Category | Icons | Ids |
| --- | --- | --- |
| Achievements and rank | 14 | trophy, medal, rosette, crown, reward_chest, podium, rocket, streak_flame, rank_one, three_stars, certificate, hex_badge, rank_chevrons, finish_flag |
| Arrows and navigation | 22 | arrow_up, arrow_right, arrow_down, arrow_left, chevron_up, chevron_right, chevron_down, chevron_left, undo, redo, rotate_clockwise, fullscreen, exit_fullscreen, move_cross, zoom_in, resize_diagonal, sort, filter_funnel, swap, exit_door, enter_door, external_link |
| Buildings and places | 15 | tower, windmill, barn, well, lighthouse, cabin, ruins, city_gate, tavern_sign, chapel, arena, torii_gate, pagoda, tombstone, mine_entrance |
| Crafting and tools | 18 | anvil, wrench, pickaxe, saw, needle_thread, cauldron, mortar_pestle, scissors, paintbrush, paint_palette, pencil, ruler, fishing_rod, sickle, shovel, bucket, claw_hammer, bricks |
| Creatures | 22 | slime, bat, spider, snake, bird, frog, ladybug, butterfly, owl, crab, octopus, bee, snail, turtle, rabbit, cat_face, field_mouse, dragon_head, wolf_head, scorpion, pig_face, mimic |
| Devices and input | 17 | gamepad, keyboard, mouse, touch_tap, monitor, smartphone, tablet, joystick, photo_camera, wifi, battery, signal_bars, disc, plug, usb_stick, game_cartridge, vr_headset |
| Editing | 14 | eraser, copy, clipboard, grid, layers, crop, printer, text_tool, pushpin, sliders, image, document, history, code |
| Equipment | 24 | sword, dagger, axe, spear, bow, boomerang, quiver, staff, wand, shield_round, shield_kite, helmet, chestplate, boots, gloves, warhammer, mace, cloak, belt, crossbow, scythe, trident, shuriken, flail |
| Food | 22 | apple, bread, cheese, drumstick, fish, carrot, cake_slice, tankard, candy, cookie, rice_ball, cherries, grapes, pizza_slice, fried_egg, watermelon, banana, honey_jar, soup_bowl, burger, donut, strawberry |
| Interface and data | 19 | bar_chart, pie_chart, line_graph, toggle_on, checkbox_on, radio_on, more_dots, list_bullets, contrast, cursor_arrow, hand_pointer, loading_spinner, qr_code, barcode, shield_check, alarm_clock, hashtag, u_turn, skip_forward |
| Items | 31 | backpack, pouch, treasure_chest, potion_health, potion_mana, potion_stamina, elixir, scroll, spell_book, treasure_map, coins, coin_stack, gem, ring, amulet, bomb, torch, lantern, crystal, spyglass, war_horn, harp, drum, rune_stone, wax_seal, rope_coil, barrel, crate, chain, quill_ink, chalice |
| Media and audio | 22 | play, pause, stop, record, next_track, previous_track, fast_forward, rewind, repeat, shuffle, eject, volume_mute, volume_low, volume_high, music_note, music_notes, microphone, headphones, video_camera, film_strip, clapperboard, radio |
| Misc | 17 | dice, playing_cards, puzzle_piece, lightbulb, magnet, balloons, glasses, wizard_hat, mask, candle, crystal_ball, ghost, chess_knight, robot_head, heart_broken, atom, infinity |
| Nature | 17 | oak_tree, flower, mushroom, rock, wave, sprout, bone, egg, seashell, cactus, wood_log, ore_chunk, herb, paw_print, volcano, palm_tree, acorn |
| Quest and map | 21 | marker_exclaim, marker_question, flag, map_pin, compass, castle, cave, dungeon_stairs, portal, waypoint, campfire, signpost, mountain, pine_tree, boat, bridge, tent, anchor, x_marks_spot, boss_skull, skull_flag |
| Shop and economy | 17 | cart, price_tag, wallet, receipt, sale_percent, gift, ticket, bank, scales, gavel, piggy_bank, credit_card, gold_bars, shop_stall, banknote, shopping_basket, safe_vault |
| Social | 18 | chat_bubble, chat_typing, chat_group, phone_call, user, users, user_add, bookmark, thumbs_up, thumbs_down, share, link, globe, at_sign, emote_happy, megaphone, send, emote_cool |
| Stats and combat | 19 | heart_full, heart_half, heart_empty, mana_drop, stamina_bolt, xp_star, attack_slash, critical_target, level_up, skull, magic_sparkle, strength_dumbbell, agility_feather, heal_cross, hit_burst, luck_clover, stealth_eye_closed, intellect_brain, speed_wing |
| Status effects | 18 | poisoned, burning, frozen, stunned, asleep, confused, bleeding, cursed, silenced, blinded, attack_up, defense_up, defense_down, haste, regen, charmed, petrified, blessed |
| System | 24 | settings_gear, home, close, confirm_check, add_plus, remove_minus, search, menu, info, help_question, warning, lock, unlock, key, save_disk, folder, trash, power, refresh, download, cloud_upload, visible_eye, notification_bell, mail |
| Time and weather | 21 | clock, hourglass, calendar, stopwatch, sun, moon, cloud, rain, snowflake, storm, wind, fog, sunrise, thermometer, rainbow, umbrella, day_night, autumn_leaf, partly_cloudy, snowman, comet |

## Using the icons in your engine

Keep pixel art crisp: use nearest-neighbour (point) filtering and scale by whole numbers (x2, x3, x4).

### Godot 4 (tested in Godot 4.7.2)

1. Copy `godot/ui_glyphs/` into your project (keep the folder name, or re-point the `.tres` files).
2. Use any icon as a texture: `load("res://ui_glyphs/icons_32/sword.tres")` on a TextureRect, Button icon or Sprite2D.
3. Project Settings > Rendering > Textures > Default Texture Filter = Nearest keeps them sharp.
4. `godot/demo/` shows every icon at both sizes: open `godot/project.godot` and run it.

### Unity (files for Unity)

Copy `unity/atlas_32.png` and its `.meta` (and the 16 px pair if you want it) into `Assets/` together. Each atlas imports as a Sprite (Multiple) with one sprite per icon, named by its id. Pixels Per Unit is the icon size.

### Unreal Engine (files for Unreal)

Import an atlas PNG as a texture (Texture Group: UI, Filter: Nearest, Compression: UserInterface2D), or import the single PNGs from `png/32/`. `unreal/icon_rects.csv` gives each icon's pixel rectangle and UVs for a Slate brush or a material that samples the atlas.

### GameMaker (files for GameMaker)

Import the PNGs you need from `png/32/` (or `png/16/`) as sprites; `gamemaker/icons.json` lists a sprite name for each. To use the atlas instead, load `atlas/atlas_32.png` and draw parts of it with `draw_sprite_part` at the `x32`, `y32` positions in the JSON.

### RPG Maker MZ (tested in the RPG Maker MZ runtime)

Back up your project's `img/system/IconSet.png`, then either replace it with ours or paste the rows you want into your own IconSet. Icon index N in the database is row N / 16, column N % 16; `iconset_index.csv` names all 412. The pack starts at index 1.

### Ren'Py (files for Ren'Py)

Copy the contents of `renpy/game/` into your game folder. Every icon is then an image: `add "icon_coin"` in a screen, or `show icon_heart_full`. Set `config.nearest_neighbor = True` for crisp scaling.

## Licence

Royalty free in your games, their trailers and store pages; no credit required. Not for resale or redistribution as an icon pack. Full text: LICENSE.txt.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
