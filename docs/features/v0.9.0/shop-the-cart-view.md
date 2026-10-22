---
title: The cart view
summary: "A tap on the cart grows a dark circle into the cart view, which fills the stage. A tap on a row flies its name back to the shelf. Put away starts here."
parent: shop-stories.md
updated: 2026-10-21
persona: Shopper
depends-on: [shop-the-shelf-and-the-cart.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / The cart view

# The cart view

As the [shopper](../../personas.md), I want to open the cart as a view of its own, and put an item back with one tap, so that I can check the cart before the till.

## Requirements

1. A tap on the cart button opens the cart view, on a phone and on a computer
   - a. A dark circle grows from the cart button over the stage, and the cart view shows under it, as Cook Mode opens
   - b. The cart button is ink, and the shelf is white
2. The cart view is a dark card that fills the stage
   - a. Its head: "In the cart" and the count, at the size `title`
   - b. One row for each item: an olive check, the name at the size `name`, the amount, and the regular price in small text
   - c. A row of an item with a brand that you took has the small photo of the brand before the name. A tap on the photo shows it large, with "In cart" to take a different brand
   - d. Below the rows: "About" and the sum of the regular prices
   - e. With no item: "The cart is empty."
3. A tap on a row puts the item back on the list
   - a. Its name flies from the row to the shelf, and the shelf gives a squeeze
   - b. The row fades in its place, then the rows below glide up
   - c. The item has no mark in the shopping note
4. "Put away" with the count of the cart is the pill at the bottom of the cart view
   - a. It opens the stage Put away, as today
5. A tap on the shelf goes back to the list
   - a. A circle of paper grows from the shelf over the stage, and the list shows under it
   - b. An item that came back shows its tick for one moment in its row, and the tick goes, in 0.4 s
6. With less motion, each view shows at once, and no name flies

## Acceptance criteria

Each criterion starts with the shopping note of the test vault, with Bread in the cart.

1. GIVEN the stage Shop WHEN the shopper taps the cart button THEN a dark circle grows from it, and the cart view shows "In the cart" with the count of the cart
   - a. AND the cart button is ink
2. GIVEN the cart view WHEN the shopper taps the row of Bread THEN a pill "Bread" flies to the shelf, and the row of Bread goes
   - a. AND the shopping note has `- [ ] [[Larder/Pantry/Bread|Bread]]`
3. GIVEN the cart view WHEN the shopper taps "Put away" THEN the stage Put away opens
4. GIVEN the shopper put Bread back WHEN the shopper taps the shelf THEN the list shows, and the row of Bread shows its tick, and the tick goes
5. GIVEN the device has less motion on WHEN the shopper taps the cart button THEN the cart view shows at once

## Depends on

- [The shelf and the cart](shop-the-shelf-and-the-cart.md): the buttons that open the two views.

## Architecture

- [Shopping](../../architecture/shopping.md): the cart in the shopping note.
- [Brands](../../architecture/brands.md): the brand that you took.
- [Open card](../../architecture/open-card.md): the circle that covers.
- [Decision log: Shop and Put away](../../initiatives/shop-and-put-away/decision-log.md): decisions 8 and 10.
