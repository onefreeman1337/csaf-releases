# Kithfell Companions: 16 Animal Battlers for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Kithfell Companions: 16 Animal Battlers for RPG Maker MZ  
**Engine:** PixelLab API (REST, from Node) — engine-agnostic PNG/sheet output  
**Docs published:** 2026-11-03


---

# Kithfell Companions: RPG Maker MZ Side-View Animal Battlers

**The 16 Kithfell animals as RPG Maker MZ side-view party members: all 18 battle motions, ready for `img/sv_actors`.
16 sheets at 720×480 and 16 more at 1440×960, 800 frames per grid.**

The pet a player walks around your map is the same pet that fights. Tabby Cat, Black Cat, Calico Cat, Herd Dog, Beagle, Corgi, Rabbit, Ferret, Hedgehog, Red Fox, Grey Wolf, Wild Boar, Brown Bear, Mane Lion, Red Stag and Draught Horse come from
**Kithfell 01**, **Kithfell 02** and **Kithfell 03**. Every motion opens from that animal's own shipped idle, in the same
224-colour palette, so the battle sprites match the Kithfell map sprites. This pack also works on its own.

> ⚠️ **AI DISCLOSURE: read this first, so you can decide with it in hand.**
> **The art in this pack is AI generated.** Every frame was produced with **PixelLab**, a pixel-art diffusion model, on a paid plan that
> grants commercial rights, then palette-locked and cut to each grid by tooling we wrote. The code in that pipeline was written with AI
> assistance too. The itch listing is tagged **Generative AI: Graphics = yes, Code = yes**. If you would rather not use AI-generated
> assets, please don't buy this.

---

## Install in RPG Maker MZ (no plugin)

1. Copy the PNGs you want from `rpgmaker_mz/img/sv_actors/` into your project's `img/sv_actors/` folder.
2. In the Database, open **Actors**, pick an actor and set its **[SV] Battler** image to the matching `Kithfell_...` sheet.
3. In the Database, **System 1**, turn on the side-view battle option.

That is all. **We installed it exactly this way in a blank MZ project and ran a real side-view battle** with all 16 animals, four to a
party: every one of the 18 motions forced on every actor and read back from the engine, at both sizes.
At 80×80: **288 actor-motion pairs, 864 frame reads, 0 wrong, 0 engine errors.** At 160×160: **288 actor-motion pairs, 864 frame reads, 0 wrong, 0 engine errors.**

**If an animal is invisible in battle**, its [SV] Battler name does not match a file in `img/sv_actors` exactly. In a test play, F8 opens the
console, which shows the missing file as a 404.

**Leave the animals unarmed.** MZ draws a weapon's own image over an actor when it attacks with one. With no weapon equipped, MZ's default
database plays `thrust` for an attack, which is the bite here.

**Why 720×480 and not MZ's 576×384?** A pounce reaches well past a 64 px cell. MZ cuts a battler sheet into 9 × 6 cells by the image's own
size and stands the actor at the bottom centre of the cell, so an 80×80 sheet needs no plugin. **The HD sheets** (`rpgmaker_mz_hd/`) work
the same way at 160×160 cells, twice as large. Use them for a larger battle scene.

**True scale, one ground line.** At rest on the 80 px sheets the hedgehog stands 26 px tall and the red stag 56 px, so the cast keeps its real sizes in one party.

---

## The 18 motions

MZ's own layout: three columns of three frames, six rows. Loops play 1, 2, 3, 2; one-shots play once. The action in each row is the animal's version of MZ's human motion.

| Motion | What it shows |
| --- | --- |
| `walk` | Steps forward, three frames of the animal's own Kithfell walk. |
| `wait` | The battle idle: a slow breath. |
| `chant` | The head sinks in a low growl (the horse and stag paw the ground). |
| `guard` | Hunches low and braced, the head down (the stag brings its front tines forward). |
| `damage` | Flinches, the head jerking, on most animals with the eyes squeezed shut. |
| `evade` | Hops clear of the ground. |
| `thrust` | A bite, jaws wide. The horse and stag rear up; the boar lunges with its head up. |
| `swing` | A front paw reaches out. The horse and stag stamp high; the boar lifts its head with the mouth open. |
| `missile` | One sharp bark or cry, the head jerking up. The horse and stag toss the head. |
| `skill` | A pounce, paws ahead, most of the cast clear of the ground. The horse breaks into a gallop; the stag strides in with its head lowered. |
| `spell` | A howl, muzzle lifted, mouth wide. |
| `item` | The head lowers toward the ground. A few reach it, most stop a little short, and the fox, the lion and the horse only dip it. |
| `escape` | The animal's own walk seen from the other side: it runs off to the right, as MZ expects. |
| `victory` | A happy lift of the front paws, a hop on the smaller animals. The horse and stag prance. |
| `dying` | The head hangs, panting (MZ shows it when HP is low). The small animals sink right down; the tall ones stay on their feet. |
| `abnormal` | The head droops, the eyes half closed (MZ shows it for a bad status). |
| `sleep` | One held frame, asleep. |
| `dead` | One held frame, lying still. |

---

## One palette, and the number that proves it

> **Every opaque pixel in this download, 14,557,004 of them, falls inside ONE 224-colour palette**, the
> same colours as Kithfell 03's shipped sprites (which include all of Kithfell 01's and 02's), listed in `pack.json`.

### The integrity proof

Every figure is a real count returned by our pack proof against the decoded pixels of the files in this download.

| | checked |
| --- | --- |
| Every `.png` really is a PNG, not a renamed JPEG | **2,784 files** |
| Every image decodes to real pixels | **2,784 files** |
| Every frame is exactly one cell; every sheet a whole multiple of its cell | **2,784 files** |
| **Every opaque pixel falls inside the declared palette** | **14,557,004 opaque pixels** |
| Alpha is strictly binary: no anti-aliasing, no soft upscale | **104,448,000 pixels** |
| Every declared frame is mapped, lands inside its sheet, and exists at every grid | **3,200 frame checks** |

---

## The download

```
rpgmaker_mz/img/sv_actors/      16 side-view battler sheets, 720×480 (80×80 cells)
rpgmaker_mz_hd/img/sv_actors/   the same 16 at 1440×960 (160×160 cells)
160x160/frames/                 every frame as its own PNG: <animal>_<motion>_west_<n>.png
160x160/sheets/                 one strip per animal and motion
80x80/                          the same at 80×80
engine_import/godot/            80x80/ and 160x160/: one SpriteFrames .tres per animal
frames.json                     all 800 frame rectangles
pack.json                       the manifest: animals, motions, frame counts, palette
LICENSE.txt
```

Every frame faces left, the way MZ draws a side-view party, except `escape`, which runs off to the right. For **Godot 4**, point an `AnimatedSprite2D` at a `.tres`
(set Default Texture Filter to Nearest). For anything else, `frames.json` gives every frame's sheet, x, y, w and h.

---

## Stated plainly

1. **This pack is the battle sprites only.** The map walking sprites in four directions are in the Kithfell packs listed below. This pack does not need them to work.
2. **Tabby Cat, Black Cat, Calico Cat, Beagle, Corgi, Rabbit, Ferret, Hedgehog and Red Fox sit at rest and stand to walk.** Their shipped idle is seated, so `wait`, `chant`, `guard`, `spell` and `damage` are seated poses, and MZ cuts straight from those to the standing `walk`. A three-frame MZ sheet has no room for a getting-up frame.
3. **Shared art.** `walk` and `escape` are the Kithfell packs' own shipped frames. So are `item` for the eight house pets (the eat start) and for the fox, wolf, boar and stag (the forage start), and `sleep` for the eight house pets. Every other row was newly generated for this pack, opening from that animal's shipped idle.
4. **The horse sleeps on its feet, head low.** It would not lie down on the rolls we tried, and real horses do sleep standing. Its `dead` frame does lie flat. For the wolf, lion and boar, `sleep` and `dead` are frames of one fall, so they look alike. The stag's `sleep` is a head-up rest with its legs folded, and its `dead` is a sprawl.
5. **`sleep` and `dead` are single held frames**, repeated across their three cells as MZ's own sheets do.
6. **No impact effects, no blood.** The generator painted dust, rings, sparks and small marks beside the animals. We erased 94 such loose marks and re-bought or re-chose the frames where one touched the animal. The pink and purple in the mouths is the animals' own tongue and mouth colour.
7. **Ears are the loosest part of this cast.** The beagle's lift into rounder shapes in `chant`, `thrust`, `victory` and `dying`. The herd dog's darkens and lifts in `chant` and `damage`, and covers its face in `dying`. The ferret's far ear stands up in `wait`. The rabbit's two ears close into one tall shape in `spell`.
8. **Tails and the escape row.** The boar shows a small tail in `skill` and `victory` that its rest pose hides. `escape` is each animal's shipped east walk, drawn a little differently from its west walk: the calico's tail is shorter and the lion's mane heavier, with a round tail tip.
9. **Some motions are smaller than their names.** The black cat's pounce barely leaves the ground, the herd dog's `victory` is standing tall rather than a hop, the rabbit's `swing` arm is straight, and the fox's `dying` drops its head in one step between two frames. The other way, the horse's `missile` throws its head far back.
10. **Mouths.** The bear's tongue reads pale in `spell`, the hedgehog's howl is a small square mouth, and the boar's far tusk swells when its head lifts.
11. **Lying down.** The lion lies about 1.5 times its standing length in `sleep` and `dead`, so it fills the cell, and its tail stands up in `sleep`. The bear's `sleep` is a crouch rather than lying flat, and its dark eye does not clearly read as shut. The stag's antlers cover its hindquarters in `dead`, and the horse's mane stands up in a spike in `dead`.
12. **Edited by hand.** The boar's, stag's and horse's `sleep` and `dead`, and the fox's, hedgehog's and lion's `dead`, came back with the eye open or half open; those eyes were painted shut afterwards, along with a fleck in the bear's `sleep`. At high zoom the painted lids look flatter than the coat. The herd dog's `damage` ear and a few small marks were repaired the same way.
13. **At high zoom** the black cat's `item` frames have thin blue marks under the chin, from its shipped eat frames.

---

## Licence

**Commercial use permitted**: paid games, any number of projects, no attribution, no royalty. Modify, recolour, re-cut
and extend freely. You may not resell or redistribute the sprites as an asset pack, and you may not use them to train a
machine-learning model. Full terms in `LICENSE.txt`.

---

## The series

- **Kithfell 01: Companions and Beasts** (map sprites for the herd dog, draught horse, brown bear and mane lion): https://csaf.itch.io/kithfell-01-companions-and-beasts
- **Kithfell 02: House Pets** (map sprites for the cats, beagle, corgi, rabbit, ferret and hedgehog): https://csaf.itch.io/kithfell-02-house-pets
- **Kithfell 03: The Wildwood** (map sprites for the fox, wolf, boar and stag): https://csaf.itch.io/kithfell-03-the-wildwood
- **The Kithfell Sampler** (free, a few animals from each pack): https://csaf.itch.io/kithfell-sampler

*Core Systems Asset Factory*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
