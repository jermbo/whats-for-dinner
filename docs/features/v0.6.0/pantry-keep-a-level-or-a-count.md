---
title: Keep a level or a count
summary: "The food item note gets the column Left: a level for a measured package, a count for a counted one. An empty package goes out, and low and out get simple rules."
parent: pantry-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Keep a level or a count

# Keep a level or a count

As the [keeper](../../personas.md), I want each package to say "1/4" or "4 of 12", as I see it, so that the pantry is simple to read and to correct.

## Requirements

1. The table of a food item note has the columns `Place`, `Left`, `Size`, and `Use by` (decisions 2, 3, and 4)
   - a. The plugin finds each column by its name, as today
   - b. The plugin writes the four columns in this sequence
2. The size tells the kind of the food item (decision 2)
   - a. A number with a unit, such as `1 gal` or `425 g`, is a measure
   - b. A plain number, such as `12`, is a count
3. For a measure, `Left` is `full`, `3/4`, `1/2`, or `1/4` (decision 3)
   - a. The plugin reads `Full`, `FULL`, and `full` as the same
4. For a count, `Left` is a whole number from 1 to the size (decision 4)
5. A row with a text in `Left` that is not a level or a count, such as `tap`, is in the pantry (decision 25)
   - a. The plugin does not count it, and a meal does not take from it
6. A row with `Left` empty or `0` is not a package, and the plugin takes it out of the table at the next write (decision 11)
7. A food item with no package is out (decision 11)
8. A food item is low when it has one package, and that package is at `1/4`, or at a count of 1/4 of its size or less (decision 12)
   - a. 3 eggs of 12 is low. 4 eggs of 12 is not low
9. The amount of a package for the recipes and the list is its level times its size, or its count (decision 7)
   - a. `1/4` of `1 gal` is 1/4 gal
10. The plugin no longer reads or writes `full`, `low`, and `loose`, and the vault has no unit system (decisions 6, 12, and 13)
    - a. The settings "Units" and the low percentage go out
11. The properties `aliases`, `staple`, `suggest`, and `bought`, and the section "Brands", stay as they are (decisions 14 and 15)

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN `Milk.md` WHEN the plugin reads it THEN milk has two measured packages in "Fridge": 1/4 of 1 gal, and full of 1 gal
2. GIVEN `Eggs.md` WHEN the plugin reads it THEN eggs have two counted packages: 4 of 12, and 12 of 12
3. GIVEN `Milk.md` WHEN the plugin reads it THEN milk is not low
   - a. AND after the row `full | 1 gal` goes out of the note, milk is low
4. GIVEN `Eggs.md` with only the row `Fridge | 3 | 12 | 2026-10-25` WHEN the plugin reads it THEN eggs are low
5. GIVEN `Milk.md` with no row WHEN the Shop part opens THEN milk is out
6. GIVEN `Water.md` WHEN the plugin reads it THEN water is in the pantry, and the Boiled eggs recipe finds it
7. GIVEN a row `Fridge | 0 | 1 gal |` in `Milk.md` WHEN the plugin writes the note THEN the row is not in the table
8. GIVEN `Milk.md` with `full: 2 gal` WHEN the plugin writes the note THEN `full` stays as you typed it, and the plugin does not use it

## Depends on

Nothing.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the table and the properties.
- [Level](../../architecture/level.md): the level of a package, low, and out.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 2 to 7, 11 to 15, and 25.
