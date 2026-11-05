# Township - NPC Daily Routines & Living Towns, for RPG Maker MV & MZ — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Township - NPC Daily Routines & Living Towns, for RPG Maker MV & MZ  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/township  
**Docs published:** 2026-11-05


---

# Township — NPC Daily Routines & Living Towns

**Version 1.1.1. For RPG Maker MZ and MV.** Give every NPC a real day: homes, jobs, overnight shifts, market days and
festivals — with idle poses at their destination, door transitions instead of pop-in, and a routine
board that shows you every townsperson's whole day and lets you drive the world from it.

---

## Why the overnight case works, and why that matters

Most routine plugins store a schedule as **spans**: *"work from 08:00 to 17:00"*. That
representation breaks the moment a shift crosses midnight, because `now >= start && now < end` is
false for **every** minute when start is 22:00 and end is 07:00. No entry is active, the NPC has no
destination, and it disappears.

**Township stores no end times at all.** A schedule is a ring of transition points, and the active
entry is simply the last one at or before now, wrapping around midnight. An overnight shift is not
a special case — it is the ordinary case, and the broken state cannot be represented.

That is not only about night watchmen. **Everyone who sleeps through midnight has a wrapping span**:
in the demo town, 8 of 8 townspeople do.

Because position depends only on the time and never on accumulated state, three more things follow
for free:

* NPCs are correct **instantly** after a map transfer — no walking to catch up, no frozen events.
* Talking to an NPC **cannot corrupt its movement**, because nothing is stored to restore.
* The routine board can **scrub to any time** and show you the truth.

---

## Installation

1. Copy the contents of `js/plugins/` into your project's `js/plugins/` folder.
2. In the Plugin Manager, add them **in this order**:
   1. `Township` — the engine (required)
   2. `TownshipBoard` — the routine board scene (optional but recommended)
   3. `TownshipDemo_Millbrook` — the worked example town (delete once you have your own)
3. Press Play. Use the **Open routine board** plugin command to see the demo town's whole week.

**In RPG Maker MV 1.6:** also copy `CSAF_MVBridge.js` and put it **at the top of the list**, above
`Township`. It supplies the few parts of MZ's scripting these files use and MV lacks, changes no
window of yours or of any other plugin, and does nothing at all in MZ (you can leave it out there).

---

## Building your own town in four steps

### 1. Mark your places

Drop an event where you want an NPC to stand and put this in its **note** box:

```
<township_place:oven>
```

The event needs no pages and no graphic — it is a marker. Township reads its position when the map
loads, so you can lay a town out visually in the editor instead of typing coordinates.

> Places must also be **declared** in your town file (below) with at least an id and a map. The
> marker sets *where*; the declaration is what schedules refer to, and it is what lets Township tell
> you at load time that a schedule points at a place that does not exist.

### 2. Mark your doors

```
<township_door:tavern_front>
```

Doors are where NPCs fade in and out when they arrive on or leave a map. Without them an NPC that
belongs somewhere else simply is not drawn; with them, they walk to the door and fade.

### 3. Tag your townspeople

Give the event that represents a townsperson:

```
<township:baker>
```

### 4. Write the town

Copy `TownshipDemo_Millbrook.js`, rename it, and edit the data. A schedule entry is just a time and
a place:

```js
{ at: 22 * 60, place: 'gate', tag: 'work' }
```

`at` is **minutes since midnight**. There is no end time — the entry runs until the next one, and
wraps around midnight automatically.

---

## Schedule variants

An actor can have several schedules. The one with **no conditions** is the base and is always the
fallback, so resolution can never fail. Others activate on:

| Condition | Meaning |
| --- | --- |
| `dayType: 'market'` | Set with the **Set day type** plugin command |
| `days: [0, 3]` | Weekdays, counted by the *Days in a week* parameter |
| `when: { switch: 12 }` | A game switch |
| `when: { variable: 4, op: '>=', value: 10 }` | A game variable, with `> >= < <= == !=` |
| `priority: 5` | Highest matching priority wins |

Conditions are **data, not code** — a town file can never execute anything.

---

## Poses

A pose is what an NPC does once they **arrive**. It is the difference between a town that is alive
and one where people stand on marked tiles:

```js
pose: { dir: 8, stepAnim: true }
pose: { sprite: { name: 'People2', index: 3 }, dir: 2 }
pose: { balloon: 1 }
```

---

## The routine board

Open it with the **Open routine board** command.

| Key | Does |
| --- | --- |
| ← → | Scrub time by ten minutes (hold **Shift** for an hour) |
| ↑ ↓ | Choose a townsperson |
| **OK** | **Set the world clock** to the time you scrubbed to |
| **Shift + OK** | Put the player next to the selected townsperson |
| Page Up / Down | Cycle the day type |
| Cancel | Close |

It is a director's console, not a report: everything you can see, you can act on. An overnight span
is drawn as one continuous band that runs off the right edge and continues at the left, with a
chevron at both ends.

---

## Plugin commands

`Open routine board` · `Set time` · `Advance minutes` · `Set day type` · `Force an NPC somewhere` ·
`Release an NPC` · `Where is this NPC?` (writes a place id to a variable) · `Is this NPC here?`
(sets a switch) · `Force a schedule variant`

`Is this NPC here?` is the one most quests need — *"is the baker at the mill right now"* as a
single switch.

**In RPG Maker MV** each command is a Plugin Command line:

```
Township OpenBoard
Township SetTime hour=20 minute=30
Township AdvanceMinutes minutes=60
Township SetDayType dayType=market
Township ForceActivity actorId=baker placeId=tavern untilHour=22
Township ReleaseActor actorId=baker
Township ActorPlaceToVar actorId=baker variableId=5
Township ActorAtPlace actorId=baker placeId=mill switchId=12
Township SetScheduleVariant actorId=smith scheduleId=injured
```

A misspelt command name is reported in the console.

---

## Using your existing day/night plugin

If you already own a time plugin, set **Clock source** to `variables` and point Township at the
variables it writes for hour, minute and day. Township will follow your clock instead of running
its own. There is also a `script` mode for anything unusual.

---

## Compatibility — stated up front

* **Grid movement**, the same as RPG Maker's own events. Township is **not** compatible with
  pixel-movement or action-battle plugins that replace event movement wholesale.
* Runs in RPG Maker **MZ**, and in **MV 1.6** with `CSAF_MVBridge.js` at the top of the Plugin Manager;
  the routine board, every command and the demo town were run on both engines from the shipped download.
  (1.1 also makes a pose's `balloon` show in MV, which keeps balloons on the character, not in a queue.)
* Every core method is patched by **prototype extension with the original saved and called**, so
  other plugins that patch the same methods keep working.
* Township adds nothing to your save but a small block of plain data: the clock, the day type and
  any overrides. Positions and paths are **derived**, never stored, so saves stay small and can
  never load into an inconsistent state.

## Troubleshooting

**An NPC is not moving.** Check the console. Township warns once, by name, when it cannot path
someone to their destination — it deliberately leaves them standing where they are rather than
teleporting them, because a character jumping across the map looks like a much stranger bug.

**An NPC will not appear.** Its event needs `<township:id>` in the **note** box (not a comment), and
that id must exist in your town file. Township warns once, naming the event and the id.

**Everyone is in the wrong place.** Open the routine board and scrub — if the strips are wrong, the
schedule is wrong; if the strips are right and the town is not, check that your places' markers are
on the map you think they are.

---

## Terms

Use in unlimited commercial and non-commercial RPG Maker MZ and MV projects. Credit is appreciated but
not required. Do not redistribute or resell the plugin itself. Full terms in `LICENSE.txt`.

Made by **CSAF — Core Systems Asset Factory**. Copyright (c) 2026 Core Systems Asset Factory.
More RPG Maker tools: <https://csaf.itch.io>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
