---
title: Units stories
summary: "The user stories of the units of the vault in version 0.6.0: three pieces of work that can each start now, and a fourth that fixes the open line after the first test."
parent: ../README.md
updated: 2026-10-18
---

[Wiki](../../README.md) / [Features](../README.md) / Units stories

# Units stories

Salt is "1.5 box" and taco seasoning is "1 bag", so a recipe that wants 25 g compares with nothing. A spoon of sugar never compares with a bag of 250 g. And the cook sees the same mark for food that the plugin counted and for food that it guessed. This page lists the user stories of version 0.6.0 that change that.

## The goal of the feature

Each row of the pantry is in the unit system of the vault. Grams and millilitres compare by one rough rule. Food that the plugin still cannot count shows "Check".

The [spec](../../initiatives/open-choices-of-the-first-version/spec.md) has the scope that is agreed, and each line of it names its decision.

## The stories

| Story                                                                                        | Persona | Depends on | Status  |
| -------------------------------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [Compare grams and millilitres](units-compare-grams-and-millilitres.md)                   | Planner | Nothing    | `built` |
| 2. [See the food to check](units-see-the-food-to-check.md)                                   | Cook    | Nothing    | `built` |
| 3. [Keep the pantry in one unit system](units-keep-the-pantry-in-one-unit-system.md)         | Keeper  | Nothing    | `built` |
| 4. [Set a package with one drag](units-set-a-package-with-one-drag.md)                       | Keeper  | Story 3    | `built` |

The [personas](../../personas.md) page tells who the planner, the cook, and the keeper are.

## The sequence of the work

Stories 1 to 3 do not depend on each other, so they are one step and can be built at the same time. Story 4 came after the first test: the metric rows of story 3 made the bar of a package hard to use. It is the second step.

## Architecture pages

Each story updates the wiki pages **before** its code, in the **Elevate** step of the [workflow](../../standards/workflow.md).

| Page                                                     | Stories that update it                         |
| -------------------------------------------------------- | ---------------------------------------------- |
| [Amounts](../../architecture/amounts.md)                 | 1: the rough rule. 3: the unit system.         |
| [Match](../../architecture/match.md)                     | 1: what compares. 2: the status "Check".       |
| [Cook Mode](../../architecture/cook-mode.md)             | 2: the sticker in Get out.                     |
| [Plan](../../architecture/plan.md)                       | 2: the meal card.                              |
| [Settings](../../architecture/settings.md)               | 3: the setting "Units".                        |
| [Setup](../../architecture/setup.md)                     | 3: the question of the first step.             |
| [Food item note](../../architecture/food-item-note.md)   | 3: a row in the unit system.                   |
| [Facts of an item](../../architecture/put-away-facts.md) | 3: the amount at put away.                     |
| [Amount bar](../../architecture/amount-bar.md)           | 4: the bar that is always there, and the steps. |
| [Pantry](../../architecture/pantry.md)                   | 4: the package size in "Add to pantry".        |
| [Glossary](../../glossary.md)                            | 2: check. 3: unit system. 4: step.             |

## What the vault needs

Prototype data is disposable, so the notes are reset to metric. Before the first story, make these changes in `test-vault/`:

| Note                              | The change                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `Larder/Pantry/Milk.md`           | `full: 7.57 l`, `low: 1.89 l`, and the rows `1.89 l \| 3.79 l` and `3.79 l \| 3.79 l`.       |
| `Larder/Pantry/Black beans.md`    | `full: 3.4 kg`. Each `15 oz` is `425 g`, and `7.5 oz` is `213 g`.                           |
| `Larder/Pantry/Salt.md`           | `full: 1105 g`, and the row `1105 g`.                                                       |
| `Larder/Pantry/Taco seasoning.md` | `full: 28 g`, and the row `28 g`.                                                           |
| `Larder/Pantry/Onions.md`         | `full: 1 kg`, and the row `500 g`.                                                          |
| `Larder/Pantry/Water.md`          | A new note with one row in "Kitchen": `tap`.                                                |
| `Recipes/Boiled eggs.md`          | The line of water is `*1 l* water`.                                                         |
| `Packages check list.md`          | The amounts of the vault are in metric. A line about a bar in gallons or ounces is from before. |
| `Larder/Shopping/*.md`            | Each receipt row of `1 bag` is `28 g`, and `1 gal` is `3.79 l`.                             |
