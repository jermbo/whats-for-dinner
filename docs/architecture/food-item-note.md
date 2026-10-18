---
title: Food item note
summary: "The exact form of the note of a food item: its name, its properties, its table, and its section Brands."
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
full: 2 kg
low: 500 g
staple: seldom
bought: 2026-10-04
---

| Place             | Amount | Use by     |
| ----------------- | ------ | ---------- |
| Kitchen pantry    | 500 g  |            |
| Downstairs pantry | 1 kg   | 2027-03-01 |

## Brands

- Store brand
  ![[Elbow pasta - Store brand.jpg]]
- ![[Elbow pasta - brand 2026-10-18.jpg]]
```

## The name of the note is the name of the food

There is no property for the name. Elbow pasta and shell pasta are two notes, because you do not use one for the other. A recipe that asks for "pasta" finds the two of them by their other name.

## The properties

Each property is optional.

| Property  | Value                                                           | With no value                                       |
| --------- | --------------------------------------------------------------- | --------------------------------------------------- |
| `aliases` | Other names that a recipe can use. One text, or a list.         | A recipe finds the food item only by its name.      |
| `full`    | The full amount, such as `2 kg` or `12`.                        | It is the amount that you have now.                 |
| `low`     | The low line, such as `500 g`.                                  | The line is a percentage of the full amount.        |
| `staple`  | How often you buy it: `often`, `sometimes`, `seldom`.           | The food item is not a [staple](staples.md).        |
| `bought`  | The purchase date, as year-month-day.                           | The food item has no purchase date.                 |
| `suggest` | `never`: the food item is never a [suggestion](suggestions.md). | The food item is a suggestion when it needs a look. |

The [level](level.md) of the food item comes from `full`, from `low`, and from the table.

In `staple`, capital and small letters are the same. A different value counts as no staple. The purchase date is the day on which you put the food away the last time.

## The table

The plugin reads the first table of the note. It finds each column by its name, so the sequence of the columns is free.

| Column   | Value                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------- |
| `Place`  | Where the food is. A row with no place is not a row of the pantry.                                      |
| `Amount` | An [amount](amounts.md): `500 g`, `1 1/2 kg`, or `6`. Text with no number, such as `tap`, is permitted. |
| `Use by` | A date as year-month-day, or nothing.                                                                   |

A note with no row is a food item that is out. [Intake](intake.md) makes such a note for a new ingredient: a stub, with no property and no row, which the Shop part shows as out until you buy the food.

## The section "Brands"

The [brands](brands.md) of the food item are below the heading "Brands", of any level, up to the next heading.

| Line                                         | Meaning                                                          |
| -------------------------------------------- | ---------------------------------------------------------------- |
| A list item                                  | One brand. Its text is the name of the brand.                    |
| A line with an indent below it, with an image | A photo of that brand. The first photo is the photo that shows. |
| A list item with only the link of an image   | A brand with that photo and no name.                             |

This is the form of a [step photo](steps.md): the photo continues the list item. A note with no section has no brand. The plugin does not read a property `brands`.

## What the plugin changes

The plugin writes six things: the table, `full`, `low`, `staple`, `bought`, and the list items of the section "Brands". All other text stays, so you can write your own text in the note.

The plugin writes the table again with the three columns of this page. A column of your own does not stay.

In the section "Brands", a new brand goes at the end, and a note with no section gets `## Brands` at its end. A new name goes on the line of the item, and its photo goes on the line below. A brand that you remove goes with its lines. The text of the section that is not a list item stays.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): the other kinds of notes, and why the plugin has no database.
