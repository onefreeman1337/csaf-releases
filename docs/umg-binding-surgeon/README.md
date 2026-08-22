# UMG Binding Surgeon — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** UMG Binding Surgeon  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-22


---

# UMG Binding Surgeon

**Find every UMG binding that calls a Blueprint function every frame. Rewrite the ones that are
provably safe into native property reads — same value, no VM call. Refuse the rest BY NAME, with
the reason. Then re-scan and let the exit code trust the re-scan rather than its own tally.**

Unreal Engine 5.8 · Editor plugin · headless commandlet · no runtime cost · writes no runtime code

---

## What it is for

Epic's own *Optimization Guidelines for UMG*, verbatim:

> "When you bind attributes to fields in your UI, they poll the attribute every frame."
> "This is inefficient, so you should avoid using bound attributes."

That advice is correct and almost impossible to act on. Bindings accumulate one at a time, over
years, across everyone who ever touched the HUD. By the time somebody profiles the UI there are two
hundred of them and no way to tell which are expensive, which are safe to change, and which will
break something if you touch them.

**And not all bindings cost the same.** This is the fact the whole product is built on, and it is
not in the documentation — it is in the engine, in `UWidgetBlueprintGeneratedClass::BindDynamicDelegates`:

```cpp
if (Binding.SourcePath.IsValid())
{
    bSourcePathBound = Widget->AddBinding(DelegateProperty, UserWidget, Binding.SourcePath);
}
// If no native binder is found ... fallback to just attempting to bind to the function directly.
if (bSourcePathBound == false)
{
    ScriptDelegate->BindUFunction(UserWidget, Binding.FunctionName);
}
```

A binding **with** a source path is served by a native property binder: UMG reads the property
directly. A binding **without** one is served by `BindUFunction` — a **Blueprint VM call, per widget,
per property, per frame.**

A "Bind" you created by picking a function in the details panel is the second kind. This tool turns
the ones it can prove into the first kind.

---

## The safety property, stated first because it is the reason to trust it

The dangerous failure here is not a crash. It is a **wrong rewrite**: a binding stops producing the
value it used to, and nobody notices until a build, in a scene that only plays sometimes.

So the rule has no exceptions:

> **EVERY AMBIGUITY RESOLVES TOWARD NOT REWRITING.**

There is no branch in this tool that promotes a binding because nothing was found to object to.
A rewrite is granted by **three positive proofs**, all required:

**1 — Structural.** The bound function's graph must contain a function entry, a function result and
**exactly one variable read**, and nothing else. Any other node kind refuses the binding and the
report names the class it found.

*This is what makes the rewrite value-identical.* A graph that only reads `V` returns `V`, so a
path that reads `V` returns the same thing. A conversion, a cast, a function call or a maths node
would break that equality — and each of them is a node kind already refused.

**2 — Resolution.** The variable must be a real property on the compiled widget class, and the
widget must carry a bindable `<Property>Delegate`. A local variable inside the graph looks identical
to a member read at the node level and cannot be reached by a binding path; this is where that is
caught.

**3 — The engine's own verdict.** `FEditorPropertyPath::Validate` is called **before** anything is
written. That is the same check UMG's compiler runs, and it does more than confirm legality: it asks
`UWidget::FindBinderClassForDestination` for the native binder that serves the delegate's return
type, fails if there is none, and then requires that the binder supports the source property as
well. **The same lookup the runtime performs.**

So a rewrite that clears proof 3 is not merely permitted — the native path is **proven to engage**.

### And it is fail-safe even if all three were somehow wrong

**The original function name is never cleared.** UMG carries it through for property-kind bindings
too, and falls back to it whenever the native binder cannot be generated. So the worst case of a
rewrite this tool got wrong is **the behaviour you already had** — not a dead binding.

That is deliberate, and it is why the patch looks slightly untidy if you inspect it. Clearing the
function name to make it look clean would convert a fail-safe into a fail-silent.

---

## What it refuses, and why that is the feature

Every binding it will not touch is reported **by name, with what was actually found in your asset**:

| refusal | what it means |
| --- | --- |
| `FunctionNotPureRead` | the graph contains nodes this tool cannot prove are side-effect free — **it names them** |
| `FunctionReadsMultipleVariables` | more than one source, so no single read reproduces the value |
| `FunctionReadsNothing` | the function computes rather than reads; there is nothing to bind a path to |
| `SourcePropertyNotFound` | the graph reads a local variable, which no binding path can reach |
| `FunctionGraphNotFound` | the bound function is native or inherited from a parent widget |
| `DrivenByAnimation` | an animation also drives this widget, and a rewrite could fight it for control |
| `PropertyPathCrossesObjects` | the path walks through another object whose change notification cannot be established |
| `TargetWidgetMissing` | the binding names a widget no longer in the tree |
| `DelegatePropertyNotFound` | it is an event binding, not a per-frame attribute binding — nothing to make cheaper |
| `PathRejectedByEngine` | **UMG itself said no**, and its own error text is printed verbatim |

`DrivenByAnimation` is deliberately coarse: it refuses every binding on a widget any animation
touches, rather than trying to work out which property a track drives. Over-refusing is the
direction this tool is allowed to be wrong in.

---

## Using it

Everything is a **dry run** unless you say otherwise, in every mode, every time.

```
UnrealEditor-Cmd.exe <Project.uproject> -run=UMGBindingSurgeon -Report=BindingMap.html
```

Scans, classifies, writes the map. Touches nothing.

```
UnrealEditor-Cmd.exe <Project.uproject> -run=UMGBindingSurgeon -Apply -Report=BindingMap.html
```

Rewrites what passed all three proofs, saves the packages, writes an undo manifest, **re-scans the
project**, and fails the run if the second look disagrees with the first.

```
UnrealEditor-Cmd.exe <Project.uproject> -run=UMGBindingSurgeon -Revert=manifest.json -Apply
```

Puts every rewrite back exactly, including the original `MemberGuid`.

### Switches

| switch | effect |
| --- | --- |
| `-Paths=/Game/UI+/Game/HUD` | restrict the scan. Default: the whole project |
| `-Budget=N` | exit 1 when more than N bindings call a Blueprint function every frame |
| `-Report=<file.html>` | write the Binding Cost Map |
| `-Apply` | actually write. Without it, nothing is written |
| `-Manifest=<file.json>` | where `-Apply` records its undo. Default `Saved/UMGBindingSurgeon/manifest.json` |
| `-Revert=<file.json>` | undo a manifest |
| `-LoadAll` | load every Widget Blueprint instead of trusting registry tags |
| `-Verbose` | print every binding with its tier and, when refused, its reason |

### Exit codes, because a CI job branches on them

`0` ok · `1` over budget · `2` the run failed · `3` bad arguments.

**1 and 2 are deliberately different.** "Your UI got more expensive this sprint" and "the tool fell
over" are different mornings.

---

## The CI gate

```
-Budget=N
```

fails the build when more than N bindings call a Blueprint function every frame.

**It counts Blueprint-call bindings, not total bindings, and that matters.** A native property
binding is still polled every frame — it just costs a property read instead of a VM entry. If the
budget counted the total, a project that ran this tool, accepted every rewrite and became measurably
cheaper would **score exactly the same**. A budget that cannot see the improvement it exists to
cause is not a budget.

Refused bindings *are* counted. They still call into the VM every frame, and the project full of
un-rewritable bindings is precisely the one that needs to know.

---

## The two-stage scan, and why the report shows two numbers

`UWidgetBlueprint` declares `PropertyBindings` as `AssetRegistrySearchable` — the engine's own
comment on it reads *"The total number of property bindings. Consider this as a performance
warning."*

So **stage 1 loads nothing at all.** A project-wide census of which widgets carry bindings comes
straight off the asset registry. Stage 2 then opens only the widgets that actually have some, in
cancellable chunks.

The report prints **examined** next to **loaded** for exactly one reason: if those two numbers ever
converge, the tool has regressed into loading your whole project, and you should be able to see
that rather than infer it from how long it took.

> ⛔ **A missing registry tag is NOT treated as a zero.** A Widget Blueprint with no tag is loaded
> anyway and counted separately. "The registry did not tell us" and "it has no bindings" are
> different facts, and only one of them is a clean bill of health. If every widget in your project
> lacks the tag — which happens after a migration, before a resave — the report says so out loud
> instead of quietly being fast and wrong.

---

## The Binding Cost Map

Every binding is drawn as its own mark, generated from a stable hash of `<Widget>.<Property>`.
No image files ship with this plugin; the whole page is generated SVG, so the volume of distinct
marks is the size of *your* project.

- **Ring count** is the binding's **structural cost class**, 1–4.
- **Colour** is its verdict.
- A refused binding gets one mark and **its reason in prose beside it**, never a before/after pair —
  nothing changed, and pretending otherwise would read as a rendering bug in the one place this tool
  most needs to look deliberate.

> ⚠️ **Cost class is STRUCTURAL, not a timing.** It is derived from the shape of the bound read — a
> direct property path is class 1; a Blueprint function's class rises with the node count of its
> graph. **Nothing in this report is profiled and no number here is milliseconds.** For real timings,
> use Unreal Insights. This tells you what kind of work is happening, not how long it took.

The page prints package paths and asset names only. It never contains a filesystem path.

---

## What this tool does NOT do

Stated plainly, because a tool that overstates its scope wastes your afternoon.

- **It does not remove polling.** A rewritten binding is still evaluated every frame. What goes away
  is the Blueprint function call. If you need the poll itself gone, you need an event-driven update,
  and that is a design change no tool can make safely on your behalf.
- **It does not wrap anything in an Invalidation Box.** A widget carrying a bound attribute is
  marked volatile and repaints every frame *inside* an invalidation panel — so wrapping a bound
  widget would remove nothing. Where an Invalidation Box genuinely helps is around the **static**
  parts of a busy tree, and the report says so per widget, with the numbers, as **advice**. Where to
  draw that line is a judgement about your UI, and it stays yours.
- **It does not touch your widget tree, your graphs, or any runtime code.** It edits binding records
  and nothing else.
- **It is not a profiler.** See the cost-class note above.

---

## Before you run `-Apply`

Run it on a clean source-control working tree and read the diff. The tool writes an undo manifest
and the revert is exact, but a version-control diff is the check that does not depend on this tool
being right about itself.

---

## Requirements

Unreal Engine **5.8**, Windows (Win64), editor builds only. The plugin declares `EngineVersion
5.8.0` and has been built and run against 5.8 on the developer's machine. **No other engine version
is claimed**, because no other engine version has been verified — `EngineVersion` in a `.uplugin`
does not describe compatibility, it enforces it, and a plugin claiming a version it was not built
against is refused at load with nothing but a line in the log.

---

Copyright (c) 2026 Core Systems Asset Factory. All Rights Reserved.

Unreal® and Unreal Engine® are trademarks or registered trademarks of Epic Games, Inc. in the
United States and elsewhere. This product is not affiliated with or endorsed by Epic Games, Inc.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
