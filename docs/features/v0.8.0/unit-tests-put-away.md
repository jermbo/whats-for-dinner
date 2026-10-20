---
title: Test put away
summary: "The maker moves the rule of the start of put away to the domain, and gets tests of the lines of the receipt and of the package that goes into the pantry."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test put away

# Test put away

As the maker, I want the rule of the start of put away in the domain, with its tests, so that a change cannot lose a line that you already put away or give a package the wrong place.

## Requirements

1. The rule of the start of put away moves from the state to the domain, as one refactor step with no change that you can see
   - a. The rule gets the lines of the receipt and the items of the cart, and gives the new lines
   - b. The state still reads the notes and writes the new text
2. The tests check which lines of the receipt stay and which lines are added
   - a. A line that is done stays
   - b. A line of an item that is still in the cart stays
   - c. A line of an item that is not in the cart any more goes
   - d. An item of the cart with no line gets its lines
3. The tests check the package that goes into the pantry
   - a. Its amount, its place, and its use-by date come from the facts of its line
   - b. An item that does not go into the pantry gives no package

## Acceptance criteria

The fixtures use the receipt of `test-vault/Larder/Shopping/2026-10-14.md`: the taco seasoning, the milk, and the eggs.

1. GIVEN a receipt with the milk done and the eggs not done, and a cart with the eggs WHEN put away starts THEN the milk and the eggs keep their lines
2. GIVEN a receipt with the eggs not done, and a cart with no eggs WHEN put away starts THEN the eggs have no line
3. GIVEN a receipt with the milk, and a cart with the milk and the onions WHEN put away starts THEN the onions get a line
   - a. AND the line of the milk is the same as before
4. GIVEN a receipt that has each item of the cart WHEN put away starts THEN the lines do not change
5. GIVEN the line of the milk with 1 gal, "Fridge", and the use-by date 2026-10-29 WHEN the plugin puts it away THEN the package is a full jug of 1 gal in "Fridge" with the use-by date 2026-10-29
6. GIVEN the line of the eggs with 12 and "Fridge" WHEN the plugin puts it away THEN the package is 12 of 12 in "Fridge"
7. GIVEN a line of batteries that does not go into the pantry WHEN the plugin puts it away THEN it gives no package

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [Put away](../../architecture/put-away.md): the lines, the receipt that keeps the work, and the end of the trip.
- [Put away facts](../../architecture/put-away-facts.md): where the facts of a line come from.
- [Layers](../../standards/layers.md): why the rule goes to the domain.
