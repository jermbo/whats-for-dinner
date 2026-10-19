---
title: Compare grams and millilitres
summary: "One rough rule, 1 ml = 1 g, lets a spoon of sugar compare with a bag of 250 g."
parent: units-stories.md
updated: 2026-10-19
persona: Planner
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Units stories](units-stories.md) / Compare grams and millilitres

# Compare grams and millilitres

As the [planner](../../personas.md), I want a spoon of sugar to count against the grams of sugar that I have, so that "7 of 9" is a count and not a guess.

## Requirements

1. A mass and a volume compare with the rule 1 ml = 1 g, for each food
   - a. The match uses the rule: 1 tablespoon is 15 ml, so it is 15 g
   - b. The shopping list uses it: food that the meals need in ml and that the pantry has in g is on the list only when the pantry has less
   - c. Get out and the end of a meal use it: the end of a meal takes 15 g out of a package in grams
   - d. The level uses it: a package in ml adds to a package in g
2. A line that the rule converts has no mark. It is "in the pantry" or "low", as a line in grams is
3. A count compares only with the same count, as before

## Acceptance criteria

Each criterion starts with the vault of the [pantry stories](pantry-stories.md#what-the-vault-needs).

1. GIVEN `Sugar.md` has `Kitchen pantry | 1/4 | 1 kg |` WHEN the planner opens the pancakes in Recipes THEN the line of sugar has the mark of "in the pantry"
   - a. AND the line has no sticker
2. GIVEN `Sugar.md` has `Kitchen pantry | 1/4 | 40 g |` WHEN the planner opens the pancakes THEN the line of sugar has the sticker "Low"
3. GIVEN `Sugar.md` has `Kitchen pantry | 1/4 | 40 g |` and the pancakes are a meal of the plan WHEN the shopper opens the stage "Shop" THEN the list has a row of sugar with 5 ml
4. GIVEN `Sugar.md` has `Kitchen pantry | 1/2 | 1 kg |` WHEN the cook finishes the pancakes with sugar used THEN `Sugar.md` has `Kitchen pantry | 1/2 | 1 kg |`
   - a. AND the 15 g went out: 485 g is nearest to the level 1/2

## Depends on

Nothing.

## Architecture

- [Amounts](../../architecture/amounts.md): the rough rule.
- [Match](../../architecture/match.md): what compares.
- [Spec: units of the vault](../../initiatives/open-choices-of-the-first-version/spec.md): scope 1.
