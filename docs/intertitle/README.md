# Intertitle — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Intertitle  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/intertitle  
**Docs published:** 2026-11-05


---

```
  ┌───────────────────────────────────────────────┐
  │                                               │
  │          I  N  T  E  R  T  I  T  L  E         │
  │          ─────────────  ✦  ─────────────       │
  │    Every place and every boss announces       │
  │     itself, with a card drawn from its data.  │
  │                                               │
  │              RPG MAKER MZ PLUGIN · v1.0.0     │
  │                                               │
  └───────────────────────────────────────────────┘
```

**Intertitle replaces RPG Maker MZ's plain map-name strip with a composed title card,** and holds
the start of a boss battle for the boss's own card. Every card is drawn in code at run time from data
you have already written: the map's name, its tileset, where it sits in your map tree, what its
encounters strike with; the enemy's element, its skills, its weaknesses and where it ranks in your
database. **Nothing here is an image file.**

---

## What is in the box

| | |
| --- | --- |
| `js/plugins/Intertitle.js` | The parameters, the plugin commands and the engine hooks. The only file that touches RPG Maker. |
| `js/plugins/IntertitleRead.js` | The reader. Turns a map's or an enemy's data into a card profile. Knows nothing about RPG Maker. |
| `js/plugins/IntertitleRender.js` | The painter. Draws a card from a profile. Knows nothing about RPG Maker. |
| `fonts/Intertitle-Display.woff2` | IM Fell English SC — the name on the card. |
| `fonts/Intertitle-Epithet.woff2` | IM Fell English Italic — the line beneath it. |
| `fonts/OFL-IMFellEnglishSC.txt`, `fonts/OFL-IMFellEnglish.txt` | The SIL Open Font Licence for each face. See **Fonts and licences**. |

---

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder and switch them on in the
   Plugin Manager. **Any order works** — each file looks its siblings up the first time it needs
   them, including the alphabetical order you get by dragging the folder in, which puts
   `Intertitle.js` first.
2. Copy the two `.woff2` files into your project's `fonts/` folder. Without them the lettering falls
   back to Georgia or Times. It never uses RPG Maker's own font, and a missing font file cannot stop
   your game from booting (the faces load through the browser's `FontFace` loader, not `FontManager`).
3. That is all. Give a map a **Display Name** in its map properties and its card appears when the
   player arrives.

---

## The two cards

**The map card.** When MZ would show a map's name, the card rises instead: the name, an epithet
("beneath Greyfell"), a rule tinted by how dangerous the map's encounters are for the current party,
small marks for the maps nested under it, and a device drawn from the place. The first visit and a
return differ: a return is plainer, with no epithet. A map with no Display Name gets no card, exactly as
in stock MZ.

**The boss card.** When a battle starts against a boss, the battle waits while the boss's seal is
shown: its name, an epithet, a device from the element it fights with, a fault line for its weakness,
and rays for how high it stands in your database. A boss is any enemy with MZ's own
**Collapse Effect: Boss** trait, or any enemy tagged `<intertitle boss>`.

### How a card is composed

- **The construction** comes from the map's tileset: a world-map tileset gets an inked map
  cartouche; an outdoor one a woodcut board; an indoor one a gilt lacquer panel; a dungeon a carved
  stone lintel; a science-fiction one a riveted plate. Renamed tilesets are read by their words, and
  anything unreadable falls back to MZ's own world/field mode flag.
- **The device** comes from the element the map's encounters strike with most (read by the element's
  NAME, so renamed elements still work), or, with no element, from the construction. A boss's device
  comes from its attack element, then from the elements of its own skills, then from its strongest
  resistance, then from whether it leans on Attack or Magic.
- **The epithet** comes from the map's parent in your map tree. A boss's epithet comes from its device.

---

## Notetags — the hand always wins

In a **map's** note box:

```
<intertitle name: Greyfell Deeps>       the name on the card
<intertitle epithet: where lamps die>   the line beneath it
<intertitle treatment: stone>           cartouche woodcut lacquer stone plate
<intertitle charge: flame>              the device on the card
<intertitle parent: Greyfell>           what the place hangs from
<intertitle skip>                       no card for this map
```

In an **enemy's** note box:

```
<intertitle boss>                       this enemy always gets a boss card
<intertitle boss: off>                  this enemy never does
<intertitle name: The Ember Warden>     the name on the card
<intertitle epithet: Who Burns>         the line beneath it
<intertitle charge: flame>              the device on the seal
```

The fifteen devices a `charge` notetag can name: `flame` `crystal` `bolt` `wave` `stone` `gust` `sun`
`moon` `compass` `tree` `key` `arch` `cog` `blade` `rune`. A word that is not on this list is ignored
and the device Intertitle derived stays, so a typo never leaves a blank card.

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Show Map Card** | Shows the current map's card now, for example after a cutscene. |
| **Show Boss Card** | Shows an enemy's boss card now. |

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Map cards | `true` | Replace the stock map-name strip with a card. |
| Boss cards | `true` | Hold the start of a boss battle for the boss's card. |
| Auto-detect bosses | `false` | Also treat the top tenth of your database by max HP as bosses. |
| Map card height | `150` | Height of a map card in pixels (80–320). |
| Boss card height | `190` | Height of a boss card in pixels (100–360). |
| Hold (frames) | `150` | How long a card stays up (30–600). 150 matches MZ's own map-name window. |
| Font folder | `fonts/` | Where the two `.woff2` files live. |

---

## Compatibility

Only `Intertitle.js` touches RPG Maker. Every core method it touches is **extended**: the original is
saved and called through — `Scene_Boot.start`, `Game_System.initialize`,
`Scene_Map.createMapNameWindow`, `Scene_Map.snapForBattleBackground`, `Window_MapName.open`,
`Window_MapName.update` and `Scene_Battle.start`. It also defines `Scene_Battle.isBusy`, which
`Scene_Battle` otherwise inherits from `Scene_Base`; it calls the inherited method first and only adds
"while a boss card is playing".

**The stock map-name window keeps running.** It is hidden, not removed, so a plugin that reads it still
works. If another plugin draws its own map-name display, turn **Map cards** off.

**Saves.** The maps and bosses the player has seen are stored on `Game_System` in a small, versioned
slot, so first visits and returns survive saving and loading. Adding Intertitle to a game in progress
is safe: an older save simply starts with nothing seen.

---

## Fonts and licences

The two bundled typefaces are **not** covered by the product licence. They are IM Fell English SC and
IM Fell English Italic, third-party fonts under the SIL Open Font License 1.1. Each face's copyright
notice is at the top of its licence file (`OFL-IMFellEnglishSC.txt`, `OFL-IMFellEnglish.txt`), and the
OFL governs those two files, including redistribution inside your game.

Everything else the plugin draws is drawn in code. No other third-party asset is included, and no RPG
Maker RTP art is used or required.

**The cards are yours.** Anything Intertitle draws from your own maps and enemies is your output — put
it in your game, your trailer and your screenshots freely. See `LICENSE.txt` for the full terms.

---

## AI disclosure

The code and the graphics in this product were produced with AI assistance. No sounds ship with it.
The only words it adds are the short epithets a boss card uses when you have not written your own.

---

*Intertitle v1.0.0 · RPG Maker MZ · Core Systems Asset Factory · https://csaf.itch.io*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
