---
title: The Today screen
summary: 'The hand of meal cards, the order of the cards, and what a card shows in each state.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / The Today screen

# The Today screen

The Today screen answers one question: what do I cook now? It shows your meals as a hand of cards. The first card is the one to cook.

## The problem

A list of meals makes you decide each time. You do not want a list. You want the app to say which meal comes first, and why, in one sentence.

## The hand

The title is one word that tells the part of the day: Morning, Afternoon, or Evening. Under it, one sentence names the reason for the order: "3 meals are ready. The chicken goes first."

The cards are in this order:

1. The meal that you cook now.
2. The meals that are ready, with the oldest food first.
3. The meals that wait for their preparation time.
4. The meals that need preparation.

The app does not know a shelf life yet. So it uses the age of the stock: the food that is in the pantry the longest comes first.

## What a card shows

| State             | The card                                                                           |
| ----------------- | ---------------------------------------------------------------------------------- |
| Ready             | A photo, an olive band with the name, and the actions "Cook" and "Cooked".         |
| No photo          | The whole top is olive. The name is the picture.                                   |
| In progress       | An ink outline, the timer on the photo, and a bar of steps.                        |
| Needs preparation | A sticker that tells how many hours before. The main action is "Preparation done". |
| Offer             | A dashed sticker, "From the pantry". It is not a plan.                             |

The line "In the pantry" shows the oldest food that the meal uses, and the count of ingredients that you have, such as 7/9.

## A phone and a desktop

On a phone, the count and "Next" are at the top right. You can also throw the top card away, and pull it down to shuffle. On a wide screen, the facts of the top card are always next to it, and a column at the right shows the week, the food to use soon, and the shopping list.

## An empty hand

When the hand is empty, a dashed card of the same size stays in its place, so that the screen does not jump when the first meal comes.

## Further reading

- [Cook mode](../recipes/cook-mode.md): the screen that "Cook" opens.
