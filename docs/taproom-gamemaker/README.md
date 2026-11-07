# Taproom: 4 Tavern Board Games with AI for GameMaker — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Taproom: 4 Tavern Board Games with AI for GameMaker  
**Engine:** GameMaker 2024+  
**Store page:** https://csaf.itch.io/taproom-gamemaker  
**Docs published:** 2026-11-07


---

# Taproom - Tavern Board Games Against an Opponent Who Thinks, for GameMaker

Sit your player down across a tavern table from one of your characters and play one of four old board games for a stake:

| game | what it is |
| --- | --- |
| Nine Men's Morris | place nine men each; three in a row (a mill) takes one of theirs; down to three, you may fly |
| Fox and Geese | one fox against thirteen geese on the cross board; play either side (the geese move first) |
| Oware | sow seeds round twelve pits; your last seed making two or three in their pit takes them |
| Fanorona | 22 men a side; take whole lines by approach or withdrawal, in chains; taking is compulsory |

- **Every board is drawn, and so is everything on it.** Eight board materials - slate, marble, a board knifed into the
  tabletop, black lacquer with gilt lines, a linen mat with stitched lines, tooled leather, walnut with brass, carved
  soapstone - each with its own line treatment, a border worked at a steady pitch, and the wear of use (scratches,
  chipped edges). Six sets of men - river stones, bone and horn, glass, silver and copper coins, fired clay, boxwood and
  ebony - and the fox, all lit from a lamp at the upper left. Oware's seeds are the set's own (pebbles, cowries, beads,
  coins, clay, beans). The oak table, the felt trays, the brass plaques and the parchment card are drawn too. Nothing is
  an image file.
- **The opponent thinks.** Five strengths - Novice, Regular, Sharp, Hustler, Master - an alpha-beta search that runs a
  slice of each frame, so the game never stalls, and the same position with the same seed gets the same move. It
  deepens one ply at a time under a node budget per game (see Performance), so even the Master answers in seconds.
- **The opponent's name chooses their board and men,** so the old man in the corner always sets out the same scratched
  slate. You can name a board and a set instead.
- **192 table combinations** (4 games x 8 boards x 6 sets), and the demo's six regulars sit at six different ones.

Ported from our RPG Maker MZ plugin Taproom and held to it: the in-engine suite runs the rules, the opponent and every
paint operation of the drawing through both and checks they agree (see Verification).

## Install

1. In GameMaker, **Tools > Import Local Package**, choose `Taproom.yymps`, and import everything.
2. Run the project with `rm_tpm_demo` first in the room order. The demo is THE TAPROOM: six regulars round the table, each
   with a game and a strength. Click a card (or walk the arrows and press Enter) to sit down; the room shows "Setting the
   board" while the table is drawn (a few seconds, see Performance). In a game: click a man, then
   where it goes (rings show every point you may click; a red cross marks a man you may take); the arrows and Enter do
   the same from the keyboard; Esc puts a picked-up man back; Shift shows the rules; W (or the Stop plaque) ends a chain
   of captures early; Concede, clicked twice, gives the game up.

Requires GameMaker 2024.14 or later. Built and tested on runtime 2024.14.4.268 (the VM, Windows). Pure GML plus one GLSL
ES shader (the board materials); no extension; nothing here depends on GMRT.

Every script, object, room, shader, macro and global here is named `tpm_` / `TPM_` (`obj_tpm_demo`, `rm_tpm_demo`,
`shd_tpm_surface`). **Changed in 1.1.0:** the prefix was `tpr_` / `TPR_` in 1.0.0, which our Touchpaper package also
uses, so the two could not be imported into one project. Nothing else changed. If you imported 1.0.0, delete what it
added before importing 1.1.0 (its scripts start `tpr_`, and its demo object, demo room and shader carry `tpr` in their
names), then rename your own calls from `tpr_` to `tpm_`.

## Quickstart

```gml
// Create - sit the player down
my_table = tpm_table_open({ game: "morris", opponent: "Old Brannoc", grade: 3, side: "first", stake: 40 });

// Step - run the table; when the player leaves it, read the result
tpm_table_step(my_table);
if (tpm_table_closed(my_table)) {
    my_result = my_table.result;          // { result: 1 won / 0 lost / 2 drawn, margin, reason, plies, stake, ... }
    tpm_table_free(my_table);
}

// Draw GUI - the table is 816 x 624; draw it anywhere, at any scale
tpm_table_draw(my_table, 72, 8, 1);
```

`tpm_table_open` draws everything once (the table, the board, the men, the card) and keeps them as sprites, so opening a
table takes a few seconds: open it behind your own transition (draw a "setting the board" frame, then open on the next
Step, as `tpm_demo_step` does). After that a frame costs little. The mouse is read in GUI coordinates, relative
to where you draw the table. Gold is your game's business: the stake is shown on the card and in the verdict, and
`result` tells you who won.

### The request

```gml
{ game: "oware",                 // "morris" | "foxgeese" | "oware" | "fanorona"
  opponent: "Captain Dray",      // shown on the card; it also chooses their board and men
  grade: 4,                      // 1 Novice, 2 Regular, 3 Sharp, 4 Hustler, 5 Master
  side: "first",                 // "first" | "second" | "random"; Fox and Geese: "fox" | "geese" (the geese move first)
  stake: 50,                     // shown on the card and in the verdict
  seed: 1234,                    // optional: the same seed, the same opponent choices
  board: "walnut", set: "coins", // optional: a material and a set instead of the opponent's own
  key: "inn|captain",            // optional: where they sit (counts the games played there)
  watch: true, watch_grade: 2,   // optional: the player's side is played by the search too (an attract mode)
  auto_close: true }             // optional: close by itself after the verdict
```

The ids: games `morris foxgeese oware fanorona`; boards (`tpm_board_ids()`) `slate marble knifed lacquer linen leather
walnut soapstone`; sets (`tpm_set_ids()`) `stones bone glass coins clay boxwood`. Oware is never played on the mat or the
slate (its pits are carved).

## Reference

**The table** (`tpm_table_open` once, then every frame `tpm_table_step` in Step and `tpm_table_draw` in Draw or Draw GUI)
- `tpm_table_open(request)` - sit the player down; returns the table struct.
- `tpm_table_step(table, [mouse_x], [mouse_y])` - one frame: input, thinking, animation. Pass your own mouse position (in
  the same coordinates you draw in) if you do not draw in the GUI layer.
- `tpm_table_draw(table, [x], [y], [scale])` - draw it with its top-left at (x, y).
- `tpm_table_closed(table)` - true once the game is over and the player has dismissed the verdict.
- `tpm_table_free(table)` - free every sprite it made (in Step or Clean Up, never in a Draw event).
- Fields you may set: `table.thinkMs` (how much of each frame the opponent may spend searching, default 6 ms; its move
  is the same whatever this is, only how long it takes changes), `table.sounds` (`{ move, take, sow, pick, refuse, win, lose }` - your sound asset ids,
  -1 for none), `table.inject` (scripted input for one frame, in table coordinates: `{ x, y, click }` or `{ ok: true }`
  and so on - for a tutorial or a replay).
- `table.result` - `{ game, opponent, grade, result, margin, reason, plies, stake }`. `margin` is in the game's own unit
  (men ahead, seeds ahead, geese taken or left), negative when the player lost.

**Records** (kept across games; save them yourself)
- `tpm_record(name, game)` - the player's `{ w, l, d }` against them at that game.
- `tpm_records_save()` / `tpm_records_load(json)` - every record as a JSON string for your save file, and back.

**The rules and the opponent, on their own** (pure GML, no drawing)
- `tpm_match_new(game, [{ human }])`, `tpm_match_play(match, move)`, `tpm_margin(match, side)`.
- `tpm_game_init(game)`, `tpm_moves(game, state)`, `tpm_apply(game, state, move)`, `tpm_result(game, state)`,
  `tpm_evaluate(game, state, side)`, `tpm_tokens(game, move)` (a move as the clicks that make it),
  `tpm_options(game, legal, prefix)` (what may be clicked next).
- `tpm_thinker(game, state, grade, seed)` + `tpm_thinker_step(thinker, nodes)` - the search, a slice at a time;
  `tpm_best_move(game, state, grade, seed)` runs it to the end in one call. Read `.move` and `.score`; `.depth_done` is
  how deep it got and `.capped` is true when the node budget (`tpm_node_budget(game)`) stopped it short of the grade's
  full depth.
- `tpm_game_name(game)`, `tpm_grade_name(grade)`, `tpm_hash(text)`.

**Drawing directly** (into a `tpm_cx_create(scale)` context, onto whatever surface is the current target)
- `tpm_layout(game, w, h)` - where the board, its points and the panel go.
- `tpm_style_for(name, game, [board], [set])` - the board, men, seed and wear an opponent plays with.
- `tpm_draw_table(ctx, w, h, seed)`, `tpm_draw_board(ctx, layout, style)`, `tpm_draw_man(ctx, x, y, r, set, side, seed,
  [lift])`, `tpm_draw_seeds(ctx, x, y, pit_r, n, set, seed)`, `tpm_draw_count(ctx, x, y, n, board_info, [size])`,
  `tpm_draw_plaque(ctx, x, y, w, h, label, state)`, `tpm_draw_placard(ctx, x, y, w, h, info)`, `tpm_draw_status(ctx, w,
  h, text)`, `tpm_draw_marker(ctx, x, y, r, kind)`, `tpm_draw_verdict(ctx, w, h, info, cx, cy)`.
- `tpm_paint_surface(id, x, y, w, h, seed, [clip], [m])` and `tpm_paint_table(w, h, seed, [m])` - a material or the oak
  table painted on the GPU; `tpm_shader_ok()` says whether the shader compiled on this platform (if not, the boards are
  painted flat in their base colour and the game still plays). `tpm_board_info(id)` and `tpm_set_info(id)` give a
  material's or a set's colours.

## Performance - read this before opening a table mid-frame

Measured on our test machine, a shared and busy one (runtime 2024.14.4.268, the VM, Windows). Yours will differ.

- **Opening a table takes 2.4 to 4.4 s** (three runs; Oware is the quickest, having no men to draw). `tpm_table_open`
  draws the table, the board and every man once, at twice the size, filtered down. Open it behind a transition: the
  demo shows "Setting the board" for a frame first, then opens the table on the next Step.
- **A frame of play** costs the opponent's search (`table.thinkMs`, default 6 ms, only while it is thinking) plus a
  handful of sprites. The worst single step over about 14,000 frames of four whole games was between 5 and 27 ms
  across three runs (the suite thinks for 3 ms a frame).
- **The opponent's search runs at about 1.6 (Fanorona) to 22 (Oware) nodes a millisecond on the VM**, far slower than
  the RPG Maker MZ original in a browser, so each game has a node budget (`tpm_node_budget`): Morris and Fox and Geese
  12,000, Oware 40,000, Fanorona 5,000. The search deepens one ply at a time and, when the next ply would overrun the
  budget, plays the deepest search it finished. Novice, Regular and Sharp never reach it. In a crowded position a Morris
  Hustler or Master, a Fox and Geese Master or an Oware Master stops a ply or two short of the MZ edition's depth (in our
  suite's positions: Morris Master reached at least depth 3 of 5, Fox and Geese Master 4 of 5, Oware Master 7 of 8).
  The worst Master search we measured took 2.9 s of CPU, so at the default 6 ms a frame the Master answers within about
  8 seconds of play; raise `thinkMs` to answer sooner. The move is the same at any `thinkMs`.
- **The boards are painted by a shader**: a 560 x 560 board in about 9 ms on the GPU (painted per pixel on the VM it
  would take about 45 s).

## Fonts

The table is lettered in two faces rasterised into font resources: Cinzel Bold (names, counts, plaques) and Alegreya (the
rest), both SIL Open Font License 1.1. The licence texts and the notices are in `Taproom/fonts/`. The atlases carry
printable ASCII (32 to 126); a character outside that range is measured as nothing and not drawn.

## Verification

GameMaker code cannot be unit-tested outside the engine, so everything below ran in real executables built by GameMaker's
own compiler (Igor, runtime 2024.14.4.268):

- The rules, held to the RPG Maker MZ edition run in Node: 1,162 playout steps over the four games, every move list,
  result and evaluation exact.
- The opponent: 336 searches at grades 1 to 4. The 331 that finish their full depth inside the node budget match the
  MZ search exactly (move, score and node count); the 5 the budget stopped play exactly the deepest search they
  finished, and in each the next depth was checked to overrun the budget. 20 sliced searches give the one-call answer,
  and 12 Master searches (four positions a game) answered inside their budget.
- The board materials: 384 pixels and 24 noise samples exact against the MZ functions; the shader against its CPU twin
  over 10,368 pixels, worst difference 1 level, with a control that fails at another seed.
- The drawing: 179 drawings (32 boards, 54 men, 36 seed heaps, plaques, cards, the verdict and more), 14,075 paint
  operations each compared with the MZ edition's on colour, alpha, width, path and transform: 0 differ.
- The table: four whole games played by both sides to a verdict, a player's game driven by clicks (the rules card, a
  refused click, a concession), and the demo room's setting frame followed by the table.
- A fresh install of this package into a blank project running this Readme's code verbatim, with ink counted on
  everything it drew, and a generated adversarial pass of 184 calls (undefined, negative, huge and wrong-typed
  arguments) against the 46 functions documented above, with no crashes (1.1.0, 2026-11-07).

Two things this does not prove, stated plainly: the timings come from one shared machine and will differ on yours, and
the suite and the shader ran on Windows with the VM runtime only (other targets and YYC were not built).

## Licence

See `LICENSE.txt`. Use it in unlimited games, commercial or free; modify it freely; do not resell the package itself.

Made by Core Systems Asset Factory. Written with AI assistance, disclosed on every store page that carries it.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
