# Material Sprawl Collapser — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Material Sprawl Collapser  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-09-03


---

# Material Sprawl Collapser

**Find base materials whose expression graphs are identical except for their textures and their
scalar/vector constants. Generate ONE master with those leaves promoted to parameters. Convert every
duplicate into an instance carrying its own original values. Repoint every referencing slot.**

Unreal Engine 5.8 · Editor plugin · headless commandlet · no runtime cost

---

## What it is for

A project accumulates near-identical base materials. Someone needs the crate in a different brown,
so they duplicate `M_Crate` and change one constant. Repeat that for two years across four artists
and a Datasmith pipeline and you have three hundred base materials that are, structurally, about
eleven materials.

Each one is a separate shader. Each one costs compile time, package size, memory and a slot in every
review.

**Unreal ships nothing that finds this.** Material Analyzer compares *instances that already share a
parent*, and only their static parameters — two separate base materials are never compared to each
other at all, and a project with no instances yet produces no output whatsoever. Size Map tells you
what an asset costs, not which assets are the same shape. Reference Viewer tells you what points at
what.

This compares **the expression graphs themselves**.

---

## The safety property, stated first because it is the reason to trust it

The dangerous failure here is not a crash. It is a **false merge**: two materials that were not
actually interchangeable get collapsed, and the game looks different on one prop, possibly unnoticed
for weeks.

So the predicate is built on one rule, and it has no exceptions:

> **EVERY AMBIGUITY RESOLVES TOWARD *NOT COLLAPSIBLE*.**

- An expression class the walker will not hash **withdraws the whole material** — it is not hashed as
  "some node".
- A property whose *type* the hasher cannot decompose withdraws the whole material.
- A cycle in the graph withdraws the material, because a graph that cannot be linearised is a graph
  the tool cannot claim to have compared.
- Anything that changes the shader **permutation** rather than a value — static switches, static
  bools, static component masks, material attribute layers — withdraws the material.
- Floats are hashed **by their exact IEEE-754 bits**, never by decimal formatting. Formatting rounds,
  and two materials differing below the printed precision would otherwise hash equal and be merged.

The asymmetry is deliberate. Missing a legitimate collapse costs you a smaller report. Merging two
materials that differed costs you a bug you will not find. Those are not comparable.

**The report tells you what it *nearly* collapsed and why.** "These 47 materials differ only in
`Node[7].Class`" is actionable. Silence is not.

---

## The two-stage scan, and why the report shows two numbers

Stage 1 buckets every material using **asset registry tags only — nothing is loaded.** Stage 2 loads
*only* the members of buckets with two or more entries and hashes their graphs properly.

That is why the report says **"examined 12,000, loaded 340"** rather than "scanned 12,000". The two
numbers are the evidence that the scan is not blanket-loading your project — loading ten thousand
materials to inspect a graph is a twenty-minute editor hang, and the gap between those two numbers is
how you can see it is not happening.

---

## Usage

```
UnrealEditor-Cmd.exe <YourProject.uproject> -run=MaterialCollapser [switches]
```

### Scope

| Switch | Meaning |
| --- | --- |
| `-Paths=/Game/A+/Game/B` | Content roots to scan. Default `/Game`. Separator is `+`, **not** a comma — a comma is legal inside a content path. |
| `-Exclude=Temp+Dev` | Substrings that exclude a package path, case-insensitively. |
| `-MaxLoads=N` | Cap on materials **loaded** in stage 2. `0` (default) means no cap. **A cap that bites is always stated in the report** — a truncated scan must never read like a clean project. |

### Output

| Switch | Meaning |
| --- | --- |
| `-Plan=<file.json>` | Where to write the plan. Default `Saved/MaterialCollapser/plan.json`. |
| `-Report=<file.html>` | Where to write the report. Default `Saved/MaterialCollapser/report.html`. |
| `-NoReport` | Skip the HTML report. |

### Apply

| Switch | Meaning |
| --- | --- |
| `-Apply` | Verify the plan against the project. **Writes nothing.** |
| `-Execute` | With `-Apply`, actually write. **Both switches are required.** |
| `-UsePlan=<file.json>` | Apply a plan from disk instead of the scan just performed. |
| `-MasterPath=/Game/X` | Where generated masters go. Default `/Game/Collapsed`. |
| `-InstancePrefix=MI_` | Prefix for generated instances. |
| `-MaxGroups=N` | Cap on groups processed. `0` (default) means no cap. |
| `-NoSave` | Do the work, leave the packages dirty and unsaved. |
| `-StopOnFirstFailure` | Halt at the first group that fails. |
| `-AllowStrictMaterialRefs` | Do **not** refuse a group whose member is held in a property declared `UMaterial`. Read the warning below first. |
| `-help` | Print this switch list and exit without scanning. `-h` and `-?` do the same. |

### CI

| Switch | Meaning |
| --- | --- |
| `-Budget=N` | **Exit 1 when more than N materials are collapsible.** |

`-Budget` is the point of the commandlet. Material sprawl is not a thing you fix once; it is a thing
that grows back. A budget in CI turns it into a number your team owns.

### Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Ok |
| `1` | **Over budget** — the run worked; your project exceeded the budget |
| `2` | Failed — the tool could not do its job |
| `3` | Bad arguments |

`1` and `2` are deliberately different. "Your project is over budget" and "the tool crashed" are
different mornings, and a CI job should be able to tell them apart.

---

## The recommended sequence

```
# 1. Look. Writes nothing.
UnrealEditor-Cmd.exe MyGame.uproject -run=MaterialCollapser -Paths=/Game -unattended

# 2. Read Saved/MaterialCollapser/report.html and decide.

# 3. Verify the plan against the live project. STILL writes nothing.
UnrealEditor-Cmd.exe MyGame.uproject -run=MaterialCollapser -Apply \
    -UsePlan=Saved/MaterialCollapser/plan.json -unattended

# 4. Commit your project to source control. Then, and only then:
UnrealEditor-Cmd.exe MyGame.uproject -run=MaterialCollapser -Apply -Execute \
    -UsePlan=Saved/MaterialCollapser/plan.json -unattended
```

> **The dry run is not a simulation.** It loads every member, re-hashes it against the plan, resolves
> the holes and inspects the referencers. It reports proven work. Only the writes are skipped.

---

## What the apply step does, in order

1. **Load every member and RE-HASH it.** A plan is a file, and a file goes stale. Someone edits a
   material after the scan and the plan is now a lie about the current assets — that group is
   refused, and counted as **refused**, not as a failure.
2. **Duplicate the elected template, then re-hash the duplicate** and require it to match. Duplication
   is engine code; this checks the engine agreed.
3. **Promote each hole to a parameter**, rewiring every pin that pointed at the old leaf. If any pin
   cannot be written, the group is abandoned — a *half*-rewired master compiles, opens, and renders
   wrongly on one channel, which is worse than one that plainly failed.
4. **Create one instance per member carrying THAT member's values** — never the template's.
5. **Check every referencer** for a strictly-`UMaterial` property before replacing anything.
6. **Replace the member with its instance.**

Steps 1, 2 and 5 exist only to refuse. That ratio is the design.

### ⚠️ `refused` and `failed` are different numbers, on purpose

A **refusal** is a guard doing its job and needs nothing from you. A **failure** is something going
wrong and does. The report and the log keep them apart, because merging them is how a buyer learns to
ignore both.

### ⚠️ Read this before using `-AllowStrictMaterialRefs`

Replacing a base material with an instance is safe for every slot typed `UMaterialInterface` — which
is what mesh slots, components and decals use. It is **not** safe for a property whose declared type
is `UMaterial`, because a material instance is not one. Unreal's own consolidation performs no type
checking here by design. That is why the guard is on by default, and why turning it off is a decision
rather than a convenience.

---

## The template is chosen deterministically

The member whose graph becomes the master is picked by **shortest object path, ties broken
lexicographically** — never "whichever the registry returned first". Registry order is not stable, and
a non-deterministic choice would make two scans of an unchanged project produce different plans,
which destroys the only guarantee a plan file has.

Master names are derived from the **group's graph hash**, not from any member's name, so no one
material appears to have been promoted over the others.

---

## Requirements and limits

- **Unreal Engine 5.8.** This is the only version the plugin has been built and verified against, and
  the `.uplugin` declares it. It is an editor-only plugin: there is no runtime module and no runtime
  cost.
- Version 1 walks material **expression graphs**. Material **function calls** are not walked, so a
  material that calls one is withdrawn rather than guessed at.
- This build promotes **2D texture samples** only. A group whose hole texture is not a `UTexture2D` is
  refused with that stated as the reason.

---

## Support

Questions, bug reports and feature requests: **https://csaf.itch.io**

Copyright (c) 2026 Core Systems Asset Factory. All Rights Reserved.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
