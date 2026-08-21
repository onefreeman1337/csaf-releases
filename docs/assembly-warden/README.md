# Assembly Warden — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Assembly Warden  
**Engine:** Unity 6  
**Docs published:** 2026-08-21


---

# Assembly Warden

**Your `.asmdef` reference lists, written from the graph the compiler actually emitted.**

Assembly definitions decide what your project compiles, in what order, and what may know about what.
The reference lists inside them are maintained by hand, they only ever grow, and nothing in Unity
tells you when an entry stopped being needed — because a reference that is no longer used is not an
error, it is just a slower build and an architecture that quietly stopped meaning anything.

Assembly Warden reads what the **C# compiler emitted**, compares it against what your `.asmdef`
files **declare**, and rewrites them for you — safely, and only after proving the project still
compiles.

---

## What makes this different from guessing

Every free script in this space parses `using` directives. That is a guess: a `using` can be present
and unused, absent and satisfied by a fully-qualified name, or dragged in by a generic constraint you
never typed.

Assembly Warden does not parse your source to decide what is needed. It reads
`Assembly.GetReferencedAssemblies()` on the compiled assemblies loaded in the editor. Roslyn writes
an `AssemblyRef` row **only** for an assembly whose metadata the compiled code genuinely uses. That
is the compiler's own answer, not an inference from it.

---

## The part that matters most: it refuses to be sure when it should not be

An absent `AssemblyRef` is *not* proof that a reference is unnecessary. Two mechanisms make a
genuinely required reference emit nothing at all:

| Mechanism | What happens |
| --- | --- |
| **Const inlining** | If your assembly uses only a `const` from another, the compiler bakes the literal in and emits **no reference** — but the build still needs that assembly to resolve the constant. The same applies to some attribute and default-parameter usages. |
| **Conditional compilation** | A reference used only inside an inactive `#if` branch emits nothing on the platform you are on right now. Deleting it breaks your **other** build target, and no recompile on this machine can detect that. |

So every removal candidate is put through a second, independent channel — the assembly's own source
text, matched against the type and namespace names belonging to the referenced assembly — and
anything that channel touches is downgraded to **UNCERTAIN** and left alone. The tool fails toward
keeping a reference, always.

Three verdicts, and the reasoning for each is shown in the window:

- **REQUIRED** — the compiler emitted a reference to it.
- **REDUNDANT** — nothing in the compiled output *or* the source needs it. Safe to remove.
- **UNCERTAIN** — no emitted reference, but something suggests it may still be needed. Never removed
  automatically.
- **UNKNOWN** — the compiled output could not be read, so nothing is concluded.

---

## And it verifies the change rather than trusting it

`Preview changes` shows the exact removals; nothing is written. `Apply + verify`:

1. rewrites **only** the `references` array inside each `.asmdef`, leaving every other byte — key
   order, indentation, `versionDefines`, anything a future Unity version adds — exactly as it was, so
   your diff is reviewable;
2. recompiles the project for real;
3. if **anything** fails to compile, restores every touched file to its original bytes, automatically.

The backup lives in `SessionState`, so it survives the domain reload the change itself triggers. If
the editor is killed mid-apply, the next load finds the pending change and rolls it back.

---

## Layering rules — the half Unity cannot do for you

Unity already refuses cyclic assembly references and fails the compile, so cycles cannot exist in a
project that builds. **"The gameplay layer must never reference the UI layer" is different: it is a
decision, and nothing in the engine remembers it.**

`Assets > Create > CSAF > Assembly Warden > Layering Rules` creates a rule asset:

| Field | Meaning |
| --- | --- |
| `Id` | Short name shown in reports and CI output, e.g. `GAMEPLAY-NO-UI` |
| `From` | Assembly name pattern the rule applies from — `*` matches any run of characters |
| `To` | Assembly name pattern it must not reference |
| `Note` | Shown to whoever trips it. Say *why* |

Violations are reported for declared edges **and** for edges the compiler emitted that the `.asmdef`
never declared — the ones an audit of the files alone would miss.

---

## CI gate

```
Unity.exe -batchmode -quit -projectPath <project> \
          -executeMethod CSAF.AssemblyWarden.CI.WardenCI.Run \
          -wardenFailOn layering,redundant \
          -wardenReport artifacts/assembly-warden.json
```

| Exit code | Meaning |
| --- | --- |
| `0` | Clean against the `-wardenFailOn` set |
| `2` | A fail-on condition was met |
| `3` | The scan **refused** — the project does not compile, so the graph means nothing |

Three codes rather than two, because *"could not measure"* and *"measured, and it is bad"* are
different facts and a build log should never blur them.

`-wardenFailOn` accepts `layering`, `redundant` and `uncertain`, comma-separated. The JSON report
carries every verdict with its reasoning.

---

## Honest scope

- **This is not a "faster compiles" product.** Removing redundant references narrows the rebuild
  fan-out, and on some projects that is measurable — but the dominant cost in editor iteration is
  usually assembly *reload*, not compilation, and that is not what this changes. If your build gets
  faster, good. The reason to run it is a **correct, minimal, enforced** assembly graph.
- **Package `.asmdef` files are never rewritten.** They belong to their vendor and are often
  immutable. They can be included in the scan for a complete picture, and are excluded from every
  write.
- **The tool refuses to run on a project that does not compile.** The reference graph in that state
  describes assemblies that no longer match the source.
- **`Undo` does not apply.** These are text files, not `UnityEngine.Object`s, so Unity's undo stack
  cannot hold them. The backup-and-rollback path above is the mechanism instead, and it is stronger:
  it triggers on a failed compile whether or not anyone presses anything.

---

## Requirements

Unity 2022.3 or newer. Editor-only: nothing ships in your build. No third-party dependencies — in
particular it does **not** require Mono.Cecil, which is present in some projects only because Burst
or Collections happen to pull it in.

---

## Support

Open the window at `Window > CSAF > Assembly Warden`. Every verdict in the detail pane states its own
reasoning; if one looks wrong, that sentence is the thing to quote when you get in touch.

Copyright (c) 2026 Core Systems Asset Factory. See `LICENSE.txt`.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
