---
title: Plan stories
summary: "The user stories of the weekly Plan in version 0.9.0: one list of meals as options, a meal with its sides, a day that is optional, and no week to reset."
parent: ../README.md
updated: 2026-10-21
---

[Wiki](../../README.md) / [Features](../README.md) / Plan stories

# Plan stories

A new person needs an explanation before they can use the Plan: what each group by type means, where a meal goes, and why a meal needs "Today". And a dinner with a side is two meals that the screen does not connect. This page lists the four user stories of version 0.9.0 that make the Plan clear.

## The goal of the feature

The Plan is one list of meals. Each meal is a main dish with its sides. The week is a set of options: on the day, you can flag one for tonight, and you see its preparation in time. A cooked meal leaves the list, and the meals that you did not cook stay as options.

The [spec](../../initiatives/meal-plan/spec.md) has the scope, and the [decision log](../../initiatives/meal-plan/decision-log.md) has each decision and the options that were rejected.

## The stories

| Story                                                         | Persona | Depends on | Status  |
| ------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [One list of meals](plan-one-list-of-meals.md)             | Planner | Nothing    | `built` |
| 2. [Flag a meal for tonight](plan-flag-a-meal-for-tonight.md) | Cook    | 1          | `built` |
| 3. [The sides of a meal](plan-the-sides-of-a-meal.md)         | Planner | 1          | `built` |
| 4. [A cooked meal leaves](plan-a-cooked-meal-leaves.md)       | Cook    | 3          | `built` |

## The steps of the work

Stories 1, 2, and 3 change the same screen file and the same card. Two stories that you build at the same time would change the same lines. So the steps have one story each.

1. One list of meals
2. Flag a meal for tonight
3. The sides of a meal
4. A cooked meal leaves

## Architecture pages

| Page                                                            | Stories that update it                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Plan](../../architecture/plan.md)                              | 1: one list, "Add a meal". 2: the flag. 3: sides. 4: no new week. |
| [Plan note](../../architecture/plan-note.md)                    | 3: the lines of the sides. 4: a task that leaves after the meal. |
| [Recipes](../../architecture/recipes.md)                        | 1: "Add a meal" opens the recipes with the ideas first.          |
| [Shopping](../../architecture/shopping.md)                      | 3: the food of the sides is on the list.                         |
| [End of a meal](../../architecture/end-of-a-meal.md)            | 4: the meal and its sides leave the plan note.                   |
| The wiki [glossary](../../glossary.md)                          | 1: "week". 3: "meal", "dish", "main dish", and "side".           |

## Further reading

- [Look stories](../v0.8.0/look-stories.md): the stories of the version before this one.
