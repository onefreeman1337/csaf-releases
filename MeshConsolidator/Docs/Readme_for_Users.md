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
