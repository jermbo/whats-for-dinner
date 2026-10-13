---
title: Start from the facts of the last receipt
summary: "The screen of put away starts each item with the amount, the place, the price, and the days of its last receipt."
parent: shop-stories.md
updated: 2026-10-13
persona: Keeper
depends-on: [shop-give-the-facts-of-each-item.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Start from the facts of the last receipt

# Start from the facts of the last receipt

As the [keeper](../../personas.md), I want the screen of put away to start with what I bought and what I paid the last time, so that the usual item needs no entry.

## Requirements

1. The plugin reads the receipts of the folder of the shopping notes
   - a. A receipt is a note of that folder with a table that has the column "Item"
   - b. The plugin finds each column by its name, so the sequence of the columns is free
   - c. The day of a receipt is its property `date`. With no `date`, it is the name of the note
   - d. A change of a receipt by hand counts with no restart
2. The last receipt of an item is the newest receipt with a row that links to the note of the item
3. With a last receipt, the facts of an item start from its row
   - a. The amount is the amount of the row
   - b. The place is the place of the row
   - c. The price is the price of the row
   - d. The use-by date is today, plus the days from the day of the receipt to the use-by date of the row
   - e. "On sale" starts off
4. A fact with no start from a receipt starts as [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md) tells
   - a. Each fact of an item with no last receipt
   - b. A fact whose cell is empty in the row of the last receipt

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-13. The test vault needs two receipts. The note `Shopping/2026-09-28` has the property `date: 2026-09-28` and this table:

```markdown
| Item                  | Amount | Price | Sale | Place          | Use by     |
| --------------------- | ------ | ----- | ---- | -------------- | ---------- |
| [[Pantry/Eggs\|Eggs]] | 12     | 3.99  |      | Outside fridge | 2026-10-19 |
```

The note `Shopping/2026-10-04` has the property `date: 2026-10-04` and this table:

```markdown
| Item                  | Amount | Price | Sale | Place          | Use by     |
| --------------------- | ------ | ----- | ---- | -------------- | ---------- |
| [[Pantry/Eggs\|Eggs]] | 12     | 3.49  | yes  | Outside fridge | 2026-10-25 |
| [[Pantry/Milk\|Milk]] | 1 l    | 1.29  |      | Kitchen        | 2026-10-11 |
```

1. GIVEN eggs are in the cart WHEN the keeper opens the screen of put away on 2026-10-13 THEN the amount of eggs is "12"
   - a. AND the place is "Outside fridge"
   - b. AND the price is "3.49"
   - c. AND the use-by date is 2026-11-03
   - d. AND "On sale" is off
2. GIVEN milk is in the cart WHEN the keeper opens the screen of put away on 2026-10-13 THEN the amount of milk is "1 l"
   - a. AND the price is "1.29"
   - b. AND the use-by date is 2026-10-20
3. GIVEN lime is in the cart, and no receipt has lime WHEN the keeper opens the screen of put away THEN the price of lime is empty
   - a. AND the use-by date of lime is empty
   - b. AND the place of lime is "Kitchen pantry"
4. GIVEN eggs and lime are in the cart WHEN the keeper opens the screen of put away THEN the text is "1 price is missing"
5. GIVEN you changed the price of eggs to "3.59" in the note `Shopping/2026-10-04` WHEN the keeper opens the screen of put away THEN the price of eggs is "3.59"
6. GIVEN the note `Shopping/2026-10-04` has no property `date` WHEN the keeper opens the screen of put away THEN the price of eggs is "3.49"
7. GIVEN the table of `Shopping/2026-10-04` has the column "Price" before the column "Amount" WHEN the keeper opens the screen of put away THEN the price of eggs is "3.49"
   - a. AND the amount of eggs is "12"
8. GIVEN the cell "Use by" of the row of milk is empty WHEN the keeper opens the screen of put away THEN the use-by date of milk is empty
   - a. AND the price of milk is "1.29"
9. GIVEN the vault has the open note `Shopping/Next trip`, with a task for eggs WHEN the keeper opens the screen of put away THEN the price of eggs is "3.49"

## Depends on

- [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md): the screen, and the start of each fact with no receipt.

## Architecture

- [Facts of an item](../../architecture/put-away-facts.md): what each fact starts as, with and with no last receipt.
- [Receipt](../../architecture/receipt.md): the form of a receipt, and what the plugin reads in it.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 13, why the prices are only in the receipts. It is a page of the initiative.
