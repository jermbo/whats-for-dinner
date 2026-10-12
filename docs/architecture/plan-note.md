---
title: Plan note
summary: 'The exact form of the note that holds the plan: one task for each meal, what the plugin reads in a task, and what it changes.'
parent: plan.md
updated: 2026-10-11
---

[Wiki](../README.md) / [Plan](plan.md) / Plan note

# Plan note

The plan of the week is one note. You can read it and change it with no plugin. This page gives the form of that note.

## A complete note

```markdown
# Week of 12 October

Mum comes on Friday.

- [ ] [[Recipes/Tacos|Tacos]] · 2026-10-11 · prep done
- [ ] [[Recipes/Chicken curry|Chicken curry]]
- [x] [[Recipes/Pancakes|Pancakes]]
```

A setting gives the name of the note. It starts as `Meal plan.md`. If the note is not there, the plugin makes it with your first meal.

## One task is one meal

The plugin reads each line that is a task with a link to a note. All other lines are your own text.

| Part of the line      | Meaning                                                     |
| --------------------- | ----------------------------------------------------------- |
| `[ ]` or `[x]`        | A task that is done is a meal that you cooked.              |
| The link              | The note of the recipe, with the name that the plan shows.  |
| A date                | The day for which you selected the meal, as year-month-day. |
| The words "prep done" | You confirmed the preparation of the recipe.                |

The date has an effect only on that day. On the next day, the meal is a meal of the week again, and the date stays in the note as text.

## What the plugin changes

The plugin changes only the lines of the meals.

- **A new meal** is a new line after the last meal. With no meal in the note, it goes at the end.
- **A change of a meal** writes its line again. The link stays as you wrote it. Other text on that line does not stay.
- **A recipe is in the plan one time.** "Cook again" on a cooked meal takes its old line out and adds a new one.
- **A new week** takes each meal line out. Your own text stays.

Each change starts from the text that the note has at that moment. So two taps, one directly after the other, do not lose a meal.

## What the note does not have

The note has no type and no sequence of days. The type of a meal comes from the first tag of its recipe. If the note of a recipe is gone, the meal shows the path of the link, and you can remove it.

## Further reading

- [Preparation](preparation.md): what the words "prep done" confirm.
- [Notes of the kitchen](notes-of-the-kitchen.md): why the plan is a note and not a file of the plugin.
