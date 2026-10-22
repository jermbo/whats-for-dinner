---
title: Undo a tick
summary: "After each tick, a bar above the bottom edge shows the item and Undo for 4 seconds. A tap puts the item back on the list."
parent: shop-stories.md
updated: 2026-10-21
persona: Shopper
depends-on: [shop-a-tick-acts-at-once.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Undo a tick

# Undo a tick

As the [shopper](../../personas.md), I want to undo a wrong tick at once, under my thumb, so that a tap on the wrong row costs nothing.

## Requirements

1. After each tick, the undo bar shows above the bottom edge of the stage, for 4 s
   - a. It is one button: "✓" and the name at the left, "↶ Undo" at the right
   - b. It is ink, with round ends, 50 px high
   - c. It comes in from below, and goes the same way
   - d. A new tick replaces the item of the bar, and the 4 s start again
   - e. On a wide tab, it is 28 rem wide at most, in the middle
2. A tap on the bar puts the item back on the list
   - a. Its name flies from the cart to the check of its row
   - b. The row comes back into its bin with its tick, and the tick goes, in 0.4 s
   - c. The rows below glide to make room
   - d. The item has no mark in the shopping note
3. After the 4 s, the [cart view](shop-the-cart-view.md) is the way to put an item back
4. With less motion, the bar shows and goes at once, and no name flies

## Acceptance criteria

Each criterion starts with the shopping note of the test vault, on the stage Shop.

1. GIVEN the list WHEN the shopper ticks Eggs THEN the bar "✓ Eggs ↶ Undo" shows above the bottom edge
2. GIVEN the bar shows Eggs WHEN 4 s is over THEN the bar goes
3. GIVEN the bar shows Eggs WHEN the shopper ticks Milk THEN the bar shows "✓ Milk ↶ Undo"
4. GIVEN the bar shows Eggs WHEN the shopper taps it THEN the row of Eggs is in the list again, with no tick
   - a. AND the shopping note has `- [ ] [[Larder/Pantry/Eggs|Eggs]]`
   - b. AND the bar goes

## Depends on

- [A tick acts at once](shop-a-tick-acts-at-once.md): the tick that the bar undoes.

## Architecture

- [Shopping](../../architecture/shopping.md): the cart in the shopping note.
- [Decision log: Shop and Put away](../../initiatives/shop-and-put-away/decision-log.md): decision 8.
