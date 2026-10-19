---
title: Suggestions
summary: "How the plugin decides that a food item needs a look, which reason and group it shows, and what occurs when you accept, skip, or never ask."
parent: staples.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / [Staples](staples.md) / Suggestions

# Suggestions

The pantry knows what is low, but a list that you must think of yourself forgets it. This page tells how the plugin decides which food to show you in the stage Extras, and what you do with it.

## Each food item that is out, low, or near its date

A food item is a suggestion when the pantry is out of it, low on it, or has it near or past its use-by date. You do not have to label it first. The plugin finds it, and you decide.

| The food item                                 | The reason that shows | The group   |
| --------------------------------------------- | --------------------- | ----------- |
| Has no row                                    | "Out"                 | Out         |
| Is [low](level.md): one package at 1/4 is left | "Low"                 | Low         |
| Has a row with a use-by date that is past     | "Past its date"       | Use-by date |
| Has a row to [use soon](use-soon.md)          | "Use by 15 Oct"       | Use-by date |

This is true also for a food item that you never bought, such as the [stub](intake.md) that intake makes for a new ingredient. A recipe needs it, so you see it. "Skip" takes it away with one tap, and "Never ask" keeps it away.

## A staple adds reminders

Nothing tells the pantry that the bread is gone. So a [staple](staples.md) has more reasons, from its purchase date.

| The staple                                                   | The reason that shows | The group     |
| ------------------------------------------------------------ | --------------------- | ------------- |
| Has no purchase date                                         | "No purchase date"    | Time to check |
| Is "Sometimes" or "Seldom", and the time of its kind is over | "Bought 3 weeks ago"  | Time to check |
| Is "Often"                                                   | "Often"               | Time to check |

A suggestion shows one reason: the first line that is true, with "Out", "Low", and the dates first. The time is in days below 14 days, in weeks below 60 days, and in months of 30 days after that.

## Four groups, with the need first

The stage Extras shows the groups in this sequence: "Out", "Low", "Use-by date", and "Time to check". Food that you have none of comes first, and a reminder of time comes last. The head of a group has its number of lines.

## You see the facts, and you decide

A suggestion shows the level, such as "150 ml of 1 l", the purchase date, and the first use-by date. A food item that the plugin cannot count shows what the pantry has. The amount can be wrong, so the plugin does not decide for you. It shows what it knows.

## An example

Butter has one package of 250 g at 1/4. Butter is a suggestion in the group "Low". Potatoes are "Sometimes", and you bought them on 12 October. On 19 October they are not a suggestion. On 2 November they are: "Bought 3 weeks ago".

## You accept, you skip, or you never ask

- **"Add"** puts the food item on the list. It is an extra now: a task with no mark in the [shopping note](shopping-note.md).
- **"Skip"** takes the suggestion away until put away ends the trip. One line then tells what you skipped, with "Never ask" and "Undo".
- **"Never ask"** writes `suggest: never` into the [food item note](food-item-note.md). The food item is never a suggestion again, and a staple loses its label. The form of the Pantry part has the option "Never ask", so you can undo it there.
- **"Remove"** on the row of an extra takes its task out of the note. The food item is a suggestion again.

A food item that has a task in the shopping note is not a suggestion. Food that a meal puts on the list is not a suggestion either: the list has it already. A low staple that a meal needs is such food, as the [shopping](shopping.md) page tells.

## A skip is not in a note

The suggestions that you skipped are in the data file of the plugin, because a skip is not a fact of the kitchen. [Put away](put-away.md) takes them out of that file. "Never ask" is a fact of the food item, so it is in its note.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): what is in a note, and what is in the data file.
