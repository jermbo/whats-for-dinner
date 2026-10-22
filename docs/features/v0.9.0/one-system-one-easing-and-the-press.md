---
title: One easing and the press
summary: "Each motion of the plugin lands with one soft easing and no bounce, and each button drops a small circle at the finger when you press it."
parent: one-system-stories.md
updated: 2026-10-21
persona: Shopper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / One easing and the press

# One easing and the press

As the [shopper](../../personas.md), I want each motion and each press to feel the same in each part, so that the plugin feels like one thing in my hand.

## Requirements

1. One easing for each motion: `cubic-bezier(0.22, 1, 0.36, 1)`, a fast start and a long, soft end
   - a. The token `--wfd-ease-out` has this value
   - b. The token `--wfd-ease-bounce` goes away, and no style uses a curve that goes past its end
   - c. The open card of `Panel` does not scale when it opens
   - d. The check of the week button lands with no overshoot: it turns and grows from 0.3 to 1, and stops
2. A press on a button drops a small circle at the finger
   - a. The circle has the colour of the text of the button, at 16 %
   - b. It grows from the finger until it covers the button, and fades, in 0.48 s
   - c. Each press starts a new circle
   - d. A key press starts the circle at the middle of the button
3. The press is on each button: the `Button` piece of each kind, the chip, the week button, and each local button of a screen
   - a. The move down of 2 px goes away
4. With less motion, no circle shows, and no motion runs

## Acceptance criteria

1. GIVEN the Shop WHEN the shopper presses "In cart" on Milk THEN a circle grows from the finger and fades
   - a. AND the button does not move down
2. GIVEN the Pantry WHEN the shopper taps the chip "Low" THEN a circle grows from the finger, and the chip changes to ink
3. GIVEN the Recipes WHEN the shopper taps "+" on Beef tacos THEN the "+" turns into a check that grows to its size and stops, with no overshoot
4. GIVEN the Pantry WHEN the shopper opens the card of Milk THEN the card does not scale
5. GIVEN the device has less motion on WHEN the shopper presses "In cart" THEN no circle shows
6. GIVEN the code WHEN you search for `--wfd-ease-bounce` THEN it has no use

## Depends on

Nothing.

## Architecture

- [Motion](../../architecture/motion.md): the tokens of the motion, and less motion.
- [Pieces](../../architecture/pieces.md): the `Button` and the chip.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decisions 8, 16, and 18.
