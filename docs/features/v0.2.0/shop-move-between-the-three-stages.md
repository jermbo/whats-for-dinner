---
title: Move between the three stages of a trip
summary: "The shopper sees the Shop part as three stages, Extras, Shop, and Put away, each with its count, and opens each stage with one tap."
parent: shop-stories.md
updated: 2026-10-17
persona: Shopper
depends-on: [shop-keep-the-cart-in-the-shopping-note.md, shop-see-the-staples-that-need-a-look.md, shop-give-the-facts-of-each-item.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Move between the three stages of a trip

# Move between the three stages of a trip

As the [shopper](../../personas.md), I want the Shop part in three stages, each with one job and its count, so that I always know which items are suggestions, which are on the list, and which are in the cart.

## Requirements

1. The Shop part has a strip at the top with three stages: "1 Extras", "2 Shop", and "3 Put away"
   - a. "Extras" has the number of the suggestions
   - b. "Shop" has the number of the rows of the list
   - c. "Put away" has the number of the items of the cart
   - d. A stage with nothing in it shows "0"
2. Tap a stage of the strip to open it
   - a. Each stage opens at any time, also with a count of 0
   - b. An ink line under the open stage slides to the stage that opens, in 0.2 s
   - c. With less motion, the line moves with no slide
3. Each stage has one main button at the bottom of the Shop part
   - a. The stage Extras has "Go shopping", which opens the stage Shop
   - b. The stage Shop has "Put away" with the number of the items of the cart, such as "Put away 3", which opens the stage Put away
   - c. "Put away" shows only when the cart has items
   - d. The stage Put away has "Put into the pantry"
4. The screen of put away is the stage Put away
   - a. It has no "Back"
   - b. With an empty cart, it says "The cart is empty.", and it has no button "Put into the pantry"
5. When an item goes to a different stage, the count of that stage changes with a motion of 0.2 s
6. When Obsidian starts, the Shop part opens on the stage that has work
   - a. The stage Extras, when a suggestion needs a look and the cart is empty
   - b. The stage Shop, in each other case
   - c. The same rule selects the stage after "Put into the pantry"
7. The Shop part keeps the stage that you opened when you go to a different part and back

## Acceptance criteria

Each criterion starts with a trip in which six suggestions need a look, the list has two rows of a meal, "Avocados" and "Lime", and the cart is empty. In the test vault, the guacamole in the plan and a pantry with no avocados and no lime give the two rows.

1. GIVEN the trip WHEN the shopper looks at the strip THEN it shows "1 Extras" with "6", "2 Shop" with "2", and "3 Put away" with "0"
2. GIVEN the open note has the line `- [x] [[Pantry/Lime|Lime]]` WHEN the shopper looks at the strip THEN "2 Shop" has "1"
   - a. AND "3 Put away" has "1"
3. GIVEN the stage Shop is open WHEN the shopper taps "1 Extras" THEN the stage Extras is open
   - a. AND the ink line of the strip is under "1 Extras"
4. GIVEN the cart is empty WHEN the shopper taps "3 Put away" THEN the stage Put away says "The cart is empty."
   - a. AND it has no button "Put into the pantry"
5. GIVEN the stage Extras is open WHEN the shopper taps "Go shopping" THEN the stage Shop is open
6. GIVEN the cart is empty WHEN the shopper opens the stage Shop THEN it has no button "Put away"
7. GIVEN "Lime" is in the cart WHEN the shopper opens the stage Shop THEN its main button is "Put away 1"
8. GIVEN "Lime" is in the cart WHEN the shopper taps "Put away 1" THEN the stage Put away is open, with 1 line
   - a. AND it has no "Back"
9. GIVEN the stage Extras is open WHEN the planner taps "Add" on a suggestion THEN "1 Extras" has "5"
   - a. AND "2 Shop" has "3"
10. GIVEN the trip WHEN Obsidian starts, and the shopper opens the Shop part THEN the stage Extras is open
11. GIVEN the planner skipped the six suggestions, and the cart is empty WHEN Obsidian starts, and the shopper opens the Shop part THEN the stage Shop is open
12. GIVEN "Lime" is in the cart WHEN Obsidian starts, and the shopper opens the Shop part THEN the stage Shop is open
13. GIVEN the stage Put away is open WHEN the keeper opens the Pantry part, and then the Shop part THEN the stage Put away is open
14. GIVEN "Lime" is in the cart, and the stage Put away is open WHEN the keeper taps "Put into the pantry" THEN the stage Extras is open

## Depends on

- [Keep the cart in the shopping note](shop-keep-the-cart-in-the-shopping-note.md): the cart, which the stage Put away counts.
- [See the staples that need a look](shop-see-the-staples-that-need-a-look.md): the suggestions, which the stage Extras counts.
- [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md): the screen of put away, which becomes the stage Put away. This story changes its requirements 1 and 11: the strip and the button "Put away" open the stage, and the stage has no "Back".

## Architecture

- [Shopping](../../architecture/shopping.md): the list, the cart, and put away, which the three stages show.
- [Put away](../../architecture/put-away.md): the screen that is the third stage.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decisions 33 and 38, with the reason for the stages. It is a page of the initiative.
