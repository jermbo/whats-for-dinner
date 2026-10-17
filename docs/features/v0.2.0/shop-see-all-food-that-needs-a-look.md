---
title: See all food that needs a look
summary: "The planner sees each food item that is out or low, staple or not, in groups by reason, with its level."
parent: shop-stories.md
updated: 2026-10-17
persona: Planner
depends-on: [shop-decide-the-extras.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / See all food that needs a look

# See all food that needs a look

As the [planner](../../personas.md), I want the stage Extras to show each food item that is out or low, so that I see what is low with no label to set first.

## Requirements

1. A food item with no label is a suggestion when it is out or low
   - a. It is out when it has no row, and it has a full amount or a purchase date
   - b. It is low when it is below its low line
   - c. A food item with no row, no full amount, and no purchase date is not a suggestion
2. A staple keeps each reason of [See the staples that need a look](shop-see-the-staples-that-need-a-look.md)
3. The suggestions are in four groups, in this sequence: "Out", "Low", "Use-by date", and "Time to check"
   - a. "Use-by date" has the reasons "Past its date" and "Use by"
   - b. "Time to check" has the reasons "Often", "Bought" with the time, and "No purchase date"
   - c. A group with no line does not show
   - d. The head of a group has the number of its lines
   - e. The lines of a group are from A to Z
4. A suggestion shows the level of its food item, such as "150 ml of 1 l"
   - a. A food item that the plugin cannot count shows what the pantry has, as before
   - b. The purchase date and the first use-by date follow, as before
5. Food that a meal puts on the list, food with a task in the open note, and food that you skipped is not a suggestion, as before

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17, after the clean-up of that day, with the setting "Low line" at 20 %. The plan has the boiled eggs, the open note has no task, and the data file has no skipped suggestion.

1. GIVEN the vault WHEN the planner opens the stage Extras THEN the group "Out" has "Curry paste" and "Taco seasoning"
2. GIVEN the vault WHEN the planner opens the stage Extras THEN the group "Low" has 11 lines
   - a. AND the lines are "Baking powder", "Butter", "Cheese", "Coconut milk", "Dark chocolate", "Elbow pasta", "Milk", "Peanuts", "Raisins", "Shell pasta", and "Spring onion"
3. GIVEN the vault WHEN the planner looks at the line "Milk" THEN it shows "150 ml of 1 l"
4. GIVEN the vault WHEN the planner looks at the line "Butter" THEN it shows "40 g of 250 g"
   - a. AND it shows "Use by 20 Nov"
5. GIVEN the vault WHEN the planner opens the stage Extras THEN the group "Time to check" has "Eggs" with "Often"
6. GIVEN the planner skipped eggs WHEN the planner opens the stage Extras THEN the group "Time to check" does not show
7. GIVEN the note `Lime` has no row, no full amount, and no purchase date WHEN the planner opens the stage Extras THEN no group has a line for lime
8. GIVEN the vault WHEN the planner looks at the strip THEN "1 Extras" has "14"

## Depends on

- [Decide the extras before the trip](shop-decide-the-extras.md): the stage Extras. This story replaces requirement 8 a of [See the staples that need a look](shop-see-the-staples-that-need-a-look.md): low food that is not a staple is a suggestion now.

## Architecture

- [Suggestions](../../architecture/suggestions.md): the rule, the reasons, and the groups.
- [Level](../../architecture/level.md): the low line, and the amount of the level.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decisions 40 and 42. It is a page of the initiative.
