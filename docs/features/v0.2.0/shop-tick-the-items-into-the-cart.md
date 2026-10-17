---
title: Tick the items into the cart
summary: "The shopper ticks each row of the list into the cart, and sees the cart as one closed line under the list."
parent: shop-stories.md
updated: 2026-10-17
persona: Shopper
depends-on: [shop-move-between-the-three-stages.md, shop-keep-the-cart-in-the-shopping-note.md, shop-see-the-staples-that-need-a-look.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Tick the items into the cart

# Tick the items into the cart

As the [shopper](../../personas.md), I want a box to tick on each row of the list, and the cart in one closed line, so that I see at a glance what is left to get and what is in the cart.

## Requirements

1. The stage Shop shows the list under the heading "To get", with the number of its rows
   - a. The bar of the list is in this stage only: the field to find, the sequence, and the filters
   - b. The pieces that show the progress of the trip stay above the list
2. Each row of the list has a box at its start
   - a. The row of a meal shows its meals under the name, as before
   - b. The row of an extra has the sticker "Extra", and "Remove", as before
   - c. A row that is an extra and that a meal needs shows the two
3. Tap a row to put its item in the cart
   - a. The box gets a tick, and then the row slides into the line "In the cart", in 0.2 s
   - b. With less motion, the row goes with no slide
4. The cart is one line under the list: "In the cart", with the number of its items
   - a. The line is closed when the stage opens
   - b. Tap the line to open it, and tap it again to close it
   - c. The open line shows each item with a tick, its name, its amount, and "Undo"
   - d. No name has a line through it
   - e. With an empty cart, the line does not show
5. The word "Extras" replaces "Your choices"
   - a. The filter "Your choices" has the name "Extras"
   - b. The group "Your choices" of the sequence "By meal" has the name "Extras"
6. With no row on the list, the stage says what is true
   - a. "Each item is in the cart." when the cart has items
   - b. "Nothing to get." when the cart is empty

## Acceptance criteria

Each criterion starts with the test vault, with the guacamole in the plan, no open note, and no avocados and no lime in the pantry. So the list has two rows of a meal: "Avocados" with "4", and "Lime" with "1".

1. GIVEN the cart is empty WHEN the shopper opens the stage Shop THEN the heading of the list is "To get" with "2"
2. GIVEN the stage Shop is open WHEN the shopper looks at the row "Lime" THEN it has a box with no tick
   - a. AND it shows "Guacamole" under the name
   - b. AND it has no sticker "Extra"
3. GIVEN the open note has the line `- [ ] [[Pantry/Flour|Flour]]` WHEN the shopper opens the stage Shop THEN the row "Flour" has the sticker "Extra"
   - a. AND it has "Remove"
4. GIVEN the cart is empty WHEN the shopper taps the row "Lime" THEN the list has no row "Lime"
   - a. AND the line "In the cart" has "1"
   - b. AND the heading of the list is "To get" with "1"
5. GIVEN "Lime" is in the cart WHEN the shopper opens the stage Shop THEN the line "In the cart" is closed
6. GIVEN "Lime" is in the cart WHEN the shopper taps the line "In the cart" THEN it shows "Lime" with a tick, "1", and "Undo"
   - a. AND the name "Lime" has no line through it
7. GIVEN the line "In the cart" is open WHEN the shopper taps the line THEN it is closed
8. GIVEN the line "In the cart" is open, with "Lime" WHEN the shopper taps "Undo" on "Lime" THEN the list has the row "Lime" again
   - a. AND the line "In the cart" does not show
9. GIVEN the open note has the line `- [ ] [[Pantry/Flour|Flour]]` WHEN the shopper opens the bar THEN the filters are "For a meal" and "Extras"
10. GIVEN the open note has the line `- [ ] [[Pantry/Flour|Flour]]`, and the sequence is "By meal" WHEN the shopper looks at the list THEN the last group is "Extras", with the row "Flour"
11. GIVEN "Avocados" and "Lime" are in the cart WHEN the shopper opens the stage Shop THEN it says "Each item is in the cart."
12. GIVEN the plan has no meal, and the open note has no task WHEN the shopper opens the stage Shop THEN it says "Nothing to get."

## Depends on

- [Move between the three stages of a trip](shop-move-between-the-three-stages.md): the stage Shop.
- [Keep the cart in the shopping note](shop-keep-the-cart-in-the-shopping-note.md): the tap that puts an item in the cart, and "Undo".
- [See the staples that need a look](shop-see-the-staples-that-need-a-look.md): the filter and the group "Your choices". This story changes its requirement 8 b and its criteria 25 and 26: the name is "Extras".

## Architecture

- [Shopping](../../architecture/shopping.md): what a tap in the store does.
- [Shopping note](../../architecture/shopping-note.md): the task with a mark, which is an item of the cart.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decisions 35 and 37, with the reason for the box, the closed line, and the word "extra". It is a page of the initiative.
