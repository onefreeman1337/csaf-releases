# Eight Angles - 14 Retro FPS Enemies as 8-Direction Billboard Sprites, with the PSX Models — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Eight Angles - 14 Retro FPS Enemies as 8-Direction Billboard Sprites, with the PSX Models  
**Engine:** Low-poly PSX-era 3D model packs (Blender 5.2.3 headless under Tools/blender + MPFB/MakeHuman, CC0 output): rigged, animated character packs of 12-14 bodies x 3 palette skins (40+ entities), 300-1,575 tris each, ONE 256 px RGB555 texture per skin, the CC0 Quaternius humanoid skeleton with its 45 CC0 clips, GLB per skin + FBX + OBJ + .blend, the shipped PSX shader; bodies are built from code and PAINTED by OpenAI over their own orthographic renders (Kernel/capture/image_gen.js --ref, ~$0.16 per character), projected back and baked (Kernel/poly3d/build_pack.js). PROVEN by Kernel/poly3d/psx_gate.js (sha256, GLB containers, PNG sizes, tri budgets, distinct skins, look sheets, pack law, --break-test) + fresh_install.js (blank Godot 4 import); the agent then LOOKS at every sheet and a fresh subagent on Fable reviews (operator 2026-10-23). Themes: everything the itch top-sellers shelf shows transacting, never one genre. Creatures and props open at Roadmap M1. See Wings/Poly3D/CLAUDE.md.  
**Store page:** https://csaf.itch.io/hollow-congregation-psx-cultists  
**Docs published:** 2026-11-21


---

# Eight Angles - 14 Retro FPS Enemies as 8-Direction Sprites and PSX Models

Core Systems Asset Factory - retro FPS enemies as low-poly PlayStation-era 3D models AND 8-direction billboard sprites.

**14 characters x 3 palette skins = 42 entities · 45 animation clips + a reference T-pose on every character · one 256 x 256 px texture per skin · 1496-1499 triangles per character.**

Theme: enemies for 90s style first person shooters: a possessed trooper, cyborgs, cultists, demons, undead and mutants, each as a rigged PSX model and as 8-direction billboard sprite sheets.

## Characters

| name | folder | triangles | skins | clips |
| --- | --- | --- | --- | --- |
| Possessed trooper | `ea_possessed_trooper` | 1499 | 3 | 46 |
| Frost witch | `ea_frost_witch` | 1497 | 3 | 46 |
| Mutant brute | `ea_brute` | 1497 | 3 | 46 |
| Cyborg gunner | `ea_cyborg_gunner` | 1498 | 3 | 46 |
| Cult acolyte | `ea_cult_acolyte` | 1498 | 3 | 46 |
| Ghoul | `ea_ghoul` | 1499 | 3 | 46 |
| Shock trooper | `ea_shock_trooper` | 1496 | 3 | 46 |
| Fire fiend | `ea_fire_fiend` | 1496 | 3 | 46 |
| Berserker | `ea_berserker` | 1497 | 3 | 46 |
| Rune knight | `ea_rune_knight` | 1497 | 3 | 46 |
| Hazmat spitter | `ea_hazmat_spitter` | 1497 | 3 | 46 |
| Bone shaman | `ea_bone_shaman` | 1496 | 3 | 46 |
| Bronze automaton | `ea_automaton` | 1496 | 3 | 46 |
| Husk marine | `ea_husk_marine` | 1496 | 3 | 46 |

## 8-direction billboard sprites (`sprites/`)

Every character is ALSO here as pre-rendered sprite sheets for shooters that draw enemies as flat sprites turning to face the camera:
**14 characters x 3 skins x 5 animations = 210 sheets, 11424 frames**, rendered from the models above.

- `sprites/<id>/<id>_skin<N>_<animation>.png` - one sheet per skin and animation: **columns = frames, rows = the 8 rotations**.
  Animations: `idle` 6 frames (loops) from the clip `Idle_Loop`; `walk` 8 frames (loops) from the clip `Walk_Loop`; `attack` 8 frames from each character's own clip (listed below: casters point and cast, gunners aim an empty hand, brawlers punch, two swipe); `pain` 4 frames from the clip `Hit_Chest`; `death` 8 frames from the clip `Death01`.
- Row r is the view after the camera has moved r x 45 degrees counter-clockwise (seen from above) round the character,
  starting in FRONT of it: row 0 its face, row 2 its left side, row 4 its back, row 6 its right side.
- Frames are 128 x 152 or 200 x 152 or 202 x 152 or 204 x 152 or 206 x 152 or 210 x 152 or 216 x 152 or 222 x 152 or 234 x 152 or 244 x 152 px (the death sheet is wider: the body falls up to about 1.9 m to a side); every
  character shares ONE pixel scale, 53.333 px per metre, so the big ones are bigger on screen. The ground point under the
  feet is the pivot: bottom centre, 28 px above the frame's lower edge (`pivot` in sprites.json, x from the left, y from the top).
- Hard alpha (every pixel fully opaque or fully clear), 15-bit colour, no anti-aliasing: use NEAREST filtering. No sheet is larger
  than 1952 px on a side.
- `sprites/<id>/sprites.json` - frame size, pivot, frame count, loop flag and sha256 of every sheet, so an engine can read them
  without hand-entered numbers.
- `sprites/eight_direction_sprite.gd` - a Godot 4 node (`EightDirectionSprite`, extends Sprite3D): set `sheets_dir` to a
  character's folder, pick `skin` and `animation`; it picks the row from the camera every frame. Turn the NODE to turn the
  character (front = local +Z, so `look_at(target, Vector3.UP, true)`). Other engines: the row formula is
  `row = round(atan2(dx, dz) / (2 pi / 8)) mod 8`, with (dx, dz) the camera's position in the character's own frame.
- Attack per character: `ea_automaton` Punch_Cross, `ea_berserker` Sword_Attack, `ea_bone_shaman` Spell_Simple_Enter + Spell_Simple_Shoot, `ea_brute` Punch_Cross, `ea_cult_acolyte` Spell_Simple_Enter + Spell_Simple_Shoot, `ea_cyborg_gunner` Pistol_Shoot, `ea_fire_fiend` Spell_Simple_Enter + Spell_Simple_Shoot, `ea_frost_witch` Spell_Simple_Enter + Spell_Simple_Shoot, `ea_ghoul` Sword_Attack, `ea_hazmat_spitter` Spell_Simple_Enter + Spell_Simple_Shoot, `ea_husk_marine` Spell_Simple_Enter + Spell_Simple_Shoot, `ea_possessed_trooper` Punch_Cross, `ea_rune_knight` Spell_Simple_Enter + Spell_Simple_Shoot, `ea_shock_trooper` Pistol_Shoot.

The sprites were rendered by a script in Blender 5.2 from the finished models (flat light, fixed camera 10 degrees above level); no
further AI step made them.

## Open the demo (Godot 4.3+)

This folder is also a Godot 4 project: open `project.godot` in Godot and press F5. Every character stands in a ring as an
`EightDirectionSprite`; the camera orbits. Left / Right or drag: orbit · Up / Down: zoom · 1-5: idle, walk, attack, pain, death ·
A: cycle the animations · S: next skin · Space: stop the orbit · F: fog. `project.godot` switches Godot's Blender importer off, so
`blender_source/` can stay where it is; `models/` imports as ordinary glTF scenes.

## What is in each character's folder (`models/<id>/`)

- `<id>_skin0.glb` - mesh + skeleton + ALL 46 clips + the skin 0 texture embedded (Godot, Unity, Unreal, three.js, Blender).
- `<id>_skin1.glb`, `<id>_skin2.glb` - the same mesh + skeleton with the other skins embedded (no clips: play the clips from `_skin0`, or swap the texture).
- `<id>.fbx` - mesh + skeleton + clips (textures referenced from `textures/`).
- `<id>.obj` + `<id>.mtl` - the static mesh in rest pose.
- `textures/<id>_skinN.png` - 256 px, 15-bit (RGB555) quantised, meant for NEAREST filtering.
- `blender_source/<id>.blend` (top level, outside `models/`) - the Blender 5.2 source (rig, clips, material). Godot tries to import every .blend it sees unless its Blender importer is off: this pack's project.godot turns it off; in your own project keep the .blend files out, or do the same.

## Engines

- **Godot 4**: drop `models/` and `shaders/godot_psx.gdshader` into the project; instance the `_skin0.glb`; put a ShaderMaterial with `godot_psx.gdshader` on the mesh and set `albedo` to the skin texture (or keep the imported material and set its texture filter to Nearest). The AnimationPlayer carries every clip. Godot's importer drops the `_Loop` suffix and marks those clips as looping (`Walk_Loop` plays as `Walk`, `Idle_Loop` as `Idle`); every other name is unchanged.
- **Unity 6**: import the FBX, set Rig > Animation Type to Humanoid (the skeleton is a standard humanoid), textures to Point filtering; or import the GLB with a glTF importer.
- **Unreal 5**: import the FBX with its animations; retarget with an IK Rig if you use the UE mannequin skeleton; set the texture to Nearest.
- **Blender**: open the .blend (skin 0 is packed inside it); every clip is an action in the file.

What we ran before release: Godot 4.7.2 (a blank project imported every GLB, the PSX shader compiled and drew on every character, the clips played) and Blender 5.2 (every FBX, OBJ and .blend re-opened, meshes, 53 bones and every clip counted). Unity and Unreal were NOT run; their notes above are the standard humanoid FBX route.

## Skeleton and clips

The rig is the open (CC0) Quaternius Universal humanoid skeleton (53 bones, Rigify-style `DEF-` names), a standard humanoid layout made for retargeting (retargeting to another skeleton was not tested here; in Godot and Blender the clips were played on this skeleton). Clips (46: 45 animations + `A_TPose`, the reference T-pose): A_TPose, Crouch_Fwd_Loop, Crouch_Idle_Loop, Dance_Loop, Death01, Driving_Loop, Fixing_Kneeling, Hit_Chest, Hit_Head, Idle_Loop, Idle_Talking_Loop, Idle_Torch_Loop, Interact, Jog_Fwd_Loop, Jump_Land, Jump_Loop, Jump_Start, PickUp_Table, Pistol_Aim_Down, Pistol_Aim_Neutral, Pistol_Aim_Up, Pistol_Idle_Loop, Pistol_Reload, Pistol_Shoot, Punch_Cross, Punch_Enter, Punch_Jab, Push_Loop, Roll, Roll_RM, Sitting_Enter, Sitting_Exit, Sitting_Idle_Loop, Sitting_Talking_Loop, Spell_Simple_Enter, Spell_Simple_Exit, Spell_Simple_Idle_Loop, Spell_Simple_Shoot, Sprint_Loop, Swim_Fwd_Loop, Swim_Idle_Loop, Sword_Attack, Sword_Attack_RM, Sword_Idle, Walk_Formal_Loop, Walk_Loop.

## Scale and style

Characters stand 1.77-2.19 m tall (Possessed trooper 1.83 m, Frost witch 1.79 m, Mutant brute 2.10 m, Cyborg gunner 1.92 m, Cult acolyte 1.79 m, Ghoul 1.83 m, Shock trooper 1.83 m, Fire fiend 1.92 m, Berserker 1.87 m, Rune knight 1.98 m, Hazmat spitter 1.83 m, Bone shaman 1.77 m, Bronze automaton 2.19 m, Husk marine 1.81 m); the scale sits on the armature object, so the clips scale with it, Z-up in Blender / Y-up in glTF. The look is the mid-1990s console era: low triangle counts, hand-painted 256 px textures, no normal maps. Use nearest filtering and the PSX shader for the full effect (vertex snapping, affine texture warp, dithering, fog - every parameter is a slider).

## Licence

See LICENSE.txt: use in any number of commercial and non-commercial projects, no attribution required; no resale or redistribution of the files as assets. Every character here is AI-generated (see HOW THIS WAS MADE in LICENSE.txt).


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
