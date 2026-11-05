# Living Icons - Animated Menu Icons for RPG Maker MZ (glint, twinkle, bubble, flicker, pulse) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Living Icons - Animated Menu Icons for RPG Maker MZ (glint, twinkle, bubble, flicker, pulse)  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/living-icons  
**Docs published:** 2026-11-05


---

# Living Icons for RPG Maker MZ

Living Icons makes every icon in your menus move by what it is. Blades glint, gems twinkle, potions
bubble, fire flickers with embers, key items pulse. It reads your database to decide which effect
each icon gets and reads the icon's own pixels to decide where the light goes, so there are no frames
to draw and nothing to tag. Each icon plays briefly and then rests, and identical icons in one list
move out of step, so a full inventory shimmers instead of strobing.

## What you get

- `js/plugins/LivingIconsCore.js`: reads each icon and bakes its animation (no commands, no parameters).
- `js/plugins/LivingIcons.js`: plays the animations in every window that draws icons.
- This guide and `LICENSE.txt`.

## Installing

1. Copy both files into your project's `js/plugins/` folder.
2. In the Plugin Manager, add `LivingIconsCore.js`, then `LivingIcons.js` below it, and turn both ON.
3. Open the item menu in playtest.

Living Icons finds its core when it is first used, so a different order still works, but the order
above is the one the Plugin Manager's dependency warning expects.

## Which effect each icon gets

| Database entry | Effect |
| --- | --- |
| Weapon | glint (a streak of light crosses it) |
| Weapon with the Fire attack element | flicker |
| Armour, metal (a desaturated icon) | glint |
| Accessory (equipment type 5) | twinkle (its own brightest points) |
| Item that recovers HP or MP | bubble |
| Key item | pulse |
| Skill, by its element: Fire | flicker, with embers |
| Skill: Thunder | twinkle |
| Skill: Ice | glint |
| Skill: Water | bubble |
| Skill: Light, Darkness | pulse |
| Anything else | stays still |

Element names are matched by meaning (fire, flame, burn, thunder, lightning, ice, frost, water, light,
holy, dark, shadow and so on), so renamed elements still work.

When several entries share one icon (a status skill and an accessory, say), a notetag on any of them
decides; otherwise the first entry that maps to a real effect decides.

## Notetags

On items, weapons, armours and skills:

| Notetag | Effect |
| --- | --- |
| `<Living Icon: glint>` | force an effect: glint, twinkle, bubble, flicker or pulse |
| `<Living Icon: none>` | keep this icon still |

## Plugin parameters

| Parameter | Default | Effect |
| --- | --- | --- |
| Speed | 3 | engine frames per animation frame (1 to 8): 2 is livelier, 5 is slower |
| Intensity | Standard | Subtle, Standard or Bold. The most expensive quarter of your database is always one step stronger |
| Leave out | (empty) | effects to switch off, comma separated: glint, twinkle, bubble, flicker, pulse |

## How it looks after

- **Glint:** a narrow band of light with a white core sweeps diagonally across the icon's own pixels.
- **Twinkle:** four-point stars open and close on up to three of the icon's brightest points.
- **Bubble:** small bubbles rise through the icon's coloured body (on a white-glyph icon, through the glyph, tinted).
- **Flicker:** warm colours breathe toward a hotter yellow and embers rise from the top of the flame.
- **Pulse:** a one-pixel gold halo rises and fades just outside the icon, and its rim lifts with it.

Greyed (disabled) entries stay greyed. Icons RPG Maker draws as tiles that fill their square (the stock
style) are read as a glyph on a tile, so sparkles and bubbles land on the glyph, never on the tile's
border; a glint sweeps across the whole tile like light across a polished card.

If another plugin draws its own picture where an icon would go (for example a plugin that generates
item pictures), Living Icons checks the pixels it expects and leaves that picture alone.

## Script calls

`LivingIcons.effectOf(iconIndex)` returns the effect an icon has (or `none`).
`LivingIcons.rebuild()` re-reads the database and the IconSet, for projects that change either at runtime.
`LivingIcons.stats()` returns how many icons have been baked.

## Compatibility

Living Icons extends three engine methods by saved-original prototype extension and replaces none:
`Window_Base.prototype.drawIcon` (records where an icon was drawn), `Window_Base.prototype.createContents`
(retires animations when a window's contents are cleared) and `Window_Base.prototype.update` (advances the
frames). Window skins, layouts and menu plugins are untouched; the animations sit on top of whatever
draws the icon.

## Frame cost

Each icon's frames are made once, the first time it is drawn, and every animation plays from one shared
texture page, so a menu full of moving icons adds very little per frame. The measured figures are in the
store listing.

## Terms

See `LICENSE.txt`. Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
