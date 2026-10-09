---
title: Design gaps of 4 October 2026
summary: 'A record of one day: what the screens in docs/inspiration show that the app does not do, by area.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / Design gaps of 4 October 2026

# Design gaps of 4 October 2026

This page is a record, not a rule. It compares the 29 images in `docs/inspiration/` with the code of each screen on one day. The [gap plan](gap-plan.md) comes from it.

The comparison used the code, not the app as it runs. So it finds a missing function or a missing part. It does not find a wrong size or a wrong colour.

## Three facts that the data does not have

Most gaps come from three facts that the design uses and the database does not keep.

| The missing fact                   | What the design does with it                                           |
| ---------------------------------- | ---------------------------------------------------------------------- |
| The night of a meal                | It puts the week in a sequence, and it shows the prep the night before |
| The low line of a pantry item      | It counts "low" and "out", and it sends the low items to Shop          |
| The use-by date of a food in stock | It shows "Use today" and "2 days", and it deals those meals first      |

Today the app has a guess for the third fact: the age of the stock.

## The gap of each area

| Area                              | Gap     | The largest missing part                                    |
| --------------------------------- | ------- | ----------------------------------------------------------- |
| [Meal plan](meal-plan-gaps.md)    | Largest | The flow of four steps. The app has one screen with no end. |
| [Pantry](pantry-gaps.md)          | Large   | The three views, the low line, and the link to Shop.        |
| [Cook mode](cook-gaps.md)         | Medium  | The last card does not show what leaves the pantry.         |
| [Shop and put away](shop-gaps.md) | Medium  | The parts exist. The links between them are weak.           |
| Today                             | Small   | The line "Chicken is frozen" with its two answers.          |

## What the app has and the design does not show

The design has no Scan, no Pantry check, no search in the pantry, and no list of trips. The app has them, and they come from the first goals of the project. They stay.

## One conflict, and its answer

The [usage flows](../flows.md) say that a meal has no fixed day. The design puts each meal on a night. The owner gave the answer on 4 October 2026: a night is a proposal, not a lock. The meal plan page tells what this means.

## Further reading

- [The Today screen](today-screen.md): the screen that is closest to the design.
