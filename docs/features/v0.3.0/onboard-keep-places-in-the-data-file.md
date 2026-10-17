---
title: Keep a list of places in the data file
summary: "The keeper edits places in settings, and the kitchen uses the list before any row exists."
parent: onboard-stories.md
persona: Keeper
depends-on: []
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Onboard stories](onboard-stories.md) / Keep a list of places in the data file

# Keep a list of places in the data file

As the [keeper](../../personas.md), I want a list of place names in the plugin data, so that I can pick a place before any food item has a row there.

## Requirements

1. The data file keeps a list of place names
   - a. When the list is empty and food item notes have places in rows, the plugin fills the list from those rows the first time it reads the vault
   - b. When the list has names, the kitchen uses the union of the list and every place in a row, with no duplicate, sorted A to Z
2. The Obsidian plugin settings tab has a control to add, rename, and remove names in the list
   - a. At least one name must stay in the list
3. The form "Add to pantry" shows one chip for each name in the list
   - a. A chip selects that place
   - b. The field "A new place" still adds a name that is not in the list
4. The filter chips of the Pantry part show each name in the list, even when no row uses that place yet
5. Put away proposes a place from the list when the line has no row yet
   - a. The proposed place is still the setting "Place for new food"

## Acceptance criteria

Each criterion for the test vault starts with rice as today: 500 g in "Kitchen pantry" and 2 kg in "Downstairs pantry". Unless the criterion says otherwise, the place list in the data file is `Downstairs pantry`, `Freezer`, `Kitchen`, `Kitchen fridge`, `Kitchen pantry`, and `Outside fridge`.

1. GIVEN the place list has "Garage freezer" and no food item has a row there WHEN the keeper opens the form "Add to pantry" THEN the form shows a chip "Garage freezer"
2. GIVEN the place list has "Garage freezer" and no row uses it WHEN the shopper opens the part "Pantry" THEN a chip "Garage freezer" is in the filter bar
3. GIVEN the place list has only "Kitchen pantry" and the vault has no food item notes WHEN the keeper opens the form "Add to pantry" THEN the form shows a chip "Kitchen pantry"
   - a. AND no other place chip
4. GIVEN the plugin settings tab is open WHEN the writer removes "Outside fridge" from the place list and adds "Garage freezer" THEN the data file has "Garage freezer"
   - a. AND does not have "Outside fridge"
5. GIVEN the place list has one name WHEN the writer tries to remove that last name THEN the list still has that name

## Depends on

Nothing of this version. This story changes [Add food](../v0.1.0/pantry-add-food.md) and [Filter the pantry](../v0.1.0/pantry-filter-the-pantry.md): place chips can come from the data file before any row exists.

## Architecture

- [Settings](../../architecture/settings.md): the place list in the data file, and "Place for new food".
- [Pantry](../../architecture/pantry.md): a place is a row, and the list names places before rows exist.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): what is in the data file.
