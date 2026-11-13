# Sentiment and Tether for Godot 4: emotion portraits and relationship cords — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Sentiment and Tether for Godot 4: emotion portraits and relationship cords  
**Engine:** Godot 4.7.2 addon packs (Tools/godot, GDScript + .gdshader, 2D-first): Line A1 VFX and shader packs of 40+ runtime-computed presets with exported parameters, compiling under BOTH Forward+ and Compatibility; Line A2 ports of CSAF's SOLD RPG Maker winners (sigil-core, wrack, jigsaw); Line B Chronicle's systems re-shipped with their designed look after the JRPG has played them (M1). PROVEN by Kernel/godot/gd_gate.js (headless import + --check-only parse + demo run, then every preset photographed WINDOWED under forward_plus and gl_compatibility against an empty-stage control, two visibility instruments, dedupe.js + a pixel-level pair check, raw-source, docs, no .godot cache; the agent then LOOKS). See Wings/Godot/CLAUDE.md.  
**Docs published:** 2026-11-13


---

# Sentiment and Tether for Godot 4

Two systems in one addon, both drawn from the art you already have:

- **Sentiment** puts a feeling onto any portrait or battler: happy, sad, angry and afraid, each at three intensities, in
  four drawing styles. The feeling washes into your own picture (a CanvasItem shader) and a frame and marks are drawn
  around it with `_draw()`: sparkles, falling streaks, popped-vein crosses, sweat drops. 48 looks.
- **Tether** draws the bonds between your characters: each character a framed medallion of their own face, each bond a
  cord whose material says what it is and whose condition says how it is holding. 8 materials in 6 conditions: 48 cords.
  A chart Control draws a whole party; a small bond store keeps the values and saves to a Dictionary.

Ported to Godot from two of our RPG Maker MZ plugins, Sentiment and Tether. Made for Godot 4.7 (run on 4.7.2, under the
Forward+ and Compatibility renderers; older 4.x versions were NOT run). No GDExtension, no image files besides the
sixteen sample portraits.

## Install

1. Copy `addons/sentiment_tether/` into your project's `addons/` folder. There is no plugin to enable: the classes
   (`SentimentLayer`, `TetherCord2D`, `TetherChart`, `TetherBonds`, `TetherPainter`) register themselves.
2. Open `demo/demo.tscn` in this project to see everything first (keys 1, 2, 3 pick the page, S cycles the style).

Keep the folder's layout as it is: `sentiment_layer.gd` loads `sentiment.gdshader` from its own folder and `TetherChart`
loads its name font from `fonts/`. If either is missing it prints an error naming the path it looked for.

## Sentiment: a feeling on your own portrait

Add a `SentimentLayer` as a child of a `Sprite2D` or a `TextureRect` (or any node with a texture), or from code:

```gdscript
var layer := SentimentLayer.apply($Portrait, &"sad", 2, &"sketch")
layer.raise()           # sad 2 -> sad 3 ("Miserable")
layer.calm()            # back to the picture exactly as drawn
```

The wash goes onto the parent's own pixels **when the scene runs** (the editor shows the frame and the marks only, so your
scene never saves our material onto your sprite; with `wash_parent` off you get frame and marks only, at run time too).
The layer reads its rectangle from the parent (`Sprite2D.get_rect()` or the Control's size); set `rect_override` for
anything else.

| parameter | what it does |
| --- | --- |
| `emotion` | `neutral`, `happy`, `sad`, `angry` or `afraid`. Neutral draws nothing. |
| `intensity` | 0 (calm) to 3. The names: Happy, Ecstatic, Manic · Sad, Depressed, Miserable · Angry, Enraged, Furious · Afraid, Panicked, Terrified. |
| `style` | `sketch` (pencil over paper-light), `gilt` (gold frame, filled marks), `screentone` (black ink, a dot screen in the shadows), `glow` (lit strokes, an aura). |
| `tint` | replaces the feeling's mark and wash colour when its alpha is above zero. |
| `mark_scale` | size of the marks (0.4 to 2). |
| `frame_scale` | thickness of the frame (0.3 to 3). |
| `speed` | speed of the marks' motion and the tremble; 0 freezes them. |
| `fps` | how many times a second the marks are redrawn (default 8, a hand-drawn step); 0 draws them once. The wash and tremble stay smooth every frame and the frame is drawn once per feeling. |
| `mark_seed` | where the marks fall; two layers with different seeds never mark identically. |
| `transition` | seconds a change of feeling takes to wash in (the first feeling is shown at once). |
| `wash_parent` | put the wash on the parent's pixels (on by default). |
| `aura` | a glow behind the picture at intensity 3 (and from 2 in the glow style). |
| `rect_override` | the rectangle to frame, in the parent's space, when the parent cannot tell it. |

Signal `emotion_changed(emotion, intensity)`. Helpers: `set_emotion(emotion, intensity)`, `raise(steps)`, `calm()`,
`is_calm()`, `current_rung()`, and the static `SentimentLayer.apply()`, `layer_of()`, `clear()`, `rung_name()`.

**The wheel.** `SentimentLayer.beats(a, b)`: happy beats angry, angry beats sad, sad beats happy; afraid and neutral beat
nothing. `SentimentLayer.advantage(attacker, defender)` returns a damage multiplier (1.5 when the attacker's feeling wins,
0.5 when it loses, else 1.0; pass your own numbers as the third and fourth arguments).

## Tether: bonds drawn as cords

| material | the bond kind it draws by default |
| --- | --- |
| `silk` | love |
| `rope` | friendship |
| `chain` | oath |
| `barbed_wire` | rivalry |
| `ribbon` | family |
| `thread` | fate |
| `beads` | devotion |
| `vine` | mentor |

Conditions: `new` (nearly taut, clean), `slack` (hangs deep), `knotted` (a knot for each event that changed it),
`frayed` (the middle coming apart), `strained` (pulled straight, thinned, buzzing) and `severed` (cut, both ends hanging).
The value (0 to 1) sets the cord's weight and the tier plates: six tiers, a thread to a hawser.

**One bond:** `TetherCord2D` draws two medallions and the cord between them. Parameters: `cord_material`, `condition`,
`value`, `knots`, `face_a`, `face_b`, `span`, `medallion_radius`, `colour` (replaces the material's colours when its alpha is
above zero), `rim`, `sway`, `fps` (redraws a second while it sways, default 12; 0 holds it still), `show_medallions`, `show_cord`,
`show_tiers`, `show_card`.

**A whole party:** `TetherChart` is a Control.

```gdscript
$Chart.add_member(&"hale", "Captain Hale", preload("res://faces/hale.png"))
$Chart.add_member(&"isolde", "Isolde", preload("res://faces/isolde.png"))
$Chart.set_bond(&"hale", &"isolde", &"oath", 0.85)            # condition derived from the bond
$Chart.set_bond(&"hale", &"isolde", &"rivalry", 0.5, &"strained")
```

Parameters: `page`, `page_colour`, `rim`, `medallion_radius`, `layout` (`circle` or `manual`, which uses the position passed
to `add_member`), `show_names`, `show_tiers`, `font`, `font_size`, `name_colour`, `sway`, `fps`. Signal `member_clicked(id)`.
Also `add_member()`, `remove_member()`, `add_knot()`, `clear_bonds()`, `bond_count()`, `member_position()`, `member_at()`,
`set_bonds_from(store)`.

**A bond store** if your game has none: `TetherBonds` (a Resource) with `set_bond()`, `change(a, b, delta)` (a change that
crosses a tier ties a knot), `set_broken()`, `set_strain()`, `value_of()`, `tier()`, `to_dict()` / `from_dict()` for your save
file, and the signal `bond_changed`. `TetherBonds.condition_of(record)` says which condition a stored bond is drawn in.

**Your own drawing:** `TetherPainter.draw_cord(canvas_item, a, b, material_or_kind, condition, value)` and
`TetherPainter.draw_medallion(canvas_item, centre, radius, face)` work from any `_draw()`.

## Cost

Everything is drawn by GDScript and CanvasItem calls, so it costs CPU when it redraws. A layer redraws its marks `fps` times a
second (staggered, so a party never redraws on the same frame) and its frame only when the feeling, style or size changes; a
cord redraws while it sways. A full-intensity feeling is the heaviest look. Our test report measures 12 feelings and 12 cords on
screen at once under both renderers: Forward+ took several times longer per frame than Compatibility for the same scene (many
anti-aliased lines cost more under Forward+). For a screen with many animated portraits, use Compatibility, lower `fps`, or set
`fps` to 0 for still marks; a battle row of four is light under either.

## Renderers

Every preset is photographed by our pack gate under both Forward+ and Compatibility with zero engine error lines, and
compared between the two. The wash, the marks and the cords use only CanvasItem drawing and one canvas shader, so they also
run on web exports (Compatibility).

## The 96 presets

Each preset is a small scene under `addons/sentiment_tether/presets/`: a feeling on one of the sample portraits, or one cord
between a pair. Copy one into your scene, swap the texture for your own, and change the parameters.

**Feelings** (`presets/sentiment/<style>/`)

| id | emotion | intensity | style | portrait |
| --- | --- | --- | --- | --- |
| `happy-sketch` | happy | 1 | sketch | ranger |
| `ecstatic-sketch` | happy | 2 | sketch | ranger |
| `manic-sketch` | happy | 3 | sketch | ranger |
| `sad-sketch` | sad | 1 | sketch | ranger |
| `depressed-sketch` | sad | 2 | sketch | ranger |
| `miserable-sketch` | sad | 3 | sketch | ranger |
| `angry-sketch` | angry | 1 | sketch | ranger |
| `enraged-sketch` | angry | 2 | sketch | ranger |
| `furious-sketch` | angry | 3 | sketch | ranger |
| `afraid-sketch` | afraid | 1 | sketch | ranger |
| `panicked-sketch` | afraid | 2 | sketch | ranger |
| `terrified-sketch` | afraid | 3 | sketch | ranger |
| `happy-gilt` | happy | 1 | gilt | cleric |
| `ecstatic-gilt` | happy | 2 | gilt | cleric |
| `manic-gilt` | happy | 3 | gilt | cleric |
| `sad-gilt` | sad | 1 | gilt | cleric |
| `depressed-gilt` | sad | 2 | gilt | cleric |
| `miserable-gilt` | sad | 3 | gilt | cleric |
| `angry-gilt` | angry | 1 | gilt | cleric |
| `enraged-gilt` | angry | 2 | gilt | cleric |
| `furious-gilt` | angry | 3 | gilt | cleric |
| `afraid-gilt` | afraid | 1 | gilt | cleric |
| `panicked-gilt` | afraid | 2 | gilt | cleric |
| `terrified-gilt` | afraid | 3 | gilt | cleric |
| `happy-screentone` | happy | 1 | screentone | princess |
| `ecstatic-screentone` | happy | 2 | screentone | princess |
| `manic-screentone` | happy | 3 | screentone | princess |
| `sad-screentone` | sad | 1 | screentone | princess |
| `depressed-screentone` | sad | 2 | screentone | princess |
| `miserable-screentone` | sad | 3 | screentone | princess |
| `angry-screentone` | angry | 1 | screentone | princess |
| `enraged-screentone` | angry | 2 | screentone | princess |
| `furious-screentone` | angry | 3 | screentone | princess |
| `afraid-screentone` | afraid | 1 | screentone | princess |
| `panicked-screentone` | afraid | 2 | screentone | princess |
| `terrified-screentone` | afraid | 3 | screentone | princess |
| `happy-glow` | happy | 1 | glow | elf |
| `ecstatic-glow` | happy | 2 | glow | elf |
| `manic-glow` | happy | 3 | glow | elf |
| `sad-glow` | sad | 1 | glow | elf |
| `depressed-glow` | sad | 2 | glow | elf |
| `miserable-glow` | sad | 3 | glow | elf |
| `angry-glow` | angry | 1 | glow | elf |
| `enraged-glow` | angry | 2 | glow | elf |
| `furious-glow` | angry | 3 | glow | elf |
| `afraid-glow` | afraid | 1 | glow | elf |
| `panicked-glow` | afraid | 2 | glow | elf |
| `terrified-glow` | afraid | 3 | glow | elf |

**Cords** (`presets/tether/<material>/`)

| id | material | bond kind | condition |
| --- | --- | --- | --- |
| `silk-new` | silk | love | new |
| `silk-slack` | silk | love | slack |
| `silk-knotted` | silk | love | knotted |
| `silk-frayed` | silk | love | frayed |
| `silk-strained` | silk | love | strained |
| `silk-severed` | silk | love | severed |
| `rope-new` | rope | friendship | new |
| `rope-slack` | rope | friendship | slack |
| `rope-knotted` | rope | friendship | knotted |
| `rope-frayed` | rope | friendship | frayed |
| `rope-strained` | rope | friendship | strained |
| `rope-severed` | rope | friendship | severed |
| `chain-new` | chain | oath | new |
| `chain-slack` | chain | oath | slack |
| `chain-knotted` | chain | oath | knotted |
| `chain-frayed` | chain | oath | frayed |
| `chain-strained` | chain | oath | strained |
| `chain-severed` | chain | oath | severed |
| `barbed-wire-new` | barbed_wire | rivalry | new |
| `barbed-wire-slack` | barbed_wire | rivalry | slack |
| `barbed-wire-knotted` | barbed_wire | rivalry | knotted |
| `barbed-wire-frayed` | barbed_wire | rivalry | frayed |
| `barbed-wire-strained` | barbed_wire | rivalry | strained |
| `barbed-wire-severed` | barbed_wire | rivalry | severed |
| `ribbon-new` | ribbon | family | new |
| `ribbon-slack` | ribbon | family | slack |
| `ribbon-knotted` | ribbon | family | knotted |
| `ribbon-frayed` | ribbon | family | frayed |
| `ribbon-strained` | ribbon | family | strained |
| `ribbon-severed` | ribbon | family | severed |
| `thread-new` | thread | fate | new |
| `thread-slack` | thread | fate | slack |
| `thread-knotted` | thread | fate | knotted |
| `thread-frayed` | thread | fate | frayed |
| `thread-strained` | thread | fate | strained |
| `thread-severed` | thread | fate | severed |
| `beads-new` | beads | devotion | new |
| `beads-slack` | beads | devotion | slack |
| `beads-knotted` | beads | devotion | knotted |
| `beads-frayed` | beads | devotion | frayed |
| `beads-strained` | beads | devotion | strained |
| `beads-severed` | beads | devotion | severed |
| `vine-new` | vine | mentor | new |
| `vine-slack` | vine | mentor | slack |
| `vine-knotted` | vine | mentor | knotted |
| `vine-frayed` | vine | mentor | frayed |
| `vine-strained` | vine | mentor | strained |
| `vine-severed` | vine | mentor | severed |

## The sample portraits

`addons/sentiment_tether/demo_faces/` holds sixteen 256 x 256 portraits (AI-generated, Core Systems Asset Factory's own cast):
captain, mage, rogue, cleric, ranger, bard, mercenary, witch, king, princess, fighter, monk, elf, wizard, squire, shadow.
They are there so the presets and the demo have faces; use your own art in your game.

## Licence

See `LICENSE.txt`: use in any number of games, no resale of the files as a pack. The two fonts in `fonts/` are SIL OFL 1.1
and keep their own licence files. This pack is AI-generated (code and portraits); the store page says so too.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
