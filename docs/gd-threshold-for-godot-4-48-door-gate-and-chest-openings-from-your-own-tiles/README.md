# Threshold: 48 Door and Chest Openings for Godot 4 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Threshold: 48 Door and Chest Openings for Godot 4  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-03


---

# Threshold for Godot 4 - 48 Door, Gate and Chest Openings From Your Own Tiles

Your door tile swings, your chest lid tips, your gate rises. Threshold reads a tile once and rebuilds every frame of its opening
from those pixels at runtime: there are no door sprite sheets, and it works on the art you already have. Closed, the tile is drawn
exactly as you drew it. Godot 4.7, GDScript only, Forward+ and Compatibility.

Inside: 48 presets in four families, 25 motions, 7 interiors, 16 effects, a TileMapLayer reader, and a demo. A recolour or a slower
swing is a slider, never a new preset.

## Install

1. Copy `godot/addons/threshold/` into your project's `addons/` folder. There is no plugin to enable.
2. Keep that folder name: the presets and styles refer to `res://addons/threshold/` by path.

To see everything first, open `godot/project.godot` in Godot and press Play. Tab or the number keys change page; click a cell,
press Space for the whole page. On the street pages the arrow keys walk and E opens the nearest door.

## Three ways to use it

**1. One door on a node.** Add a `ThresholdDoor2D`, give it your tile as `texture` (and `region` if the tile sits on an
atlas) and a `style`, then call `open()`:

```gdscript
var door := ThresholdDoor2D.new()
door.texture = preload("res://art/my_door.png")
door.style = ThresholdLibrary.get_style("plank-swing")
add_child(door)
door.open()
```

**2. One door on your map.** Take the cells off a TileMapLayer. The cells must fill a rectangle: one tile, double doors two
wide, a gate two tall.

```gdscript
var door := ThresholdDoor2D.new()
door.style = ThresholdLibrary.get_style("portcullis")
$Props.add_child(door)
door.bind_cells($Props, [Vector2i(10, 4), Vector2i(10, 5)])
door.open()
```

**3. Every door on your map, by marking the TileSet.** Add a custom data layer to your TileSet (type String, named
`threshold`), type a word on each door tile, and add a `ThresholdLayer2D` with `tile_map` set to the layer. Neighbouring
tiles with the same word that fill a rectangle open as one door.

```gdscript
func _process(_delta: float) -> void:
	var door: ThresholdDoor2D = $Threshold.nearest_door(player.global_position, 26.0)
	if door != null and Input.is_action_just_pressed("ui_accept"):
		door.toggle()
```

The word is a preset id (below) or one of these plain words: `door`, `swing`, `double`, `doubledoor`, `gate`,
`portcullis`, `bars`, `slide`, `sliding`, `lift`, `curtain`, `flap`, `shutter`, `hatch`, `trapdoor`, `chest`, `lid`, `drawer`,
`coffin`, `vault`, `seal`.

**A door painted onto a wall tile.** Most tilesets draw the door and the wall around it on one tile. Add the door's own
rectangle after an `@`, in texels (x, y, width, height): `door@4,4,8,11`. Only that part of the tile moves; the wall stays. On a
node, set the style's `part` instead, as a fraction of the tile.

**Your own style.** A `ThresholdStyle` is a resource: copy one of the `.tres` files or make a new one in the Inspector, then
give it to a door, or put it in `ThresholdLayer2D.styles` under your own word.

## ThresholdDoor2D

| member | what it does |
|---|---|
| `texture` | your art: the door tile, or a whole tileset atlas with `region` picking the tile |
| `region` | the tile inside `texture`, in pixels; empty means the whole texture |
| `style` | a `ThresholdStyle`: how it opens |
| `progress` | 0 closed, 1 open; setting it jumps there with no animation |
| `centered` | draw the art centred on the node, or with its top-left corner on the node |
| `night` | 0 day, 1 full night: LIGHT interiors and light spill grow stronger |
| `fx_seed` | varies the particles between doors that share a style |
| `pixel_art` | crisp square texels (nearest filtering) |
| `blocking` | a collision box over the art while the door is mostly closed (off by default) |
| `blocking_layer` | the physics layers of that box |
| `cast_light` | a real PointLight2D out of a lit opening, following `progress`; 0 means none |
| `cast_light_radius` | its radius in texels of your art |
| `redraw_hz` | how many times a second a moving door rebuilds its picture (30 suits pixel art; raise it for smooth art) |
| `open()` `close()` `toggle()` | animate; effects start again from the beginning on an open |
| `is_open()` `is_moving()` | where it is heading, and whether it is moving |
| `preview(at, fx_time)` | jump to a moment and stop there (`unfreeze()` lets it move again) |
| `bind_cells(layer, cells)` `unbind()` `get_cells()` | take tiles off a TileMapLayer, put them back, list them |
| `get_art_size()` | the art's size in texels |
| signals | `opened`, `closed`, `progress_changed(value)` |

## ThresholdLayer2D

| member | what it does |
|---|---|
| `tile_map` | the layer whose marked tiles become doors |
| `custom_data` | the TileSet custom data layer to read (default `threshold`) |
| `styles` | your own styles by word, checked before the pack's |
| `auto_bind` | bind when the node is ready |
| `night` `blocking` `cast_light` | passed to every door |
| `bind()` `unbind()` | make the doors (returns how many), give the tiles back |
| `door_at(cell)` `nearest_door(pos, max_distance)` | find a door |
| `open_at(cell)` `close_at(cell)` `toggle_at(cell)` | act on the door at a cell |
| `doors` | every door it made |
| signals | `door_opened(door)`, `door_closed(door)` |

## ThresholdStyle, every field a slider

| field | what it does |
|---|---|
| `motion` | how the moving part travels (table below) |
| `part` | the moving part inside the art, as a fraction of the art; the rest stays where it is (a frame, an arch, a chest body) |
| `flip` | hinge or travel side |
| `outward` | DOUBLE only: the leaves open toward the viewer |
| `duration` | seconds for a full open, and a full close |
| `steps` | RISE and DROP move in this many jolts; 0 is smooth |
| `reach` | how far it turns or travels |
| `depth` | perspective strength for turning parts |
| `thickness` | leaf thickness in texels, shown as its edge |
| `interior` | what the opening reveals (table below) |
| `light_color` `fx_color` | colour of lit rooms and spill; colour of glows, motes, runes and the like |
| `fx` | effect flags: Dust, Snow, Sparks, Embers, Rays, Coins, Glints, Bubbles, Leaves, Mist, Chains, Drips, Smoke, Teeth, Runes, Spill |
| `fx_amount` `fx_linger` | how much, and how long effects run after the part has stopped |
| `idle_fx` | effects that loop while the door stands open |
| `showcase` `showcase_time` | the moment `preview()` stops at |
| `overshoot` | a lid that bounces at the end of its travel |

## The 25 motions

| motion | what it does |
|---|---|
| SWING | a hinged leaf turning inward, foreshortening, its edge in the art's own darkest colour |
| SWING_OUT | a hinged leaf turning toward the viewer, growing as it comes |
| DOUBLE | two leaves parting from the middle (inward, or outward with `outward`) |
| FOLD | a bifold door folding into a zigzag against its hinge |
| SLIDE | sliding into the wall, clipped by the frame |
| SPLIT_SLIDE | two halves sliding apart into the wall |
| RISE | rising out of the frame, in `steps` jolts when steps > 0 |
| DROP | sinking into the floor |
| ROLL | a roller shutter winding up onto a drum |
| CURTAIN | parting at the middle and bunching at the sides in folds |
| LID_TIP | a lid tipping back on its hinge, its underside showing past upright |
| LID_SLIDE | a heavy lid shoved back and aside |
| LID_POP | a lid hopping off and resting askew |
| DRAWER | a drawer sliding toward the viewer, its dark box showing above it |
| HATCH | a floor hatch lifting on its hinge and laying back, casting a shadow |
| VAULT | a round door rolling aside into the wall |
| IRIS | an aperture opening from the centre, the blades twisting |
| SPLIT_V | blast doors: the top half rises, the bottom half sinks |
| DISSOLVE | the part unmade texel by texel into rising motes |
| CRUMBLE | the part breaking into chunks that fall and pile at its foot |
| MELT | the part running down in columns into a puddle |
| BURN | a charring front climbing the part, embers rising |
| SHATTER | the part bursting into shards that fly and fall |
| DECRYPT | rows glitching sideways and wiping out in scanlines |
| SIFT | the part pouring away as fine grains into a heap |

## The 7 interiors

| interior | what the opening shows |
|---|---|
| DARK | shadow, derived from the art's own darkest colour |
| LIGHT | a lit room in `light_color`, stronger with the door's `night` |
| GLOW | a fire or furnace glow from below, in `fx_color` |
| GOLD | treasure light from inside a container |
| VOID | a deep violet nothing with points of light |
| WATER | deep water, lighter at the top |
| NONE | nothing: whatever is behind the node shows (gates, bars, grilles) |

## The 48 presets

Each preset is a scene in `addons/threshold/presets/` and a style in `addons/threshold/styles/`. The tile it opens in the demo is
only an example: any style works on any tile.

### Doors and windows (20)

| preset id | what it does | motion | interior | demo tile |
|---|---|---|---|---|
| `plank-swing` | Plank door swings in, shedding dust | SWING | DARK | Plank door (Verdant 09 Town) |
| `arch-door-lamplight` | Arched door opens on a lamplit room | SWING | LIGHT | Arched door (Verdant 09 Town) |
| `window-shutters-out` | Shutters thrown open on a lit window | DOUBLE | LIGHT | Shuttered window (Verdant 09 Town) |
| `boiler-door-furnace` | Boiler door swings out on a roaring firebox | SWING_OUT | GLOW | Boiler door (Verdant 18) |
| `medicine-cabinet-glass` | Medicine cabinet opens, glass glinting | SWING_OUT | LIGHT | Medicine cabinet (Verdant 31) |
| `crew-locker-part` | Crew locker doors part into the frame | SPLIT_SLIDE | LIGHT | Crew locker (Verdant 32) |
| `tool-locker-roll` | Roller shutter winds up onto its drum | ROLL | DARK | Tool locker (Verdant 32) |
| `snow-arch-swing` | Snowed-in arched door opens on a warm hall | SWING | LIGHT | Arched door under snow (Verdant 43) |
| `snow-plank-out` | Frozen door forced outward, cold breath | SWING_OUT | DARK | Plank door under snow (Verdant 43) |
| `snow-shutters-fold` | Snowy shutters fold back like a screen | FOLD | LIGHT | Shutters under snow (Verdant 43) |
| `burned-arch-burn` | Charred door burns away from the foot up | BURN | DARK | Burned arched door (Verdant 44) |
| `burned-plank-crumble` | Burned door crumbles into a heap of char | CRUMBLE | DARK | Burned plank door (Verdant 44) |
| `burned-shutter-shatter` | Burned shutters burst apart | SHATTER | DARK | Burned shutters (Verdant 44) |
| `hide-flap-part` | Hide flap parts on a fire-lit tent | CURTAIN | GLOW | Hide-flap doorway (Verdant 46) |
| `log-door-hoist` | Log door hoisted in jolts on ropes | RISE | DARK | Log door (Verdant 46) |
| `chapel-door-dissolve` | Sealed chapel door unmade by its runes | DISSOLVE | VOID | Chapel door (Verdant 06 Gothic) |
| `mummy-case-swing` | Mummy case swings open, mist pouring out | SWING_OUT | DARK | Mummy case (Verdant 47 Museum) |
| `desert-door-sift` | Sandstone door pours away as sand | SIFT | DARK | Sandstone door (Verdant 24 Desert) |
| `dungeon-door-roll` | Heavy dungeon door rolls aside into the wall | VAULT | DARK | Dungeon door (Verdant 05 Depths) |
| `vine-curtain-part` | Vine curtain parts, leaves falling | CURTAIN | DARK | Vine curtain (Verdant 27) |

### Gates, bars and lifts (11)

| preset id | what it does | motion | interior | demo tile |
|---|---|---|---|---|
| `five-bar-gate-swing` | Five-bar gate swings on its post | SWING | NONE | Five-bar gate (Verdant 09 Town) |
| `graveyard-gate-part` | Graveyard gates part in a ground mist | DOUBLE | NONE | Graveyard gate (Verdant 06 Gothic) |
| `portcullis-rise` | Portcullis ratchets up on its chains | RISE | DARK | Portcullis (Verdant 25 Infernal) |
| `ember-gate-drop` | Ember gate sinks into the floor, sparks flying | DROP | GLOW | Ember gate (Verdant 27) |
| `rime-gate-melt` | Rime gate melts into a pool | MELT | DARK | Rime gate (Verdant 27) |
| `golden-gate-part` | Golden gates part on a holy light | DOUBLE | LIGHT | Golden gate (Verdant 37 Cloud Realm) |
| `firewall-gate-decrypt` | Firewall decrypts and drops out in scanlines | DECRYPT | NONE | Firewall gate (Verdant 48) |
| `cell-door-slide` | Cell door slides along its rail | SLIDE | DARK | Cell door (Verdant 20 Prison) |
| `chainlink-gate-slide` | Chain-link gate rolls aside | SLIDE | NONE | Chain-link sliding gate (Verdant 20 Prison) |
| `lift-doors-part` | Lift doors part on a lit car | SPLIT_SLIDE | LIGHT | Lift doors (Verdant 14) |
| `dungeon-gate-jaws` | Dungeon gate splits, top up and bottom down | SPLIT_V | DARK | Dungeon gate (Verdant 05 Depths) |

### Hatches and floors (5)

| preset id | what it does | motion | interior | demo tile |
|---|---|---|---|---|
| `inspection-hatch-lift` | Inspection hatch lifts, steam escaping | HATCH | DARK | Inspection hatch (Verdant 18) |
| `hatch-wheel-iris` | Wheel hatch irises open | IRIS | DARK | Hatch with wheel (Verdant 32) |
| `trapdoor-lift` | Trapdoor heaved up, dust falling | HATCH | DARK | Trapdoor (Verdant 68 Storeys) |
| `flagstone-slide` | Flagstone dragged aside on a cold cellar | SLIDE | DARK | Flagstone hatch (Verdant 68 Storeys) |
| `sarcophagus-shove` | Sarcophagus lid shoved back, tomb dust rising | LID_SLIDE | DARK | Sarcophagus (Verdant 51 Pyramid Tombs) |

### Chests and drawers (12)

| preset id | what it does | motion | interior | demo tile |
|---|---|---|---|---|
| `banded-chest-open` | Banded chest opens on gold | LID_TIP | GOLD | Banded chest (Verdant 07 Interiors) |
| `strongbox-rays` | Treasury strongbox opens in rays of light | LID_TIP | GOLD | Treasury strongbox (Verdant 15 Palace) |
| `tool-chest-drawer` | Tool chest drawer pulled out | DRAWER | DARK | Tool chest (Verdant 18) |
| `iron-chest-mimic` | Iron chest opens its jaws: a mimic | LID_TIP | DARK | Iron-bound chest (Verdant 25 Infernal) |
| `sunken-chest-bubbles` | Sunken chest opens, bubbles rising | LID_TIP | WATER | Sunken chest (Verdant 26 Deep Ocean) |
| `elemental-chest-pop` | Lid pops off askew, coins spilling up | LID_POP | GOLD | Iron-bound chest (Verdant 27) |
| `low-strongbox-slide` | Strongbox lid slides back on gold | LID_SLIDE | GOLD | Low strongbox (Verdant 27) |
| `crystal-chest-glow` | Crystals in the chest flare and dissolve into violet light | DISSOLVE | VOID | Chest of crystals (Verdant 29) |
| `celestial-chest-light` | Celestial chest opens on the sky | LID_TIP | LIGHT | Celestial chest (Verdant 37) |
| `coin-chest-coins` | Coin strongbox bursts with coins | LID_TIP | GOLD | Coin strongbox (Verdant 42 Market) |
| `encrypted-chest-decrypt` | Encrypted chest lid decrypts | DECRYPT | VOID | Encrypted chest (Verdant 48) |
| `bedside-drawer-pull` | Bedside locker drawer slides out | DRAWER | DARK | Bedside locker (Verdant 31) |

## Cost

A closed door draws one texture. A door that has stopped does no work and keeps its last picture, unless its style loops an idle
effect. A moving door rebuilds its texels `redraw_hz` times a second (30 by default, and doors opened together redraw on different frames). Five 16 px doors all moving at once averaged under about 5 ms a frame, with no frame over about 20 ms, on our test machine (an integrated AMD Radeon, busy with other work at the time), under both renderers. Fifty 16 px doors all moving at once averaged under about 85 ms a frame, with no frame over about 135 ms, so that many in one moment is more than one frame's budget; a real scene opens one or two at a time, for under a second each.

## Renderers and versions

Run on Godot 4.7.2 under Forward+ and Compatibility, every preset photographed under both. Mobile was also run. Older Godot versions
were not run, so they are not claimed. Tiles must be readable images (the default for an imported PNG); a tile on a TileMapLayer must
come from an atlas source.

## The demo tiles

`addons/threshold/demo_tiles/` and `demo/fixture/` hold art from our own Verdant tilesets, so the demo has something to open.
You may use them in your games under this pack's licence; `addons/threshold/demo_tiles/NOTICE.txt` says where they are sold.

## Licence

See `LICENSE.txt`. This pack is AI-generated and its store page says so.

Made by Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
