---
title: Occasion stories
summary: "The user stories of version 0.11.0 for an occasion with many dishes, such as Thanksgiving: eight pieces of work, with the sequence in which they depend on each other."
parent: ../README.md
updated: 2026-10-31
---

[Wiki](../../README.md) / [Features](../README.md) / Occasion stories

# Occasion stories

For a holiday you cook many dishes, and other people bring some of them. An occasion is one note with each dish, who brings it, and the work before the day. While it is active, the kitchen has a fifth part for it. This page lists the stories of version 0.11.0 that build it. The [spec](../../initiatives/holiday-planner/spec.md) of the holiday planner has the agreed scope, and its decision log has the reasons.

## The stories

| Story                                                                                           | Persona | Depends on | Status  |
| ----------------------------------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [See an occasion](occasion-see-an-occasion.md)                                               | Planner | Nothing    | `ready` |
| 2. [Start an occasion](occasion-start-an-occasion.md)                                           | Planner | Story 1    | `ready` |
| 3. [Add and remove a dish](occasion-add-and-remove-a-dish.md)                                   | Planner | Story 1    | `ready` |
| 4. [Give a dish a person, a course, and a scale](occasion-person-course-and-scale.md)           | Planner | Story 1    | `ready` |
| 5. [Shop for an occasion](occasion-shop-for-an-occasion.md)                                     | Planner | Story 1    | `ready` |
| 6. [Cook and tick the dishes](occasion-cook-and-tick-the-dishes.md)                             | Cook    | Story 1    | `ready` |
| 7. [See the preparation and the tasks](occasion-prep-and-tasks.md)                              | Planner | Story 1    | `ready` |
| 8. [Start from a past occasion](occasion-start-from-a-past-occasion.md)                         | Planner | Story 2    | `ready` |

The [personas](../../personas.md) page tells who the planner and the cook are.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives three steps. The stories of one step can be built at the same time.

| Step | Stories          | What you have after the step                                                       |
| ---- | ---------------- | ---------------------------------------------------------------------------------- |
| 1    | 1                | An occasion note that you write by hand shows in a fifth part of the kitchen.      |
| 2    | 2, 3, 4, 5, 6, 7 | You start an occasion, plan its dishes, shop for it, cook it, and do the work before it. |
| 3    | 8                | Next year starts from this year.                                                   |

## The test data

The criteria use these notes of the test vault. The vault does not have them yet, so the first story that needs a note adds it.

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

The other notes need three changes:

- The recipe "Beef tacos" gets the callout `> [!prep] Take the ground beef out of the freezer in the morning.`
- The apples (2 of 6 in the fridge) and the carrots (1/2 of 900 g in the fridge) get a use-by date after 2026-11-30. With a date that is past, the rule of [past its date](../../architecture/past-its-date.md) adds rows that the criteria do not expect.
- The plan note keeps "Black bean soup" as its one meal.

A criterion with a date, such as "today is 2026-11-19", needs the date of the device, or a test that gives the date.

## Architecture pages

| Page                                                                 | Stories that update it                                         |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| Occasion (new)                                                       | 1: what an occasion is, when it is active, and its part. 5: what it puts on the list. |
| Occasion note (new)                                                  | 1: the form of the note. 3, 4, 6, 7, 8: what the plugin changes. |
| [Kitchen state](../../architecture/kitchen-state.md)                 | 1: a fifth part, only while an occasion is active.             |
| [Settings](../../architecture/settings.md)                           | 1: the occasions folder.                                       |
| [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md)   | 1: the occasion note, a fifth kind of note.                    |
| [Plan](../../architecture/plan.md)                                   | 2: the button "New occasion".                                  |
| [Shopping](../../architecture/shopping.md)                           | 5: the food of an occasion, from 7 days before its date.       |
| [Cook Mode](../../architecture/cook-mode.md)                         | 6: the scale at the top.                                       |
| [End of a meal](../../architecture/end-of-a-meal.md)                 | 6: the amounts times the scale, and the mark of a dish.        |
| [Preparation](../../architecture/preparation.md)                     | 7: the screen of an occasion shows it.                         |

## Further reading

- [Decision log: holiday planner](../../initiatives/holiday-planner/decision-log.md): the reason for each rule of these stories.
- [Glossary: holiday planner](../../initiatives/holiday-planner/glossary.md): the words "occasion", "dish", "course", "person", and "scale".
