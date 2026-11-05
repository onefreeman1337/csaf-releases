# Plinth - Statues of Your Own Characters and Monsters, Live Petrify and Stone Battlers for RPG Maker MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Plinth - Statues of Your Own Characters and Monsters, Live Petrify and Stone Battlers for RPG Maker MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/plinth  
**Docs published:** 2026-11-05


---

# Plinth for RPG Maker MZ

**Statues of your own cast and monsters, struck from their own sprites. Live petrification. Stone battlers.**

Plinth reads a character's walking sprite or an enemy's battler image once and strikes it, pixel by pixel, in one of
seven materials: granite, marble, sandstone, bronze, gilt, obsidian or ice. Each material has its own surface (crystals,
veins, strata, cast metal with verdigris, gold leaf, glassy bands, cold refraction), the eyes are blanked as on a real
statue, the top edges catch the light, and weathering by age adds lichen, rain streaks and moss. The statue stands on a
drawn base in the same material with the name cut into it.

The same strike drives two more things: a character turning to stone from the feet up on the map, and a battler turning
to stone while a state holds.

Made by Core Systems Asset Factory.

---

## Install

1. Copy `PlinthCore.js` and `Plinth.js` into your project's `js/plugins/` folder.
2. Turn both on in the Plugin Manager. Any order works.

There are no images to install.

## Statues on the map

Give an event a note:

| Note | The statue |
|---|---|
| `<statue: actor 3>` | actor 3's walking sprite |
| `<statue: enemy 5>` | enemy 5's battler image (side view or front view, as your game uses) |
| `<statue: self>` | the event's own graphic (the active page's) |

Add any of these after the source, separated by commas:

| Word | Effect |
|---|---|
| `granite` `marble` `sandstone` `bronze` `gilt` `obsidian` `ice` | the material (else the Default material parameter) |
| `age 40` | weathering from 0 (fresh) to 100 (old) (else the Default age parameter) |
| `name: The Founder` | the name cut into the base (else the actor's or enemy's name) |

Example: `<statue: actor 1, bronze, age 40, name: The Founder>`

An actor statue faces the way the event faces. An event with a statue note needs no graphic of its own unless you use
`self`. A word Plinth does not understand is reported once in the console (F8) and the statue still stands.

The base is cut with the letters A to Z, the digits and `! . : -`; any other character is left blank and reported. A name
is at most 24 letters. A big battler gets a bigger base, so the plinth keeps its proportion.

## Petrify and Restore

Two plugin commands turn a character to stone and back:

| Command | Arguments |
|---|---|
| Petrify | Target (Player, Follower, This event, Event by ID), Material, Age, Frames, Wait for completion |
| Restore | Target, Frames, Wait for completion |

Stone climbs from the feet to the crown over the frames you give (90 by default, 60 = one second), with a ragged edge
and dust at the front. A character in stone does not animate; the player cannot move and an event does not move on its
own until Restore, which plays the stone falling away from the crown down.

## Stone in battle

Put `<Plinth: granite>` (any material) in a state's note. While a battler has that state it is shown in stone: enemies,
and side-view actors, whose motion freezes in the pose they were in. When the state is removed, the battler returns to
its own image. What the state DOES (cannot act, and so on) is the state's own settings, exactly as in MZ.

## Parameters

| Parameter | Default | What it does |
|---|---|---|
| Default material | granite | used when a note or command names none |
| Default age | 0 | used when a note or command sets none |
| Petrify time | 90 | frames for Petrify and Restore when the command sets none |
| Blank the eyes | on | blank the eyes when a face is found; when none is found, nothing is blanked |
| Statue bases | on | stand statue events on a drawn base |
| Carve names | on | cut the actor's or enemy's name into the base |

## Saving

A character's stone (its material, age and how far the stone has climbed) is saved with the game. The player and
followers stay stone across maps. An event stays stone while you are on its map; when the map is loaded again its events
start fresh, as every MZ event does. Nothing else is saved: statues are struck again from your images when a map loads.

## What it does not do

- It does not read comments: the statue is set in the event's note, for every page of that event.
- It does not change passability. A statue event blocks or not, exactly as its priority says.
- Front-view battles have no actor sprites, so only enemies turn to stone there.
- It does not apply hue: a stone enemy is shown without its battler hue, and gets it back on restore.

## Compatibility

Plinth replaces no engine method. It **extends** these, keeping each original and calling it whenever Plinth is not
drawing that sprite or holding that character in stone:
`Game_CharacterBase.prototype.update`, `Game_CharacterBase.prototype.updateAnimation`, `Game_Player.prototype.canMove`,
`Game_Event.prototype.updateSelfMovement`, `Spriteset_Map.prototype.createCharacters`,
`Sprite_Character.prototype.updateBitmap`, `Sprite_Character.prototype.updateFrame`,
`Sprite_Character.prototype.isEmptyCharacter`, `Sprite_Enemy.prototype.update`, `Sprite_Actor.prototype.update`,
`Sprite_Actor.prototype.updateMotionCount`.
It gives `Sprite_Enemy` and `Sprite_Actor` their own `destroy`, which frees Plinth's stone copy and then calls the
`Sprite.prototype.destroy` they inherit.
It **adds** `Game_Event.prototype.plinthStatue`, `Game_CharacterBase.prototype.plinthRecord` and
`Game_CharacterBase.prototype.plinthIsStone`.

A plugin that replaces how battlers or event sprites are drawn may conflict; load Plinth below it.

Performance: every statue is struck once when its map loads, one per frame while the map settles, from a copy Plinth
makes of your image (your own images are never modified). Petrify strikes its frames once when the command starts. While
stone climbs or stands, nothing is read and nothing is rebuilt.

## Licence, the short version

Use it in any number of commercial and non commercial RPG Maker projects, royalty free. Credit is appreciated but not
required. You may not resell or redistribute the plugin itself. Full terms in `LICENSE.txt`.

*Core Systems Asset Factory · Plinth v1.0.0*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
