---
title: Occasion stories
summary: "The user stories of version 0.11.0 for an occasion with many dishes, such as Thanksgiving: eleven pieces of work, with the sequence in which they depend on each other."
parent: ../README.md
updated: 2026-10-31
---

[Wiki](../../README.md) / [Features](../README.md) / Occasion stories

# Occasion stories

For a holiday you cook many dishes, and other people bring some of them. An occasion is one note with each dish, who brings it, the guests, and the work before the day. The kitchen has a fifth part, Occasions, with each of them. This page lists the stories of version 0.11.0 that build it. The [spec](../../initiatives/holiday-planner/spec.md) of the holiday planner has the agreed scope, and its decision log has the reasons.

## The stories

| Story                                                                                           | Persona | Depends on | Status  |
| ----------------------------------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [See an occasion](occasion-see-an-occasion.md)                                               | Planner | Story 9    | `built` |
| 2. [Start an occasion](occasion-start-an-occasion.md)                                           | Planner | Story 1    | `built` |
| 3. [Add and remove a dish](occasion-add-and-remove-a-dish.md)                                   | Planner | Story 1    | `built` |
| 4. [Give a dish a person, a course, and a scale](occasion-person-course-and-scale.md)           | Planner | Story 1    | `built` |
| 5. [Shop for an occasion](occasion-shop-for-an-occasion.md)                                     | Planner | Story 1    | `built` |
| 6. [Cook and tick the dishes](occasion-cook-and-tick-the-dishes.md)                             | Cook    | Story 1    | `built` |
| 7. [See the preparation and the tasks](occasion-prep-and-tasks.md)                              | Planner | Story 1    | `built` |
| 8. [Start from a past occasion](occasion-start-from-a-past-occasion.md)                         | Planner | Story 2    | `built` |
| 9. [See the occasions](occasion-see-the-occasions.md)                                           | Planner | Nothing    | `built` |
| 10. [Keep a guest list](occasion-keep-a-guest-list.md)                                          | Planner | Story 1    | `built` |
| 11. [Open or delete an occasion](occasion-open-or-delete-an-occasion.md)                        | Planner | Story 1    | `built` |

The [personas](../../personas.md) page tells who the planner and the cook are.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives four steps. The stories of one step can be built at the same time.

| Step | Stories          | What you have after the step                                                       |
| ---- | ---------------- | ---------------------------------------------------------------------------------- |
| 1    | 9                | The Occasions part lists each occasion note that you write by hand.                |
| 2    | 1                | A tap on an occasion opens its screen.                                             |
| 3    | 2, 3, 4, 5, 6, 7, 10, 11 | You start an occasion, plan its guests and dishes, shop for it, cook it, do the work before it, and delete it. |
| 4    | 8                | Next year starts from this year.                                                   |

## The test data

The criteria use these notes of the test vault. The [check list](../../../test-vault/Occasion%20check%20list.md) of these stories tells how to test each one on the phone.

`Larder/Occasions/Thanksgiving 2026.md`:

```markdown
---
date: 2026-11-26
---
Dinner at 15:00.

- [ ] [[Recipes/Beef tacos|Beef tacos]] · main
- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2
- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert
- [ ] Pumpkin pie · dessert · Mum
- [x] Rolls · bread · Sam
- [ ] Plates · things · ?

## Guests

- Mum ×2
- Sam
- The Smiths ×4

## To do

- [ ] Clean the oven · 2026-11-25
- [ ] Borrow chairs · 2026-11-24
- [ ] Buy candles
```

`Larder/Occasions/Sam's birthday.md`:

```markdown
---
date: 2026-11-14
---
- [ ] [[Recipes/Pancakes|Pancakes]] · main
```

`Larder/Occasions/Thanksgiving 2025.md`:

```markdown
---
date: 2025-11-27
---
Dinner at 14:00.

- [x] [[Recipes/Beef tacos|Beef tacos]] · main · prep done
- [x] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2
- [x] Pumpkin pie · dessert · Mum

## To do

- [x] Borrow chairs · 2025-11-25
- [x] Buy candles
```

The other notes of the test vault give the rest:

- The recipe "Beef tacos" has the callout `> [!prep] Take the ground beef out of the freezer in the morning.`
- The fridge has 2 apples of 6, and carrots at 1/2 of 900 g. Their use-by dates are past, and that changes no row of the criteria: the list counts food that is [past its date](../../architecture/past-its-date.md) as food that you have.
- The plan note has "Black bean soup" as its one meal.

A criterion with a date, such as "today is 2026-11-19", needs the date of the device, or a test that gives the date.

## Architecture pages

| Page                                                                 | Stories that update it                                         |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Occasion](../../architecture/occasion.md)                           | 9: the Occasions part. 1: the screen of an occasion. 10: guests and jobs. 5: what it puts on the list. |
| [Occasion note](../../architecture/occasion-note.md)                 | 1, 10: the form of the note. 3, 4, 6, 7, 8, 10: what the plugin changes. |
| [Kitchen state](../../architecture/kitchen-state.md)                 | 9: the fifth part, and the occasion that is open.              |
| [Settings](../../architecture/settings.md)                           | 1: the occasions folder.                                       |
| [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md)   | 1: the occasion note, a fifth kind of note.                    |
| [Shopping](../../architecture/shopping.md)                           | 5: the food of an occasion, from 7 days before its date.       |
| [Cook Mode](../../architecture/cook-mode.md)                         | 6: the scale at the top.                                       |
| [End of a meal](../../architecture/end-of-a-meal.md)                 | 6: the amounts times the scale, and the mark of a dish.        |
| [Preparation](../../architecture/preparation.md)                     | 7: the screen of an occasion shows it.                         |

## Further reading

- [Decision log: holiday planner](../../initiatives/holiday-planner/decision-log.md): the reason for each rule of these stories.
- [Glossary: holiday planner](../../initiatives/holiday-planner/glossary.md): the words "occasion", "dish", "course", "person", and "scale".
