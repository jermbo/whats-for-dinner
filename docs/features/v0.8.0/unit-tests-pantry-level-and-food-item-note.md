---
title: Test the level and the food item note
summary: "The maker gets tests of low and out, and of the table of a food item note that reads back as it was written, also when the note is bad."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test the level and the food item note

# Test the level and the food item note

As the maker, I want tests of the level of a food item and of the table of its note, so that a change cannot make the milk low by mistake or lose a package of rice.

## Requirements

1. The tests of the level check low, not low, and no level
   - a. One package at 1/4 is low. A second package is a reserve
   - b. A counted package is low at 1/4 of its size or less
   - c. A food item with no package that the plugin can count has no level
2. The tests of the food item note check that the rows of the table read back as they were written
   - a. The text around the table stays: the properties and the section "Brands"
   - b. A package with nothing left goes out of the table
3. The reader of a food item note gets tests with bad notes
   - a. A note with no table, a table with no row, a row with a `Left` that is not a level, a row with a half-typed size, and text that you typed below the table
   - b. The reader gives the rows that it can read, and does not stop
   - c. When the code of today gives a wrong answer for a bad note, the fix starts with the test that fails

## Acceptance criteria

The fixtures copy the notes of `test-vault/Larder/Pantry/`. Rice: 3/4 of 2 kg and a full bag of 900 g in "Kitchen pantry". Milk: 1/4 of 1 gal and a full jug of 1 gal in "Fridge", and the section "Brands". Eggs: 4 of 12 and 12 of 12 in "Fridge". Water: one row "tap".

1. GIVEN the rice WHEN the plugin calculates the level THEN it has 2400 g of 2900 g
   - a. AND the rice is not low
2. GIVEN the milk with only the jug at 1/4 WHEN the plugin calculates the level THEN the milk is low
3. GIVEN the milk with the jug at 1/4 and the full jug WHEN the plugin calculates the level THEN the milk is not low
4. GIVEN the eggs with only the carton of 3 of 12 WHEN the plugin calculates the level THEN the eggs are low
5. GIVEN the eggs with only the carton of 4 of 12 WHEN the plugin calculates the level THEN the eggs are not low
6. GIVEN the water WHEN the plugin calculates the level THEN it has no level
7. GIVEN the note of the milk WHEN the plugin reads the rows THEN it gets 2 rows in "Fridge", with the use-by dates 2026-10-22 and 2026-10-29
8. GIVEN the note of the milk WHEN the plugin writes its rows with the first jug at 1/2 THEN the reader gets the new rows
   - a. AND the properties and the section "Brands" are the same text as before
9. GIVEN the note of the rice WHEN the plugin writes its rows with the bag of 900 g at 0 THEN the table has one row
10. GIVEN a note with properties and no table WHEN the plugin reads the rows THEN it gets no row, and does not stop
11. GIVEN the rice with a second row of `Left` "half" WHEN the plugin reads the rows THEN it does not stop
    - a. AND the first row is 3/4 of 2 kg
12. GIVEN the rice with a size "2" and no unit in a row WHEN the plugin reads the rows THEN it does not stop
13. GIVEN the rice with a line of text below the table WHEN the plugin writes its rows THEN that line is the same text as before

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [Level](../../architecture/level.md): the rules of low and out.
- [Food item note](../../architecture/food-item-note.md): the form of the table, and what the plugin writes.
