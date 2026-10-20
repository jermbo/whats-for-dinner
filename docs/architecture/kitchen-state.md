---
title: Kitchen state
summary: "The object between the notes and the screens: its copy of the vault, the path of a change, and the file of each write."
parent: notes-of-the-kitchen.md
updated: 2026-10-20
---

[Wiki](../README.md) / [Notes of the kitchen](notes-of-the-kitchen.md) / Kitchen state

# Kitchen state

The Pantry part and the Shop part both show the milk. If each screen read the note itself, the two could show different amounts. So one object, the kitchen state, reads the notes, and each screen reads that object. This page tells how it stays current, and where each action writes.

## A copy of the vault, and the fields of the screens

The copy and the fields are in two files:

1. The vault buffer, in `kitchen/vault-buffer.ts`, is the working copy of the vault. It has the last read of each recipe, food item, plan, trip, and receipt. Only the buffer changes this copy.
2. The kitchen state, in `kitchen-state.svelte.ts`, has the fields that the screens read, such as the food items, the trip, and the cart.

Svelte draws a screen again when a field changes, but it does not see a change in the buffer. So after each read, the state copies a snapshot of the buffer into its fields. A screen reads the fields, never the buffer.

## The path of a change

You tap "Done" on the card of milk, with the full jug at 1/2.

1. The screen gives the new rows to the state.
2. The pantry actions of the state write the note. No field changes yet.
3. Obsidian reports the change, and the state reads the note into the buffer again.
4. The state copies the snapshot, and the card shows 1/2.

If the write fails, a notice tells what did not change, and the screen stays as it was.

A change that you type in the note takes steps 3 and 4 too. So the screen shows what the note says, from the plugin or from you. The state follows four events of the vault: a new note, a changed note, a note with a new name, and a note that is gone.

## Lists that the state calculates

The recipes with their match, the shopping list, the cart, and the suggestions are not notes. Svelte calculates each list again from the fields and the settings. The rules are in the domain, and in three small files next to the state: `kitchen/shop-read-model.ts`, `kitchen/meals-view.ts`, and `kitchen/recipes-view.ts`. So a new list does not make the state larger. A rule of a critical path, such as the rows of the list or the lines of a receipt at the start of put away, is in the domain, so that a [unit test](../standards/unit-tests.md) can check it.

## The actions of each subject

A screen does not call a write directly. It calls an action of one subject of the kitchen, such as `kitchen.pantry.setSize` or `kitchen.shop.putInCart`. There are seven subjects, and each one has its own file in `kitchen/`:

| Subject           | File                | What it writes                                                                       |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------ |
| `kitchen.pantry`  | `pantry-actions.ts` | The packages of a food item, its size, its staple label, and its mark "check".       |
| `kitchen.brands`  | `brand-actions.ts`  | The brands of a food item, with their photos and verdicts.                           |
| `kitchen.plan`    | `plan-actions.ts`   | The meals of the plan note.                                                          |
| `kitchen.shop`    | `shop-actions.ts`   | The cart in the note "Next trip", the receipt, and each package of put away.         |
| `kitchen.cook`    | `cook-actions.ts`   | The end of a meal: the food out of the pantry, the cook record, and the step photos. |
| `kitchen.intake`  | `intake-actions.ts` | A new or a changed recipe, and a stub for each new food.                             |
| `kitchen.setup`   | `setup-actions.ts`  | The plugin home, its folders, the places, and the first food of setup.               |

Two more files help them. `photo-actions.ts` puts a photo of a recipe or of a brand in its folder `Photos`. `tried.ts` shows a notice when a write fails.

The type of a host tells what a file needs, such as the paths and some calls of Obsidian. The kitchen state gives the file an object of that type. So you can read an action file with no knowledge of the state.

## A new action

1. Write the action in the file of its subject.
2. Add it to the object of that subject, with the text of the notice for a failure.

The kitchen state does not change. It changes only when the action needs a field or a call that the host does not have yet.

## The part on the screen

The state also keeps the part that the kitchen shows: Pantry, Recipes, Plan, or Shop. It is in the state and not in a screen, so it stays when the tab closes. The state writes it to the local storage of the vault too, so it stays after a restart. That storage is on one device, so the phone and the desktop each open where they were. The rest of a screen, such as the bars and Cook Mode, starts again with the tab.

## A new kind of note

1. Give the kind a name in `kitchen/note-kind.ts`. The path of a note tells its kind.
2. Read a note of that kind into the buffer.
3. If a screen needs it, add it to the snapshot and to a field of the state.
4. Write it with an action file. Do not change a field: the event of the vault reads the note again.

## Further reading

- [Layers](../standards/layers.md): why only the state and the shell import Obsidian.
