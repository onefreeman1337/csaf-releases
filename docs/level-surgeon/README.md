# Project-Wide Level Surgeon — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Project-Wide Level Surgeon  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-28


---

# Project-Wide Level Surgeon

**Bulk actor editing that does not stop at the map boundary.**

Unreal's Property Matrix edits the current selection. *Replace Selected Actors With* replaces the
current selection. Both are excellent, and both end at the edge of the level you have open. A team
with 240 maps that needs one property set on every instance of a class, everywhere, writes a
throwaway Python script — and then writes another one next month.

Level Surgeon takes those operations and gives them project scope, a preview you can hand to
somebody, and an undo.

---

## Install

1. Copy the `LevelSurgeon` folder into your project's `Plugins/` folder.
2. Open the project. The plugin is enabled by default.
3. Confirm it loaded: **Edit → Plugins → Editor**, search "Level Surgeon".

Built and verified against **Unreal Engine 5.8 on Windows**. That is the only engine this build has
been compiled and run on, and it is the only one claimed.

---

## Sixty seconds to your first run

Everything runs through one commandlet. **The default mode writes nothing.**

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
  "D:\Projects\MyGame\MyGame.uproject" -run=LevelSurgeon ^
  -Class=/Script/Engine.PointLight -Property=PointLightComponent.IntensityUnits -Value=Candelas
```

That opens every map under `/Game`, finds every point light, and writes an HTML sheet to
`MyGame/Saved/LevelSurgeon/`. **No package is touched.** Open the sheet, read it, then add
`-Execute`.

---

## The three operations

| | What it does |
| --- | --- |
| **SET** | Writes a named property on every matched actor. `-Property=Comp.Prop -Value=X` |
| **SWAP** | Replaces every matched actor with another class, carrying properties across. `-SwapTo=<class>` |
| **MARK** | Adds and strips actor tags, and moves actors between editor folders. `-AddTags=` `-RemoveTags=` `-Folder=` |

### SET

```
-Class=/Game/Props/BP_Torch.BP_Torch_C -Property=PointLightComponent.Intensity -Value=4400.0
```

`Component.Property` addresses a component; a bare `Property` addresses the actor. The component is
matched by its name first and by its class second, so both `Barrel` and `StaticMeshComponent` work —
and if two components share the class name, the tool refuses rather than guessing which barrel you
meant.

The value is the same text the details panel copies to your clipboard. Right-click any property →
**Copy**, and paste it straight in.

### SWAP

```
-Class=/Game/Props/BP_Torch.BP_Torch_C -SwapTo=/Game/Props/BP_TorchV2.BP_TorchV2_C
```

The replacement keeps the original's **object name** (so soft references and level scripts still
resolve), transform, editor label, folder, tags, the actor it was attached to and the socket, and
every actor attached to it.

It also carries every **actor-level** property that exists on **both** classes with the **same name
and the same type** and whose value was not the class default. That is where a Blueprint's own
variables live, which is the case this exists for. The engine's own *Replace Selected Actors With*
does not do it at all.

**What it does not carry:** per-component property overrides. A value you changed on the old class's
`StaticMeshComponent` is not copied onto the new class's, because the two components are different
objects on different classes and matching them by name would be a guess. Every such value is still
**recorded in the undo journal**, so a rollback restores it.

Anything that cannot be carried is listed by name in the report, with the reason. `-NoMigrate` turns
the property migration off entirely.

### MARK

```
-Class=/Script/Engine.StaticMeshActor -AddTags=Reviewed -RemoveTags=TODO -Folder=/Props/Audited
```

---

## Choosing the actors

Every switch narrows, and they AND together.

| Switch | Meaning |
| --- | --- |
| `-Class=` | Class path or bare name. Blueprints: `/Game/BP/BP_Torch` and `/Game/BP/BP_Torch.BP_Torch_C` both work |
| `-ExactClass` | Do not include subclasses |
| `-RequireTags=A+B` | Actor must carry **all** of these |
| `-ForbidTags=DoNotTouch` | Actor must carry **none** of these |
| `-NameContains=Torch` | Substring of the actor's name **or** its editor label |
| `-InFolder=/Props` | Actor's editor folder must start with this |
| `-Paths=/Game/Maps+/Game/Levels` | Which content paths to search. Default: all of `/Game` |

**Give no conditions at all and the selector means every actor in every map.** That is a legitimate
thing to want, and the tool prints it in those words on the report rather than letting you find out
afterwards. A *swap* may not use an unrestricted selector — that one is refused outright.

`-ForbidTags` is the switch worth adopting as a habit. Tag the handful of actors nobody may touch
`DoNotTouch`, forbid it in every recipe, and the project defends itself.

---

## Recipes: the operation as a file

Everything above can live in a JSON file that sits in your repository, diffs in code review, and
runs identically on a designer's machine and on the build server.

```
-Recipe=Tools/LevelRecipes/torches_v2.json
```

```json
{
  "name": "Torches to the new Blueprint",
  "operation": "swap",
  "select": {
    "class": "/Game/Props/BP_Torch.BP_Torch_C",
    "includeSubclasses": true,
    "requireTags": [ "Set_Dressing" ],
    "forbidTags": [ "DoNotTouch" ],
    "folder": "/Props/Lighting",
    "where": [
      { "property": "PointLightComponent.Intensity", "equals": "1200.000000" }
    ]
  },
  "swap": { "to": "/Game/Props/BP_TorchV2.BP_TorchV2_C", "migrateProperties": true }
}
```

The other two shapes:

```json
{ "operation": "set",  "select": { "class": "/Script/Engine.PointLight" },
  "set":  { "property": "PointLightComponent.Intensity", "value": "4400.0" } }

{ "operation": "mark", "select": { "nameContains": "Placeholder" },
  "mark": { "addTags": [ "Blockout" ], "removeTags": [ "Final" ], "folder": "/Blockout" } }
```

A file may hold a **single object or an array of them**, run in order. If any entry fails to parse,
**the whole file is refused** — nothing runs. A half-understood recipe must not be allowed to write
to a project.

`"where"` compares the property's current value as text, in the same grammar `"value"` uses. Copy a
value out of a report and paste it into a condition.

---

## The preview, and the two switches

```
(default)   Reads the project. Writes the report. Touches no package.
-Execute    Applies it, checks out of revision control, and saves.
```

The preview and the write are **the same code path**. `-Execute` is read at exactly one place per
operation, the statement before the value changes. Everything above it — matching, resolving,
reading the current value, deciding the new one, classifying refusals — runs identically either way.
The dry run is not a simulation of the write; it is the write, stopped one statement short.

---

## Undo

Every run that writes also writes a journal to `Saved/LevelSurgeon/LevelSurgeon-<runid>.json`,
**before** the packages are saved. If the editor dies half way through 240 maps, the journal already
covers the maps that got written.

```
-Rollback=Saved/LevelSurgeon/LevelSurgeon-20260828-041500.json            preview the undo
-Rollback=Saved/LevelSurgeon/LevelSurgeon-20260828-041500.json -Execute   undo it
```

Rollback is the same replacement code the swap uses, run in the other direction, and it replays the
journal **backwards** so two changes to one actor unmake in the right order. For a swap it restores
the original class **and** every authored value recorded before the swap, including the ones the new
class had no property for.

An actor that was renamed, deleted or re-swapped by somebody else since the run is reported as stale
and left alone. Delete the journal and you lose the ability to roll back.

---

## World Partition and One File Per Actor

A commandlet that reads `ULevel::Actors` sees an **empty level** on a World Partition map — every
actor lives in its own package and nothing puts them in the level until streaming does. Tools that do
not know this report "0 actors" over an open-world project and call it clean.

Level Surgeon reads the external actor packages directly. **SET and MARK work normally on
partitioned maps.** The report flags each one and says how many actor packages it opened.

**SWAP is refused on partitioned maps**, by name, in the report. Spawning into a One File Per Actor
level re-derives the actor's package, and that path is not one this tool will take on your project
without having proven it. It is not silently skipped, and it is not attempted.

---

## Revision control

When revision control is configured, every package is checked out before it is written, and the
report says how many files were checked out and names any that failed. A file that will not check out
is usually checked out by somebody else, which is the single most useful thing a project-wide run can
tell you.

With no revision control configured, files are written directly, and the report says that too.

---

## In CI

The exit code is the gate.

| Code | Meaning |
| --- | --- |
| `0` | Nothing to change |
| `1` | Changes found (preview) or made (`-Execute`) |
| `2` | The run failed |
| `3` | The arguments could not be used |

So a standards check on a pull request is a preview run that must exit 0:

```
UnrealEditor-Cmd.exe MyGame.uproject -run=LevelSurgeon -Recipe=Tools/LevelRecipes/lighting_standard.json
if errorlevel 1 exit /b 1
```

Point `-Out=` at your artefact directory and the HTML sheet attaches to the build.

---

## Reading the report

The sheet's spine is the **reach profile**: one column per map opened, height by how many changes
landed there, and every map the run did *not* reach still drawn as a flat tick. It answers "how far
did this go" before you read a number.

Colour carries **mode**, everywhere on the page:

- **teal** — planned, nothing written
- **green** — written to disk
- **violet** — a rollback
- **red** — refused by name

Every actor the selector matched and the operation declined appears under **Refused, by name**, with
the reason, grouped. There are no silent skips: a skip you cannot see is indistinguishable from a bug.

If nothing was examined, the sheet prints **no verdict at all** rather than a reassuring zero.

---

## Every switch

```
SCOPE
  -Paths=/Game/Maps+/Game/Levels   Content paths to search. Default: all of /Game.

THE OPERATION
  -Recipe=<file.json>              A recipe, or an array of them run in order.
  -Property=Comp.Prop -Value=X     SET that property on every matched actor.
  -SwapTo=<class path>             SWAP every matched actor for that class.
  -AddTags=A+B  -RemoveTags=C      MARK: add and strip actor tags.
  -Folder=/Props/Audited           MARK: move matched actors to that editor folder.

WHICH ACTORS
  -Class=<class path or name>      Actors of this class. Required for a swap.
  -ExactClass                      Do not include subclasses.
  -RequireTags=A+B                 Actor must carry all of these tags.
  -ForbidTags=DoNotTouch           Actor must carry none of these.
  -NameContains=Torch              Substring of the actor name or its editor label.
  -InFolder=/Props                 Actor's editor folder must start with this.

WRITING
  (default)                        PREVIEW. Reads the project, writes no package.
  -Execute                         Apply, check out of revision control, and save.
  -NoMigrate                       On a swap, do NOT carry matched properties across.

UNDO
  -Rollback=<journal.json>          Preview undoing a previous run.
  -Rollback=<journal.json> -Execute Undo it.

OUTPUT
  -Out=<directory>                 Report and journal. Default: <Project>/Saved/LevelSurgeon.
  -Help                            The usage text.
```

---

## Working habits worth adopting

1. **Preview, read the sheet, then execute.** The sheet is a reviewable artefact — attach it to the
   ticket.
2. **Run on a clean working tree** and read the diff. A version-control diff is the one check that
   does not depend on this tool being right about itself.
3. **Keep recipes in the repository.** The value of a recipe is that next month's identical job is a
   file somebody already reviewed.
4. **Tag what must not move** `DoNotTouch` and forbid it everywhere.
5. **Narrow with `-Paths` while you are experimenting.** One folder of maps is a fast loop; the whole
   project is not.

---

## When something does not work

**"No maps were found."** `-Paths` is wrong, or the asset registry had not finished. The report says
which.

**"0 actors examined" on an open-world map.** The external actor packages could not be read. Check
that the map's `__ExternalActors__` folders are present and that the registry finished scanning.

**A property is "not editable on a placed actor".** It is transient, deprecated, read-only, or hidden
from instances. Writing it would not survive a save, so it is refused rather than faked.

**A value "would not parse".** Copy the value from the details panel — right-click the property →
**Copy** — and paste it verbatim. The report shows the current value in exactly the grammar the tool
expects.

**A swap was refused on one map.** That map uses One File Per Actor. See above.

---

## Support

Questions, bug reports, and feature requests through the marketplace listing's support channel.

Copyright (c) 2026 Core Systems Asset Factory. All Rights Reserved.
Unreal® and Unreal Engine® are trademarks of Epic Games, Inc. This product is not affiliated with or
endorsed by Epic Games, Inc.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
