---
title: A meal takes from each package
summary: "At the end of a meal, the plugin takes the amount of an ingredient from as many packages as it needs, the first date first and the open package first on the same date."
parent: packages-stories.md
updated: 2026-10-18
persona: Cook
depends-on: [packages-keep-one-row-for-each-package.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Packages stories](packages-stories.md) / A meal takes from each package

# A meal takes from each package

As the [cook](../../personas.md), I want the end of a meal to take each ingredient from the packages that I used, so that the pantry is correct with no count after dinner.

## Requirements

1. The end of a meal takes the amount of an ingredient from as many packages as it needs
   - a. A recipe asks for an amount, not for packages
   - b. A package that gives all that it has is an empty row, with the rules of [Keep one row for each package](packages-keep-one-row-for-each-package.md)
2. The packages give in this sequence
   - a. The package with the first use-by date gives first, in each place, as today
   - b. With the same date, or with no date, the open package gives first
   - c. With the same date and the same state, the row that is higher in the table gives first
   - d. A package with no date gives after each package with a date
   - e. An empty row gives nothing
3. A package keeps its size, its place, and its date
4. The amount that is left keeps the unit of its row, as the [amounts](../../architecture/amounts.md) page tells, with eighths as fractions
5. When the pantry has less than the meal needs, each package gives all that it has, and the food item is out

## Acceptance criteria

Each criterion starts with the vault of the [list page](packages-stories.md#what-the-vault-needs).

1. GIVEN the boiled eggs need 4 eggs WHEN the cook finishes the meal THEN `Eggs.md` has the row `Fridge | 0 | 12 | 2026-10-25`
   - a. AND the row `Fridge | 10 | 12 | 2026-11-16`
2. GIVEN the pancakes need 1 egg WHEN the cook finishes the meal THEN `Eggs.md` has the row `Fridge | 1 | 12 | 2026-10-25`
   - a. AND the row of 12 eggs is as before
3. GIVEN `Eggs.md` has only the rows `Fridge | 12 | 12 | 2026-11-16` and then `Fridge | 6 | 12 | 2026-11-16` WHEN a meal takes 1 egg THEN the second row has 5
   - a. AND the first row has 12
4. GIVEN a recipe needs 3 cans of black beans of 15 oz, as 45 oz WHEN the cook finishes the meal THEN the open can of 7.5 oz is an empty row
   - a. AND two sealed cans with the date 2027-03-01 are empty and go out of the table
   - b. AND a third can with the date 2027-03-01 has 7.5 oz
   - c. AND `Black beans.md` has 6 rows
5. GIVEN a recipe needs 2 gal of milk WHEN the cook finishes the meal THEN milk is in the group "Out"
   - a. AND `Milk.md` has one row, an empty row

## Depends on

- [Keep one row for each package](packages-keep-one-row-for-each-package.md): the rows, the empty row, and out.

## Architecture

- [End of a meal](../../architecture/end-of-a-meal.md): what the button of the last page writes.
- [Use soon](../../architecture/use-soon.md): the row with the first date gives first.
- [Spec: one row for each package](../../initiatives/one-row-for-each-package/spec.md): scope 12.
