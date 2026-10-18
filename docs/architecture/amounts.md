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

Each other unit is a count of that unit, such as cloves in a recipe. A number with no unit is a plain count, such as 6 eggs.

## What compares

Two amounts compare if they are in the same family, or are counts of the same unit.

- 300 g and 2 kg compare. So do 2 tablespoons and 500 ml, and 1 gal and 4 qt.
- 2 cans and 2 cans compare. 2 cans and 1 jar do not.

A mass and a volume compare by one rough rule: 1 ml is 1 g, for each food. A tablespoon of sugar is 15 g, against a bag of 250 g. The real weight is near 12 g, and a cup of flour is far from 240 g. That is good enough for a cook, and a baking recipe is in grams. The rule is always the same, so the plugin counts the line, with no mark.

A count does not compare with a mass or a volume. The [match](match.md) page tells what the plugin does in that case.

## The unit system of the vault

Each vault has one unit system, from the [settings](settings.md): metric or imperial. Each row of the pantry is in that system, or is a plain count.

| System   | Mass      | Volume                 |
| -------- | --------- | ---------------------- |
| Metric   | g, kg     | ml, l                  |
| Imperial | oz, lb    | fl oz, cup, qt, gal    |

An amount that you type for the pantry goes into the system at entry. In a metric vault, "8 oz" becomes "227 g", rounded to a whole gram or millilitre. A container word such as "jar" or "bag" is not a unit there: you give the weight or the volume from the label. A recipe can be in either system, because the two families convert.

## An amount with no number

A pantry row can have text with no number, such as "tap". The food is there, but the plugin cannot count it. In a recipe, an amount with no number is an error, and the note is not a recipe.

## How the plugin writes an amount

The plugin shows 2 decimals at most. It shows 1000 g or more as kilograms, and 1000 ml or more as litres: "1.5 kg".

You read a gallon, a pint, or a cup in fractions on the package. So an amount in `gal`, `qt`, `pt`, `cup`, `tsp`, or `tbsp` that is a number of eighths shows as a fraction: 0.375 gal is "3/8 gal", and 1.5 gal is "1 1/2 gal". Each other unit keeps decimals: 7.5 oz, and 0.625 kg is "625 g". The note gets the same text as the screen.

A pantry row keeps the unit that you gave it. After a change, 2 kg less 300 g is "1.7 kg", and 1 gal less 1/8 gal is "7/8 gal". If the result is not round in that unit, the row gets grams or millilitres: 1 kg less 4 g is "996 g".

The total of the rows of a food item is in their unit when each row has the same unit: eight cans of 15 oz less half a can are "112.5 oz". Rows in different units of one family add up in grams or millilitres.

## Further reading

- [Food item note](food-item-note.md): the table where the rows of the pantry have their amounts.
