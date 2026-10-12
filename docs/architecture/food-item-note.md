---
title: Food item note
summary: "The exact form of the note of a food item: its name, its four properties, and its table."
parent: pantry.md
---

[Wiki](../README.md) / [Pantry](pantry.md) / Food item note

# Food item note

A food item is one note in the pantry folder. You can write this note by hand, and the plugin writes the same form. This page gives that form.

## A complete note

This is the note `Elbow pasta.md`:

```markdown
---
aliases:
  - pasta
  - macaroni
brands:
  - Store brand
full: 2 kg
low: 500 g
---

| Place             | Amount | Use by     |
| ----------------- | ------ | ---------- |
| Kitchen pantry    | 500 g  |            |
| Downstairs pantry | 1 kg   | 2027-03-01 |
```

## The name of the note is the name of the food

There is no property for the name. Elbow pasta and shell pasta are two notes, because you do not use one for the other. A recipe that asks for "pasta" finds the two of them by their other name.

## The properties

Each property is optional.

| Property  | Value                                                   | With no value                                  |
| --------- | ------------------------------------------------------- | ---------------------------------------------- |
| `aliases` | Other names that a recipe can use. One text, or a list. | A recipe finds the food item only by its name. |
| `brands`  | The brands that you buy. One text, or a list.           | The shopping list shows no brand.              |
| `full`    | The full amount, such as `2 kg` or `12`.                | It is the amount that you have now.            |
| `low`     | The low line, such as `500 g`.                          | The line is a percentage of the full amount.   |

The [level](level.md) of the food item comes from `full`, from `low`, and from the table.

## The table

The plugin reads the first table of the note. It finds each column by its name, so the sequence of the columns is free.

| Column   | Value                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------- |
| `Place`  | Where the food is. A row with no place is not a row of the pantry.                                      |
| `Amount` | An [amount](amounts.md): `500 g`, `1 1/2 kg`, or `6`. Text with no number, such as `tap`, is permitted. |
| `Use by` | A date as year-month-day, or nothing.                                                                   |

A note with no row is a food item that is out.

## What the plugin changes

The plugin writes three things: the table, `full`, and `low`. All text outside the table stays, so you can write your own text in the note.

The plugin writes the table again with the three columns of this page. A column of your own does not stay.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): the other kinds of notes, and why the plugin has no database.
