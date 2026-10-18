---
title: Keep one row for each package
summary: "The table of a food item note has one row for each package, with its size, and an empty row keeps the slot of a package that is used up."
parent: packages-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Packages stories](packages-stories.md) / Keep one row for each package

# Keep one row for each package

As the [keeper](../../personas.md), I want each package to be one row with its own size and its own use-by date, so that the pantry keeps what is really in the fridge.

## Requirements

1. The table of a food item note has the column `Size`
   - a. The plugin finds the column by its name, so the sequence of the columns is free
   - b. The plugin writes the columns in this sequence: `Place`, `Amount`, `Size`, `Use by`
   - c. Each row is one package. Two rows can have the same place, size, and date
2. Each row has a size
   - a. A row with an empty size, or a size with no number, gets its own amount as its size
   - b. A size in a unit that does not compare with the amount counts as an empty size
   - c. An amount that is more than the size makes the size the same as the amount
   - d. At a write, the plugin writes the size of each row into the cell `Size`
3. Gallons, quarts, pints, and fluid ounces are volumes (decision 25)
   - a. `gal` is 3785.41 ml, `qt` is 946.35 ml, `pt` is 473.18 ml, and `fl oz` is 29.57 ml
   - b. The names "gallon", "quart", "pint", and "fluid ounce" are the same units
   - c. `oz` with no "fl" stays a mass
4. An amount that is a number of eighths, and is not round with 2 decimals, shows as a fraction (decision 26)
   - a. 0.375 gal is "3/8 gal", and 1.5 gal is "1 1/2 gal"
   - b. A metric unit keeps the rule of today: 0.625 kg is "625 g"
   - c. The note gets the same text as the screen
5. A row with nothing left is an empty row
   - a. Its amount is `0`, and it keeps its place and its size
   - b. A food item keeps one empty row for each place. When a second row of the same place has nothing left, that row goes out of the table
   - c. An empty row has no use-by date that counts: no badge, not "use soon", and not past its date (decision 27)
   - d. An empty row adds nothing to the level
6. A food item is out when each of its rows is an empty row, or when the note has no row
   - a. This replaces requirement 1 of [See the food that is out](../v0.1.0/pantry-see-the-food-that-is-out.md)
7. The full amount is only for the level
   - a. The plugin learns it as it does today: when all rows together have more than `full`, it writes the larger amount

## Acceptance criteria

Each criterion starts with the vault of the [list page](packages-stories.md#what-the-vault-needs).

1. GIVEN `Milk.md` has two rows in "Fridge" WHEN the pantry reads the note THEN milk has 2 rows
   - a. AND the total of milk is "1 1/2 gal"
   - b. AND each row has the size "1 gal"
2. GIVEN the row of flour has no size WHEN the pantry reads `Flour.md` THEN the size of the row is "1000 g"
3. GIVEN a row of eggs `Fridge | 14 | 12 |` WHEN the pantry reads the note THEN the size of the row is "14"
4. GIVEN a row of milk `Fridge | 1 gal | 2 cans |` WHEN the pantry reads the note THEN the size of the row is "1 gal"
5. GIVEN the plugin writes `Flour.md` WHEN the keeper opens the note THEN the table has the columns `Place`, `Amount`, `Size`, `Use by`
   - a. AND the row of flour has `1000 g` in the column `Size`
6. GIVEN the pancakes need 300 ml of milk WHEN the recipe list shows the pancakes THEN the milk of the pancakes is in the pantry
7. GIVEN two amounts "1 gal" and "4 qt" WHEN the plugin compares them THEN they are the same
8. GIVEN an ingredient "8 oz cheese" and an ingredient "8 fl oz cream" WHEN the plugin reads them THEN the cheese is a mass and the cream is a volume
9. GIVEN a row of milk with 0.375 gal WHEN the pantry shows the row THEN the amount is "3/8 gal"
10. GIVEN the row of eggs with the date 2026-10-25 has nothing left WHEN the plugin writes `Eggs.md` THEN the note has the row `Fridge | 0 | 12 | 2026-10-25`
    - a. AND the row of 12 eggs is as before
11. GIVEN eggs have an empty row in "Fridge" WHEN the second row of eggs in "Fridge" has nothing left THEN `Eggs.md` has one row in "Fridge"
    - a. AND that row is `Fridge | 0 | 12 | 2026-10-25`
12. GIVEN the empty row of eggs has the date 2026-10-25, and today is 2026-10-26 WHEN the pantry shows eggs THEN eggs have no badge "Past its date"
    - a. AND the Shop part has no suggestion "Past its date" for eggs
13. GIVEN each row of milk is an empty row WHEN the pantry shows milk THEN milk is in the group "Out"
14. GIVEN milk has `full: 2 gal` WHEN the plugin writes a third row of `1 gal` THEN `Milk.md` has `full: 2 1/2 gal`

## Depends on

Nothing. This story is the base of the other six.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the table, the column `Size`, and the empty row.
- [Amounts](../../architecture/amounts.md): the new units, and eighths as fractions.
- [Level](../../architecture/level.md): the full amount, and out with empty rows.
- [Use soon](../../architecture/use-soon.md): an empty row has no date that counts.
- [Spec: one row for each package](../../initiatives/one-row-for-each-package/spec.md): scope 1, 2, 4, 6, 14, and 15.
