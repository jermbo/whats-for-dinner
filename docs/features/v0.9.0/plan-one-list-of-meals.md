---
title: One list of meals
summary: "The planner sees the meals of the week in one list, with no group by type, and adds a meal from a button that stays at the top."
parent: plan-stories.md
updated: 2026-10-21
persona: Planner
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Plan stories](plan-stories.md) / One list of meals

# One list of meals

As the [planner](../../personas.md), I want the meals of the week in one list, with one button to add a meal, so that I understand the Plan with no explanation.

## Requirements

1. The Plan shows each meal that you did not cook in one list
   - a. The list has no group by type, and no room such as "2/7"
   - b. A type has no limit of meals
   - c. The list has the sequence of the plan note
2. Each card has a small label with the type of its recipe, such as "Breakfast"
   - a. The type is the first tag of the recipe, as today
3. Each card keeps its facts and its stickers: the count, "2 to buy" or "All in the pantry", "1 to check", "Uses … soon", and the preparation
4. "Add a meal" is the first control below the head of the Plan
   - a. It is in the same place with 0 meals and with 20 meals
   - b. It opens the Recipes part, with the sequence "Best for the pantry" and no filter
   - c. The recipe card adds a meal to the plan, as today
5. The Plan has no bar: no find field, no sequence, and no filters
6. The Plan has no group "Ideas for your pantry"
7. With no meal, the Plan shows one line, "No meals planned.", below "Add a meal"

## Acceptance criteria

Each criterion starts with the plan note of the test vault: Banana oat muffins, Mashed potatoes, Pancakes, and Spinach omelette, none of them cooked.

1. GIVEN the plan note of the test vault WHEN the planner opens the Plan THEN the Plan shows 4 cards in one list, in the sequence of the note
   - a. AND the Plan shows no group head "Breakfast" or "Side"
   - b. AND the Plan shows no "2/7"
2. GIVEN the Plan shows Pancakes WHEN the planner looks at its card THEN the card has the label "Breakfast"
3. GIVEN the Plan shows Mashed potatoes WHEN the planner looks at its card THEN the card has the label "Side"
4. GIVEN the plan has 7 meals with the tag "dinner" WHEN the planner adds Beef tacos from its recipe card THEN the Plan shows 8 dinner meals
   - a. AND no notice tells that the week has 7 meals of the type
5. GIVEN the Plan WHEN the planner taps "Add a meal" THEN the Recipes part opens with the sequence "Best for the pantry"
   - a. AND the bar of the Recipes part has no filter on
6. GIVEN the Plan has 0 meals WHEN the planner opens the Plan THEN "Add a meal" is the first control below the head
   - a. AND the Plan shows "No meals planned."
7. GIVEN the Plan has 12 meals WHEN the planner opens the Plan THEN "Add a meal" is the first control below the head
8. GIVEN the Plan WHEN the planner looks at the top THEN the Plan shows no find field, no sequence, and no filter chips
9. GIVEN the Plan has 4 meals WHEN the planner scrolls to the end THEN the Plan shows no group "Ideas for your pantry"

## Depends on

Nothing.

## Architecture

- [Plan](../../architecture/plan.md): why the week is a set of options.
- [Recipes](../../architecture/recipes.md): the sequence "Best for the pantry".
- [Decision log: meal plan](../../initiatives/meal-plan/decision-log.md): decisions 8, 9, and 11.
