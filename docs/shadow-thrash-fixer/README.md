# Shadow Thrash Fixer — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Shadow Thrash Fixer  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-23  
**Revised:** 2026-08-25 — added the first-time test walkthrough and the renderer/materials note


---

# Shadow Thrash Fixer

**Unreal Engine 5.8** · Windows · Editor plugin + headless commandlet
Core Systems Asset Factory

---

## First-time test (2 minutes)

> **Is this a command-line tool?** Yes. Shadow Thrash Fixer is a **headless commandlet**. It has
> **no editor panel, no toolbar button and no console command.** The dark interface you see in the
> store screenshots is not a window inside Unreal — it is the **proof sheet the tool writes**, a
> self-contained HTML file you open in any browser.
>
> That is deliberate. A tool that rewrites actors in a level you are going to ship has to run on a
> build machine, on a branch, and produce output a reviewer can diff. That is a commandlet, not a
> window somebody clicks once on a Friday.

**1. Install.** Copy the `ShadowThrashFixer` folder into your project's `Plugins` directory, so you
have `<YourProject>/Plugins/ShadowThrashFixer/`. Restart the editor and accept the rebuild prompt.
Confirm it is enabled in **Edit → Plugins → Editor → Shadow Thrash Fixer** — that checkbox is the
only place this product appears anywhere in the editor interface.

**2. Run the read-only scan.** Close the editor. Open a command prompt in your engine's
`Engine\Binaries\Win64` folder and run this, substituting your own project path:

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=STF -unattended -nopause -nosplash
```

It writes no levels and changes nothing, so it is safe to run against any project.

**3. Read what it printed.** Two lines near the end of the log name the files it just wrote:

```
Plan written: ...\YourProject\Saved\ShadowThrashFixer\plan.json
Proof sheet written: ...\YourProject\Saved\ShadowThrashFixer\report.html
```

**4. Open `report.html` in any browser.** That page is the interface in the screenshots. There is
nothing to open inside Unreal.

**5. Read a result in 60 seconds.** Every row is one actor that was Movable and casting a dynamic
shadow. The six marks are the six movement mechanisms the tool established were **absent**:

| column | what it means was absent |
| --- | --- |
| **MOV** | a movement component |
| **PHY** | simulated physics |
| **SEQ** | a Sequencer binding |
| **BP** | a Blueprint writing its transform |
| **ATT** | a movable parent |
| **PWN** | a pawn archetype |

All six must be filled before a single byte is written. Anything the tool could **not** establish is
listed separately as a **refusal**, naming the exact signal that was missing. **Read the refusals
first** — they are the part to judge this product on.

**6. When you want it to change the project**, add `-Apply` for a dry run that re-proves every actor
and still writes nothing, then `-Apply -Execute` to write, save and re-scan:

```
UnrealEditor-Cmd.exe "C:\Path\To\YourProject.uproject" -run=STF -Apply -Execute -unattended -nopause -nosplash
```

Run that on a clean source-control working tree and review the diff before committing. A version
control diff is the one check that does not depend on this plugin being correct about itself.

---

## The problem

A **Movable** actor that casts a **dynamic shadow** makes the renderer invalidate its cached shadow
page every time its transform changes. Virtual Shadow Maps are built on that cache, so every one of
these actors is a standing cost in your shadow budget.

Most of them never move. They were left Movable by an import default, or during a blockout, and
nobody went back. On a level built by more than one person over more than one month, nobody can say
which ones those are — and *guessing* is how you demote something that actually moves and spend two
days finding out why a door stopped opening.

## What this does

It finds every Movable dynamic-shadow caster, **proves** which of them cannot move, fixes the ones
it can prove, and then **re-scans to show the offending set is empty**.

It changes your project. That is the point of it.

## The part to judge it on: what it REFUSES

This tool edits actors in a level you are going to ship. The dangerous failure is not missing an
offender — that costs you nothing you were not already paying. It is **demoting an actor that
actually moves**, which is a visible bug in your game that you will not connect to this plugin for
days.

So every signal it reads is **three-valued**: *established yes*, *established no*, or **unknown**.
There is no boolean anywhere in the model, deliberately — a boolean cannot tell "I checked and it is
absent" apart from "I never checked", and code then reads a default as a decision.

**Anything it cannot prove, it refuses**, and the report names the exact signal it could not
establish. Before it will touch an actor it must establish that *all* of these are absent:

| Signal | What is checked |
| --- | --- |
| a movement component | any `UMovementComponent` on the actor or a child actor |
| simulated physics | the authored `bSimulatePhysics` flag, on the actor or a child actor |
| a Sequencer binding | every `LevelSequence` in the project is swept for a binding to it |
| a Blueprint writing its transform | `SetActorLocation`, `AddActorWorldOffset`, attach nodes and similar |
| a movable parent | attachment is walked up the chain |
| a pawn-like archetype | pawns and characters are meant to move |
| **a readable native class** | its C++ could move it in `Tick`, and we cannot see that |

That last row is why the plugin uses an **allow-list of native classes known to be inert**, never a
deny-list of classes known to move. A deny-list silently admits every class nobody thought of —
including every class in *your* project. If your class is not on the list you get a refusal naming
it, not a fix.

**A short refusal list is not the goal. An honest one is.**

## Which repair, and why you choose

Two repairs, and they are **not** equivalent:

- **Mark the shadow cache Static** *(the default)* — sets `Shadow Cache Invalidation Behavior` to
  `Static` on each primitive that casts a dynamic shadow. That is the engine's own switch for
  "suppress invalidations due to transform changes". It **does not** change Mobility, **does not**
  change whether anything casts a shadow, and **needs no lighting rebuild**.
- **Demote Mobility to Static** (`-Demote`) — the deeper fix. A Static actor participates in baked
  lighting, so on a map whose lighting has not been rebuilt it can look **worse** until you rebuild.

The plugin defaults to the narrow one and offers the demotion explicitly. **It will not silently
change your map's lighting.**

## Using it

Nothing is written without `-Execute`. `-Apply` on its own is a dry run that re-proves every actor
and reports what it *would* do, and `-Execute` without `-Apply` is refused rather than interpreted.

```
UnrealEditor-Cmd.exe <Project.uproject> -run=STF [switches]

  -Paths=/Game/A+/Game/B  Limit the scan to these content paths. Default: /Game
  -Plan=<file>            Where to write the plan JSON.  Default: Saved/ShadowThrashFixer/plan.json
  -Report=<file>          Where to write the proof sheet. Default: Saved/ShadowThrashFixer/report.html
  -Apply                  Re-prove every planned actor. Writes nothing without -Execute.
  -Execute                With -Apply, actually write and save. Destructive.
  -Demote                 Demote Mobility to Static instead of marking the shadow cache static.
                          Deeper, and it needs a lighting rebuild.
  -Budget=N               Fail (exit 1) when more than N actors are provably still and unfixed.
                          This is the CI gate.
  -help                   This text.

Exit codes: 0 ok · 1 over budget · 2 failed · 3 bad arguments.
```

For a step-by-step first run, see **First-time test** at the top of this document.

## The proving re-scan

After an `-Apply -Execute` pass the plugin runs a **second, independent scan** and reports the
result of that rather than its own count of successful edits.

This is not decoration. The fix pass's own success count is a *claim*; the re-scan is the
*evidence*, and the two are capable of disagreeing. If they disagree, the report says so and tells
you plainly not to trust the applied count.

## CI

Every mode is reachable from the headless commandlet, so a build machine can fail on regression
without opening the editor. `-Budget=N` exits 1 when more than N actors are provably still and
unfixed, which is the number to hold at zero once you have cleared a level.

The plan is written as JSON beside the report, so a build step can read it without parsing HTML.

## Two things it does not claim

- **Per-actor invalidation counts.** The engine exposes shadow-cache counters in *aggregate* only.
  This plugin therefore reports which actors are *structurally* responsible; it does not invent a
  per-actor page count, and you should distrust any tool that shows you one.
- **Exhaustive Blueprint and Sequencer coverage.** The sweeps cover event and function graphs and
  level sequence bindings. They do not cover every possible indirection, and where coverage is
  partial **the report says so at the top**, before you read a single verdict.

## Compatibility

- **Unreal Engine 5.8**, Windows. This is the only engine the plugin has been built and verified
  against, and it is the only version claimed.
- Works on standard levels and on World Partition. Unloaded World Partition actors cannot be
  inspected, so they are reported as **unloaded** rather than clean — the report distinguishes the
  two.
- No third-party dependencies. Every module it links is an Epic engine module.
- **Renderer and materials.** This plugin ships **no materials, no meshes and no content assets of
  any kind** — it is C++ only, so it is renderer-agnostic and behaves identically under DirectX 12,
  DirectX 11 and Vulkan. If your project uses **Substrate**, note that Substrate itself requires
  **Default RHI = DirectX 12** in Project Settings; that is a requirement Epic places on your
  project, and this plugin neither introduces it nor changes your renderer settings.

## Installing

See **First-time test** at the top of this document — it is the two-minute version, and it is the
fastest way to see the tool work on your own project.

The full C++ source ships with the plugin, unminified, so you can read exactly what it does before
you let it write to a level.

## Support

Through the marketplace support channel for the store you purchased from.

---

Copyright (c) 2026 Core Systems Asset Factory. All Rights Reserved.
Unreal® and Unreal Engine® are trademarks of Epic Games, Inc. Not affiliated with or endorsed by
Epic Games, Inc.
