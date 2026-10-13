---
title: Shopping note
summary: "The form of the note of one trip: a list of tasks while the trip is open, and a table when the note is the receipt."
parent: decision-log.md
---

[Wiki](../../README.md) / [Decision log: shopping list](decision-log.md) / Shopping note

# Shopping note

A trip has one note. You can read it and change it with no plugin. This page gives its two forms: the open note, and the receipt.

## The open note is a list of tasks

The open note has the name "Next trip", in the folder of the shopping notes.

```markdown
Mum comes on Friday.

- [ ] [[Shopping/Items/Batteries|Batteries]]
- [x] [[Pantry/Eggs|Eggs]]
- [x] [[Pantry/Milk|Milk]]
```

The plugin reads each line that is a task. All other lines are your own text.

| Part of the line  | Meaning                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `[ ]`             | The item is to buy. It is a choice: a suggestion that you accepted, or an item of your own.                  |
| `[x]`             | The item is in the cart.                                                                                     |
| The link          | The note of the item. An item is in the pantry when its link goes to a note of the pantry folder.            |
| Text with no link | An item of your own, with that text as its name. Thus you can type a line fast, and it is not in the pantry. |

A link to a note that does not exist is permitted. Batteries have no note, and the link tells where Obsidian makes the note if you click it.

A row that the plugin calculates from the meals is not in the note. It gets its line when you put it in the cart.

## The receipt is a table

The button of put away changes the open note into the receipt of that day.

```markdown
---
date: 2026-10-18
store: Store A
---

Mum comes on Friday.

| Item                  | Amount | Price | Sale | Place          | Use by     |
| --------------------- | ------ | ----- | ---- | -------------- | ---------- |
| [[Pantry/Eggs\|Eggs]] | 12     | 3.49  | yes  | Outside fridge | 2026-11-02 |
| [[Pantry/Milk\|Milk]] | 1 l    | 1.29  |      | Kitchen fridge | 2026-10-20 |
```

In a table, the line between a link and its name has a backslash before it. Obsidian writes a link in a table this way.

| Property | Value                                   | With no value                         |
| -------- | --------------------------------------- | ------------------------------------- |
| `date`   | The day of put away, as year-month-day. | The plugin uses the name of the note. |
| `store`  | The store of the trip.                  | The receipt has no store.             |

| Column   | Value                                           | With no value                        |
| -------- | ----------------------------------------------- | ------------------------------------ |
| `Item`   | The link of the task.                           | The row is not a row of the receipt. |
| `Amount` | What you bought, such as `12` or `1 l`.         | The item is not in the pantry.       |
| `Price`  | What you paid for the full amount of the row.   | The price is missing.                |
| `Sale`   | `yes`, if the item was on sale.                 | The item was not on sale.            |
| `Place`  | The place that got the food.                    | The item is not in the pantry.       |
| `Use by` | The use-by date of the food, as year-month-day. | The food has no date.                |

The plugin finds each column by its name, so the sequence of the columns is free.

## What the button does to the note

1. Each task with a mark becomes a row of the table.
2. Each task with no mark goes into a new note "Next trip".
3. The note gets the properties `date` and `store`, and the name of the day: `2026-10-18`.

Your own text stays in the receipt.

## The receipts are the history

The price of an item is only on its receipts. So a price that you correct by hand in a receipt is the price that the plugin uses.

## Further reading

- [Food item note](../../architecture/food-item-note.md): the other note that put away writes, with the amount, the place, and the use-by date.
