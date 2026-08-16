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
