---
title: Test the recipe note and intake
summary: "The maker gets tests of the reader of a recipe note, also for a bad recipe, and of intake: one ingredient line, and a saved recipe that reads back the same."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test the recipe note and intake

# Test the recipe note and intake

As the maker, I want tests of the reader of a recipe note and of the text that intake saves, so that a change cannot lose an ingredient, or save a recipe that the plugin cannot read again.

## Requirements

1. The tests of the reader check the parts of a recipe: the title, the tags, the yield, the groups, the ingredients, and their amounts
   - a. The properties above the title do not change the recipe
   - b. A heading between the ingredients starts a group
2. The reader gets tests with bad recipes
   - a. A note with no title, a note with no rule `---`, an amount with no number, and an empty note
   - b. The reader gives a reason with the text that is wrong, and does not stop
   - c. When the code of today gives a wrong answer for a bad recipe, the fix starts with the test that fails
3. The tests of intake check that one ingredient line becomes an amount and a food name
   - a. The text that is not the food, such as ", grated", stays with the line
   - b. A line with no number has no amount
4. The recipe note that intake saves reads back as the same recipe: the same title, tags, yield, ingredients, amounts, and instructions

## Acceptance criteria

The fixtures copy `test-vault/Recipes/Spinach omelette.md`: the tags "breakfast, vegetarian, fast", the yield "1 serving", 6 ingredients, and 4 steps.

1. GIVEN the spinach omelette WHEN the plugin reads the recipe THEN the title is "Spinach omelette"
   - a. AND it has the tags "breakfast", "vegetarian", and "fast"
   - b. AND it has 6 ingredients
   - c. AND the second ingredient is "spinach" with the amount 50 g
2. GIVEN the spinach omelette with properties above the title WHEN the plugin reads the recipe THEN it is the same recipe
3. GIVEN the spinach omelette with the heading "Filling" before the spinach WHEN the plugin reads the recipe THEN the spinach and the 4 ingredients after it are in the group "Filling"
4. GIVEN the spinach omelette with no title WHEN the plugin reads the recipe THEN it gives a reason, and no recipe
5. GIVEN the spinach omelette with no rule `---` WHEN the plugin reads the recipe THEN it gives a reason, and no recipe
6. GIVEN the spinach omelette with the amount "*a pinch*" on the salt WHEN the plugin reads the recipe THEN it gives a reason that has the text "a pinch"
7. GIVEN an empty note WHEN the plugin reads the recipe THEN it gives a reason, and no recipe
8. GIVEN the line "30 g cheddar cheese, grated" WHEN intake reads the line THEN the amount is 30 g and the name is "cheddar cheese"
   - a. AND the text ", grated" stays with the line
9. GIVEN the line "salt" WHEN intake reads the line THEN the line has no amount and the name is "salt"
10. GIVEN intake has the spinach omelette with a link to a food item on each line WHEN intake makes the text of the note and the plugin reads it THEN the recipe has the same title, tags, yield, ingredients, amounts, and steps

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [Recipe note](../../architecture/recipe-note.md): the parts of a recipe, and what the plugin permits more.
- [Intake](../../architecture/intake.md): how a line becomes an ingredient, and the note that Save writes.
- [Errors](../../standards/errors.md): the reason that a reader gives for a bad note.
