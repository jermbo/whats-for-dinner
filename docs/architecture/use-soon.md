---
title: Use soon
summary: "How a use-by date on one row moves through the plugin: a badge in the pantry, a recipe at the top, the first food out, and a suggestion when the date is past."
parent: pantry.md
---

[Wiki](../README.md) / [Pantry](pantry.md) / Use soon

# Use soon

Food that spoils is money in the bin. A date in a note does not help if nobody looks at it. This page tells how one use-by date changes what the plugin shows you.

## The date is on the row, not on the food

A row of the pantry is one package, and it can have a use-by date. Spinach has two rows: 200 g in the kitchen fridge until 13 October, and 300 g in the outside fridge until 18 October. They are two bags, so they have two dates.

A package that is empty goes out of the [note](food-item-note.md#an-empty-package-goes-out), with its date. So the carton of eggs that you finished makes no suggestion for eggs that you do not have.

## Soon is 5 days or less

A row is "use soon" when its date is in 5 days or less. A date in the past is soon too. The number of days is a setting, from 1 to 14.

On 11 October, the spinach of the kitchen fridge is soon: 2 days are left. The other bag has 7 days, so it is not soon.

## What the pantry shows

The Pantry part has one line for each food item in each place. The first date of its packages counts, and a line that is soon gets a badge.

| The date is   | Badge           |
| ------------- | --------------- |
| In the past   | "Past its date" |
| Today         | "Use today"     |
| 1 day or more | "2 days"        |

The head of the pantry counts the lines that are soon. The filter "Use soon" shows only them. The sequence "Use first" puts them at the top, in the groups "Use first", "Later", and "No date".

## What the recipes show

Here the first date of a food item counts. A recipe that [finds](match.md) the spinach gets the sticker "Uses Spinach". In the sequence "Best for the pantry", such a recipe comes before all others. Thus the spinach omelette is at the top on 11 October, and the plan proposes it.

## What Cook Mode does

At the end of a meal, the package with the first date gives its food first. The omelette takes its spinach from the kitchen fridge. With the same date, the open package gives before a sealed one, so the carton with 2 eggs is used before a new carton. A package with no date is the last to give.

## What the Shop part shows

A date that is near changes nothing on the list, because the meal uses the food. A date that is past is different. Food that a meal needs and that is [past its date](past-its-date.md) is a suggestion, so that you look at it before the day of the meal.

## Further reading

- [Recipes](recipes.md): the full rule for the sequence of the recipe list.
- [End of a meal](end-of-a-meal.md): all that the plugin writes when you finish a meal.
