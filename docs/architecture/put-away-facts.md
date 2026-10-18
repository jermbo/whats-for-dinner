---
title: Facts of an item
summary: "The six facts of an item at put away: what the plugin fills in for each one, why a sale price is never the start, the price of each brand, and where each fact goes."
parent: put-away.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / [Put away](put-away.md) / Facts of an item

# Facts of an item

At [put away](put-away.md), you have the bag and the paper receipt in your hand. It is the only moment in which you know what you bought and what you paid. This page tells which facts the plugin fills in, and how it keeps your work to a check.

## Six facts, and two places for them

| Fact        | Where it goes                                              |
| ----------- | ---------------------------------------------------------- |
| Amount      | The row of the food item, and the receipt.                 |
| Place       | The row of the food item, and the receipt.                 |
| Use-by date | The row of the food item, and the receipt.                 |
| Price       | The receipt only. It is what you paid for the full amount. |
| "Sale"      | The receipt only, as `yes` in the column "Sale".           |
| Brand       | The receipt only, in the column `Brand`.                   |

The pantry has the state of now, and the [receipt](receipt.md) has the history. So a price is in no food item note.

## The plugin fills in, and you correct

You usually buy the same box of eggs, for about the same price, and you put it in the same place. So each fact starts from the last receipt of the item: the newest receipt with a row that links to its note.

| Fact        | From the receipts                                    | With no receipt, or with an empty cell                                 |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| Amount      | The amount of the row on the list.                   | The full amount of the food item, and then 1.                          |
| Place       | The place of the last row.                           | The place of the first row of the food item.                           |
| Use-by date | Today, plus the days that the food had then.         | Empty.                                                                 |
| Price       | The regular price: the newest row with no sale mark. | Empty.                                                                 |
| "Sale"      | Off.                                                 | Off.                                                                   |
| Brand       | The brand of the cart task, then of the last row.    | The only brand of the food item, and then no brand.                    |

The row on the list has the amount that you usually buy: the newest amount of the receipts in the unit of the food item, unless the meals need more. So put away and the list agree. An amount must be in the unit of the food item: the unit of its full amount, or of its first row. Oats count in grams, so a receipt with "1" bag does not count, and "How much" does not offer it. A "1" does not add to 50 g, so the oats would stay low after the trip. With no such amount, the line starts with the list row, then with the full amount of the food item, and then with 1. An item that is not in the pantry, or that the pantry cannot count, takes the newest amount of its receipts. A food item with no row starts in the place for new food of the [settings](settings.md). A price that you do not change goes into the receipt, because your check is the confirmation.

## A sale price is never the start

A sale ends. If the plugin proposed the price of a sale, a quick check puts the sale price into the next receipt, and the history shows a price that you did not pay. So "Sale" starts off each time, and the price skips each row with a sale mark.

You bought 12 eggs on 28 September for 3.99, and 12 on 4 October for 3.49, on sale, with the use-by date 25 October. That is 21 days. On 13 October, the line of the eggs starts with 12, "Outside fridge", 3.99, and the date 3 November. Eggs that you bought only on sale start with no price.

## Each brand has its own price

Brand A costs 2.49 and Brand B costs 1.99. So the price starts from the regular price of the selected [brand](brands.md): the newest row of the item with that brand and no sale mark. With no such row, it starts from the regular price of any brand. A tap on a different brand changes the price, and the new price fades in. A price that you typed stays. After a tap on "Sale", the hint is the regular price of the selected brand.

A row has a brand when its cell `Brand` links to one of the photos of the brand, or when its text is the name of the brand, with no regard to capital letters. A cell that is no brand of the food item counts as no brand. The brand does not change if an item is known.

## One row for one place

The amount goes into a row that the food item has, if three things are the same: the place, the use-by date, and the kind of unit. Flour has 200 g in the kitchen pantry, with no date. You bought 800 g, with no date. The row becomes 1000 g.

Put away also adds to the row of the same place that has no use-by date, and the row gets the date. Oats with no date and a new bag of oats with a date are one row. The form of the Pantry part does not do this, because there you type a date on purpose.

If not, the food gets a new row. Milk with a new date is a second row, because the two cartons spoil on different days. The [amounts](amounts.md) page tells which units compare.

## A price is a number

A price has no currency. A point or a comma is its decimal mark, and the receipt shows 2 decimals: "0.5" is "0.50". Text that is not a number counts as a missing price. If you remove the text of an amount, the item goes in as 1.

## Further reading

- [Level](level.md): the full amount, which tells what makes a food item full.
