# Sound Cue Forge — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Sound Cue Forge  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-18


---

# Sound Cue Forge

Unreal Engine 5.8 editor plugin (Win64). Copyright (c) 2026 Core Systems Asset Factory.

Sound Cue Forge ports the **portable subset** of a Sound Cue library to MetaSound Sources, refuses every cue it cannot
port faithfully and names the node that stopped it, relinks the assets that played the old cues, and journals every
write so one command puts the project back. It is a commandlet: run it from a terminal or a CI job.

Install: copy the `SoundCueForge` folder into your project's `Plugins` folder and enable it (it needs the MetaSound
plugin, which ships with the engine and is enabled by default).

## 1. Audit (writes nothing)

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=SCF -Scope=+Game/Audio
```

Every Sound Cue under the folders you name is read and judged, one line per cue:

- **PORTABLE**: every node has a faithful MetaSound construction.
- **APPROXIMATED**: portable with a named difference you must accept. Two you will meet:
  - a Modulator's pitch range (the cue draws a pitch ratio, the MetaSound Wave Player takes a shift in semitones; the
    end points convert exactly, the distribution between them does not);
  - a Random node with **Randomize Without Replacement**, which is ON by default in Unreal. The cue plays every input
    once before any repeats; MetaSound's Random Get can avoid repeating at most the last half of its inputs, so in the
    port an input can come back sooner. Untick the option on the cue, or accept it with `-AcceptApproximated`.
- **REFUSED**: at least one node has no faithful MetaSound construction: Branch, Switch, Doppler, a random delay range,
  mono mixed with stereo, and any node outside the portable set above. The line names the node and why. A refused cue
  is never half-ported.

Each cue also shows how many packages reference it, read from the asset registry (nothing outside the cues and their
waves is loaded).

## 2. Port

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=SCF -Scope=+Game/Audio -Port
```

Builds `<Cue>_MS`, a MetaSound Source, beside every PORTABLE cue (add `-AcceptApproximated` to include APPROXIMATED
ones). Every built document is read back and compared with what was built (each node class counted, every connection)
before anything is saved, then the saved files are confirmed through the asset registry. Your cues and their
referencers are not touched. If any target name already exists, or any cue fails to build, the run refuses and writes nothing.

## 3. Relink

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=SCF -Scope=+Game/Audio -Relink
```

Points every referencer of a ported cue at its `<Cue>_MS`: Blueprint variable defaults, component properties (an Audio
Component's Sound), arrays, soft references, DataTable rows and Blueprint pin defaults. `-Port -Relink` does both in one
run. Before anything is written, every reference is checked against the type of the property or pin that holds it:

- a property or pin typed **Sound Cue** cannot hold a MetaSound Source, so it is refused by name;
- a read-only referencer file (not checked out of source control) is refused.

Any refusal refuses the whole run and nothing is written. After the rewrite the same type check runs again on the
result before saving; touched Blueprints are compiled once; the registry is rescanned and any package that still
references a ported cue is reported.

## 4. Undo

Every `-Port` and `-Relink` run prints a journal stamp. To put that run back:

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=SCF -Undo=<stamp>
```

Every changed package is restored byte for byte from the journal and every created MetaSound is deleted. The journal
lives in `Saved/SoundCueForge/Journal/<stamp>/` and stores package names, not machine paths, so it travels with the
project.

## 5. CI gate

`-FailOnCue` exits 5 while any Sound Cue in scope is still referenced, so new Sound Cues cannot creep back in during a
migration. It writes nothing and cannot be combined with `-Port` or `-Relink`.

## Report

Every run writes an HTML report to `Saved/SoundCueForge/Reports/SCF_<stamp>.html`: the totals, what blocks the
migration (each refusing node class with the number of cues it stops), every cue with its findings and, on a writing
run, what was built, what was relinked and the journal stamp. The report names content paths only, never a path on your
machine.

## Reference

Exit codes: 0 done, 2 bad arguments, 4 refused (nothing written), 5 a cue in scope is still referenced, 6 written but
not confirmed (a save, a rescan or a Blueprint compile disagreed; the journal can undo it), 7 undo failed.

The `+` in `-Scope=+Game/Audio` stands for the leading `/` (Git Bash rewrites a bare `/Game/...` argument). Separate
several folders with `+`: `-Scope=+Game/Audio+Game/UI`. `-Help` prints every switch; `-ExitOnFinish` requests engine
exit when the run ends.

Supported: Unreal Engine 5.8, Win64 editor. Only 5.8 has been built and tested.

Not in v1: relinking references held inside World Partition one-file-per-actor levels, and ports of cues that use
parameter-driven nodes (Branch, Switch and the rest stay Sound Cues). It does not play or listen to the result; it
proves the graph it built is the graph it meant to build.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
