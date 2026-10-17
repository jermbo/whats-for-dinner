---
title: Pantry stories
summary: "The user stories of the pantry in version 0.1.0: eleven pieces of work, with the sequence in which they depend on each other."
parent: ../README.md
---

[Wiki](../../README.md) / [Features](../README.md) / Pantry stories

# Pantry stories

The pantry is the part of the plugin that knows what you have, and where. This page lists its user stories for version 0.1.0. Each story is one piece of work that one agent or one person can complete.

## The goal of the feature

You record your food one time, with its place. After that, you correct an amount with one move, and you see what is low, what is out, and what you must use soon. The [pantry](../../architecture/pantry.md) page tells how this part works.

## The stories

| Story                                                                            | Persona | Depends on          |
| -------------------------------------------------------------------------------- | ------- | ------------------- |
| 1. [See the food of each place](pantry-see-the-food-of-each-place.md)            | Keeper  | Nothing             |
| 2. [Add food](pantry-add-food.md)                                                | Keeper  | Story 1             |
| 3. [See the level of a food item](pantry-see-the-level.md)                       | Keeper  | Story 1             |
| 4. [Correct an amount with the bar](pantry-correct-an-amount.md)                 | Keeper  | Story 3             |
| 5. [Change a row](pantry-change-a-row.md)                                        | Keeper  | Stories 1, 3, and 4 |
| 6. [See the food to use soon](pantry-see-the-food-to-use-soon.md)                | Planner | Story 1             |
| 7. [See the food that is out](pantry-see-the-food-that-is-out.md)                | Keeper  | Stories 1 and 2     |
| 8. [Find a food item](pantry-find-a-food-item.md)                                | Shopper | Stories 1, 2, and 7 |
| 9. [Filter the pantry](pantry-filter-the-pantry.md)                              | Shopper | Stories 3, 6, and 7 |
| 10. [Set an amount with the keyboard](pantry-set-an-amount-with-the-keyboard.md) | Keeper  | Story 4             |
| 11. [Select the sequence of the pantry](pantry-select-the-sequence.md)           | Planner | Stories 3, 6, and 7 |

The [personas](../../personas.md) page tells who the keeper, the planner, and the shopper are.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives four steps. The stories of one step can be built at the same time.

| Step | Stories             | What you have after the step                                             |
| ---- | ------------------- | ------------------------------------------------------------------------ |
| 1    | 1                   | A pantry that you can read.                                              |
| 2    | 2, 3, and 6         | You can add food, and you see levels and dates.                          |
| 3    | 4 and 7             | You can correct an amount, and you see what is out.                      |
| 4    | 5, 8, 9, 10, and 11 | The form of a row, the search, the filters, the keys, and the sequences. |

## The form of a story

Each story has the form that the [user story](../../standards/user-story.md) page gives.

## The status of a story

The metadata of a story has its status. All stories of this page have the status `built`: the code is there, and nobody recorded a test on the phone.

## Further reading

- [Workflow](../../standards/workflow.md): where the stories come from, and what occurs after them.
