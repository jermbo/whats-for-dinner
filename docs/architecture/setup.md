---
title: Setup
summary: "How the kitchen starts in a new vault: four steps that make the folders, the places, and the first food, before the four parts open."
parent: ../README.md
updated: 2026-10-17
---

[Wiki](../README.md) / Setup

# Setup

The plugin needs folders, a meal plan note, and places before Plan, Shop, and Cook Mode can work. This page tells how the kitchen gets them the first time that you open it.

## The kitchen waits for setup

A wrong folder or a missing note breaks the kitchen, so setup is not optional. Until setup is complete, the **Kitchen** tab shows setup and not the four parts. No control skips it.

The [data file](notes-of-the-kitchen.md) keeps the step of setup. So you can close the tab and continue at the same step later. After the last step, the data file records that setup is complete, and the kitchen opens on the Pantry part.

## Four steps

| Step        | You do                                                                  | The plugin writes                                                                  |
| ----------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Recipes     | Select or type the recipes folder. It cannot be in the plugin home. Select the unit system: "Metric" or "Imperial". | The two settings, and the folder when it is new. |
| Plugin home | Keep the name `Larder`, or type a different name.                       | `Pantry`, `Shopping`, and `Shopping/Items` in it, an empty `Meal plan.md`, and the four path [settings](settings.md). |
| Places      | Rename, remove, or add places. Select "Place for new food".             | The place list and "Place for new food".                                           |
| First food  | Give an amount to staples of the checklist, or use "Add to pantry".     | A [food item note](food-item-note.md) for each.                                    |

The unit system comes first, because the first food step writes rows in it. Each step needs the step before it. The home must not hold the recipes, and food needs a folder and a place. Setup moves no note from a different folder.

"Add to pantry" is the form of the Pantry part, so the button "Add brand" is there too. The packages are in the cupboard in front of you, so it is a good moment for the photo of each [brand](brands.md).

"Finish setup" is active when the pantry has a food item, or when a staple of the checklist has an amount. A staple gets its note when you tap "Finish setup", in the place "Place for new food". A staple with no amount gets no note.

## A vault with notes of the kitchen

Setup is for a new vault. Before setup starts, the kitchen looks at the paths of the settings. If it finds a food item, the meal plan note, or a note in the shopping folder, it does not run setup. It tells you to open the plugin settings. There, you check the folders and tap "Use these notes". Then the kitchen opens with the notes that are there.

## Setup again, for a test

The development build has the command "Start setup again". It moves the plugin home to the trash of the vault, where you can get it back, and the data file starts as on a new install. The recipes folder stays. A plugin home at the root of the vault, as in a vault from before setup, is not moved. The release has no such command: the plugin deletes no folder of yours.

## An example

You keep `Recipes/` at the root of the vault, and you keep `Larder`. You rename "Fridge" to "Kitchen fridge", and add "Garage freezer". On the checklist, you give rice "2 kg". The vault gets `Larder/Pantry/Rice.md` with a row for "Kitchen pantry", and the kitchen opens on the Pantry part with rice.

## Further reading

- [Pantry](pantry.md): what a place is, and why you name it before food is there.
- [Plan](plan.md): the meal plan note that the second step makes.
