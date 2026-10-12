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
| Low line      | Below this amount, the food item is low   | The property `low`, or a percentage of the full amount |

## All places count together

Low is a fact of the food item, not of one shelf. Rice has 500 g in the kitchen pantry and 2 kg in the downstairs pantry, so you have 2.5 kg. The full amount is 5 kg, and the low line is 1 kg. Rice is not low, although the kitchen pantry has little.

## The plugin learns the full amount

You do not have to set these amounts. When the pantry has more of a food than `full` tells, the plugin writes the larger amount. With no `low`, the line is at 25% of the full amount. The percentage is a [setting](settings.md).

## What the bar shows

The length of the bar is the full amount. The dark part is the food in this place. The light part is the food in the other places. A tick marks the low line.

On the row "Kitchen pantry" of rice, the dark part is 10% of the bar and the light part is 40%. The tick is at 20%. When all places together have less than 1 kg, each bar of rice is amber.

## When the plugin cannot count

The plugin adds two [amounts](amounts.md) only if their units compare. Grams and kilograms compare. Bags and kilograms do not.

- A row such as "a full bag" has no number, so it has no bar.
- If the full amount is "2 kg" and each row is in bags, the food item has no level.

A food item with no level is never low.

## Further reading

- [Shopping](shopping.md): how a food item that is low gets on the list.
