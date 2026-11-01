# Stricken — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Stricken  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-01


---

# Stricken for RPG Maker MZ

States shown on the map. When a party member walks off a battle still poisoned, burning, frozen or asleep, their own walking sprite shows it: the leader, every follower, and any event you tie to an actor. Each look is struck from the sprite's own silhouette, frame by frame, in hard pixels at the sheet's own size. You draw nothing.

Version 1.0.0 · Core Systems Asset Factory · https://csaf.itch.io

## Install

1. Copy `StrickenCore.js` and `Stricken.js` into your project's `js/plugins` folder.
2. In the Plugin Manager, add **StrickenCore** first, then **Stricken** below it, and turn both ON.
3. Playtest, give the leader a state on the map (an item, an event's Change State command, or a battle with a state whose "Remove at Battle End" is off) and look at the sprite.

Both files load in either order; the recommended order is the one above.

## Which states show

Every state can show a look. A state's **Note** box decides it:

| Note tag | What it does |
| --- | --- |
| `<stricken: frost>` | this state shows the frost look (any look id from the table below) |
| `<stricken: none>` | this state shows nothing on the map |

With **Looks by state name** ON (the default), a state with no tag takes a look from its name. In a new project these stock states do:

| Stock state | Look |
| --- | --- |
| Dead | fainted |
| Poison | poison |
| Blind | blind |
| Silence | silence |
| Rage | rage |
| Confusion | confusion |
| Charm | charm |
| Sleep | sleep |
| Paralysis | shock |
| Stun | stun |
| HP Regeneration | regen |
| MP Regeneration | regen |
| TP Regeneration | regen |
| Magic Reflection | reflect |
| Protect | protect |
| Hide | vanish |

Names you write yourself are read the same way: Burning, Frostbite, Frozen, Petrified, Cursed, Doom, Bleeding, Haste, Slow, Float, Blessed, Berserk and many more each find their look. A name that matches nothing shows nothing, and a tag naming a look that does not exist shows nothing and prints one warning in the console.

A member with several states shows the state with the highest **Priority** (the Database field). Set **Cycle between states** to take turns instead.

⚠️ Most stock states have **Remove at Battle End** ticked, so they are gone before the map returns. Untick it on a state you want to follow the party out of a fight, or add the state on the map: the look appears the moment the state does.

## The 43 looks

| Look | Kind | What the player sees |
| --- | --- | --- |
| poison | ailment | a pulsing green cast, bubbles rising off the head and shoulders |
| venom | ailment | a purple cast and rim, drops falling from the hem, bubbles |
| burn | ailment | flames licking up from the top of the silhouette, a scorched hem, embers |
| frost | ailment | an ice-blue cast, rime along every top edge, icicles under the arms, snowflakes |
| frozen | ailment | a pale ice shell over the outline with a glint sweeping across, cold mist at the feet |
| soaked | ailment | a dark wet cast, drops falling from the hem, a rippling puddle |
| shock | ailment | a crackling yellow outline, sparks crawling it, a white flash |
| sleep | ailment | a cool night-blue cast and Zs rising, growing as they go |
| stun | ailment | stars circling over the head, a wobble |
| confusion | ailment | swirls circling the head, a bobbing question mark, a sway |
| charm | ailment | a pink outline and hearts rising |
| curse | ailment | a violet cast and a dark outline, wisps rising off the shoulders, runes circling the head |
| doom | ailment | a darkened figure, a dark red outline and glow, a skull over the head |
| blind | ailment | a dark band across the eyes, smoke circling the head |
| silence | ailment | a grey cast and a struck-through speech bubble |
| petrify | ailment | dark grey stone with cracks, grit falling from the hem |
| bleed | ailment | a red pulse at the outline, drops falling |
| rage | ailment | a red cast, a flickering red glow, an anger mark on the head, steam rising, a shiver |
| fear | ailment | a cold grey-blue cast, a shiver, sweat drops flung off |
| sick | ailment | a sallow green cast, flies circling, a nausea swirl over the head |
| plague | ailment | a grey cast with violet blotches, puffs rising |
| undead | ailment | a grey-green cast, a dark outline, a green glow, green wisps |
| slow | ailment | a dull cast and an hourglass over the head |
| stop | ailment | sepia, a clock over the head, a ring at the feet |
| weaken | ailment | a drained, dimmed figure, red arrows sinking at the sides |
| expose | ailment | a drained, dimmed figure, cracks, blue arrows sinking at the sides |
| oil | ailment | a black slick with a gloss sliding across, drops falling from the hem |
| entangle | ailment | brown vines wound round the legs, leaves |
| regen | boon | green plus signs rising, a green ring at the feet |
| haste | boon | yellow afterimages and speed lines |
| protect | boon | a gold outline and a turning gold hexagon at the feet |
| shell | boon | a blue bubble round the whole figure with a moving highlight |
| reflect | boon | a silver outline, a bright band sweeping across, glints |
| blessing | boon | a halo, a warm cast and a soft glow, sparkles |
| float | boon | lifted off the ground, bobbing, a shadow below |
| vanish | boon | see-through and blue-tinted, a light outline, a scan line passing down |
| power | boon | a red outline and glow, red arrows rising at the sides |
| guardup | boon | a blue outline and glow, blue arrows rising at the sides |
| focus | boon | a violet glow and sparks drawn in toward the body |
| fortune | boon | gold coins rising, sparkles |
| inspired | boon | music notes rising |
| guardian | boon | a soft white glow, small white wings, feathers falling |
| fainted | knocked out | a pale see-through grey figure, a small ghost rising |

Each look has twelve animation steps on its own clock, and the walk still animates underneath it.

## Events tied to an actor

An event can show an actor's states (a party member standing in a scene, a double, a cutscene stand-in):

| Where | Write |
| --- | --- |
| the event's Note | `<stricken actor: 3>` |
| a Comment on an event page | `<stricken actor: 3>` (used while that page is active) |

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Looks by state name | ON | a state with no tag takes a look from its name; OFF = tagged states only |
| Effect speed | 6 | frames per animation step of every look (12 steps a loop) |
| Cycle between states | 0 | 0 = show the highest priority state only; any other number = frames each look shows before the next |
| Hold the step | OFF | frozen, stone, stopped, entangled and fainted members hold their middle frame instead of stepping |
| Slow steps when asleep | ON | asleep and slowed members step at half their animation speed (their move speed is not changed) |
| Burst on change | ON | a one-shot ring in the look's colour when a state lands or wears off on the map |

## Plugin commands

| Command | What it does |
| --- | --- |
| Preview a look | shows a look on the player, this event, an event by id or a follower, whatever its states (a cutscene, a cursed statue, a test); saved with the game |
| Clear a preview | ends a preview; the character shows its states again |

## Script calls

| Call | What it does |
| --- | --- |
| `Stricken.preview($gamePlayer, 'frozen')` | preview a look on a character (or an event id: `Stricken.preview(5, 'curse')`) |
| `Stricken.clear(5)` | end a preview |
| `Stricken.lookOf($gamePlayer)` | the look a character is showing now, or `''` |

## Good to know

- Sheets are read the way MZ reads them: 3 frames by 4 directions, `$` single-character sheets and 8-character sheets both, at any cell size. Tile-image events are left alone.
- Each look is drawn once per sheet, in memory, the first time it is needed, then reused. Your image files are never changed.
- The look draws in a frame wider and taller than the sheet's own cell, so a flame, a halo or a ring at the feet has room. The feet stay exactly where they were (in a bush too), and balloons still sit on the head.
- A party in a vehicle shows no look.
- In battle nothing changes: Stricken is the map side only.
- Saved games: a preview is saved with the character. States are saved by MZ itself, so a loaded game shows the same looks.

## Compatibility

Stricken extends MZ's own `Sprite_Character` (its members, the bitmap, the frame and the update), the balloon position, the walk animation wait, an event's page setup (to read the actor tag), and three state methods on `Game_BattlerBase` (adding, erasing and clearing states). Every original method is kept and called. It replaces nothing.

Plugins that also swap a character's bitmap or frame grid (8-frame walk sheets, some character-layer plugins) are not tested with it: put Stricken below them and check a character with a look in a playtest.

## Terms

See `LICENSE.txt`. Commercial and non-commercial use in RPG Maker projects. Written with AI assistance.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
