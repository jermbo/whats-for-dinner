---
title: Decide the extras before the trip
summary: "The planner sees that the meals are on the list already, with the low staples that they need, and decides only the suggestions and the items of their own, in the stage Extras."
parent: shop-stories.md
updated: 2026-10-17
persona: Planner
depends-on: [shop-move-between-the-three-stages.md, shop-see-the-staples-that-need-a-look.md, shop-see-food-of-a-meal-that-is-past-its-date.md, shop-add-an-item-of-your-own.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Decide the extras before the trip

# Decide the extras before the trip

As the [planner](../../personas.md), I want the first stage to show only what the plugin cannot decide, so that I see that the meals are on the list already, and I spend my time on the staples and my own items.

## Requirements

1. The stage Extras has one line at the top for the meals
   - a. The text has the number of the rows of the list that a meal needs, such as "Your meals: 2 items on the list"
   - b. With one row, the text is "Your meals: 1 item on the list"
   - c. With no such row, the text is "Your meals: nothing to buy"
   - d. Tap the line to open the stage Shop
2. The stage Extras has the group "Suggestions" and the field "Add an item"
   - a. The field is above the group, so that the keyboard of a phone does not hide it
   - b. With no suggestion, the stage says "No food needs a look.", and the field stays
   - c. The field "Add an item" is in this stage only
   - d. The field does not take the cursor when the stage opens
3. A staple that a meal needs, and that is low or out, is on the list with no action
   - a. The row has the larger of two amounts: what the meals need, and what makes the staple full
   - b. The row shows its meals, and no sticker "Low"
4. Food that a meal puts on the list is not a suggestion
   - a. This holds for a staple, and for food of a meal that is past its date
   - b. When no meal needs the food any more, it is a suggestion again, if it still needs a look
5. Tap "Add" on a suggestion to put it on the list as an extra
   - a. The line slides out of the group in 0.2 s
   - b. With less motion, the line goes with no slide

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-13, with no open note. Two staples of the vault have a part in them:

| Note       | `staple`    | What the vault has                                         |
| ---------- | ----------- | ---------------------------------------------------------- |
| `Avocados` | `sometimes` | No row. The full amount is 4.                              |
| `Eggs`     | `often`     | 2 eggs. The full amount is 30, and the low line is 4 eggs. |

The guacamole needs 2 avocados, the boiled eggs need 4 eggs, and the pancakes need 1 egg.

1. GIVEN the list has 2 rows of a meal WHEN the planner opens the stage Extras THEN the line at the top is "Your meals: 2 items on the list"
2. GIVEN the list has 2 rows of a meal, and the shopper put one of them in the cart WHEN the planner opens the stage Extras THEN the line at the top is "Your meals: 1 item on the list"
3. GIVEN the plan has no meal WHEN the planner opens the stage Extras THEN the line at the top is "Your meals: nothing to buy"
4. GIVEN the stage Extras is open WHEN the planner taps the line of the meals THEN the stage Shop is open
5. GIVEN the plan has no meal WHEN the planner opens the stage Extras THEN the group "Suggestions" has the line "Avocados" with the reason "Out"
   - a. AND the line "Eggs" with the reason "Low"
6. GIVEN the guacamole is in the plan WHEN the planner opens the stage Extras THEN the group "Suggestions" has no line for avocados
   - a. AND the list has the row "Avocados" with "4"
7. GIVEN the boiled eggs are in the plan WHEN the planner opens the stage Extras THEN the group "Suggestions" has no line for eggs
   - a. AND the list has the row "Eggs" with "28"
   - b. AND the row "Eggs" shows "Boiled eggs"
   - c. AND the row "Eggs" has no sticker
8. GIVEN the pancakes are the only meal of the plan WHEN the planner opens the stage Extras THEN the group "Suggestions" has no line for eggs
   - a. AND the list has the row "Eggs" with "28"
9. GIVEN the pantry has 10 eggs, and the pancakes are the only meal of the plan WHEN the planner opens the stage Extras THEN the list has no row "Eggs"
   - a. AND the group "Suggestions" has the line "Eggs" with the reason "Often"
10. GIVEN the boiled eggs are in the plan WHEN the planner takes the boiled eggs out of the plan THEN the group "Suggestions" has the line "Eggs" with the reason "Low"
11. GIVEN today is 2026-10-14, the chicken curry is in the plan and needs 500 g of chicken thighs, and the pantry has 200 g of chicken thighs with the use-by date 2026-10-13 WHEN the planner opens the stage Extras THEN the group "Suggestions" has no line for chicken thighs
    - a. AND the list has the row "Chicken thighs" with "300 g"
12. GIVEN the planner skipped each suggestion WHEN the planner opens the stage Extras THEN the stage says "No food needs a look."
    - a. AND the field "Add an item" shows
13. GIVEN the group "Suggestions" has 6 lines WHEN the planner opens the stage Extras on a phone of 380 by 685 CSS pixels THEN the field "Add an item" is in view with no scroll
14. GIVEN the stage Shop is open WHEN the shopper opens the stage Extras THEN the field "Add an item" does not have the cursor
15. GIVEN the stage Shop is open WHEN the shopper looks at the stage THEN it has no field "Add an item"

## Depends on

- [Move between the three stages of a trip](shop-move-between-the-three-stages.md): the stage Extras, and the strip that opens the stage Shop.
- [See the staples that need a look](shop-see-the-staples-that-need-a-look.md): the group "Suggestions". This story changes its requirement 1: a low staple that a meal needs is a row of the list, not a suggestion.
- [See food of a meal that is past its date](shop-see-food-of-a-meal-that-is-past-its-date.md): the reason "Past its date". This story changes its requirement 1 in the same way.
- [Add an item of your own](shop-add-an-item-of-your-own.md): the field "Add an item", which moves into the stage Extras.

## Architecture

- [Shopping](../../architecture/shopping.md): how the meals put food on the list with no action from you.
- [Suggestions](../../architecture/suggestions.md): the rule that decides that food needs a look.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decisions 34 and 36, with the reason for the stage and for the rule. It is a page of the initiative.
