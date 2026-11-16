# Arcade Cabinet - Three Complete Minigames for GameMaker in Pure GML: Peggle-Style Pegfall, SkiFree-Style Schuss and a Game-Show Quizmaster — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Arcade Cabinet - Three Complete Minigames for GameMaker in Pure GML: Peggle-Style Pegfall, SkiFree-Style Schuss and a Game-Show Quizmaster  
**Engine:** GameMaker 2024+  
**Store page:** https://csaf.itch.io/arcade-cabinet-gamemaker  
**Docs published:** 2026-11-16


---

# Arcade Cabinet - Three Minigames for GameMaker

**Arcade Cabinet is three complete minigames for GameMaker (2024.14, tested on runtime 2024.14.4.268) in pure GML, each
with its own runnable demo room: Pegfall (peg boards), Schuss (downhill runs) and Quizmaster (game-show quizzes).** Drop
one, two or all three into your game. They share no script, object, room, font or macro name, and all three were imported
into one blank GameMaker project and built together before this download was made. No sprite or image art ships: every
board, slope, stage and contestant is drawn in code (the only image files are the twelve font atlases, four per part).
One commercial licence covers all three in all your games.

Every picture on the store page was rendered by these packages in a blank GameMaker project.

---

## What is in the download

| Folder | Part | What it is |
| --- | --- | --- |
| `01-pegfall/Pegfall_GameMaker/` | **Pegfall** | A peg-board shooter. Boards are generated from a seed by 10 layout grammars in 6 drawn themes, and every board is proven clearable. A launcher whose aim guide runs the same physics as the shot, a moving bucket, three powers, a slow zoom on the last target and a fever finish. Demo room `rm_pgf_demo` (THE PARLOUR). |
| `02-schuss/Schuss_GameMaker/` | **Schuss** | A SkiFree-style downhill run. 5 modes (ski, snowboard, sled, mine cart on rails, raft on a river) x 3 goals (slalom against the clock, collect coins, escape a pursuer). Every course is generated from a seed and ridden once by the package's own autopilot before anyone sees it. 42 drawn course pieces across three worlds. Demo room `rm_shs_demo` (THE SLOPES). |
| `03-quizmaster/Quizmaster_GameMaker/` | **Quizmaster** | A game-show quiz written from YOUR game's records. Register an array of structs and name the fields worth asking about; it writes multiple-choice questions and asks one only when exactly one answer is right. Up to three rival contestants at three skill levels, or a solo exam with a pass mark, on 6 drawn stages. Demo room `rm_qzm_demo` (THE QUIZ HALL). |

Each part folder holds exactly what that part ships on its own:

- `<Part>.yymps` - the package you import into GameMaker.
- `<Part>/` - the same project as raw, readable `.gml` and `.yy` files, so you can read every line without GameMaker.
- `Readme_for_Users.md` - that part's full guide: install, demo keys, a Quickstart, the whole API, the measured numbers and
  its limits. **Read it before you use the part.**
- `LICENSE.txt` - that part's licence text (the same terms as the volume licence beside this file).

## Install

1. In GameMaker: **Tools > Import Local Package**, choose a part's `.yymps` (for example
   `01-pegfall/Pegfall_GameMaker/Pegfall.yymps`), **Add All**, **Import**.
2. Repeat for each part you want. Import one, two or all three, in any order.
3. To see a part's demo, put its demo room first in the room order and run the project:

| Part | Demo room | Script prefix | Macro prefix | Fonts |
| --- | --- | --- | --- | --- |
| Pegfall | `rm_pgf_demo` | `pgf_` | `PGF_` | `fnt_pegfall_*` (4) |
| Schuss | `rm_shs_demo` | `shs_` | `SHS_` | `fnt_schuss_*` (4) |
| Quizmaster | `rm_qzm_demo` | `qzm_` | `QZM_` | `fnt_quizmaster_*` (4) |

GML's global namespace is flat, so every public script, macro, global and resource of each part carries its own prefix.
Two parts never define the same name, which is why all three can live in one project.

One file to know about: each package also carries a loose `fonts/THIRD-PARTY-NOTICES.txt` (not a resource) naming that
part's own display font, at the same path in all three. If you import more than one part, those copies land on the same
path in your project folder. Keep this download as the record: each part's `fonts/` folder here holds its own notice. The
two OFL licence texts beside it are identical in all three parts.

## Using a part in your game

Each part keeps its game logic and its drawing apart, and hands results back to your code as plain structs and events
rather than taking over your rooms. The Quickstart in each part's own Readme is the shortest path:

- **Pegfall:** `pgf_board_create(seed, theme, layout)` makes a board, `pgf_game_create(board, { balls: 10 })` a game on it;
  step it with `pgf_game_step` and read `game.events` (a `"won"` event carries the score).
- **Schuss:** `shs_run_create({ mode: "ski", goal: "slalom", seed: 7, difficulty: 3 })` makes a run; step and draw it as
  that part's Readme shows, and read the result when it ends.
- **Quizmaster:** `qzm_book_create()` and `qzm_book_add(book, setName, records, ...)` register your records; the part's
  Readme shows how a show is written from them, run and read back.

## Compatibility and limits

- GameMaker 2024.14, built and tested on runtime 2024.14.4.268, Windows (VM). HTML5, mobile and YYC were not built.
- GML cannot be unit-tested outside the engine. Every number in the part Readmes came from real Igor-built executables
  running each part's own in-engine suite, and the "all three in one project" claim above came from a real Igor build of a
  blank project with all three packages imported.
- Each part was written against the GMS2 runtime. GameMaker's new runtime (GMRT) was not tested.

## Licence

`LICENSE.txt` beside this file: one commercial licence, unlimited games, covering all three parts. You may ship anything you
BUILD with these packages; you may not resell the packages themselves.

## AI disclosure

These packages were written with AI assistance. That is disclosed on the store page and in every licence file.

---

Arcade Cabinet 1.0.0 · Pegfall 1.0.0 · Schuss 1.0.0 · Quizmaster 1.0.1 · Core Systems Asset Factory · https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
