---
title: Receipt
summary: "The exact form of the note of a trip that is complete: its name, its properties, and the table with one row for each item."
parent: shopping-note.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / [Shopping note](shopping-note.md) / Receipt

# Receipt

Each trip to the store gets a receipt note: what you bought, and what you paid. The note starts when the stage Put away opens, and it is complete when the last item is in the pantry. This page gives the form of that note.

## A complete note

This is the note `2026-10-18.md`, in the shopping folder:

```markdown
---
status: complete
date: 2026-10-18
store: Market B
---

Mum comes on Friday.

| Item                                              | Brand                            | Amount | Price | Sale | Place          | Use by     |
| ------------------------------------------------- | -------------------------------- | ------ | ----- | ---- | -------------- | ---------- |
| [[Pantry/Eggs\|Eggs]]                             |                                  | 12     | 3.49  | yes  | Outside fridge | 2026-11-08 |
| [[Pantry/Taco seasoning\|Taco seasoning]]         | [[Taco seasoning - Brand A.jpg]] | 1 bag  | 2.49  |      | Kitchen pantry |            |
| [[Shopping/Items/Batteries\|Batteries]]           |                                  |        | 6.99  |      |                |            |
```

In a table, the line between a link and its name has a backslash before it. Obsidian writes a link in a table this way.

## The name is the day of put away

A trip can start on Tuesday with one item, and be in the store on Saturday. The receipt gets the name of the day on which put away starts, as year-month-day. It keeps that name, so a link to it stays correct. Each receipt has the day on which you bought the food, and the number of receipts is the number of trips.

A second receipt of one day gets a number: `2026-10-18 2`.

## The properties

| Property | Value                                   | With no value                                |
| -------- | --------------------------------------- | -------------------------------------------- |
| `status` | `active` while put away is open, and `complete` after it. | The receipt is complete.        |
| `date`   | The day of put away, as year-month-day. | The day is the date in the name of the note. |
| `store`  | The store of the trip.                  | The receipt has no store.                    |

## One row is one item of the cart

Each row has the [facts](put-away-facts.md) that you gave for its item. The rows have the order in which you took the items in the store, so the list of the next trip in that store can follow it.

| Column   | Value                                               | With no value                        |
| -------- | --------------------------------------------------- | ------------------------------------ |
| `Item`   | The link of the task, or its text.                  | The row is not a row of the receipt. |
| `Brand`  | The brand that you bought: the link to its first photo, or its name. | The row has no brand. |
| `Amount` | What went into the pantry, such as `12` or `1 l`.   | The item is not in the pantry.       |
| `Price`  | What you paid for the full amount, with 2 decimals. | The price is missing.                |
| `Sale`   | `yes`, if the item was on sale.                     | The item was not on sale.            |
| `Place`  | The place that got the food.                        | The item is not in the pantry.       |
| `Use by` | The use-by date of the food, as year-month-day.     | The food has no date.                |

## The receipts are the history

The plugin reads each note of the shopping folder that has a table with the column `Item`. It finds each column by its name, so the sequence of the columns is free.

A receipt with no column `Brand` counts as a receipt with no brand. The cell is the link to a photo, and not the name, because the plugin never renames a photo. So the row still finds its [brand](brands.md) after the brand gets a name or a new name.

The next put away starts from the last receipt of each item, and it shows each store that a receipt has. So a price or a store that you correct by hand counts at the next trip.

## An active receipt

While put away is open, the receipt has `status: active` and one more column, `Done`. It has `yes` for each item that is in the pantry. The plugin reads the facts of the stage Put away from this table, so the work continues after a restart or on a different device.

| Event                                  | What changes in the note                                     |
| -------------------------------------- | ------------------------------------------------------------ |
| The stage Put away opens with a cart   | The note starts, with one row for each item, in task order.  |
| You tick an item in the store          | Its row comes at the end of the table.                       |
| You correct a fact                     | Its cell changes. A price stays as you typed it.             |
| You tap a brand                        | The cell `Brand` changes.                                    |
| "Undo" or "Not bought"                 | The row goes, if the item is not done.                       |
| "Put away" on an item                  | Its cell `Done` gets `yes`.                                  |
| The last item is in the pantry         | The receipt is complete.                                     |

The history uses only the receipts that are complete. So a price that you are typing is not the price of the last receipt.

## What the end of put away does

1. The note gets `status: complete` and the store of the trip.
2. The column `Done` goes, and each price gets 2 decimals.
3. Your own text of the note "Next trip" goes into the receipt, above the table.
4. The note "Next trip" keeps only the tasks with no mark. You did not buy those items, and the request still stands.

## Further reading

- [Put away](put-away.md): what goes into the pantry in the same action.
- [Food item note](food-item-note.md): the note that gets the purchase date.
