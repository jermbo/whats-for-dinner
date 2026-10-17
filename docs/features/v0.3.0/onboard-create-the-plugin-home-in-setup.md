---
title: Create the plugin home in setup
summary: "The writer names Larder, creates the folder tree, and writes path settings."
parent: onboard-stories.md
persona: Writer
depends-on:
  - onboard-start-setup-and-pick-recipes-folder.md
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Onboard stories](onboard-stories.md) / Create the plugin home in setup

# Create the plugin home in setup

As the [writer](../../personas.md), I want setup to create the Larder folders and meal plan note, so that the vault matches the layout before I add food.

## Requirements

1. After the recipes step, the folder step shows the default plugin home name `Larder`
   - a. The writer can change the name before anything is created
2. Tap "Continue" on the folder step to create the tree and save path settings
   - a. The plugin creates `{home}/Pantry/`, `{home}/Shopping/`, and `{home}/Shopping/Items/`
   - b. The plugin creates an empty note `{home}/Meal plan.md`
   - c. The plugin writes pantry folder, shopping folder, items folder, and meal plan note settings from `{home}`
   - d. The plugin does not move notes from other folders
3. When `{home}` is not `Larder`, the paths in settings use the name the writer chose
4. Tap "Continue" goes to the places step
5. Before code, update [Settings](../../architecture/settings.md) for the plugin home layout and teardown, and [Glossary](../../glossary.md) for **Larder** and **plugin home**

## Acceptance criteria

Each criterion starts with an empty vault, onboarding not complete, recipes folder `Recipes`, and the setup flow on the folder step after the recipes step is done.

1. GIVEN the folder step shows the default name `Larder` WHEN the writer taps "Continue" THEN the vault has folders `Larder/Pantry/`, `Larder/Shopping/`, and `Larder/Shopping/Items/`
   - a. AND the vault has note `Larder/Meal plan.md` with empty body
   - b. AND settings have pantry folder `Larder/Pantry`, shopping folder `Larder/Shopping`, items folder `Larder/Shopping/Items`, and meal plan note `Larder/Meal plan.md`
2. GIVEN the writer changes the home name to `Cupboard` WHEN the writer taps "Continue" THEN the vault has `Cupboard/Pantry/` and note `Cupboard/Meal plan.md`
   - a. AND settings have pantry folder `Cupboard/Pantry`
3. GIVEN the test vault has `Pantry/Rice.md` at the old path WHEN the writer finishes the folder step on an empty vault THEN the plugin does not move `Pantry/Rice.md`

## Depends on

- [Start setup and pick the recipes folder](onboard-start-setup-and-pick-recipes-folder.md), so the setup flow and sequence exist.

## Architecture

- [Settings](../../architecture/settings.md): folder paths and the plugin home.
- [Plan](../../architecture/plan.md): the meal plan note.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): the plan note as one kind of note.
