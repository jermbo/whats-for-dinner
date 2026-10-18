---
title: Level
summary: "How the plugin decides that a food item is low: the amount that you have, the full amount, and the low line."
parent: pantry.md
---

[Wiki](../README.md) / [Pantry](pantry.md) / Level

# Level

The level of a food item tells how much is left. It makes a bar amber, and it can put a food item on the shopping list. This page tells how the plugin calculates it.

## A number alone tells little

Is 500 g of rice much or little? The answer depends on how much rice you usually have. So the level compares three amounts.

| Amount        | Meaning                                   | Where it comes from                                    |
| ------------- | ----------------------------------------- | ------------------------------------------------------ |
| What you have | The sum of all rows of the food item      | The table of the [food item note](food-item-note.md)   |
| Full amount   | The most that the pantry had of this food | The property `full`                                    |
| Low line      | At this amount, the food item is low      | The property `low`, or a percentage of the full amount |

## All places count together

Low is a fact of the food item, not of one shelf. Rice has 500 g in the kitchen pantry and 2 kg in the downstairs pantry, so you have 2.5 kg. The full amount is 5 kg, and the low line is 1 kg. Rice is not low, although the kitchen pantry has little.

## The plugin learns the full amount

You do not have to set these amounts. When the pantry has more of a food than `full` tells, the plugin writes the larger amount, in the unit of the note: two jugs and a half jug of milk make `full: 2 1/2 gal`. The full amount is only for the level. No bar of a package stops at it: the bar of a package is as long as its size, as the [amount bar](amount-bar.md) tells. With no `low`, the line is at 25% of the full amount. The percentage is a [setting](settings.md).

## What the bar of a line shows

The Pantry part has one line for each food item in each place. The length of its bar is the full amount. The dark part is the food of the line: all packages in this place. The light part is the food in the other places. A tick marks the low line.

On the line "Kitchen pantry" of rice, the dark part is 10% of the bar and the light part is 40%. The tick is at 20%. When all places together have less than 1 kg, each bar of rice is amber.

## When the plugin cannot count

The plugin adds two [amounts](amounts.md) only if their units compare. Grams and kilograms compare. Bags and kilograms do not.

- A row such as "a full bag" has no number, so it has no bar.
- If the full amount is "2 kg" and each row is in bags, the food item has no level.

A food item with no level is never low.

## An empty row and out

An [empty row](food-item-note.md#the-empty-row) adds nothing. A food item is out when each of its rows is an empty row, or when the note has no row. So the last gallon that you finish puts milk on the list, although its row stays.

## Further reading

- [Staples](staples.md): how a food item that is low gets on the list.
