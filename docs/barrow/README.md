# Barrow — every death carves its own marker — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Barrow — every death carves its own marker  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/barrow  
**Docs published:** 2026-11-05


---

# Barrow — every death carves its own marker

**For RPG Maker MZ.** Version 1.0.0 · Core Systems Asset Factory · <https://csaf.itch.io>

---

## What this is

Your game already produces deaths. Barrow does not add a death mechanic and does not compete with
the free permadeath plugins — keep whichever one you use. Barrow is the part those plugins do not
have: **the object.**

For every death it records, a marker is carved. The form, the stone, the surface dressing, the
letter cut, the device, the epitaph, the weathering and the lichen are all derived from **who died,
how, where, and how long ago**. Then it lays the markers out in a memorial ground the player can
walk, oldest at the back.

Nothing is a picture file. Every marker is drawn by the plugin at run time.

---

## Installing

1. Copy the four files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add all four.
3. **Any order works.** The files resolve each other at first use, so you cannot break them by
   adding them in the wrong sequence. The order below is only the order they read in:

   | | file | what it is |
   | --- | --- | --- |
   | 1 | `BarrowRender.js` | drawing primitives and the cut-stone lighting model |
   | 2 | `BarrowCorpus.js` | the forms, materials, letter cuts and the classifier |
   | 3 | `BarrowStone.js` | the marker renderer |
   | 4 | `Barrow.js` | parameters, plugin commands and the memorial ground |

4. Set the parameters on `Barrow.js` (see below). The defaults are sensible; the one worth thinking
   about is **Record enemy deaths**.

---

## Compatibility

**Barrow EXTENDS two core methods and saves the original of each, so it stacks with other plugins
that touch them rather than replacing them:**

- `Game_System.prototype.initialize` — to create its save slot
- `Game_BattlerBase.prototype.die` — to notice a death

**It CLOBBERS nothing.** Three of its four files touch no core prototype at all. (Measured by
`compat_facts.js`, which classifies against the engine's own source rather than by name.)

Its scene is a `Scene_Base` subclass that draws its own background and adds no engine windows, so it
does not interact with message windows, menu plugins or HUDs. Its save data is one plain
serialisable array on `$gameSystem`, so `JsonEx` round-trips it losslessly and **saves made before
you installed Barrow load without it.**

Tested alongside the stock MZ scripts and verified in a real MZ runtime on the worst-case
(alphabetical) plugin load order.

---

## Parameters

| parameter | what it does |
| --- | --- |
| **Record party deaths** | Carve a marker when a party member falls. These are the markers a player cares about. |
| **Record enemy deaths** | `None` / `Bosses only` / `Named and bosses` / `All`. **Default is Bosses only**, because `All` fills the ground with goblins. |
| **Boss threshold** | A multiple of **your project's own median enemy exp**. Barrow reads `$dataEnemies` and works out what "exceptional" means in *your* numbers, so this stays correct whether your bosses are worth 100 exp or 100,000. |
| **Weathering scale** | `Relative` (default) ages markers against the ground's own span, so the oldest grave is the most worn whatever your campaign length. `Absolute` uses literal game-time. |
| **Seconds per in-game year** | Only used by Absolute weathering. |
| **Region variable** | A variable holding the current region name, so a parish quarries its own stone. `0` = one region everywhere. |
| **Maximum markers** | Oldest markers beyond this are forgotten. |
| **Ground title** | Shown at the top of the memorial ground. |

---

## Plugin commands

| command | use |
| --- | --- |
| **Record a death** | Carve a marker for anyone, any time — NPCs, offscreen deaths, anything the automatic hooks do not see. Takes a name, a standing, a cause, a place and an "at whose hand". |
| **Open the memorial ground** | Walk it. Left/right move between graves; cancel leaves. |
| **Clear the ground** | Forget every marker. There is no undo. |

**Leave the name blank** to record an unmarked grave. Barrow gives it one of the nameless-grave
epitaphs and a humbler marker, which is its own kind of storytelling.

---

## What makes the stones look like stone

Every mark on a marker is lit by **one raking light**, and the lettering is cut as a real v-groove:
two wall planes, each with its own surface normal. Two things follow that you do not get by drawing
dark text.

**A stroke's contrast depends on its angle to the light.** A groove running across the light is
strongly modelled; one running *along* it very nearly vanishes, because both of its walls tilt
perpendicular to the light and shade the same. That is what a real inscription does in late sun, and
it is why the horizontals of these capitals read more strongly than the verticals.

**Weathering is the cut getting shallower.** As a marker ages the groove wears, its walls rotate back
toward flat, the contrast between them collapses, and the epitaph becomes genuinely harder to read.
Nothing is faded or blurred — the stone is simply less deeply cut than it was.

And because different rocks erode at different rates, **the same span of time does different amounts
of forgetting.** Slate holds a crisp inscription for centuries; limestone loses one inside a
lifetime. Walk toward the back of a ground and the stone itself changes, because a parish does not
quarry the same rock forever.

---

## What is in it

- **12 marker forms** — stele, cross slab, obelisk, sarcophagus lid, hogback, urn plinth, ossuary
  niche, grave board, iron marker, field stone, cairn, tumulus
- **8 materials** — granite, slate, limestone, sandstone, marble, ironstone, oak, wrought iron, each
  with its own grain and erosion rate
- **5 period letter cuts** over an authored alphabet of **43 Roman capital glyphs**, drawn as stroke
  centrelines so they can be *cut* rather than set in a font
- **6 surface dressings** — punched, claw-tooled, rock-faced, polished, bush-hammered, riven
- **8 weathering states** and **6 lichens**
- **12 carved devices** and **26 epitaph formulae**

---

## Terms

Free for commercial and non-commercial RPG Maker projects. Do not resell the plugin itself.
Credit "Core Systems Asset Factory" is appreciated, not required. Full terms in `LICENSE.txt`.

---

## Honest notes

- **The lettering reads better on pale stone.** A v-cut on limestone shows more than twice the
  wall-to-wall contrast of the same cut on slate. That is true of real inscriptions too, and it is
  why churchyards are full of pale limestone — but it does mean a slate marker is a quiet one.
- **This plugin was written with AI assistance.** Code: yes. Graphics: yes (everything is drawn in
  code — there are no image files). Sounds: no. Text and dialogue: no.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
