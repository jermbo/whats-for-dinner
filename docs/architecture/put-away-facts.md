---
title: Facts of an item
summary: "The five facts that you give for an item at put away: what the plugin proposes for each one, and where each one goes."
parent: put-away.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / [Put away](put-away.md) / Facts of an item

# Facts of an item

At [put away](put-away.md), you have the bag and the paper receipt in your hand. It is the only moment in which you know what you bought and what you paid. This page tells which facts the plugin asks for, and how it keeps the entry small.

## Five facts, and two places for them

| Fact        | Where it goes                                              |
| ----------- | ---------------------------------------------------------- |
| Amount      | The row of the food item, and the receipt.                 |
| Place       | The row of the food item, and the receipt.                 |
| Use-by date | The row of the food item, and the receipt.                 |
| Price       | The receipt only. It is what you paid for the full amount. |
| "On sale"   | The receipt only.                                          |

The pantry has the state of now, and the [receipt](receipt.md) has the history. So a price is in no food item note.

## The plugin proposes, and you correct

You usually buy the same box of eggs, for about the same price, and you put it in the same place. So each fact starts from the last receipt of the item: the newest receipt with a row that links to its note.

| Fact        | From the last receipt                        | With no receipt, or with an empty cell                                 |
| ----------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| Amount      | The amount of the row.                       | The larger of two amounts: the list row, and what makes the food full. |
| Place       | The place of the row.                        | The place of the first row of the food item.                           |
| Use-by date | Today, plus the days that the food had then. | Empty.                                                                 |
| Price       | The price of the row.                        | Empty.                                                                 |
| "On sale"   | Off.                                         | Off.                                                                   |

An item with no list row and no level starts with the amount 1. A food item with no row starts in the place for new food of the [settings](settings.md). "On sale" starts off each time, because a sale ends.

## An example

You bought 12 eggs on 4 October for 3.49, with the use-by date 25 October. That is 21 days. On 13 October, the line of the eggs starts with 12, "Outside fridge", 3.49, and the date 3 November.

## One row for one place

The amount goes into a row that the food item has, if three things are the same: the place, the use-by date, and the kind of unit. Flour has 200 g in the kitchen pantry, with no date. You bought 800 g, with no date. The row becomes 1000 g.

If not, the food gets a new row. Milk with a new date is a second row, because the two cartons spoil on different days. The [amounts](amounts.md) page tells which units compare.

## A price is a number

A price has no currency. A point or a comma is its decimal mark, and the receipt shows 2 decimals: "0.5" is "0.50". Text that is not a number counts as a missing price.

If you remove the text of an amount, the item goes in as 1.

## Further reading

- [Level](level.md): the full amount, which tells what makes a food item full.
