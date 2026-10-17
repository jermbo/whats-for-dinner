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
| Volume | ml, cl, dl, l, tsp, tbsp, cup, and names such as "litre" and "teaspoon" | Millilitres |

Each other unit is a count of that unit: cans, cloves, bags. A number with no unit is a plain count, such as 6 eggs.

## What compares

Two amounts compare only if they are in the same family, or are counts of the same unit.

- 300 g and 2 kg compare. So do 2 tablespoons and 500 ml.
- 200 g and 1 cup do not compare. The plugin does not know the weight of a cup of flour.
- 2 cans and 1 jar do not compare.

When two amounts do not compare, the plugin does not calculate. The [match](match.md) page tells what it does in that case.

## An amount with no number

A pantry row can have text with no number, such as "tap" or "a full bag". The food is there, but the plugin cannot count it. In a recipe, an amount with no number is an error, and the note is not a recipe.

## How the plugin writes an amount

The plugin shows 2 decimals at most. It shows 1000 g or more as kilograms, and 1000 ml or more as litres: "1.5 kg".

A pantry row keeps the unit that you gave it. After a change, 2 kg less 300 g is "1.7 kg". If the result is not round in that unit, the row gets grams or millilitres: 1 kg less 4 g is "996 g".

## Further reading

- [Food item note](food-item-note.md): the table where the rows of the pantry have their amounts.
