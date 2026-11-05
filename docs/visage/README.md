# Visage — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Visage  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/visage  
**Docs published:** 2026-11-05


---

```
  ┌───────────────────────────────────────────────┐
  │                                               │
  │                V  I  S  A  G  E               │
  │              ──────────  ◆  ──────────        │
  │     Every spirit and beast is carved a mask.  │
  │                                               │
  │              RPG MAKER MZ PLUGIN · v1.0.0     │
  │                                               │
  └───────────────────────────────────────────────┘
```

**Visage carves your own database.** It reads the enemies and actors already in your project
and strikes each one a mask: a face structure from what the creature *is*, a superstructure
from where it stands in **your** database, pigment from what it strikes with, inlay from the
house it belongs to, and wear from how long it has stood. Then it hangs the mask on a peg by a
knotted cord, engraves a brass placard for it, and shows your players its true face.

Change a record and the mask changes. **Nothing here is an image file.** Every mask is drawn in
code at run time, so a monster you invent tomorrow is carved tomorrow, without anyone opening a
paint program.

---

## What is in the box

| | |
| --- | --- |
| `js/plugins/VisageRender.js` | The surface. Colour, the shipped typefaces, seeded grain and the relief field every mask is lit from. Knows nothing about RPG Maker. |
| `js/plugins/VisageRead.js` | The reading. Turns an enemy, actor or troop record into a mask profile — structure, superstructure, pigment, house, age, break. Knows nothing about RPG Maker. |
| `js/plugins/VisageCarve.js` | The carving. Ten face structures, twelve superstructures, banded pigment that wears thin on the ridges, six inlays, five ages and one seeded break. Knows nothing about RPG Maker. |
| `js/plugins/Visage.js` | The two scenes, the plugin parameters and the plugin commands. The only file that touches the engine. |
| `fonts/Visage-Display.woff2` | Cinzel Bold — the name engraved on the placard and the rack heading. |
| `fonts/Visage-Body.woff2` | Crimson Pro — the four readings under the name, and the captions. |
| `fonts/OFL-Cinzel.txt`, `fonts/OFL-CrimsonPro.txt` | The SIL Open Font Licence for each face. Both are redistributable; see **Fonts and licences** below. |

---

## Install

1. Copy the four `.js` files into your project's `js/plugins` folder and switch them on in the
   Plugin Manager. The order that reads best in the list is:

   1. `VisageRender.js`
   2. `VisageRead.js`
   3. `VisageCarve.js`
   4. `Visage.js`

   **Nothing depends on that order.** Every file looks its siblings up the first time it needs
   them rather than when it loads, so any order works — including the alphabetical one you get
   by dragging the folder in, which puts the entry file `Visage.js` first, ahead of the carver,
   the reader and the drawing kit it uses. That is the order this plugin is tested, gated and
   captured in.

2. Copy the two `.woff2` files from `fonts/` into your project's own `fonts/` folder.

   Optional but recommended. Without them the placard falls back to Cinzel, Trajan Pro,
   Palatino or Georgia, and the readings to Crimson Text, Georgia or Times. **It never falls
   back to RPG Maker's own font**, and a missing font file can never stop your game from
   booting — the faces are loaded through the browser's own `FontFace` loader rather than
   through RPG Maker's `FontManager`, precisely so a missing file is a fallback and not a crash.

   If you keep your fonts somewhere else, set the **Font folder** plugin parameter to that path
   (default `fonts/`).

3. There is nothing else to set up. Start the game, defeat something, and its mask is carved.

---

## The three places your players meet a mask

**The Unmasking.** A full-screen reveal: the mask hanging from one iron peg on a plank wall,
lit from the upper left, its brass placard engraved with the creature's name and its four
readings. It happens by itself the first time the party defeats a creature — switch
**Unmask on first defeat** off if you would rather choose your moments — and on the plugin
command **Unmask**.

**The Rack.** The wall the player fills. A solved grid of pegs, each taken mask hanging at its
own tilt, **empty pegs still showing their peg and cord** so the collection reads as
incomplete. A brass count plate at the top left says how many of how many. Reached from the
main menu (the **Masks** command) or from the plugin command **Open Rack**.

**A mask in a cutscene.** **Show Mask Picture** draws a mask into a `Game_Picture`, so it can be
moved, tinted, timed and erased like any other picture in the event editor.

---

## Notetags — the hand always wins

Put any of these on an **Enemy** or an **Actor**. Everything Visage derives, you can override.

```
<visage type: beast>           beast humanoid undead spirit construct
                               dragon insect aquatic plant fiend
<visage rank: 9>               0-11, instead of the database percentile
<visage element: fire>         by name or by index
<visage faction: Barrow Kin>   the house it belongs to
<visage age: ancient>          green seasoned old ancient relic
<visage name: The Bog Wight>   what is engraved on the placard
<visage: skip>                 never carve this record
```

Nothing needs tagging. A project with no notetags at all still gets a full wall of masks —
the tags are for the handful of creatures you want to say something specific about.

### How a record is read when you say nothing

| Axis | Read from |
| --- | --- |
| **Face structure** (10) | The creature's name first, then the shape of its parameters. A party member is a humanoid unless its name says otherwise. |
| **Superstructure** (12) | Where the record sits **in your own database** — its level, experience and maximum HP as a percentile of every other record. A bare brow at the bottom, a sun-disc at the top. Rank is never a matter of taste, and a small project's biggest monster still wears the crown. |
| **Pigment** (9) | Its attack element, then the elements of its own skills, then what it resists. A creature that strikes with Physical is left **unpainted**, and the bare material shows. |
| **Inlay** (6) | Its house: the faction table below, a `<visage faction:>` tag, or — if you declare no houses at all — the goods it carries. A creature that drops a pelt belongs to a different house than one that leaves an axe. |
| **Wear** (5) | Rank and hardiness: grain exposure, chips on the lit edge, and an off-centre crack that lengthens with age. |

Every mask also carries **exactly one seeded structural break** — a longer or broken horn, a
cord across one cheek, a one-sided inlay — hashed from the record's own id, so a creature's
mask is always the same mask.

---

## Plugin parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Menu command | `Masks` | The wording of the command added to the main menu. **Blank adds nothing** — use the plugin command instead. |
| Rack heading | `The Rack` | The heading across the top of the wall. |
| Unmask on first defeat | on | The first time the party defeats a creature, its mask is revealed. The reveal is queued and shown on the map after the victory messages, never over them. |
| Reveal caption | `Its true face` | The small line above the name on a reveal. Blank for none. |
| Continue hint | `OK to continue` | The quiet line at the foot of a reveal. Blank for none. |
| Carve the party too | on | Party members get masks as well, and start already taken. |
| Reveal height | `420` | How tall a mask is drawn on the Unmasking, in pixels (160–560). |
| Faction table | *(empty)* | Your houses — a name, one of six inlays, and the enemies in it. Leave it empty and Visage reads a house from what each creature carries. |
| Font folder | `fonts/` | Where the two shipped `.woff2` files live, relative to the game root. |

## Plugin commands

| Command | Arguments |
| --- | --- |
| **Unmask** | *Enemy* — reveal one creature's mask, full screen. |
| **Unmask Party Member** | *Actor* — the same, for an actor. |
| **Open Rack** | none — open the wall of masks the player has found. |
| **Show Mask Picture** | *Enemy*, *Picture number* (1–100), *X*, *Y*, *Mask height* — draw a mask into a `Game_Picture`. |
| **Take Mask** | *Enemy* — add a mask to the rack without showing it. |

## Script calls

```js
CSAF.Visage.unmask(enemyId);       // reveal an enemy's mask
CSAF.Visage.unmaskActor(actorId);  // reveal an actor's mask
CSAF.Visage.openRack();            // open the wall
CSAF.Visage.taken();               // how many the player has found
CSAF.Visage.read(enemyId);         // the profile, for your own UI
```

`read()` returns the profile the carver works from, so you can drive your own window with it
instead of ours. Among its fields: `structure`, `crown`, `pigment`, `house`, `age`, `rankPct`
(where the record sits in your database), `breakKind`, and `readings` — the four lines engraved
on the placard. It also carries a **`why`** object naming what decided each axis (`notetag`,
`its name`, `the shape of its parameters`, `percentile of your own database`, `attack element`,
`its own skills`, `what it resists`, `faction table`, `unaffiliated`), which is the fastest way
to see why a creature came out the way it did.

---

## Compatibility

Tested against RPG Maker MZ with the stock scripts unmodified, **verified by running the plugin
in the real engine**, not only in tests.

Visage adds two scenes (`Scene_VisageUnmask`, `Scene_VisageRack`) and extends **seven** core
methods, every one of them by saving the original and calling through to it:

- `Game_System.prototype.initialize` — the versioned save record
- `Scene_Boot.prototype.start` — reads your database once
- `Window_MenuCommand.prototype.addOriginalCommands` — the **Masks** command
- `Scene_Menu.prototype.createCommandWindow` — its handler
- `Scene_Map.prototype.update` — shows a queued reveal
- `BattleManager.processVictory` — queues it after a victory
- `ImageManager.loadPicture` — hands back a carved mask for a `$csafVisage…` name, and calls
  the original for every other name

**It replaces nothing and it clobbers nothing.** Because nothing is clobbered, Visage co-exists
with other plugins that patch the same seams, including large suites such as VisuStella MZ.

Neither scene uses a `Window_Base`, so nothing in Visage inherits your windowskin, and nothing
of yours is restyled by it.

Saves are versioned and forward-compatible: a save made before Visage was added loads normally,
and a save made with Visage loads in a project where it has been switched off.

---

## Fonts and licences

Both typefaces ship under the **SIL Open Font Licence 1.1**, which permits redistribution
inside a game:

- **Cinzel** — Copyright the Cinzel Project Authors. Licence in `fonts/OFL-Cinzel.txt`.
- **Crimson Pro** — Copyright the Crimson Pro Project Authors. Licence in
  `fonts/OFL-CrimsonPro.txt`.

Keep those two licence files with the fonts if you ship the fonts. The plugin code itself is
covered by `LICENSE.txt` in this folder.

---

## Support and the rest of the shelf

Visage is one of a shelf of RPG Maker MZ plugins that generate what your players look at rather
than shipping picture files. **Armorial** (<https://csaf.itch.io/armorial>) draws a coat of arms
for every character and faction from the deeds the playthrough actually recorded — the same
houses Visage inlays into its masks. **Elytra** (<https://csaf.itch.io/elytra>) is the same idea
pointed at insects, with its own collection screen.

Everything is at **https://csaf.itch.io** — questions and bug reports on the product page's
community tab get answered.

---

*Visage · Core Systems Asset Factory · v1.0.0*
*Built with AI assistance: code yes, graphics yes, sounds no, text and dialog no.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
