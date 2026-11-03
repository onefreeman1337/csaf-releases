# Time-Travel Western RPG (working title) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Time-Travel Western RPG (working title)  
**Engine:** Hand-written HTML5 (Canvas + vanilla JS) — browser-native, no runtime to license. GameMaker only if its HTML5 module ever installs (licence grants it; module absent, Igor refused twice with "Signature is invalid"). RPG Maker MZ is BARRED for shipping: CLAUDE.md §8.5 forbids redistributing the Kadokawa runtime, and an itch upload is redistribution.  
**Docs published:** 2026-11-03


---

# HEADGATE

### Chapter One: The Dry Year

You are a resurveyor, sent to Sufferance to re-establish section corners that were lost in 1873.
Where a monument still stands in both years, your transit sights through time — and what you
re-stage in the past changes the present.

A *headgate* is the structure that diverts water out of a river and into a ditch. In western water
law it is the physical point at which a claim begins. There is one at the end of this route, and
whether the town has any right to it depends on what you decide happened in 1873 and in 1851.

---

## Running it

**The Windows build (`Headgate_Windows.exe`)** is a single portable executable. Double-click it. It is
not code-signed, so Windows may warn you the first time. It installs nothing and needs no network
connection — it serves itself to its own window on `127.0.0.1` so that the game runs exactly the code the
browser version runs. While it runs it unpacks to a temporary folder, and it remembers your mute setting
in its own user-data folder. **F11** is fullscreen.

**The browser version** runs in any modern desktop browser. Nothing to install.

There is no launcher, no account, no telemetry and no save file. A chapter is one sitting, and an
ending takes you back to the title for the next one.

## Controls

| | |
| --- | --- |
| **Arrow keys** or **W A S D** | walk (8-way, continuous) |
| **Z**, **Space** or **Enter** | act — pay, use the transit at a monument, take hold of a piece and set it down. A short press pays. A long hold works an obstacle off, where it can be worked |
| **C** | commit — spend a reach and make the restaging real |
| **X** or **Escape** | cancel — put the past back and walk away costing nothing |
| **E** | change era at a monument that stands in more than one |
| **M** | mute |
| **C** on the title | credits |
| **Mouse or touch** | hold anywhere to walk towards the pointer. Tap yourself, what you stand beside, or its prompt to act, and hold there to work it. In the past, press a piece to take hold of it, then drag it to a slot or tap the slot. The E, C and X buttons are on screen beside the tableau. |

Everything else you need is drawn on screen. There is no manual to memorise and no options menu to
find, because there is nothing in one worth hiding a game behind.

## What you actually do

**In the present (1899) you walk.** Eight encounters sit on a route of seventeen places across a
20×12 tile world. Each one is a thing standing in the road — an agent, a dry wash, a slide, a bank —
and each tells you plainly what it costs you *now*, in dollars, in days, or in worse than that.

**In the past (1873, and 1851) you drag.** At a monument that survives into your year, the screen
splits: the past above, a strip of the present below. You take hold of what stood there, a bond book, a
water barrel, a survey camp, a corner post, and you *move it*. The strip cuts to whichever place the piece in your hand acts on — often
somewhere else entirely — and it recomposes the moment you set that piece down. Nothing is real
until you press **C**.

⚠️ **The redraw shows you the world changing. It does not tell you whether you have solved
anything.** That is deliberate and it is the whole game: the picture and the paperwork sit on
different facts, and working out how one reaches the other is what you are actually here to learn.

## What you are spending

| | |
| --- | --- |
| **5 reaches** | one per commit, whatever you re-stage inside it. Re-staging a small thing and re-staging the whole year cost the same. |
| **1873 costs 1 reach · 1851 costs 3** | the older year is worth more and costs more than it is worth, on purpose. |
| **40 days of THE DRY** | travel, encounters and commits all burn it. When it runs out the chapter ends wherever you are standing. |
| **$420 in scrip** | the alternative to time travel is paying. That works on most of the road, and not all of it. |

You can always walk out. You cannot reach the headgate without the transit: one door on the road will not open for money.

## Three endings

All three are real, all three are reachable, and none of them is a failure screen:

* **THE WATER REACHES SUFFERANCE** — you open the gate on a chain that has been the town's since
  1851, and nobody knew it.
* **THE TOWN IS ABANDONED** — you open the gate, the water goes where the paper says it goes, and
  your plat becomes the only record the town was ever laid out.
* **YOU TAKE THE RAILHEAD EAST** — there is a freight east on the Thursday. The corners stay lost.

A first run is short. We estimate 10 to 20 minutes, though nobody has timed a person, and our test bot
reaches the best ending in about two minutes. It is meant to be played more than once — the second run
is a different game, because by then you know what the past is attached to.

## New in 1.1

* A painted title card, bundled type, and a credits screen.
* An ending or the demo's last screen now takes you back to the title, so a second run no longer
  means restarting the game.
* The past has a sound for taking hold of a piece, setting it down and being refused, and setting a
  piece down wipes the new present across the old one.
* The past now shows your reaches, scrip and days beside the tableau.
* You can now finish the chapter with a mouse or a touch screen.
* A key to the markers on the first screen, a theme for the title and the endings, a loading screen,
  fades between scenes, and a visible mute.

## About this build

* Plain HTML5 canvas. No engine, no framework, no dependencies at runtime.
* **All ten JavaScript modules ship exactly as written** — unminified, commented, readable. A
  package you cannot audit is a package you have to take on trust. Read `js/` if you like.
* Art from seven first-party CSAF asset packs; music and effects computed by our own synthesiser
  from a written score; two typefaces under the SIL Open Font License. Everything is named in
  `CREDITS_AND_MEDIA_LICENCES.md`.
* This product is AI-written and the store listing says so. The full disclosure — including why
  the audio answer is **no** — is in `LICENSE.txt` and in the credits file, and the game's own
  credits screen says so too.

Licence terms are in `LICENSE.txt`. Short version: play it anywhere you like, stream it and monetise
the video without asking, and do not redistribute the build or lift the art out of it.

**Core Systems Asset Factory**


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
