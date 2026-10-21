---
title: Open a food card
summary: "The card of a food item opens with the ink from the finger, moves to the top, and the other lines step back, but its bar shows at once, ready to drag."
parent: one-system-stories.md
updated: 2026-10-21
persona: Keeper
depends-on: [one-system-open-a-recipe-card.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / Open a food card

# Open a food card

As the [keeper](../../personas.md), I want the card of a food item to open as a recipe card opens, but with its bar ready at once, so that I can drag with no wait.

## Requirements

1. The card of a food item uses the open card of the recipe card
   - a. The ink spreads from the finger, and the text changes after 140 ms
   - b. The card moves to the top of the screen, under the head of the part
   - c. The other lines and bins step back
   - d. The ink goes back to the point of "Done", "Cancel", or the tap that closes it
2. The card shows at its full height at once
   - a. The bar, the scale, and the buttons show when the card opens
   - b. A press on the bar works from the first frame
3. With less motion, the card opens at once

## Acceptance criteria

1. GIVEN the Pantry WHEN the keeper taps the line of Milk THEN the ink spreads from the finger, and the card of Milk is an ink card
   - a. AND the bar of Milk shows at once
   - b. AND the other lines step back
2. GIVEN Milk is the last line on the screen of a phone WHEN the keeper opens it THEN the card moves up under the head of the part
3. GIVEN the card of Milk opens WHEN the keeper presses the bar at once THEN the handle is on the package under the thumb
4. GIVEN the card of Milk is open WHEN the keeper taps "Done" THEN the ink goes back to "Done", and the other lines come back to full

## Depends on

- [Open a recipe card](one-system-open-a-recipe-card.md): the open card piece.

## Architecture

- [Card](../../architecture/card.md): the card of a food item and its bar.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decisions 13 and 14.
