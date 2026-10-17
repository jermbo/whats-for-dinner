---
title: Name places and choose Place for new food in setup
summary: "The keeper edits the place list and picks the default place for new food on the places step."
parent: onboard-stories.md
persona: Keeper
depends-on:
  - onboard-keep-places-in-the-data-file.md
  - onboard-start-setup-and-pick-recipes-folder.md
  - onboard-create-the-plugin-home-in-setup.md
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Onboard stories](onboard-stories.md) / Name places and choose Place for new food in setup

# Name places and choose Place for new food in setup

As the [keeper](../../personas.md), I want to name where food lives and to choose the default place for new food, so that put away and add food start from the right spot.

## Requirements

1. After the folder step, the places step shows three default names: `Kitchen pantry`, `Fridge`, and `Freezer`
   - a. Copy on the step says the list can change
2. The keeper can rename a default, remove a default, or add a place with any name
   - a. Optional suggestions include `Downstairs pantry`, `Secondary pantry`, and `Garage freezer`
   - b. A tap on a suggestion adds that name when it is not already in the list
3. The step shows "Place for new food" with one option for each name in the list
   - a. Copy says put away and add food use this place when a food item has no row yet
   - b. When `Kitchen pantry` is in the list, it is pre-selected
   - c. When `Kitchen pantry` is not in the list, no option is pre-selected
4. "Continue" is active only when the list has at least one place and "Place for new food" has a selection
5. Tap "Continue" to save the place list and "Place for new food" into the data file and to go to the first-food step

## Acceptance criteria

Each criterion starts with an empty vault, onboarding not complete, recipes folder `Recipes`, plugin home `Larder` created, and the setup flow on the places step.

1. GIVEN the places step is open WHEN the keeper opens the step THEN the list shows `Kitchen pantry`, `Fridge`, and `Freezer`
   - a. AND "Place for new food" is `Kitchen pantry`
2. GIVEN the places step is open WHEN the keeper removes `Fridge` and `Freezer` and taps "Continue" THEN the data file place list has only `Kitchen pantry`
   - a. AND "Place for new food" is `Kitchen pantry`
3. GIVEN the keeper removed `Kitchen pantry` and the list has only `Garage freezer` WHEN the keeper selects `Garage freezer` for "Place for new food" and taps "Continue" THEN the data file has place list `Garage freezer`
   - a. AND "Place for new food" is `Garage freezer`
4. GIVEN the list is empty WHEN the keeper taps "Continue" THEN the setup flow stays on the places step
5. GIVEN `Kitchen pantry` is not in the list and "Place for new food" has no selection WHEN the keeper taps "Continue" THEN the setup flow stays on the places step
6. GIVEN the keeper adds `Downstairs pantry` from a suggestion WHEN the keeper taps "Continue" with "Place for new food" `Kitchen pantry` THEN the data file place list includes `Downstairs pantry` and `Kitchen pantry`

## Depends on

- [Keep a list of places in the data file](onboard-keep-places-in-the-data-file.md), so the data file can store the list.
- [Start setup and pick the recipes folder](onboard-start-setup-and-pick-recipes-folder.md), and [Create the plugin home in setup](onboard-create-the-plugin-home-in-setup.md), so the setup flow reaches this step in order.

## Architecture

- [Settings](../../architecture/settings.md): the place list and "Place for new food".
- [Pantry](../../architecture/pantry.md): places as names before rows exist.
