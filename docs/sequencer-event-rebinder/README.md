# Sequencer Event Rebinder — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Sequencer Event Rebinder  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-12


---

# Sequencer Event Rebinder

**Repair broken actor references across a whole tree of Level Sequences without opening one of them.**

Unreal Engine 5.8, Windows (Win64), editor plugin. Runs from a Content Browser context menu and as a
commandlet for CI. Without `-Apply` it is a preview and writes nothing to your project. Everything
`-Apply` writes is undone by one switch.

---

## The problem this exists for

An actor is renamed, a level is duplicated, a prop moves to a streaming sublevel - and every Level
Sequence that pointed at it now points at nothing. Unreal stores those references as absolute object
paths into a level, in more than one place, and only one of those places has a first-party repair.

`Fix Actor References` is a method on an **open** Sequencer instance
(`FSequencerUtilities::FixActorReferences`, `SequencerUtilities.h:414`), and `Rebind Possessable
References` is a UI command on that same open instance (`SequencerCommands.cpp:189`). There is no
headless path to either. On a cinematic of one master, four reels and forty-two shots, that is
forty-seven sequences to open, fix and save by hand.

And it repairs one of the stores. **Event Track key payloads keep their own actor reference**
(`FMovieSceneEventPayloadVariable`, `MovieSceneEvent.h:39`), the engine's possessable repair does not
touch them, and the documented workaround is to reset each keyframe by hand.

## What it repairs

Three payload stores, in one pass, across the whole tree:

| store | where it lives | repaired |
| --- | --- | --- |
| Possessable bindings | `FMovieSceneBindingReference.Locator`, actor fragment | yes |
| Event Track key payloads | `FMovieSceneEventPayloadVariable.ObjectValue` | yes, then the director is recompiled and the bytecode is read back |
| Dynamic Binding resolver payloads | `FMovieSceneDynamicBindingPayloadVariable.ObjectValue`, inside a binding's `UMovieSceneCustomBinding` | yes |
| Director Blueprint condition payloads | `FMovieSceneDirectorBlueprintConditionPayloadVariable` | **counted and reported, never rewritten** |

The fourth row is deliberate. Condition payloads are reported in the `conditionPayloads` count of
every report so you know they exist and how many, and this tool leaves them alone.

Dynamic Binding payloads live only inside a binding's custom-binding branch - the branch a
possessable walk skips - and are reached through `ULevelSequence::IterateDynamicBindings`
(`LevelSequence.h:109`, `WITH_EDITOR`).

## Install

1. Copy the `SequencerEventRebinder` folder into your project's `Plugins` folder.
2. Open the project. The plugin is enabled by default and builds itself on first open if your
   project is a C++ project. For a Blueprint-only project, add any C++ class once so the project can
   compile plugin source, or use a build of the plugin compiled against 5.8.
3. Confirm it loaded: `Edit > Plugins`, search "Sequencer Event Rebinder".

Engine version: **5.8.0 and later 5.8.x**. The `.uplugin` declares `"EngineVersion": "5.8.0"`, and
Unreal enforces that - it is not a label. This plugin has been built and run only on 5.8, so 5.8 is
the only version claimed.

## Run it from the editor

Right-click in the Content Browser:

- on one or more **Level Sequence** assets -> **Rebind Sequence Tree...**
- on a **folder** -> **Rebind Sequences in Folder...**

Both open the Sequencer Event Rebinder panel with those roots filled in. The panel scans, shows one
row per sequence with what it found, and does nothing to your project until you press Apply. Nothing
is loaded to build the menu - the entries are driven from asset data only.

Or open the same panel from the console (**`** in the editor), which does not depend on finding a
context menu:

```
SER.OpenPanel /Game/Cine
SER.OpenPanel /Game/Cine -Preview
```

Each argument is a content path or a Level Sequence object path; with no argument it opens on
`/Game`. Add `-Preview` to walk the tree straight away, which writes nothing and fills the panel in
with what it found. The commandlet below accepts `-Preview` too, where it is the explicit form of
leaving `-Apply` off. In a commandlet there is no Slate application and no window, so `SER.OpenPanel`
logs an error naming the headless entry point instead of opening anything.

## Run it from the command line

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=SequencerEventRebinder ^
    -Sequences=/Game/Cinematics ^
    -World=/Game/Maps/Stage ^
    -ReportFile=Saved/Rebind.html ^
    -unattended -nop4
```

Add `-Apply` to write the repairs. Without it the run is a preview.

`-run=SequencerEventRebinder` is the entry point: Unreal resolves `-run=<X>` to exactly the class
`<X>Commandlet`, so the switch and the class name are the same word.

### Switches

| switch | what it does |
| --- | --- |
| `-Sequences=<folder\|sequence>[,...]` | Roots of the tree. Subsequences and shots are followed. Required. |
| `-World=<level>` | The level the tree plays in. A reference is healthy only if it resolves there, counting the level's streaming sublevels. Default: the level each reference names. |
| `-LevelRedirect=<old>=<new>[,...]` | A level rename that no redirector recorded. |
| `-Apply` | Write the repairs, recompile each director, verify, save, journal. Takes no value. |
| `-Preview` | The explicit form of leaving `-Apply` off: walk, resolve and report, writing nothing. Refused alongside `-Apply`. |
| `-Undo=<journal.json>` | Put back everything one `-Apply` run wrote. Takes no other switch. |
| `-ReportFile=<file.html>` | Report path. A `.json` twin is written beside it. |
| `-Help` / `-?` | Print the switch and exit-code reference. |

Two switch names are refused **by name**, with the reason, because the engine reads them before this
tool ever sees the command line: `-Report=` (anything ending `Port=` is read as a network port) and
`-Map=`. Use `-ReportFile=` and `-World=`.

### Exit codes

| code | name | meaning |
| --- | --- | --- |
| 0 | Clean | Every actor reference resolves. After `-Apply`: every repair was written, recompiled and verified. |
| 2 | Repairable | Preview only. Broken references were found and every one has a safe repair. Run again with `-Apply`. |
| 3 | NeedsReview | At least one reference was refused or has no candidate. A person must decide. |
| 4 | BadArguments | The command line was wrong. Nothing was read or written. |
| 5 | WriteFailed | A compile, verification or save failed. That sequence was rolled back in memory and not saved. |
| 6 | UndoRefused | `-Undo` refused a sequence because it no longer holds what the journal says was written. |
| 7 | NothingScanned | `-Sequences` matched no Level Sequence. An empty scan is never reported as clean. |

**1 is never this tool's.** The engine returns 1 for its own reasons, so a CI job reading 1 can never
mistake an engine failure for a verdict about your sequences.

One caveat about where this contract holds. **These codes are the commandlet's process exit code**,
and `-run=SequencerEventRebinder` is the entry point they are tested on. Drive the same work from
the editor console instead and you are on a different exit path: a non-forced exit request reaches
`FWindowsPlatformMisc::RequestExitWithStatus`, whose else branch is `PostQuitMessage(ReturnCode)`
(`Runtime/Core/Private/Windows/WindowsPlatformMisc.cpp:1520` in 5.8), so the verdict is handed to the
message loop rather than returned to your shell. Gate CI on the commandlet.

## The report, the journal and undo

Every run writes an HTML report and a JSON report of the same content. With no `-ReportFile` they go
to `Saved/SequencerEventRebinder/Rebind_<timestamp>.html` and `.json` inside your project.

An `-Apply` run also writes `Saved/SequencerEventRebinder/Journal_<timestamp>.json` and prints the
exact undo command for that run, which is:

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=SequencerEventRebinder ^
    -Undo="Saved/SequencerEventRebinder/Journal_<timestamp>.json" -unattended -nop4
```

`-Undo` checks each sequence still holds what the journal says was written before it puts anything
back. If it does not, that sequence is refused and reported, and the run exits 6 rather than
overwriting work done since.

## What it refuses to do

It never guesses between two actors. A reference is repaired only on a rule it can name:

- **redirected** - the level moved and the same actor is there;
- **relocated** - an actor with the same object name exists in exactly one level of the playback world;
- **matched by label** - exactly one actor in the playback world carries the label the binding was made against.

Everything else is refused and listed, with the candidates it saw:

- **ambiguous** - two or more actors qualify; both are named in the report;
- **wrong class** - the only candidates are the wrong class for the track or for the event pin they would feed;
- **unresolved** - no candidate at all, or the level could not be read.

An event payload repair is not trusted until the director recompiles and the compiled entry point is
read back. If the bytecode still carries the old path, the repair is rolled back rather than shipped
as a fix that was never live. If neither path appears, the report says `unconfirmed` instead of
claiming a verification it did not get.

## A measured run

The demo cinematic used to capture the store images: one master, four reels, forty-two shots, on a
level that was duplicated and renamed, with two actors moved to a streaming sublevel, one actor
relabelled, two actors sharing a label, and one stand-in of the wrong class.

| run | sequences | binding sites | payload sites | rebound | payloads repaired | verified | needs review | exit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `-Apply` | 47 | 129 | 63 | 126 | 62 | 62 | 3 sequences, 4 sites | 3 NeedsReview |
| after the 4 refusals were resolved by hand | 47 | 129 | 63 | 3 | 1 | 1 | 0 | 0 Clean |

The first run refuses **four references, in three sequences, from three causes**: one ambiguous
label shared by two actors (`Cam_Close`, 1 reference), one wrong-class stand-in (`Cam_Aux`, 1
reference), and a deleted actor nothing can resolve (`FX_Smoke`, 2 references). Those are the cases
this tool is built **not** to guess at.

That demo tree contains no Dynamic Binding payloads, so its `dynamicPayloadSites` count is 0. The
dynamic-payload path is covered by the plugin's automation tests, not by that run.

## Limits, stated plainly

- Windows (Win64) editor only. It is an editor plugin and builds for no runtime target.
- Unreal Engine 5.8 only - the one version it has been built and run against.
- Actor references only. It does not touch spawnables' templates, track values, or anything that is
  not an actor reference.
- Director Blueprint **condition** payloads are counted, not rewritten (see the table above).
- References inside sequences that are read-only on disk are reported and refused, never forced.

## Automation tests

The plugin ships its own automation tests. To run them:

```
UnrealEditor-Cmd.exe <YourProject>.uproject -ExecCmds="Automation RunTests CSAF.SequencerEventRebinder; Quit" -unattended -nop4 -nullrhi
```

## AI disclosure

This plugin's code and its store images were produced with AI assistance, by Core Systems Asset
Factory. Every engine API it calls was verified against the installed 5.8 source, and every number in
this document came from a run whose report is quoted above.

## Support

Support and updates: <https://csaf.itch.io>

Copyright (c) 2026 Core Systems Asset Factory. All rights reserved. Licence terms are in
`LICENSE.txt` beside this file.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
