---
title: Get a receipt for each trip
summary: "The keeper puts the cart away, and the open note becomes the receipt of that day."
parent: shop-stories.md
updated: 2026-10-13
persona: Keeper
depends-on: [shop-keep-the-cart-in-the-shopping-note.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Get a receipt for each trip

# Get a receipt for each trip

As the [keeper](../../personas.md), I want put away to change the note of the trip into a receipt, so that the vault has one note for each trip to the store, with what I bought.

## Requirements

1. Tap the button of put away to end the trip
   - a. The items of the cart go into the pantry, as before this story
   - b. With no item in the cart, the button does not show
2. The open note becomes the receipt
   - a. Each task with a mark becomes one row of a table
   - b. The table has the columns "Item", "Amount", "Price", "Sale", "Place", and "Use by"
   - c. "Item" has the link of the task
   - d. "Amount" and "Place" have what went into the pantry
   - e. The cells "Price", "Sale", and "Use by" are empty
   - f. The note gets the property `date`, with the day of put away
   - g. Your own text stays in the note
3. The receipt gets the name of the day, as year-month-day
   - a. If the folder has a note with that name, the name gets a number: `2026-10-13 2`
4. Each task with no mark goes into a new note "Next trip"
   - a. With no such task, the plugin makes no new note
5. Each food item that went into the pantry gets the purchase date
   - a. The property `bought` of its note has the day of put away

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-13, with the guacamole in the plan. The pantry has no avocados, and it has 2 limes in "Kitchen pantry". The open note has this text:

```markdown
Mum comes on Friday.

- [ ] [[Shopping/Items/Batteries|Batteries]]
- [x] [[Pantry/Lime|Lime]]
- [x] [[Pantry/Avocados|Avocados]]
```

1. GIVEN the cart has lime and avocados WHEN the keeper taps the button of put away THEN the vault has the note `Shopping/2026-10-13`
   - a. AND the note has the property `date: 2026-10-13`
   - b. AND the note has the line "Mum comes on Friday."
   - c. AND the note has no task
2. GIVEN the cart has lime and avocados WHEN the keeper taps the button of put away THEN the table of the receipt has 2 rows
   - a. AND the row of lime has the item `[[Pantry/Lime\|Lime]]`, the amount "1", and the place "Kitchen pantry"
   - b. AND the row of avocados has the item `[[Pantry/Avocados\|Avocados]]`, the amount "2", and the place "Kitchen"
   - c. AND the cells "Price", "Sale", and "Use by" of the 2 rows are empty
3. GIVEN the open note has the task of batteries with no mark WHEN the keeper taps the button of put away THEN the vault has a new note `Shopping/Next trip`
   - a. AND that note has the line `- [ ] [[Shopping/Items/Batteries|Batteries]]`
   - b. AND that note has 1 task
4. GIVEN the open note has no task with no mark WHEN the keeper taps the button of put away THEN the vault has no note `Shopping/Next trip`
5. GIVEN the cart has lime and avocados WHEN the keeper taps the button of put away THEN the note `Lime` has `bought: 2026-10-13`
   - a. AND the note `Avocados` has `bought: 2026-10-13`
6. GIVEN the vault has the receipt `Shopping/2026-10-13` WHEN the keeper puts a second cart away on 2026-10-13 THEN the vault has the note `Shopping/2026-10-13 2`
7. GIVEN the open note has no task with a mark WHEN the keeper opens the Shop part THEN the button of put away does not show

## Depends on

- [Keep the cart in the shopping note](shop-keep-the-cart-in-the-shopping-note.md): the open note, with the cart as its tasks with a mark.

## Architecture

- [Put away](../../architecture/put-away.md): which place gets the food, and which amount.
- [Food item note](../../architecture/food-item-note.md): the note that gets the row and the purchase date.
- [Receipt](../../architecture/receipt.md): the form of the receipt.
