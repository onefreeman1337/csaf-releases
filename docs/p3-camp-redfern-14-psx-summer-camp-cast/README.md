# Camp Redfern: 14 Animated PSX Summer Camp Cast — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Camp Redfern: 14 Animated PSX Summer Camp Cast  
**Engine:** Low-poly PSX-era 3D model packs (Blender 5.2.3 headless under Tools/blender + MPFB/MakeHuman, CC0 output): rigged, animated character packs of 12-14 bodies x 3 palette skins (40+ entities), 300-1,575 tris each, ONE 256 px RGB555 texture per skin, the CC0 Quaternius humanoid skeleton with its 45 CC0 clips, GLB per skin + FBX + OBJ + .blend, the shipped PSX shader; bodies are built from code and PAINTED by OpenAI over their own orthographic renders (Kernel/capture/image_gen.js --ref, ~$0.16 per character), projected back and baked (Kernel/poly3d/build_pack.js). PROVEN by Kernel/poly3d/psx_gate.js (sha256, GLB containers, PNG sizes, tri budgets, distinct skins, look sheets, pack law, --break-test) + fresh_install.js (blank Godot 4 import); the agent then LOOKS at every sheet and a fresh subagent on Fable reviews (operator 2026-10-23). Themes: everything the itch top-sellers shelf shows transacting, never one genre. Creatures and props open at Roadmap M1. See Wings/Poly3D/CLAUDE.md.  
**Store page:** https://csaf.itch.io/last-shift-psx-survivors  
**Docs published:** 2026-11-21


---

# Camp Redfern - 14 PSX Summer Camp Cast

Core Systems Asset Factory - low-poly PlayStation-era 3D character pack.

**14 characters x 3 palette skins = 42 entities · 45 animation clips + a reference T-pose on every character · one 256 x 256 px texture per skin · 1494-1498 triangles per character.**

Theme: summer camp horror: the counsellors, staff and one silent stranger of Camp Redfern, a fictional 1980s summer camp in the woods, for PlayStation era survival horror games.

## Characters

| name | folder | triangles | skins | clips |
| --- | --- | --- | --- | --- |
| Head counsellor | `cr_head_counsellor` | 1496 | 3 | 46 |
| Sports counsellor | `cr_sports_counsellor` | 1496 | 3 | 46 |
| Night counsellor | `cr_night_counsellor` | 1495 | 3 | 46 |
| The stranger | `cr_stranger` | 1497 | 3 | 46 |
| Lifeguard | `cr_lifeguard` | 1498 | 3 | 46 |
| Activities lead | `cr_activities_lead` | 1497 | 3 | 46 |
| Crafts counsellor | `cr_crafts_counsellor` | 1497 | 3 | 46 |
| Joker counsellor | `cr_joker_counsellor` | 1498 | 3 | 46 |
| Nature counsellor | `cr_nature_counsellor` | 1498 | 3 | 46 |
| Camp cook | `cr_cook` | 1496 | 3 | 46 |
| Camp nurse | `cr_nurse` | 1495 | 3 | 46 |
| Camp owner | `cr_camp_owner` | 1494 | 3 | 46 |
| Groundskeeper | `cr_groundskeeper` | 1495 | 3 | 46 |
| Park ranger | `cr_ranger` | 1498 | 3 | 46 |

## What is in each character's folder (`models/<id>/`)

- `<id>_skin0.glb` - mesh + skeleton + ALL 46 clips + the skin 0 texture embedded (Godot, Unity, Unreal, three.js, Blender).
- `<id>_skin1.glb`, `<id>_skin2.glb` - the same mesh + skeleton with the other skins embedded (no clips: play the clips from `_skin0`, or swap the texture).
- `<id>.fbx` - mesh + skeleton + clips (textures referenced from `textures/`).
- `<id>.obj` + `<id>.mtl` - the static mesh in rest pose.
- `textures/<id>_skinN.png` - 256 px, 15-bit (RGB555) quantised, meant for NEAREST filtering.
- `blender_source/<id>.blend` (top level, outside `models/`) - the Blender 5.2 source (rig, clips, material). Keep it out of a Godot project folder: Godot tries to import every .blend it sees.

## Engines

- **Godot 4**: drop `models/` and `shaders/godot_psx.gdshader` into the project; instance the `_skin0.glb`; put a ShaderMaterial with `godot_psx.gdshader` on the mesh and set `albedo` to the skin texture (or keep the imported material and set its texture filter to Nearest). The AnimationPlayer carries every clip. Godot's importer drops the `_Loop` suffix and marks those clips as looping (`Walk_Loop` plays as `Walk`, `Idle_Loop` as `Idle`); every other name is unchanged.
- **Unity 6**: import the FBX, set Rig > Animation Type to Humanoid (the skeleton is a standard humanoid), textures to Point filtering; or import the GLB with a glTF importer.
- **Unreal 5**: import the FBX with its animations; retarget with an IK Rig if you use the UE mannequin skeleton; set the texture to Nearest.
- **Blender**: open the .blend (skin 0 is packed inside it); every clip is an action in the file.

What we ran before release: Godot 4.7.2 (a blank project imported every GLB, the PSX shader compiled and drew on every character, the clips played) and Blender 5.2 (every FBX, OBJ and .blend re-opened, meshes, 53 bones and every clip counted). Unity and Unreal were NOT run; their notes above are the standard humanoid FBX route.

## Skeleton and clips

The rig is the open (CC0) Quaternius Universal humanoid skeleton (53 bones, Rigify-style `DEF-` names), a standard humanoid layout made for retargeting (retargeting to another skeleton was not tested here; in Godot and Blender the clips were played on this skeleton). Clips (46: 45 animations + `A_TPose`, the reference T-pose): A_TPose, Crouch_Fwd_Loop, Crouch_Idle_Loop, Dance_Loop, Death01, Driving_Loop, Fixing_Kneeling, Hit_Chest, Hit_Head, Idle_Loop, Idle_Talking_Loop, Idle_Torch_Loop, Interact, Jog_Fwd_Loop, Jump_Land, Jump_Loop, Jump_Start, PickUp_Table, Pistol_Aim_Down, Pistol_Aim_Neutral, Pistol_Aim_Up, Pistol_Idle_Loop, Pistol_Reload, Pistol_Shoot, Punch_Cross, Punch_Enter, Punch_Jab, Push_Loop, Roll, Roll_RM, Sitting_Enter, Sitting_Exit, Sitting_Idle_Loop, Sitting_Talking_Loop, Spell_Simple_Enter, Spell_Simple_Exit, Spell_Simple_Idle_Loop, Spell_Simple_Shoot, Sprint_Loop, Swim_Fwd_Loop, Swim_Idle_Loop, Sword_Attack, Sword_Attack_RM, Sword_Idle, Walk_Formal_Loop, Walk_Loop.

## Scale and style

Characters stand 1.83-1.98 m tall (Head counsellor 1.83 m, Sports counsellor 1.90 m, Night counsellor 1.83 m, The stranger 1.98 m, Lifeguard 1.83 m, Activities lead 1.83 m, Crafts counsellor 1.83 m, Joker counsellor 1.83 m, Nature counsellor 1.83 m, Camp cook 1.83 m, Camp nurse 1.83 m, Camp owner 1.83 m, Groundskeeper 1.83 m, Park ranger 1.83 m); the scale sits on the armature object, so the clips scale with it, Z-up in Blender / Y-up in glTF. The look is the mid-1990s console era: low triangle counts, hand-painted 256 px textures, no normal maps. Use nearest filtering and the PSX shader for the full effect (vertex snapping, affine texture warp, dithering, fog - every parameter is a slider).

## Licence

See LICENSE.txt: use in any number of commercial and non-commercial projects, no attribution required; no resale or redistribution of the files as assets. Every character here is AI-generated (see HOW THIS WAS MADE in LICENSE.txt).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
