# Clemency Act and Mercy — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Clemency Act and Mercy  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-22


---

# Clemency Act and Mercy v1.0.0 for RPG Maker MZ

Part 2 of **Clemency**, the Undertale-style battle frame, by Core Systems Asset Factory (https://csaf.itch.io).
It is a layer on **Clemency Box** (part 1, version 1.0.0 or later), which draws the box it talks through. Box is not
in this download; it is sold in the MZ Plugin Library (https://csaf.itch.io/mz-plugin-library), which holds every
part of Clemency.

**ACT** turns into talking: pick an enemy, then one of its acts, and its **mood** moves. A heart and a bar stand
over every enemy and fill as the mood rises. At 100 the heart and the bar turn the spare colour, and **Spare**
(new in MERCY) lets every enemy that is ready leave the fight.

The enemy art in the store images (a kobold shaman, a stone warden, an eye tyrant) is the studio's own demo art and
is **not included**: the plugin works with your own enemies.

## Install

1. Install Clemency Box first (ClemencyBoxCore.js and ClemencyBox.js).
2. Copy the two files from `js/plugins` into your project's `js/plugins` folder.
3. Turn on all four in the Plugin Manager. Any order works; this order reads best:
   ClemencyBoxCore, ClemencyBox, ClemencyActCore, ClemencyAct. The Plugin Manager marks Clemency Box and
   ClemencyActCore as required by ClemencyAct.

Without Clemency Box, or with only one of the two Act files, the plugin writes one warning to the console (naming
what is missing) and stands aside: your battles run as they did.

If you unzip this download into your project folder, its `Readme_for_Users.md` and `LICENSE.txt` replace Clemency
Box's files of the same name. Keep each guide in its own folder.

## ACT

ACT opens the troop in the box. Pick an enemy with OK, then one of its acts. The enemy you picked keeps blinking
while its acts are open, and the line under the list names it.

| Entry | What it does |
| --- | --- |
| Check | types the enemy's ATK and DEF and a line about it; no mood change |
| an act | types the act's lines and moves that enemy's mood |
| Skills | the actor's own skills, as Box lists them (only for an actor who has skills) |

Cancel steps back one list at a time: from an act list to the troop, from the troop to the plates, and from
the Skills list back to the act list.

Acts run **in turn order**, like any action. When the actor's turn comes, the act's lines type into the box as
one page and the battle waits for **OK**, as it does for Box's own messages. If the enemy was defeated or spared
before the act ran, the box says it is gone.

An act chosen and then replaced (cancel back to that actor and pick FIGHT, a skill or an item) runs as the new
choice. An actor confused after choosing an act does what MZ makes a confused actor do (MZ clears its action).

### Who talks, and where the skills go

By default **every actor talks** with ACT, and a talking actor's skills move to the **last entry of every act
list**: to cast, choose ACT, an enemy, then Skills. That suits a game where talking is the point. For a party of
casters, put `<Clemency Magic>` in the note of a caster (actor or class): that actor's ACT stays its skill list, as
Box draws it. Or set **Who talks with ACT** to *tagged*: then only actors or classes with `<Clemency Talk>` talk.
A talking actor's ACT plate is enabled even when the actor has no skill types at all.

## Mood and Spare

Every enemy has a **mood from 0 to 100** (the *Starting mood* parameter, 0 by default, or the enemy's own
`<Clemency Mood: n>`). It is shown over the enemy as a heart and a bar, which fills smoothly when the mood moves.
With *Mood meter* set to *acted*, an enemy's meter appears once it has been acted on (or its mood set by the Mood
command); *off* hides the meters. A figure that reaches the top of the screen carries its meter over its head, on
a dark backing so it still reads.

At 100 the enemy is **ready**: its heart and bar turn the *Spare colour* (a warm yellow by default), the act that
filled it types the *Ready line* ("Slime does not want to fight anymore."), and the next turn's line in the box is
that same line.

**MERCY** gains **Spare**, above Defend and Flee. While no enemy is ready, Spare is greyed and cannot be chosen
(set *Spare when nobody is ready* to *allow* to keep it choosable: it then types "Reid offered mercy. Nobody was
ready." and the turn passes). Spare, when the actor's turn comes:

- every living enemy that is ready **leaves**: its figure washes pale and fades while dots rise out of it;
- the box types "Reid spared Slime." (several names are joined: "Slime, Bat and Imp"), then each spared enemy's
  own `<Clemency Spared: ...>` line.

With every enemy spared or defeated, the battle is won. Spared enemies give their **gold** (parameter *Spared
enemies give gold*, on) and no **EXP** unless you turn on *Spared enemies give EXP*. They drop no items.
*Spared count variable* adds 1 to a variable for every enemy spared, so a pacifist route can count.

*Spare at low HP (%)* lets an enemy at or under that share of its HP be spared whatever its mood (0, the default,
turns it off). An enemy with `<Clemency No Spare>` is never ready and has no meter.

## Enemy note tags

Copy these as written (each on its own line in the enemy's Note box):

```
<Clemency Act: Compliment | +40 | You tell {name} it looks great. | {name} blushes.>
<Clemency Check: A wobbly friend.>
<Clemency Mood: 60>
<Clemency Spared: {name} hops away happily.>
<Clemency No Spare>
```

- `<Clemency Act: ...>`: an act. Its name, the mood change, then one or more lines. Add as many as you like; they
  appear in note order. The change is written `+40`, `-10` or `40`. An act whose second field is not a number keeps
  that text as a line and changes no mood. An act with no lines types "Reid tries Shout.".
- `<Clemency Check: ...>`: the second line of Check.
- `<Clemency Mood: n>`: this enemy's starting mood (`+60` and `60` both work).
- `<Clemency Spared: ...>`: typed when it is spared.
- `<Clemency No Spare>`: it can never be spared (a boss); no meter.

The demo Stone Warden in the store images carries exactly this note:

```
<Clemency Act: Kneel | +35 | {actor} kneels before it. | Its eyes dim to embers.>
<Clemency Act: Dust off | +50 | {actor} dusts off its shoulders. | The Warden stands taller.>
<Clemency Act: Knock | -15 | {actor} knocks on its chest. | It echoes, annoyed.>
<Clemency Check: Guards a door no one recalls.>
<Clemency Mood: 30>
<Clemency Spared: The Warden returns to its post.>
```

**Tokens** in act, Check and spared lines: `{actor}` the actor acting, `{name}` the enemy, `{NAME}` the enemy in
capitals, `{act}` the act's name, `{atk}`, `{def}`, `{hp}`, `{mhp}` and `{mood}` the enemy's numbers.

### Default acts

An enemy with **no act tags** gets three acts from a pool of eight (Talk, Compliment, Joke, Wave, Apologise, Hum,
Wait, Bow): **one it likes (+50), one it tolerates (+25) and one it hates (-15)**. They are dealt from the
enemy's database id, so the same enemy always likes the same act, and finding which is the puzzle. Each act types
its own line and a reaction ("Goblin liked that.", "Goblin seems a little calmer.", "Goblin looks annoyed.").

Your own pool replaces the eight through the *Default act pool* parameter: one `Name | line` per row, at least
three rows. Your own reactions replace the built-in ones through the three *Default act reactions* parameters.
Turn *Default acts* off and an untagged enemy offers Check only.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Who talks with ACT | everyone | everyone, or only actors and classes tagged `<Clemency Talk>` |
| Skills in the act list | on | a talking actor with skills finds them as the last act entry |
| Default acts | on | three acts for an enemy with no act tags |
| Default act pool | (the eight) | your own "Name \| line" rows |
| Starting mood | 0 | every enemy's mood when the battle starts |
| Spare at low HP (%) | 0 | an enemy at or under this HP share can be spared; 0 = off |
| Mood meter | always | always, acted (after the first act), off |
| Spare colour | #ffe14d | the heart and bar of an enemy ready to be spared |
| Spared enemies give gold | on | their gold joins the battle's reward |
| Spared enemies give EXP | off | their EXP joins the battle's reward |
| Spared count variable | 0 | a variable that gains 1 per enemy spared; 0 = none |
| Check, Skills, Spare labels | Check, Skills, Spare | the entry names |
| Spare when nobody is ready | grey | grey (not choosable) or allow (choosable, the Nobody ready line types) |
| Ready line | {name} does not want to fight anymore. | typed when an act makes an enemy ready |
| Spared line | {actor} spared {names}. | typed by Spare ({names} = every enemy spared) |
| Nobody ready line | {actor} offered mercy. Nobody was ready. | typed by Spare when nobody was ready (allow) |
| Text: Check, first and second line | {NAME} - ATK {atk} DEF {def} / {name} could be talked to. | Check's two lines |
| Text: an act with no lines | {actor} tries {act}. | |
| Text: the enemy is gone | {actor} looks for {name}. It is gone. | |
| Help: Check, an act, ready, No Spare, Skills | Look at {name} closely. / {name}: mood {mood} of 100. / ... | the line under the act list |
| Default act reactions: liked, tolerated, hated | (three built-in lines each) | one per line |

Every line the plugin types or shows is a parameter, so a game in any language can replace them.
The meters use Clemency Box's *Line colour* for the heart and bar, and its pixel heart.

## Plugin commands (battle only)

- **Mood**: set or change the mood of one troop member (1 to 8) or of every enemy (0), for example from a troop
  event when the boss's second phase begins.
- **Spare now**: spare one troop member (1 to 8) whatever its mood, or every enemy that is ready (0). The box types
  the spared line, naming the party leader.

## Script

The script calls count troop members from **0 to 7**, as MZ's own `$gameTroop.members()[i]` does (the plugin
commands count from 1): `ClemencyAct.mood(i)` the mood of troop member i · `ClemencyAct.setMood(i, value)` ·
`ClemencyAct.isReady(i)` true when it can be spared · `ClemencyAct.spared()` enemies spared in this battle.

## Compatibility

Made for MZ's own battle system with Clemency Box: turn based (the default) and Time Progress, front view (the
default) and side view. ACT uses MZ's own enemy list and skill list, which Box draws in the box, so the arrow
keys, OK, cancel, the mouse and touch all work there. While picking whom to talk to, the list shows Box's HP bars
(the mood is the bar over each enemy). It changes no save data: moods live only for the battle.
With Clemency Strike (part 3), FIGHT keeps its strike meter.

## Credits

Code: Core Systems Asset Factory. Every line of this plugin was written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
