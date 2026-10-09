---
title: What a cook session remembers
summary: 'A cook session stores the raw facts of one cook, with their times. The app gets most of them with no tap from you.'
parent: data-model.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Recipes](README.md) / [Data model](data-model.md) / What a cook session remembers

# What a cook session remembers

A cook session is the record of one time that you cooked one recipe. This page tells what is in it, and why the app stores more than a screen shows.

## The problem

Some questions have an answer only after months. How many times did you cook the curry? Does it really take 30 minutes? The app can answer only from facts that it stored at the time.

## The rule: facts that cost no tap

The app stores each fact that it can see by itself, with its time. It never asks a question only to get data.

| The fact                                | Where it comes from                 | Your work |
| --------------------------------------- | ----------------------------------- | --------- |
| The start time                          | You open [Cook mode](cook-mode.md). | None      |
| The time of each card                   | You go to the next card.            | None      |
| The end time                            | You tap "Cooked".                   | None      |
| The servings                            | The recipe, at that time.           | None      |
| The pantry amounts                      | The app subtracts the ingredients.  | None      |
| The [finished photo](finished-photo.md) | The screen after "Cooked".          | Optional  |
| The [step notes](step-notes.md)         | A step card.                        | Optional  |
| The rating and the note                 | The screen after "Cooked".          | Optional  |

The app stores facts, not results. It does not store "cook time: 39 minutes", because it can calculate a result at any time.

## What the facts can answer

- How many times you cooked a recipe.
- How long it really takes, and which step is slow.
- All photos and all notes of a recipe, by date.
- What a meal costs: the [prices are in the purchases](../shopping/prices-and-trips.md).

## An open session

A session with a start and no end is open: you are in the middle of the meal. This is how Cook mode keeps your place.

"Cooked" on the Today screen makes a session with only the end time.

## An example

Chicken curry, 3 October. The start is 18:02. Step 4 opens at 18:20, and the last card opens at 18:36. The end is 18:41. So the cook took 39 minutes, and step 4, "Simmer for 15 minutes", took 16.

## Further reading

- [Step photos](step-photos.md): photos that a cook adds to the recipe, not to the session.
