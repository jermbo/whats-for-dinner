---
title: Test the end of a meal
summary: "The maker moves the rule of the food that goes out of the pantry from Cook Mode to the domain, and gets tests of it and of the record of a meal."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test the end of a meal

# Test the end of a meal

As the maker, I want the rule of the end of a meal in the domain, with its tests, so that a change cannot take the eggs from the wrong carton or break the recipe note.

## Requirements

1. The rule that decides the new packages of each food item at the end of a meal moves from the screen of Cook Mode to the domain, as one refactor step with no change that you can see
   - a. The rule gets the ingredients with a mark and the pantry, and gives the new packages and the food items to check
   - b. The screen still shows the page, and the state still writes the notes
2. The tests check the sequence of the packages
   - a. An open package gives before a full one
   - b. Then the package with the first use-by date. A package with no date gives last
   - c. A package that gives all that it has goes out
3. The tests check the new level of a measured package and the new count of a counted package
   - a. The nearest level, and the middle of two levels goes up
   - b. A package with food left is 1/4 or more
4. An ingredient that does not compare with its food item marks that food item to check
   - a. A row with no number, such as "tap", gets no mark
5. The tests of the record check that the line of a meal goes below the heading "Cooked", and the text of the recipe note stays

## Acceptance criteria

The fixtures copy the spinach omelette of `test-vault/Recipes/` and the pantry of `test-vault/Larder/Pantry/`: the eggs (4 of 12, use by 2026-10-25, and 12 of 12, use by 2026-11-16), and the spinach (1/2 of 284 g, use by 2026-10-21).

1. GIVEN the omelette needs 3 eggs WHEN the meal ends THEN the open carton has 1 of 12
   - a. AND the new carton has 12 of 12
2. GIVEN the omelette needs 6 eggs WHEN the meal ends THEN the open carton goes out
   - a. AND the new carton has 10 of 12
3. GIVEN the omelette needs 50 g of spinach WHEN the meal ends THEN the bag of spinach is at 1/4
4. GIVEN the omelette needs 300 g of spinach WHEN the meal ends THEN the spinach has no package
5. GIVEN a jug of milk of 1 gal at 1/2 and a recipe that needs 1 cup of milk WHEN the meal ends THEN the jug is at 1/2
6. GIVEN a full jug of milk of 1 gal and a recipe that needs 1 tbsp of milk WHEN the meal ends THEN the jug is at 3/4
7. GIVEN onions with a row of 1 kg and a recipe that needs 1 onion WHEN the meal ends THEN the onions are to check
   - a. AND the row of 1 kg is the same as before
8. GIVEN the water with the row "tap" and a recipe that needs 1 l water WHEN the meal ends THEN the water is not to check
9. GIVEN the spinach omelette with no heading "Cooked" WHEN the plugin adds the record of 2026-10-20 with 4 stars THEN the note ends with the heading "Cooked" and one line of 2026-10-20 with 4 stars
   - a. AND the text above it is the same as before
10. GIVEN the spinach omelette with one line below "Cooked" WHEN the plugin adds a second record THEN the heading "Cooked" has 2 lines

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [End of a meal](../../architecture/end-of-a-meal.md): the sequence of the packages, the new level, and the record.
- [Layers](../../standards/layers.md): why the rule goes to the domain.
