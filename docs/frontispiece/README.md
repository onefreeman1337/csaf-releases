# Frontispiece — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Frontispiece  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-09-01


---

# Frontispiece — the title screen, generated

**For RPG Maker MZ.** Five plugin files. No image files, no font files, no dependencies.

---

## Install

1. Copy all five `.js` files into your project's `js/plugins` folder.
2. Open the Plugin Manager and turn all five on.
3. Run the game.

That is the whole installation. **Any load order works** — every file resolves its siblings the
first time it needs them rather than when it loads, and the alphabetical order the Plugin Manager
gives you when you drag the folder in is the order this plugin is tested in.

Recommended order, because it reads sensibly in the list, and **nothing depends on it**:

1. `FrontispieceRender.js` — drawing and colour primitives
2. `FrontispieceAlphabet.js` — the authored letterform corpus
3. `FrontispieceCorpus.js` — grounds, frames, cartouches, ornaments, houses
4. `FrontispiecePlate.js` — the drawing
5. `FrontispieceScene.js` — the scene, the parameters and the plugin commands

---

## What it does

It replaces `Scene_Title` completely and draws a title screen for **your** game:

- a **ground** worked as a real material — vellum with follicle specks, leather with pores and
  blind tooling, riven slate that splits in irregular blocks, planished bronze with hammer facets,
  black lacquer with a specular sweep and hairline crazing, woven linen at a real thread pitch,
  quartersawn oak with medullary rays, brushed steel with seams and countersunk fixings;
- a **border** — fillet, dentil, guilloche, strapwork, cable, or four cut corner pieces;
- a **cartouche** — sunk tablet, lozenge, rolled scroll, pediment, banderole, or open;
- your **title, CUT** into that cartouche letter by letter from an authored display alphabet;
- a **device** composed from your own element names;
- a **command menu** built out of the same furniture as everything else;
- an **imprint** line at the foot.

There is **no `Window_Base` anywhere in the scene**, so RPG Maker's own title command window — the
three centred rows in `Window.png`, the single most recognisable frame in the engine — never
appears. Nothing here calls `$gameSystem.mainFontFace()` either.

---

## The lettering

This is the part that took the longest and it is the reason the title reads as an object rather
than as text over a picture.

**Seventy-nine hand-authored letterform skeletons**, drawn stroke by stroke in the order a hand
would draw them, and rendered through **one broad-nib pen simulation** into **five hands**:

| Hand | |
| --- | --- |
| **Lapidary** | Roman inscriptional capital, chisel-cut, flared serifs |
| **Uncial** | rounded majuscule, broad pen at a shallow angle |
| **Textura** | blackletter, broad pen at forty degrees, no curves anywhere |
| **Stave** | carved with a chisel — straight cuts only, not one curve in the alphabet |
| **Grotesk** | geometric monoline, no serif, wide tracking |

Roman capitals, uncials and blackletter are historically the same skeletons written with different
tools, so the tool is modelled rather than the result: a nib held at forty degrees produces
blackletter contrast because that is what a nib held at forty degrees does. Where the tool is not
enough — the uncial E, G, M, N, Q, T and U, the textura A, C, E, G, O, S and U, every round letter
in the stave hand — the hand carries its own authored letterforms.

And **four cuts**, for how a letter meets the material it is set in:

- **incised** — a V-groove. There is no ink in a carved inscription, only the shadow the cut casts.
- **raised** — carved proud, lit from the upper left, throwing its shadow down and right.
- **inlaid** — metal seated in a bed cut all the way round it, with a graded face.
- **printed** — flat ink lying on a surface. The flatness is the whole difference from an inlay.

Every one of them solves for an **absolute** luminance separation rather than a multiplier, which
is why the same letter reads on pale vellum and on black lacquer.

---

## The six houses

A house is a whole visual argument, not a colour scheme: a ground, a border, a cartouche, a hand,
a cut, an ornament vocabulary, a device layout, menu furniture and a palette, chosen to go
together. No two share more than two of those.

| | |
| --- | --- |
| **Chancery** | a chancery manuscript — ink on prepared skin, ruled and rubricated |
| **Sanctum** | an inscription cut into riven stone under a low pediment |
| **Folio** | a bound folio — gold tooled into grained hide |
| **Hall** | a carved board over a hall door, proud of the oak |
| **Foundry** | etched into a brushed steel plate, seamed and fixed |
| **Vigil** | silver laid into black lacquer, nothing between the letters and the dark |

Pick one in the Plugin Manager, or leave **House** on `auto`.

**What `auto` does, and why it is built the way it is.** It reads the element, class, weapon and
armour names your project uses — but only the ones **you have changed**, never the ones RPG Maker
shipped. That matters more than it sounds: the stock MZ database already contains Axe, Shield,
Spear and Ice, so a reading that scored it would hand almost every project the same house. When
your vocabulary does not say anything distinctive, `auto` falls back to a stable hash of your
game's **title** — the one field no two games share — so two projects that have not touched their
database still get different screens, and a given game gets the same screen every time.

Nothing is random. Frontispiece never calls `Math.random`.

---

## Changing one thing without leaving the house

The **Overrides** parameter lets you swap a single axis — a different ground, a different border,
a different hand — while everything else stays as the house has it. Each one defaults to `auto`,
meaning "whatever the house says".

**Subtitle** sets a line under the title. **Imprint** sets the small line at the foot — a studio
name, a version, a year. **Extra commands** adds rows under Options, each running a script line.

---

## Changing the screen mid-game

The plugin command **Set house** changes the title screen from that point on, so the screen a
player returns to after finishing a chapter need not be the one they started on. Pass a subtitle
with it, or a single hyphen to clear one. **Clear overrides** puts everything back to the
parameters.

**What that costs you, plainly.** The override is one small versioned object on `$gameSystem`, so
it is saved with the game and travels with a save file. An older save that does not contain it
simply uses your parameters, so you can install Frontispiece into a project already in progress
and lose nothing. And the limit: the title screen is drawn **before** any save is loaded, so a cold
launch always shows your parameters. The override applies from the moment the command runs, through
a Return to Title in the same session, and inside any save made afterwards. It is not a launcher
setting.

---

## On languages

The authored alphabet is **Latin capitals, digits and punctuation**. A title in Japanese, Cyrillic,
Greek, or with accented letters, cannot be cut from it, and Frontispiece does not pretend
otherwise: when fewer than 60% of a title's characters are in the corpus it letters the title from
the house's own display **font stack** instead — same cut, same relief, same lighting, still never
the engine's face.

If your title is not Latin, you get a well-lettered title screen. You do not get a cut one.

---

## Compatibility

**Tested against RPG Maker MZ with the stock scripts unmodified**, verified by running the plugin
in the real engine rather than only in tests.

Frontispiece **replaces** eight methods on `Scene_Title`: `create`, `start`, `update`, `isBusy`,
`commandNewGame`, `commandContinue`, `commandOptions` and `terminate`. That is deliberate and it is
what you are buying — but be plain about what it means: **Frontispiece will not co-exist with
another plugin that also replaces `Scene_Title`**, and whichever loads last wins.

The originals **are** saved. Put the stock title screen back at any time with:

```js
Object.assign(Scene_Title.prototype, CSAF.Frontispiece.stock);
```

It touches **nothing else** — no battle, map or menu class, no per-frame cost anywhere but its own
scene.

**Performance.** The ground, border, cartouche, wordmark, device and imprint are drawn **once**
into a cached bitmap at scene creation; only the menu is redrawn, and only when the selection
actually moves. Measured in the engine: a settled title screen costs **2 draw calls per frame, 0
texture uploads, 0 windows drawn** and no display-object growth across 120 stepped frames.

---

## Parameters at a glance

| Parameter | |
| --- | --- |
| **House** | the whole look. `auto` reads your project. |
| **Subtitle** | a line under the title |
| **Imprint** | the small line at the foot |
| **Overrides** | swap one axis of the house — ground, border, panel, lettering, cut, device, menu |
| **Extra commands** | rows under Options, each running a script line |
| **Keep my title images** | ON draws your Title1/Title2 behind the generated furniture. OFF is the default. |
| **Also draw the engine's title text** | leave OFF. ON re-enables what this plugin replaces. |

---

## Terms

Use in commercial and non-commercial RPG Maker MZ projects, unlimited games, no royalties. Edit
freely for your own projects. Do not resell or redistribute the plugin itself. Full terms in
`LICENSE.txt`.

Credit is welcome and not required.

© Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
