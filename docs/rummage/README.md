# Rummage - I Spy and Seek-and-Find Scenes for RPG Maker MZ, Made From Your Own Items and Characters — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Rummage - I Spy and Seek-and-Find Scenes for RPG Maker MZ, Made From Your Own Items and Characters  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/rummage  
**Docs published:** 2026-11-05


---

# Rummage — I Spy Scenes Made From Your Own Items and Characters

**For RPG Maker MZ.** Version 1.0.0 · Core Systems Asset Factory

A seek-and-find scene is a lovely thing to put in a game: a dragon's hoard to pick through, a merchant's
cloth covered in trinkets, a crowded market where one face is the one you want. Making one by hand means
painting a background, painting every object, placing each one and checking that nothing you ask for is
buried out of sight.

Rummage composes the scene for you, from what your project already has. **I Spy** takes the items,
weapons and armour in your database (their icons and their names), scatters them across one of eight
surfaces the plugin draws, buries them in drawn clutter, and writes the names on a parchment list for the
player to find. **Crowd** takes your characters' walking sheets and fills a market square, a fair meadow
or a quay with them, then asks the player to find one person by face and costume.

Every scene comes from a seed, so a chest, a stall or a search can be different every time, or the same
every time. Every thing on the list is guaranteed to be findable: Rummage checks how much of each one
is left in plain view and moves the clutter until enough is. There are no image files to import.

---

## Install

1. Copy all **three** files from `js/plugins/` into your project's `js/plugins/` folder:
   - `RummageCore.js` (composes the scene, proves every listed thing can be seen, walks the crowd)
   - `RummageDraw.js` (draws the surfaces, the clutter, the parchment, the ink and the lens)
   - `Rummage.js` (puts it into your game: plugin commands, the scene, the results, saving)
2. Add them in the Plugin Manager and turn all three ON. **The order does not matter**: `Rummage.js` looks
   for the other two the first time a scene opens, not when it loads.
3. Start a scene from an event with the **I Spy** or **Crowd** plugin command (below).

---

## I Spy

The player sees a cluttered scene on the left and a parchment on the right listing what to find. Click
or tap a thing to find it: it is ringed in red ink and its name is struck through. A click on nothing
draws a small ink cross and counts as a miss. When everything is found (or time runs out, or the player
gives up) a plaque shows the result, and OK returns to the map.

### The eight surfaces

| Surface | Value | What it is buried in |
| --- | --- | --- |
| Dragon Hoard | `hoard` | coins, gem chips, chains, dragon scales, bones, rings |
| Merchant's Cloth | `velvet` | coins, bead strings, rings, ribbons, buttons, gem chips, wax seals |
| Tavern Table | `tavern` | dice, playing cards, corks, candle stubs, nutshells, coins |
| Forest Floor | `forest` | oak, maple and birch leaves, acorns, pine cones, twigs, mushrooms, snail shells, feathers, berry sprigs |
| Low Tide | `beach` | scallop and cone shells, starfish, pebbles, sea glass, kelp, snail shells |
| Alchemist's Bench | `bench` | vials, herb sprigs, crystals, candle stubs, petals, quills, wax drips, berry sprigs, ink blots |
| Sunken Wreck | `wreck` | kelp, rope coils, rivets, coral, pot sherds, scallop shells, pebbles, coins, chains |
| Library Desk | `library` | paper scraps, quills, ink blots, wax seals, ribbons, candle stubs, pressed flowers, buttons |

`auto` picks one from the seed.

### What can be hidden

Any item, weapon or armour that has **both an icon and a name**. Rummage never puts two records that
share an icon, or share a name, into the same scene, so "Find: Potion" can never be answered by a second
potion that looks the same. The things on the list come first; the rest of the scene's icons are decoys
that are not on the list, and no decoy shares an icon or a name with anything on it.

Notetags on items, weapons and armours:

| Notetag | Effect |
| --- | --- |
| `<Rummage: fish>` | gives the record a tag that a command can ask for. Several tags: `<Rummage: fish, river>` |
| `<Rummage: skip>` | never used in any scene |

So a fishing hut can ask for tag `fish` and show only fish, and a smithy can hide from `weapons` only.

### Difficulty

| Difficulty | Each listed thing keeps at least this much of itself in plain view | Decoys per listed thing |
| --- | --- | --- |
| `easy` | 80% | 2 |
| `normal` | 66% | 3 |
| `hard` | 52% | 4 |

The share in view is measured, not hoped for: Rummage samples each listed thing's outline and counts the
samples that nothing drawn above it covers. Clutter that would cover too much is moved or left out. A
click is only accepted on a part of a thing that can actually be seen, so a player can never "find"
something through the coins lying on top of it.

### The I Spy command

| Argument | Default | Meaning |
| --- | --- | --- |
| Surface | `auto` | one of the eight surfaces above, or `auto` |
| Things to find | 6 | 1 to 12 |
| Difficulty | `normal` | `easy`, `normal` or `hard` |
| Hide from | `all` | `items`, `weapons`, `armors` or `all` |
| Only this `<Rummage>` tag | blank | blank = any record; `fish` = only records tagged `fish` |
| Time limit (seconds) | 0 | 0 = no limit |
| Hints | 2 | 0 to 9 |
| Seed | blank | blank = a new scene every time; any text or number = the same scene every time |

Script call: `CSAF.Rummage.spy({ surface: 'hoard', count: 6, difficulty: 'normal', source: 'items', tag: 'fish', seconds: 0, hints: 2, seed: 'chest-3' })`.
It returns `false` (and opens nothing) when no record in the database can be hidden.

---

## Crowd

Your characters walk about a drawn ground, in front of its back row. The parchment shows the person to
find, in their own front-facing frame, with their name. Some walkers wear that person's own sheet in
other colours, so the costume alone is not enough: the player has to look. A recolour changes the clothes
only; faces and hands keep their own skin tones. Click or tap the right person to finish.

| Ground | Value | Its back row |
| --- | --- | --- |
| The Market Square | `plaza` | timber-framed house fronts and striped market stalls with their wares, barrels, crates and sacks |
| The Fair Meadow | `meadow` | a hedge and trees, striped pavilion tents with pennants, bunting, hay bales |
| The Quay | `quay` | harbour water with moored boats, the stone edge, crates, barrels, bollards and sacks |

Nobody walks behind the back row, so a stall is never drawn over a person. Walkers keep apart, wander,
pause, and step aside when they would stand in front of the person to find, so that person is always
there to be seen.

### The Crowd command

| Argument | Default | Meaning |
| --- | --- | --- |
| Who to find | blank | an actor id, or `file:index` for any sheet in `img/characters` (e.g. `People1:2`). Blank = a random actor |
| Name on the card | blank | blank = the actor's name, or the file name |
| Ground | `auto` | `plaza`, `meadow`, `quay` or `auto` |
| Walkers | 56 | 6 to 80 |
| Recoloured lookalikes | 4 | 0 to 8 |
| Extra cast | blank | more sheets to walk besides your actors, e.g. `People1:0, People1:3, Actor2:5` |
| Time limit (seconds) | 0 | 0 = no limit |
| Seed | blank | blank = a new crowd every time |

The cast is every actor that has a character image, plus the extra cast. A Crowd scene has one hint, a
glint that follows the person to find. Script call: `CSAF.Rummage.crowd({ target: 3, walkers: 56, ground: 'plaza' })`.

---

## Playing

- **Mouse or touch:** click or tap what you find. The magnifying lens follows the mouse in I Spy.
- **Keyboard or pad:** the arrow keys move the lens (hold Shift to move faster); OK looks there.
- **Hint:** W or Page Down, or click the red seal on the parchment. One unfound thing glints.
- **Cancel:** gives up (the plaque reads "Set aside"), if the Cancel gives up parameter is on.
- **Time:** with a time limit, the clock on the parchment counts down and turns red in the last ten
  seconds. At 0:00 the scene ends, and in I Spy whatever was not found is ringed in paler ink so the
  player sees where it was.

---

## Results

The results are written as the scene closes, before your event continues:

| Parameter | Gets |
| --- | --- |
| Seconds -> variable | seconds taken (plus any miss penalty) |
| Found -> variable | how many listed things were found |
| Misses -> variable | wrong clicks |
| All found -> switch | ON when everything was found, OFF otherwise |
| Common event afterwards | reserved when the scene ends |

`CSAF.Rummage.lastResult()` returns `{ mode, place, found, total, seconds, misses, hints, success, seed }`
for the last scene played. `CSAF.Rummage.seenCount()` returns how many different icons the player has
ever found, for a collection or an achievement.

### Other parameters

| Parameter | Default | Meaning |
| --- | --- | --- |
| Magnifying lens | Show | the 2x lens in I Spy |
| Seconds added per miss | 0 | on a timed scene, each wrong click costs this many seconds (0 to 30) |
| Cancel gives up | ON | whether Cancel ends the scene |

---

## Saving

Rummage keeps one small record in the save file: `$gameSystem._csafRummage = { v: 1, count, last, seen }`
(scenes played, the last result, and the icons ever found). Saves made before Rummage was installed load
normally.

---

## Compatibility

Rummage adds one scene of its own (`Scene_Rummage`) and **changes no engine method**: it does not
replace or extend any of RPG Maker MZ's own scenes, windows or managers, so there is nothing for it to
conflict with: load it beside VisuStella MZ Core Engine or any other plugin, in any order. It draws
with the browser's canvas and a book serif
(Palatino, then Book Antiqua, then Georgia, then Times), never your UI font, and loads no image files except your own
IconSet and character sheets.

Screens of any size work. On a tall screen (portrait) the parchment moves below the scene.

## Performance

The I Spy scene is drawn once while it settles in, then never redrawn: finds, misses and the clock
repaint only the ink and the parchment. Measured in the engine with the frame gate on the heaviest
cases: the Dragon Hoard at 12 things on hard, with the lens moving every frame, at **5** draw calls a
frame; and a crowd of 80 walkers at **7** draw calls a frame. The only texture upload in play is the
parchment's clock, once a second, and the per-frame model code (walking, depth order, hit tests)
allocates nothing.

---

## Terms

See `LICENSE.txt`. Use it in free and commercial games; do not resell or redistribute the plugin itself.

This plugin was written with AI assistance (code and graphics). Core Systems Asset Factory ·
https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
