# Encore — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Encore  
**Engine:** RPG Maker MZ  
**Docs published:** 2026-11-02


---

# Encore for RPG Maker MZ

Boss second phases, drawn from the boss you already have. Mark an enemy with a note tag and, when its HP falls to a threshold, the fight pauses: the boss holds and shakes, changes in a drawn transformation, and fights on as a new form of itself. The new form is generated from the enemy's own battler image when the change begins. There is no second battler to draw and no image file to add.

Two files: `Encore.js` (the one you configure) and `EncoreCore.js` (the picture rules).

## Install

1. Copy `Encore.js` and `EncoreCore.js` into your project's `js/plugins` folder.
2. Open the Plugin Manager and add both, switched ON. Any order works; the recommended order is EncoreCore, then Encore.

## Give a boss a second phase

Put a tag in the enemy's **Note** box in the Database:

| Note tag | What happens |
| --- | --- |
| `<Encore>` | a form chosen from the enemy's own name and elements, at the default threshold (50%) and transformation |
| `<Encore: frozen>` | the Frozen form, at the defaults |
| `<Encore: enraged 40% burn>` | Enraged when HP falls to 40%, the old form burning away from the feet up |
| `<Encore: crystal 50% shatter becomes 12>` | at 50%, shatters into Crystal and becomes enemy 12 (its name, stats and actions) |
| `<Encore: husk 30% molt carry keep>` | at 30%, molts into Husk, keeps its share of HP and keeps its states |
| `<Encore: off>` | never, even if another Encore tag is in the note |

The words can come in any order. A word Encore does not know is named in the console (F8) and the rest of the tag still works. "armored" (US spelling) works too.

**More than one phase:** put two or more tags in the note. They play highest threshold first.

```
<Encore: armoured 60% swell>
<Encore: enraged 25% burn>
```

## The twelve forms

Every form keeps the creature recognisable: it is re-toned from the battler's own light and shade, drawn larger about its own feet so it stands where it stood, and things grow from its own outline.

| Form | What it becomes |
| --- | --- |
| `ascended` | gilded, with feathered wings, a halo and rays of light behind it |
| `corrupted` | its light inverted to violet, glowing veins, tendrils curling from its sides |
| `enraged` | charred dark, split with molten cracks, flames rising from every upward edge |
| `frozen` | a frost coat, ice shards along its outline, icicles hanging under it |
| `armoured` | riveted steel plates over its outer parts, spikes along its top |
| `crystal` | cut into facets of its own colour, crystal clusters breaking out of its top |
| `overgrown` | antlers of living wood, vines with leaves and flowers, moss on top |
| `rot` | its edges eaten away, sores, ooze dripping from underneath |
| `overdrive` | chromed panels with glowing seams, a reactor in its chest, antennae |
| `shadow` | a darkness in its shape, smoke rising off it, its highlights burning red |
| `celestial` | filled with a night sky and stars, rings in orbit around it |
| `husk` | its outer skin turned to stone and bursting apart on the light inside |

Each form has an aura behind it that breathes, and every form but Armoured has motes around it (embers, snow, petals, spores, sparks, stars or drifting light). Both can be turned off.

A boss looks the same every time it changes: the drawing is seeded by the enemy's id. Two different bosses in the same form are drawn differently.

## The four transformations

| Transformation | How the old form becomes the new one |
| --- | --- |
| `swell` | the boss swells, white-hot, then the new form arrives in a flash and settles |
| `shatter` | the old form breaks into pieces cut from its own picture that fly apart; the new form fades in |
| `burn` | the old form burns away from the feet up in the new form's colour, uncovering the new form beneath |
| `molt` | the old form crouches and splits down the middle; the halves peel away and the new form rises |

Before every transformation the boss holds for about half a second, flashing and shaking.

## How a phase plays

- The threshold is a share of max HP. When the boss's HP reaches it, phase two is earned.
- **Overkill guard** (on by default): the blow that crosses the threshold cannot kill. The boss holds at 1 HP and changes first. The damage number still shows the full blow.
- The change plays **between actions**, never in the middle of one: every hit of the current action lands first, then the battle waits while the change plays. In a turn-based battle it never plays over the party's command windows.
- When it lands, without `becomes`, the boss stays the same enemy and every parameter rises by **Stat rise (%)**. With `becomes N`, it turns into enemy N through MZ's own transform (its name, stats and actions) and is drawn as the new form.
- HP: `full` (default) starts the new form at full HP; `carry` keeps the share of HP it had.
- States: `clear` (default) removes states and buffs with the old form; `keep` carries them over.
- One blow can cross two thresholds. With `carry`, the next phase then plays right after the first; with `full`, the refill lifts the boss back above the next threshold and it waits for its own turn.
- With no phase left, the boss dies normally.

## Parameters

| Parameter | Default | What it does |
| --- | --- | --- |
| Default threshold (%) | 50 | the share of max HP at which a phase plays, when a tag names none |
| Default transformation | swell | swell, shatter, burn or molt, when a tag names none |
| Default HP after the change | full | full or carry |
| Default states after the change | clear | clear or keep |
| Stat rise (%) | 120 | for a boss that stays the same enemy: each parameter of the new form, as a percent of the old |
| Overkill guard | true | the blow that crosses the threshold cannot kill |
| Battle log line | (blank) | a line shown when the change lands, `%1` = the boss's name. Blank shows nothing |
| Sound: the hold | Darkness5 | played when the boss freezes before it changes (blank = silent) |
| Sound: the change | Powerup | played when the new form appears (blank = silent) |
| Aura behind the new form | true | the breathing glow behind each form |
| Motes around the new form | true | the moving embers, snow, petals, spores, sparks or stars |
| Shake (px) | 5 | how far the boss shakes in the hold (0 = still) |

## Plugin command

| Command | What it does |
| --- | --- |
| Change now | a troop member (1 = first) plays its next phase as soon as the current action ends, whatever its HP |

Use it from a troop event, for example "when the boss's turn 3 begins, change now".

## Art it works on

Front-view enemy battlers (`img/enemies`) and side-view enemy battlers (`img/sv_enemies`): painted art and pixel art. Pixel art already drawn at 2x or larger is forged at its own pixel size and enlarged pixel for pixel, so every vine, crack and shard the form adds sits on the art's own pixel grid. Art at 1x is enlarged smoothly, like painted art. The painted ground shadow many battlers carry under their feet stays a shadow: it is not re-toned and casts no aura.

## Compatibility

- Encore extends the engine's own methods and saves every original it extends (enemy setup, HP, parameters, the enemy sprite, the battle scene's start, `BattleManager.update`). It replaces none of them.
- **Scathe** (ours): its damage marks start again, clean, on the new form.
- An animated-battler plugin that replaces the enemy's image every frame will cover the new form. Not yet tested with VisuStella's Battle Core.
- Works with the stock turn-based and time-progress battles.

## Performance

The forms are drawn once, at the moment a change begins, from the battler's own pixels, while the boss holds. A very large battler (over 1,000 px) makes that hold pause while its form is drawn. During play nothing is redrawn: the aura and the motes move as sprites. In our frame test, phase two at rest in a battle drew 34 draw calls a frame with no texture uploads and no bitmap redraws.

## Credits

Code: Core Systems Asset Factory. Every line was written with AI assistance. No images, fonts or audio ship with the plugin; the sound defaults name stock RPG Maker MZ sound effects already in your project.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
