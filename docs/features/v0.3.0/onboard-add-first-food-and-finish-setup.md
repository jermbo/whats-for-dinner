---
title: Add the first food and finish setup
summary: "The keeper adds food from a checklist or the add form, and the four parts open when setup is done."
parent: onboard-stories.md
persona: Keeper
depends-on:
  - onboard-name-places-in-setup.md
status: built
updated: 2026-10-17
---

[Wiki](../../README.md) / [Features](../README.md) / [Onboard stories](onboard-stories.md) / Add the first food and finish setup

# Add the first food and finish setup

As the [keeper](../../personas.md), I want to add the first food from a short checklist or the add form, so that setup finishes and the kitchen is ready to use.

## Requirements

1. After the places step, the first-food step offers an optional checklist of staples
   - a. The checklist includes at least rice, eggs, milk, flour, and salt
   - b. A tap selects or deselects an item
   - c. For a selected item, the keeper can type an amount or skip the amount
2. The first-food step has the form "Add to pantry" for any other food
   - a. The form uses the place list and "Place for new food" from the places step
3. Tap "Finish setup" to complete onboarding when the pantry folder has at least one food item note
   - a. "Finish setup" is not active when the pantry folder has no food item note
   - b. The checklist need not be complete
4. When onboarding completes, the data file flag records that onboarding is complete
5. When onboarding is complete, the Kitchen tab shows the four parts and opens on the Pantry part
   - a. The pantry shows the food that setup added
6. Before code, update [Settings](../../architecture/settings.md) for when onboarding is complete, and [Features](../README.md) with a short first-run paragraph if that page does not mention setup yet

## Acceptance criteria

Each criterion starts with an empty vault, onboarding not complete, recipes folder `Recipes`, plugin home `Larder` with empty `Larder/Pantry/`, place list `Kitchen pantry`, `Fridge`, and `Freezer`, and "Place for new food" `Kitchen pantry`, on the first-food step.

1. GIVEN no food item notes exist WHEN the keeper opens the first-food step THEN the step shows a checklist with rice and eggs
2. GIVEN the keeper selected rice WHEN the keeper types `2 kg` for rice and taps "Finish setup" THEN the vault has note `Larder/Pantry/Rice.md` with a row for `Kitchen pantry` and `2 kg`
   - a. AND onboarding is complete
   - b. AND the Kitchen tab shows the four parts
   - c. AND the Pantry part shows rice
3. GIVEN the keeper selected no checklist item WHEN the keeper adds `Eggs` with place `Fridge` and amount `6` through "Add to pantry" and taps "Finish setup" THEN the vault has note `Larder/Pantry/Eggs.md`
   - a. AND onboarding is complete
4. GIVEN no food item notes exist WHEN the keeper taps "Finish setup" THEN onboarding is not complete
   - a. AND the setup flow stays on the first-food step
5. GIVEN the keeper selected rice and eggs and only entered an amount for rice WHEN the keeper taps "Finish setup" THEN onboarding is complete
   - a. AND the vault has note `Larder/Pantry/Rice.md` only

## Depends on

- [Name places and choose Place for new food in setup](onboard-name-places-in-setup.md), so paths, places, and the default place are set before food is written.

## Architecture

- [Setup](../../architecture/setup.md): the steps of setup, and when setup replaces the four parts.
- [Food item note](../../architecture/food-item-note.md): the form of a food item note that setup creates.
- [Pantry](../../architecture/pantry.md): the first row in the pantry.
- [Settings](../../architecture/settings.md): the onboarding-complete flag in the data file.
