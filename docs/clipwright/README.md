# Clipwright — Animation Clip Workbench — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Clipwright — Animation Clip Workbench  
**Engine:** Unity 6  
**Docs published:** 2026-09-27


---

# Clipwright — Animation Clip Workbench

**Derive the clips you need from the clips you have: trim, retime, mirror, loop and clean — exact
curves, real `.anim` assets, a whole folder at a time.**

Clipwright is an editor window for `AnimationClip` assets. You select source clips (or folders of
them), stack the steps you want, watch the source curve and the result drawn over each other, and
press **Write**. Every result is a normal Unity clip beside its source. Nothing is added to your
scenes and nothing ships in your build.

---

## Install

Import the package. Everything lands under `Assets/CSAF/Clipwright/`, in two assembly definitions
(`CSAF.Clipwright.Editor`, Editor-only, and `CSAF.Clipwright.Demo`), with **no `Resources/`
folder** and **no package dependencies**. Built against Unity **6000.5**; the code avoids post-2022.3
API. Built-In, URP and HDRP all work — the tool never touches a render pipeline, and the demo
figures re-skin themselves with the active pipeline's Lit shader when you press Play.

## Quick start

1. **Open the demo.** `Assets/CSAF/Clipwright/Demo/Scenes/ClipwrightDemo.unity` and press **Play**.
   Seven figures play seven clips. The grey ones are the three sources; the teal ones are clips
   Clipwright derived from them: `Wave_R_Mirror`, `Stride_Loop`, `Stride_x1p5`, `Reach_R_Trim`.
2. **Open the window.** `Window ▸ CSAF ▸ Clipwright`.
3. **Pick sources.** Select `Demo/Clips/Wave_R` in the Project window (or the whole `Clips`
   folder) and press **Use Project selection**.
4. **Stack steps.** Tick **Mirror** and drag `Demo/Rig/Mannequin` into the Rig field. The preview
   draws the source curve in grey and the result in teal.
5. **Write.** Press **Write**. `Wave_R_Mirror.anim` appears beside the source. Press it again after
   changing a setting and the same asset is updated in place.

## The five steps

They run in this order, whichever are ticked.

| Step | What it does | Exact? |
| --- | --- | --- |
| **Trim** | Keeps a range of frames (in the clip's own sample rate) and moves it to start at zero. Events outside the range are dropped. | Yes — keys are cut ON the curve, with Unity's own value and the curve's analytic slope, so the kept range evaluates identically to the source. |
| **Retime** | Plays the clip faster or slower (0.1–4 in the window). Key times divide by the speed and tangents multiply by it, so the result at time t equals the source at t × speed. No key is added or removed. | Yes. |
| **Mirror** | Swaps left and right. See below. | Yes, for quaternion rotation and position curves. |
| **Loop seam** | Makes the last pose equal the first. The gap on each curve is blended in over the last N seconds with a smoothstep ramp; everything before that window is untouched. Quaternions are matched to the nearest sign, so a q / −q pair is never "fixed" by a full turn. Turns **Loop Time** on. | The pose matches exactly. The velocity at the seam is only matched when the source's already was; the report prints the largest remaining slope gap. |
| **Clean constants** | Any curve whose keys never change value is reduced to two keys. | Yes — evaluation is unchanged. Curves are never deleted, because a missing curve hands the property to another layer. |

## Mirroring generic rigs — how it works, and when it refuses

Generic rigs almost never share an axis convention between their left and right bones, so a mirror
written as "negate these two components" is only right for the rig it was written for. Clipwright
reads your **rig's rest pose** instead. For every bone it knows the rest frame of the bone and of
its parent, and re-expresses each rotation and position curve on the partner bone so the result is
the true reflection across the rig root's YZ plane (character facing +Z, sideways along X — Unity's
convention). The maps are linear in the curve components, so they apply to key values AND tangents:
no resampling.

The demo rig is built to prove this: its right-side bones point Z down the bone, its left-side bones
point X down the bone with an extra 37° twist. Posing the source on one copy and the mirror on
another puts every transform at the reflection of its partner.

**Partners are found by name**, whole tokens only: `Left`/`Right` (e.g. `mixamorig:LeftArm`), and
`L`/`R` as a suffix (`Arm_L`, `arm.l`), prefix (`L_Arm`) or infix (`Arm_L_01`). `Brightness` and
`Leftover` are not sides.

**Clipwright refuses a rig, with the reason, when:**

- no left/right pairs are found;
- the rest pose is not symmetric — a transform is more than 1% of the rig's size from its mirror
  image (put the rig in its bind pose and try again);
- a bone and its partner hang from parents that are not each other's mirror;
- two transforms share one path, so a clip could not address either unambiguously.

**Humanoid clips** are mirrored with Unity's own humanoid Mirror flag (Unity's muscle space is
symmetric by definition), so the derived clip is a separate asset that plays mirrored everywhere.

**Not reflected:** Euler rotation curves (recorded in the Animation window as
`localEulerAngles`) are moved to the partner bone but not reflected — the report counts them.
Scale, blend-shape, material and activation curves move to the partner path unchanged.

## Output

- Named by the pattern `{name}_{steps}` by default (`Wave_R_Mirror`, `Stride_x1p5`); `{name}` is the
  source clip's name and `{steps}` lists the enabled steps.
- Written beside each source, or into the folder you name (it must exist).
- **Never overwrites a source.** A pattern that resolves to the source is refused by name.
- **Re-running updates in place.** An existing derived clip keeps its GUID, so Animator states and
  Timeline clips pointing at it keep working, and that update is one Undo step.
- Tangents Clipwright computes are pinned as *Free*, so no later auto-tangent pass can move them.
- Weighted (Bezier-weight) keys cannot be split exactly; where a cut lands in a weighted segment the
  report says so and the slope there is a symmetric difference.

## Scripting

Everything the window does is public API in `CSAF.Clipwright.EditorTools`:

```csharp
var recipe = new ClipRecipe { Mirror = true, LoopSeam = true, LoopWindow = 0.25f };
var rig = MirrorRig.Read(characterRoot.transform);          // rig.Describe() explains a refusal
BatchResult result = ClipBatch.Run(ClipBatch.Collect(Selection.objects), recipe, rig);
Debug.Log(result);                                          // "Created 12, updated 0, refused 0."
```

`ClipOps.Trim`, `ClipOps.Retime`, `ClipOps.MatchLoopSeam`, `ClipOps.CollapseConstantCurves` and
`ClipMirror.Mirror` work on an in-memory `ClipSnapshot` and each returns an `OpReport` with counts.

## Performance and housekeeping

The preview is rebuilt only when a setting changes, never per repaint. Batch writes run inside
`AssetDatabase.StartAssetEditing()` / `StopAssetEditing()`. The window's settings live under the
EditorPrefs key `CSAF.Clipwright.Recipe`. No network calls.

## Support

Ask on the store page you bought it from. Full source is included and commented.

© 2026 Core Systems Asset Factory


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
