---
title: Plan
summary: "How the week works: one list of meals as options, each meal with its sides, a flag for tonight, and no week to reset."
parent: ../README.md
updated: 2026-10-21
---

[Wiki](../README.md) / Plan

# Plan

At 18:00, after a hard day, you cannot decide what to cook. So you decide at a calm moment, for the full week. This page tells how the plan holds those decisions, and why a meal has no fixed day.

## The week is a set of options

The Plan is one list of meals. You add meals on Sunday, and on each day you select one of them. The plan does not tell you what to eat on Tuesday: it gives you options that you chose when you were calm. If one option does not work today, the others are still there.

The list has no group by type and no limit, and a meal has no day. Each card has a small label with its type, such as "Breakfast": the first tag of its [recipe](recipes.md). So the same list holds the dinners, and also the breakfasts, the lunches, and the snacks when you plan them.

## A meal is a main dish and its sides

A dinner is usually more than one dish. So a meal is a main dish, such as beef tacos, and its sides, such as honey glazed carrots and a salad. The card shows the main dish, and each side below it.

"+ Side" on a card adds a side. A side is a recipe, or only a name, such as "Salad", when you need no recipe. A side that is a recipe has its count, and its food goes on the [list](shopping.md). A side with only a name needs nothing from the pantry.

## You flag the meal for tonight

On the day, you tap "☆ Tonight" on the meal that you plan to cook. It goes into the section "Tonight" at the top of the Plan, as a large dark card, and the other meals are below it as "Other options". So you see at a glance what you selected. One meal has the flag at a time: a new flag takes the old one off. A second tap takes the flag off, and the meal goes back into the list.

The flag is optional. Each card has "Cook", with or with no flag, so a change of mind needs no step. "Cook" opens the main dish in [Cook Mode](cook-mode.md). Each side that is a recipe has its own "Cook".

The flag has an effect only on its day. On the next day, the meal is an option again.

## Preparation comes before the meal

Some meals need work before you can cook, such as beef that must come out of the freezer. A recipe tells this in a callout of the type "prep", its [preparation](preparation.md). The flagged meal shows the preparation, with a check box, and each other card shows the sticker "Prep". So when you flag a meal in the morning, you see in time what it needs.

## The card tells what is missing

Each meal shows its count, such as "7 of 9", and what that means for the full meal: "2 to buy", or "All in the pantry". When the plugin cannot [count](match.md) a line, such as 1 onion against 500 g, the card adds "1 to check". The sticker "Uses spinach soon" shows a meal that uses food near its date. You see on Sunday what to look at, not at the stove.

The Plan has no find field, no sequence, and no filters. A week has 7 to 10 meals, and the cards show their facts.

## "Add a meal" opens the recipes

"Add a meal" is the first control of the Plan, in the same place with 0 meals or 20. It opens the [Recipes](recipes.md) part in the sequence "Best for the pantry", so the recipes that use up your food come first. The recipe card adds the meal.

## A cooked meal leaves

When you finish Cook Mode for the main dish, the meal and its sides leave the plan. The record of the meal stays in the recipe note, below "Cooked", as the [end of a meal](end-of-a-meal.md) tells. A meal that you did not cook stays as an option until you cook it or tap "Remove". So the plan has no "new week" to start: you add meals when you plan, and the plan is never empty by accident.

## The plan is one note

The plan is one note, the [plan note](plan-note.md). It has one task for each meal, and one indented line for each side:

```markdown
- [ ] [[Recipes/Beef tacos|Beef tacos]] · 2026-10-21 · prep done
	- [[Recipes/Honey glazed carrots|Honey glazed carrots]]
	- Salad
```

The date is the day on which you flagged the meal for tonight. The words "prep done" tell that you confirmed the preparation.

The plugin changes only these lines. All other text of the note stays, so the note can also have your own text for the week.

## Further reading

- [Shopping](shopping.md): what the plan puts on the shopping list.
- [Cook Mode](cook-mode.md): what the button "Cook" opens.
