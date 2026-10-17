---
title: Suggestions
summary: "How the plugin decides that a staple needs a look, which reason it shows, and what occurs when you accept or skip it."
parent: staples.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / [Staples](staples.md) / Suggestions

# Suggestions

A [staple](staples.md) is food that you always want. But you do not buy salt at each trip. This page tells how the plugin decides which staples to show you, and what you do with them.

## One rule: the staple needs a look

The amount alone does not tell that food is good. Ginger can be above its low line and too old to use. So the plugin uses three facts together: the amount, the use-by date, and the purchase date. A staple is a suggestion when one line of this table is true.

| The staple                                                   | The reason that shows |
| ------------------------------------------------------------ | --------------------- |
| Has no row                                                   | "Out"                 |
| Is below its [low line](level.md)                            | "Low"                 |
| Has a row with a use-by date that is past                    | "Past its date"       |
| Has a row to [use soon](use-soon.md)                         | "Use by 15 Oct"       |
| Has no purchase date                                         | "No purchase date"    |
| Is "Sometimes" or "Seldom", and the time of its kind is over | "Bought 3 weeks ago"  |
| Is "Often"                                                   | "Often"               |

A suggestion shows one reason: the first line of the table that is true. The time is in days below 14 days, in weeks below 60 days, and in months of 30 days after that.

## You see the facts, and you decide

A suggestion also shows the amount that the pantry has, the purchase date, and the first use-by date. The amount can be wrong, because nothing tells the pantry that the bread is gone. So the plugin does not decide for you. It shows what it knows.

## An example

Potatoes are "Sometimes", and you bought them on 12 October. On 19 October they are not a suggestion. On 2 November they are: "Bought 3 weeks ago". If you cook with them and they get low, they are a suggestion on any day.

## You accept or you skip

- **"Add"** puts the staple on the list. It is an extra now: a task with no mark in the [shopping note](shopping-note.md).
- **"Skip"** takes the suggestion away until put away ends the trip. At the next trip, the plugin asks again, if the staple still needs a look.
- **"Remove"** on the row of an extra takes its task out of the note. The staple is a suggestion again.

A food item that has a task in the shopping note is not a suggestion. Food that a meal puts on the list is not a suggestion either: the list has it already. A low staple that a meal needs is such food. With the boiled eggs in the plan and 2 eggs in the pantry, the list has "Eggs, 28", and the eggs are not a suggestion "Low".

## Food of a meal can need a look too

Food that is not a staple is a suggestion in one case: a meal of the week needs it, and the pantry has it [past its date](past-its-date.md). You accept it or you skip it in the same way.

## A skip is not in a note

The suggestions that you skipped are in the data file of the plugin, because a skip is not a fact of the kitchen. [Put away](put-away.md) takes them out of that file.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): what is in a note, and what is in the data file.
