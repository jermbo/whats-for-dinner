---
title: Cook mode
summary: 'Cook mode shows a recipe one card at a time, keeps the screen on, and keeps your place.'
parent: README.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Recipes](README.md) / Cook mode

# Cook mode

At the stove you have wet hands and little attention for a screen. Cook mode shows one thing at a time, in large text, and you move with one tap.

## One card at a time

Cook mode is a row of cards. One card fills the screen.

```mermaid
stateDiagram-v2
    state "Ingredients card" as ing
    state "Step card" as stp
    state "Finished card" as fin
    [*] --> ing: You start to cook a meal
    ing --> stp: Next
    stp --> stp: Next or back
    stp --> fin: Next after the last step
    fin --> [*]: You tap Cooked
```

**The ingredients card** is a checklist of all ingredients with their quantities. You tap each one when it is on the counter. So you find that the cream is gone before the pan is hot.

**A step card** shows one step: its text, its [photo](step-photos.md), the ingredients that [the app found in the text](step-text.md), and a button for each [timer](timers.md). It also shows each [note](step-notes.md) that you wrote on this step before.

**The finished card** asks for a [photo of the meal](finished-photo.md) and has the "Cooked" button. "Cooked" subtracts the ingredients from the pantry.

## How you move

A tap on the right half of the card goes to the next card. A tap on the left half goes back. A swipe does the same, and so do two large buttons at the bottom. The target is half of the card, so a knuckle is sufficient.

## The screen stays on

A phone turns its screen off after a short time. In Cook mode, the app asks the browser to keep it on. You do not unlock the phone with flour on your fingers.

## The app keeps your place

When Cook mode starts, the app makes a [cook session](cook-session.md) and records each card that you open. If you leave to answer a message, the meal on the Today screen shows "Continue". You come back to the same card.

## You do not have to use it

For a meal that you know from memory, "Cooked" on the Today screen does the work of the finished card in one tap.

## An example

You cook the chicken curry. The ingredients card shows four rows. Step 2 shows "Rice, 300 g" and a "12:00" button. On the finished card you take a photo and tap "Cooked".

## Further reading

- [Write mode](write-mode.md): where the text of the cards comes from.
