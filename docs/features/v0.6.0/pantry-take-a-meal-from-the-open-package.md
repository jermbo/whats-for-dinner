---
title: Take a meal from the open package
summary: "The end of a meal takes food from the open package first, rounds a level to a quarter, and marks food that compares with nothing as 'to check'."
parent: pantry-stories.md
updated: 2026-10-19
persona: Cook
depends-on: [pantry-keep-a-level-or-a-count.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Take a meal from the open package

# Take a meal from the open package

As the [cook](../../personas.md), I want the end of a meal to use up the open carton before the new one, so that the pantry stays close to the truth with no work.

## Requirements

1. The end of a meal takes from the packages in this sequence (decision 9)
   - a. An open package before a full one
   - b. Then the package with the first use-by date. A package with no date is last
   - c. Then the row that is higher in the table
2. It converts the amount of the recipe to a part of the package (decision 7)
   - a. A volume and a weight compare by the rule 1 ml = 1 g (decision 33)
   - b. It takes all that a package has before it goes to the next package
3. After a meal, a measured package goes to the nearest level (decision 7)
   - a. The middle of two levels goes up
   - b. A package with food left is `1/4` or more
   - c. A package that a meal took from is `3/4` or less (decision 8)
4. A counted package loses the count of the recipe, and a package at 0 goes out of the table (decision 11)
5. An ingredient that compares with nothing does not change its food item (decisions 10 and 33)
   - a. The food item gets the property `check: true` (decision 35)
   - b. The last page of Cook Mode shows it in the line "Not counted", as today
6. The check boxes, the rating, and the record of the last page stay as today

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN Boiled eggs, with 4 eggs WHEN the cook taps the button of the last page THEN `Eggs.md` has only the row `Fridge | 12 | 12 | 2026-11-16`
2. GIVEN Super Test Recipe, with 2 eggs WHEN the cook ends the meal THEN `Eggs.md` has `Fridge | 2 | 12 | 2026-10-25` and `Fridge | 12 | 12 | 2026-11-16`
3. GIVEN Super Test Recipe, with 1/2 cup of milk WHEN the cook ends the meal THEN `Milk.md` has `Fridge | 1/4 | 1 gal | 2026-10-22`
   - a. AND the row `Fridge | full | 1 gal | 2026-10-29` is as before
4. GIVEN Super Test Recipe, with 200 g of flour WHEN the cook ends the meal THEN `Flour.md` has `Kitchen pantry | 3/4 | 1 kg |`
5. GIVEN Pancakes, with 1 tablespoon of sugar WHEN the cook ends the meal THEN `Sugar.md` has `Kitchen pantry | 1/4 | 1 kg |`
6. GIVEN Pasta with tomato sauce, with 1 onion WHEN the cook ends the meal THEN the table of `Onions.md` is as before
   - a. AND `Onions.md` has the property `check: true`
7. GIVEN `Milk.md` with only `Fridge | 1/4 | 1 gal` and a recipe with 4 cups of milk WHEN the cook ends the meal THEN `Milk.md` has no row

## Depends on

- [Keep a level or a count](pantry-keep-a-level-or-a-count.md): the packages that a meal takes from.

## Architecture

- [End of a meal](../../architecture/end-of-a-meal.md): the sequence, the rounding, and "to check".
- [Match](../../architecture/match.md): what compares.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 7 to 10, 33, and 35.
