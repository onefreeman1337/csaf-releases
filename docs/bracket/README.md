# Bracket — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Bracket  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/bracket  
**Docs published:** 2026-11-05


---

```
  ┌───────────────────────────────────────────────┐
  │                                               │
  │             B  R  A  C  K  E  T               │
  │            ──────────  ⚒  ──────────          │
  │    Every shop hangs its own sign, composed    │
  │        from what it actually sells.           │
  │                                               │
  │              RPG MAKER MZ PLUGIN · v1.0.0     │
  │                                               │
  └───────────────────────────────────────────────┘
```

**Bracket reads the Shop Processing already in your events.** For every shop it finds, it
hangs a wrought-iron bracket over the door with a painted board on it: a trade device composed
from the goods that shop actually stocks, the shop's name in carved or gilt capitals, the trade
in small caps beneath, and weathering keyed to how prosperous the district is.

Change a shop's stock and its sign re-composes. **Nothing here is an image file.** Every sign is
drawn in code at run time, so the shop you add tomorrow is signed tomorrow, without anyone
opening a paint program.

---

## What is in the box

| | |
| --- | --- |
| `js/plugins/BracketCompose.js` | The geometry and the colour. Board outlines, trade devices, ironwork, grain and weather. Knows nothing about RPG Maker. |
| `js/plugins/BracketRead.js` | The reading. Turns a shop's own goods list into the sign it hangs — device, board, bracket, scheme, weathering. Knows nothing about RPG Maker. |
| `js/plugins/BracketRender.js` | The painting. Lands the oak, the paint, the gilt, the iron and the grain on a bitmap. Knows nothing about RPG Maker. |
| `js/plugins/Bracket.js` | The two scenes, the plugin parameters and the plugin commands. The only file that touches the engine. |
| `fonts/Bracket-Display.woff2` | Cinzel Bold — the name on the board and the directory heading. |
| `fonts/Bracket-Body.woff2` | Alegreya — the trade line and the captions. |
| `fonts/OFL-Cinzel.txt`, `fonts/OFL-Alegreya.txt` | The SIL Open Font Licence for each face. Both are redistributable; see **Fonts and licences** below. |

---

## Install

1. Copy the four `.js` files into your project's `js/plugins` folder and switch them on in the
   Plugin Manager. The order that reads best in the list is:

   1. `BracketCompose.js`
   2. `BracketRead.js`
   3. `BracketRender.js`
   4. `Bracket.js`

   **Nothing depends on that order.** Every file looks its siblings up the first time it needs
   them rather than when it loads, so any order works — including the alphabetical one you get
   by dragging the folder in, which puts `Bracket.js` first, ahead of the composer, the reader
   and the painter it uses. That is the order this plugin is tested, gated and captured in.

2. Copy the two `.woff2` files from `fonts/` into your project's own `fonts/` folder.

   Optional but recommended. Without them the lettering falls back to Cinzel, Georgia or Times,
   and the trade line to Alegreya, Georgia or Times. **It never falls back to RPG Maker's own
   font**, and a missing font file can never stop your game from booting — the faces are loaded
   through the browser's own `FontFace` loader rather than through `FontManager`, which throws
   at boot on a file it cannot find.

3. That is the whole installation. There is nothing to configure before you see signs: open a
   map that has a shop event on it and the sign is already hanging.

---

## The four places a player meets a sign

| Where | What happens |
| --- | --- |
| **Over the door** | Every event carrying a Shop Processing command gets its sign hung above it on the map, automatically. Turn this off with the **Hang signs on the map** parameter. |
| **The Close Look** | The sign at full size over a dusk street the plugin draws, swinging gently on its chain. Plugin command **Close Look**, or `CSAF.Bracket.closeLook(id)`. |
| **The Directory** | Every sign the player has met, hung on the rails of the Signwright's Yard and grouped by district. Menu command **Signs**, plugin command **Open Yard**, or `CSAF.Bracket.openYard()`. |
| **The shop header** | The same sign above the goods windows in the shop scene. Turn this off with the **Sign above the shop** parameter. |

---

## How a sign is composed

A sign is four choices and a state of repair, and every one of them is read out of your project
rather than rolled at random:

- **The device** — the one silhouette on the board — is scored from what the shop *stocks*: the
  item kind, the equipment slot, the effect codes on its items, and the price ladder of your own
  database. The words in the goods' names are a second, weaker voice, and the shop's own name is
  a third. Twelve devices: sword-and-anvil, shield, flask, herb, gem, scroll, loaf, tankard, key,
  shears, fish, horseshoe.
- **The board** — ten cut outlines: heater, oval, lozenge, hanging, arch, banner, keyhole,
  barrel-end, tankard-cut, scroll-end. The board is cut to the *name* it has to carry, so a long
  name gets a longer board.
- **The bracket** — eight wrought forms, poorest to grandest: plain hook, bar-and-ring, single
  scroll, double scroll, volute, leaf scroll, gallows, crowned scroll. Standing is meant to be
  visible from across the street.
- **The scheme** — six paint schemes: bare oak, verdigris, oxblood, indigo, mustard, gilt oak.
- **The weathering** — 0 crisp to 4 falling apart, keyed to the district's prosperity: corner
  wear, dulled gilt, peeling paint, rust bleeding from the rings, a cracked corner, a missing
  chain link.

That is 12 × 10 × 8 × 6 = **5,760 distinct sign forms**, each in five states of repair.

---

## Notetags — the hand always wins

Anything you type by hand overrules what the reader worked out. In an **event's** note box:

```
<sign: The Gilded Tankard>     the name on the board
<sign trade: VINTNER>          the line in small caps beneath it
<sign device: tankard>         swordAnvil shield flask herb gem scroll
                               loaf tankard key shears fish horseshoe
<sign board: oval>             heater oval lozenge hanging arch banner
                               keyhole barrelEnd tankardCut scrollEnd
<sign bracket: volute>         plainHook barAndRing singleScroll
                               doubleScroll volute leafScroll gallows
                               crownedScroll
<sign scheme: verdigris>       oak verdigris oxblood indigo mustard giltOak
<sign weathering: 3>           0 crisp .. 4 falling apart
<sign: skip>                   never hang a sign on this event
```

An event with **no** Shop Processing can still carry a sign: give it `<sign: The Wayfarer>` and
`<sign device: key>` and it hangs like any other. That is how you sign a guild hall, a temple or
a locked door.

In a **map's** note box:

```
<district: The Gilt Quarter>   the heading this map's signs sit under in the directory
<prosperity: 4>                0 destitute .. 4 rich. Sets the weathering for the whole street.
```

---

## Plugin commands

| Command | What it does |
| --- | --- |
| **Close Look** | Opens the full-size Close Look on one event's sign. Event `0` means the event running the command. |
| **Open Yard** | Opens the directory of every sign the player has met. |
| **Show Sign Picture** | Draws an event's sign into a `Game_Picture` at an x and y you choose, for a cutscene. Picture number 1–100. |

## Script calls

```js
CSAF.Bracket.signs()        // every sign on this map, as data
CSAF.Bracket.closeLook(id)  // open the Close Look on one event's sign
CSAF.Bracket.openYard()     // open the directory
CSAF.Bracket.seen()         // how many distinct signs the player has met
```

---

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Menu command | `Signs` | The wording added to the main menu. **Blank adds nothing** — leave it empty if you would rather open the directory from an event. |
| Directory heading | `The Signwright's Yard` | The heading across the top of the directory. |
| Hang signs on the map | `true` | Hang a sign over every shop event. |
| Map sign height | `104` | How tall a sign is over a door, in pixels (32–320). |
| Close Look height | `440` | How tall the sign is on the Close Look (160–560). |
| Sign above the shop | `true` | Draw the shop's sign above the goods windows in the shop scene. |
| Shop header height | `160` | How tall that header sign is (80–300). |
| Default prosperity | `2` | Used on maps with no `<prosperity: n>` note (0–4). |
| Close Look hint | `OK to continue` | The quiet line at the foot of the Close Look. Blank for none. |
| Font folder | `fonts/` | Where the two `.woff2` files live, relative to the game root. |

---

## Compatibility

Bracket adds two scenes, `Scene_BracketSign` and `Scene_BracketYard`.

**Nothing is replaced and nothing is overwritten.** Every core method it touches is extended by
saving the original and calling through to it — seven prototype methods (`Scene_Boot.start`,
`Game_System.initialize`, `Spriteset_Map.createCharacters`, `Spriteset_Map.destroy`,
`Scene_Shop.create`, `Window_MenuCommand.addOriginalCommands`, `Scene_Menu.createCommandWindow`)
and one singleton (`ImageManager.loadPicture`). It also defines `Scene_Shop.mainAreaTop` and
`Scene_Shop.mainAreaHeight`, which `Scene_Shop` inherits rather than declares: both save the
inherited method and call it, and both exist only to make room for the header band. It adds one
new method, `Scene_Shop.csafBracketBand`.

Only `Bracket.js` touches RPG Maker at all. The other three files are a geometry kit, a reader
and a painter, and none of them knows the engine exists. Switch `Bracket.js` off and nothing is
patched.

**Saves.** The list of signs the player has met is stored on `Game_System` under a versioned,
non-enumerable slot. Older saves are upgraded in place on load; a save written by a *newer*
version is left alone rather than stripped. Adding Bracket to a game in progress is safe, and so
is removing it.

**Load order.** Bracket reads Shop Processing commands out of your event pages; it does not
change them. It does not touch the goods windows themselves, so shop-window plugins sit beside
it. If another plugin also redefines `Scene_Shop.mainAreaTop` or `mainAreaHeight` without calling
through, load Bracket after it.

---

## Fonts and licences

The two bundled typefaces are **not** covered by the product licence. They are third-party fonts
under the SIL Open Font License 1.1:

- `Bracket-Display.woff2` is **Cinzel Bold**, Copyright 2020 The Cinzel Project Authors.
- `Bracket-Body.woff2` is **Alegreya**, Copyright 2011 The Alegreya Project Authors.

The full OFL text ships beside them as `OFL-Cinzel.txt` and `OFL-Alegreya.txt`. The OFL governs
those two files, including redistribution inside your game, and it is more permissive than the
product licence.

Everything else the plugin draws is drawn in code. No other third-party asset, image or font is
included, and no RPG Maker RTP art is used or required.

**The signs are yours.** Anything Bracket draws out of your own database is your output, not the
Software — put it in your game, your trailer and your screenshots freely. See `LICENSE.txt` for
the full terms.

---

## AI disclosure

The code and the graphics in this product were produced with AI assistance. No sounds and no
authored narrative text ship with it. This is stated on the store page as well, and it is stated
here so that it travels with the files.

---

*Bracket v1.0.0 · RPG Maker MZ · Core Systems Asset Factory · https://csaf.itch.io*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
