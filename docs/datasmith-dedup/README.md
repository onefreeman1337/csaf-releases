# Duplicate Mesh Consolidator — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Duplicate Mesh Consolidator  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-08-21


---

# Duplicate Mesh Consolidator

**Finds StaticMesh assets that are genuinely interchangeable and merges them in one batch.**

Datasmith, Revit and CAD imports land thousands of geometrically identical meshes. Unreal's own
Consolidate Assets tool works, but it makes you pick two assets at a time — which is fine for four
duplicate materials and impossible for ten thousand meshes.

This finds the groups for you, proves each one, shows you a diff, and then merges them.

Requires **Unreal Engine 5.8**. Editor-only. No runtime cost, nothing shipped in your build.

---

## The 60-second version

```
UnrealEditor-Cmd.exe MyProject.uproject -run=MeshConsolidator -Path=/Game
```

That is a **dry run**. It writes three files and deletes nothing:

| File | What it is |
| --- | --- |
| `Saved/MeshConsolidator/report.html` | The diff. Open it in a browser — this is the one to read |
| `Saved/MeshConsolidator/plan.json` | The machine-readable plan `-Apply` will execute |
| `Saved/MeshConsolidator/report.json` | Same numbers, for CI |

Read the report. When you are happy with it:

```
UnrealEditor-Cmd.exe MyProject.uproject -run=MeshConsolidator -Apply
```

That consumes the plan you just reviewed. **It does not re-scan** — see *Why apply is a separate
step* below.

---

## What "identical" means here, exactly

This is the important part, so it is stated plainly rather than buried.

Two meshes are merged **only** when all of the following match:

- Every vertex position, normal, tangent, binormal sign, vertex colour and UV, **at every LOD**,
  compared as exact IEEE-754 bits
- Triangle list and winding order
- Number of LODs, and every LOD's build settings and reduction settings
- **Lightmap settings** — `SrcLightmapIndex`, `DstLightmapIndex`, `MinLightmapResolution`,
  `bGenerateLightmapUVs`, `LightMapCoordinateIndex`, `LightMapResolution`
- **Material slots, including their order** — two meshes with the same two materials in opposite
  slots are *not* the same mesh
- Nanite settings, `LODGroup`, distance-field settings, bounds extensions
- Collision: every primitive, its transform and dimensions, the trace flag and the collision profile
- Sockets: name, transform and tag

**The design rule is that every ambiguity resolves toward NOT identical.** If anything cannot be
read, the mesh is skipped rather than matched. That means the tool sometimes *misses* a redundant
mesh — and that is deliberate. A miss costs you disk space you already had. A bad merge costs you a
deliverable. Those are not comparable errors and this tool does not treat them as though they were.

There is **no fuzzy-match mode**, and there will not be one.

## ⚠️ What it will NOT do

**It never moves your actors.** Two meshes with congruent geometry sitting at different local-space
origins — common in Datasmith exports that bake world position into the mesh — are *not*
interchangeable: swapping one for the other moves the model. Merging them would require rewriting
actor transforms, and this tool does not touch actor transforms at all. Those meshes are reported as
separate and left alone.

**It does not merge across differing LODs, lightmap settings, material slot order, Nanite settings,
collision or sockets.** See the list above.

**It will not touch a mesh whose collision it cannot fully compare.** Level-set, skinned level-set,
ML level-set and skinned triangle-mesh collision are not decomposed by the predicate, so any mesh
carrying one is declared unhashable and skipped.

---

## Reading the report

**The two numbers at the top right matter most: *meshes examined* and *meshes loaded*.**

The scan runs in two stages. Stage one groups every static mesh in your project by its asset
registry tags and **loads nothing at all**. Only meshes that share a key with at least one other
mesh are opened and hashed. On a large import that means the tool opens a few hundred assets instead
of forty thousand — the difference between a scan and an editor hang.

Those two numbers are reported separately so you can see it happening. If they are ever equal on a
big project, something is wrong.

**Near misses** are the other section worth your time. When a set of meshes matched on every registry
tag and still did not merge, the report names **the exact field that separated them** — for example
*"these 400 meshes differ only in `LightMapResolution`"*. That is usually actionable: it often means
an import setting drifted between batches.

---

## Why apply is a separate step

`-Apply` reads the plan file produced by the scan. It does not compute its own targets.

That is deliberate. A person reads the report between the two commands, and an apply that
re-derived its own list would make that review decorative — you would be approving one thing and
executing another.

Two guards, and both are refusals rather than adaptations:

1. **Predicate version.** A plan written by a different version of the tool is refused outright,
   with both versions named. It is never reinterpreted.
2. **Re-verification.** Every mesh named in the plan — including the one being kept — is re-loaded
   and re-hashed at apply time, and must still match what the plan recorded. If an artist re-imported
   an asset between your scan and your apply, that group is **refused**, not adapted.

After each group the surviving asset is re-loaded and re-hashed again as a post-condition. If it
ever fails, the run stops.

The actual reference rewriting and deletion are performed by Unreal's own
`ObjectTools::ConsolidateObjects` — the same code path the editor's Consolidate Assets command uses.
This tool does not hand-roll deletion or reference fixup.

**Redirectors** are left behind by that operation, exactly as they are when you consolidate by hand.
Run *Fix Up Redirectors* on your content folder when you are ready.

---

## Options

| Option | Effect |
| --- | --- |
| `-Path=/Game/Imported` | Content root to scan. Repeatable. Defaults to `/Game` |
| `-Exclude=_Legacy` | Skip any asset whose object path contains this substring. Repeatable |
| `-Plan=<file.json>` | Where to write (scan) or read (`-Apply`) the plan |
| `-Report=<file.html>` | Where to write the diff report |
| `-Json=<file.json>` | Where to write the machine-readable report |
| `-Apply` | Execute the plan. Without it, nothing is ever deleted |
| `-MaxGroups=N` | Process at most N groups — try ten before trusting it with four thousand |
| `-StopOnFirstFailure` | Abort instead of skipping a group that fails verification |
| `-FailIfFound` | Exit non-zero if duplicates exist. For CI |

## CI

```
UnrealEditor-Cmd.exe MyProject.uproject -run=MeshConsolidator -Path=/Game -FailIfFound
```

Exit codes: `0` clean · `1` bad arguments or unreadable plan · `2` a post-condition failed ·
`3` duplicates found (`-FailIfFound` only).

---

## Before you run `-Apply` on a real project

1. **Commit or check in first.** This deletes assets. It is careful, but source control is cheaper
   than care.
2. **Read the report.** All of it, including the near misses.
3. **Try `-MaxGroups=10` first.** Confirm the result in the editor, then run the rest.
4. **Run Fix Up Redirectors afterwards.**

---

## Supported versions

**Unreal Engine 5.8 only.** The plugin was built and verified against 5.8 on the machine that
shipped it — packaging gate clean with zero warnings, and 17 automation tests green. No other engine
version is claimed, because no other engine version was run.

## Support

<https://csaf.itch.io>


---

# Duplicate Mesh Consolidator — Documentation

Unreal Engine **5.8**. Editor-only plugin. Nothing ships in your packaged build.

---

## 1. Install

1. Copy the `MeshConsolidator` folder into your project's `Plugins/` directory.
2. Restart the editor. The plugin is enabled by default.
3. Confirm it loaded: your log should contain no `Skipping load of 'MeshConsolidator'` line.
   *(Compiling is not loading. A plugin can build perfectly and still be refused at load if its
   declared engine version does not match — which is why this check is written down.)*

## 2. Scan (dry run)

```
UnrealEditor-Cmd.exe MyProject.uproject -run=MeshConsolidator -Path=/Game
```

Writes, under `Saved/MeshConsolidator/`:

- **`report.html`** — the diff. This is the one to read.
- **`plan.json`** — the exact list `-Apply` will execute.
- **`report.json`** — the same numbers for CI.

Nothing is modified. Every mesh in every reported group was genuinely loaded and hashed to produce
that page, so it describes work that happened rather than an intention.

## 3. Apply

```
UnrealEditor-Cmd.exe MyProject.uproject -run=MeshConsolidator -Apply
```

Reads `plan.json` and executes it. See §6 for why this is a separate command.

## 4. Options

| Option | Effect |
| --- | --- |
| `-Path=/Game/Imported` | Content root. Repeatable. Default `/Game` |
| `-Exclude=_Legacy` | Skip object paths containing this substring. Repeatable |
| `-Plan=<file>` | Plan location (written by scan, read by `-Apply`) |
| `-Report=<file>` | HTML report location |
| `-Json=<file>` | JSON report location |
| `-Apply` | Execute. Absent = dry run |
| `-MaxGroups=N` | Process at most N groups |
| `-StopOnFirstFailure` | Abort rather than skip a refused group |
| `-FailIfFound` | Exit 3 if any duplicates exist. For CI |

**Exit codes:** `0` clean · `1` bad arguments / unreadable plan · `2` post-condition failure ·
`3` duplicates found (`-FailIfFound`).

---

## 5. How the scan works, and why it is fast

**Stage 1 — asset registry only. Zero asset loads.**

Every static mesh is grouped by a key built from 14 asset-registry tags: `Triangles`, `Vertices`,
`UVChannels`, `Materials`, `ApproxSize`, `CollisionPrims`, `LODs`, `MinLOD`,
`SectionsWithCollision`, `DefaultCollision`, `CollisionComplexity`, `NaniteEnabled`,
`NaniteFallbackPercent`, `HasHiResMesh`.

These are published by the engine and cost nothing to read. **A mesh that is alone in its bucket
cannot be identical to anything, so it is never opened.**

Tags deliberately excluded: `EstTotalCompressedSize`, `EstNaniteCompressedSize`, `PhysicsSize`,
`BuildRequiredMemoryEstimate`, `DistanceFieldSize`, `NaniteTriangles`, `NaniteVertices`,
`QualityLevelMinLOD` — all estimates or derived-data-dependent, so two genuinely identical meshes
can legitimately differ on them.

**Stage 2 — exact content hash. Only bucket members are loaded.**

A SHA-1 over the mesh's *source* description (see §7). The report states **meshes examined** and
**meshes loaded** separately, so you can see the economy working. On a large import the second
number is typically a small fraction of the first.

## 6. Why `-Apply` is a separate command

Apply consumes the plan the scan produced. It does **not** compute its own targets.

A person reads the report between the two commands. An apply that re-derived its own list would
make that review decorative — you would approve one thing and execute another.

Two guards, both refusals rather than adaptations:

1. **Predicate version.** A plan written by a different version of this tool is refused, with both
   versions named. It is never reinterpreted, because a plan is a list of assets to delete and the
   meaning of "identical" may have changed between versions.
2. **Re-verification.** Every mesh named in a group — including the asset being *kept* — is
   re-loaded and re-hashed at apply time and must still match the recorded hash. If anything changed
   since the scan, that group is refused.

After each group, the surviving asset is re-loaded and re-hashed as a **post-condition**. A failure
stops the run.

Reference rewriting and deletion are performed by Unreal's own `ObjectTools::ConsolidateObjects` —
the same code path as the editor's *Consolidate Assets* command. This plugin does not hand-roll
deletion or reference fixup. **Redirectors are left behind** exactly as they are for a manual
consolidation; run *Fix Up Redirectors* afterwards.

---

## 7. The predicate, field by field

The hash is taken over the **source mesh description**, not the built render data. Render data is a
derived-data-dependent derivative that varies by platform and build settings, so hashing it would
give the same asset different answers on two machines — unacceptable for a tool that deletes files.

Hashed, per LOD, in LOD order:

- vertex / vertex-instance / triangle / polygon-group counts
- every vertex **position**, as exact IEEE-754 bits
- every vertex-instance normal, tangent, binormal sign and colour
- UV channel count and every UV in every channel
- the triangle list including **winding order**, and each triangle's polygon group
- each polygon group's imported material slot name
- the full `FMeshBuildSettings`, including `bGenerateLightmapUVs`, `MinLightmapResolution`,
  `SrcLightmapIndex`, `DstLightmapIndex`, `BuildScale3D`
- the full `FMeshReductionSettings`, and `ScreenSize`

Hashed once per asset:

- **material slots in slot order** — slot name, imported slot name, material path, overlay material
- `FMeshNaniteSettings` in full
- `LODGroup`, `LightMapCoordinateIndex`, `LightMapResolution`, `MinLOD`
- `bAllowCPUAccess`, `bSupportUniformlyDistributedSampling`, `bSupportPhysicalMaterialMasks`,
  `bGenerateMeshDistanceField`, `DistanceFieldSelfShadowBias`
- positive / negative bounds extensions, complex collision mesh
- **collision**: every sphere, box, sphyl, convex and tapered-capsule element with full transform
  and dimensions, plus trace flag, physics type, collision response and profile name
- **sockets**: name, relative location, rotation, scale and tag

**Not** hashed — the five deliberate exclusions:

| Excluded | Why |
| --- | --- |
| Asset name and package path | The identity being collapsed. `SM_Wall` and `SM_Wall_2` *must* match |
| Import source-file path | Two exports of the same object from different files are still the same object — the central Datasmith case |
| Thumbnail, asset user data, editor metadata | No render or gameplay effect |
| Derived-data size estimates | Machine-dependent |
| Package GUID | Unique by construction |

### Fail-closed rules

- A LOD with no readable mesh description makes the **whole mesh unhashable** — it is skipped, never
  matched.
- A missing registry tag yields **no stage 1 key**, so the mesh is skipped rather than grouped with
  other untagged meshes.
- A mesh carrying **level-set, skinned level-set, ML level-set or skinned triangle-mesh collision**
  is unhashable, because the predicate does not decompose those representations and will not compare
  what it cannot read.
- Floats are compared as **exact bits**. The only normalisation is folding `-0.0` to `+0.0`.

### Pivots — an explicit non-feature

Positions are hashed in **local space with no normalisation**. Two meshes with congruent geometry at
different local origins therefore hash differently and are never merged.

This is deliberate. Merging them would require rewriting actor transforms to compensate, and
rewriting a project's actor transforms is a categorically more dangerous operation than rewriting an
asset reference. **This tool never touches actor transforms.**

---

## 8. Near misses

When a set of meshes shares a stage 1 key but resolves into more than one content hash, the report
records a **near miss** naming the first field on which they diverged.

This exists because a scan that finds four groups in a 40,000-mesh project and says nothing else is
indistinguishable from a broken scan. *"400 meshes differ only in `DstLightmapIndex`"* is
actionable — it usually means an import setting drifted between batches.

---

## 9. Verification

Shipped after: packaging gate clean on UE 5.8 (`RunUAT BuildPlugin -Rocket`) with **0 errors and
0 warnings** over 11 compile and 2 link actions, and **17/17 automation tests** green, cross-checked
against the engine's own tally.

The test suite is mostly **negative controls**: pairs of meshes identical except for one attribute,
asserted to hash differently — and asserted to differ *on that attribute*, using the hasher's own
field trace. It also contains positive controls (meshes differing only in name and import metadata
must match) and a trace-coverage test asserting every documented field is actually fed into the hash.

The suite was proven to fire by deliberately removing one hashed field and observing it go red,
then restoring it. The packaging gate stayed green throughout that sabotage, which is precisely why
both are run.

## 10. Support

<https://csaf.itch.io>


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
