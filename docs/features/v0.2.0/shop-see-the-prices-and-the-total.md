---
title: See the prices and the total
summary: "The shopper sees the regular price of each row and the total of the trip, in the store and at put away."
parent: shop-stories.md
updated: 2026-10-17
persona: Shopper
depends-on: [shop-start-from-the-last-receipt.md, shop-tick-the-items-into-the-cart.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / See the prices and the total

# See the prices and the total

As the [shopper](../../personas.md), I want to see what each item usually costs and what the trip costs, so that I know the cost before the till and I see a sale.

## Requirements

1. Each row of the list and each item of the cart shows its regular price
   - a. The regular price is the price of the newest receipt row with no sale mark, as at put away
   - b. A row with no regular price shows no price
2. The stage Shop has one line of totals above its button
   - a. The text is "About 9.40 in the cart · 14.18 in all"
   - b. "In all" is the list and the cart together
   - c. Only the rows with a price count
   - d. With no price at all, the line does not show
3. The stage Put away shows the total of the trip
   - a. It is the sum of the prices of its lines, with 2 decimals, such as "Total 13.70"
   - b. A line with no price adds nothing, and the text of the missing prices stays

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17, after the clean-up of that day, with the setting "Low line" at 20 %. The plan has the boiled eggs, the open note has no task, and the data file has no skipped suggestion. The regular price of eggs is 3.49, of oats is none, and of rice is 5.99.

1. GIVEN the list has the row "Eggs" WHEN the shopper opens the stage Shop THEN the row shows "3.49"
2. GIVEN oats are an extra WHEN the shopper opens the stage Shop THEN the row "Oats" shows no price
3. GIVEN the list has eggs and rice, and the cart is empty WHEN the shopper opens the stage Shop THEN the line is "About 0.00 in the cart · 9.48 in all"
4. GIVEN the shopper ticks eggs WHEN the shopper looks at the line THEN it is "About 3.49 in the cart · 9.48 in all"
5. GIVEN the cart has eggs and rice WHEN the keeper opens the stage Put away THEN it shows "Total 9.48"
6. GIVEN the stage Put away shows "Total 9.48" WHEN the keeper types "4.29" for eggs THEN it shows "Total 10.28"

## Depends on

- [Start from the facts of the last receipt](shop-start-from-the-last-receipt.md): the regular price.
- [Tick the items into the cart](shop-tick-the-items-into-the-cart.md): the rows and the cart of the stage Shop.

## Architecture

- [Receipt](../../architecture/receipt.md): where the prices come from.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decisions 47 and 49, and choice 14. It is a page of the initiative.
