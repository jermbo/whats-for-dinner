---
title: Keep the top in view
summary: "The nav of the kitchen, the head of the part, and its bar stay at the top while the list of each part scrolls."
parent: kitchen-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Kitchen stories](kitchen-stories.md) / Keep the top in view

# Keep the top in view

As the [keeper](../../personas.md), I want the nav and the bar to stay at the top while I scroll, so that I can find, filter, or change the part from any point of a long list.

## Requirements

1. The nav of the kitchen stays at the top while a part scrolls (decision 7)
2. The head of the part and its bar stay under the nav (decision 7)
   - a. In the Pantry, the Recipes, and the Plan, the head and the bar
   - b. In the Shop, the head and the strip of the stages
   - c. The paper colour is behind them, so no line shows through
3. When the head is stuck, the title of the part is 24 px in place of 36 px, and a thin rule is under the top (decision 7)
   - a. The title changes its size in 0.2 s

## Acceptance criteria

1. GIVEN the Pantry part WHEN the keeper scrolls to the end of the bin "Kitchen pantry" THEN the nav, the title "Pantry", and the find field are in view
   - a. AND the title is smaller than at the start
2. GIVEN the Recipes part WHEN the keeper scrolls down THEN the nav, the title "Recipes", and the find field are in view
3. GIVEN the Plan part WHEN the keeper scrolls down THEN the nav, the title "Plan", and the bar are in view
4. GIVEN the Shop part WHEN the keeper scrolls down THEN the nav, the title "Shop", and the strip of the stages are in view
5. GIVEN the keeper scrolled down in the Pantry WHEN the keeper scrolls back to the top THEN the title is 36 px again

## Depends on

Nothing.

## Architecture

- [Decision log: pantry bins](../../initiatives/pantry-bins/decision-log.md): decision 7.
