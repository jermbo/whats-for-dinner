---
title: Food item note
summary: "The exact form of the note of a food item: its name, its properties, its table of packages with a level or a count, and its section Brands."
parent: pantry.md
---

[Wiki](../README.md) / [Pantry](pantry.md) / Food item note

# Food item note

A food item is one note in the pantry folder. You can write this note by hand, and the plugin writes the same form. This page gives that form.

## A complete note

This is the note `Milk.md`:

```markdown
---
aliases:
  - whole milk
staple: often
bought: 2026-10-14
---

| Place  | Left | Size  | Use by     |
| ------ | ---- | ----- | ---------- |
| Fridge | 1/4  | 1 gal | 2026-10-22 |
| Fridge | full | 1 gal | 2026-10-29 |

## Brands

- Store brand · buy again
  ![[Milk - Store brand.jpg]]
```

## The name of the note is the name of the food

There is no property for the name. Elbow pasta and shell pasta are two notes, because you do not use one for the other. A recipe that asks for "pasta" finds the two of them by their other name.

## The properties

Each property is optional.

| Property  | Value                                                           | With no value                                       |
| --------- | --------------------------------------------------------------- | --------------------------------------------------- |
| `aliases` | Other names that a recipe can use. One text, or a list.         | A recipe finds the food item only by its name.      |
| `staple`  | How often you buy it: `often`, `sometimes`, `seldom`.           | The food item is not a [staple](staples.md).        |
| `bought`  | The purchase date, as year-month-day.                           | The food item has no purchase date.                 |
| `suggest` | `never`: the food item is never a [suggestion](suggestions.md). | The food item is a suggestion when it needs a look. |
| `size`    | The size of the next package, such as `64 fl oz` or `12`. The form of the food item writes it. | A new package gets the size of the newest package. |
| `check`   | `true`: a meal could not take this food out, so you check it in the audit. | Nothing to check.                                   |

In `staple`, capital and small letters are the same. A different value counts as no staple. The purchase date is the day on which you put the food away the last time.

The plugin does not read other properties. A property such as `full` or `low` from an older note stays in the note, and nothing uses it.

## The table: one row for each package

The plugin reads the first table of the note. It finds each column by its name, so the sequence of the columns is free. Each row is one package that you can hold in your hand: two jugs of milk are two rows, also with the same place, size, and date.

| Column   | Value                                                                                  |
| -------- | -------------------------------------------------------------------------------------- |
| `Place`  | Where the package is. A row with no place is not a row of the pantry.                  |
| `Left`   | What is left: a level, a count, or a text such as `tap`.                               |
| `Size`   | The package size: a number with a unit, such as `1 gal` or `425 g`, or a plain count, such as `12`. |
| `Use by` | A date as year-month-day, or nothing.                                                  |

The size tells the kind of the food item. A size with a unit is a measure, and `Left` is a [level](level.md): `full`, `3/4`, `1/2`, or `1/4`. A plain number is a count, and `Left` is a whole number from 1 to the size: `4` of `12` eggs. The unit of a size comes from the [unit list](amounts.md#the-units-of-a-package-size).

A row with a text in `Left` that is not a level or a count, such as `tap` for water, is in the pantry. The plugin cannot count it, so a meal does not take from it.

## An empty package goes out

A row with `Left` empty or `0` is not a package. The plugin takes it out of the table when it writes the note. A note with no package is a food item that is out: the Shop part shows it, so that you buy it again.

[Intake](intake.md) makes such a note for a new ingredient: a stub, with no property and no row, which stays out until you buy the food.

## The section "Brands"

The [brands](brands.md) of the food item are below the heading "Brands", of any level, up to the next heading.

| Line                                          | Meaning                                                          |
| --------------------------------------------- | ---------------------------------------------------------------- |
| A list item                                   | One brand. Its text is the name of the brand.                    |
| A line with an indent below it, with an image | A photo of that brand. The first photo is the photo that shows.  |
| A list item with only the link of an image    | A brand with that photo and no name.                             |
| Text after ` · ` on the line of the item      | The verdict: `buy again` or `avoid`, with capital or small letters. |
| Digits after ` · ` at the end of the line     | The barcode of the brand, 8 to 14 digits: `- Bush's · buy again · 039400016045`. |

A brand with no name and a verdict is `- · avoid`, with its photo on the line below. A note with no section has no brand. The plugin does not read a property `brands`.

## What the plugin changes

The plugin writes the table, `staple`, `bought`, `size`, `check`, and the list items of the section "Brands". All other text stays, so you can write your own text in the note.

The plugin writes the table again with the four columns of this page, in the sequence `Place`, `Left`, `Size`, `Use by`. A column of your own does not stay.

In the section "Brands", a new brand goes at the end, and a note with no section gets `## Brands` at its end. A brand that you remove goes with its lines. The text of the section that is not a list item stays.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): the other kinds of notes, and why the plugin has no database.
