---
title: Recipe cards in columns
summary: "The recipe cards flow down in columns, as the bins of the Pantry, so an open card makes only its own column longer and no space is empty next to it."
parent: one-system-stories.md
updated: 2026-10-21
persona: Planner
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / Recipe cards in columns

# Recipe cards in columns

As the [planner](../../personas.md), I want the recipe cards to fill the screen with no holes, so that an open recipe does not leave empty space next to it.

## Requirements

1. The recipe cards flow down in columns
   - a. A column is 22 rem or wider, and the width of the part tells the number of columns
   - b. A phone has one column
   - c. A card stays in one column, and the next card starts under it
   - d. The sequence goes down the first column, then down the next
2. An open card makes only its own column longer
   - a. The cards of the other columns do not move
3. A group of the sequence "By type" has its own columns, under its group head
4. When the part opens, the cards come in one after the other: each rises 24 px and fades in, 36 ms after the card before it, for the first 12 cards

## Acceptance criteria

1. GIVEN the Recipes on a computer, 1000 px wide WHEN the planner looks at the list THEN the cards are in 2 columns, and the first card of the sequence is at the top of the first column
2. GIVEN the Recipes on a computer WHEN the planner opens Chicken noodle soup THEN its column gets longer
   - a. AND the card next to it does not move, and the space under that card has the next card of its column
3. GIVEN the Recipes on a phone WHEN the planner looks at the list THEN the cards are in one column
4. GIVEN the sequence "By type" WHEN the planner looks at the group "Dinner" THEN its cards are in columns under the head "Dinner"

## Depends on

Nothing.

## Architecture

- [Recipes](../../architecture/recipes.md): the list and its sequences.
- [Decision log: pantry bins](../../initiatives/pantry-bins/decision-log.md): decision 2, the same columns in the Pantry.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decision 2.
