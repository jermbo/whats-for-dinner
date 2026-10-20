---
title: Test the match of an ingredient
summary: "The maker gets tests of how an ingredient finds its food item by name, and if the pantry has enough of it."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test the match of an ingredient

# Test the match of an ingredient

As the maker, I want tests of the match of an ingredient with the pantry, so that a change cannot make "2 chicken thighs" lose its food item, or put food on the list that you have.

## Requirements

1. The tests of the name check the three steps of the match
   - a. Small letters, no marks, and no plural: "Chicken thighs" is "chicken thigh"
   - b. An other name of a food item finds it
   - c. With two food items, the one that has the most
   - d. A link is the name of its note. With no link, the name stops at a comma or a parenthesis
2. The tests of the amount check the four results: in the pantry, low, missing, and not counted ("Check")
   - a. An ingredient with no amount is in the pantry when its food item has a row

## Acceptance criteria

The fixtures copy the notes of `test-vault/`: the eggs (4 of 12 and 12 of 12), the spinach (1/2 of 284 g), the rice (3/4 of 2 kg and 900 g, with the other name "white rice"), the elbow pasta (1/4 of 454 g), and the shell pasta (no row).

1. GIVEN the ingredient "3 eggs" WHEN the plugin matches it THEN it finds the eggs, and they are in the pantry
2. GIVEN the ingredient "50 g spinach" WHEN the plugin matches it THEN the spinach is in the pantry
3. GIVEN the ingredient "3 kg rice" WHEN the plugin matches it THEN the rice is low
4. GIVEN the ingredient "200 g white rice" WHEN the plugin matches it THEN it finds the rice
5. GIVEN the ingredient "100 g quinoa" and no note of quinoa WHEN the plugin matches it THEN the quinoa is missing
6. GIVEN the elbow pasta and the shell pasta with the other name "pasta" WHEN the plugin matches "pasta" THEN it finds the elbow pasta
7. GIVEN the ingredient "30 g cheddar cheese, grated" WHEN the plugin reads the name THEN the name is "cheddar cheese"
8. GIVEN the ingredient "1 onion (diced)" WHEN the plugin reads the name THEN the name is "onion"
9. GIVEN the ingredient `[[Larder/Pantry/Rice|rice]], cooked` WHEN the plugin matches it THEN it finds the rice
10. GIVEN onions with a row of 1 kg WHEN the plugin matches "1 onion" THEN the onions are in the pantry with "Check"
11. GIVEN the water with the row "tap" WHEN the plugin matches "1 l water" THEN the water is in the pantry with "Check"
12. GIVEN the ingredient "salt" with no amount and salt with a row WHEN the plugin matches it THEN the salt is in the pantry

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [Match](../../architecture/match.md): the name in three steps, and the four results of the amount.
