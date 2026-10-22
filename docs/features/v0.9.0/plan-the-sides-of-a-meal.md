---
title: The sides of a meal
summary: "The planner adds a side to a meal, as a recipe or as a name. The side is an indented line in the plan note, and its food goes on the list."
parent: plan-stories.md
updated: 2026-10-21
persona: Planner
depends-on: [plan-one-list-of-meals.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Plan stories](plan-stories.md) / The sides of a meal

# The sides of a meal

As the [planner](../../personas.md), I want to add sides to a meal, so that I see the complete meal and buy the food for each dish.

## Requirements

1. Each card has "+ Side"
2. Tap "+ Side" to open a field below the sides of the card
   - a. The field finds the recipes by name, the recipes with the type "side" first
   - b. A tap on a recipe adds it as a side
   - c. A name with no recipe, such as "Salad", is a side when you tap "Add "Salad""
   - d. The field closes after the side is added
3. The card shows each side below the name of its main dish
   - a. A side that is a recipe shows its count, such as "3/5"
   - b. A side with no recipe shows only its name
   - c. "2 to buy" on the card counts the dishes of the full meal
4. Each side has "Remove", which takes it off the meal
5. Each side that is a recipe has "Cook", with or with no flag on its meal
   - a. "Cook" opens Cook Mode for the side
   - b. "Cook" of the card opens Cook Mode for the main dish
6. The plan note has each side as an indented line below the task of its main dish
   - a. A side that is a recipe is a link: `	- [[Recipes/Honey glazed carrots|Honey glazed carrots]]`
   - b. A side with no recipe is text: `	- Salad`
   - c. An indented line below a task is a side of that task. Each other line is your own text
   - d. The plugin changes only the lines of the meals and their sides
7. The food of each side that is a recipe goes on the list, as the food of a meal does
   - a. A row of the list names the main dish as its meal

## Acceptance criteria

Each criterion starts with the plan note of the test vault, with Beef tacos added.

1. GIVEN the Plan shows Beef tacos WHEN the planner taps "+ Side" and types "carr" THEN the field shows Honey glazed carrots
2. GIVEN the field of Beef tacos is open WHEN the planner types nothing THEN Honey glazed carrots and Mashed potatoes are the first recipes
3. GIVEN the field shows Honey glazed carrots WHEN the planner taps it THEN the card of Beef tacos shows Honey glazed carrots below its name
   - a. AND the plan note has `	- [[Recipes/Honey glazed carrots|Honey glazed carrots]]` on the line below the task of Beef tacos
   - b. AND the field is closed
4. GIVEN the field of Beef tacos is open WHEN the planner types "Salad" and taps "Add "Salad"" THEN the card shows "Salad" with no count
   - a. AND the plan note has `	- Salad` below the line of Honey glazed carrots
5. GIVEN Beef tacos has the side Honey glazed carrots WHEN the planner taps "Remove" on the side THEN the card has no side
   - a. AND the plan note has no line of Honey glazed carrots
   - b. AND the task of Beef tacos did not change
6. GIVEN Beef tacos has the side Honey glazed carrots and the pantry has no carrots WHEN the shopper opens Shop THEN the list has carrots
   - a. AND the row of carrots names Beef tacos
7. GIVEN Beef tacos has the side Honey glazed carrots and no flag WHEN the cook taps "Cook" on Honey glazed carrots THEN Cook Mode opens Honey glazed carrots
8. GIVEN the plan note has the line `Mum comes on Friday.` below the last task WHEN the planner adds a side to the last meal THEN `Mum comes on Friday.` is still in the note, below the side

## Depends on

- [One list of meals](plan-one-list-of-meals.md): the card that gets the sides.

## Architecture

- [Plan note](../../architecture/plan-note.md): the form of a task, and what the plugin changes.
- [Shopping](../../architecture/shopping.md): the list is the plan minus the pantry.
- [Glossary: meal plan](../../initiatives/meal-plan/glossary.md): meal, dish, main dish, and side.
- [Decision log: meal plan](../../initiatives/meal-plan/decision-log.md): decisions 3, 7, 12 a, and 12 b.
