# Picture Parlour: 4 Minigames From Your Pictures + a Prize Counter for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Picture Parlour: 4 Minigames From Your Pictures + a Prize Counter for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-27


---

# Picture Parlour v1.0.0 for RPG Maker MZ

By Core Systems Asset Factory (https://csaf.itch.io).

Four finished minigames built from your own pictures and database, and a parlour that hosts them: 14 plugin files in five
parts. The parlour is a drawn room with four cabinets, a ticket roll and a prize counter. Each game pays tickets by how
well it went, and the counter trades them for items from your own database.

| Part | What it does in your game | Files |
| --- | --- | --- |
| **Parlour** (new) | The plugin command *Open the parlour* (plugin **Parlour**) pushes a drawn room: four cabinets, each with a small picture of its game made from your own picture or item icons, the ticket roll, and a prize counter of your own items with their icons and ticket prices. Keys: Left and Right walk the cabinets and the counter, Up and Down walk the prizes, OK plays or buys, Cancel leaves. Mouse and touch: tap a cabinet or a prize to pick it, tap it again to play or buy, tap the LEAVE sign (or right click) to leave. No MZ window is drawn in it. | `ParlourCore.js` + `Parlour.js` |
| **Rebus** | Picture word puzzles made from your own icons, faces and battlers. | `RebusCore.js` + `RebusDraw.js` + `Rebus.js` |
| **Leadlight** | A brick breaker whose wall is a stained-glass window cut from one of your pictures. | `LeadlightCore.js` + `LeadlightDraw.js` + `Leadlight.js` |
| **Sapper** | Minesweeper over one of your pictures, every field solvable without a guess. | `SapperCore.js` + `SapperDraw.js` + `Sapper.js` |
| **Rummage** | Seek-and-find scenes composed from your own items, scattered over a drawn surface and buried in drawn clutter. | `RummageCore.js` + `RummageDraw.js` + `Rummage.js` |

Every game also works on its own, from its own plugin commands in an event, exactly as its guide says. The parlour only
adds a reason to play them in one place. The four games' files are the same files their own downloads ship, so if you
already own one of them you can overwrite it with the copy here.

## Install

1. Copy every file in this download's `js/plugins/` folder into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add each file, ON. Any order works; this order reads best: RebusCore, RebusDraw, Rebus,
   LeadlightCore, LeadlightDraw, Leadlight, SapperCore, SapperDraw, Sapper, RummageCore, RummageDraw, Rummage,
   ParlourCore, Parlour.
3. In Parlour's parameters, name a picture from `img/pictures` for Leadlight and Sapper. Without one those two cabinets
   are greyed and say so; a name whose file is missing greys them too and names the picture.
4. In an event, call the plugin command *Open the parlour* (plugin **Parlour**).

Every game's full guide is in the `Guides/` folder: `Guides/Rebus.md`, `Guides/Leadlight.md`, `Guides/Sapper.md`,
`Guides/Rummage.md`. They are the parts' own guides, unchanged.

**On a stock project, day one:** the counter shows MZ's own item icons and prices (the store images use our demo
pictures and icons, which are not in this download), and the Leadlight and Sapper cabinets wait for a picture.

## Parameters (plugin Parlour)

| Parameter | Default | What it does |
| --- | --- | --- |
| Picture for Leadlight and Sapper | (blank) | The picture the glass and the minefield are cut from. It is marked required, so deploying with "Exclude unused files" keeps it. |
| Tickets a minute of worth | 10 | A game at 100% pays this many tickets for every minute it is worth. |
| Perfect game bonus | 5 | Extra tickets for a game won outright. |
| Untimed game worth (minutes) | 3 | What Leadlight, Sapper and an unclocked Rummage are worth. |
| Gold a ticket | 10 | A prize costs its database price divided by this, rounded up. |
| Prizes when none are tagged | 12 | How many priced rows the counter offers when nothing is tagged. |
| Rebus rounds / Rebus seconds a round | 5 / 20 | The Rebus game the cabinet starts, and its clock. |
| Rummage things to find / Rummage seconds | 6 / 90 | The Rummage game the cabinet starts (3 to 12 things), and its clock (0 = no clock). |

The cabinets always start each game the same way: Rebus in its mixed mode with the rounds and seconds above, Leadlight
and Sapper with their own defaults on the one picture above (Leadlight: an 85% target and 3 balls), Rummage on normal
with 2 hints. For other settings, start a game from its own plugin command in an event instead; it pays no tickets there.

## Tickets

A cabinet pays **tickets a minute of worth x the minutes the game is worth x how well it went**, plus the bonus for a
perfect game. What a game is worth comes from its own settings: a timed game is worth its clock (Rebus rounds x seconds,
Rummage seconds), an untimed one *Untimed game worth*. **How long a game took never changes the pay**, so finishing fast
earns exactly what finishing slowly does. How well it went is read from the game's own result: Rebus, the share of
puzzles solved; Leadlight, the share of its target broken (1 when cleared); Sapper, the share of the field cleared (1
when cleared); Rummage, the share of things found (1 when the hunt is won). With the defaults a perfect game pays 35 at
Leadlight or Sapper, about 22 at Rebus and 20 at Rummage. Fractions of a ticket are kept with the save and paid when they
add up to a whole one.

## Prizes

Put `<Parlour Prize>` in the note of any item, weapon or armour to sell it at the counter for its price divided by
*Gold a ticket*, rounded up. `<Parlour Prize: 40>` sets the ticket price, `<Parlour Stock: 1>` limits how many can be
bought. A tagged row with a database price of 0 costs 1 ticket and the console says so, naming it; give it
`<Parlour Prize: N>`. With no tag anywhere, the counter offers up to 12 (*Prizes when none are tagged*) items, weapons
and armour that have a price, spread from the cheapest to the dearest. Rows whose name starts with dashes (MZ's own
`-----Armors` dividers) are never prizes. Arrows on the counter show when more prizes are above or below.

## Plugin commands (plugin Parlour)

- *Open the parlour*
- *Give tickets*: a count, which may be negative; the total never goes below 0.
- *Tickets to a variable*

## Notes

- The tickets, the games played and the prizes bought are saved with the game (`$gameSystem`).
- The parlour passes no variables or switches to the games, so your own are untouched.
- A game that is not ON greys its cabinet and names its file.
- A bought prize says "Got" and its name on the ticket roll; a paid game says the tickets and its own result there
  (for example "+13 · 38% of 85%" for Leadlight, whose pay is its share of the target).
- Each lit stub on the roll stands for 10 tickets.

## Compatibility

Parlour adds one scene and its plugin commands. It starts each game through that game's own command or script call and
reads the result each game already produces; for Leadlight and Sapper it extends their scenes' `leave` method, saving the
original and calling it. The four games' compatibility notes are in their guides.

## Licence

See `LICENSE.txt`. This product was made with AI tools: the code was produced with AI assistance, everything it draws in
your game is drawn by that AI-written code, and the store images were made with AI tools too.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
