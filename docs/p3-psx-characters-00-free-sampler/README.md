# PSX Characters Sampler (free) — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** PSX Characters Sampler (free)  
**Engine:** Low-poly PSX-era 3D model packs (Blender 5.2.3 headless under Tools/blender + MPFB/MakeHuman, CC0 output): rigged, animated character packs of 12-14 bodies x 3 palette skins (40+ entities), 300-1,575 tris each, ONE 256 px RGB555 texture per skin, the CC0 Quaternius humanoid skeleton with its 45 CC0 clips, GLB per skin + FBX + OBJ + .blend, the shipped PSX shader; bodies are built from code and PAINTED by OpenAI over their own orthographic renders (Kernel/capture/image_gen.js --ref, ~$0.16 per character), projected back and baked (Kernel/poly3d/build_pack.js). PROVEN by Kernel/poly3d/psx_gate.js (sha256, GLB containers, PNG sizes, tri budgets, distinct skins, look sheets, pack law, --break-test) + fresh_install.js (blank Godot 4 import); the agent then LOOKS at every sheet and a fresh subagent on Fable reviews (operator 2026-10-23). Themes: everything the itch top-sellers shelf shows transacting, never one genre. Creatures and props open at Roadmap M1. See Wings/Poly3D/CLAUDE.md.  
**Docs published:** 2026-10-31


---

# PSX Characters Sampler - 7 free low-poly characters

Core Systems Asset Factory - free sampler of our PlayStation-era 3D character packs.

**7 characters, 22 palette skins in total · 45 animation clips + a reference T-pose on every character · one 256 x 256 px texture per skin · 1495-1499 triangles per character.**

One character from each of our seven paid PSX character packs, with every file the full pack ships per character, free to use in commercial games. Each one is the same character that pack offers as its own free download.

## Characters

| name | folder | triangles | skins | clips (45 + T-pose) | from the pack |
| --- | --- | --- | --- | --- | --- |
| Mechanic | `surv_mechanic` | 1497 | 4 | 46 | [Last Shift](https://csaf.itch.io/last-shift-psx-survivors) (survival horror, 13 characters) |
| Knight | `iv_knight` | 1499 | 3 | 46 | [Ironvale](https://csaf.itch.io/ironvale-psx-fantasy-adventurers) (fantasy, 14 characters) |
| High priest | `cg_high_priest` | 1495 | 3 | 46 | [Hollow Congregation](https://csaf.itch.io/hollow-congregation-psx-cultists) (occult horror, 14 characters) |
| Rifleman | `fv_rifleman` | 1496 | 3 | 46 | [Fort Vale](https://csaf.itch.io/fort-vale-psx-soldiers) (modern military, 14 characters) |
| Innkeeper | `gh_innkeeper` | 1497 | 3 | 46 | [Greyhollow](https://csaf.itch.io/greyhollow-psx-townsfolk) (medieval townsfolk, 14 characters) |
| Station engineer | `ds_engineer` | 1499 | 3 | 46 | [Deep Station](https://csaf.itch.io/deep-station-psx-space-horror-crew) (sci-fi horror, 14 characters) |
| Plague doctor | `pg_plague_doctor` | 1496 | 3 | 46 | [Pale Hours](https://csaf.itch.io/pale-hours-psx-ghosts) (supernatural horror, 14 characters) |

## The full packs

- **Last Shift** - 13 characters x 4 skins = 52 entities, the night shift of a small town, 1998: survivors in work clothes, uniforms and street wear: https://csaf.itch.io/last-shift-psx-survivors
- **Ironvale** - 14 characters x 3 skins = 42 entities, a fantasy adventuring party: knights, rangers, mages, monks and sellswords: https://csaf.itch.io/ironvale-psx-fantasy-adventurers
- **Hollow Congregation** - 14 characters x 3 skins = 42 entities, a sinister rural cult: its priest, its faithful and the townsfolk it converted, 1998: https://csaf.itch.io/hollow-congregation-psx-cultists
- **Fort Vale** - 14 characters x 3 skins = 42 entities, a modern infantry company: a rifleman, a field officer, a combat medic, a special operator, a helicopter pilot, a sniper and more: https://csaf.itch.io/fort-vale-psx-soldiers
- **Greyhollow** - 14 characters x 3 skins = 42 entities, the working people of a walled medieval market town: smith, guard, innkeeper, priest, miller, merchant and more: https://csaf.itch.io/greyhollow-psx-townsfolk
- **Deep Station** - 14 characters x 3 skins = 42 entities, the crew of a deep space mining station gone wrong: engineer, captain, medic, security officer, android, pilot, two infected and more: https://csaf.itch.io/deep-station-psx-space-horror-crew
- **Pale Hours** - 14 characters x 3 skins = 42 entities, a cast of ghosts: a plague doctor, a drowned bride, a burned nun, a hanged man, a lost soldier and more: https://csaf.itch.io/pale-hours-psx-ghosts

Every pack uses the same skeleton, the same clip list and the same PSX shader as this sampler, so the characters here drop into the same scene as the full casts.

## What is in each character's folder (`models/<id>/`)

- `<id>_skin0.glb` - mesh + skeleton + ALL 46 clips + the skin 0 texture embedded (Godot, Unity, Unreal, three.js, Blender).
- `<id>_skin1.glb`, `<id>_skin2.glb` (the mechanic also has `_skin3`) - the same mesh + skeleton with the other skins embedded (no clips: play the clips from `_skin0`, or swap the texture).
- `<id>.fbx` - mesh + skeleton + clips (textures referenced from `textures/`).
- `<id>.obj` + `<id>.mtl` - the static mesh in rest pose.
- `textures/<id>_skinN.png` - 256 px, 15-bit (RGB555) quantised, meant for NEAREST filtering.

And at the top level, outside `models/`: `blender_source/<id>.blend` - the Blender 5.2 source (rig, clips, material). Keep it out of a Godot project folder: Godot tries to import every .blend it sees.

## Engines

- **Godot 4**: drop `models/` and `shaders/godot_psx.gdshader` into the project; instance the `_skin0.glb`; put a ShaderMaterial with `godot_psx.gdshader` on the mesh and set `albedo` to the skin texture (or keep the imported material and set its texture filter to Nearest). The AnimationPlayer carries every clip. Godot's importer drops the `_Loop` suffix and marks those clips as looping (`Walk_Loop` plays as `Walk`, `Idle_Loop` as `Idle`); every other name is unchanged.
- **Unity 6**: import the FBX, set Rig > Animation Type to Humanoid (the skeleton is a standard humanoid), textures to Point filtering; or import the GLB with a glTF importer.
- **Unreal 5**: import the FBX with its animations; retarget with an IK Rig if you use the UE mannequin skeleton; set the texture to Nearest.
- **Blender**: open the .blend (skin 0 is packed inside it); every clip is an action in the file.

What we ran before release: Godot 4.7.2 (a blank project imported every GLB, the PSX shader compiled and drew on every character, the clips played) and Blender 5.2 (every FBX, OBJ and .blend re-opened, meshes, 53 bones and every clip counted). Unity and Unreal were NOT run; their notes above are the standard humanoid FBX route.

## Skeleton and clips

The rig is the open (CC0) Quaternius Universal humanoid skeleton (53 bones, Rigify-style `DEF-` names), a standard humanoid layout made for retargeting (retargeting to another skeleton was not tested here; in Godot and Blender the clips were played on this skeleton). Clips (46: 45 animations + `A_TPose`, the reference T-pose): A_TPose, Crouch_Fwd_Loop, Crouch_Idle_Loop, Dance_Loop, Death01, Driving_Loop, Fixing_Kneeling, Hit_Chest, Hit_Head, Idle_Loop, Idle_Talking_Loop, Idle_Torch_Loop, Interact, Jog_Fwd_Loop, Jump_Land, Jump_Loop, Jump_Start, PickUp_Table, Pistol_Aim_Down, Pistol_Aim_Neutral, Pistol_Aim_Up, Pistol_Idle_Loop, Pistol_Reload, Pistol_Shoot, Punch_Cross, Punch_Enter, Punch_Jab, Push_Loop, Roll, Roll_RM, Sitting_Enter, Sitting_Exit, Sitting_Idle_Loop, Sitting_Talking_Loop, Spell_Simple_Enter, Spell_Simple_Exit, Spell_Simple_Idle_Loop, Spell_Simple_Shoot, Sprint_Loop, Swim_Fwd_Loop, Swim_Idle_Loop, Sword_Attack, Sword_Attack_RM, Sword_Idle, Walk_Formal_Loop, Walk_Loop.

## Scale and style

Characters stand about 1.8 m tall, Z-up in Blender / Y-up in glTF. The look is the mid-1990s console era: low triangle counts, hand-painted 256 px textures, no normal maps. Use nearest filtering and the PSX shader for the full effect (vertex snapping, affine texture warp, dithering, fog - every parameter is a slider).

## Licence

See LICENSE.txt: use in any number of commercial and non-commercial projects, no attribution required; no resale or redistribution of the files as assets. Every character here is AI-generated (see HOW THIS WAS MADE in LICENSE.txt).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
