---
title: Shop for an occasion
summary: "The planner sees what the occasion needs to buy, and the food of your dishes goes on the shopping list from 7 days before the day, at its scale."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-see-an-occasion.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Shop for an occasion

# Shop for an occasion

As the [planner](../../personas.md), I want to see what my dishes of the occasion need, and to get that food on the list from 7 days before the day, so that I buy it with my other food and not five weeks early.

## Requirements

1. The food of your dishes with no mark goes on the list from 7 days before the date, up to the end of the day after the date
   - a. Each ingredient counts its amount times the scale of its dish
   - b. A dish of a different person puts no food on the list
   - c. A dish with a mark puts no food on the list
   - d. A note with no date puts no food on the list by itself
2. The list adds the food of the occasion to the food of the week, and then takes off the pantry
   - a. One food item is one row, also when the week and the occasion need it
   - b. A row names the occasion as its reason, as a row names its meal
   - c. In the sequence "By meal", the occasion has one bin with its name
3. The part has the section "To buy", below the dishes
   - a. It has each row that the list has, or would have, for the food of the occasion
   - b. Each row shows the name of the food item and the amount that is missing
   - c. With no row, the section shows "All in the pantry"
4. Before the 7 days, each row of "To buy" has "Add to the list"
   - a. "Add to the list" adds the food item as an extra to the next trip, as "Add to the list" in the Pantry part does
   - b. A row whose food item is on the list shows "On the list" in place of the button
   - c. On a tap, the check of the button draws, and the button becomes "On the list"
5. From the 7 days, each row of "To buy" shows "On the list"

## Acceptance criteria

Each criterion starts with the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives it: the note "Thanksgiving 2026", the meal "Black bean soup" in the plan, 2 apples, and 450 g of carrots.

1. GIVEN today is 2026-11-18 WHEN the planner opens the Shop THEN the list has no row with the reason "Thanksgiving 2026"
2. GIVEN today is 2026-11-19 WHEN the planner opens the Shop THEN the list has the row "Apples" with the reason "Thanksgiving 2026"
   - a. AND the list has the row "Carrots" with the reason "Thanksgiving 2026"
3. GIVEN today is 2026-11-27 WHEN the planner opens the Shop THEN the list has the row "Apples" with the reason "Thanksgiving 2026"
4. GIVEN today is 2026-11-28 WHEN the planner opens the Shop THEN the list has no row with the reason "Thanksgiving 2026"
5. GIVEN today is 2026-11-10 WHEN the planner opens the part THEN "To buy" has "Apples" with the amount 2
   - a. AND "To buy" has "Carrots" with the amount 550 g
   - b. AND each row has "Add to the list"
6. GIVEN the line `- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side` WHEN the planner opens the part THEN "To buy" has "Carrots" with the amount 50 g
7. GIVEN the line `- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · Mum` and today is 2026-11-19 WHEN the planner opens the Shop THEN the list has no row "Apples"
   - a. AND "To buy" has no row "Apples"
8. GIVEN the line `- [x] [[Recipes/Apple crumble|Apple crumble]] · dessert` and today is 2026-11-19 WHEN the planner opens the Shop THEN the list has no row "Apples"
9. GIVEN the plan also has the meal "Apple crumble" and today is 2026-11-19 WHEN the planner opens the Shop THEN the list has one row "Apples"
   - a. AND the row names "Apple crumble" and "Thanksgiving 2026"
   - b. AND "To buy" has "Apples" with the amount 6
10. GIVEN today is 2026-11-19 WHEN the planner selects the sequence "By meal" THEN the Shop has the bin "Thanksgiving 2026" with "Apples" and "Carrots"
11. GIVEN today is 2026-11-10 WHEN the planner taps "Add to the list" on "Apples" THEN the next trip has a task with no mark for "Apples"
    - a. AND the row "Apples" of "To buy" shows "On the list"
    - b. AND the list has the row "Apples"
12. GIVEN today is 2026-11-20 WHEN the planner opens the part THEN each row of "To buy" shows "On the list"
    - a. AND no row has "Add to the list"
13. GIVEN a note "Game night" with no date and the line `- [ ] [[Recipes/Apple crumble|Apple crumble]]` WHEN the planner opens the Shop THEN the list has no row with the reason "Game night"
    - a. AND the row "Apples" of its "To buy" has "Add to the list"
14. GIVEN the pantry has 10 apples and 1000 g of carrots WHEN the planner opens the part THEN "To buy" shows "All in the pantry"

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the part, and the reading of the scale, the person, and the mark of a dish.

## Architecture

- [Shopping](../../architecture/shopping.md): how the list is the plan minus the pantry, and how a row names its meal.
- [Shopping note](../../architecture/shopping-note.md): the task that "Add to the list" adds.
- [Amounts](../../architecture/amounts.md): which amounts add up and compare.
