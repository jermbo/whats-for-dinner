---
title: What the app reads in a step
summary: 'The app finds the times and the ingredient names in the text of a step, so you set up no timer and no link.'
parent: write-mode.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Recipes](README.md) / [Write mode](write-mode.md) / What the app reads in a step

# What the app reads in a step

In Write mode you type plain text. In [Cook mode](cook-mode.md), the same step has a timer button and shows its ingredients. This page tells how the app makes that connection.

## Why the app reads, and you do not fill in a form

The alternative is a form with a timer field and an ingredient list for each step. A form is slow, and it does not work for a method that you paste. The information is already in the sentence, so the app reads the sentence.

## It finds times

The app looks for a number with a time word: seconds, minutes, or hours, and short forms such as "min".

| The text                        | The timer                           |
| ------------------------------- | ----------------------------------- |
| "Cook the rice for 12 minutes." | 12:00                               |
| "Simmer for 1 hour 30 minutes." | 1:30:00                             |
| "Fry for 3 to 4 minutes."       | 3:00, the first number              |
| "Heat the oven to 200 degrees." | None. "Degrees" is not a time word. |

A step with two times gets two [timers](timers.md).

## It finds ingredients

The app compares the text with the names of the ingredients of this recipe. It ignores capital letters and a plural "s". When it finds a name, the step shows that ingredient with its quantity.

So "Cook the rice for 12 minutes." shows "Rice, 300 g". You do not go back to the ingredient list to find the number.

The app does not know how you divide an ingredient. If two steps name the rice, each of them shows 300 g.

## When the app finds nothing

A step that says "Add the bird" shows no chicken, because the name is not in the text. The step shows its text, and the first card of Cook mode has the full list of ingredients.

## The app reads again each time

A step stores only its text. The app reads the text each time it shows the step. So when you correct "12 minutes" to "15 minutes", the timer is correct at once.

## Further reading

- [Data model](data-model.md): what a step stores, and why it has an ID.
