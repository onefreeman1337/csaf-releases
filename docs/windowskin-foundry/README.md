# Windowskin Foundry - 44 Worked-Material Windowskins for RPG Maker MZ, Re-struck From Your Tilesets — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Windowskin Foundry - 44 Worked-Material Windowskins for RPG Maker MZ, Re-struck From Your Tilesets  
**Engine:** RPG Maker MZ  
**Store page:** https://csaf.itch.io/windowskin-foundry  
**Docs published:** 2026-11-05


---

# Windowskin Foundry for RPG Maker MZ

Windowskin Foundry gives every window in your game a worked-material frame: a chamfered rim lit from the upper left,
plates seated in the corners, a shadow cast onto the window back, and a back textured with the material's own finish
(hammered copper, brushed brass, engine-turned gold, wood grain, cast bronze, card fibre). 44 skins ship ready to use,
and a playtest command re-strikes any of them into the colours of your own tilesets.

## What you get

- `img/system/Window_<Material>_<Ornament>.png`: 44 windowskins in MZ's own 192x192 layout. 11 materials (Iron,
  Steel, Blued Steel, Silver, Pewter, Brass, Bronze, Copper, Gold, Oak, Cut Card) x 4 corner ornaments (Stud on a round
  plate, Bolt on a chamfered square, Rosette on a quatrefoil, Volute on a diamond).
- `js/plugins/WindowskinFoundryCore.js`: reads a palette from tileset pixels and re-strikes a skin into it.
- `js/plugins/WindowskinFoundry.js`: chooses the skin, keeps the text colours in step with it, and runs the re-strike.
- This guide and `LICENSE.txt`.

## Installing

1. Copy the `img/system` images into your project's `img/system/` folder.
2. Copy both plugin files into your project's `js/plugins/` folder.
3. In the Plugin Manager, add `WindowskinFoundryCore.js`, then `WindowskinFoundry.js` below it, and turn both ON.
4. Pick a skin in the `Window skin` parameter (default `Window_Brass_Stud`).

The plugin finds its core when it is first used, so a different order still works.

Your own `Window.png` is never touched. Blank the parameter to go back to it.

## Why the plugin, and not just the images

You can use any of the 44 images by renaming it to `Window.png`. But RPG Maker MZ reads every text colour, including
the system colour used for labels such as "Lv" and "HP", from `img/system/Window.png` once when the game starts, and
never from a window's own skin. So a skin under any other name draws the default colours. The plugin points the colour
reading at the skin in force, so each skin's own normal and system text colours appear, and it redraws open windows
once when the skin changes.

Each skin's normal and system text colours were chosen to read at 4.5:1 or better on its window back as MZ draws it
(the back at the default window opacity of 192, over a white scene, on the back's lightest row). The other 30 text
colours (gauges, damage, crisis and so on) are MZ's defaults, so their meaning does not change.

## Plugin commands

**Set window skin.** Switches every window to another skin at once. The choice is saved with the game. A blank name
returns to the parameter's skin. A name that cannot be loaded from `img/system` (a typo, or a re-strike you have since
deleted, even one named in an old save) is refused with a warning in the console, and the windows keep the skin they
wear, so the game never stops on it.

**Re-strike from this map's tileset (playtest only).** Reads the images of the current map's tileset, finds their
three main hues, and re-tints a skin into the one you pick (Most used, Second, Third). The rim, plates and cursor take
the hue; the window back keeps its depth; the normal and system text colours are re-struck to read at 4.5:1 or better.
The new image is written to `img/system/` under the name you give (blank gives the source skin's name, the tileset's
name and the rank, for example `Window_Brass_Stud_OverworldR1`), and
with "Use it now" every window switches to it.

- It runs only in a playtest, because it writes a file into your project. Outside a playtest it does nothing and says
  why in the console.
- If a file with that name already exists, it is first copied to `img/system/WindowskinFoundry_backups/` with the time
  in its name. Nothing is overwritten without a copy.
- If a tileset image cannot be loaded, the command refuses with the reason in the console and the game keeps running.
- The most-used hue of many outdoor tilesets is their ground (sand, earth). The second and third hues are often the
  ones that feel like the set (water, crystal, lava), which is why all three are offered.
- The source skin decides the finish. The re-strike keeps the frame's light and shade exactly and changes its colour, so a
  coloured source (Brass, Bronze, Copper, Gold, Oak, Blued Steel) comes out as a full enamel colour in the new hue, and
  a grey source (Iron, Steel, Pewter, Silver, Cut Card) comes out as metal with a tint of it. Try one of each.

## Good to know

- The skins use the engine's own layout: the back is stretched to the window, the textured pattern tiles at full size,
  the frame's four corners are copied as they are and its edges are stretched. That is why every ornament sits in a
  corner and the rim is the same along its whole length: nothing smears on a wide window.
- If the parameter names an image that is not in `img/system`, MZ stops at its usual "Failed to load" screen, as it
  does for any missing image. Check the name.
- Compatibility: the plugin extends `Window_Base.prototype.loadWindowskin`, `Window_Base.prototype.update`,
  `Scene_Base.prototype.update` and `ColorManager.loadWindowskin`, each calling the original, and
  `ColorManager.textColor` and `ColorManager.pendingColor`, which answer from the skin's colours (read once per skin,
  so a swap never stalls a frame on canvas reads) and hand anything else to the original. It replaces nothing.
- Fonts: the skins do not change your game's font. The store images use a serif in a showcase scene; your windows draw
  in whatever font your project uses.

## Credits

Core Systems Asset Factory. See `LICENSE.txt` for the terms of use and the AI disclosure.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
