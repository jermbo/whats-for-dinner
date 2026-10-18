---
title: Amounts
summary: "The exact rules for an amount: the forms of a number, the units that the plugin converts, and the amounts that it cannot compare."
parent: match.md
---

[Wiki](../README.md) / [Recipes](recipes.md) / [Match](match.md) / Amounts

# Amounts

An amount is a number and a unit, such as "500 g". A recipe and a pantry row write amounts in the same way. This page gives the rules that the plugin uses to read an amount and to compare two of them.

## The number

The plugin reads four forms of a number. The text after the number is the unit.

| Form               | Example            | Value |
| ------------------ | ------------------ | ----- |
| Fraction           | `1 1/2 cups`       | 1.5   |
| Fraction character | `½ tsp`            | 0.5   |
| Decimal            | `1.5 kg`, `1,5 kg` | 1.5   |
| Integer            | `6`                | 6     |

A comma is a decimal mark. Do not use it for thousands: `1,000 g` is 1 gram.

## The unit

A unit with a period, a capital letter, or a plural is the same unit: "Cups" is "cup". The plugin converts two families of units.

| Family | Units                                                                   | Compared in |
| ------ | ----------------------------------------------------------------------- | ----------- |
| Mass   | g, kg, oz, lb, and names such as "gram" and "pound"                     | Grams       |
| Volume | ml, cl, dl, l, tsp, tbsp, cup, fl oz, pt, qt, gal, and names such as "litre", "teaspoon", "pint", and "gallon" | Millilitres |

The American volumes are close, not exact: `gal` is 3785.41 ml, `qt` is 946.35 ml, `pt` is 473.18 ml, and `fl oz` is 29.57 ml. `oz` with no "fl" is a mass.

Each other unit is a count of that unit: cans, cloves, bags. A number with no unit is a plain count, such as 6 eggs.

## What compares

Two amounts compare only if they are in the same family, or are counts of the same unit.

- 300 g and 2 kg compare. So do 2 tablespoons and 500 ml, and 1 gal and 4 qt.
- 200 g and 1 cup do not compare. The plugin does not know the weight of a cup of flour.
- 2 cans and 1 jar do not compare.

When two amounts do not compare, the plugin does not calculate. The [match](match.md) page tells what it does in that case.

## An amount with no number

A pantry row can have text with no number, such as "tap" or "a full bag". The food is there, but the plugin cannot count it. In a recipe, an amount with no number is an error, and the note is not a recipe.

## How the plugin writes an amount

The plugin shows 2 decimals at most. It shows 1000 g or more as kilograms, and 1000 ml or more as litres: "1.5 kg".

You read a gallon, a pint, or a cup in fractions on the package. So an amount in `gal`, `qt`, `pt`, `cup`, `tsp`, or `tbsp` that is a number of eighths shows as a fraction: 0.375 gal is "3/8 gal", and 1.5 gal is "1 1/2 gal". Each other unit keeps decimals: 7.5 oz, and 0.625 kg is "625 g". The note gets the same text as the screen.

A pantry row keeps the unit that you gave it. After a change, 2 kg less 300 g is "1.7 kg", and 1 gal less 1/8 gal is "7/8 gal". If the result is not round in that unit, the row gets grams or millilitres: 1 kg less 4 g is "996 g".

The total of the rows of a food item is in their unit when each row has the same unit: eight cans of 15 oz less half a can are "112.5 oz". Rows in different units of one family add up in grams or millilitres.

## Further reading

- [Food item note](food-item-note.md): the table where the rows of the pantry have their amounts.
