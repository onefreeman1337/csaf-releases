# Sigil Core - Procedural Spell Seals & Magic Circle Generator for RPG Maker MV & MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Sigil Core - Procedural Spell Seals & Magic Circle Generator for RPG Maker MV & MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/sigil-core  
**Docs published:** 2026-11-05


---

# Sigil Core — Procedural Spell-Sigil Engine for RPG Maker MZ and MV

**Your spells draw their own art.**

Point Sigil Core at the skills you already have. For every one of them it generates a unique,
deterministic, animated sigil — derived from that skill's own properties in your database. No
artist, no two hundred hand-drawn icons, no asset pack to match up by hand.

The same skill always produces the same sigil, on every machine and in every save. Nothing is
random at run time.

---

## Install

1. Copy the three files from `js/plugins/` into your project's `js/plugins/` folder.
2. Open the Plugin Manager and add them **in this order**:

   | # | Plugin | What it is |
   | --- | --- | --- |
   | 1 | `SigilCore` | The generator. Decides *what* a sigil is. Draws nothing. |
   | 2 | `SigilRender` | The renderer. Glow, inscription, rotation. |
   | 3 | `SigilGrimoire` | The Grimoire scene. Optional — skip it if you only want in-battle art. |

   Order matters: `SigilRender` and `SigilGrimoire` both declare `SigilCore` as their base.

   **In RPG Maker MV 1.6:** also copy `CSAF_MVBridge.js` and put it **at the top of the list**, above
   `SigilCore`. It supplies the few parts of MZ's scripting these plugins use and MV lacks, changes no
   window of yours or of any other plugin, and does nothing at all in MZ (you can leave it out there).

3. That is the whole installation. There is nothing to configure before it works — ten element
   palettes ship built in, and every parameter has a working default.

---

## Try it in thirty seconds

Make an event, add **Plugin Command → SigilGrimoire → Open the Grimoire**, leave Actor at 0, and
talk to it. In MV, the event's Plugin Command line is `SigilGrimoire open` (or `SigilGrimoire open actorId=1`). Every skill your party knows is there, each with its own seal.

---

## What decides what

This is the part worth understanding, because it is what makes the art feel like *your* game's art
rather than a random generator's.

| Your database field | What it changes |
| --- | --- |
| **Damage → Element** | The palette. The whole figure is drawn in that element's ink and glow. |
| **Damage → Type** | The glyph family, drawn at the centre of the seal. |
| **Scope** | The arrangement — a single core, a mirrored pair, or an encircling outer band. |
| **Hit Type** | The stroke character: solid for Certain Hit, heavy for Physical, dashed for Magical. |
| **MP / TP cost** | The complexity budget. An expensive spell earns more rings, marks and nodes. |
| **Skill id + name** | The seed. Two skills that agree on everything above still look different. |

The five glyph families:

- **Strike** — HP damage. A blade through a tight ring.
- **Hex** — MP damage, or a skill whose whole job is applying states. An inverted, off-axis star.
- **Mend** — HP or MP recovery. Concentric, unbroken, quiet.
- **Drain** — an open spiral of arcs, pulling inward.
- **Ward** — no damage formula and no states. A stable triangle.

### The one rule behind the look

Everything angular sits on a single N-fold rotational symmetry, chosen per skill between your
`symmetryMin` and `symmetryMax`. One sector is decided and then repeated. That constraint is the
entire difference between a sigil and a scribble — an earlier draft without it produced figures that
were objectively more varied and looked like noise.

---

## Parameters

### SigilCore

| Parameter | Default | Notes |
| --- | --- | --- |
| **Element palettes** | *(empty → 10 built-ins)* | One entry per element id. Leave it empty and you get the ten shipped palettes; add even one and yours replace them entirely. |
| **Base complexity** | 4 | How much geometry the plainest skill gets. |
| **Complexity per 10 MP** | 2 | What an expensive spell earns. |
| **Complexity cap** | 11 | Past this a sigil reads as noise. Raise it with your eyes open. |
| **Minimum / maximum symmetry** | 3 / 8 | 3 gives triangles, 8 gives dense stars. Narrow the range to make your game's magic feel consistent. |
| **Seed salt** | `sigil` | **Change this to reroll every sigil in the game at once.** Same salt always gives the same art. |

### SigilRender

| Parameter | Default | Notes |
| --- | --- | --- |
| **Glow strength** | 100 | Percentage. 0 draws flat lines with no bloom. |
| **Inscription length** | 78 | Frames to draw a sigil from nothing. 60 = one second. |
| **Rotation speed** | 6 | Degrees per second for the outer layer. The inner layer counter-rotates faster. |
| **Supersampling** | 2x | Draws at double size and scales down. **The single biggest difference to how clean the lines look.** Set it to Off only if you are targeting very low-end hardware. |

### SigilGrimoire

| Parameter | Default | Notes |
| --- | --- | --- |
| **Grimoire title** | `GRIMOIRE` | Heading text. |
| **Typeface** | *(blank → serif stack)* | A CSS font family. Blank gives a serif stack; anything is better than MZ's default font, which is the loudest "this is RPG Maker" signal a screenshot can carry. |
| **Show derived facts** | ON | The symmetry / complexity / strokes / seed strip under the sigil. Turn it off for a pure-art presentation. |

---

## Using sigils outside the Grimoire

Everything is available to your own code.

```js
// A finished sigil for any database skill. Cached after the first call.
const sig = SigilCore.forSkillId(11);

// A sprite that inscribes itself and then turns forever.
const sprite = new Sprite_Sigil(160);      // 160 on-screen pixels
sprite.setSigil(sig);                      // pass true as a 2nd arg to skip the animation
sprite.x = 400; sprite.y = 300;
this.addChild(sprite);

// Or two counter-rotating layers, which is what the Grimoire uses.
const pair = new Sprite_SigilPair(220);
pair.setSigil(sig);

// Or just a Bitmap you blit yourself.
const bmp = SigilRender.toBitmap(sig, 128, 1.0);   // sigil, size, progress 0..1
```

`Sprite_Sigil` also exposes `isComplete()` and `finish()`, so you can hold a cast until the seal has
finished drawing.

---

## Performance

- **Generation happens once per skill and is cached** for the process lifetime. It is a pure
  function of the skill and the configuration, so caching is safe.
- **The cache is deliberately NOT stored on `$gameSystem` or any `$game*` object.** Anything parked
  there is serialised into every save file by `JsonEx` and kept for the whole playthrough. Your
  saves stay the size they were.
- **Repainting is throttled.** The inscription redraws on a quantised step rather than every frame,
  and stops entirely once the figure is complete. Rotation after that is a sprite transform and
  costs nothing.
- Measured in the real MZ engine on a Grimoire page with a live two-layer sigil: 9 draw calls a frame, no texture uploads, no growth in display objects, and 0 of 1,800 measured frames over the 60 FPS budget.

---

## Compatibility

- Patches nothing in MZ. Sigil Core adds new classes and reads `$dataSkills`; it does not extend or
  replace any core method, so it cannot conflict with a battle system, a menu replacement or a
  skill-tree plugin.
- **It does not restyle your game.** The Grimoire's windows are private classes. Shared classes
  like `Window_Gold` and `Window_Help` are untouched, because theming a shared prototype would mean
  installing this plugin silently restyled your entire project.
- Runs in RPG Maker **MZ**, and in **MV 1.6** with `CSAF_MVBridge.js` at the top of the Plugin Manager
  (see Install). Every parameter in this guide, the script calls and the Grimoire were run on both
  engines from the shipped download.

## What this does NOT do

Stated plainly, so nobody buys it for something it is not:

- It does **not** replace MZ's battle animations. Sigils are sprites you can place; wiring one into
  a specific animation frame is your event's job.
- It does **not** generate icons for the item or equipment database — skills only.
- It does **not** export PNGs to disk. Sigils are generated at run time.
- It is **not** a magic system. It changes how your spells look, not how they work.

---

## Also from CSAF, for RPG Maker MZ

- [Verdict Core](https://csaf.itch.io/verdict-core) — investigation, cross-examination and deduction
- [Chronicle Core](https://csaf.itch.io/chronicle-core) — branching quests, foreclosed choices, faction reputation
- [Bazaar Core](https://csaf.itch.io/bazaar-core) — supply, demand, depleting stock, trade routes
- [Chimera Core](https://csaf.itch.io/chimera-core) — creature genetics, breeding, box storage
- [Chimera Battle](https://csaf.itch.io/chimera-battle) — type chart, move sets, status effects, matchup AI
- [Chimera Field](https://csaf.itch.io/chimera-field) — spawn tables, rarity tiers, variant rates, Dex

---

## Licence

See `LICENSE.txt`. Short version: use it in unlimited games, commercial or free, keep 100% of your
revenue, modify it however you like. Do not resell or redistribute the plugin itself.

## AI disclosure

The code in this plugin and the store artwork were produced with AI assistance. No audio and no
in-game text or dialogue ship with this product.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
