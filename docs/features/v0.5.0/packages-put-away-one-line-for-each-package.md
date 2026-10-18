---
title: Put away one line for each package
summary: "Put away shows one line for each package that you bought, each with its own date, and each line makes its own row in the pantry and in the receipt."
parent: packages-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: [packages-keep-one-row-for-each-package.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Packages stories](packages-stories.md) / Put away one line for each package

# Put away one line for each package

As the [keeper](../../personas.md), I want one line for each package at put away, so that each jug and each carton goes into the pantry with its own date.

## Requirements

1. Put away shows one line for each package of an item
   - a. The number of lines is the amount of the list row divided by the last size, rounded up, and at least 1
   - b. The last size is the amount of the newest receipt row of the item
   - c. With no last size, the item has 1 line with the amount of the list row
   - d. With a last size, each line starts with the last size as its amount
   - e. The lines of one item are next to each other, in the group of their place
2. The open line has "+ package"
   - a. It adds a line with the amount, the place, the date, and the price of the open line
   - b. The new line slides in below the open line. With "Reduce motion", it shows with no motion
3. Each line has its own facts, as the [facts of an item](../../architecture/put-away-facts.md) page tells
   - a. A correction of one line does not change the other lines of the item
4. The amount of a line is the size of its package
   - a. A new food item gets the amount of its line as its size
5. "Put away" on a line writes one package into the food item note
   - a. Over the empty row of the place of the line, with the new amount, size, and date
   - b. With no empty row in that place, as a new row
   - c. It never adds to a row that has food. This replaces the part "One row for one place" of the facts page
6. The receipt has one row for each line
   - a. The price of a row is the price of one package
7. "Not bought" on a line takes that line out
   - a. The task in the cart stays while the item has a line
   - b. "Not bought" on the last line of an item takes the item out of the cart, as today
8. "Put away 9 known" counts the lines of the known items
9. The list of the Shop part does not change

## Acceptance criteria

Each criterion starts with the vault of the [list page](packages-stories.md#what-the-vault-needs), and the stage Put away open.

1. GIVEN the cart has eggs, the list row is "Eggs, 12", and the last receipt row of eggs is 12 WHEN the stage opens THEN the stage has 1 line of eggs
   - a. AND the line has the amount "12", the place "Fridge", and the price 3.49
2. GIVEN the cart has eggs and the list row is "Eggs, 20" WHEN the stage opens THEN the stage has 2 lines of eggs
   - a. AND each line has the amount "12"
3. GIVEN the cart has flour, and no receipt has flour WHEN the stage opens THEN the stage has 1 line of flour with the amount of the list row
4. GIVEN 1 line of milk is open WHEN the keeper taps "+ package" THEN the stage has 2 lines of milk
   - a. AND the new line has the amount "1 gal", the place "Fridge", and the price 3.99
5. GIVEN 2 lines of milk WHEN the keeper sets the date of the second line to 2026-11-05 THEN the first line keeps its date
6. GIVEN `Milk.md` has two rows in "Fridge" WHEN the keeper puts away 1 line of milk with the date 2026-11-01 THEN `Milk.md` has 3 rows
   - a. AND the new row is `Fridge | 1 gal | 1 gal | 2026-11-01`
   - b. AND the two rows of before do not change
7. GIVEN `Milk.md` has only the row `Fridge | 0 | 1 gal | 2026-10-22` WHEN the keeper puts away 1 line of milk with the date 2026-11-01 THEN `Milk.md` has only the row `Fridge | 1 gal | 1 gal | 2026-11-01`
8. GIVEN the line of new quinoa has the amount "1 lb" and "Into the pantry" is on WHEN the keeper taps "Put away" THEN `Quinoa.md` has the row with the amount `1 lb` and the size `1 lb`
9. GIVEN 2 lines of eggs WHEN the keeper puts away the two lines THEN the receipt has 2 rows of eggs
   - a. AND each row has the amount "12" and the price 3.49
10. GIVEN 2 lines of eggs WHEN the keeper taps "Not bought" on the first line THEN the stage has 1 line of eggs
    - a. AND the task of eggs is still in the cart

## Depends on

- [Keep one row for each package](packages-keep-one-row-for-each-package.md): the column `Size` and the empty row that a line writes over.

## Architecture

- [Put away](../../architecture/put-away.md): the lines, "+ package", and the actions.
- [Facts of an item](../../architecture/put-away-facts.md): the number of lines, the size, and the row that a line writes.
- [Receipt](../../architecture/receipt.md): one row for each package.
- [Spec: one row for each package](../../initiatives/one-row-for-each-package/spec.md): scope 9, 10, 11, and 13.
