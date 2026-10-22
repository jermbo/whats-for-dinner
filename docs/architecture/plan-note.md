---
title: Plan note
summary: "The exact form of the note that holds the plan: one task for each meal, one indented line for each side, what the plugin reads, and what it changes."
parent: plan.md
updated: 2026-10-21
---

[Wiki](../README.md) / [Plan](plan.md) / Plan note

# Plan note

The plan of the week is one note. You can read it and change it with no plugin. This page gives the form of that note.

## A complete note

```markdown
# Week of 19 October

Mum comes on Friday.

- [ ] [[Recipes/Beef tacos|Beef tacos]] · 2026-10-21 · prep done
	- [[Recipes/Honey glazed carrots|Honey glazed carrots]]
	- Salad
- [ ] [[Recipes/Chicken curry|Chicken curry]]
```

A setting gives the name of the note. It starts as `Meal plan.md`. If the note is not there, the plugin makes it with your first meal.

## One task is one meal

The plugin reads each line that is a task with a link to a note. That task is the main dish of a meal. All other lines are your own text, or the sides of a meal.

| Part of the line      | Meaning                                                     |
| --------------------- | ----------------------------------------------------------- |
| `[ ]`                 | A meal of the plan.                                         |
| `[x]`                 | A meal that left the plan. The plugin does not show it.     |
| The link              | The note of the recipe, with the name that the plan shows.  |
| A date                | The day on which you flagged the meal for tonight, as year-month-day. |
| The words "prep done" | You confirmed the preparation of the recipe.                |

The date has an effect only on that day. On each other day, the meal is an option with no flag, and the date stays in the note as text. A new flag takes the date off the task that had the flag.

A note from before version 0.9.0 can have tasks with `[x]` for the meals that you cooked. The plugin does not show them, and their food is not on the list.

## An indented line is a side

Each line below a task that starts with a tab or spaces, and then `- `, is a side of that meal. The sides end at the first line that is not indented.

| The side line                                         | Meaning                                    |
| ----------------------------------------------------- | ------------------------------------------ |
| `	- [[Recipes/Honey glazed carrots\|Honey glazed carrots]]` | A side that is a recipe. Its food goes on the list. |
| `	- Salad`                                             | A side with only a name. It needs nothing. |

A side has no box: it is ready when its meal is cooked.

## What the plugin changes

The plugin changes only the lines of the meals and their sides.

- **A new meal** is a new line after the last meal and its sides. With no meal in the note, it goes at the end.
- **A change of a meal** writes its task again. The link stays as you wrote it. Other text on that line does not stay. The sides do not change.
- **A new side** is a new line after the last side of its meal.
- **"Remove" on a side** takes its line out.
- **A recipe is in the plan one time as a main dish.** A recipe can be a side of more than one meal.
- **"Remove" on a meal** takes its task and its sides out.
- **The end of a meal** takes its task and its sides out. A side that you cooked alone changes nothing.

Each change starts from the text that the note has at that moment. So two taps, one directly after the other, do not lose a meal.

## What the note does not have

The note has no type and no sequence of days. The type of a meal comes from the first tag of its recipe. If the note of a recipe is gone, the meal shows the path of the link, and you can remove it.

## Further reading

- [Preparation](preparation.md): what the words "prep done" confirm.
- [Notes of the kitchen](notes-of-the-kitchen.md): why the plan is a note and not a file of the plugin.
