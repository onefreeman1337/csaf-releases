# Swing, Smash and Soar: Three Action-Adventure Systems for GameMaker in Pure GML — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Swing, Smash and Soar: Three Action-Adventure Systems for GameMaker in Pure GML  
**Engine:** GameMaker 2024+  
**Store page:** https://csaf.itch.io/swing-smash-soar-gamemaker  
**Docs published:** 2026-11-16


---

# Swing, Smash and Soar - Three Action-Adventure Systems for GameMaker

**Swing, Smash and Soar is three action-adventure systems for GameMaker (2024.14, tested on runtime 2024.14.4.268) in pure
GML, each with its own runnable demo room: Brandish (melee swings with drawn smears), Smithereens (breakables cut from their
own sprites) and Overflight (a Mode 7 world, sky and dive camera).** Drop one, two or all three into your game. They share no
script, object, room, font or macro name, and all three were imported into one blank GameMaker project and built together
before this download was made; in that project a Brandish swing broke a pot with Smithereens while Overflight drew a world.
No sprite or image art ships: every smear, break, world and sky is drawn or cut in code (the only image files are the twelve
font atlases, four per part). One commercial licence covers all three in all your games.

Every picture on the store page was rendered by these packages in a blank GameMaker project.

---

## What is in the download

| Folder | Part | What it is |
| --- | --- | --- |
| `01-brandish/Brandish_GameMaker/` | **Brandish** | Melee for top-down and side-view games: 8 weapon classes in 3 input modes (press-to-swing combos, a weapon that orbits toward the cursor, cursor-drag swings). Every hit is tested along the whole arc the blade swept since the last step, so a fast swing never passes through a target. Each swing draws its own smear in one of 5 styles: 8 x 5 = 40 presets, with ghosts and hit sparks. Demo room `rm_brd_demo` (THE TRAINING YARD). |
| `02-smithereens/Smithereens_GameMaker/` | **Smithereens** | Strike an object and it breaks into pieces cut from the exact frame it is showing, so a break always matches your art. 7 materials break in 7 different structures; pieces bounce, settle and fade, and gathering nodes crack per strike and grow back. The demo paints 48 props to break. Demo room `rm_smr_demo` (THE OLD COURTYARD). |
| `03-overflight/Overflight_GameMaker/` | **Overflight** | A pseudo-3D flight, dive and overworld view: a whole island world generated from a seed in one of 8 styles, under a sky in one of 5 times of day (8 x 5 = 40 presets), two cloud layers you fly over and fall through, your own sprites billboarded with shadows, and a map. Demo room `rm_ovf_demo` (THE SKY TRIAL). |

Each part folder holds exactly what that part ships on its own:

- `<Part>.yymps` - the package you import into GameMaker.
- `<Part>/` - the same project as raw, readable `.gml` and `.yy` files, so you can read every line without GameMaker.
- `Readme_for_Users.md` - that part's full guide: install, demo keys, a Quickstart, the whole API, the measured numbers and
  its limits. **Read it before you use the part.**
- `LICENSE.txt` - that part's licence text (the same terms as the volume licence beside this file).

## Install

1. In GameMaker: **Tools > Import Local Package**, choose a part's `.yymps` (for example
   `01-brandish/Brandish_GameMaker/Brandish.yymps`), **Add All**, **Import**.
2. Repeat for each part you want. Import one, two or all three, in any order.
3. To see a part's demo, put its demo room first in the room order and run the project:

| Part | Demo room | Script prefix | Macro prefix | Fonts |
| --- | --- | --- | --- | --- |
| Brandish | `rm_brd_demo` | `brd_` | `BRD_` | `fnt_brandish_*` (4) |
| Smithereens | `rm_smr_demo` | `smr_` | `SMR_` | `fnt_smithereens_*` (4) |
| Overflight | `rm_ovf_demo` | `ovf_` | `OVF_` | `fnt_overflight_*` (4) |

GML's global namespace is flat, so every public script, macro, global and resource of each part carries its own prefix.
Two parts never define the same name, which is why all three can live in one project.

Loose files to know about: each package also carries a `fonts/THIRD-PARTY-NOTICES.txt` (not a resource) naming that part's
own typefaces, at the same path in all three, and Brandish and Smithereens both carry `fonts/OFL-Cinzel.txt` and
`fonts/OFL-Alegreya.txt` (identical texts). If you import more than one part, those copies land on the same path in your
project folder and the last import wins. Keep this download as the record: each part's `fonts/` folder here holds its own
notice. The fonts letter only the demo rooms, and the scripts you call never draw text.

## Using a part in your game

Each part keeps its logic and its drawing apart, and hands results back to your code as plain structs and events rather
than taking over your rooms. The Quickstart in each part's own Readme is the shortest path:

- **Brandish:** `brd_wielder_create(x, y, brd_preset("sword", "crescent"), "press")` makes a wielder. Each step, call
  `brd_wielder_update(wielder, dt, input, targets)` with the circles your game can hit (`{ id, x, y, r }`), then
  `brd_events_take(wielder)` for the hits (`kind: "hit"`, with the `target` id you gave, `damage`, `kx` and `ky`).
  `brd_draw(wielder)` draws the smear, the blade and the sparks.
- **Smithereens:** one controller runs `smr_world_create()`, `smr_world_update(world, dt)` and `smr_world_draw(world)`.
  `smr_break_instance(world, instance, { material: "ceramic", from_x: x, from_y: y })` breaks any instance with a sprite.
- **Overflight:** `ovf_world_create({ style: "meadow", seed: 42 })` makes a world, `ovf_scene_create(world, { time: "golden",
  clouds: [300, 520] })` a scene over it; step it with `ovf_camera_step` and `ovf_scene_update`, and draw it with
  `ovf_render(scene, x, y, width, height)`.

## Wiring them together: a swing that breaks what it hits

Brandish hands back the `id` you gave each target, so give it the instance itself and pass that instance to Smithereens.
This is the code the all-three test ran in a blank project (a sword, a pot, one swing, the pot broken and destroyed):

```gml
// Create (one controller)
my_world = smr_world_create();
my_wielder = brd_wielder_create(400, 320, brd_preset("sword", "crescent"), "press");
my_pot = instance_create_depth(450, 320, 0, obj_smr_target);
my_pot.sprite_index = my_pot_sprite;      // any sprite of yours
my_pot.smr_material = "ceramic";
```

```gml
// Step: build the targets from what can be hit, swing, read the hits, break what was hit
var my_targets = [];
if (instance_exists(my_pot)) array_push(my_targets, { id: my_pot, x: my_pot.x, y: my_pot.y, r: 16 });
brd_wielder_update(my_wielder, 1 / 60, { pressed: my_attack_pressed, held: my_attack_held, aim: my_aim }, my_targets);
var my_events = brd_events_take(my_wielder);
for (var my_i = 0; my_i < array_length(my_events); my_i++) {
    var my_e = my_events[my_i];
    if (my_e.kind == "hit" && instance_exists(my_e.target)) {
        smr_break_instance(my_world, my_e.target, { from_x: my_wielder.x, from_y: my_wielder.y });
        instance_destroy(my_e.target);
    }
}
smr_world_update(my_world, 1 / 60);
```

```gml
// Draw: the pieces, then the swing over them
smr_world_draw(my_world);
brd_draw(my_wielder);
```

`obj_smr_target` is the plain breakable object Smithereens' own demo uses; any object of yours with a sprite works the same
way. In a game you would fill `my_targets` from every breakable and enemy instance each step (Brandish's Readme shows the
`with` loop), and `my_attack_pressed`, `my_attack_held` and `my_aim` are your own input.

## Compatibility and limits

- GameMaker 2024.14, built and tested on runtime 2024.14.4.268, Windows (VM). HTML5, mobile and YYC were not built.
- GML cannot be unit-tested outside the engine. Every number in the part Readmes came from real Igor-built executables
  running each part's own in-engine suite, and the "all three in one project" and wiring claims above came from real Igor
  builds of a blank project with all three packages imported.
- Each part was written against the GMS2 runtime. GameMaker's new runtime (GMRT) was not tested.
- In the wiring test the input was scripted (one press aimed at the pot); no real key or mouse button was pressed.

## Licence

`LICENSE.txt` beside this file: one commercial licence, unlimited games, covering all three parts. You may ship anything you
BUILD with these packages; you may not resell the packages themselves.

## AI disclosure

These packages were written with AI assistance. That is disclosed on the store page and in every licence file.

---

Swing, Smash and Soar 1.0.0 · Brandish 1.0.0 · Smithereens 1.0.0 · Overflight 1.0.0 · Core Systems Asset Factory · https://csaf.itch.io


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
