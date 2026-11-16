# Storied Systems — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Storied Systems  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/mz-storied-systems  
**Docs published:** 2026-11-16


---

# Storied Systems v1.0.0 for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

Four systems famous games are remembered for, built from your own database and art. Four parts, 11 plugin
files. Use one part, any two, or all four: each part works alone, and all four were tested on together.

| Part | What it does in your game | Files |
| --- | --- | --- |
| **Foresight** | Every enemy shows the move it has already chosen, drawn on a forecast plate: the kind of move, its element, the damage it will do to the party member it picked, the states it inflicts. A party member's attack that meets a telegraphed attack **clashes** with it. | `Foresight.js`, `ForesightCore.js`, `ForesightDraw.js` |
| **Aside** | Optional party skits. A paper tab offers a short scene; the player chooses to watch it, staged with your own face graphics over the map painted down. Party chat, and a skit log in the menu. | `Aside.js`, `AsideCore.js`, `AsideDraw.js` |
| **Papercut** | Your own character sheets and battlers re-struck as paper cutouts: a die-cut edge from each sprite's silhouette, a card back seen mid-turn, a lifted shadow, 20 paper stocks. Characters flip to turn. | `Papercut.js`, `PapercutCore.js` |
| **Delve** | Slay the Spire style run maps. Every run draws a branching chart, in ink and wash, through your own battles, events, shops and rest sites, with reward drafts and an act boss. | `Delve.js`, `DelveCore.js`, `DelveDraw.js` |

## Install

1. Copy every file in this download's `js/plugins/` folder into your project's `js/plugins/` folder.
2. Open the Plugin Manager and turn ON the files of each part you want: all three files of Foresight, Aside
   or Delve, both files of Papercut. Leave a part's files OFF to leave that part out.
3. Order: the Plugin Manager asks for each part's helper files (the `...Core` and `...Draw` files) above its
   main file. The code itself starts in any order (see below).
4. Start each part as its guide says: Foresight and Papercut need nothing (start a battle, or walk);
   Aside needs a Common Event with an `<Aside Skit>` comment; Delve needs the **Start run** plugin command
   on an event.

Every part's full guide (parameters, plugin commands, note tags, limits) is in the `Guides/` folder:
`Guides/Foresight.md`, `Guides/Aside.md`, `Guides/Papercut.md`, `Guides/Delve.md`.

## Using the four together

Measured in the engine with all 11 files ON, in a blank RPG Maker MZ project on MZ's own database:

- **A Delve battle shows Foresight's plates over Papercut's cutouts.** A run started with Start run opens a
  battle from the chart; every enemy in it is a paper cutout and every living enemy has a forecast plate.
- **An Aside skit plays on a map where Papercut has cut the party.**
- **The main menu carries both commands:** Skits (Aside) always, and Delve while a run is active.
- **One save carries all four parts,** and it still loads with any one part turned off afterwards.
- **Plugin order does not change the result:** the same checks pass with the files in alphabetical order,
  in reverse order, and in a shuffled order.
- Three engine methods are extended by both Aside and Delve (`Scene_Map.prototype.updateScene`,
  `Window_MenuCommand.prototype.addOriginalCommands`, `Scene_Menu.prototype.createCommandWindow`). Each part
  calls the original it saved, so both parts' additions run.

## Compatibility

- RPG Maker MZ 1.x. Tested on the MZ 1.10.0 runtime.
- Each part's guide lists its own limits. In short: Foresight supports MZ's default turn battles and Time
  Progress battles, front and side view, and does not support battle systems that re-order or re-decide
  actions (for example VisuStella's STB, CTB and OTB). Papercut cuts battlers in both front and side view.
- Tested with only these plugins loaded. No VisuStella plugin was loaded in these tests.
- No part loads an image, a font or a sound file: everything is drawn in code, or taken from your own
  project. Lettering uses Georgia and Palatino Linotype where the player's system has them, with a serif
  fallback.
- The battlers, faces, walking sprites, maps and halls in the store images are CSAF demo art and are **not
  included**. Every part draws around **your** content.

## Versions

Foresight 1.0.1, Aside 1.0.0, Papercut 1.0.0, Delve 1.0.0. Foresight 1.0.1 keeps a plate pushed against
the top of the screen by a tall battler fully on screen; the volume's own test found it, with Papercut's
cut prints on (see `Guides/Foresight.md`, Changes).

## Already own the MZ Plugin Library?

All four parts are also inside the MZ Plugin Library (https://csaf.itch.io/mz-plugin-library), byte for byte
the same files. If you own the Library, you already have Storied Systems.

## Licence

See `LICENSE.txt`. Every line of code was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
