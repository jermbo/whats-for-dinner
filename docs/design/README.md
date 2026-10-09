---
title: Design
summary: 'The look of the app: a paper kitchen label, and the rules that keep each screen the same.'
parent: ../README.md
updated: 2026-10-04
---

[Wiki](../README.md) / Design

# Design

The app is called Larder. Its look is a food label on kitchen paper: flat, warm, and printed in heavy type. This page gives the full picture. Each part has its own page.

## The problem

An app that looks soft and bright feels like a game. You use this app in a kitchen, with wet hands, in poor light, and you must read it from a distance. You need a look that is clear, calm, and fast to read.

## The answer: one material for each job

Each thing on a screen is one material that you know from a kitchen.

| Material     | What it is on the screen                              |
| ------------ | ----------------------------------------------------- |
| Paper        | The page. It is flat and warm, and it is never white. |
| Pack label   | The front of a card: a photo, and an olive band.      |
| Facts panel  | The back of a card: rules of 1, 4, and 8 px.          |
| Till receipt | The trip in the store. Mono type, a torn edge.        |
| Rubber stamp | The end of a flow, one time.                          |
| Ruled list   | Each list. Lines on paper, with no boxes.             |
| Dashed line  | An empty place, or an offer that is not a plan.       |

Because a thing has one material, you know what it is before you read it. A dashed line is never a plan. A stamp is never a button.

## Where to read next

- [Colour and materials](colour-and-materials.md): the six colours, and how little of each the screen uses.
- [Type](type.md): the three fonts, and when each one is used.
- [The parts of the screen](parts.md): the sizes of buttons, chips, gauges, and badges.
- [The Today screen](today-screen.md): the hand of cards, and the states of a card.

## Where the app is behind the design

The [record of the design gaps](design-gaps-2026-10-04.md) compares the app with the screens in `docs/inspiration/`. The [gap plan](gap-plan.md) gives the sequence of the work: Pantry, Cook mode, Meal plan, and then the rest.

## Where the code is

The shared styles are in `src/lib/styles/`. The colours and sizes are in `tokens.css`. A screen uses these tokens and never a fixed value.

## Further reading

- [Recipes](../recipes/README.md): the part of the app that has Cook mode, the other screen that this design serves.
