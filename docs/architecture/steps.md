---
title: Steps
summary: "How the plugin divides the instructions of a recipe into the pages of Cook Mode, and how each page gets its ingredients."
parent: cook-mode.md
---

[Wiki](../README.md) / [Cook Mode](cook-mode.md) / Steps

# Steps

Cook Mode shows one step on one page. But a recipe note has only text below its ingredients. This page tells how the plugin finds the steps in that text, and the ingredients of each step.

## The format does not define a step

The [recipe note](recipe-note.md) has a part "instructions", and the format says nothing more about it. One person writes a numbered list. A family card is three paragraphs. The plugin must make pages from the two of them.

## A list item is a step

The plugin has two rules, in this sequence:

1. If the instructions have a list, each item of a list is a step.
2. If they have no list, each paragraph is a step.

So in a recipe with a list, a paragraph between the items is not a step. Use it for a remark.

## What is not a step

| Text                                        | Why                                           |
| ------------------------------------------- | --------------------------------------------- |
| All text below a heading, such as "Tips"    | It is not part of the work at the stove.      |
| The heading "Cooked" and the lines below it | It is the record of your meals.               |
| A callout, such as the preparation          | You do it before the day, not while you cook. |

A heading at the start of the instructions, such as "Method", is permitted. The text below each later heading is not a step.

## Each step shows its ingredients

A step such as "Add the garlic and the ginger" does not tell how much. So the page shows the ingredients that the text names, each with its amount.

The plugin looks for the name of each ingredient in the text of the step. Plural and singular are equal, as in the [match](match.md). It also looks for the last word of a name, if that word has 4 letters or more. Thus "Cut the thighs" finds "chicken thighs". The word "oil" is too short, so "olive oil" needs its full name.

This rule can find too much. "Add the milk" finds "coconut milk" also. The amount on the page tells you which one is meant.

## An example

Step 5 of the chicken curry is "Cut the chicken thighs into pieces and add them. Cook for 5 minutes." The page shows this text in large type, the ingredient "500 g chicken thighs", and a [timer](timers.md) of 5 minutes.

## Further reading

- [Cook Mode](cook-mode.md): the pages before the first step and after the last step.
