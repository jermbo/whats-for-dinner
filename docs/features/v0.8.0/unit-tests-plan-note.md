---
title: Test the plan note
summary: "The maker gets tests that a meal is added, changed, and removed in the plan note, that your own text stays, and that a bad line does not stop the reader."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test the plan note

# Test the plan note

As the maker, I want tests of each change that the plugin makes to the plan note, so that a change cannot lose a meal of the week or the text that you typed.

## Requirements

1. The tests check that a meal is added, changed, and removed, and that the plan reads back the same
   - a. A new meal is a new line after the last meal
   - b. A change of a meal keeps the link as you wrote it
   - c. A new week takes each meal line out
   - d. Your own text stays in each case
2. The reader of the plan note gets tests with bad notes
   - a. A task with no link, a line that is not a task, a link with no name, and a date that is not a date
   - b. The reader gives the meals that it can read, and does not stop
   - c. When the code of today gives a wrong answer for a bad note, the fix starts with the test that fails

## Acceptance criteria

The fixtures copy `test-vault/Larder/Meal plan.md`: 4 meals with no mark, from the banana oat muffins to the spinach omelette.

1. GIVEN the plan WHEN the plugin reads it THEN it has 4 meals, and none is cooked
2. GIVEN the plan with the line "Mum comes on Friday." above the meals WHEN the plugin adds the beef tacos THEN the beef tacos are the fifth meal
   - a. AND the line "Mum comes on Friday." is the same text as before
3. GIVEN the plan WHEN the plugin changes the pancakes to the date 2026-10-22 THEN the meal of the pancakes has the date 2026-10-22
   - a. AND the link is `[[Recipes/Pancakes|Pancakes]]`
4. GIVEN the plan WHEN the plugin removes the pancakes THEN it has 3 meals
5. GIVEN the plan with the line "Mum comes on Friday." WHEN the plugin starts a new week THEN it has no meal
   - a. AND the line "Mum comes on Friday." is the same text as before
6. GIVEN the plan with the task "- [ ] Soup" with no link WHEN the plugin reads it THEN it has 4 meals, and does not stop
7. GIVEN the plan with the date "Friday" on the pancakes WHEN the plugin reads it THEN it does not stop

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [Plan note](../../architecture/plan-note.md): the form of the note, and what the plugin changes.
