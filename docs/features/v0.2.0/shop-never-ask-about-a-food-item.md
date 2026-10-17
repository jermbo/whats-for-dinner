---
title: Never ask about a food item
summary: "The planner skips a suggestion, and with one more tap the plugin never asks about that food item again."
parent: shop-stories.md
updated: 2026-10-17
persona: Planner
depends-on: [shop-see-all-food-that-needs-a-look.md, shop-label-a-staple.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Never ask about a food item

# Never ask about a food item

As the [planner](../../personas.md), I want to tell the plugin with one tap that it must never ask about a food item, so that food that I bought for one recipe does not come back at each trip.

## Requirements

1. Tap "Skip" on a suggestion to take it out until the trip ends, as before
   - a. One line in the stage Extras then says "Curry paste is skipped for this trip.", with "Never ask" and "Undo"
   - b. The line goes at your next action, or after 8 s
2. Tap "Undo" to make the food item a suggestion again
3. Tap "Never ask" to make the food item never a suggestion
   - a. The food item note gets the property `suggest: never`
   - b. A staple loses its label `staple`
4. The form of the food item in the Pantry part has the option "Never ask"
   - a. The options are "Never ask", "Not a staple", "Often", "Sometimes", and "Seldom"
   - b. "Never ask" is on for a food item with `suggest: never`
   - c. A different option takes the property `suggest` out of the note
5. A food item with `suggest: never` is still on the list when a meal needs it

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17, after the clean-up of that day, with the setting "Low line" at 20 %. The plan has the boiled eggs, the open note has no task, and the data file has no skipped suggestion.

1. GIVEN the stage Extras is open WHEN the planner taps "Skip" on curry paste THEN the stage says "Curry paste is skipped for this trip."
   - a. AND the line has "Never ask" and "Undo"
   - b. AND the group "Out" has no line for curry paste
2. GIVEN the planner skipped curry paste WHEN the planner taps "Undo" THEN the group "Out" has the line "Curry paste" again
3. GIVEN the planner skipped curry paste WHEN the planner taps "Never ask" THEN the note `Curry paste` has `suggest: never`
4. GIVEN the note `Curry paste` has `suggest: never` WHEN the keeper puts a cart away THEN no group has a line for curry paste
5. GIVEN the note `Curry paste` has `suggest: never` WHEN the keeper opens the form of curry paste in the Pantry part THEN "Never ask" is on
6. GIVEN the form of curry paste has "Never ask" on WHEN the keeper taps "Not a staple" and "Save" THEN the note has no property `suggest`
   - a. AND the group "Out" has the line "Curry paste" again
7. GIVEN the note `Eggs` has `staple: often` WHEN the planner skips eggs and taps "Never ask" THEN the note has `suggest: never`
   - a. AND the note has no property `staple`

## Depends on

- [See all food that needs a look](shop-see-all-food-that-needs-a-look.md): the suggestions that "Never ask" takes away.
- [Label a staple](shop-label-a-staple.md): the form, which gets the option "Never ask".

## Architecture

- [Suggestions](../../architecture/suggestions.md): "Skip", "Never ask", and "Undo".
- [Food item note](../../architecture/food-item-note.md): the property `suggest`.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 41. It is a page of the initiative.
