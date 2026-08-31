# Niagara Bounds Solver — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Niagara Bounds Solver  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-31


---

# Niagara Bounds Solver

**Measure what your Niagara systems actually occupy, across their whole lifetime, and write it as
fixed bounds in one batch pass — with a report that shows you the old box against the measured one
before anything is saved.**

An editor plugin for Unreal Engine 5.8.

---

## 1. The bug it fixes

A Niagara system left on dynamic bounds is culled by its own bounding box. The effect vanishes the
moment its origin leaves the frame — an explosion that pops out of existence as the camera pans, a
trail that disappears when its spawner goes off screen. It usually survives the editor and shows up
in a packaged build or a playtest, which is the worst possible place to find it.

The engine gives you two things for this, and neither of them solves it:

- **A validator that checks presence, not correctness.** It tells you a system has *no* fixed
  bounds. If a system has bounds that are wrong — a box typed in by hand, or captured from a frame
  where the effect had barely started — it passes clean. That is the case that actually ships.
- **A per-asset button that samples one frame.** *Set Fixed Bounds* uses whatever is on screen at
  the instant you press it. For anything that moves, expands or arcs, one frame is not the shape of
  the effect. Press it before the first particle spawns, or after a burst has died, and it does
  nothing at all — silently.

There is no batch path, because computing a correct bound requires *simulating* the system, and
validation is static.

## 2. What this does instead

For every system in the project it:

1. plays the system headlessly, **one tick at a time**,
2. takes the **union** of the local bounds across every tick in which a particle was actually alive,
3. writes that union as `FixedBounds` on the system, with an optional pad,
4. pins any GPU emitter left on dynamic bounds, which the engine states outright is unsupported,
5. writes an HTML sheet drawing the old box against the measured one, **to a shared scale**, so
   "this was eight times too small" is something you can see rather than something you are told.

### The rule it will not break

**A system it cannot honestly simulate is reported as skipped and left exactly as it was.** No
particles at any tick, a lifetime that never ends inside the time cap, an instance that refuses to
start, a GPU system in a run with no RHI, **a system using a stateless (Lightweight) emitter** —
all are named in the report with the reason, and none of them gets a number invented for it.

That is not caution for its own sake. **A wrong bound is worse than an absent one**, because an
absent one is at least flagged by the engine's own validator, and a wrong one validates clean and
ships.

### ⚠️ Stateless (Lightweight) emitters are refused, on purpose

UE 5.5 added stateless emitters, and this version **does not measure them**. Any system with an
enabled stateless emitter is reported as `stateless-emitter-unsupported` and left untouched —
including a *mixed* system, because measuring only its standard emitters would produce a union that
omits the stateless ones, and an under-bound is the exact bug this tool exists to remove.

This is stated plainly because the alternative was worse. Before this was caught, such a system
returned the engine's default 200 cm cube as though it were a measured union, complete with a
growth factor — a confident wrong number, which is the one thing the tool promises never to
produce. If your library is mostly Lightweight emitters, this tool has little to do for it today,
and the report will tell you that instead of quietly writing defaults into your assets.

---

## 3. Install

1. Copy the `NiagaraBoundsSolver` folder into your project's `Plugins` folder.
2. Open the project. If it offers to rebuild, accept.
3. Confirm it loaded: **Edit → Plugins → Editor**, search for *Niagara Bounds Solver*.

Requires **Unreal Engine 5.8**, Windows, and the Niagara plugin enabled (it is on by default).

> **Only 5.8 is claimed, because only 5.8 was built and run.**

---

## 4. First run — it writes nothing

Nothing is written unless you pass `-Apply`. Start with a preview.

**From the editor.** Open the console with `` ` `` (backtick) and type:

```
NiagaraBounds.Solve
```

Then open the HTML sheet it names in the log, under `<YourProject>/Saved/NiagaraBoundsSolver/`.

**Headless, from the command line:**

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
  "C:\Path\To\YourProject.uproject" -unattended -nosplash ^
  -ExecCmds="NiagaraBounds.Solve -Apply -ExitOnFinish"
```

> ⛔ **Use `-ExitOnFinish`, never a trailing `,Quit`.** `Quit` is not an editor console command, so
> an editor started with `,Quit` does the work, writes the report, and then sits there holding the
> plugin binary. `-ExitOnFinish` ends the process *and* returns the exit code in section 7.

**As a commandlet**, for a build step:

```
UnrealEditor-Cmd.exe "YourProject.uproject" -run=NiagaraBoundsSolver -Path=/Game/Effects -Apply
```

> ⚠️ **The commandlet cannot measure GPU systems, and it says so rather than guessing.** Reading GPU
> particle counts back needs a live RHI. Under a commandlet those systems are reported as skipped
> with `gpu-needs-editor-run` instead of being silently measured as empty. If your project has GPU
> effects, use the editor form above — `-unattended -nosplash` is still fully headless and works on
> a build agent.

---

## 5. Switches

| switch | meaning |
| --- | --- |
| `-Path=/Game/Effects` | Content path to scan. Default `/Game`. |
| `-Apply` | Write the measured bounds. Without it nothing is written. |
| `-Revert` | Restore the bounds recorded by the last `-Apply` run. |
| `-OnlyDynamic` | Skip systems that already carry fixed bounds. |
| `-TickDelta=0.0333` | Simulation step in seconds. Default 1/30. |
| `-MaxSeconds=10` | Cap on simulated time per system. Default 10. |
| `-Pad=0.05` | Fraction of the measured size added on every side. Default 0.05. |
| `-Report=<file.html>` | Where the sheet goes. |
| `-Journal=<file.json>` | Where the undo journal goes. |
| `-Help` | The switch list. |

---

## 6. Undo

Before the first asset is touched, an `-Apply` run writes a journal recording every system's
previous bounds. If a run dies part way through, the journal still covers what it changed.

```
NiagaraBounds.Solve -Revert
```

The journal has no timestamp in its name, deliberately: undo has to work without you having to find
out which file it was.

---

## 7. Exit codes

| code | meaning |
| --- | --- |
| 0 | Everything asked for was measured, and applied if `-Apply` was passed. |
| 1 | Bad or missing arguments. Nothing was scanned. |
| 2 | No Niagara system found under the path given. |
| 3 | One or more systems were refused, with a reason, and left untouched. |
| 4 | An asset could not be checked out or saved. |

> **An empty scan is code 2, not code 0.** A CI step that passes because it looked at nothing is a
> step that can never fail.

---

## 8. What it changes, precisely

On each solved system: `bFixedBounds` becomes true and `FixedBounds` becomes the measured union
(plus pad). On each **GPU** emitter that was still on `Dynamic`: `CalculateBoundsMode` becomes
`Fixed` and its `FixedBounds` is set to the same box, because the engine does not support dynamic
bounds on GPU emitters and leaving one would keep the asset failing the engine's own validation.

CPU emitters on `Dynamic` are left alone — once the system carries fixed bounds they are correct,
and changing them would be changing something you did not ask for.

Assets are checked out of source control before saving where source control is available.

---

## 9. Choosing a tick delta and a time cap

The default 1/30 and 10 seconds fit most one-shot effects. Two cases need thought:

- **Very fast bursts.** A burst that lives 3 frames can be stepped over by a coarse delta. Drop to
  `-TickDelta=0.0083` (1/120) for those.
- **Looping systems.** A looping system never completes, so it will hit the cap and be reported as
  `lifetime-exceeded-cap` — measured, but **not** written, because a union over a truncated window
  is not a lifetime union. Either raise `-MaxSeconds` past one full loop, or leave that system on
  dynamic bounds deliberately.

---

## 10. Support

CSAF — Core Systems Asset Factory · <https://csaf.itch.io>

AI disclosure: code and graphics are AI generated. See the store listing for the full statement.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
