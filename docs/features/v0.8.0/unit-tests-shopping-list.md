---
title: Test the shopping list
summary: "The maker gets tests of the rows of the shopping list: the needs of the planned meals minus the pantry, and the food that is past its date."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test the shopping list

# Test the shopping list

As the maker, I want tests of the rows of the shopping list, so that a change cannot drop the eggs that a meal needs, or ask for food that the pantry has.

## Requirements

1. The rules of the list that are in the state move to the domain first, as one refactor step with no change that you can see
   - a. A meal that you cooked does not count
   - b. The list and the food that is past its date come from the needs of the meals and the date of today
2. The tests check that the needs of the planned meals become rows with the amount to buy
   - a. Two meals that need the same food give one row with the total
   - b. Food that the pantry has in a sufficient amount gives no row
3. The tests check the food that is past its date
   - a. A row with a use-by date before today, of a food that a meal needs, makes a suggestion "Past its date"
   - b. The date of today is not past

## Acceptance criteria

The fixtures copy the spinach omelette of `test-vault/Recipes/` and the pantry of `test-vault/Larder/Pantry/`: the eggs (4 of 12, use by 2026-10-25, and 12 of 12, use by 2026-11-16), and the spinach (1/2 of 284 g, use by 2026-10-21).

1. GIVEN the spinach omelette is planned and the pantry has its food WHEN the plugin makes the list THEN the list has no row of the eggs and no row of the spinach
2. GIVEN the spinach omelette is planned and the pantry has no eggs WHEN the plugin makes the list THEN the list has a row of the eggs with 3
3. GIVEN the spinach omelette is planned two times and the pantry has 4 eggs WHEN the plugin makes the list THEN the list has one row of the eggs with 2
4. GIVEN the spinach omelette is cooked and the pantry has no eggs WHEN the plugin makes the list THEN the list has no row of the eggs
5. GIVEN the spinach omelette is planned and the date of today is 2026-10-22 WHEN the plugin makes the list THEN the spinach is past its date
6. GIVEN the spinach omelette is planned and the date of today is 2026-10-21 WHEN the plugin makes the list THEN the spinach is not past its date
7. GIVEN the spinach omelette is cooked and the date of today is 2026-10-22 WHEN the plugin makes the list THEN the spinach is not past its date

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [Shopping](../../architecture/shopping.md): how the list is the plan minus the pantry.
- [Past its date](../../architecture/past-its-date.md): when food that a meal needs is a suggestion.
