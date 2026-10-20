---
title: Test the shopping note and the receipt
summary: "The maker gets tests that the tasks of a trip and the lines of a receipt read back as they were written, that your own text stays, and that a bad line does not stop the reader."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test the shopping note and the receipt

# Test the shopping note and the receipt

As the maker, I want tests of the shopping note and of the receipt, so that a change cannot lose an item of the cart, or a price that you paid.

## Requirements

1. The tests of the shopping note check that a task reads back as it was written
   - a. A task with a mark is in the cart, and a task with no mark is to buy
   - b. Text with no link is an item with that name
   - c. The text after ` · ` is the brand
2. The tests of the receipt check that a line reads back as it was written: the item, the brand, the amount, the price, the sale, the place, and the use-by date
   - a. A complete receipt keeps the text that you typed above the table
3. The readers of the two notes get tests with bad notes
   - a. A task with no text, a row of the table with fewer cells, a price that is not a number, and a table with no row
   - b. The reader gives the lines that it can read, and does not stop
   - c. When the code of today gives a wrong answer for a bad note, the fix starts with the test that fails

## Acceptance criteria

The fixtures copy `test-vault/Larder/Shopping/Next trip.md` and `test-vault/Larder/Shopping/2026-10-14.md`.

1. GIVEN the next trip WHEN the plugin reads it THEN the onions are the first task, with no mark
2. GIVEN the task `- [x] [[Larder/Pantry/Taco seasoning|Taco seasoning]] · [[Taco seasoning - Brand A.jpg]]` WHEN the plugin reads it THEN the taco seasoning is in the cart with the brand "Taco seasoning - Brand A.jpg"
3. GIVEN the task "- [ ] Soap" WHEN the plugin reads it THEN the item is "Soap", with no link
4. GIVEN the receipt of 2026-10-14 WHEN the plugin reads it THEN it has 3 lines
   - a. AND the milk is 3.79 l at 3.99, in "Fridge", with the use-by date 2026-10-29
   - b. AND the taco seasoning is on sale at 1.79
5. GIVEN the lines of the receipt of 2026-10-14 WHEN the plugin writes them into a new receipt and reads it THEN it gets the same 3 lines
6. GIVEN a receipt with the text "Mum comes on Friday." above the table WHEN the plugin completes it THEN that text is the same as before
7. GIVEN the receipt with the price "about 4" on the eggs WHEN the plugin reads it THEN it does not stop
   - a. AND the milk is at 3.99
8. GIVEN the receipt with a row of 3 cells WHEN the plugin reads it THEN it does not stop
9. GIVEN the next trip with the task "- [ ] " and no text WHEN the plugin reads it THEN it does not stop

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [Shopping note](../../architecture/shopping-note.md): the form of a trip, and what the plugin changes.
- [Receipt](../../architecture/receipt.md): the form of a receipt.
