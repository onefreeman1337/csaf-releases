# Material Parameter Name Surgeon — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Material Parameter Name Surgeon  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-08


---

# Material Parameter Name Surgeon

**For Unreal Engine 5.8. Windows (Win64). Editor plugin, run as a commandlet.**

You renamed one parameter on a master material, `Glow` to `EmissiveBoost`. Every material instance followed: the
engine re-keys instance overrides by the parameter's expression GUID. Nothing else did. Every Blueprint *Set Scalar
Parameter Value* on a dynamic material instance, every *Get*, every *By Info* call and every mesh *On Materials* call
still passes `Glow`. They compile, they run, and the pickups stop glowing. Rename a **Material Parameter Collection**
parameter and it is louder but no better: every Blueprint that names the old one fails to compile, one at a time.

The parameter name is a plain `FName` on a pin. No reference connects it to the material, so neither *Find in
Blueprints* nor the reference viewer can tell which of the forty `Glow` nodes in your project drive **this** material
and which drive another material that also has a `Glow`.

Material Parameter Name Surgeon decides that from the assets, carries the calls that belong to the renamed parameter,
leaves the others alone **by name**, and refuses anything it cannot decide.

---

## What it does

1. **Finds every Blueprint call in your `-Scope` that names a material or collection parameter.** The functions come
   from the engine's reflection data, not a list: 60 in 5.8, on dynamic material instances, material instances,
   materials, collections, mesh components, landscapes and the editor's Material Editing Library. A name is read
   wherever a node holds it: the `Parameter Name` pin, a *Make MaterialParameterInfo* node feeding a *By Info* call, or
   a split *Parameter Info* pin. (A *Parameter Info* literal, which the Blueprint editor cannot author, is read and
   judged but never written: `-Apply` refuses until it is split.)
2. **Decides which material or collection each call drives, from the asset alone.** It follows the node's target to:
   - *Create Dynamic Material Instance* (its *Parent*), walked up the instance chain to the root material;
   - a component's *Create Dynamic Material Instance* or *Get Material* for a slot: the material in that slot of the
     construction-script component, inherited and overridden components included, or the explicit source material;
   - every slot of a mesh component, for the *On Materials* calls;
   - the *Collection* pin of a collection call, or the *Instance* argument of an editor-library call;
   - member variables this Blueprint (and its parents) assigns, Cast nodes and reroutes.
   Anything else is **not judged**, and the report says why.
3. **Knows which side of the rename you are on**, from the material or collection itself:
   - **not renamed yet** (`-From` is still a parameter): the preview is the blast radius. `-Apply` refuses.
   - **renamed** (`-To` is a parameter and `-From` is not): the preview lists every call still on the old name, and
     `-Apply` carries them.
4. **Refuses what one name cannot serve.** A *Make MaterialParameterInfo* node feeding a call on your material AND a
   call on another, or a mesh whose slots hold your material AND another material that has its own `Glow`: renaming
   would fix one and break the other, so `-Apply` refuses and names the call. `-AcceptUnresolved` never waives this.
5. **Applies all or nothing.** `-Apply` writes nothing and exits 4 while any of these holds: a Blueprint in scope could
   not be opened; a call on the old name has a target it cannot decide (pass `-AcceptUnresolved` to rewrite those too,
   after reading them in the report); a shared node or mixed mesh as above; a package it would write is **read-only**,
   the normal state of a file you have not checked out. Otherwise it copies every package it will change into a
   journal, compiles each touched Blueprint to record what was already broken, rewrites every name, compiles each
   again (never between two rewrites), saves, and **re-scans**. A Blueprint that compiled before and does not after
   makes the run exit 6; one that was already broken is named, and does not.
6. **Audits a whole folder in CI.** With no `-Material` or `-Collection`, every call is judged against whatever it
   really drives. `-FailOnMismatch` exits 5 while any call names a parameter its target does not have.
7. **Undoes byte for byte.** `-Undo=<stamp>` copies every journalled package back.

Every run writes an HTML report to `Saved/MaterialParameterNameSurgeon/Reports/`.

## Install

1. Copy the `MaterialParameterNameSurgeon` folder into your project's `Plugins` folder.
2. Open the project once and let the editor build the module. It is an **Editor** module: it never ships in a game.
3. Close the editor before running `-Apply` or `-Undo`.

## Quick start

The commandlet is `MPNS`. Content paths may be written `/Game/...` or `+Game/...` (the `+` form survives shells that
rewrite a leading slash, such as Git Bash).

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPNS -Help
```

**1. Audit a folder. Writes nothing.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPNS -Scope=+Game/Pickups
```

**2. Before you rename: the blast radius.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPNS ^
  -Material=+Game/FX/M_Pickup -Scope=+Game/Pickups -From=Glow -To=EmissiveBoost
```

**3. Rename the parameter in the material editor and save. Then preview again, and apply.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPNS ^
  -Material=+Game/FX/M_Pickup -Scope=+Game/Pickups -From=Glow -To=EmissiveBoost -Apply
```

It prints `Journal <stamp>`. Keep it. For a collection, use `-Collection=+Game/FX/MPC_World` instead of `-Material`.

**4. Prove it in a fresh process, and keep proving it in CI.**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPNS -Scope=+Game/Pickups -FailOnMismatch
```

**5. Changed your mind?**

```
UnrealEditor-Cmd.exe <YourProject>.uproject -run=MPNS -Undo=<stamp>
```

## Switches

| Switch | Meaning |
| --- | --- |
| `-Scope=<folder>[+<folder>...]` | The only folders whose Blueprints are opened or written. Required. A folder boundary, not a prefix: `/Game/FX` does not include `/Game/FXOld`. A scope holding no Blueprint exits 2, so a mistyped folder never reads as a clean project. |
| `-Material=<path>` | The material whose parameter was renamed. An instance names its root material. |
| `-Collection=<path>` | The Material Parameter Collection whose parameter was renamed. |
| `-From=<old>` `-To=<new>` | The rename, as a pair; needs `-Material` or `-Collection`. Names compare without case, as the renderer does. |
| `-Apply` | Rewrite every call on `-From` to `-To`. Writes nothing while anything is refused. |
| `-AcceptUnresolved` | With `-Apply`: also rewrite calls on `-From` whose target alone cannot be decided. Never a shared node, a mixed mesh or a layer parameter. |
| `-FailOnMismatch` | Exit 5 while any call in scope names a parameter its target does not have. |
| `-Undo=<stamp>` | Restore every package a run wrote from its journal. |
| `-Census` | List every function the tool recognises. |
| `-ExitOnFinish` | Ask the engine to exit when the run ends (only inside an editor session). |
| `-Help` | Print the switches and exit codes. |

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Done: audit or preview printed, rename confirmed, nothing to do, or undo complete. |
| 2 | Bad arguments, including a `-Scope` that holds no Blueprint. Nothing was written. |
| 4 | Refused. Nothing was written. |
| 5 | `-FailOnMismatch`: a call names a parameter its target does not have. |
| 6 | Written but not confirmed. `-Undo` restores every byte. |
| 7 | Undo failed. |

Codes 1 and 3 are never used by this tool: the engine uses them for its own failures and a crash.

## Limits, stated plainly

- **It does not rename the parameter.** Do that in the material or collection editor. This tool carries what the
  rename leaves behind, and tells you beforehand what that will be.
- **A name built at runtime is not judged.** A wired `Parameter Name`, or a *Parameter Info* built by anything but a
  *Make MaterialParameterInfo* node with a literal name, is listed and counted, never rewritten.
- **Layer and blend parameters are not renamed.** Their names live in material layer functions; such calls are listed.
- **A parameter defined inside a Material Function** belongs to every material that uses the function: run once per
  material.
- **A variable assigned outside the Blueprint** (by another Blueprint or C++) is not visible to it.
- **Blueprint assets are read; Level Blueprints inside maps, Sequencer tracks and UMG brushes are not** in this
  version.
- Verified on **Unreal Engine 5.8, Win64** only. No other engine version has been run.

## Support

<https://csaf.itch.io>

Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
