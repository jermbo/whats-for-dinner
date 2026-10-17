---
title: Start from the facts of the last receipt
summary: "The screen of put away starts each item with the amount, the place, and the days of its last receipt, and with its regular price."
parent: shop-stories.md
updated: 2026-10-17
persona: Keeper
depends-on: [shop-give-the-facts-of-each-item.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Start from the facts of the last receipt

# Start from the facts of the last receipt

As the [keeper](../../personas.md), I want the screen of put away to start with what I bought the last time and with the price that I usually pay, so that the usual item needs no entry.

## Requirements

1. The plugin reads the receipts of the folder of the shopping notes
   - a. A receipt is a note of that folder with a table that has the column "Item"
   - b. The plugin finds each column by its name, so the sequence of the columns is free
   - c. The day of a receipt is its property `date`. With no `date`, it is the name of the note
   - d. A change of a receipt by hand counts with no restart
   - e. A row with "yes" in the column "Sale" was on sale. The case of the letters is free
2. The last receipt of an item is the newest receipt with a row that links to the note of the item
3. With a last receipt, the facts of an item start from its row
   - a. The amount is the newest amount of the rows of the item that is in the unit of the food item
   - b. The place is the place of the row
   - c. The use-by date is today, plus the days from the day of the receipt to the use-by date of the row
   - d. "Sale" starts off
4. The price starts as the regular price of the item
   - a. The regular price is the price of the newest row of the item that has a price and no sale mark
   - b. A sale price is never the price that the item starts with
   - c. With no such row, the price starts empty
5. "How much" has one option for each amount of the rows of the item, from the newest row
   - a. Two rows with the same amount give one option
   - b. "How much" has 3 options or less, with the amount that the item starts with first
   - c. An amount that is not in the unit of the food item is not an option
6. The unit of a food item is the unit of its full amount, or of its first row
   - a. A food item that the pantry cannot count has no unit, and each amount is in its unit
   - b. An item that is not in the pantry takes each amount
7. With no amount in the unit of the food item, the amount starts as the first of these
   - a. The amount of the row on the list, with what makes a staple full
   - b. The full amount of the food item
   - c. "1"
8. "Sale" puts the regular price out of the price field
   - a. The field shows it as a hint, such as "3.99 regular"
   - b. A second tap on "Sale", with no text in the field, puts the regular price back
9. A fact with no start from a receipt starts as [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md) tells
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
   - b. AND the price is "3.99", the regular price of 2026-09-28
   - c. AND the use-by date is 2026-11-03
   - d. AND "Sale" is off
2. GIVEN milk is in the cart WHEN the keeper opens the screen of put away on 2026-10-13 THEN the amount of milk is "1 l"
   - a. AND the price is "1.29"
   - b. AND the use-by date is 2026-10-20
3. GIVEN lime is in the cart, and no receipt has lime WHEN the keeper opens the screen of put away THEN the price of lime is empty
   - a. AND the use-by date of lime is empty
   - b. AND the place of lime is "Kitchen pantry"
4. GIVEN eggs and lime are in the cart WHEN the keeper opens the screen of put away THEN the text is "1 price is missing"
5. GIVEN you changed the price of eggs to "3.79" in the note `Shopping/2026-09-28` WHEN the keeper opens the screen of put away THEN the price of eggs is "3.79"
6. GIVEN you removed "yes" from the cell "Sale" of eggs in the note `Shopping/2026-10-04` WHEN the keeper opens the screen of put away THEN the price of eggs is "3.49"
7. GIVEN the cell "Sale" of eggs in the note `Shopping/2026-10-04` has "Yes" WHEN the keeper opens the screen of put away THEN the price of eggs is "3.99"
8. GIVEN the note `Shopping/2026-10-04` has no property `date` WHEN the keeper opens the screen of put away THEN the use-by date of eggs is 2026-11-03
9. GIVEN the table of `Shopping/2026-10-04` has the column "Price" before the column "Amount" WHEN the keeper opens the screen of put away THEN the price of eggs is "3.99"
   - a. AND the amount of eggs is "12"
10. GIVEN the cell "Use by" of the row of milk is empty WHEN the keeper opens the screen of put away THEN the use-by date of milk is empty
    - a. AND the price of milk is "1.29"
11. GIVEN the vault has the open note `Shopping/Next trip`, with a task for eggs WHEN the keeper opens the screen of put away THEN the price of eggs is "3.99"
12. GIVEN the only receipt with lime has the price "0.50" and "yes" in "Sale" WHEN the keeper opens the screen of put away THEN the price of lime is empty
13. GIVEN you changed the amount of eggs to "6" in the note `Shopping/2026-09-28` WHEN the keeper opens the line of eggs THEN "How much" has the options "12" and "6", in this sequence
14. GIVEN the screen of put away shows eggs with the price "3.99" WHEN the keeper taps "Sale" on eggs THEN the price field of eggs is empty
    - a. AND the field shows the hint "3.99 regular"
15. GIVEN "Sale" of eggs is on, and the price field is empty WHEN the keeper taps "Sale" on eggs THEN the price of eggs is "3.99"
16. GIVEN the note `Oats` has `full: 50 g` and 7.5 g, the only receipt of oats has the amount "1", and the list has the row "Oats" with "42.5 g" WHEN the keeper opens the screen of put away THEN the amount of oats is "42.5 g"
    - a. AND "How much" of oats has no option "1"
17. GIVEN the note `Oats` has `full: 50 g` and 50 g, the only receipt of oats has the amount "1", and oats are an extra with no amount WHEN the keeper opens the screen of put away THEN the amount of oats is "50 g"
18. GIVEN the receipt of 2026-10-04 has rice with "5 kg", and the receipt of 2026-10-14 has rice with "1" WHEN the keeper opens the screen of put away THEN the amount of rice is "5 kg"
19. GIVEN the only receipt with batteries has the amount "4" WHEN the keeper opens the screen of put away with batteries in the cart THEN the amount of batteries is "4"

## Depends on

- [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md): the screen, and the start of each fact with no receipt. Requirement 7 b of this story changes its requirement 2 b: the full amount comes before "1".

## Architecture

- [Facts of an item](../../architecture/put-away-facts.md): what each fact starts as, with and with no last receipt.
- [Receipt](../../architecture/receipt.md): the form of a receipt, and what the plugin reads in it.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 13, why the prices are only in the receipts, and decision 30, why a sale price is never the start, and decision 39, why the amount must be in the unit of the food item. It is a page of the initiative.
