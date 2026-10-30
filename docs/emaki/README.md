# Emaki — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Emaki  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-10-30


---

# Emaki for RPG Maker MZ

Emaki paints what your playthrough actually did as a Japanese handscroll. Each act your game marks becomes a text sheet
with the act's own words brushed on it, then a picture of it in ink and mineral colour between bands of gold cloud. The
player unrolls the scroll from right to left on a lacquer table, and it grows as the game goes on.

Copyright (c) 2026 Core Systems Asset Factory. Terms of use: LICENSE.txt.

## What you get

- **Sixteen figures**, each drawn in outline with flat mineral colour and each owning one silhouette feature no other
  figure has: the lord, the retainer, the court lady, the mounted warrior, the monk, the farmer, the boatman, the archer,
  the messenger, the child, the elder, the demon, the fox, the merchant, the shrine maiden and the swordsman.
- **Ten compositions**, each a cast of three and one piece of setting (figures by id: `lady` is the court lady, `rider`
  the mounted warrior, `oni` the demon, `priestess` the shrine maiden, `ronin` the swordsman):

  | Composition | Cast | Setting |
  | --- | --- | --- |
  | audience | lord, retainer, lady | a gold folding screen |
  | vow | priestess, retainer, monk | a torii gate |
  | procession | messenger, rider, merchant | banners on poles |
  | battle | rider, archer, ronin | arrows in flight |
  | crossing | lady, boatman, messenger | reeds at the shore |
  | siege | archer, ronin, rider | a palisade and watchtower |
  | labour | farmer, child, merchant | rice paddies |
  | banquet | lord, lady, elder | lacquer trays |
  | judgement | elder, retainer, ronin | a hanging blind |
  | pilgrimage | monk, elder, fox | a pagoda |

- **Five grounds:** bare paper, pine shore, waves, temple floor (the room seen from above with its roof blown away, the
  way the old scrolls draw interiors) and mountain path.
- **Six pigment sets:** `heian` (mineral colour on warm paper), `sumi` (ink and grey wash with one vermilion), `kinji`
  (strong colour on gold leaf), `momiji` (autumn, with maple leaves in the air), `yuki` (cold colour, with snow falling) and
  `aged` (faded, browned and foxed). One set paints the whole scroll; any single act can be painted in another.
- **Brushed lettering.** 26 capitals, 10 digits and the punctuation a caption needs, written stroke by stroke with a
  broad brush that presses at the start of each stroke and lifts at its end. Accents are folded, `&` is written out, and
  a title too long for its sheet is set smaller until it fits. Every sheet is headed with the act's place on the scroll
  (`ACT 12`) and carries a vermilion seal with the same number.
- **Variety without randomness.** Each act can be mirrored, can have its last figure replaced by an alternate, and can
  be set on another ground its composition allows. Every choice is seeded on the act itself, so the same act always paints
  the same way. Figures the act's words name always win a place (see "Who is in the picture").
- **Each act is frozen when it is painted:** composition, ground, cast and mirror are written into the save. A later
  version of Emaki cannot repaint a scroll a player has already saved.

## Install

1. Copy the six files from `js/plugins/` into your project's `js/plugins/` folder.
2. In the Plugin Manager, add and enable all six: `EmakiRender`, `EmakiCorpus`, `EmakiFigure`, `EmakiScroll`,
   `EmakiScene`, `EmakiBind`. Any order works; each file finds the others when it first needs them.
3. Set the parameters on `EmakiBind`. The other five have no settings.

## How an act reaches the scroll

Every route is optional; use any mix.

1. **Plugin command "Paint an act"** (`EmakiBind`, command `paint`): type what happened, choose a composition or leave it on
   auto, and optionally a pigment set for this one act. Left blank, the words can choose one: `snow`, `snowfall`, `winter`,
   `frost` and `blizzard` paint the act in `yuki`, `autumn` and `maple` in `momiji`.
2. **Watched switches** (parameter): when a listed switch turns ON, its act is painted. A project that already has
   "Chapter 3 complete" switches gets a scroll with no new events.
3. **Watched variables** (parameter): the same, when a listed variable reaches a value.

An act is painted once, ever. Painting the same title again, or a watched switch turning on again, adds nothing.

### How the composition is chosen

On auto, Emaki reads the act's words. "Crossing the Kamo river" is painted as a crossing, "The siege of Akasaka keep" as a
siege. Words are matched whole, with their plural and ordinary English endings, so "warden" is not "war", "season" is not
"sea" and "mounted archers" is not a mountain. The composition with the most matching words wins; when two match equally,
the one whose word comes first in the title wins. An act that matches nothing (a proper name, say) gets a composition
seeded on the act itself, so the same act always paints the same way. The words each composition answers to:

| Composition | Words |
| --- | --- |
| audience | audience, court, council, meeting, summit, assembly, parley, emperor, shogun, petition, received, summoned |
| vow | vow, oath, sworn, swear, pact, pledge, promise, alliance, shrine, blessing, blessed |
| procession | procession, march, road, route, journey, travel, depart, departure, set out, escort, caravan, highway, return |
| battle | battle, war, fight, slain, rout, ambush, raid, defeat, victory, duel, clash, field, won |
| crossing | crossing, cross, river, sea, ship, boat, ferry, sail, voyage, harbour, harbor, island, shore, bridge |
| siege | siege, castle, keep, fort, fortress, gate, wall, tower, stormed, besieged, demon, oni |
| labour | planting, harvest, farm, rice, built, build, forge, forged, work, mill, craft, mine, labour, labor, village |
| banquet | banquet, feast, festival, wedding, celebration, moon viewing, cherry, blossom, tea, crowned, coronation |
| judgement | judgement, judgment, trial, verdict, sentence, law, accused, exile, pardon, crime, bandit, punished, confession |
| pilgrimage | pilgrimage, pilgrim, temple, mountain, mount, monk, monastery, retreat, sacred, spirit, fox, prayer |

To force one, choose it in the command, or put its id in a watched row's Composition field.

### Who is in the picture

Each composition has its own cast of three. If the act's words name someone, up to two of them are put in the picture, so
"The demon of Oeyama was slain" has the demon in it and "The monk and the fox" has both. They take the last places in the
cast, working inward. A boatman keeps his place in a crossing, because the boat is part of him, and a mounted warrior is
never put in a room. The demon appears only when the words name him.

| Figure | Words |
| --- | --- |
| oni | demon, oni, ogre |
| fox | fox, kitsune |
| monk | monk, priest, abbot |
| priestess | priestess, maiden, miko |
| lady | lady, ladies, princess, queen, empress |
| lord | lord, shogun, emperor, daimyo, king, prince |
| elder | elder, sage, old man |
| child | child, children, boy, girl |
| farmer | farmer, peasant |
| merchant | merchant, trader, peddler |
| messenger | messenger, herald, courier |
| archer | archer, bowman |
| ronin | ronin, swordsman, samurai |
| retainer | retainer, vassal, servant |
| rider | rider, horseman, cavalry |

### What the words cannot do

Emaki reads an act's words for a composition, a cast and a season, not for a sentence. "The storm at sea" is painted as a
crossing on ordinary water, and "The bridge at Uji" has no bridge. Choose the title and the composition together when an
act has to show one particular thing.

## Show the scroll

Plugin command **"Unroll the scroll"** (`EmakiBind`, command `open`) opens it from any map event or common event. Closing it
returns the player to where they were.

The scroll lies on a black lacquer table between its two rolls. When it opens, the left roll travels across the table and
the paper comes out from under it. The rolls grow and shrink as the paper moves between them.

## Controls

| Input | Does |
| --- | --- |
| Left (held) | unrolls further, toward later acts |
| Right (held) | rolls back toward the beginning |
| Page Down / Page Up | one act forward / back |
| Mouse wheel | a quarter act per notch |
| Drag | pulls the paper |
| Cancel, Menu or right-click | closes the scroll |

## Parameters (EmakiBind)

| Parameter | Default | What it does |
| --- | --- | --- |
| Watched switches (`watchSwitches`) | none | rows of switch, what happened, composition |
| Watched variables (`watchVariables`) | none | rows of variable, the value it must reach, what happened, composition |
| Pigment set (`palette`) | `heian` | the colours the whole scroll is painted in |
| Most acts kept (`maxActs`) | 40 | from 4 to 200; older acts roll off the beginning beyond this |
| Opens at (`openAt`) | `start` | `start` (the first act) or `latest` (the newest act) |

A blank composition in a watched row means "choose from the words". A switch or variable id of 0 is ignored.

## Save data

The scroll is stored on `$gameSystem` as `_emaki`, versioned: `{ v: 1, count, acts, seen }`. `seen` remembers every act
ever painted, including ones that rolled off past the cap, so they are never painted twice. A save written by a newer
Emaki is left untouched rather than reset.

## Performance

Each act is painted into its own picture a slice per frame, before it comes into view, so unrolling does not stall when a
new act arrives. A player who jumps past the painter gets that one act finished at once. Acts are kept while they are near;
at most 8 are held at once and the furthest is let go. Moving the paper only moves sprites: no objects are made per frame
and no pixels are read back.

## Compatibility

- RPG Maker MZ (tested against the 1.x core scripts).
- Emaki adds one scene (`Scene_Emaki`, built on `Scene_Base`) and two plugin commands. It extends exactly two engine
  methods, `Game_Switches.prototype.onChange` and `Game_Variables.prototype.onChange`, and calls the original in both.
  It replaces no engine method.
- The scroll scene creates no windows and no touch buttons, so window-skin and menu plugins do not reach it.
- No image, font or audio files are loaded, so there is nothing to add to your project's folders and nothing for a
  deployment's "exclude unused files" option to drop.

## Credits

Code and drawing: Core Systems Asset Factory. Written with AI assistance; see LICENSE.txt for the full disclosure.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
