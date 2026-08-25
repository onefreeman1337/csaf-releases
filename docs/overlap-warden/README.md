# Overlap Warden — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Overlap Warden  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-25


---

# Overlap Warden

**Clears the `bGenerateOverlapEvents` flags that can never fire, then re-scans to prove it.**

Overlap generation costs broadphase work every time a component moves. The flag is left switched on
across whole levels because switching it off means knowing that nothing, anywhere, consumes the
overlap — and on a real project nobody can know that by inspection.

Overlap Warden proves it per component, and only where the proof needs no guesswork: it finds the
components where **Unreal itself could never dispatch an overlap**, clears the flag on those, saves
the packages, and then runs the whole scan a second time to show the offending set is empty.

Everything it cannot prove is **refused by name, with the reason**. That refusal list is not a
limitation you work around; it is the part of this tool that earns the right to run on a level you
have already shipped.

---

## Compatibility

| | |
| --- | --- |
| **Engine** | **Unreal Engine 5.8** — built and verified against 5.8, and nothing else |
| **Platform** | Windows (Win64) |
| **Module type** | Editor. Nothing ships into your runtime target |
| **Content** | None. No assets, no templates, no `.uasset` of any kind |
| **Third-party code** | None. Engine modules only |

⚠️ **5.8 is the only version claimed, deliberately.** It is the only engine the packaging gate was
run against, and a compatibility claim that outruns a build is not a claim worth reading. If you need
another version, ask before you buy rather than after.

---

## Install

1. Copy the `OverlapWarden` folder into your project's `Plugins/` directory
   (create `Plugins/` if it does not exist).
2. Regenerate project files and build, or just launch the editor and let it compile the plugin.
3. Confirm it loaded: **Edit → Plugins → Editor**, search "Overlap Warden".

There is no panel and no menu item. This is deliberate — see *Why a commandlet* below.

---

## Quick start

All three commands are run from a terminal, not from inside the editor.

```
REM 1. Look. Writes a plan and a proof sheet, touches no level.
UnrealEditor-Cmd.exe C:\Path\To\YourProject.uproject -run=OverlapWarden

REM 2. Dry run. Re-proves every planned component, still writes no level.
UnrealEditor-Cmd.exe C:\Path\To\YourProject.uproject -run=OverlapWarden -Apply

REM 3. Do it. Clears the flags, saves the packages, then RE-SCANS to prove it worked.
UnrealEditor-Cmd.exe C:\Path\To\YourProject.uproject -run=OverlapWarden -Apply -Execute
```

Step 1 writes two files under your project:

- `Saved/OverlapWarden/report.html` — the proof sheet. Open it first.
- `Saved/OverlapWarden/plan.json` — exactly what step 3 would do, as reviewable data.

**Run step 3 on a clean source-control working tree and read the diff.** A version-control diff is
the one check that does not depend on this tool being right about itself.

---

## The switches

| Switch | What it does |
| --- | --- |
| `-Paths=/Game/A+/Game/B` | Limit the scan to these content paths. Default `/Game`. Separator is `+`, because a comma is legal inside a content path |
| `-Plan=<file>` | Where to write the plan JSON. Default `Saved/OverlapWarden/plan.json` |
| `-Report=<file>` | Where to write the proof sheet. Default `Saved/OverlapWarden/report.html` |
| `-Apply` | Re-prove every planned component. **Writes nothing without `-Execute`** |
| `-Execute` | With `-Apply`, actually clear the flags and save. Destructive |
| `-Budget=N` | Exit 1 when more than N components are provably inert and still flagged. This is the CI gate |
| `-help` | The same text, from the tool itself |

⚠️ **`-Execute` without `-Apply` is refused, not interpreted.** You asked for something this tool does
not offer, and guessing which half you meant would be guessing about writes into a shipped level.

---

## Using it as a CI gate

```
UnrealEditor-Cmd.exe YourProject.uproject -run=OverlapWarden -Budget=0
```

| Exit code | Meaning | What a build should do |
| --- | --- | --- |
| **0** | Within budget | Pass |
| **1** | Over budget | Fail the build. **Your level regressed** |
| **2** | The tool could not do its job | Fail the build. **The tool broke** — do not go looking in the level |
| **3** | Bad arguments | Fix the command line |

**0 and 1 are not "success and failure".** A run that worked perfectly and found 900 inert flags
exits 1, and that is exactly what a CI job wants. Telling *"your level regressed"* apart from *"the
tool broke"* is the difference between two very different mornings, which is why they are different
codes.

After a successful `-Execute` the budget is measured against the **re-scan**, not against the
original scan — otherwise a build that had just been repaired would still fail.

---

## What it actually changes

On each component it has proven inert, it calls `SetGenerateOverlapEvents(false)`. **That is the
entire change.** It does not touch collision settings, collision responses, collision profiles,
mobility, visibility or anything else, and it adds and deletes nothing.

### What "proven inert" means

Unreal dispatches an overlap for a component only when **both** of these hold:

```
GetGenerateOverlapEvents()  &&  IsQueryCollisionEnabled()
```

Overlap Warden clears the flag only where **query collision is disabled**, so the engine could never
have raised an overlap for that component in the first place. The flag was pure bookkeeping cost with
no reachable behaviour behind it.

The proof sheet draws that conjunction per component as a two-link chain with the break marked, so
you can see *why* each one is inert rather than being told that it is.

### Why it refuses so much

**The overlap relation is bilateral.** Clearing the flag on component A does not merely stop A
notifying anyone — it also destroys the overlap events of every component B that overlaps A,
*including a B whose own flag is set and whose listener is live*.

That is why a per-component analysis of the form *"is anything bound to A's delegates?"* is unsound,
and why this tool acts only where **no pairing argument is needed at all**. Everything else is
refused by name with the signal that could not be established. A signal that was not measured is
never treated as an absent one.

### The one thing it does not claim

The safety argument above is about **behaviour the engine can reach**. It is not a claim that nothing
anywhere reads the flag as a *value*. A Blueprint or native class could legally branch on
`GetGenerateOverlapEvents()` and behave differently — reading it as a setting rather than reacting to
an event. On a component that cannot produce overlaps at all that branch is already dead logic, and
we consider the case pathological — but it is possible, and this tool will not claim to have excluded
something it did not measure.

---

## Coverage, stated rather than implied

The proof sheet declares everything the scan could **not** see, in the same weight as everything it
could:

- **World Partition / One File Per Actor maps.** Their actors are not present in the persistent level
  when a commandlet opens the map, so they cannot be judged. They are counted and named. A clean bill
  that silently excluded half a modern project would be a lie by omission.
- **Maps that would not load**, or held no world.
- **A scan that ran while the asset registry was still building.**
- **A scan that examined no maps at all** — reported loudly, because "passed having looked at
  nothing" is the failure mode a CI gate must never present as a clean result.

---

## Why a commandlet and not a panel

A tool that edits levels you have already shipped cannot be a button somebody clicks on a Friday. It
has to run in CI, on a branch, on a schedule, with output a reviewer can diff. That is a commandlet.

It is also why this plugin ships no Slate widgets at all: the packaging build then tests the whole
product rather than a panel.

---

## The plan file, and why it carries a version

`plan.json` is the preview you approve. It is stamped with the predicate version that produced it,
and the apply layer **refuses** a plan whose version does not match the build about to act on it —
because otherwise the set of components you agreed to and the set that gets written are two different
sets of edits to a shipped level, and nobody finds out until something stops firing.

Every component is also **re-proven at the moment of writing** rather than trusted from the plan.
Levels change between a scan and an apply, and on a team they certainly will.

---

## Support

Source ships raw and readable — no minification, no obfuscation, no compiled blobs. Read it, debug
it, extend it for your own internal use.

Questions and bug reports go through the marketplace support channel you bought through.

---

Copyright (c) 2026 Core Systems Asset Factory. All Rights Reserved.

Unreal® and Unreal Engine® are trademarks or registered trademarks of Epic Games, Inc. in the
United States and elsewhere. This product is not affiliated with or endorsed by Epic Games, Inc.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
