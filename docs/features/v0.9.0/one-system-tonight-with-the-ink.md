---
title: Tonight with the ink
summary: "The flag Tonight spreads the ink from the star, as on an open recipe."
parent: one-system-stories.md
updated: 2026-10-21
persona: Cook
depends-on: [one-system-open-a-recipe-card.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / Tonight with the ink

# Tonight with the ink

As the [cook](../../personas.md), I want the meal that I flag for tonight to change as a recipe opens, so that the Plan feels the same as the Recipes.

## Requirements

1. A tap on "☆ Tonight" spreads the ink from the star
   - a. The meal goes into the section "Tonight", as today, and the ink spreads from the place of the star on that card
   - b. The text changes after 140 ms
2. A tap on "★ Tonight" takes the ink back to the star, and the meal goes back into the list
3. The meal card of tonight uses the open card piece
4. The other meals do not step back: they are options, not closed cards
5. With less motion, the card is ink at once

## Acceptance criteria

1. GIVEN the Plan WHEN the cook taps "☆ Tonight" on Spinach omelette THEN Spinach omelette goes into "Tonight", and the ink spreads from its star
   - a. AND Boiled eggs and Chicken noodle soup stay at full
2. GIVEN Spinach omelette has the flag WHEN the cook taps "★ Tonight" THEN the ink goes back to the star, and Spinach omelette is in the list
3. GIVEN the device has less motion on WHEN the cook flags Spinach omelette THEN the card is ink at once

## Depends on

- [Open a recipe card](one-system-open-a-recipe-card.md): the open card piece.

## Architecture

- [Plan](../../architecture/plan.md): the section "Tonight".
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decision 13.
