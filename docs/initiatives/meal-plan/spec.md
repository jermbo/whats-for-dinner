---
title: "Spec: meal plan"
summary: "The scope that is agreed for the weekly Plan: one list of meals as options, a meal with its sides, ideas behind one button, and no week to reset."
parent: decision-log.md
status: agreed
---

[Wiki](../../README.md) / [Decision log: meal plan](decision-log.md) / Spec: meal plan

# Spec: meal plan

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

The planner plans the week at a calm moment, but the Plan needs an explanation first: what each group by type means, where a meal goes, and why a meal needs "Today". A meal is one recipe, so a dinner with a side is two meals that the screen does not connect. The ideas go down the screen with each meal that the planner adds.

## The solution

The planner adds meals to one list, each meal with its sides, and with no group to select. On the day, the cook can flag one of the meals for tonight. It is at the top, with its preparation. Each meal has Cook, with or with no flag. The meals that were not cooked stay as options for the next days.

An example: on Sunday the planner adds beef tacos with honey glazed carrots, and chicken curry. On Tuesday morning the cook flags the tacos for tonight. They are at the top, in "Tonight", with the preparation for the beef in the freezer. After the meal, the tacos and the carrots leave the plan, and the curry is still an option on Wednesday.

## In scope

1. The Plan is one list of meals, with no group by type and no room (decision 9)
   - a. Each card has a small label with its type, such as "Breakfast" (decision 9)
   - b. The same list holds dinners, breakfasts, lunches, and snacks (decision 9)
2. A meal is a main dish and its sides, on one card (decisions 3 and 7)
   - a. The card has "+ Side". A side is a recipe, or a name with no recipe (decision 7)
   - b. The planner removes a side from its card (decision 12 a)
   - c. Each card has Cook. Cook on a meal opens its main dish, and each side that is a recipe has its own Cook (decisions 6 and 12 b)
3. The week is a set of options, and the cook can flag one of them for tonight (decision 6)
   - a. The flagged meal is in the section "Tonight" at the top, as a large dark card (decision 6)
   - b. With no flag, the Plan has no section "Tonight" (decision 6)
   - c. One meal has the flag at a time (decision 6)
   - d. The card of the flagged meal shows its preparation (decision 6)
   - e. A flag of a day that is past has no effect (decision 12 c)
4. "Add a meal" is at the top of the Plan, in a fixed place (decision 8)
   - a. It opens the recipes, with the ideas for the pantry first (decision 8)
5. The Plan has no find field, no sequence, and no filters (decision 11)
   - a. Each card shows its stickers, such as "Uses spinach soon" and "Prep to do" (decision 11)
6. A meal that is cooked leaves the plan (decision 10)
   - a. Its sides leave with it (decision 12 d)
   - b. The note of the recipe keeps the record below "Cooked", as today (decision 10)
   - c. A meal that is not cooked stays until the cook cooks it or the planner removes it (decision 10)
7. The plan note holds each side as an indented line below the task of its main dish (decision 7)
8. The food of each side goes on the list, as the food of a meal does (decision 7)
9. The part keeps the name "Plan" (decision 12 e)

## Out of scope

1. The holiday planner, and an occasion in the Plan (decision 1; see the [holiday planner](../holiday-planner/decision-log.md))
2. A fixed day for each meal, and a day in advance (decision 6)
3. A side as a meal of its own (decision 7)
4. A row of ideas on the Plan screen (decision 8)
5. Groups by type, with or with no room (decision 9)
6. A cooked meal with a line through it, and "Start a new week" (decision 10)
7. The find field, the sequences, and the filters of the bar of today (decision 11)
8. A change of Cook Mode, or of the end of a meal in the recipe note (decision 12 f)

## What changes in the system

Architecture pages that change:

- [Plan](../../architecture/plan.md): one list, meals with sides, the selection on the day, and no new week.
- [Plan note](../../architecture/plan-note.md): the indented line of a side, and a task that leaves after the meal.
- [End of a meal](../../architecture/end-of-a-meal.md): the meal and its sides leave the plan note.
- [Shopping](../../architecture/shopping.md): the food of the sides is on the list.
- [Recipes](../../architecture/recipes.md): "Add a meal" opens the recipes with the ideas first.
- The wiki [glossary](../../glossary.md): "meal" and "week" change, and "dish", "main dish", and "side" are new, from the [glossary](glossary.md) of this initiative. The [features](../../features/README.md) page.

Notes and data that get a different form:

- **The plan note** gets indented lines for the sides. A task with a mark is not used any more: a cooked meal leaves the note.

```markdown
- [ ] [[Recipes/Beef tacos|Beef tacos]] · 2026-10-27 · prep done
	- [[Recipes/Honey glazed carrots|Honey glazed carrots]]
	- Salad
- [ ] [[Recipes/Chicken curry|Chicken curry]]
```

## How you test it

Checks that need the phone:

1. A person who has not seen the plugin plans a dinner with a side, and selects it for today, with no explanation.
2. The planner adds 8 meals, and "Add a meal" is still at the top, in the same place.
3. The plan note, read with no plugin, shows each meal with its sides.

Rules that are worth an automatic test, each with the place where a test sees the behaviour from outside:

1. **The plan note.** The text of the note goes in. The meals come out, each with its sides, its day, and its preparation.
2. **A change of the plan.** The text of the note and one action go in: add a side, remove a side, the flag for tonight, or the end of a meal. The new text of the note comes out, with your own text unchanged.
3. **The list.** The meals with their sides and the pantry go in. The rows of the list come out, with the food of the sides.

## Further reading

- [Glossary: meal plan](glossary.md): the words of this page.
- [Decision log: holiday planner](../holiday-planner/decision-log.md): the other half of the work on meals.
