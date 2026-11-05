# Barrage: Undertale Style Dodge Battles for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Barrage: Undertale Style Dodge Battles for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/barrage  
**Docs published:** 2026-11-05


---

# Barrage for RPG Maker MZ

**Version 1.0.**

**Every enemy attack becomes a dodge.** When an enemy uses a skill that damages your party, the battle pauses and a
framed arena opens. The player steers a small heart, the soul, through that enemy's attack: embers spiralling out of a
burning point, a wall of feathers with one gap in it, leaves sweeping across, rings of notes. When the attack ends,
every hit the soul took scales the damage. Touch nothing and the attack misses.

**Nothing to author.** Barrage composes every attack from the database you already have:

- **What flies** comes from the skill's element name (a Fire skill throws embers), else the enemy's own name (a Crow
  throws feathers), else the enemy's strongest stat measured against the median of your Enemies database.
- **How it flies** is one of seven patterns: rain, sweep, wall, spiral, ring, bounce and aimed. The skill's hit type
  and scope choose three of them, and enemies take those three in turn by their database id, so neighbouring enemies
  never attack alike with the same kind of skill.
- **How dense and how fast**, tier 0 to 4, comes from the attacker's Attack (M.Attack for a magical skill) and
  Agility against your database's median.
- **A boss** is any enemy with at least 3 times the median Max HP of your database. Its attacks come in 2 phases of
  different patterns, or 3 phases at 6 times the median.

**Every projectile is drawn by the plugin.** Eighteen forms and no image files: ember, shard, spark, droplet, pebble,
leaf, mote, wisp, blade, bone, feather, needle, stone, orb, coin, thorn, fang and note.

**Every attack can be dodged.** The plugin's tests prove, for every pattern at every tier, that a path exists which no
shot touches, and find such a path through every aimed attack. Shots that appear inside the arena fade in and cannot
hit until they are solid, and a spiral's burning source is on screen before its first arm.

## Installing

Copy the three files into `js/plugins` and turn them on in the Plugin Manager:

1. `BarrageCore.js`: the rules (reads an enemy and a skill, composes the attack)
2. `BarrageDraw.js`: the eighteen drawn forms
3. `Barrage.js`: the battle phase, the parameters and the notetags

That order is the recommended one, but any order works: each file looks for the others the first time a battle needs
them, not when it loads (tested with `Barrage.js` loading first).

## In battle

- **When a phase opens:** an enemy uses a skill whose damage type is HP Damage or HP Drain and whose scope is the
  party (one enemy, all enemies, or 1 to 4 random enemies, from the enemy's side), with at least one living actor
  among its targets.
- **When it does not:** your actors' skills, healing, skills with no HP damage, an enemy acting on its own side, and
  anything with a `<Barrage Off>` tag. Those resolve exactly as before.
- **One phase per action**, however many targets the action has.
- **Moving the soul:** the arrow keys or a gamepad; or hold the mouse button (or a finger) anywhere and the soul follows
  it. The soul moves at most 3 arena pixels a frame and stays inside the frame.
- **Hits:** after a hit the soul blinks for 45 frames and cannot be hit again until it stops.
- **The result** is shown in the arena when it closes, and it changes the attack's damage for every actor it targets:
  no hits is a **MISS**; each hit adds Damage per hit, up to the Damage cap. With the defaults, 1 hit does half
  damage, 2 hits normal damage, and 3 or more one and a half times.
- **The engine still rolls its own hit and evasion** for the attack afterwards, as it always does. Barrage changes how
  much an attack does, and makes a perfect dodge a miss.
- While the arena is up the battle is dimmed and the battle log is hidden; both come back when it closes.

## Plugin parameters (Barrage.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Disable switch | 0 (none) | While this switch is ON, enemy attacks resolve normally with no phase. |
| Damage per hit | 0.50 | Each hit taken adds this share of the skill's damage. |
| Damage cap | 1.50 | The most the hits can multiply the skill's damage by. |
| Seed | barrage | Changes every composed attack: where the gaps fall, where shots come from, and which of its three patterns each enemy takes. The same seed always composes the same attacks. |
| Soul shape | heart | `heart`, `diamond` or `star`. |
| Soul colour | #ff3b4e | Any CSS colour. One the browser cannot read falls back to the default, never to black. |
| Label typeface | "Trebuchet MS", Verdana, sans-serif | The attacker's name above the arena and the result. A CSS font stack. |

## Notetags

Put these in an **enemy's** note box (every attack it makes) or a **skill's** note box (that skill, from any enemy).
A skill's tag wins over an enemy's.

| Notetag | Effect |
| --- | --- |
| `<Barrage Form: ember>` | What flies: any of the eighteen forms. |
| `<Barrage Pattern: ring>` | How it flies: `rain`, `sweep`, `wall`, `spiral`, `ring`, `bounce` or `aimed`. |
| `<Barrage Tier: 3>` | How fierce: `0` (gentle) to `4`. |
| `<Barrage Boss>` | Attacks in phases, whatever its HP. |
| `<Barrage Off>` | Never opens a phase. |

An unknown form or pattern name is ignored and the composed one is used.

## Which words pick which form

The element name is read first (a skill set to Normal Attack uses the enemy's attack element), then the enemy's name,
then its strongest stat. Matching ignores case. A word of four letters or more is found anywhere in a name (a Werewolf
throws fangs, an Archmage orbs); a word of three letters or fewer must stand on its own (a Rat or a Giant Rat throws
fangs, a Pirate does not).

| Element name contains | Form |
| --- | --- |
| fire, flame, burn, heat, blaze, inferno, lava | ember |
| ice, frost, cold, snow, freez, blizzard | shard |
| thunder, lightning, electr, bolt, storm, spark, shock | spark |
| water, aqua, sea, rain, tide, wave, poison, venom, acid | droplet |
| earth, stone, rock, ground, sand, quake | pebble |
| wind, air, gale, sky, tornado | leaf |
| light, holy, sun, radian, divine, star | mote |
| dark, shadow, void, curse, evil, death, abyss | wisp |
| sound, song, music, sonic | note |

| Enemy name contains | Form |
| --- | --- |
| crow, raven, bird, harpy, hawk, owl, griffin, gryphon, eagle, phoenix | feather |
| treant, tree, plant, vine, root, dryad, mandrak, rose, cactus, thorn | thorn |
| skeleton, bone, undead, zombie, ghoul, lich, skull | bone |
| wolf, dog, hound, beast, cat, tiger, lion, bear, snake, serpent, rat, bat, fang | fang |
| slime, jelly, ooze, blob, frog, fish | droplet |
| golem, gnome, rock, stone, gargoyle, statue, dwarf | stone |
| ghost, spirit, phantom, wraith, specter, spectre, shade | wisp |
| bee, wasp, spider, scorpion, insect, hornet, mantis, needle | needle |
| mage, witch, wizard, sorcer, priest, imp, demon, cultist, sage | orb |
| dragon, drake, wyrm, wyvern, salamander | ember |
| mimic, chest, merchant, gold, coin, thief, bandit | coin |
| fairy, pixie, angel, sprite, wisp | mote |
| bard, siren, harp, song | note |
| goblin, orc, knight, soldier, samurai, warrior, guard, mercenar, blade, sword | blade |

The first row that matches wins, top to bottom.

| Strongest stat (against your median) | Form |
| --- | --- |
| Attack | blade |
| Defense | stone |
| M.Attack | orb |
| Agility | needle |
| Luck | coin |

## Which skills use which patterns

"Several targets" means a scope of all enemies or 2 to 4 random enemies, or a skill that repeats.

| Skill hit type | One target | Several targets |
| --- | --- | --- |
| Certain hit | bounce, aimed, ring | bounce, rain, wall |
| Physical attack | sweep, wall, aimed | rain, wall, sweep |
| Magical attack | spiral, ring, bounce | ring, rain, spiral |

## How it fits your game

- **Screen size:** the arena is 384 by 216 arena pixels, scaled between 1x and 2x to fit your screen above the
  battle status, and centred.
- **Save files:** Barrage writes nothing into them.
- **The patches:** every engine method Barrage uses is extended and its original is called, never replaced. The
  phase opens from `BattleManager.updateAction`, the method MZ runs for each target of an action. A battle plugin
  that carries out actions without calling that method will not open the phase. Barrage is tested with MZ's own
  battle system and not yet with VisuStella's Battle Core.
- **Cost:** on the heaviest attack the plugin can compose (a three-phase boss at tier 4: rain, a ring and a spiral of
  feathers), measured in MZ, the whole battle scene drew in **31** draw calls a frame, every shot from one texture,
  with no display object created per frame.

## The sample database

On MZ's own sample enemies, unedited: Goblin throws blades (aimed), Gnome stones (sweep), Crow feathers (wall), Treant
thorns (aimed), and Hi_monster, a boss at 4 times the median Max HP, throws orbs (sweep, then ring) with its Attack
and embers (spiral, then wall) with Fire I.

## Terms

See `LICENSE.txt`. Made by Core Systems Asset Factory, https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
