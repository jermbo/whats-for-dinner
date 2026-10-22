---
title: What you must get first
summary: "An open recipe shows the food that you lack first, with a meter that fills with the count and stickers that press on."
parent: one-system-stories.md
updated: 2026-10-21
persona: Planner
depends-on: [one-system-open-a-recipe-card.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / What you must get first

# What you must get first

As the [planner](../../personas.md), I want an open recipe to show the food that I lack first, so that I know at a glance if I can cook it.

## Requirements

1. The inside of an open recipe has this sequence
   - a. The meter
   - b. "To get or check · 4", with a row for each ingredient that has none, is low, or needs a check
   - c. "In the pantry · 5", with a chip for each ingredient that you have
   - d. The description, the preparation, and the actions
2. The meter has one piece for each ingredient, 10 px high, with 3 px between the pieces
   - a. In the sequence: have in `text`, check in `text-faint`, low in `warning`, none with a dashed edge
3. A row of "To get or check" has the name at the size `name`, the amount, and a sticker: "None" dashed, "Low" amber, or "Check"
   - a. The rows have the sequence: none, then low, then check
   - b. A recipe with no row shows "All in the pantry ✓" at the size `title`
   - c. A recipe with no ingredient shows only "No ingredients", with no meter. A long name or amount wraps in its column
4. A chip of "In the pantry" has the name, and the amount in small text
5. The groups of the recipe do not show here
6. With 34 rem or more of width, the description, the preparation, and the actions are in a column next to the food: 3 parts food, 2 parts method
7. The actions are "Cook" as the pill, and below it "Edit", "Note", and "Close", each with no edge and with a mark: ✎, ↗, ↑
8. The stickers press on: each comes down from 1.35 times its size, turned 5°, and presses flat
   - a. The first starts 0.3 s after the card opens, and each next one 55 ms later
9. The count and the meter move together
   - a. When the card opens, the count of the head starts at 0
   - b. The meter starts 150 ms after the card opens. Then one piece lands each 55 ms, and the count goes up by one for each piece of the food that you have or must check
10. With less motion, each piece shows at once, and the count shows its number

## Acceptance criteria

1. GIVEN the pantry of the test vault WHEN the planner opens Chicken noodle soup THEN the meter has 9 pieces: 5 dark, 1 grey, 1 amber, 2 dashed
   - a. AND "To get or check · 4" has the rows celery "None", elbow pasta "None", chicken broth "Low", and carrots "Check", in this sequence
   - b. AND "In the pantry · 5" has the chips chicken thighs 450 g, onion 1, olive oil 1 tbsp, salt, and black pepper
2. GIVEN Chicken noodle soup opens WHEN the meter fills THEN the count of the head goes from 0 to 6, one step with each of the first 6 pieces
3. GIVEN Chicken noodle soup opens WHEN the stickers press on THEN "None" of celery is first, and "Check" of carrots is last
4. GIVEN Chicken noodle soup on a computer, in a column of 36 rem WHEN it opens THEN the description and the actions are in a column at the right of the food
5. GIVEN a recipe of which you have each ingredient WHEN the planner opens it THEN it shows "All in the pantry ✓"
6. GIVEN the device has less motion on WHEN the planner opens Chicken noodle soup THEN each piece shows at once, and the count shows 6

## Depends on

- [Open a recipe card](one-system-open-a-recipe-card.md): the open card.

## Architecture

- [Recipes](../../architecture/recipes.md): the open recipe.
- [Match](../../architecture/match.md): the states have, check, low, and none.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decisions 4, 6, and 7.
