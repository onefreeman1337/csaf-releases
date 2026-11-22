# Byplay Company — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Byplay Company  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-22


---

# Byplay Company v1.0.0 for RPG Maker MZ

Part 3 of **Byplay** by Core Systems Asset Factory (https://csaf.itch.io).

In a stock MZ cutscene a crowd stands still while the speaker talks, and the only sign that anyone heard is a
balloon icon. Byplay Company makes **a whole room answer together**: the nearest people react first, the
reaction travels outward, no two neighbours start on the same frame, and each person does their own part of the
answer (twelve people agreeing are exactly nine nods and three claps, never twelve nods by chance). Before they
react they **turn to face whoever spoke**, with MZ's own facing rule. Listeners can be tagged to turn to whoever
is talking and stand still until the scene ends.

Every drawing is that character's own walking sprite re-posed by **Byplay Reactions**, whose two plugin files ship
inside this download, byte for byte: a Byplay Company install can also play single reactions.

## The cues

| Cue | What the room does |
| --- | --- |
| `agree` | nods, and one in four claps |
| `disagree` | head shakes, with a facepalm and a shrug among them |
| `applaud` | claps, and one in five laughs |
| `gasp` | cowers with the arms over the head, and one in four points |
| `laugh` | laughs, with a clap and a point among them |
| `mourn` | sobs and prayers, and one in five bows |
| `murmur` | thinking and head scratching, with a shrug (nobody turns: a murmur is people talking among themselves) |
| `salute` | salutes, and one in four bows |
| `welcome` | bows and beckoning, with a clap |
| `turn` | everyone turns to look at the source; nobody reacts |

Any one Byplay reaction works as a cue too: `bow` makes everyone bow, `clap` everyone clap (nod, shake, shrug,
facepalm, think, point, beckon, clap, pray, bow, sob, scratch, cower; `laugh` and `salute` are the cues above).
Cue names are read in any case, and other words work: `yes`, `approve` (agree), `no`, `boo` (disagree), `cheer`,
`ovation` (applaud), `shock`, `startle` (gasp), `grief` (mourn), `whisper`, `mutter` (murmur), `greet`, `hello`
(welcome), `listen`, `look` (turn).

**How a room is planned.** The share of each reaction is exact: the room is dealt the cue's mix like a deck of
cards, and the order is arranged so two people next to each other in the ripple get different reactions
wherever the counts allow. The nearest member moves first, on the first frame. Each tile of distance from the
source adds a few frames, and every member after the first adds a small hesitation of its own (seeded, so the same
scene plays the same way each time the game runs it in the same order). No two members standing within one tile of
each other (diagonals included) start on the same frame. A member turns to the source, then reacts 6 frames later.

## Install

1. Copy the eight files from `js/plugins` into your project's `js/plugins` folder.
2. Turn on all eight in the Plugin Manager. Any order works; this order reads best:
   PostureCore, KnackCore, StrideCore, StrideIdleCore, ByplayReactionsCore, ByplayReactions, ByplayCompanyCore,
   ByplayCompany.

If you already own Byplay Reactions, Byplay Moods, Stride, Posture, Knack or Rally, keep ONE copy of each shared
file: ByplayReactions.js, ByplayReactionsCore.js, PostureCore.js, KnackCore.js, StrideCore.js and
StrideIdleCore.js in this download are the same files, byte for byte.

## In a message

Put the code where the room should answer:

```
\BYC[gasp]The king is dead.
Long live the queen!\BYC[applaud]
```

The room around the event running the message reacts as the text reaches the code. A second number names the
source instead (the same numbers as the commands), a third a group:

```
\BYC[agree,-1]        the room around the player agrees
\BYC[turn,5]          everyone turns to event 5 (the next speaker)
\BYC[disagree,0,jury] only the events tagged <Company: jury>
\BYC[back]            everyone the room turned turns back
```

The code prints nothing. In other windows (choices, help text) it is removed and does nothing.

## Who is in the room

Map events within **Room size** tiles (6 by default) of the source, standing on the map with a walking sheet:
not a tile, not an object sheet (a file name starting with `!`), not erased or transparent. The source is never
its own room. The party joins only with the **Party joins in** setting. Tags go in a comment on the event page or
in the event's Note (the page comment wins):

```
<Company: off>           never joins a room
<Company: jury>          a member of the group "jury" (any words, separated by commas)
<Company: listen>        a listener (see below)
<Company: jury, listen>  both
```

## Listeners

With **Listeners face the speaker** on (the default), events tagged `listen` turn to the event whose message is
showing as soon as its message starts, nearest first, and hold still while it talks (an event that walks at random
stops walking). `\BYC[turn,N]` in a line, or **Room Turns To**, swings them to a new speaker. When the event ends
they turn back to the way they faced before, if they have not moved (**Turn back afterwards**).

Members also hold still while they wait for their turn or react. After a cue played outside an event (a parallel
process or a script call), each member turns back half a second after its reaction ends; a bare `turn` outside an
event stays until **Room Turns Back**.

## Plugin commands

| Command | What it does |
| --- | --- |
| Room Reacts | everyone near a character plays a cue; Wait for it pauses the event until the last member has finished |
| Room Turns To | everyone near a character turns to face it, nearest first |
| Room Turns Back | everyone the room turned faces the way it faced before (if it has not moved) |
| Prepare Room | draws the reactions of everyone near a character now, before a big scene |

Each takes the character (`-1` player, `-2`/`-3`/`-4` followers 1 to 3, `0` this event, `1+` an event id), a room
size (`0` = the plugin setting) and a group (blank = everyone).

## Parameters (ByplayCompany.js)

| Parameter | Default | Meaning |
| --- | --- | --- |
| Room size (tiles) | 6 | characters this near the source are the room |
| Ripple speed (%) | 100 | how fast a reaction travels through the room (each reaction's own speed is Byplay Reactions' Speed) |
| Party joins in | No | the player and visible followers react with the room |
| Listeners face the speaker | Yes | listeners turn to whoever's message is showing |
| Turn back afterwards | Yes | the room faces its old way when the event ends |
| Message code letters | BYC | `\BYC[...]` |

## Script calls

```
CSAF.ByplayCompany.room(target, 'gasp')                              // frames until the last member is done
CSAF.ByplayCompany.room(target, 'agree', { radius: 4, group: 'jury' })
CSAF.ByplayCompany.turn(target)       CSAF.ByplayCompany.back()
CSAF.ByplayCompany.members(target)    CSAF.ByplayCompany.isActing()
CSAF.ByplayCompany.prepare(target)    CSAF.ByplayCompany.cues()
```

`target` is `$gamePlayer`, a character, or the number the commands use. `room` returns 0 when nobody is in the
room or the word is not a cue (the console says which word).

## What to expect

- **The drawings are Byplay Reactions' drawings.** A member whose walk shows no arm in a facing plays the head part
  of its reaction in that facing; Byplay Reactions' own Readme section lists how often that happens on MZ's own
  characters.
- **Direction Fix.** An event with Direction Fix does not turn (MZ's own rule) but still reacts.
- **A walking member** finishes its step, then turns; one still walking a second later is left out of that cue.
- **Nothing is saved.** A room's reaction is a moment: no key of it is written to the save file, and a save made
  in the middle of one loads cleanly.

## Compatibility

Byplay Company extends these engine methods and calls the original of each: `Game_CharacterBase.prototype.update`;
`Game_Event.prototype.setupPageSettings` and `clearPageSettings` (for the tag) and `updateSelfMovement` (the hold);
`Scene_Map.prototype.update` and `start`; `Window_Message.prototype.startMessage` (for listeners);
`Window_Base.prototype.processEscapeCharacter` (for the `\BYC` code only; every other code goes to the original).
It adds `csafCompanyUpdate` to `Game_CharacterBase`. It draws nothing of its own and swaps no sprite: every
picture comes through Byplay Reactions.

**With Byplay Moods:** a room reaction plays over a character's mood, and the mood comes back when the reaction
ends (Byplay Moods' own rule). **With Stride Idle:** a reacting member stops idling (Byplay Reactions' own rule).
Message plugins that keep MZ's own escape-code handling (MZ's message window does) pass the code through;
VisuStella Message Core was not tested in the engine.

Measured performance: a hall of twelve on a map, the room cued every 100 frames through nine cues (members turning,
reacting and turning back the whole time): **9** draw calls a frame, **0** texture uploads, display objects steady.
A member's per-frame work counts down a number and allocates nothing; a cue plans the room once, when it is given.

Tested on MZ 1.10.0 (the stock runtime) with the stock database.

## Credits

Core Systems Asset Factory. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
