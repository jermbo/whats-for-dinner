---
title: Preparation
summary: 'How a recipe tells what you must do before you cook, and how the plan makes you see it in time.'
parent: recipes.md
updated: 2026-10-11
---

[Wiki](../README.md) / [Recipes](recipes.md) / Preparation

# Preparation

Preparation is work that a recipe needs before you can cook. If you see it at 18:00, it is too late. This page tells how a recipe gives its preparation, and where the plugin shows it.

## The chicken is still in the freezer

The tacos need ground beef, and the beef is in the freezer. The recipe is correct and the pantry has all the food, but you cannot cook. The format of a recipe has no part for this. So the plugin has its own form.

## A callout in the recipe note

You write the preparation as a callout of the type "prep":

```markdown
> [!prep] Take the ground beef out of the freezer in the morning.
```

The callout can be in the description or in the instructions. If a note has more than one, the first one counts. The text can continue on more lines, each with `>`.

A callout is plain Markdown, so the note stays a correct recipe. In Obsidian, the plugin gives this callout a clock and an orange colour, so it stands out when you read the note.

## Where the plugin shows it

| Place              | What you see                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| The recipe list    | The sticker "Prep" on the recipe, and the text when you open the recipe. |
| A meal of the week | The text, with the check box "Prep is done".                             |

The description of the recipe shows without the callout, because the preparation has its own box. The callout is not a step of Cook Mode.

## You confirm it, and the plan keeps that

When you set the check box, the edge of the box becomes olive. The task of the meal in the [plan note](plan-note.md) gets the words "prep done".

For a meal of today, "Cook" is the quiet button while the preparation waits. After you confirm, "Cook" is the main button. The button is never locked: you know your kitchen better than the plugin does.

If you forgot the preparation, tap "Not today" and select a different meal of the week.

## Further reading

- [Plan](plan.md): how you select the meal of today.
- [Recipe note](recipe-note.md): the other parts of the note of a recipe.
