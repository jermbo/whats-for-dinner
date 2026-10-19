---
title: Add new food to the pantry
summary: "'Add to pantry' asks for a name. A known food opens its card with a new package. A new food asks for its package size first."
parent: pantry-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: [pantry-add-a-package.md, pantry-set-the-package-size-with-a-chip.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Add new food to the pantry

# Add new food to the pantry

As the [keeper](../../personas.md), I want to type a name and land on the right card with a new package, so that new food goes into the right place in seconds.

## Requirements

1. The plus button of the Pantry part opens one field: the name (decision 22)
   - a. Below the field, the food items that the text finds show as a list, by name, other name, or brand
   - b. The last line of the list is "New: <text>"
2. A tap on a known food item opens its card and adds a package, as "+ Add package" does (decisions 22 and 28)
   - a. The place is the place of the newest package of the food item. With a place filter on, it is that place
3. A tap on "New: <text>" asks for the package size: the number and the unit chips of story 9 (decision 22)
   - a. Then it asks for the place: the chips of the places
   - b. Then the plugin makes the note in the pantry folder, with one full package, and opens its card
4. The field shows above the list, and the list scrolls in its own box with the field in view

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN the field of "Add to pantry" WHEN the keeper types "mil" THEN the list shows "Milk" and "New: mil"
2. GIVEN the list from AC 1 WHEN the keeper taps "Milk" THEN the card of milk opens in "Fridge" with a third jug, full, with the handle on it
3. GIVEN the field WHEN the keeper types "Oat milk", taps "New: Oat milk", types "64", taps "fl oz", and taps "Fridge" THEN `Oat milk.md` has the row `Fridge | full | 64 fl oz |`
   - a. AND the card of oat milk is open
4. GIVEN the field WHEN the keeper types "brand c" THEN the list shows "Taco seasoning"

## Depends on

- [Add a package](pantry-add-a-package.md): the new package of a known food.
- [Set the package size with a chip](pantry-set-the-package-size-with-a-chip.md): the size of a new food.

## Architecture

- [Pantry](../../architecture/pantry.md): "Add to pantry".
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 22 and 28.
