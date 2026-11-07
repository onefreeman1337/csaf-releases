# Colosseum: Tournament Brackets and Crests for GameMaker — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Colosseum: Tournament Brackets and Crests for GameMaker  
**Engine:** GameMaker 2024+  
**Store page:** https://csaf.itch.io/colosseum-gamemaker  
**Docs published:** 2026-11-07


---

# COLOSSEUM - Tournaments Your Game Draws, for GameMaker

**Your game already decides who wins a fight. This runs the tournament around it, and draws it.**

Colosseum seeds a field by rating, draws a single-elimination bracket or a round-robin league, carries winners
forward, knocks losers out, levels the rivals who keep surviving, and then **draws the whole thing** - a struck
board, a plate for every tie, inked feed lines from round to round, a laurelled champion's plate, and a ruled
league table.

And every rival carries a **standard**: a coat of arms generated from its own key.

- **the silhouette** is one of six - heater, iberian, banner, lozenge, pennon, cartouche
- **the field** is divided one of eight ways - plain, per pale, per fess, per bend, per bend sinister, quarterly,
  per saltire, gyronny - between a colour and a metal
- **an ordinary** is laid across it in a second colour - fess, pale, bend, chevron, cross or saltire
- **a device** is struck in the metal - tower, sun, crescent, spear, wheel, skull, trident, key, flame or anvil

That is **46,080 distinct coats of arms**, every one drawn from geometry at whatever size you ask for. No sprite,
no sprite sheet, no atlas, no shader, no surface kept. A rival's arms are the same on every machine and in every
save, because they are hashed from the rival's own key.

Pure GML. Built and tested on GameMaker runtime **2024.14.4.268**.

---

## Quickstart

1. **Tools > Import Local Package**, pick `Colosseum.yymps`, import everything.
2. Enter a field and draw the bracket (Create event):

```gml
my_cup = csm_create({ title: "The Colosseum" });
csm_add_team(my_cup, "ironjaw", "Ironjaw of the Pits", 92);
csm_add_team(my_cup, "vellis",  "Vellis the Quick",    88);
csm_add_team(my_cup, "mourn",   "The Mourning Knight", 81);
csm_add_team(my_cup, "braxa",   "Braxa Redhand",       77);
csm_start(my_cup, "single");        // or "league"
```

`rating` drives the seeding and **nothing else** - your game decides who actually wins. A field that is not a
power of two is padded with byes, and a first-round bye is resolved at the draw, so the board never shows a rival
playing nobody. **Nothing throws**: a duplicate id, a team with no id, a field of one, a second draw, a rival
arriving after the draw - each is kept out and reported in `csm_problems(my_cup)`, so a half-written field still
runs.

3. Ask what to play next, and tell it what happened:

```gml
var _tie = csm_next_match(my_cup);
if (_tie != undefined) {
    // ... run YOUR fight between _tie.a and _tie.b ...
    csm_report(my_cup, _tie.id, winner_id, score_a, score_b);
}
```

`csm_report` carries the winner into the next round, marks the loser out of an elimination draw, counts the
round survived, and levels the rivals who are still standing. Pass `""` as the winner in a **league** to record a
draw. It returns `false` and changes nothing for a replay, an outsider, an unknown tie, or a tie whose places are
not both filled.

4. Draw it (Draw GUI event):

```gml
csm_board_draw(my_cup, 0, 0, display_get_gui_width(), display_get_gui_height(), "arena");
```

That is the whole integration. Three styles ship - `"arena"`, `"vellum"` and `"night"` - and `csm_board_styles()`
lists them. For a league, draw the ruled table instead - the same arguments:

```gml
csm_table_draw(my_cup, 0, 0, display_get_gui_width(), display_get_gui_height(), "vellum");
```

Reading the tournament back, wherever your own UI needs it:

```gml
var _table   = csm_standings(my_cup);              // best first: points, wins, fewer losses, then id
var _winner  = csm_champion(my_cup);               // "" until it is decided
var _done    = csm_is_over(my_cup);
var _ties    = csm_round_of(my_cup, 2);            // every tie in one round, in slot order
var _name    = csm_round_name(my_cup, 2);          // "Final", "Semi-final", "Quarter-final", "Round N"
var _rival   = csm_team(my_cup, "ironjaw");        // wins, losses, draws, points, level, seed, out
var _all     = csm_matches(my_cup);                // the whole draw, in draw order
var _one     = csm_match(my_cup, "m0");            // one tie by id
var _count   = csm_team_count(my_cup);
var _seeded  = csm_seed(my_cup);                   // the field sorted by rating, seeds stamped
var _where   = csm_board_layout(my_cup, 0, 0, 1200, 700);   // every plate's position, without drawing
```

**Give the board room.** Every plate, standard and label is solved from the rect you hand it, so nothing can
overflow at any size, but a sixteen-rival draw wants about **1200 px of width** before the round-one names stop
shrinking. Below roughly 240x160 `csm_board_draw` returns `undefined` and draws nothing rather than drawing
something illegible.

---

## The standard is the part your players will look at

Every entrant's arms come from its `colour_key`, which defaults to its id. Set it and the arms are pinned, so
you can rename a rival freely:

```gml
csm_add_team(my_cup, "r_07", "The Silt Widow", 66, { colour_key: "house_silt" });
```

Draw one anywhere - a roster row, a versus screen, a banner over a gate:

```gml
csm_draw_standard(x, y, 64, 64, csm_standard(my_cup, "r_07"));
```

**A standard does not need a tournament.** `csm_standard_from_key("house_silt")` strikes arms for a guild, a
town, a faction or a player's chosen house name, with no state involved:

```gml
csm_draw_standard(x, y, 128, 128, csm_standard_from_key(player_house_name));
```

And `csm_blazon(std)` describes it the way a herald would - *"per bend azure and or, a bend vert, a skull"* -
derived from the same indices the picture is drawn from, so the words can never drift from the arms.

### How it stays readable

The device is always struck in the **metal** and outlined in a dark ink, so it brackets the lightness range and
reads on every surface it can lie on. Measured over all 768 field combinations, the smallest gap between the
metal and any colour it sits against is **0.32** in relative luminance. The one place hue alone does not separate
them is where a device overlies the metal half of a divided field; there it is separated by its relief and its
outline instead, which is why every device carries both.

---

## What you get

| Script | What is in it |
| --- | --- |
| `csm_core` | the tournament: entrants, weighted seeding, the draw, results, elimination, levelling, standings, save and load. Pure GML - no drawing, no instances, no globals. |
| `csm_board` | the drawn board, the league table, and the standard generator. |
| `csm_demo` | the twelve-rival sample field, a demo that plays itself, and the demo screen. |
| `csm_bake` | renders the store sheets through the product's own draw code. |
| `csm_selftest` | the in-engine suite, 75 assertions. |
| `obj_csm_demo`, `rm_csm_demo` | the runnable demo room. |

**Open `rm_csm_demo` and press Play.** SPACE settles the next tie, A runs the tournament out, R redraws it, L
swaps between a bracket and a league, S cycles the three styles.

### The full API

**The tournament** - `csm_create` · `csm_is_state` · `csm_add_team` · `csm_team` · `csm_teams` ·
`csm_team_count` · `csm_problems` · `csm_seed` · `csm_start` · `csm_matches` · `csm_match` · `csm_next_match` ·
`csm_report` · `csm_standings` · `csm_champion` · `csm_is_over` · `csm_round_of` · `csm_round_name` · `csm_save` ·
`csm_load` · `csm_num` · `csm_hash` · `csm_pick`

**The standard** - `csm_standard` · `csm_standard_from_key` · `csm_draw_standard` · `csm_blazon` ·
`csm_standard_colours` · `csm_band_index` · `csm_standard_shapes` · `csm_standard_charges` ·
`csm_standard_divisions` · `csm_standard_ordinaries` · `csm_standard_tinctures` · `csm_standard_tincture_names` ·
`csm_standard_metals` · `csm_standard_metal_names` · `csm_standard_outline` · `csm_standard_room` ·
`csm_charge_parts` · `csm_charge_extent` · `csm_lum` · `csm_is_convex` · `csm_contains`

**The board** - `csm_board_draw` · `csm_table_draw` · `csm_board_layout` · `csm_board_styles` · `csm_board_style`

**The demo** - `csm_demo_field` · `csm_demo_state` · `csm_demo_play_one` · `csm_demo_play_all` · `csm_demo_draw` ·
`csm_demo_bar`

Every public script carries a header block saying what it takes, what it returns and what it refuses. Every
global and macro is namespaced `csm_` / `CSM_`, so nothing here can collide with your project.

**Changed in 1.1.0:** the prefix was `cls_` / `CLS_` in 1.0.0, which our Cloudshadow package also uses, so the
two could not be imported into one project. Every name is now `csm_` / `CSM_`: the scripts (`cls_add_team`
became `csm_add_team`), the demo object (`obj_csm_demo`) and the demo room (`rm_csm_demo`). `csm_lum`,
`csm_standard_outline` and `csm_demo_bar` now refuse an argument of the wrong type instead of stopping the game.
Nothing else changed, and a save written by 1.0.0 still loads. If you imported 1.0.0, delete what it added before importing 1.1.0 (its
scripts start `cls_`, and its demo object and room carry `cls` in their names), then rename your own calls from
`cls_` to `csm_`.

---

## Saving

```gml
var _blob = csm_save(my_cup);        // a JSON string: entrants AND the draw
csm_load(my_cup, _blob);             // true when it loaded
```

A bracket **is** the run, so the save carries both. Anything unreadable is refused and leaves your tournament
untouched rather than half-loaded.

---

## What was actually tested

- **A real Igor build**, runtime `2024.14.4.268`, exit 0, 0 errors, 0 warnings, 178 resources compiled. The gate
  was proven able to fail on this package: a deliberate syntax break took it to *"NOT CLEAN - exit 1, 2 errors"*
  naming the `csm_board` script at line 44, and the file was then restored byte-identical.
- **75 assertions, in engine, on the built executable** (`Colosseum.exe -selftest`), all passing. They cover the
  seed order's defining properties at three field sizes, the draw and its byes, elimination and levelling with a
  control, the league and its table, save and load, the six silhouettes' convexity with a control, the clip and
  the inset with controls, the colour contract over all 768 field combinations, device containment over all 60
  shield-and-device pairs with an oversized control, every ordinary covering the point its device is struck at,
  and the board layout - every plate inside its rect, no two overlapping, each tie centred on the two that feed
  it.
- **Every image on the store page was rendered by this package** (`Colosseum.exe -bake`), through the same
  `csm_board_draw`, `csm_table_draw` and `csm_draw_standard` you will call.

There is one thing the suite cannot check and this Readme will not pretend otherwise: **no assertion can see a
picture.** Every sheet was rendered and looked at, and three devices were rebuilt because of what was on the
screen rather than what a number said - the crescent was drawn upside down, the flame read first as a bud and
then as a crown, and the tower's gateway was wide enough to make it read as a horseshoe.

---

## Licence

One commercial licence, unlimited games, no attribution required. Redistributing the source as an asset is not
permitted. See `LICENSE.txt`.

**AI disclosure:** this package's code and graphics were generated with AI assistance. There are no sound
assets and no authored narrative text.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
