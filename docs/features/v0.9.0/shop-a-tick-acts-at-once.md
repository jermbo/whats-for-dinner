---
title: A tick acts at once
summary: "A tap on a row fills its check, strikes its name, flies the name to the cart, and the row leaves. A second tap while the row fades takes the tick off."
parent: shop-stories.md
updated: 2026-10-21
persona: Shopper
depends-on: [shop-the-list-in-bins.md, shop-the-shelf-and-the-cart.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / A tick acts at once

# A tick acts at once

As the [shopper](../../personas.md), I want one tap to put an item into the cart, with a clear sign of where it went, so that I can tick fast with one hand and trust each tap.

## Requirements

1. A tap on a row ticks it at once
   - a. The check gets a bit smaller under the finger
   - b. The check fills with the accent colour from its middle, and draws its mark, in one change (0.2 s)
   - c. A line strikes the name from the left, and the name gets the muted colour, in one change
   - d. On a device that can, a buzz of 8 ms
2. The name of the item flies to the cart button at once
   - a. The name is on a small pill in the accent colour, and it starts at the check
   - b. It goes to the side fast and up slow, so its path is an arc, and it gets small as it lands, in 0.54 s
   - c. When it lands, the cart button gives a squeeze, and the count of the cart goes up by 1
3. The row fades in its place, in one move (0.3 s)
   - a. Then the item goes into the cart of the shopping note, and the rows below glide up
4. A second tap on the row while it fades takes the tick off
   - a. The row stays, with no tick, and the item does not go into the cart
   - b. The name flies from the cart back to the check
5. A row has no ink across it, and no press circle
6. With less motion, no name flies, and the row goes at once with the tick

## Acceptance criteria

Each criterion starts with the shopping note of the test vault, on the stage Shop with "A to Z".

1. GIVEN the row of Eggs WHEN the shopper taps it THEN its check fills, and "Eggs" is struck
   - a. AND a pill "Eggs" flies from the check to the cart button
   - b. AND the count of the cart goes up by 1 when the pill lands
2. GIVEN the shopper tapped Eggs WHEN 0.3 s is over THEN the row of Eggs is not in the list
   - a. AND the shopping note has `- [x] [[Larder/Pantry/Eggs|Eggs]]`
3. GIVEN the shopper tapped Eggs WHEN the shopper taps it again before it goes THEN the row of Eggs stays, with no tick
   - a. AND the shopping note has `- [ ] [[Larder/Pantry/Eggs|Eggs]]`
4. GIVEN the shopper taps Eggs, Milk, and Rice fast WHEN the rows go THEN Eggs, Milk, and Rice are in the cart, and no other row is
5. GIVEN the device has less motion on WHEN the shopper taps Eggs THEN the row goes at once, and no pill flies

## Depends on

- [The list in bins](shop-the-list-in-bins.md): the rows that this story ticks.
- [The shelf and the cart](shop-the-shelf-and-the-cart.md): the cart button where the name lands.

## Architecture

- [Shopping](../../architecture/shopping.md): the cart in the shopping note.
- [Motion](../../architecture/motion.md): the durations and the easing.
- [Decision log: Shop and Put away](../../initiatives/shop-and-put-away/decision-log.md): decisions 5 and 9.
