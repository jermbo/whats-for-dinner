---
title: A cooked meal leaves
summary: "After the cook finishes a meal, the meal and its sides leave the plan note. The meals that were not cooked stay, and the Plan has no new week."
parent: plan-stories.md
updated: 2026-10-21
persona: Cook
depends-on: [plan-the-sides-of-a-meal.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Plan stories](plan-stories.md) / A cooked meal leaves

# A cooked meal leaves

As the [cook](../../personas.md), I want a meal to leave the plan after I cook it, so that the plan shows only the options that are left.

## Requirements

1. At the end of Cook Mode for a main dish, its task leaves the plan note
   - a. Each side of the task leaves with it
   - b. Your own text of the note stays
2. At the end of Cook Mode for a side, the plan note does not change
3. The record of the meal in the recipe note does not change: one line below "Cooked", as today
4. The Plan has no group "Cooked", and no "Cook again"
5. The Plan has no "Start a new week"
6. A meal that you did not cook stays in the plan note until you cook it or tap "Remove"
7. The plugin reads a task with a mark, `- [x]`, as a meal that left: it is not in the Plan, and its food is not on the list

## Acceptance criteria

Each criterion starts with the plan note of the test vault, with Beef tacos added, and Honey glazed carrots as its side.

1. GIVEN Beef tacos has the flag for tonight WHEN the cook finishes Cook Mode for Beef tacos THEN the plan note has no line of Beef tacos
   - a. AND the plan note has no line of Honey glazed carrots
   - b. AND the Plan shows 4 cards
   - c. AND the recipe note of Beef tacos has one new line below "Cooked"
2. GIVEN Beef tacos is in the plan WHEN the cook finishes Cook Mode for Honey glazed carrots THEN the plan note did not change
3. GIVEN the cook finished Beef tacos WHEN the cook opens Shop THEN the list has no row for Beef tacos
4. GIVEN the Plan WHEN the planner scrolls to the end THEN the Plan shows no "Start a new week" and no group "Cooked"
5. GIVEN the plan note has `- [x] [[Recipes/Pancakes|Pancakes]]` WHEN the planner opens the Plan THEN the Plan shows no card of Pancakes
6. GIVEN the plan note has the line `Mum comes on Friday.` WHEN the cook finishes Beef tacos THEN `Mum comes on Friday.` is still in the note

## Depends on

- [The sides of a meal](plan-the-sides-of-a-meal.md): the sides that leave with their main dish.

## Architecture

- [End of a meal](../../architecture/end-of-a-meal.md): what Cook Mode writes when you finish.
- [Plan note](../../architecture/plan-note.md): what the plugin changes in the note.
- [Decision log: meal plan](../../initiatives/meal-plan/decision-log.md): decisions 10, 12 d, and 12 f.
