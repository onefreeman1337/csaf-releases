# Aperture Core: Camera and Photo Mode for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Aperture Core: Camera and Photo Mode for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/aperture-core  
**Docs published:** 2026-11-05


---

# Aperture Core

**An in-game camera for RPG Maker MZ.** The player frames a shot, racks focus, chooses an
aperture and presses the shutter — and the engine judges the photograph.

Version 1.0.0 · RPG Maker MZ · three plugin files · no dependencies

---

## What this is, and what it is not

Screenshot plugins already exist and they are free. This is not one of those. A screenshot plugin
writes a PNG to the player's hard drive, and nothing in your game ever knows it happened.

Aperture Core gives the player a **lens**. There is a viewfinder with rule-of-thirds guides, a focus
ring that racks, an aperture that visibly changes the depth of field, autofocus brackets that lock
onto a subject, and a shutter that closes. When it fires, the engine scores the frame — what was in
it, how it was composed, whether the subject was sharp, whether it was looking at you — and files a
**developed print** in an album that fills up as the player plays.

Your events can read all of it back.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder:
   - `ApertureCore.js` — the engine. Scoring, the album, save data.
   - `ApertureLens.js` — the look. Viewfinder chrome, depth of field, the shutter, prints.
   - `ApertureAlbum.js` — the scenes and the plugin commands.
2. In the Plugin Manager, add all three **in that order**. `ApertureLens` and `ApertureAlbum`
   declare `ApertureCore` as a base, so the editor will warn you if the order is wrong.
3. That is the whole installation. There is nothing else to set up.

---

## Making something photographable

Put a notetag in the note box of any **event**. That is the entire authoring burden — there is no
separate database, no per-map registry and no setup event.

```
<photo: forest_wolf>
<photo: forest_wolf, Grey Wolf>
<photo: forest_wolf, Grey Wolf, size=1.6, rarity=3, points=180>
```

| Field | What it does |
| --- | --- |
| `key` | The id you use in commands. Required, and it is the first value. |
| name | What the player sees. Optional; defaults to the key. |
| `size=` | How tall the subject is **in tiles**. Decides how much frame it fills at a given distance. 1.0 is a person, 3.0 is a bear. |
| `rarity=` | 1 to 5. Multiplies the shot's score and its value. |
| `points=` | What a perfect photograph of this subject is worth. |

Events are re-read every time the viewfinder opens, so an event that only exists under a page
condition behaves exactly as you would expect.

---

## Controls in the viewfinder

| Input | Does |
| --- | --- |
| Arrow keys / left stick | Pan the camera |
| Q / W (PageUp / PageDown) | Zoom out and in |
| Shift + Up / Down | Rack focus nearer and further |
| Shift + Left / Right | Open and close the aperture |
| Ctrl | Snap focus to the tracked subject |
| Z / Enter / A | Shutter |
| X / Esc / B | Put the camera away |

The world holds still while the player is looking through the lens. That is what makes a considered
photograph possible at all, and it is why the camera is its own scene rather than an overlay.

---

## What the engine scores

| Term | What it measures |
| --- | --- |
| **Framing** | How near the subject sits to a power point — the frame centre, or one of the four rule-of-thirds intersections. A deliberate off-centre composition scores as well as a centred one, which is the whole reason the rule exists. |
| **Fill** | How much of the frame the subject occupies. A speck on the horizon and a cropped nose both score badly. There is a flat-topped ideal band, not a single perfect number. |
| **Focus** | How near the subject is to the focal plane, against a depth of field derived from your aperture and focal length. Wide open on a long lens you have almost nothing; at f/11 wide, almost everything is sharp. |
| **Facing** | A creature looking at the lens is a better photograph than the back of its head. The back of its head is still worth something. |
| **Company** | A second and third subject enrich a photograph. A sixth makes it a crowd, and the curve turns over. |
| **Balance** | Where the weighted mass of the shot sits relative to the frame. |
| **Clipping** | A subject crossing the frame edge loses marks in proportion to how much of it is outside. |

Scores run 0–100 and land in grade bands F, D, C, B, A, S. Every band and every weight is a plugin
parameter.

**Every subject in frame is graded, not just the best one.** A photograph of a doe with her fawn
beside her is a photograph of the fawn too, and it satisfies a commission for either.

---

## Photo requests

A request is a commission: *photograph this subject, at least this well.*

Use the **Add photo request** plugin command, or from a script call:

```js
ApertureCore.addRequest('wolf_job', 'forest_wolf', 'B',
                        'The innkeeper wants proof of the wolf.');
```

The moment a qualifying print lands in the album the request completes. Read it back with the
**Check photo request** command, which writes 1 or 0 into a switch, or:

```js
ApertureCore.isRequestDone('wolf_job');   // -> true / false
```

A commission for something the player has *already* photographed well enough completes the instant
it is issued — otherwise they would be told to go and photograph a wolf while holding a perfect
photograph of a wolf.

**Read best score** writes the best score recorded for any subject into a variable, so you can gate
dialogue, prices or events on how good a photographer the player actually is.

---

## Plugin commands

| Command | Does |
| --- | --- |
| Open camera | Hands the player the viewfinder |
| Open album | Opens the developed album |
| Add photo request | Commissions a photograph |
| Check photo request | Writes 1 or 0 into a switch |
| Read best score | Writes a subject's best score into a variable |
| Give camera | Ungates the camera when *Require the camera item* is on |

---

## Why your save file does not explode

This is the trap every in-game camera falls into, so it was designed out first.

**A photograph is not stored as an image.** Each print keeps a small indexed-colour thumbnail —
48×36 in 16 colours is about 900 bytes — plus the shot's descriptor: where the camera was, what was
in frame, how it scored. Sixty photographs cost roughly 55 KB. A single PNG data URI would have cost
more than that on its own, and there would have been sixty of them.

The print you see in the album is **re-developed from that data every time it is displayed**. That is
also why prints look like prints rather than like screenshots: the 16-colour film stock is the
aesthetic, not a compromise.

*Print resolution* is a parameter, and the three options quote their real byte cost. *Album capacity*
bounds the total; when it is reached the **worst** photograph is discarded, never the newest.

---

## Compatibility

- Every core method this touches is patched by **prototype extension**, with the original saved and
  called. Nothing is overwritten.
- It adds two scenes and replaces none. The map scene, the menu and the message system are untouched.
- Window classes that could appear elsewhere in your game are never restyled on the prototype, so
  installing this does not change the look of anything outside its own scenes.
- The album is stored in `$gameSystem` as **plain data**, never as a class instance — so a save still
  loads if you later disable the plugin.
- Nothing calls `Math.random()`. All variation comes from a seeded generator, so a print develops
  identically on every machine and in every session.

## Requirements

RPG Maker MZ, any recent version. The depth-of-field blur and focus peaking use PIXI, which MZ
ships. If a machine's graphics driver refuses to compile the peaking shader, the camera silently
continues without it — the scene never fails.

---

## Parameters worth knowing

- **Ideal subject fill (min/max)** — the band a subject should occupy for full marks. Widen it to be
  generous, narrow it to make composition matter.
- **Composition tolerance** — how near a power point still counts as well composed.
- **Aperture stops** — the f-numbers the player can cycle. Fewer stops, simpler game.
- **Maximum defocus** — set to 0 to turn depth of field off entirely.
- **Focus peaking** — the mirrorless-camera trick of painting in-focus edges. Turn it off for a
  cleaner look.
- **Grade thresholds** — the score floors for D, C, B, A and S.
- **Require the camera item** — gate the viewfinder behind the *Give camera* command.

---

## Support

Questions, bug reports and feature requests: leave a comment on the store page.

Aperture Core is part of the CSAF catalogue for RPG Maker MZ. If you are building a collect-a-thon,
it pairs directly with **Chimera Core** (creature genetics and storage) and **Chimera Field**
(spawn tables and variants) — photograph what you catch.

© 2026 CSAF — Core Systems Asset Factory. See `LICENSE.txt` for terms.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
