---
title: See food of a meal that is past its date
summary: "The planner gets a suggestion for food that a meal needs, when the pantry has it past its use-by date."
parent: shop-stories.md
persona: Planner
depends-on: [shop-see-the-staples-that-need-a-look.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / See food of a meal that is past its date

# See food of a meal that is past its date

As the [planner](../../personas.md), I want a suggestion for food that a meal needs when the pantry has it past its use-by date, so that I look at the food before the day on which I cook.

## Requirements

1. Food that a meal of the week needs is a suggestion when one of its rows is past its use-by date
   - a. A date before today is past. The date of today is not
   - b. The food item can be a staple or not
   - c. A meal that you cooked does not count
   - d. Food that is a task of the open note is not a suggestion
2. The suggestion shows the reason "Past its date", and the same facts as the suggestion of a staple
   - a. A staple that is out or low keeps the reason "Out" or "Low"
3. Tap "Add" to put the food item on the list as a choice
   - a. The amount of the row is what the meals need, with no regard to the pantry
   - b. For a staple, the row has the larger of two amounts: what the meals need, and what makes the food item full
4. Tap "Skip" to take the suggestion out of the group, as for a staple
5. The list counts the pantry as before
   - a. Food that is past its date is food that the pantry has

## Acceptance criteria

Each criterion starts with the test vault, with no open note. The chicken curry is in the plan and needs 500 g of chicken thighs. The pantry has 500 g of chicken thighs in "Outside fridge", with the use-by date 2026-10-13. The spinach omelette is in the plan and needs 100 g of spinach. The pantry has 200 g of spinach with the date 2026-10-13, and 300 g with the date 2026-10-18.

1. GIVEN today is 2026-10-14 WHEN the planner opens the Shop part THEN the group "Suggestions" has a line for chicken thighs
   - a. AND its reason is "Past its date"
2. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the group has no line for chicken thighs
3. GIVEN today is 2026-10-14 WHEN the planner opens the Shop part THEN the group has a line for spinach
4. GIVEN today is 2026-10-14, and the chicken curry is a meal that you cooked WHEN the planner opens the Shop part THEN the group has no line for chicken thighs
5. GIVEN today is 2026-10-14, and the open note has a task for chicken thighs WHEN the planner opens the Shop part THEN the group has no line for chicken thighs
6. GIVEN today is 2026-10-14 WHEN the planner opens the Shop part THEN the list has no row "Chicken thighs"
7. GIVEN today is 2026-10-14 WHEN the planner taps "Add" on chicken thighs THEN the open note has the line `- [ ] [[Pantry/Chicken thighs|Chicken thighs]]`
   - a. AND the list has the row "Chicken thighs" with "500 g"
8. GIVEN today is 2026-10-14 WHEN the planner taps "Add" on spinach THEN the list has the row "Spinach" with "100 g"
9. GIVEN today is 2026-10-14 WHEN the planner taps "Skip" on chicken thighs THEN the group has no line for chicken thighs
   - a. AND the open note has no task for chicken thighs

## Depends on

- [See the staples that need a look](shop-see-the-staples-that-need-a-look.md): the group "Suggestions", with "Add" and "Skip".

## Architecture

- [Use soon](../../architecture/use-soon.md): the use-by date of a row, and the badge "Past its date" of the pantry.
- [Shopping](../../architecture/shopping.md): how the list counts what the pantry has.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 8, with the reason. It is a page of the initiative.
