---
title: Put away one item at a time
summary: "The keeper corrects one line at put away against the paper receipt, and puts only that item into the pantry with "Put away" in the open line."
parent: shop-stories.md
updated: 2026-10-17
persona: Keeper
depends-on: [shop-give-the-facts-of-each-item.md, shop-sort-the-list-in-the-order-of-the-store.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Put away one item at a time

# Put away one item at a time

As the [keeper](../../personas.md), I want to put one item into the pantry as soon as I corrected its line, so that each item that I checked against the paper receipt is complete.

## Requirements

1. The open line of put away has "Put away", next to "Not bought"
   - a. The closed line has no "Put away"
2. Tap "Put away" to put only that item into the pantry
   - a. The amount goes into the food item note with the rules of [put away](../../architecture/put-away-facts.md)
   - b. The food item note gets the day as its purchase date
   - c. The line slides off the screen, and the count of its group gets smaller
   - d. A message says "Milk is in the pantry."
   - e. An item that is not in the pantry changes nothing there, and the message does not show
3. The row of the item in the receipt gets "yes" in the column "Done"
   - a. The stage Shop and the stage Put away do not show the item again
4. The trip ends when its last line goes off the screen of put away
   - a. "Put away" on the last line ends the trip
   - b. "Not bought" on the last line ends the trip, when an item of the trip is done
   - c. The Shop part then opens the stage that has work

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17. The cart has three items with no receipt: milk, lime, and avocados, in this order of the tasks. The pantry has 450 ml of milk of 1 l in "Kitchen". The stage Put away is open, so the receipt `Shopping/2026-10-17` has `status: active`.

1. GIVEN the line of milk is closed WHEN the keeper looks at it THEN the line has no "Put away"
2. GIVEN the line of milk is open WHEN the keeper looks at it THEN the line has "Put away" and "Not bought"
3. GIVEN the line of milk is open, with the price "1.29" WHEN the keeper taps "Put away" THEN the note `Milk` has the row "Kitchen" with "1000 ml"
   - a. AND the screen shows 2 lines
   - b. AND the message says "Milk is in the pantry."
   - c. AND the row of milk in the receipt has "1.29" and "yes" in "Done"
4. GIVEN milk is done WHEN the keeper opens the stage Shop THEN the line "In the cart" has 2 items
5. GIVEN milk and lime are done WHEN the keeper taps "Put away" on avocados THEN the receipt has `status: complete`
   - a. AND the receipt has the rows milk, lime, and avocados, in this order
   - b. AND the Shop part opens the stage that has work
6. GIVEN milk and lime are done WHEN the keeper taps "Not bought" on avocados THEN the receipt has `status: complete`, with the rows milk and lime
   - a. AND the note "Next trip" has no task for avocados
7. GIVEN no item is done WHEN the keeper taps "Not bought" on each line THEN the stage says "The cart is empty."
   - a. AND the receipt has `status: active` and no row

## Depends on

- [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md): the open line, its facts, and "Put into the pantry".
- [Sort the list in the order of the store](shop-sort-the-list-in-the-order-of-the-store.md): the order of the tasks that the receipt keeps.

## Architecture

- [Put away](../../architecture/put-away.md): the two actions that put food away, and when the trip ends.
- [Receipt](../../architecture/receipt.md): the rows of the receipt.
