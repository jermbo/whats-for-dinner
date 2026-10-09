---
title: Meal plan gaps
summary: 'The flow of four steps that the design has for the week, the rule that a night is a proposal, and the five steps that add them.'
parent: gap-plan.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / [Gap plan](gap-plan.md) / Meal plan gaps

# Meal plan gaps

In the design, you plan the week in four steps, and the flow has an end: "Menu set. 5 dinners. 9 things to buy." In the app, Menu is one screen. You add meals, and nothing tells you that the plan is complete.

The images are `meal-plan-01` to `03` in `docs/inspiration/`.

## A night is a proposal, not a lock

The first goal of the project was a menu with no fixed days, because a plan with fixed days fails when one day goes wrong. The design puts each meal on a night.

The two agree with this rule: the app proposes a night for each meal, and you can cook each meal on any day. The night gives a rough sequence, with the food that spoils first at the start. When Tuesday goes wrong, you take a different card from the hand, and nothing breaks.

## The design and the app

| Step of the design                                                     | The app on 4 October 2026                     |
| ---------------------------------------------------------------------- | --------------------------------------------- |
| 1. "Which nights?" The nights, the people, and the food to use first   | Not there. The number of meals is in Settings |
| 2. "Keep 5." One card at a time, five places, three filters            | The dealer deals cards. No places, one filter |
| 3. "Your week." Each meal on a night. The prep shows on its row        | Not there. A meal has no night                |
| 4. "9 to buy." The gap to the pantry. "Have it" corrects a wrong count | Not there. The list fills while you add meals |
| The end: "Set the menu", and Today shows "Go shopping"                 | Not there                                     |

## The steps

1. **A night for each meal.** The app puts the meals in a sequence by what spoils first. "Your week" shows the sequence, and a drag changes it. Today shows the meal of the night on top.
2. **The nights and the places.** You select the nights. The nights of the last week are the default. The dealer shows one place for each night and counts: "2/5".
3. **The filters.** "Uses what I have", "Quick", and "New to me". A recipe has a number of minutes that you type. After a cook in Cook mode, the real time of that cook replaces the number. So a new recipe can be "Quick" on its first day.
4. **"To buy" and the end.** The last step shows only what you must buy. "Set the menu" goes to Today, and the top card has "Go shopping".
5. **The prep on its night.** A row shows "Thaw chicken Mon night". On Monday, Today shows this line at the top, with "Done". The reminder is this line: the phone sends no message.

Step 1 changes the database: a meal on the menu gets a night. Step 3 adds the minutes to a recipe. The use-by date from the [Pantry stage](pantry-gaps.md) makes the sequence of step 1 correct.

## What stays

The small meal cards of Menu, with "Remove from the menu" on the back. After "Set the menu", the Menu tab opens "Your week".

## Further reading

- [Usage flows](../flows.md): the week session that this flow replaces.
- [Planning preferences](../settings/planning-preferences.md): the number of meals in a week, which step 2 uses as the first default.
