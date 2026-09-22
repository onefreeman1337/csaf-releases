# Statewright — Animator Controller Authoring Workspace — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Statewright — Animator Controller Authoring Workspace  
**Engine:** Unity 6  
**Docs published:** 2026-09-22


---

# Statewright — Animator Controller Authoring Workspace

**It edits the `.controller` asset your character actually runs on, then gets out of the way.**

Statewright is a docked editor workspace over an `AnimatorController`. It does the four authoring
jobs the Animator window has never supported: retune many transitions at once, build a layer of
states from a folder of clips, copy a whole sub-state machine into another controller, and rename a
parameter so that every reference moves with it.

It does not replace the Animator Controller and it does not ask you to adopt a new runtime. If you
are happy with Unity's state machine and only tired of the clicking, this is for you.

---

## Install

Import the package. Everything lands under `Assets/CSAF/Statewright/`, in three assembly
definitions (`Runtime`, `Editor`, `Demo`), with **no `Resources/` folder** and **no package
dependencies**. Unity **2022.3 or newer**; Built-In, URP and HDRP all work, because nothing here
touches a render pipeline.

The editor assembly is platform-constrained to the Editor, so none of it reaches a player build.

## Quick start (about five minutes)

1. **Open the demo.** `Assets/CSAF/Statewright/Demo/Scenes/StatewrightDemo.unity` — press Play. A
   character is driven through a locomotion blend tree, a nested Combat sub-state machine and Any
   State transitions, by `StatewrightDemo.controller`. The on-screen panel lists what to try.
2. **Open the window.** `Window ▸ CSAF ▸ Statewright`. Drag
   `Demo/Controllers/StatewrightDemo.controller` into the controller field at the top.
3. **Retune many transitions at once.** The **Transitions** tab lists every transition in the
   controller — per state, from Any State, and inside nested sub-state machines. Filter, press
   **All**, tick *Exit time* and *Duration*, press **Apply to N selected transition(s)**. It lands
   as **one** undo step: Ctrl+Z puts all of them back together.
4. **Build states from a folder of clips.** The **States from clips** tab: point it at
   `Assets/CSAF/Statewright/Demo/Clips`, press **Build states**. Eight clips become eight states on
   the chosen layer.
5. **Copy a graph.** The **Copy graph** tab: pick the `Combat` sub-state machine, pick a destination
   controller and layer, press **Copy**. States, nested machines, transitions, blend trees and state
   behaviours are deep-copied, and any parameter the copy needs is created on the destination with
   the source's type.
6. **Rename a parameter.** The **Rename** tab: rename `Speed` to `Locomotion` and watch the report —
   transition conditions, state speed/mirror/cycle-offset/time parameters and blend-tree blend
   parameters all move with it. Then scan your own `Assets` folder for C# call sites and apply that
   half separately, after reading the list.

---

## What each tab does, precisely

### Transitions — the bulk edit

`ControllerGraph.AllTransitions(controller)` walks **layers → states → transitions**, **Any State**
transitions and **nested sub-state machines, recursively**. Nesting is the half a hand-rolled script
usually skips, and on a large controller it is where most of the graph lives.

The bulk edit is a struct of nullable fields, so an untouched field is **left alone** rather than
stamped with a default:

| field | Animator inspector name |
| --- | --- |
| `HasExitTime` | Has Exit Time |
| `ExitTime` | Exit Time (normalized) |
| `HasFixedDuration` | Fixed Duration |
| `Duration` | Transition Duration |
| `Offset` | Transition Offset |
| `InterruptionSource` | Interruption Source |
| `OrderedInterruption` | Ordered Interruption |
| `CanTransitionToSelf` | Can Transition To Self (Any State transitions only) |

Two things about the write are deliberate. The whole batch is collapsed into **one named undo
step**, because forty `Undo.RecordObject` calls leave the user pressing Ctrl+Z forty times and that
reads as corruption. And the asset writes are bracketed by
`AssetDatabase.StartAssetEditing()` / `StopAssetEditing()` **in a `try`/`finally`**, so an exception
mid-batch cannot leave the AssetDatabase wedged in a paused import state for the rest of the
session.

```csharp
var edit = new TransitionBulkEdit { ExitTime = 0.8f, Duration = 0.1f, HasFixedDuration = true };
int changed = TransitionEditor.Apply(selection, edit, "Tighten attack transitions");
```

### States from clips

`StatesFromClips.FindClips(folder)` returns every `AnimationClip` under a project folder, **sorted
by name** so two runs on one folder produce the same layout. Clips **inside an FBX** are found
(they are sub-assets of the model), and Unity's hidden `__preview__` clips are skipped because they
are not content.

`StatesFromClips.Build(controller, layerIndex, folder, anyStateTrigger)` creates one state per clip
on the chosen layer, with the clip assigned as its motion, laid out on a grid **below** everything
already in the machine so new states never land on top of old ones. A clip whose name already has a
state on that layer is **skipped and counted** rather than duplicated — running it twice on one
folder is safe. If you give it a trigger name, it also creates an Any State
transition into each new state conditioned on that trigger, creating the trigger parameter if the
controller lacks it.

### Copy graph

`SubMachineCopy.Copy(source, destinationController, layerIndex, createMissingParameters, sourceController)`
deep-copies a state machine — a layer root or a nested machine — into another controller as a new
child machine. It copies:

- every `AnimatorState`, with motion, speed, cycle offset, mirror, foot IK, write-defaults and each
  of its parameter-driven overrides;
- every **nested** sub-state machine, recursively;
- state transitions, Any State transitions, entry transitions and state-machine transitions, with
  their conditions **rewired to the copied states**, never left pointing at the source;
- **blend trees**, including nested blend trees, recreated as new sub-assets rather than shared with
  the source (a shared blend tree means editing one character edits the other);
- `StateMachineBehaviour`s, instantiated per state.

Parameters the copy references and the destination lacks are either **created with the source's
type** or **reported by name**, your choice. It refuses, with a message, when the destination lives
inside the machine being copied — that walk grows as it is walked.

### Rename

`ParameterRename.Rename(controller, oldName, newName)` moves every reference inside the controller:

- **transition conditions** — the array is rebuilt and reassigned, because `AnimatorCondition` is a
  struct and mutating a copy in place changes nothing;
- **state** speed, mirror, cycle-offset and time parameters;
- **blend tree** `blendParameter`, `blendParameterY` and per-child `directBlendParameter`,
  **recursing into nested blend trees**.

It returns a `RenameReport` carrying the number of **conditions** rewritten and the number of
**parameter slots** moved (the blend-tree slots and the state speed/mirror/cycle-offset/time
parameters share that counter), so "it worked" is a number and not a feeling. It refuses a rename
onto a name that already exists, and names the refusal.

It rewrites references **inside the controller asset**. `StateMachineBehaviour` fields are out of
scope, and C# literals are the separate pass below.

The C# half is **separate, preview-first and opt-in**. `CallSiteRename.Find(name, folder, hits)`
scans `.cs` files and returns every hit; you read the list; `CallSiteRename.Apply(...)` rewrites
them. It matches **only a string literal in the argument position** of a parameter-name API:

`SetBool · SetTrigger · ResetTrigger · SetFloat · SetInteger · GetBool · GetFloat · GetInteger ·
StringToHash · IsParameterControlledByCurve`

A project-wide find-and-replace on the word is the thing this replaces: that also hits the state
called `Attack`, the tag called `Attack`, the prefab called `Attack` and the word "attack" in a
comment, and you find out which at run time. Hits inside a `//` comment are **found, shown, and not
rewritten** — a comment is not a call site, and a tool that quietly edits prose is a tool you have
to review line by line. Statewright's own source is always excluded from the scan, because its
documentation quotes those API names.

---

## The runtime half

`StatewrightParameter` is a small serializable struct you can use instead of a string literal:

```csharp
[SerializeField] private StatewrightParameter m_Speed = new StatewrightParameter("Speed");

void Update() => animator.SetFloat(m_Speed.Hash, speed);
```

It caches `Animator.StringToHash` lazily and **deliberately does not serialize the hash** — a cached
hash from a changed name is worse than no cache at all. Rename the parameter through the window and
the field moves with it; a `SetFloat("Speed")` literal would silently stop matching and the
character would stand still in a build with nothing logged.

It is optional. Nothing else in the package requires it.

---

## Honest limits

- **Undo covers the controller edits, not the C# rewrite.** Source files are written to disk. Run
  the scan, read the hits, and have your project under version control before you press Apply —
  that is why the two halves are separate buttons.
- **A rename is exact-match and case-sensitive**, in the controller and in C#.
- **The call-site scan reads `.cs` text.** A parameter name assembled at run time
  (`"Attack" + index`) is not a literal and will not be found. The scan tells you how many files it
  read, so a suspiciously small number is visible rather than silent.
- **Copying into the same controller is allowed**, and gives the copy a unique name rather than
  overwriting.
- **This is an editor tool.** Nothing in the Editor assembly ships in your player build; the only
  runtime code is the one struct above, and you can delete it.

## Support

Through the storefront you bought it from. The package ships its full, readable source — nothing is
obfuscated, minified or compiled away, and every public API carries XML documentation.

---

*Statewright · Core Systems Asset Factory · built and tested on Unity 6000.5.7f1, floor 2022.3.
Code and store imagery AI-assisted, declared on every storefront. No audio, no narrative content.*


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
