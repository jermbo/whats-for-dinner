---
title: See the amount that you usually buy
summary: "The shopper sees on the list the amount of the last purchase, such as a box of 12 eggs, and put away starts from the same amount."
parent: shop-stories.md
updated: 2026-10-17
persona: Shopper
depends-on: [shop-start-from-the-last-receipt.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / See the amount that you usually buy

# See the amount that you usually buy

As the [shopper](../../personas.md), I want each row of the list to show the amount that I usually buy, so that I take the same box or bag as each time, and put away agrees with the list.

## Requirements

1. The amount of a row is the newest amount of the receipts in the unit of the food item
   - a. When the meals need more than that amount, the row has what the meals need, with no fill of a staple
   - b. With no such amount, the row has its amount as before
   - c. An item that is not in the pantry takes the newest amount of its receipts
2. Put away starts from the amount of the row
   - a. With no amount on the row, it starts from the full amount of the food item, and then from "1"
   - b. "How much" has the amounts of the receipts in the unit of the food item, as before

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17, after the clean-up of that day, with the setting "Low line" at 20 %. The plan has the boiled eggs, the open note has no task, and the data file has no skipped suggestion. The receipts of eggs have "12", the receipt of oats has "42.5 g", and the receipt of rice has "4.25 kg".

1. GIVEN the boiled eggs need 4 eggs, and the pantry has 2 eggs WHEN the shopper opens the stage Shop THEN the row "Eggs" has "12"
2. GIVEN the boiled eggs need 4 eggs, and the pantry has no eggs WHEN the shopper opens the stage Shop THEN the row "Eggs" has "12"
3. GIVEN a meal needs 15 eggs, and the pantry has no eggs WHEN the shopper opens the stage Shop THEN the row "Eggs" has "15"
4. GIVEN rice is an extra, and the pantry has 5 kg of rice WHEN the shopper opens the stage Shop THEN the row "Rice" has "4.25 kg"
5. GIVEN eggs are in the cart with the row "Eggs, 12" WHEN the keeper opens the stage Put away THEN the amount of eggs is "12"
6. GIVEN milk is an extra WHEN the shopper opens the stage Shop THEN the row "Milk" has "1 l", the amount of the receipt of 2026-10-04
7. GIVEN the receipt of 2026-10-04 has milk with "1", and milk is an extra WHEN the shopper opens the stage Shop THEN the row "Milk" has no amount
   - a. AND put away starts milk with "1 l", its full amount

## Depends on

- [Start from the facts of the last receipt](shop-start-from-the-last-receipt.md): the receipts and the unit of a food item. This story changes its requirement 3 a: put away starts from the row, and the row has the newest amount.

## Architecture

- [Shopping](../../architecture/shopping.md): the amount of a row.
- [Facts of an item](../../architecture/put-away-facts.md): the amount that put away starts from.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 46. It is a page of the initiative.
