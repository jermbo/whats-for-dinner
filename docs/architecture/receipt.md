---
title: Receipt
summary: "The exact form of the note of a trip that is complete: its name, its property, and the table with one row for each item."
parent: shopping-note.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / [Shopping note](shopping-note.md) / Receipt

# Receipt

When you put the cart away, the [shopping note](shopping-note.md) of the trip becomes its receipt. Thus the vault has one note for each trip to the store, with what you bought. This page gives the form of that note.

## A complete note

This is the note `2026-10-18.md`, in the shopping folder:

```markdown
---
date: 2026-10-18
---

Mum comes on Friday.

| Item                          | Amount | Price | Sale | Place          | Use by |
| ----------------------------- | ------ | ----- | ---- | -------------- | ------ |
| [[Pantry/Lime\|Lime]]         | 1      |       |      | Kitchen pantry |        |
| [[Pantry/Avocados\|Avocados]] | 2      |       |      | Kitchen        |        |
| Soap                          |        |       |      |                |        |
```

In a table, the line between a link and its name has a backslash before it. Obsidian writes a link in a table this way.

## The name is the day of put away

A trip can start on Tuesday with one item, and be in the store on Saturday. The receipt gets the name of the day on which you put the cart away, as year-month-day. So each receipt has the day on which you bought the food, and the number of receipts is the number of trips.

A second receipt of one day gets a number: `2026-10-18 2`. The property `date` has the day too, so that you can give the note a different name.

## One row is one item of the cart

| Column   | Value                                    | With no value                  |
| -------- | ---------------------------------------- | ------------------------------ |
| `Item`   | The link of the task, or its text.       | The row is not of the receipt. |
| `Amount` | What went into the pantry, such as `12`. | The item is not in the pantry. |
| `Place`  | The place that got the food.             | The item is not in the pantry. |

The plugin makes the columns `Price`, `Sale`, and `Use by`, and it leaves them empty. The receipt is a note, so you can type a price into it.

## What put away does to the note

1. Each task with a mark becomes a row of the table. The table is where the first task was.
2. Each task with no mark goes into a new note "Next trip". You did not buy that item, and the request still stands.
3. The note gets the property `date`, and the name of the day.

Your own text stays in the receipt. If each task has a mark, the plugin makes no new note.

## Further reading

- [Put away](put-away.md): what goes into the pantry in the same action.
- [Food item note](food-item-note.md): the note that gets the purchase date.
