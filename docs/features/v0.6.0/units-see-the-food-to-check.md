---
title: See the food to check
summary: "Food that the plugin cannot count is in the pantry, with the mark Check on the recipe card, in Get out, and on the meal card."
parent: units-stories.md
updated: 2026-10-18
persona: Cook
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Units stories](units-stories.md) / See the food to check

# See the food to check

As the [cook](../../personas.md), I want to see which ingredients the plugin did not count, so that I look at them when I get out the food, before I start.

## Requirements

1. Food that the plugin cannot count is "in the pantry", with the mark "Check"
   - a. A count against a mass or a volume: "1 onion" against a row of 500 g
   - b. A row with no number against an amount: "1 l water" against a row "tap"
   - c. The line counts in "7 of 9", and it is not on the shopping list, as before
2. The recipe card shows the sticker "Check" on the line, in place of the mark of "in the pantry"
3. Get out shows the sticker "Check" on the line
4. The meal card of the plan shows the number of such lines after the number to buy: "1 to buy · 1 to check"
   - a. With no such line, the meal card is as before

## Acceptance criteria

Each criterion starts with the vault of the [list page](units-stories.md#what-the-vault-needs).

1. GIVEN `Onions.md` has `500 g` WHEN the cook opens "Pasta with tomato sauce" in Recipes THEN the line of onion has the sticker "Check"
   - a. AND the count of the recipe has the onion in the pantry
2. GIVEN `Water.md` has `tap` WHEN the cook opens "Boiled eggs" in Cook Mode THEN Get out shows the sticker "Check" on the line of water
3. GIVEN "Pasta with tomato sauce" is a meal of the plan WHEN the planner opens the plan THEN its meal card says "1 to check"
4. GIVEN `Onions.md` has `500 g` and the pasta is a meal of the plan WHEN the shopper opens the stage "Shop" THEN the list has no row of onions

## Depends on

Nothing.

## Architecture

- [Match](../../architecture/match.md): the status "Check".
- [Cook Mode](../../architecture/cook-mode.md): the sticker in Get out.
- [Plan](../../architecture/plan.md): the meal card.
- [Spec: units of the vault](../../initiatives/open-choices-of-the-first-version/spec.md): scope 4.
