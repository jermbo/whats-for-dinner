---
title: Occasion note
summary: "The exact form of the note of an occasion: its date, one task line for each dish with its fields, the guests, the tasks below \"To do\", and what the plugin changes."
parent: occasion.md
updated: 2026-10-31
---

[Wiki](../README.md) / [Occasion](occasion.md) / Occasion note

# Occasion note

An occasion is one note. You can read it and change it with no plugin. This page gives the form of that note.

## A complete note

```markdown
---
date: 2026-11-26
---
Dinner at 15:00.

- [ ] [[Recipes/Roast turkey|Roast turkey]] · main · prep done
- [ ] [[Recipes/Green beans|Green beans]] · side · ×2
- [ ] Pumpkin pie · dessert · Mum
- [x] Rolls · bread · Sam
- [ ] Plates · things · ?

## Guests

- Mum ×2
- Sam
- The Smiths ×4

## To do

- [ ] Borrow chairs · 2026-11-24
- [ ] Buy candles
```

The note is in the occasions folder, which starts as `Larder/Occasions`. Its name is the name of the occasion. The property `date` is the day, as year-month-day. A note with no `date` is active with no end, and it puts food on the list only with "Add to the list".

## One task line is one dish

Each task line above the heading `## To do` is a dish, also called a job. The first part is a link to a recipe, or only a name. The fields come after ` · `, each one optional.

| Field             | Meaning                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| `×2`              | The scale: how many times you make the dish. With no scale, it is ×1.            |
| `prep done`       | You confirmed the [preparation](preparation.md) of the recipe.                   |
| The first word    | The course, such as `main` or `bread`.                                           |
| The second word   | The person who brings the dish, as text or as a link, such as `[[Mum]]`. `?` is nobody yet: the job is open. |
| `[x]`             | The dish is ready: you cooked it, or it came.                                    |

The scale and `prep done` have a fixed form, so the plugin finds them at any place. The other words have a fixed sequence: course first, then person. So in `Rolls · Sam`, "Sam" is the course. When a dish has a person, the plugin also writes its course.

## A line below "Guests" is a guest

Each list line below the heading `## Guests` is a guest, such as `- Mum` or `- The Smiths ×4`. The number after `×` is the party size, and a line with no number is 1. A name can be a link. A person of a dish who has no line is a guest with the size 1.

## A task line below "To do" is a task

Each task line below the heading `## To do` is a task of the occasion, such as `Borrow chairs`. A field of the form year-month-day after ` · ` is its day. "Add a task" on the screen writes a task with no day. You give a task a day in the note, and a tap on the screen gives it its mark.

## What the plugin changes

The plugin changes only the task lines and the guest lines. All other text stays.

- **A new dish** is a new line after the last dish. With no dish, it goes above the first heading `## Guests` or `## To do`, or at the end of the note.
- **A new guest** is a line at the end of the guest list. With no list, the plugin writes `## Guests` above `## To do`, or at the end of the note.
- **A party size** writes the line of the guest again. A size of 1 has no `×`. A person of a dish with no line gets a line.
- **A removed guest** loses the line, and each dish of that guest gets the person `?`.
- **A new task** is a line after the last task. With no `## To do`, the plugin writes the heading at the end of the note.
- **A change of a dish** writes its line again, in the sequence course, scale, person, `prep done`. The link, the name, the mark, and a person that is a link stay as you wrote them.
- **"Remove dish"** takes the line of the dish out.
- **A check** changes only `[ ]` or `[x]`, of a dish or of a task.
- **The end of Cook Mode** for a dish gives its line the mark.
- **A copy** of a past occasion gets its dishes, its guests, and its tasks with no day, each with no mark and no `prep done`.
- **"Delete occasion"** moves the note to the trash.

Each change starts from the text that the note has at that moment, so two taps do not lose a dish.

## Further reading

- [Plan note](plan-note.md): the note of the week, whose task lines have the same form.
