---
title: Food past its date
summary: "What the plugin does with food that a meal needs and that is past its use-by date: a suggestion, and a row that replaces the food."
parent: suggestions.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / [Staples](staples.md) / [Suggestions](suggestions.md) / Food past its date

# Food past its date

The list counts only amounts. So chicken that spoiled on Monday is chicken that you have, and the list does not ask for it. On the day of the meal, you open the fridge and you cannot cook. This page tells how the plugin makes you look at such food before that day.

## A date is not exact

The plugin could take food past its date out of the count. But eggs that are 2 days past their date are good, and the list must not tell you to buy eggs. Only you can decide, with the food in your hand. So the plugin asks, and the list stays as it is.

## The suggestion

A food item is a [suggestion](suggestions.md) with the reason "Past its date" when two things are true:

- A meal of the week needs it. A meal that you cooked does not count.
- One of its rows has a use-by date before today. The date of today is not past.

The food item does not have to be a staple. As for a staple, a food item with a task in the [shopping note](shopping-note.md) is not a suggestion.

## "Add" replaces the food

You look at the food. If it is good, you tap "Skip". If it is not, you tap "Add", and the food item is a choice on the list. You replace the food, so its row has all that the meals need, with no regard to the pantry.

A staple that is past its date [fills](staples.md), if that is more than the meals need.

## An example

The chicken curry needs 500 g of chicken thighs. The pantry has 500 g, with the date 13 October. On 13 October, the list has no row for them, and the Shop part has no suggestion. On 14 October, the Shop part suggests the chicken thighs, with the reason "Past its date". "Add" puts "Chicken thighs, 500 g" on the list.

## Further reading

- [Use soon](use-soon.md): what the plugin does before a date is past.
