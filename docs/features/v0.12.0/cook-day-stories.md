---
title: Cook day stories
summary: "The user stories of version 0.12.0 for the day of an occasion: a serve time, a time and a start for each dish, and one screen to cook many dishes at the same time, with a place card, the state of each dish, a timeline, and one list of food to get out."
parent: ../README.md
updated: 2026-11-21
---

[Wiki](../../README.md) / [Features](../README.md) / Cook day stories

# Cook day stories

On Thanksgiving you cook a turkey and three sides, and each one needs its own start. These stories give the occasion a serve time, give each dish a time and a start, and add "Cook day": one screen to cook the dishes in the sequence of their starts, and to swap between them.

## The stories

| Story                                                                       | Persona | Depends on | Status  |
| --------------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [Set the serve time and the times of the dishes](cook-day-set-the-times.md) | Cook    | Nothing    | `built` |
| 2. [Cook the dishes at the same time](cook-day-cook-the-dishes.md)          | Cook    | Story 1    | `built` |
| 3. [Know when to start](cook-day-know-when-to-start.md)                     | Cook    | Story 2    | `built` |
| 4. [See where the day is](cook-day-see-where-the-day-is.md)                 | Cook    | Story 3    | `built` |
| 5. [See the day on a timeline, and get out the food](cook-day-timeline-and-get-out.md) | Cook | Story 2 | `built` |
| 6. [Keep the session](cook-day-keep-the-session.md)                         | Cook    | Story 2    | `built` |

## The test data

`Larder/Occasions/Thanksgiving 2026.md` of the [occasion stories](../v0.11.0/occasion-stories.md#the-test-data), with these changes:

```markdown
---
date: 2026-11-26
serve: "15:00"
---

- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · 3h
- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2
- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · start 13:30
- [ ] Gravy · side · 20 min
- [ ] Pumpkin pie · dessert · Mum
```

Today is the day of the occasion, and the time is 12:00, for the criteria that need a time. The occasion "Thanksgiving Feast" of the [check list](../../../test-vault/Cook%20day%20check%20list.md) has more dishes.

## Architecture pages

| Page                                                 | Stories that update it                                     |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| [Occasion note](../../architecture/occasion-note.md) | 1: the property `serve`, and the fields of time and start. |
| [Occasion](../../architecture/occasion.md)           | 1: the times. 2: "Cook day". 3: the alarm.                 |
| [Cook Mode](../../architecture/cook-mode.md)         | 2: Cook Mode inside "Cook day". 3, 4: the timers and the progress that it reports. |

## Further reading

- [Decision log: holiday planner](../../initiatives/holiday-planner/decision-log.md): decisions 33 to 53 give the reason for each rule.
- [Occasion stories](../v0.11.0/occasion-stories.md): the stories that this work builds on.
