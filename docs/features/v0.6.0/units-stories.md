---
title: Units stories
summary: "The user stories of the units in version 0.6.0: a rough rule between grams and millilitres, and the mark for food that the plugin cannot count."
parent: ../README.md
updated: 2026-10-19
---

[Wiki](../../README.md) / [Features](../README.md) / Units stories

# Units stories

A spoon of sugar never compared with a bag of 250 g. And the cook saw the same mark for food that the plugin counted and for food that it could not count. This page lists the two user stories of version 0.6.0 that change that.

## The goal of the feature

Grams and millilitres compare by one rough rule. Food that the plugin still cannot count shows "Check".

The [spec](../../initiatives/open-choices-of-the-first-version/spec.md) has the scope that is agreed, and each line of it names its decision.

## The stories

| Story                                                                      | Persona | Depends on | Status  |
| -------------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [Compare grams and millilitres](units-compare-grams-and-millilitres.md) | Planner | Nothing    | `built` |
| 2. [See the food to check](units-see-the-food-to-check.md)                 | Cook    | Nothing    | `built` |

The [personas](../../personas.md) page tells who the planner and the cook are.

The two stories do not depend on each other. The [pantry stories](pantry-stories.md) of the same version replace the unit system of the vault and the drag of a package in round steps. They keep the rough rule and the mark "Check" (decision 33 of the [simple pantry](../../initiatives/simple-pantry/decision-log.md)).

## Architecture pages

| Page                                         | Stories that update it                   |
| -------------------------------------------- | ---------------------------------------- |
| [Amounts](../../architecture/amounts.md)     | 1: the rough rule.                       |
| [Match](../../architecture/match.md)         | 1: what compares. 2: the status "Check". |
| [Cook Mode](../../architecture/cook-mode.md) | 2: the sticker in Get out.               |
| [Plan](../../architecture/plan.md)           | 2: the meal card.                        |
| [Glossary](../../glossary.md)                | 2: check.                                |

## What the vault needs

The vault of the [pantry stories](pantry-stories.md#what-the-vault-needs).
