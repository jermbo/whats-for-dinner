---
title: Put an item of your own into the pantry
summary: "The keeper puts an item that the pantry does not have into the pantry, with one tap on the screen of put away."
parent: shop-stories.md
persona: Keeper
depends-on: [shop-add-an-item-of-your-own.md, shop-give-the-facts-of-each-item.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Put an item of your own into the pantry

# Put an item of your own into the pantry

As the [keeper](../../personas.md), I want one tap on the screen of put away to put a new item into the pantry, so that food that I buy for the first time gets its food item note with no second entry.

## Requirements

1. On the screen of put away, an item that is not in the pantry has the switch "Into the pantry"
   - a. The switch starts off
2. With the switch on, the item shows its amount, its place, and its use-by date
   - a. The amount starts as "1"
   - b. The place starts as the setting "Place for new food"
   - c. The use-by date starts empty
3. With the switch on, the button of put away makes the food item note
   - a. The note is in the pantry folder, with the name of the item
   - b. The note has one row, with the place, the amount, and the use-by date
   - c. The note has the property `bought`, with the day of put away
4. The row of the receipt links to the new note
   - a. The row has the facts of the item, as each item of the pantry has
5. With the switch off, the pantry does not change

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-13. The vault has no note `Quinoa`. The open note has the line `- [x] [[Shopping/Items/Quinoa|Quinoa]]`, so "Quinoa" is in the cart.

1. GIVEN "Quinoa" is in the cart WHEN the keeper opens the screen of put away THEN "Quinoa" has the switch "Into the pantry"
   - a. AND the switch is off
   - b. AND "Quinoa" shows only its price and "On sale"
2. GIVEN eggs are in the cart WHEN the keeper opens the screen of put away THEN eggs have no switch "Into the pantry"
3. GIVEN the switch of "Quinoa" is off WHEN the keeper taps the switch THEN "Quinoa" shows the amount "1"
   - a. AND the place "Kitchen"
   - b. AND an empty use-by date
4. GIVEN the switch is on, with the amount "500 g", the place "Kitchen pantry", and the price "2.99" WHEN the keeper taps "Put into the pantry" THEN the vault has the note `Pantry/Quinoa`
   - a. AND the note has one row: "Kitchen pantry" with "500 g"
   - b. AND the note has `bought: 2026-10-13`
5. GIVEN the switch is on, with the amount "500 g", the place "Kitchen pantry", and the price "2.99" WHEN the keeper taps "Put into the pantry" THEN the row of the receipt has the item `[[Pantry/Quinoa\|Quinoa]]`
   - a. AND the row has "500 g", "2.99", and "Kitchen pantry"
6. GIVEN the keeper put "Quinoa" into the pantry WHEN the keeper opens the Pantry part THEN the pantry shows quinoa in "Kitchen pantry"
7. GIVEN the switch is off, with the price "2.99" WHEN the keeper taps "Put into the pantry" THEN the vault has no note `Pantry/Quinoa`
   - a. AND the row of the receipt has the item `[[Shopping/Items/Quinoa\|Quinoa]]` and the price "2.99"
8. GIVEN the open note has the line `- [x] Quinoa`, with no link WHEN the keeper taps the switch and taps "Put into the pantry" THEN the vault has the note `Pantry/Quinoa`
   - a. AND the row of the receipt has the item `[[Pantry/Quinoa\|Quinoa]]`

## Depends on

- [Add an item of your own](shop-add-an-item-of-your-own.md): the item that is not in the pantry, and its link.
- [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md): the screen of put away, and the facts of an item.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the note that the button makes.
- [Settings](../../architecture/settings.md): the place for new food.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 21, why an item has no note before this tap. It is a page of the initiative.
