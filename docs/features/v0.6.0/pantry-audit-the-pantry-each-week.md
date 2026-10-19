---
title: Audit the pantry each week
summary: "The audit walks one place at a time. 'Right' confirms a food item, a tap opens its card, and food to check comes first. It remembers where you stopped."
parent: pantry-stories.md
updated: 2026-10-19
persona: Planner
depends-on: [pantry-take-a-meal-from-the-open-package.md, pantry-drag-a-package-on-the-card.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Audit the pantry each week

# Audit the pantry each week

As the [planner](../../personas.md), I want to walk each place once a week and confirm or correct the food, so that the plan and the list start from a pantry that is true.

## Requirements

1. The Pantry part has the button "Audit" in its head (decision 23)
2. The audit shows one place at a time, in the sequence of the places in the settings (decision 23)
   - a. The head shows the place and "2 of 3"
   - b. Each food item of the place shows with its bar, with this place in focus
3. The food items with `check: true` come first, with the sticker "Check" (decisions 10 and 35)
4. "Right" on a food item confirms it (decision 23)
   - a. It removes `check: true`
   - b. The line goes grey, gets a check mark, and moves to the end of the place
5. A tap on a food item opens its card, as in the Pantry part (decision 23)
   - a. "Done" in the card confirms the food item too
6. "Next place" goes to the next place. After the last place, the audit ends with "Done"
7. The plugin keeps the last place that you finished in its data (decisions 24 and 36)
   - a. "Audit" starts at the place after it
   - b. After the last place, the next audit starts at the first place
8. "Stop" leaves the audit and keeps the last place that you finished

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN `Onions.md` with `check: true` WHEN the planner taps "Audit" THEN the place is "Kitchen pantry", "1 of 3"
   - a. AND onions are first, with "Check"
2. GIVEN the audit of "Kitchen pantry" WHEN the planner taps "Right" on onions THEN `Onions.md` has no property `check`
   - a. AND onions move to the end of the place, grey, with a check mark
3. GIVEN the audit of "Kitchen pantry" WHEN the planner taps "Next place", then "Stop" THEN the next "Audit" starts at "Fridge"
4. GIVEN the audit of "Fridge" WHEN the planner taps milk, drags the jug at 1/4 to full, and taps "Done" THEN `Milk.md` has `Fridge | full | 1 gal | 2026-10-22`
   - a. AND milk is confirmed
5. GIVEN the audit of "Freezer", the last place WHEN the planner taps "Done" THEN the next "Audit" starts at "Kitchen pantry"

## Depends on

- [Take a meal from the open package](pantry-take-a-meal-from-the-open-package.md): the food that is "to check".
- [Drag a package on the card](pantry-drag-a-package-on-the-card.md): the card that corrects a food item.

## Architecture

- A new page "Audit", in the Elevate step.
- [Settings](../../architecture/settings.md): the last place of the audit.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 10, 23, 24, 35, and 36.
