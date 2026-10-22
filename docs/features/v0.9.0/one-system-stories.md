---
title: One system stories
summary: "The user stories of version 0.9.0 that give the four parts one design system: one easing, the press, the pill, the open card with its circle, edit in place, and the circles of the Shop and of Cook Mode."
parent: ../README.md
updated: 2026-10-21
---

[Wiki](../../README.md) / [Features](../README.md) / One system stories

# One system stories

The four parts share their tokens, but each part opens a card, shows its main action, and moves in its own way. So the plugin feels like four design systems. This page lists the eleven user stories of version 0.9.0 that make it one system, on the look of the Pantry.

## The goal of the feature

Each change is a circle from the point of your tap: ink opens a card, paper opens the edit form, and the dark frame opens Cook Mode. Each action that goes forward is the same pill in the accent colour, and each button feels the same under the finger.

The [spec](../../initiatives/one-system/spec.md) has the scope, and the [decision log](../../initiatives/one-system/decision-log.md) has each decision and the options that were rejected.

## The stories

| Story                                                                   | Persona | Depends on | Status  |
| ----------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [One easing and the press](one-system-one-easing-and-the-press.md)   | Shopper | Nothing    | `built` |
| 2. [The pill](one-system-the-pill.md)                                   | Cook    | 1          | `built` |
| 3. [Recipe cards in columns](one-system-recipe-cards-in-columns.md)     | Planner | Nothing    | `built` |
| 4. [Open a recipe card](one-system-open-a-recipe-card.md)               | Planner | 1, 3       | `built` |
| 5. [What you must get first](one-system-what-you-must-get-first.md)     | Planner | 4          | `built` |
| 6. [Edit a recipe in its card](one-system-edit-a-recipe-in-its-card.md) | Writer  | 5          | `built` |
| 7. [A circle to a screen](one-system-a-circle-to-a-screen.md)           | Cook    | 2, 5       | `built` |
| 8. [Open a food card](one-system-open-a-food-card.md)                   | Keeper  | 4          | `built` |
| 9. [Tonight with the ink](one-system-tonight-with-the-ink.md)           | Cook    | 4          | `built` |
| 10. [A circle between stages](one-system-a-circle-between-stages.md)    | Shopper | 7          | `built` |
| 11. [Cook Mode closes with a circle](one-system-cook-mode-closes-with-a-circle.md) | Cook | 7 | `built` |

## The steps of the work

Stories 1 and 3 change different files, so you can build them at the same time. Stories 4 to 6 change the same recipe card. Stories 8 and 9 change a card of a different part each.

1. One easing and the press, and Recipe cards in columns
2. The pill, and Open a recipe card
3. What you must get first
4. Edit a recipe in its card, and A circle to a screen
5. Open a food card, and Tonight with the ink
6. A circle between stages, and Cook Mode closes with a circle

## Architecture pages

| Page                                         | Stories that update it                                           |
| -------------------------------------------- | ---------------------------------------------------------------- |
| [Motion](../../architecture/motion.md)       | 1: one easing, no bounce, the press. 4: the circle, the move to the top, the step back, scale and opacity only. 7: the circle to a screen. 10: the circle between stages. 11: the close of Cook Mode. |
| [Pieces](../../architecture/pieces.md)       | 1: the press of a button. 2: the pill. 4: the open card.         |
| [Recipes](../../architecture/recipes.md)     | 3: the columns. 4 and 5: the open recipe.                        |
| [Edit](../../architecture/edit.md)           | 6: the edit in the card.                                         |
| [Card](../../architecture/card.md)           | 8: the circle of the food card.                                  |
| [Plan](../../architecture/plan.md)           | 9: the ink of "Tonight".                                         |
| The wiki [glossary](../../glossary.md)       | 2: "pill". 4: "circle", "ink", "step back". 5: "meter". 6: "paper". |

## Further reading

- [Plan stories](plan-stories.md): the other stories of this version.
