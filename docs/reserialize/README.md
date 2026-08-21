# Reserialize — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Reserialize  
**Engine:** Unity 6  
**Docs published:** 2026-08-21


---

# Reserialize

**Rename a serialized field, then prove the data actually moved — before you remove
`[FormerlySerializedAs]`.**

---

## The problem this solves

You rename a serialized field and add the attribute Unity documents for it:

```csharp
[FormerlySerializedAs("moveSpeed")]
public float speed = 5f;
```

Your project keeps working. Every value is still there. Everything looks migrated.

**Nothing has migrated.** `[FormerlySerializedAs]` is a *load-time fallback*. The old key is still
physically written in every scene, prefab and asset on disk, and Unity is quietly remapping it each
time the object loads. The data only moves when something forces those assets to be re-saved.

So the attribute becomes permanent scaffolding. Delete it — because it looks redundant, because your
IDE offers to, because the rename was two years ago — and every value that never re-saved is gone,
silently, with no error and no failed import.

**Reserialize closes that loop.** It finds every asset still holding an old key, force-reserializes
them so the data physically migrates, then **re-reads the YAML off disk** and proves, per asset,
that the old key is gone and the value survived. Only then does it tell you the attribute is safe to
remove.

---

## Why reading the object back is not evidence

This is the trap that makes the problem hard to see, and it is why this tool reads text rather than
objects.

If you load the asset and check the field, you get the right value **whether or not the migration
happened** — because that is precisely what the fallback does. A green result there proves the
fallback works. It says nothing about the bytes on disk.

The only honest source is the serialized text, so that is what Reserialize reads: before the
rewrite, and again after it.

---

## Prefab variants — where this actually bites

A prefab **variant** does not store an overridden field as a key. It stores an override row:

```yaml
m_Modifications:
- target: {fileID: 1234, guid: ..., type: 3}
  propertyPath: moveSpeed          # <- the OLD name, in a place a key search never looks
  value: 12
  objectReference: {fileID: 0}
```

A tool that greps for `  moveSpeed:` finds nothing in that file and reports it clean. Worse, a
variant's `PrefabInstance` document carries **no `m_Script` line at all**, so the obvious fast index
— "find assets referencing this script's GUID" — misses every variant in the project.

Reserialize indexes by **reference closure** instead: seed with the script GUID, take every asset
that references it, then every asset that references *those*, until nothing new appears. That
catches variants, variants of variants, nested prefabs, and any scene holding one of them. The
ledger tells you how many assets were reached this way, because that number is the difference
between a scan and a scan that missed something.

---

## Using it

**Window ▸ CSAF ▸ Reserialize**

1. **Scan project** — discovers every `[FormerlySerializedAs]` in your code and every asset still
   holding an old key. Read-only; nothing is written.
2. Review the ledger. Rows are grouped by rename, and anything unproven sorts to the top with a
   coloured edge.
3. **Migrate & prove** — rewrites the affected assets, then re-reads them and fills in the proof.
4. The banner turns green **only** when every row is proven. If it does not, the rows that stopped
   it are named, with the reason.
5. Now remove the attributes.

> **Commit or stash before step 3.** Reserialize rewrites asset files on disk. That is the point of
> it, and it is not undoable from the Edit menu. Every file it will touch is listed in the ledger
> before you press the button.

### Requirements

- Unity **6**. Built, compiled warnings-as-errors, and test-run on **6000.5.7f1** — that is the only
  version this release has actually been verified on, so it is the only one claimed. The code uses no
  API introduced after 2022.3 and is expected to compile on 2022.3 LTS, but expected is not measured.
- **Force Text** asset serialization
  (*Project Settings ▸ Editor ▸ Asset Serialization ▸ Mode*). A binary or mixed project cannot be
  read as YAML, and Reserialize reports that rather than passing it.

---

## Continuous integration

An un-migrated rename is invisible in a code review and invisible in a build. It becomes a bug the
day somebody deletes the attribute — which is exactly what a CI gate is for.

```bash
# Fails the build if any asset still holds a renamed field's old key. Read-only.
Unity.exe -batchmode -quit -projectPath . \
  -executeMethod CSAF.Reserialize.ReserializeCI.Verify \
  -reserializeReport artifacts/reserialize.json

# Migrates, then fails unless every row is proven.
Unity.exe -batchmode -quit -projectPath . \
  -executeMethod CSAF.Reserialize.ReserializeCI.Migrate \
  -reserializeReport artifacts/reserialize.json

# Exclude paths (comma-separated substrings) - e.g. the demo folder, which ships un-migrated on purpose.
Unity.exe -batchmode -quit -projectPath . \
  -executeMethod CSAF.Reserialize.ReserializeCI.Verify \
  -reserializeIgnore Assets/CSAF/Reserialize/Demo
```

Anything excluded is **logged with a count**. A gate that quietly narrows its own scope reads exactly
like a gate that found nothing wrong.

| Exit | Meaning |
| --- | --- |
| `0` | Clean |
| `1` | Work outstanding, or a row could not be proven |
| `2` | The project could not be analysed at all (binary serialization, unreadable assets) |

`2` is deliberately distinct from `0`. *"We could not measure"* must never share an exit code with
*"we measured and it was fine"*.

The JSON ledger leads with `safeToRemoveAttributes`, and carries the per-asset rows plus the counts
of what was actually examined — files indexed, closure rounds, assets reached only via the variant
closure. A verdict with no work behind it is not a verdict.

---

## What the ledger states, honestly

| State | Meaning |
| --- | --- |
| **PROVEN** | Old key gone, value present under the new key, and identical to the value read before the rewrite. The only state that authorises removing the attribute. |
| **AT RISK** | The old key is still on disk after the rewrite, the value changed, or no value was found under the new key. Do not remove the attribute; restore from version control if the value is missing. |
| **UNPROVEN** | The old key is gone, but the value is a shape this version does not compare verbatim (a deeply nested block). Honest amber — verify by hand. |
| **NO CHANGE** | Nothing to do for that asset. Reported rather than hidden. |

A run that finds **nothing** does not report success. "No asset needs migrating" and "the scan
reached nothing" look identical in a summary, and only one of them is good news — so the counts of
what was examined are always shown beside the verdict.

---

## Contents

```
Assets/CSAF/Reserialize/
  Editor/                          asmdef CSAF.Reserialize.Editor  (includePlatforms: Editor)
    CI/            batch-mode entry points for continuous integration
    Migrate/       plan -> act -> prove
    Model/         the ledger data model
    Report/        JSON export
    Scan/          rename discovery + the reference-closure asset index
    UI/            the migration ledger window
  Demo/                            asmdef CSAF.Reserialize.Demo    (runtime, demo scene only)
    ReserializeDemo.unity          the demo scene
    RenamedComponent.cs            the sample component the scene renames a field on
  Readme.md
```

Nine of the ten shipped scripts sit in a named, **Editor-constrained** assembly definition
(`CSAF.Reserialize.Editor`, `includePlatforms: ["Editor"]`), so the tool itself can never enter a
player build or add to your compile times. The tenth is `RenamedComponent.cs`, which has to be a
runtime `MonoBehaviour` for the demo scene to hold it, and lives in its own separate
`CSAF.Reserialize.Demo` assembly you can delete outright. Neither assembly declares a single
reference, so nothing is pulled into your project. No `Resources/` folder. Full C# source,
unminified.

---

## Support

Issues and questions: **csassetfactory@gmail.com**

Built by CSAF — Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
