---
title: Motion tokens
summary: "Three durations, two easings, and a piece token for each piece with its own motion, so one change of a token changes the motion of each card."
parent: look-stories.md
updated: 2026-10-20
persona: Keeper
depends-on: [look-colour-roles-in-the-two-schemes.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Look stories](look-stories.md) / Motion tokens

# Motion tokens

As the [keeper](../../personas.md), I want each card, row, chip, and button to move with the same motion, so that a change of state on the screen feels the same in each part.

## Requirements

1. The durations are three role tokens: `--wfd-motion-press` 0.1 s, `--wfd-motion-change` 0.2 s, and `--wfd-motion-move` 0.3 s
2. The easings are two role tokens: `--wfd-ease-out` and `--wfd-ease-bounce`
3. Each piece with its own motion has a piece token that points to a role token
   - a. `--wfd-card-motion`: a card that opens or changes
   - b. `--wfd-row-motion`: a row that comes or goes
   - c. `--wfd-chip-motion`: a chip that changes to on or off
   - d. `--wfd-button-motion`: the press of a button
4. Each CSS transition and CSS animation of a screen or a piece uses these tokens
   - a. The transitions of Svelte in the scripts do not change
5. With the setting for less motion, there is no motion, as today
6. The architecture gets the page "Motion": each token, each piece token, and the transitions of Svelte that stay

## Acceptance criteria

1. GIVEN the keeper opens the Pantry WHEN the keeper taps the chip "Low" THEN the chip changes to ink in 0.2 s
2. GIVEN the keeper opens the Pantry WHEN the keeper presses the button "Add food" THEN the button moves down in 0.1 s
3. GIVEN `--wfd-card-motion` changes to point to `--wfd-ease-bounce` WHEN the keeper opens the card of rice THEN the card opens with a bounce
   - a. AND the chips and the buttons move as before
4. GIVEN the device has the setting for less motion WHEN the keeper taps the chip "Low" THEN the chip changes with no motion
5. GIVEN the code of the screens and the pieces WHEN you search their style blocks for a duration in s or ms THEN there is none

## Depends on

- [Colour roles in the two schemes](look-colour-roles-in-the-two-schemes.md): it makes the file of the tokens and the naming rule.

## Architecture

- [Card](../../architecture/card.md): the card of a food item, which gets the card motion.
- [Motion](../../architecture/motion.md): the tokens, the piece tokens, and the transitions of Svelte that stay. New.
