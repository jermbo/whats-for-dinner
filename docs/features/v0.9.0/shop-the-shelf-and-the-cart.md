---
title: The shelf and the cart
summary: "Two buttons at the top of the stage Shop: the shelf at the left, with the count of the items to get, and the cart at the right, with its count. A bar below them has one piece for each item."
parent: shop-stories.md
updated: 2026-10-21
persona: Shopper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / The shelf and the cart

# The shelf and the cart

As the [shopper](../../personas.md), I want the shelf and the cart in view at the top, so that I always see how much is left and how much is in the cart.

## Requirements

1. The stage Shop has two buttons under the strip of the stages, in the head that stays at the top
   - a. The shelf, at the left: the icon of a shelf, "To get", and the count of the items to get
   - b. The cart, at the right: the count of the items in the cart, "Cart", and the icon of a cart
   - c. Each button is a pill with an edge, 50 px high
   - d. On a tab wider than 46 rem, the two are together at the right: the shelf, then the cart
2. The button of the view that is open is ink, and the other is white
   - a. The list is open first, so the shelf is ink
3. Below the buttons, a bar with one piece for each item of the trip. The pieces of the cart are ink, the others are the track colour
4. The other stages do not have the two buttons and the bar
5. A name that lands on a button gives it a squeeze: its icon starts at 70 % of its size and grows to its size, in one move, with no bounce past its size

## Acceptance criteria

Each criterion starts with the shopping note of the test vault.

1. GIVEN the stage Shop WHEN the shopper looks at the head THEN the shelf is at the left with "To get" and the count of the list, and it is ink
   - a. AND the cart is at the right with the count of the cart and "Cart", and it is white
   - b. AND the bar below has one piece for each item, and one ink piece for each item of the cart
2. GIVEN the stage Shop WHEN the shopper scrolls down the list THEN the shelf, the cart, and the bar stay in view at the top
3. GIVEN the stage Put away WHEN the shopper looks at the head THEN the head has no shelf, no cart, and no bar

## Depends on

Nothing.

## Architecture

- [Shopping](../../architecture/shopping.md): the stages of a trip.
- [Decision log: Shop and Put away](../../initiatives/shop-and-put-away/decision-log.md): decision 10.
