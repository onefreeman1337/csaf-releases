# Tether — Relationship Chart for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Tether — Relationship Chart for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/tether  
**Docs published:** 2026-11-05


---

```
  ┌───────────────────────────────────────────────┐
  │                                               │
  │               T  E  T  H  E  R                │
  │          ─────────────  ✦  ─────────────       │
  │    Every bond between your characters,        │
  │         drawn as a cord of real material.     │
  │                                               │
  │              RPG MAKER MZ PLUGIN · v1.0.0     │
  │                                               │
  └───────────────────────────────────────────────┘
```

**Tether draws your cast's relationships as a chart the player can read at a glance.** Every character
is a framed medallion holding their own face graphic. Every bond between two of them is a cord, and
the cord's MATERIAL says what kind of bond it is, its WEIGHT says how strong, its KNOTS mark the events
that shaped it, and a bond under strain FRAYS. It is the visual layer over whatever relationship system
your game already keeps: point it at your variables, or use its own small bond record. **Nothing here is
an image file** — every cord, knot, frame and plate is drawn in code when the chart opens.

---

## What is in the box

| | |
| --- | --- |
| `js/plugins/Tether.js` | The chart scene, the parameters, the plugin commands and the engine hooks. The only file that touches RPG Maker. |
| `js/plugins/TetherRead.js` | The reader and the layout solver. Turns values into bonds and places the cast. Knows nothing about RPG Maker. |
| `js/plugins/TetherRender.js` | The painter. Draws cords, knots, medallions and the page. Knows nothing about RPG Maker. |
| `fonts/Tether-Display.woff2` | Marcellus SC — names and headings. |
| `fonts/Tether-Label.woff2` | Sorts Mill Goudy Italic — knot labels and the ledger. |
| `fonts/OFL-MarcellusSC.txt`, `fonts/OFL-SortsMillGoudy.txt` | The SIL Open Font Licence for each face. See **Fonts and licences**. |

---

## Install

1. Copy the three `.js` files into your project's `js/plugins` folder and switch them on in the
   Plugin Manager. **Any order works** — each file looks its siblings up the first time it needs
   them, including the alphabetical order you get by dragging the folder in, which puts `Tether.js`
   first.
2. Copy the two `.woff2` files into your project's `fonts/` folder. Without them the lettering falls
   back to Georgia or Times. It never uses RPG Maker's own font, and a missing font file cannot stop
   your game from booting (the faces load through the browser's `FontFace` loader, not `FontManager`).
3. Open the main menu: there is a **Bonds** command. With nothing set up yet the chart shows your
   party and says *No bonds yet.* — give it a bond with **Set Bond** and a cord appears.

---

## Where a bond comes from

In this order:

1. **A variable**, if the pair is listed in the **Pairs read from variables** parameter. Use this when
   your own relationship system (or your events) already keep a number per pair. Your variable always
   wins over Tether's own record.
2. **Tether's own record**, written by the **Set Bond** and **Add To Bond** commands. It is saved with
   the game.
3. **Nothing.** A pair with neither gets no cord. Tether never invents a relationship.

## Kinds, materials and weight

| Kind | Cord | Knots are |
| --- | --- | --- |
| love | silk: a smooth, glossy red cord | loops tied in the silk |
| friendship | rope: a three-strand laid rope | loops tied in the rope |
| oath | chain: interlocking steel links | brass padlocks hanging from the chain |
| rivalry | barbed wire: two twisted strands with barbs | loops of bare wire |
| family | ribbon: a flat band that turns over as it runs | bows |

A bond with no kind declared is **rope** when its value is positive and **barbed wire** when it is
negative.

**Weight.** A bond's value (either sign) is placed on six tiers by **Tier thresholds**
(default `0, 10, 25, 50, 75, 100`): the heavier the tier, the thicker the silk, the heavier the chain,
the bigger the barbs. The ledger shows the tier as six lozenges.

**Strain.** A bond whose value runs against its kind — a love, friendship, oath or family bond below
zero — is **strained**, and so is any bond you mark with **Set Strained**. Silk, rope and ribbon fray,
with loose fibres splaying from each break; a chain hangs one broken link; barbed wire snaps and
curls back. A rivalry is never strained by being negative: that is what a rivalry is.

**Knots.** Two ways to tie one:

* list switches on a pair in **Pairs read from variables** — each switch that is ON ties a knot,
  labelled with **the switch's own name** from your database (name switch 12 "The Siege of Harrowgate"
  and that is what the chart says);
* the **Strike Knot** command ties a knot labelled with your own words. The same label twice is one
  knot.

Where a knot sits along its cord is worked out from the pair and its knots, never random, so the same
save always draws the same chart. Knots on one cord keep a clear space between them, so a new knot can
nudge an older one along.

---

## The chart

* **Who is on it:** the party first, then the actors in **Extra cast**, then anyone a bond names.
  Up to **12** characters sit on one ring, so every cord is a clean chord of the circle; **13 to 16**
  sit on two rings. **Past 16** only the first 16 are charted (party first).
* **The order around the ring is solved** so that as few cords cross as possible.
* **Medallions** hold the actor's face graphic. An actor with no face gets a monogram on a field in
  their class's colour. The frame style comes from the actor's class; the number of rings from how
  bonded they are.
* **The ledger** on the right counts every kind of bond and names the strongest pair of each. Choose a
  face and it lists that character's bonds instead — a length of each cord, the other character, the
  kind in your words, the tier, and up to two knots — while the rest of the chart dims.
* **Controls:** arrow keys (or a click on a face) choose; Cancel, or a click on empty ground, goes back
  to the overview; Cancel again, or the round button at the top right, closes the chart.

---

## Plugin commands

| Command | Arguments | What it does |
| --- | --- | --- |
| Open Chart | — | Opens the chart. |
| Set Bond | Actor A, Actor B, Value, Kind | Sets the value of the bond (and its kind, unless left on *keep / auto*). |
| Add To Bond | Actor A, Actor B, Amount | Adds to the value (a negative amount takes from it). |
| Strike Knot | Actor A, Actor B, Label | Ties a knot with your words on it. |
| Set Strained | Actor A, Actor B, Strained | Marks the bond strained (its cord frays) or clears the mark. |

Actor A and Actor B may be given in either order; a pair is one bond. A bond between an actor and
themselves, or with an actor that does not exist, is refused.

**Script calls:** `CSAF.Tether.open()` · `CSAF.Tether.value(a, b)` returns a bond's current value ·
`CSAF.Tether.setBond(a, b, value, kind)`.

---

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| Chart title | `Bonds` | The words on the brass plate at the top. |
| Main menu command | `true` | Adds the command to the main menu. |
| Menu command name | `Bonds` | Its name. |
| Extra cast | `[]` | Actors charted even when not in the party. |
| Pairs read from variables | `[]` | Each pair: Actor A, Actor B, Variable, Kind, Knot switches. |
| Tier thresholds | `0, 10, 25, 50, 75, 100` | Six numbers; a bond's tier is the highest its value reaches. |
| Words for each kind | Love, Friendship, Oath, Rivalry, Family | What the key and the ledger call each kind. |
| Word for "strained" | `strained` | |
| Text for no bonds | `No bonds yet.` | |
| Hint line | `Choose a face to see their bonds.` | At the foot of the overview ledger. |
| Count line | `%1 characters, %2 bonds` | Under the title; %1 and %2 are filled in. |
| Font folder | `fonts/` | Where the two `.woff2` files live. |

---

## Compatibility

Only `Tether.js` touches RPG Maker. Every core method it touches is **extended**: the original is
saved and called through — `Scene_Boot.start`, `Game_System.initialize`,
`Window_MenuCommand.addOriginalCommands` and `Scene_Menu.createCommandWindow`. The chart is its own
scene (`Scene_Tether`), so it cannot collide with another plugin's menu screens.

**Menu plugins.** If a menu plugin (VisuStella Main Menu Core, for example) builds its own command list,
turn **Main menu command** off and open the chart with the **Open Chart** command or
`CSAF.Tether.open()` from a common event.

**Relationship plugins.** Tether draws; it does not decide. If your relationship plugin keeps its values
in variables, list each pair in **Pairs read from variables** and Tether draws what that plugin
decides.

**Saves.** Tether's own bond record lives on `Game_System` in a small, versioned slot and saves with the
game. Adding Tether to a game in progress is safe: an older save starts with an empty record, and any
pair read from variables shows at once.

**Cost.** The chart is drawn once when it opens and again only when the player chooses a different face.
At rest it re-uploads nothing: measured in the engine at 0 texture uploads per frame, with the scene's
own update averaging under 0.1 ms, for 12 and for 16 characters.

---

## Fonts and licences

The two bundled typefaces are **not** covered by the product licence. They are Marcellus SC and Sorts
Mill Goudy Italic, third-party fonts under the SIL Open Font License 1.1. Each face's copyright notice is
at the top of its licence file (`OFL-MarcellusSC.txt`, `OFL-SortsMillGoudy.txt`), and the OFL governs
those two files, including redistribution inside your game.

Everything else the plugin draws is drawn in code. No other third-party asset is included, and no RPG
Maker RTP art is used or required; the faces on the chart are **your** actors' face graphics.

**The charts are yours.** Anything Tether draws from your own characters and bonds is your output — put
it in your game, your trailer and your screenshots freely. See `LICENSE.txt` for the full terms.

---

## AI disclosure

The code and the graphics in this product were produced with AI assistance. No sounds ship with it and
it adds no story text: every name and knot label on the chart is yours. The portraits in the store
images are demonstration art and are not included.

---

*Tether v1.0.0 · RPG Maker MZ · Core Systems Asset Factory · https://csaf.itch.io*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
