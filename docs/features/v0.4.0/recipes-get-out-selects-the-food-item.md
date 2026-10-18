---
title: Get out selects the food item
summary: "When an ingredient fits two food items, the page Get out selects the one to use first, and the last page takes the food out of it."
parent: recipes-stories.md
persona: Cook
depends-on: []
status: built
updated: 2026-10-18
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Get out selects the food item

# Get out selects the food item

As the [cook](../../personas.md), I want the page "Get out" to select the food item to use when an ingredient fits two of them, and to mark the one that is on my counter, so that the food is used wisely and the last page asks nothing more.

## Requirements

1. On "Get out", a line that fits two food items or more shows each of them as an option
   - a. One food item is selected before you tap
   - b. Tap a different option to select it, and to mark it as on the counter
2. The plugin selects with these rules, in this sequence. A rule that gives one food item decides
   - a. The food item with the earliest use-by date. A food item with no date comes after each food item with a date
   - b. The food item that the recipe uses up: the amount of the ingredient is the same as, or more than, what the pantry has of it
   - c. The food item that the pantry has the most of
3. "Next" works with a choice that you did not make
   - a. Until you tap, the line shows "Which one?" in the accent colour
   - b. After a tap, "Which one?" goes away, with a short fade. With "Reduce motion", it goes with no motion
4. The last page takes the amount out of the selected food item
   - a. The last page shows the selected food item, and it does not ask for a food item
   - b. A line with one food item works as today

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs). "Pasta with tomato sauce" uses 300 g of pasta. Elbow pasta has 2300 g in "Kitchen pantry", and shell pasta has 500 g in "Kitchen", each with no use-by date.

1. GIVEN Cook Mode of "Pasta with tomato sauce" WHEN the cook looks at the line "pasta" on "Get out" THEN it shows the options "Elbow pasta" and "Shell pasta"
   - a. AND "Elbow pasta" is selected
   - b. AND the line shows "Which one?"
2. GIVEN shell pasta has 200 g WHEN the cook opens "Get out" THEN "Shell pasta" is selected
3. GIVEN shell pasta has the use-by date 2026-11-01 WHEN the cook opens "Get out" THEN "Shell pasta" is selected
4. GIVEN elbow pasta has the use-by date 2026-10-25, and shell pasta has 200 g WHEN the cook opens "Get out" THEN "Elbow pasta" is selected
5. GIVEN "Elbow pasta" is selected WHEN the cook taps "Shell pasta" THEN "Shell pasta" is selected and marked as on the counter
   - a. AND the line does not show "Which one?"
6. GIVEN the line "pasta" shows "Which one?" WHEN the cook taps "Next" THEN Cook Mode shows step 1
7. GIVEN "Shell pasta" is selected WHEN the cook taps "Update the pantry" on the last page THEN shell pasta has 200 g in "Kitchen"
   - a. AND elbow pasta still has 2300 g
8. GIVEN Cook Mode of "Pasta with tomato sauce" WHEN the cook opens the last page THEN the line "pasta" shows "Elbow pasta"
   - a. AND the line has no list to select a food item

## Depends on

Nothing. This story can start now.

## Architecture

- [Cook Mode](../../architecture/cook-mode.md): the page "Get out", which this story changes.
- [End of a meal](../../architecture/end-of-a-meal.md): the last page, which today asks for the food item.
- [Use soon](../../architecture/use-soon.md): the use-by date.
- [Match](../../architecture/match.md): an ingredient that fits two food items.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 6.
