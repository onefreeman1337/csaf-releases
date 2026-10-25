# Brushfall - TrenchBroom and Quake .map Importer for Unreal Engine 5 — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Brushfall - TrenchBroom and Quake .map Importer for Unreal Engine 5  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-25


---

# Brushfall

**TrenchBroom and Quake .map importer for Unreal Engine 5.8.**

Save your level in TrenchBroom, import it in Unreal, and get it back as a lit, collidable level: brushes merged into a few
static meshes instead of one per brush, exact convex collision from the brush planes, textures turned into material
instances, lights and player starts placed as real actors. Change the map, import again, and only what changed is rebuilt:
the actors you adjusted in Unreal keep their settings.

- Engine: **Unreal Engine 5.8**, Windows (Win64). Tested on 5.8 only.
- Formats: Quake standard and Valve 220 `.map` files (what TrenchBroom, J.A.C.K. and NetRadiant write), in the same file.
- Textures: WAD3 (Half-Life) files, WAD2 (Quake) files with the game's `palette.lmp`, and folders of `.png`, `.tga`,
  `.jpg`, `.jpeg` or `.bmp` images.

## Install

1. Copy the `Brushfall` folder into your project's `Plugins` folder (create it if needed).
2. Open the project. Enable **Brushfall** under Edit > Plugins if it is not already enabled, and restart the editor.
3. The import window is under **Tools > Brushfall: Import .map**. Settings are under
   **Edit > Project Settings > Plugins > Brushfall**.

## Try the demo

The plugin ships a demo map: `Plugins/Brushfall/Demo/brushfall_demo.map`, with its textures in `Demo/textures/` and the same
textures as a WAD3 in `Demo/brushfall_demo.wad`.

1. Open (or create) an empty level.
2. **Tools > Brushfall: Import .map**, press **Browse** next to MAP and pick `brushfall_demo.map`. Brushfall previews the
   import at once: the map from above, one colour per merged mesh, and the plan.
3. Press **IMPORT**, then save the level.

## What an import does

| In the map | In Unreal |
| --- | --- |
| World brushes (`worldspawn`, `func_group`, `func_detail`) | Merged into **one static mesh per cluster cell** (a cube of `ClusterSize` map units, 1024 by default, chosen by each brush's centre). Each texture becomes one material section. |
| A brush entity (`func_door`, `trigger_once`, ...) | One actor with all of that entity's brushes merged into one mesh. |
| A solid brush | **One convex collision hull, exactly the brush.** The mesh uses simple collision for complex queries too, so a line trace hits the brush shape. |
| A point entity | An actor at its `origin`, turned by its `angle` (or `angles` / `mangle`). |
| A texture name | One texture asset and one material instance, made once and shared by every map imported to the same content root. An existing one is never overwritten. |

Generated assets go to the **Content Root** (default `/Game/Brushfall`): `Textures/`, `Materials/`, and
`<map name>/Meshes/`. Placed actors go into the World Outliner folder `Brushfall/<map name>/World`, `.../Brush Entities`
and `.../Point Entities`.

**Scale:** `CentimetresPerUnit` (default **3.125**, i.e. 32 map units to the metre, which makes a 56-unit Quake player
175 cm tall). Map Y is flipped into Unreal's left-handed space, so the level is not mirrored: what is to the left of +X in
TrenchBroom is to the left of +X in Unreal.

### Special textures

| Textures (case-insensitive, editable in Project Settings) | Result |
| --- | --- |
| `skip`, `nodraw`, `caulk`, `null` (and the `common/` and `tools/` forms) | Not drawn. |
| `clip`, `playerclip`, `monsterclip` | Not drawn; the brush still collides. |
| `trigger`, `aaatrigger` | Not drawn in game. |
| Names starting with `sky` | Not drawn, so your level's sky shows; the brush collides. |
| Names starting with `*` or `!` (liquids) | Drawn; that brush gets **no** collision. |

A cluster or entity with no drawn face at all (a clip brush on its own, a trigger volume) is built from its tool faces with
an orange striped material and **hidden in game**, so you can see it in the editor. `trigger_*` entities get the
**Trigger** collision profile with overlap events on. `func_illusionary` brushes are drawn and never collide.

### Entities: the class table

**Project Settings > Plugins > Brushfall > Class Rules** maps a classname (wildcards `*` and `?` allowed, first match wins)
to the actor class it becomes. The defaults:

| Classname | Becomes |
| --- | --- |
| `light*` | Point Light. `light` sets the intensity (300 = `LightIntensityAt300`, 8 cd by default, scaled linearly) and the attenuation radius (`light` x `LightRadiusPerValue` map units); `_color` sets the colour (0-1 or 0-255). Half-Life's `_light` "r g b brightness" is read too. |
| `info_player_start`, `info_player_deathmatch`, `info_player_coop`, `info_player_start2` | Player Start |
| any other point entity | Target Point (listed in the report as "no class rule") |

Every placed actor carries its classname as the actor tag `BF.Class:<classname>`, so a Target Point says which entity it
stands for.
| any brush entity with no rule | Static Mesh Actor |

Map a brush entity to your own Blueprint (for example `func_door` to `BP_Door`) and its merged brushes are given to that
Blueprint's first Static Mesh Component. **Every other key on an entity is written to the actor property of the same name**
when one exists and is editable (`speed` "100" lands in a `Speed` variable). Keys with no matching property are listed in
the report, never silently dropped.

## Re-import: only what changed

Run the import again on the same level after editing the map. Every actor Brushfall places carries its identity and a
fingerprint of what built it (as actor tags starting `BF.`), and each one gets exactly one of these:

| Change in the map | What happens |
| --- | --- |
| Nothing | **Not touched.** |
| A world cluster's or brush entity's brushes changed | **Its mesh is rebuilt in place** - the same mesh asset, the same actor. Settings you changed on the actor (collision preset, shadows, lightmap resolution, material overrides, tags) stay. A mesh you assigned by hand is left assigned. |
| A point entity moved or turned | Only its location and rotation are updated. |
| A point entity's other keys changed | Its keys are re-applied (this resets a light's colour to the map's `_color`). |
| An entity or cluster is gone | Its actor is removed (undoable with Ctrl+Z in the editor). Turn off **Remove actors whose entity left the map** (or pass `-KeepMissing`) to keep them; they are listed instead. |

**Identities.** World clusters are named by their cell (`world/1_0_0`). An entity is named by its classname and
`targetname` (`func_door/vault`), or by a `_bf_id` key if you add one (`light/id:hall`), or else by its position among
entities of the same classname (`light#3`). Give the entities you will edit in Unreal a `targetname` or `_bf_id`: then
adding another entity of the same class earlier in the file cannot shift their identity. Two entities with the same
targetname are told apart with a `~2` suffix and a warning.

**The map is recognised by its file name** (`e1m1.map` -> `e1m1`, stored as the tag `BF.Map:e1m1`). Re-import the same
file, or a file of the same name from anywhere, and Brushfall finds its actors. Importing a renamed copy (`e1m1_v2.map`)
into the same level places a second, separate set of actors; rename the file back, or delete the first set, to avoid that.

**Textures on re-import.** Each texture name is looked up in this run's WADs and folders first. If none of them has it
but an earlier import made its texture (`T_<name>` under the Content Root), that texture and its material instance are
used, at the size the map was textured at, so re-importing on a machine without the WAD keeps the look and rebuilds
nothing that did not change. The report lists those as **earlier import**. Only a texture found in neither place gets the
magenta placeholder, and once you supply it, the next import rebuilds the meshes that used the placeholder. A texture
asset that already exists is used as it is and never overwritten, so a change you make to a texture in the WAD after its
first import does not reach Unreal: edit the texture asset in Unreal instead. UVs always follow the size the map was
textured at, so a higher-resolution image loaded into the same texture asset keeps the map's texel scale.

Everything is decided before anything is written. If a file the import would write is read-only (not checked out of
source control), the import refuses and changes nothing.

## The import window

**Tools > Brushfall: Import .map** (or the console command `Brushfall.Open`).

- **MAP / TEXTURES / WADS**: the map, an optional texture folder (default: a `textures` folder beside the map) and optional
  extra WAD files (`;` separated). The map's own `wad` key is always read: each entry is tried as written, beside the map,
  then by file name beside the map. **Lookup order for a texture name:** the WADs (the ones you add first, then the map's
  own), then the folders. The report's Textures table says where each one was found.
- **PREVIEW** decides everything and writes only the report. **IMPORT** imports into the level that is open. Save the level
  afterwards.
- The left panel draws the map from above: one colour per merged mesh, brush entities in white, triggers and clip volumes
  dashed orange, lights as yellow marks, player starts green, other entities grey (teal when a class rule matched).
- **Open report** opens the HTML report of the last run.

## The report

Every run writes `report.html` and `report.json` to `Saved/Brushfall/<map name>/<run id>/`: brushes in and meshes out, the
map from above, what happened to each actor (create, rebuild, unchanged, move, update, remove, keep), every texture and
where it was found, and every problem with its line number.

## Command line and CI

```
UnrealEditor-Cmd.exe MyGame.uproject -run=Brushfall -Map="D:/maps/e1m1.map" -Level=/Game/Maps/E1M1
```

| Switch | Meaning |
| --- | --- |
| `-Map=<file.map>` | The map to import. Required. |
| `-Level=/Game/Maps/E1M1` | The level to import into; created if it does not exist (default `/Game/Maps/<map name>`). In Git Bash write `+Game/Maps/E1M1`. |
| `-Wad=<a.wad;b.wad>` | Extra WAD files. |
| `-Textures=<folder;folder>` | Texture folders (default: `textures` beside the map). |
| `-Palette=<palette.lmp>` | The palette WAD2 textures need (default: `palette.lmp` or `gfx/palette.lmp` beside the map). |
| `-Scale=3.125` | Centimetres per map unit. |
| `-ClusterSize=1024` | Cluster cube size in map units (64 to 65536). |
| `-Root=/Game/Brushfall` | Content folder for the generated assets. |
| `-Preview` | Decide everything and write the report; change nothing. |
| `-KeepMissing` | Keep actors whose entity left the map. |
| `-Strict` | Fail (exit 5) if any brush could not be built, any texture is not in this run's WADs or folders (one kept from an earlier import counts), or any point entity has no class rule. |
| `-Report=<folder>` | Report root (default `Saved/Brushfall`). |
| `-Help` | Print the switches and the exit codes. |

**Exit codes:** `0` imported or previewed · `2` bad arguments · `4` the map could not be read or parsed (the line is named)
· `5` `-Strict` found problems · `6` a file to write is read-only, nothing was changed · `7` a file could not be written.
Every run logs one line starting `Brushfall RESULT exit=` with the counts.

`Brushfall.Import -Map=<file> [switches]` does the same into the level open in the editor, without the window.

## What it does not do

- Quake 3 patch meshes (`patchDef2`/`patchDef3`) and brush primitives (`brushDef`) are skipped and counted in the report.
  Save the map in Quake standard or Valve 220 format.
- Hammer `.vmf`, Doom 3 and Quake 3 BSP formats are not read.
- It does not compile the map (no BSP, vis or light baking): brushes become static meshes and lights become Unreal lights.
- Entity behaviour is not recreated: a `func_door` is placed with its brushes; map it to a Blueprint to make it open.
- Brush entity `origin` brushes (rotating doors) are not interpreted.

## Support

<https://csaf.itch.io> · Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
