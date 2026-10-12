---
title: Names
summary: "How to select the name of a function, a value, and a file, so that the reader needs no comment."
parent: code-standards.md
---

[Wiki](../README.md) / [Code standards](code-standards.md) / Names

# Names

A name is the first thing that a reader sees of a function, and often the only thing. This page tells how to select a name that tells the intent.

## A name is a word of the kitchen

The [glossary](../glossary.md) has one word for each thing of the kitchen. The code uses the same word. The wiki says "level", so the function is `levelOf` and its type is `Level`.

Then a reader who knows the wiki can read the code. A search for one word finds the page and the code.

If the glossary has no word for a thing, the thing gets its word there first.

## One word for one act

The code has one verb for one kind of act. A second verb for the same act makes the reader look for a difference that is not there.

| The name      | What the function does                       | Example       |
| ------------- | -------------------------------------------- | ------------- |
| Starts `read` | Makes values from the text of a note.        | `readRecipe`  |
| Starts `show` | Makes text from values.                      | `showMeasure` |
| Ends `Of`     | Calculates one thing from a different thing. | `levelOf`     |
| Starts `is`   | Answers yes or no.                           | `isLow`       |
| Starts `by`   | Puts rows in a sequence, or in groups.       | `byPlace`     |
| Starts `with` | Gives a copy with one value changed.         | `withAmount`  |

## The rules

1. A function is a verb or a question. A value is a noun: `takeOut`, `isSoon`, `stocks`.
2. A name tells the intent, not the form: `stocks`, and not `stockArray` or `list`.
3. No short form, and no word that tells nothing: `data`, `info`, `helper`, `manager`, `util`.
4. The length fits the reach. `a` and `b` are good names in a sort of one line. An exported name is complete.
5. A number with a meaning has a name. `LOW_PERCENT` tells what 25 is.
6. A file has the name of its job: `level.ts`, `shopping-list.ts`.

## An example

| Not this                   | But this                     |
| -------------------------- | ---------------------------- |
| `calc(item, 25)`           | `levelOf(item, LOW_PERCENT)` |
| `checkStock(row)`          | `isLow(row)`                 |
| `const d = daysBetween(…)` | `const daysLeft = …`         |

The left side makes you open the function. The right side tells you what you get.

## Further reading

- [Comments](comments.md): what to do when a name cannot tell all of it.
