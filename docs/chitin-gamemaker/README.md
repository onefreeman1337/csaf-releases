# Chitin: 48 Generated Insects for GameMaker — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Chitin: 48 Generated Insects for GameMaker  
**Engine:** GameMaker 2024+  
**Store page:** https://csaf.itch.io/chitin-gamemaker  
**Docs published:** 2026-11-07


---

# CHITIN — Insects That Draw Their Own Shells

**A beetle, butterfly and moth corpus for GameMaker, computed from numbers and drawn in pure GML —
with the field layer, the catching loop and the cabinet that make it a game.**

48 species · 6 body plans · 8 patterning programs · 8 antenna forms · 5 leg forms ·
7 sculptures · 18 cuticles · 3 wing shapes ·
8 habitats · 6 seasons · 6 times of day · 4 weathers · 6 escape programs ·
no sprites, no atlas, no texture page.

Version 1.1.0 · GameMaker Studio 2.3+ / GameMaker 2024.x · runtime `2024.14.4.268`

---

## What this is, and what it is not

**This is not an insect sprite pack, and it is not only a generator.**

A picture of a beetle is a picture. It cannot be a different species, it cannot be iridescent at one
angle and copper at another, and it cannot tell you it flies at dusk in high summer along a
hedgerow. If your game needs a beetle you do not have, the art is simply wrong and nobody can fix
it but the artist.

Chitin ships the animal AND the world it lives in. A species is a set of numbers:

```
plan  cut  hk pk ak  lk bk  sculpture n  antenna len  leg  mandible  eye  pattern n
```

and a second set that says where it is:

```
habitat mask   season mask   peak season   daypart mask   weather   abundance
alarm radius   escape speed  escape program
```

Change `ak` from 0.94 to 1.36 and the beetle becomes round. Change `lk` from 1.22 to 0.72 and a
splinter becomes a ladybird. Move the flight period and the same animal becomes hard to find, the
field-guide page redraws itself, and the score it is worth in the cabinet goes up — because the
rarity is **derived**, not typed in a second place.

### The two things worth looking at first

**Structural colour.** A jewel beetle is not green. It is a diffraction grating that returns green
at one angle and copper at another, and that is a *program*, not a palette. Press `S` in the demo
room to stop the shimmer and watch what it was doing. It is a narrow band moving across the shell,
never a hue drifting over the whole of it — a rainbow decal is what the wrong version looks like.

**The approach.** You do not catch an insect by being fast. You catch it by being slow, and then
fast once. Every animal carries an alarm radius and watches how you move, so the same beetle lets
you stand over it or is fifteen feet away before your arm moves, depending only on how you walked.
That is two numbers per species, and it means the difficulty is **the animal** rather than a slider.

Measured over all 48 species, in-engine: a careful approach got closer on **24** of them and further
on **none**, best case **1.24 body widths** on the green tiger beetle — which is the animal that
should reward patience most, and was not put there by hand.

---

## Quickstart

1. Import `Chitin.yymps` (**Tools → Import Local Package**, select all).
2. Open `rm_ctn_demo` and press Play.
3. `TAB` cycles the four views: **a specimen**, its **field-guide page**, the **beetle drawer** and
   the **butterfly drawer**. `LEFT`/`RIGHT` change species · `SPACE` pause · `S` stop the shimmer.

The store images on this listing are the same four screens, rendered by the same functions.

Then, in your own code:

```gml
// DRAW ONE. _px is the width you are drawing at - it is a level-of-detail input, not a scale.
var _parts = ctn_species_parts(_i, 96, _phase);          // species, drawn width, viewing phase
var _pal   = ctn_species_palette(_i, _phase, 96);
ctn_render_in_rect(_parts, _pal, x, y, 96, 96, 0, ctn_species_map());

// WHAT IS OUT RIGHT NOW. Habitat, season and daypart are INDICES; weather is a BIT.
var _out = ctn_field_now(0, 3, 2, CTN_WX_CLEAR);   // meadow, high summer, midday, clear
                                                   // -> [{i, p}, ...], commonest first
var _who = ctn_field_pick(0, 3, 2, CTN_WX_CLEAR, _seed);   // -> one species index, or -1 if empty

// THE APPROACH. Pure: hand it the player position each step, take the new state back.
var _sp = ctn_catch_new(_who, _sx, _sy, _seed);
_sp = ctn_catch_step(_sp, player_x, player_y, delta_time / 1000000);

// THE SWING.
var _hit = ctn_catch_net(_sp, net_x, net_y, net_r);
if (_hit.hit) {
    cabinet = ctn_cabinet_pin(cabinet, _sp.i, ctn_catch_condition(_hit.quality));
    _sp = ctn_catch_take(_sp);
}

// THE CABINET. A VALUE, not an object - every mutator returns a NEW one.
cabinet = ctn_cabinet_new();
var _todo = ctn_cabinet_gaps_now(cabinet, 0, 3, 2, CTN_WX_CLEAR);
// -> the SAME [{i, p}, ...] rows ctn_field_now returns, filtered to what you have not pinned.
// Read the species index off .i - the rows are structs, not bare indices:
//     for (var _k = 0; _k < array_length(_todo); _k++) { show_debug_message(_todo[_k].i); }
```

⚠️ **`ctn_catch_step` takes SECONDS, not steps.** Pass `delta_time / 1000000`. A model advanced by a
constant per step behaves differently at 30 fps and at 144 fps, and an animal whose alarm depends on
frame rate is an animal your players will report as a bug.

⚠️ **`ctn_species_parts` takes the width you will actually draw at.** Every count in the package with
a resolution floor reads it: how many striae, how many shimmer bands, how many wing veins, whether
the legs are drawn at all. Guess it and you get a picture composed for a size it is not being shown
at.

---

## The three things this does that a picture cannot

### 1. It is a different animal when you change a number

There is no atlas to re-cut and no artist to brief. The two ladybirds in the roster share **every
body number to the digit** and differ only in their pattern program, because that is genuinely the
difference between a seven spot and an eyed ladybird. Copy either row, change one field, and you
have a species that has never existed and still looks like it belongs.

### 2. It knows when it is out

`ctn_field_now(habitat, season, daypart, weather)` returns what a player would actually meet, with a
density rather than a boolean — every species is present across its whole flight period, and there
is a month when there are most of them. A clear midday meadow in high summer is busy. A pine wood at
night in autumn rain is **empty**, and that is a real answer.

The peacock and the brimstone are **hibernators**: they fly in early spring as overwintered adults,
vanish while the next generation is in its chrysalis, and fly again from late summer. The season
column is a mask and not a range precisely so that this can be true.

### 3. It can tell you WHY two species are different

```gml
ctn_field_separates(12, 13)   // -> ["marking"]
```

One word, and it is the whole answer: those two ladybirds differ by their markings and by nothing
else. `ctn_field_identify(actual, guess)` returns which marks separate them and whether the mistake
was a defensible one — so a wrong identification teaches something true instead of buzzing.

Across all 1,128 pairs in the corpus, **no two species share all six field marks.** That is asserted
in-engine, not asserted here.

---

## What is in the box

| script | what it owns |
| --- | --- |
| `ctn_geom` | primitives, curve sampling, transforms, the seeded generator |
| `ctn_palette` | Oklab to sRGB, chroma ceiling, `ctn_oklch` |
| `ctn_relief` | shades an outline by its own surface normal |
| `ctn_render` | the only file that talks to the GPU |
| `ctn_shape` | outline treatments and the geometry assertions |
| `ctn_body` | head, thorax and abdomen as ONE continuous outline |
| `ctn_elytra` | elytra profile and sculpture — striae, punctation, costae |
| `ctn_wing` | membrane and the venation fan; what tells a beetle hindwing from a butterfly forewing |
| `ctn_pattern` | banded, spotted, striped, marbled, eyespot, reticulate, metallic |
| `ctn_antenna` | filiform, clavate, lamellate, pectinate, plumose, geniculate, moniliform, serrate |
| `ctn_leg` | cursorial, fossorial, natatorial, raptorial, saltatorial |
| `ctn_chroma` | the structural-colour program and the 18 cuticles |
| `ctn_species` | the 48-species corpus, composed from all of the above |
| `ctn_field` | habitat, season, time of day and weather — what is out, and how to tell it apart |
| `ctn_catch` | the approach, the six escape programs, the net and the condition it leaves |
| `ctn_cabinet` | the drawer the player fills, scored, with the gaps DRAWN |
| `ctn_corpus` | every name in the package, in one file — replace it to translate |
| `ctn_bake` | the plates: contact sheet, field-guide page, cabinet drawer |
| `ctn_selftest` | the in-engine suite |

**Everything in `ctn_field`, `ctn_catch` and `ctn_cabinet` is a pure function.** No instance
variables, no draw calls, no room state, nothing random at query time. That is deliberate: GML
cannot be unit-tested outside the engine, so the half of this package that does not need a GPU never
touches one.

---

## Translating it

Every word a player reads lives in `ctn_corpus`. Replace that one file — species names, habitats,
seasons, antenna forms, conditions — and every builder keeps working, because none of them contains
a word. The figures the store page quotes are summed from those same arrays, so a shorter roster
reports a smaller number rather than a stale one.

---

## Namespacing

Every script, macro and global in this package is prefixed `ctn_` / `CTN_`. GameMaker's global
namespace is flat, and a collision inside your project is a support problem nobody can debug
remotely. Nothing here is named `beetle`, `insect`, `wing` or `catch`.

**Changed in 1.1.0:** the prefix was `cht_` / `CHT_` in 1.0.0, which our Charter package also uses, so
the two could not be imported into one project. Every name is now `ctn_` / `CTN_`: the scripts, the
demo object (`obj_ctn_demo`) and the demo room (`rm_ctn_demo`). `ctn_oklch` now returns neutral grey
for a non-number argument instead of stopping the game. Nothing else changed. If you imported 1.0.0,
delete what it added before importing 1.1.0 (its scripts start `cht_`, and its demo object and room
carry `cht` in their names), then rename your own calls from `cht_` to `ctn_`.

---

## Verification, stated honestly

GML has no unit test outside the engine — no headless runner, no mock, no assertion library. What
this package has instead:

- **`ctn_selftest`, run inside a real build.** **6,591 assertions, 0 failures**, on runtime
  `2024.14.4.268`. It sweeps all **1,128** species pairs for collisions, checks that every body plan
  closes at both ends, that every mark on a wing fits the wing at every station it covers, that the
  corpus is deterministic across identical calls, and that a careful approach never costs you ground.
- **The demo room**, which is the only real smoke test a GML package has, and is why it is here.
- ⚠️ **What the suite cannot see:** it computes points and numbers. It cannot see a fill rule, a draw
  order, a colour on a page or a picture. Every visual defect this package has had was found by
  rendering a sheet and looking at it.

---

## Licence

See `LICENSE.txt`. Short version: use it in unlimited games, commercial or free, forever; modify it
however you like; **everything it draws for your game is yours**, with no attribution and no revenue
share. Do not resell the package itself.

The package contains no third-party code. It ships two font resources built from Open Sans
(Apache-2.0, notices in `Chitin/fonts/THIRD-PARTY-NOTICES.txt`) which are used for **captions only**
— species names, field marks, drawer labels. No animal in this package draws a glyph.

**AI disclosure:** this package was written with AI assistance, and that is disclosed on every
listing that carries it.

Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
