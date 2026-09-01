# Level Instance Forge — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Level Instance Forge  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-01


---

# Level Instance Forge

**For Unreal Engine 5.8, Windows.** Editor-only plugin. Nothing ships into your packaged game.

Finds the actor arrangements your levels repeat, and converts them all to Level Instances at once.

---

## 1. What this is for

A level accumulates the same arrangement of placed actors over and over: the same lamp post, base
and two bollards, dropped forty-seven times across six maps by four people over eight months. Change
the lamp and you change it forty-seven times, by hand, and you miss three.

Unreal already has the right answer — the **Level Instance**: one source map holding the arrangement
once, referenced by cheap actors wherever it appears. Edit the source, every instance updates.

**Converting to it in bulk is not currently possible in the editor**, and it is worth knowing
exactly why, because it explains what this plugin is.

Epic's own conversion function sets one flag unconditionally:

```
LevelInstanceSubsystem.cpp:1439    CreateNewStreamingLevelParams.bUseSaveAs = true;
```

That routes the whole thing through `SaveLevelAs` instead of the silent save that takes a filename,
and `SaveLevelAs` ends in `OpenSaveAsDialog`, inside a retry loop. **A modal save dialog, once per
cluster** — and the package name the caller supplied is ignored. Epic filed it as **UE-309562** and
it is still open in 5.8.

So this plugin does the part the engine leaves to you — deciding what a cluster *is* — and then
performs the conversion itself, with no dialogs.

## 2. Install

1. Copy the `LevelInstanceForge` folder into your project's `Plugins` directory.
2. Open the project. If you are asked to rebuild, say yes.
3. **Edit → Plugins**, search for *Level Instance Forge*, confirm it is enabled.

## 3. First run, two minutes

Open the editor console (backtick `` ` ``) and run:

```
LevelInstanceForge.Run -Scan -Paths=/Game/Maps
```

Open the HTML sheet written to `Saved/LevelInstanceForge/`. It lists every repeated arrangement,
ranked by **how many actors converting it would remove**, and every cluster the tool declined to
touch, with the reason.

Nothing has been written to your project.

When the report looks right:

```
LevelInstanceForge.Run -Forge -Apply
```

That creates the source maps, replaces every occurrence, and saves. The sheet then names the undo
journal. To reverse the whole run:

```
LevelInstanceForge.Run -Revert=<that journal file>
```

## 4. From the command line, for CI

```
UnrealEditor-Cmd.exe MyProject.uproject -run=LevelInstanceForge -Scan -Paths=/Game/Maps
UnrealEditor-Cmd.exe MyProject.uproject -run=LevelInstanceForge -Forge -Apply
UnrealEditor-Cmd.exe MyProject.uproject -run=LevelInstanceForge -Revert=D:/Journal.json
```

The commandlet and the console command call the same code, so they cannot answer differently.

## 5. Every switch

| switch | meaning |
| --- | --- |
| `-Scan` | Report only. Writes an HTML sheet and nothing else, ever. |
| `-Forge` | Show what would be created and replaced. Still writes nothing. |
| `-Apply` | With `-Forge`: actually do it. Without it, nothing is written. |
| `-Revert=<file>` | Undo a previous `-Forge -Apply` from its journal. |
| `-Paths=/Game/Maps` | Content paths to scan, comma separated. Default `/Game`. |
| `-Dest=/Game/Forged` | Where forged source maps are created. Default `/Game/LevelInstanceForge`. |
| `-Out=<dir>` | Where the sheet and journal go. Default `Saved/LevelInstanceForge`. |
| `-Radius=500` | Proximity link distance in Unreal units. |
| `-MinOccurrences=3` | How many times an arrangement must recur before it is offered. |
| `-MaxClusterSize=64` | Actors per cluster above which a cluster is refused. |
| `-PosTolerance=0.01` | Position tolerance, Unreal units. |
| `-RotTolerance=0.01` | Rotation tolerance, degrees. |
| `-ScaleTolerance=0.0001` | Scale tolerance, relative. |

Exactly one of `-Scan`, `-Forge` or `-Revert` is required. **A switch it does not recognise is an
error, not a warning** — a silently ignored switch is how a run does something other than what you
asked for and reports success over it.

## 6. Exit codes

| code | meaning |
| --- | --- |
| 0 | Everything asked for was done. |
| 1 | The switches could not be understood. Nothing was read or written. |
| 2 | The scan could not read the project. |
| 3 | Forge incomplete: at least one group could not be written. |
| 4 | Revert incomplete. |

⚠️ **Exit 2 is never "your project is clean."** A clean project exits `0` with an empty sheet.
Code 2 means the scan itself did not happen — for example if `-Paths` names a path holding no
levels. The tool refuses to report an empty scan as a clean bill of health, because from the outside
those two look identical.

## 7. How it decides two arrangements are the same

This is the part that matters, so it is worth stating plainly.

1. **Proximity.** Actors within `-Radius` of one another form a cluster. Clusters never span two
   maps.
2. **A local frame.** Every member is expressed relative to an *anchor* member, chosen by an
   ordering that does not depend on where the cluster sits or which way it faces. So the same
   arrangement, rotated ninety degrees and dropped in a different map, produces an identical
   signature.
3. **Confirmation.** A matching signature is a *candidate*, never a verdict. Members are then
   compared against the real `-PosTolerance`, `-RotTolerance` and `-ScaleTolerance` values, and a
   group whose members do not actually agree is split rather than merged. Rotations are compared as
   the angle between quaternions, never component-wise, because two identical rotations can differ
   in every Euler number.
4. **Grouping.** Arrangements confirmed identical and occurring at least `-MinOccurrences` times are
   offered, ranked by actors removed.

**Two arrangements that differ only by a material override are different arrangements.** The
material on each named slot is part of what is compared, so they never merge. That splits groups a
looser tool would join — deliberately. Merging them would give every occurrence the materials of
whichever one happened to be converted first.

## 8. What it refuses, and why

Every refusal appears in the sheet with the actor and the reason.

- **An actor attached to something outside its cluster, or with something attached to it.** Moving
  it into a source map would break the attachment or orphan the child.
- **A non-uniformly scaled anchor.** The anchor's transform becomes the Level Instance's transform,
  and a non-uniform scale combined with a rotation shears the contents — the arrangement could not
  be reproduced.
- **A cluster over `-MaxClusterSize`.** Refused, never truncated: half an arrangement is not the
  arrangement.
- **A cluster where too many members tie for the anchor** — a symmetric ring of identical bollards
  does this. An arbitrary anchor would make the signature depend on the order actors happened to be
  read in, so the same ring in two maps would hash differently and the group would silently split.
  A silent split looks exactly like "no duplicates found", so it is refused loudly instead.
- **An occurrence whose actors cannot all be identified at the moment of replacement.** Left
  untouched in full rather than partly converted.
- **A destination package that already exists.** Skipped, never overwritten — it may be an earlier
  run's output that other maps already reference.

## 9. Undo

With `-Apply`, every actor about to be deleted is recorded — mesh, the material on each named slot,
and world transform — and the journal is **flushed to disk before the first map is saved**. A run
interrupted part way through saving is still reversible. If the journal cannot be written, the run
stops and no map is saved.

`-Revert` restores the recorded actors **first** and removes the Level Instance afterwards, so an
interrupted undo leaves a map holding both — visibly wrong and trivially corrected — rather than
neither.

⚠️ **What `-Revert` cannot do.** It restores what the journal recorded: mesh, named material slots
and transform. Properties it did not record, and any edit you made to the map after the conversion,
are not restored. The level assets that were created are not deleted by `-Revert`; after a
successful revert nothing references them and you can delete them by hand.

## 10. World Partition

Handled by the same commands with no special mode. Under World Partition each actor is its own
package, and those are gathered through the engine's own external-actor paths and the Asset
Registry. Every report prints levels offered against levels opened and actors seen, so you can see
the basis of every figure rather than having to trust it.

## 11. Scope of version 1.0

Converts **placed static mesh actors**. Actors of other classes are never gathered as candidates,
and are therefore never moved, altered or deleted.

## 12. Please use source control

Run `-Forge -Apply` on a clean working tree and read the diff before you commit it. This tool
deletes actors — that is what converting to a Level Instance means — and a version-control diff is
the one check that does not depend on the tool being right about itself.

---

## Support

Questions and bug reports through the marketplace support channel on the listing you bought from.

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved.
Unreal® and Unreal Engine® are trademarks of Epic Games, Inc. Not affiliated with or endorsed by
Epic Games, Inc.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
