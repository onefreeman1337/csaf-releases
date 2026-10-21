# Behavior Tree to StateTree Converter — Documentation

_Core Systems Asset Factory (CSAF). This page is the free, public documentation for this product — no purchase required to read it._


**Product:** Behavior Tree to StateTree Converter  
**Engine:** Unreal Engine 5  
**Docs published:** 2026-10-21


---

# Behavior Tree to StateTree Converter

Converts a Behavior Tree and its Blackboard into a StateTree that runs on the **same Blackboard**. Your perception code,
AI controller and anything else that writes Blackboard keys keeps feeding the converted tree. The original Behavior Tree
is never modified.

Every node it cannot translate is named on a **conversion sheet** and **fails closed** in the generated tree: a task
that was not converted fails, and a decorator that was not converted blocks its branch. Nothing is guessed.

Unreal Engine 5.8, Windows. Requires the StateTree and GameplayStateTree plugins (enabled automatically).

## Use it

**From the Content Browser:** right-click a Behavior Tree, then choose **Preview StateTree Conversion** (nothing is
saved) or **Convert to StateTree**. `BT_Grunt` becomes `ST_Grunt` beside it, and the conversion sheet opens in your browser.

**From the console:** `BTToStateTree.Convert /Game/AI/BT_Grunt [/Game/AI/BT_Boss ...] [-Preview]`

**From the command line (CI):**

```
UnrealEditor-Cmd.exe <Project>.uproject -run=BTToStateTree -Trees=+Game/AI/BT_Grunt -unattended -nopause
UnrealEditor-Cmd.exe <Project>.uproject -run=BTToStateTree -Scope=+Game/AI -Preview -FailOnUnconverted -unattended -nopause
```

Write content paths with a leading `+` instead of `/` (`+Game/AI/BT_Grunt`); several paths are joined with `+`.

| Switch | Meaning |
| --- | --- |
| `-Trees=` | The Behavior Trees to convert. |
| `-Scope=` | Convert every Behavior Tree under these folders. |
| `-Out=+Game/Folder` | Write the StateTrees there instead of beside each Behavior Tree. |
| `-Preview` | Build, compile and write the sheet; save nothing. |
| `-Overwrite` | Replace a StateTree already at the output path. Without it, that tree is refused. |
| `-FailOnUnconverted` | Exit 5 while any node is left to rebuild by hand. |
| `-Inspect=+Game/AI/ST_Grunt` | Load saved StateTrees in a fresh process and compile them. |
| `-ExitOnFinish` | Request engine exit when the run ends. |
| `-Help` | Print the switches and exit codes. |

Exit codes: `0` done, `2` bad arguments, `4` a tree was refused, `5` nodes left for you (`-FailOnUnconverted`),
`6` a converted tree did not compile or did not save.

## Running the converted tree

1. Add a **StateTree AI Component** to your AI controller and set its StateTree to the converted `ST_` asset.
2. Remove the `Run Behavior Tree` call. The converted tree's global **Use Blackboard** task creates the Blackboard
   from the original Blackboard asset when the tree starts. If your controller already made one, it is kept, values and all.
3. Rebuild the nodes listed under **Left for you** on the conversion sheet.

## What converts

| Behavior Tree | StateTree |
| --- | --- |
| Selector | A state that tries its children in order. A child that fails moves on to the next one that can run. A final "no branch could run" leaf fails the selector. |
| Sequence | A state whose children run in order. Success moves to the next child, and a failure fails the sequence. |
| Simple Parallel (main task + background task) | One state running both tasks. "Wait for background" waits for both. |
| Blackboard decorator | **Blackboard Key Check**, evaluated by the key type's own test, exactly as the decorator does. |
| Compare BBEntries, Is BBEntry Of Class, Check Gameplay Tags On Actor | Matching Blackboard conditions. |
| Observer aborts | Lower Priority: an OnTick transition on every later sibling. Self: an OnTick transition on the branch itself. |
| Cooldown | **Cooldown Elapsed** condition plus a **Cooldown Stamp** task, timed per AI controller. |
| Loop, Loop Until, Conditional Loop | Repeat transitions with the Behavior Tree's own counting, timeout and condition. |
| Force Success, Time Limit | A leaf that succeeds, and a task that fails the state after the limit. |
| Move To, Move Directly Toward | **Move To Blackboard Key**, with every setting, including settings bound to Blackboard keys and Observe Blackboard Value. |
| Wait, Wait Blackboard Time | **Wait**, drawn exactly as the Behavior Tree draws it. |
| Rotate To Face BBEntry | **Rotate To Face Blackboard Entry**. |
| Run EQS Query, Run EQS service | **Run EQS Into Blackboard Key** (task, or background every Interval). |
| Default Focus service | **Focus Blackboard Key** while the state is active. |
| Set Key Value (bool, int, float, name, string, object, class, enum, vector, rotator) | **Set Blackboard Value**. |
| Finish With Result | **Finish With Result**. |
| Run Behavior | The subtree is converted too, and linked as a StateTree asset. |

## What does not convert (named on the sheet, fails closed)

Blueprint tasks, decorators and services. Rebuild their graphs as StateTree Blueprint tasks and conditions; the states
are already in place. Also not converted in 1.0: Play Animation, Play Sound, Make Noise, tag cooldowns, Run Behavior
Dynamic, decorator logic (AND/OR/NOT), Cone Check, Keep In Cone, Does Path Exist, Is At Location, a composite in the
background of a Simple Parallel, and custom C++ nodes. A root decorator is listed but not applied.

## The conversion sheet

`Saved/BTToStateTree/BTToStateTree_<time>.html` (and `.json` for CI). It has one row per Behavior Tree node: what it
became, and what happened to each of its settings (carried, left at its default, or changed by you and dropped, which is
named). Every difference gets a note. Nodes left for you are listed first.

## Support

https://csaf.itch.io. Copyright (c) 2026 Core Systems Asset Factory.


---

## Support

Questions or a problem with this product? Open an issue on the release repository and we will answer.
