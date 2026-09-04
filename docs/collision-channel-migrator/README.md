# Collision Channel Migrator — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Collision Channel Migrator  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-04


---

# Collision Channel Migrator

**For Unreal Engine 5.8. Windows. Editor-only.**

---

## 1. The problem, and why the half you check is the half that is fine

You add a custom collision channel. Or you delete one. Or you drag one up the list in
**Project Settings > Collision**.

Unreal now quietly disagrees with itself about your project, and it will not tell you.

Some of your collision data is stored by **name** and follows the channel wherever it goes:

| stored by name — safe | where |
| --- | --- |
| A body's collision **responses** — what it blocks, overlaps and ignores | `FCollisionResponse::ResponseArray`, a list of `{ FName Channel; ECollisionResponse Response }` |
| **Collision profiles** — `BlockAll`, `Pawn`, and every profile you have written | `FCollisionResponseTemplate::ObjectTypeName` and `CustomResponses` |
| Any body **using** a named profile | the profile is re-read on load and overwrites the body's own values |

The rest is stored as a **slot number**, with nothing in the asset recording what that number was
supposed to mean:

| stored by slot — breaks silently | where |
| --- | --- |
| A body's **object type** — the channel it *is* | `FBodyInstance::ObjectType`, a `TEnumAsByte<ECollisionChannel>` holding `ECC_GameTraceChannelN` |
| Blueprint **trace and object query pins** — `LineTraceByChannel`, `SphereOverlapActors`, all of them | a pin default of `TraceTypeQuery3` / `ObjectTypeQuery2` |

The name you chose — `Climbable` — lives only in `DefaultEngine.ini`. It is never written into the
asset. So when the table moves, a mesh that was `Climbable` is now whatever else landed on that
slot, and a trace node that searched for ledges is now searching for something else.

**This is why the forums argue about it.** Somebody reports that reordering channels broke their
project, somebody else replies that the order is purely visual, and both of them have tested it.
The second person tested responses. Responses are fine.

### What Epic does and does not do

Epic ships redirects for channel **renames** — `CollisionChannelRedirects` in your ini maps an old
name to a new one. Those work, and this tool does not duplicate them.

There is no such thing for a slot. Nothing anywhere maps an old index to a new one.

And when you delete a channel, the engine shows you this:

> *"If you delete this channel, all the objects that use this channel will be set to default. Would
> you like to continue?"*

That is not what happens. The Yes branch calls a nine-line function that removes one entry from a
config array, and then refreshes the settings window. **No asset is opened, scanned or written.**
Every object keeps the slot it stored, and that slot now means something else — or nothing at all.

---

## 2. The one thing to do before you touch a channel

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=CollisionChannelMigrator -Snapshot -unattended -nosplash
```

That records the channel table as it is right now. It is a small JSON file under
`Saved/CollisionChannelMigrator/`. **Commit it.**

Everything else this tool does well depends on that file existing, because it is the only record of
which name used to sit in which slot. Without it, nothing — not this tool, not you, not Epic — can
tell you what a stored `3` was supposed to mean.

Then change your channels however you like, and restart the editor as Unreal requires.

---

## 3. Then see what moved

```
... -run=CollisionChannelMigrator -Plan -unattended -nosplash
```

Writes an HTML sheet to `Saved/CollisionChannelMigrator/collision_channel_migrator.html` and
**changes nothing**. The top of the sheet draws your channel table before and after, with a line
from each name's old slot to its new one, and the body lists every reference that is not already
correct.

Read it. Then:

```
... -run=CollisionChannelMigrator -Apply -unattended -nosplash
```

which rewrites and saves.

---

## 4. Every switch

| switch | what it does |
| --- | --- |
| `-Snapshot` | Record the channel table as it is now. |
| `-Plan` | Compare the snapshot with the live table, scan, write the report. Changes nothing. |
| `-Apply` | Everything `-Plan` does, then rewrite and save. |
| `-Audit` | Find references to slots that hold no channel. **Needs no snapshot.** |
| `-Revert=<file>` | Replay a journal backwards. |
| `-Help`, `-?` | The switch table. |
| `-Paths=/Game/A+/Game/B` | Content roots to scan. Default `/Game`. Roots may be separated by `+` or by `,` — both are accepted. |
| `-Table=<file>` | Snapshot file. Default `Saved/CollisionChannelMigrator/channels.snapshot.json`. |
| `-Report=<file>` | HTML report path. |
| `-Journal=<file>` | Journal path for `-Apply`. |
| `-SkipPins` | Do not scan Blueprint graph pins. |
| `-SkipMaps` | Do not scan placed actors in maps. |
| `-ExitOnFinish` | Quit the editor when the command finishes. Required for any headless **console** run. |

### Exit codes

| code | meaning |
| --- | --- |
| 0 | Did what was asked, and everything rewritten verified. |
| 1 | The switches could not be understood. Nothing was read or written. |
| 2 | Ran, and found nothing to do. |
| 3 | Refused — a correct answer could not be produced. |
| 4 | Work was done and something is unresolved: a failed read-back, an orphan, or a refusal. |
| 5 | A file could not be read or written. Nothing was saved. |

### ⛔ Gate CI on the commandlet, not on the console command

```
UnrealEditor-Cmd.exe <Project>.uproject -run=CollisionChannelMigrator -Apply -unattended -nosplash
```

returns those codes as the **process** exit code.

The console form — `-ExecCmds="CollisionChannelMigrator.Run -Apply -ExitOnFinish"` — **cannot**.
On Windows a non-forced exit request becomes `PostQuitMessage`, and a headless editor does not carry
that out as the process's exit code, so the console path exits `0` whatever happened. This is the
engine's behaviour, not a choice this plugin makes, and it is why the code is also written into the
log where you can grep for it. The refusal text is printed either way.

---

## 5. What it will not do, and why each refusal is correct

**A body driven by a named collision profile is left alone.** The engine re-reads the profile on
every load and overwrites the body's stored object type from it, so that stored value is not live
data. Writing it would dirty the package and change nothing a player could observe — and worse,
setting an object type detaches a body from its profile, so "fixing" these would break them. The
report tells you how many were skipped and why.

**A channel that was deleted rather than moved is reported, never guessed at.** There is no correct
destination. Nothing in the asset records which channel was meant. Re-create the channel and run
again, or set those by hand — the report lists every one with its asset path and its location
inside that asset.

**A channel that changed kind — object to trace, or the reverse — has its Blueprint pins refused.**
The two query enums are different spaces. There is no value in the old pin's enum that means the
same thing.

**A pin whose stored default cannot be read is refused rather than rewritten.** If it is neither an
enumerator of its own enum nor a number, what it means cannot be established.

**Anything it cannot place is a refusal with a reason attached.** A wrong collision remap does not
crash. It ships a build where a bullet passes through a wall, and you find out from a player.

---

## 6. Undo

`-Apply` writes a journal **before the first package is saved**, so a run killed halfway through
saving is still fully revertible.

```
... -run=CollisionChannelMigrator -Revert=Saved/CollisionChannelMigrator/migration.journal.json
```

Every entry is restored to the value it held before the run and read back. An entry whose asset has
since been edited so the tool can no longer find that exact body or pin is **reported and skipped**,
not forced. A body already sitting at its pre-migration value is reported as already correct, which
is what you get from reverting twice or from a partially saved run.

---

## 7. `-Apply` is one-shot per channel change, by design

The remap is a function of the value it finds. Two channels that swapped slots produce a map that is
its own inverse — correct the first time, and silently undoing itself the second.

So a successful `-Apply` **rewrites your snapshot to the current table**, because your assets now
encode that table. A second `-Apply` then correctly finds nothing to do. If the snapshot could not
be refreshed the tool says so and tells you to re-run `-Snapshot` before any further `-Apply`.

Take a fresh `-Snapshot` before your next channel change.

---

## 8. If the damage is already done

If you changed channels without a snapshot, `-Plan` cannot help you: the information it needs was
never recorded.

`-Audit` still can. It needs no snapshot and finds every reference to a slot that holds no channel
at all — the shape behind the engine's own *"Custom Channel Name has not been found"* warning, and
the usual residue of a deleted channel or of marketplace content built against a different table.
It reports; it does not rewrite, because a slot with no channel has no correct destination.

---

## 9. What it looks at

- `UStaticMesh` — the body setup's default instance
- `UPhysicsAsset` — each skeletal body setup
- `UBlueprint` — component templates in the construction script, and graph pin defaults typed as
  `ETraceTypeQuery` or `EObjectTypeQuery`, including pins on `MakeArray` nodes feeding an
  "object types" array
- Maps — primitive components on placed actors

**Known limit, stated rather than discovered:** on a **World Partition** map, only actors present in
the persistent level are reached. Streamed cells are not loaded by a commandlet, so their actors are
not scanned. Most collision configuration lives on the source assets and Blueprints above, which are
scanned in full — but if you configure object types on placed actors in a partitioned map, check
those by hand.

Collision responses are never touched anywhere. Neither are profiles. They do not need it.

---

## 10. Install

Copy the `CollisionChannelMigrator` folder into your project's `Plugins/` directory and restart the
editor. It appears under **Edit > Plugins > Editor**. It adds no runtime code and nothing ships in
your packaged game.

---

## 11. Support

Questions, bugs and feature requests: <https://csaf.itch.io>

---

*Collision Channel Migrator — Core Systems Asset Factory.*
*Built and verified against Unreal Engine 5.8. No other engine version is claimed, because no other
engine version was run.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
