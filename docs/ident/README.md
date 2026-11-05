# Ident - Animated Studio Splash Generated From Your Studio Name, Before Your Title Screen (RPG Maker MZ) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Ident - Animated Studio Splash Generated From Your Studio Name, Before Your Title Screen (RPG Maker MZ)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/ident  
**Docs published:** 2026-11-05


---

# Ident for RPG Maker MZ

**Your studio's animated ident before the title screen, set from your studio name. Forty treatments, each a worked material with its own arrival.**

Type your studio name and pick a treatment. When the game starts, before the title screen, your name is struck in gold foil, bled into rice paper, bent in neon on a brick wall, cut into slate, stitched in satin thread, pressed in sealing wax, assembled from pixel blocks or powered on across a CRT, then held, then faded to your title. The player can skip it.

Every letter is cut from an authored set of letterforms in five hands, so nothing on screen is the engine's default font. The name itself picks the look and seeds the grain of the ground, the order letters catch and the debris they throw.

Made by Core Systems Asset Factory.

---

## Install

1. Copy `IdentRender.js`, `IdentAlphabet.js`, `IdentCore.js` and `Ident.js` into your project's `js/plugins/` folder.
2. Turn all four on in the Plugin Manager. Any order works; the suggested order is IdentRender, IdentAlphabet, IdentCore, Ident.
3. Open **Ident** and type your **Studio name**. Pick a **Treatment**.

That is all the setup. There are no images or fonts to install.

If IdentCore is not turned on, the game stops at boot with an error that names IdentCore and says what to turn on, rather than showing a blank screen.

## When it plays

* Once each time the game starts, before the title screen.
* If your project shows the engine's own splash image, that plays first, then the ident, then the title.
* A later return to the title (game over, or To Title from the menu) goes straight to the title. The ident never repeats in one session.
* A battle test or event test from the editor never plays it.
* OK, Cancel or a tap skips it with a short fade (turn **Skippable** off to make the player watch it). From the boot it then goes to the title; from **Play Ident** it goes back to where the command was called.

To play it at any other time, for example at the end of your credits, use the plugin command **Play Ident** from a map or common event. It plays the ident and returns to the scene it was called from. During a battle the command does nothing, because returning to a battle would start it again.

## The forty treatments

A treatment is a **material** (what the letters and the ground are made of) and an **arrival** (how the name appears). No two treatments share both, so none of them is another one in a different colour.

| Treatment | Name | Made of | Arrives | Hand |
|---|---|---|---|---|
| `foil-strike` | Foil Strike | Foil | Struck | lapidary |
| `foil-sweep` | Foil Sweep | Foil | Swept by light | lapidary |
| `foil-drop` | Foil Drop | Foil | Dropped | grotesk |
| `foil-iris` | Foil Iris | Foil | Irised | uncial |
| `molten-foil` | Molten Foil | Foil | Burned in | textura |
| `ink-bleed` | Ink Bleed | Ink | Bled in | uncial |
| `ink-script` | Ink Script | Ink | Written | uncial |
| `woodblock` | Woodblock | Ink | Struck | textura |
| `typewriter` | Typewriter | Ink | Typed | grotesk |
| `letterpress` | Letterpress | Letterpress | Struck | grotesk |
| `press-proof` | Press Proof | Letterpress | Risen | lapidary |
| `neon-sign` | Neon Sign | Neon | Flickered on | grotesk |
| `neon-script` | Neon Script | Neon | Written | stave |
| `neon-power` | Neon Power | Neon | Powered on | grotesk |
| `slate-chisel` | Slate Chisel | Carved slate | Chiselled | lapidary |
| `standing-stone` | Standing Stone | Carved slate | Risen | stave |
| `inlaid-marble` | Inlaid Marble | Marble with metal inlay | Swept by light | lapidary |
| `marble-chisel` | Marble Chisel | Marble with metal inlay | Chiselled | uncial |
| `embroidered` | Embroidered | Embroidery | Row by row | uncial |
| `patch` | Patch | Embroidery | Struck | grotesk |
| `wax-seal` | Wax Seal | Sealing wax | Struck | textura |
| `wax-drop` | Wax Drop | Sealing wax | Dropped | uncial |
| `pixel-assemble` | Pixel Assemble | Pixel blocks | Assembled | stave |
| `pixel-type` | Pixel Type | Pixel blocks | Typed | grotesk |
| `pixel-raster` | Pixel Raster | Pixel blocks | Row by row | stave |
| `chalk-hand` | Chalk Hand | Chalk | Written | uncial |
| `chalk-dust` | Chalk Dust | Chalk | Bled in | grotesk |
| `crt-power` | CRT Power On | CRT phosphor | Powered on | grotesk |
| `terminal` | Terminal | CRT phosphor | Typed | stave |
| `crt-flicker` | CRT Flicker | CRT phosphor | Flickered on | grotesk |
| `engraved-plate` | Engraved Plate | Engraved steel | Swept by light | lapidary |
| `steel-stamp` | Steel Stamp | Engraved steel | Struck | grotesk |
| `graver` | Graver | Engraved steel | Chiselled | textura |
| `pyrography` | Pyrography | Burned wood | Burned in | textura |
| `carved-wood` | Carved Wood | Burned wood | Chiselled | uncial |
| `paper-cut` | Paper Cut | Cut paper | Dropped | grotesk |
| `pop-up` | Pop Up | Cut paper | Risen | lapidary |
| `paper-iris` | Paper Iris | Cut paper | Irised | uncial |
| `frosted-iris` | Frosted Iris | Frosted glass | Irised | grotesk |
| `glass-assemble` | Glass Assemble | Frosted glass | Assembled | stave |

## The materials

Each material has three looks, and your studio name picks one of them. The treatment's name never promises a colour: Foil may come out gold, silver or copper. Two studios on the same treatment always get their own ground and timing, and about two times in three a different look as well. Change a single letter of the name and you may get a different look.

| Material | How it is made | The three looks |
|---|---|---|
| Foil | metallic gradient face, struck in with a hairline shadow | gold on navy, silver on oxblood, copper on black |
| Ink | ink pooled into paper: a feathered bleed under a ragged edge cut by noise | sumi on cream, indigo on rice paper, sepia on parchment |
| Letterpress | debossed into thick board: ink in the bed, shadow on the upper lip, light on the lower | vermilion on cotton, black on cotton, navy on grey board |
| Neon | the letter OUTLINE bent as a glass tube: a glow, a coloured tube and a white hot core, on brick | hot pink, ice cyan, amber |
| Carved slate | a fresh cut: the letter shows the paler stone under the weathered face, a shadowed upper flank and a lit lower one | blue slate, charcoal, green slate |
| Marble with metal inlay | an incised groove filled with metal leaf, in veined marble | carrara and gold, nero and gold, verde and silver |
| Embroidery | satin stitch: parallel thread stitches clipped to the letter, each with its own sheen, on woven cloth | red on linen, gold on navy felt, white on forest |
| Sealing wax | a rounded raised pool: the letter swollen and recut, a glossy highlight and a cast shadow | red wax on parchment, green wax on parchment, black wax on linen |
| Pixel blocks | the letter rasterised to a coarse grid of bevelled blocks | arcade cyan, handheld green, amber terminal |
| Chalk | a stipple: grains of chalk caught by the board inside the letter, thinning at the edge | white on slate board, yellow on green board, pink on black board |
| CRT phosphor | phosphor light: a bloom, a colour ghost and scanlines through the letter, on a dark curved screen | green phosphor, amber phosphor, white phosphor |
| Engraved steel | a graver cut in brushed metal: a dark groove with a bright burnished lower edge, on a screwed plate | brushed steel, titanium, brass plate |
| Burned wood | pyrography: a charred core with a scorched halo, in a sawn wood grain | oak, walnut, pine |
| Cut paper | a sheet cut to the letter and lifted off the page on a soft cast shadow | cream on teal, coral on navy, yellow on charcoal |
| Frosted glass | translucent frosted panes with a bright cut edge and a diagonal reflection, over soft lights | ice, emerald, rose |

## The arrivals

| Arrival | What happens |
|---|---|
| Struck | the whole name is driven down onto the surface; dust jumps at the impact |
| Swept by light | the name fades up, then a band of light travels across it |
| Written | each letter is drawn in turn from left to right, a lit nib at the leading edge |
| Bled in | the name soaks up out of a blur, from the middle letters outward |
| Flickered on | letters catch one at a time in a random order, stuttering before they hold |
| Chiselled | each letter is cut from the bottom up in hard steps, chips falling from the blade |
| Row by row | each letter is laid down row by row, a needle (or a raster beam) bright where the line is |
| Assembled | the letters fly in as scattered strips and lock into place |
| Powered on | the screen opens from a bright line, then the name burns in |
| Risen | each letter rises out of the line it stands on |
| Typed | letters land one at a time with a small kick, a cursor ahead of them |
| Irised | a circle of light opens from the centre and the name is inside it |
| Dropped | letters fall into place one after another and bounce |
| Burned in | a glowing ember line crosses the name and leaves it scorched in behind |

Every arrival ends with the whole name at rest, sharp and complete, for the hold.

## Your studio name

* Capital letters, digits, spaces and common punctuation are cut from the letterforms that come with the plugin. Lower case is set as capitals.
* Two of the five hands are historical scripts and read that way: the uncial hand writes N as a rounded n, and the stave hand cuts C as a bracket and O as a diamond. The treatment table below names each treatment's hand (lapidary and grotesk are plain capitals, textura is blackletter); pick another treatment if your name reads oddly in one.
* A character outside that set (accented letters, Japanese, Cyrillic, Greek) is set in a serif display font stack instead and still drawn in the treatment's material. It is never set in the engine's default font.
* A name up to 40 characters long fits. A name too long for one line is broken onto two lines at the space nearest its middle.
* Spaces at either end, and repeated spaces, are ignored. A blank name sets YOUR STUDIO.

## The credit plate

Fill in **Credit plate: small line** and **Credit plate: main line** (for example MADE WITH and RPG MAKER MZ) and a second plate plays after your ident, in the same treatment, before the title. It is text only: the plugin never draws anyone's logo. Leave both lines empty for no credit plate.

## Parameters

| Parameter | Default | What it does |
|---|---|---|
| Studio name | Your Studio | the name the ident sets |
| Treatment | `foil-strike` | one of the forty treatments above |
| Credit plate: small line | (empty) | the small upper line of the optional second plate |
| Credit plate: main line | (empty) | the main line of the optional second plate |
| Arrival time | 120 | frames the name takes to arrive (60 frames is one second), 30 to 300 |
| Hold time | 100 | frames the finished ident stays on screen, 0 to 600 |
| Fade time | 30 | frames for each fade out, 1 to 120 |
| Skippable | on | OK, Cancel or a tap skips the ident with a short fade |
| Sound on arrival | none | a sound effect from your own project, played as the ident starts |

A blank or unreadable number uses the default; a number outside its range is held to the nearest end of it. A treatment name that does not exist uses the first treatment, so a typo never stops the game.

## Plugin commands

| Command | What it does |
|---|---|
| Play Ident | plays the ident now and returns to the scene it was called from; does nothing during a battle |

## Compatibility

* Extends `SceneManager.goto` and always calls the original: the first move to the title screen in a session becomes the ident, which then moves to the title itself.
* Adds one scene, `Scene_Ident`, and one plugin command. Replaces no engine method.
* Because it waits for the move to the title rather than replacing the boot scene, another splash plugin that shows its own scene and then goes to the title keeps working, placed above or below Ident: its splash plays, then the ident, then the title. This was tested with a test splash plugin built that way, in both orders.
* Saves nothing. Adds nothing to save files.
* Once the name is at rest, a treatment that does not hum is drawn once and only faded, not redrawn every frame.
* While the name moves, the ident is redrawn every second frame (30 times a second), so it uploads one picture the size of the screen to the graphics card every two frames, never every frame.

## Limits

* No logo image in this version: the ident is your name, set in letterforms.
* The ident is drawn for the game's screen size when it starts. Its timings are counted in engine frames (60 to a second); the moving part is redrawn on every second one.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
