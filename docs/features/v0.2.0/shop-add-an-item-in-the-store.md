---
title: Add an item in the store
summary: "The shopper types a name into the field to find, and puts an item that is not on the list into the cart with one tap."
parent: shop-stories.md
updated: 2026-10-17
persona: Shopper
depends-on: [shop-tick-the-items-into-the-cart.md, shop-add-an-item-of-your-own.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Add an item in the store

# Add an item in the store

As the [shopper](../../personas.md), I want the field to find in the stage Shop to add an item that is not on the list straight into the cart, so that I take what I see in the store with one tap.

## Requirements

1. When the text of the field finds no row of the list, the stage Shop shows the notes that the text finds
   - a. They are the proposals of the field "Add an item": food items and notes of the folder for items
   - b. Each proposal has "Add to cart"
   - c. "Add as new" adds an item that no note has, with the text as its name
   - d. A note that is a row of the list or an item of the cart is not a proposal
2. "Add to cart" puts the item into the cart at once
   - a. The open note gets a task with a mark
   - b. The field is empty again
3. When the text finds a row, the stage shows the rows as before

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17, after the clean-up of that day, with the setting "Low line" at 20 %. The plan has the boiled eggs, the open note has no task, and the data file has no skipped suggestion.

1. GIVEN the stage Shop is open WHEN the shopper types "batt" THEN the stage shows "Batteries" with "Add to cart"
   - a. AND it shows "Add as new"
2. GIVEN the stage shows "Batteries" WHEN the shopper taps "Add to cart" THEN the open note has the line `- [x] [[Shopping/Items/Batteries|Batteries]]`
   - a. AND the line "In the cart" has "1"
   - b. AND the field is empty
3. GIVEN the stage Shop is open WHEN the shopper types "tape" and taps "Add as new" THEN the open note has the line `- [x] [[Shopping/Items/Tape|Tape]]`
4. GIVEN the list has the row "Eggs" WHEN the shopper types "egg" THEN the stage shows the row "Eggs"
   - a. AND it shows no "Add to cart"

## Depends on

- [Tick the items into the cart](shop-tick-the-items-into-the-cart.md): the stage Shop and its field to find.
- [Add an item of your own](shop-add-an-item-of-your-own.md): the proposals, and the folder for items.

## Architecture

- [Shopping](../../architecture/shopping.md): what a tap in the store does.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 45. It is a page of the initiative.
