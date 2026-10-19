---
title: Match
summary: "How one ingredient of a recipe finds its food item in the pantry, and how the plugin decides if you have sufficient of it."
parent: recipes.md
---

[Wiki](../README.md) / [Recipes](recipes.md) / Match

# Match

The match is the comparison of one ingredient with the pantry. All that the plugin tells you about a recipe starts here: the count "7 of 9", the shopping list, and what Cook Mode takes out. This page tells how the match decides.

## A recipe and a pantry use different words

A recipe says "2 chicken thighs". The note of the food item has the name `Chicken thighs`. A different recipe says "pasta", and the pantry has elbow pasta and shell pasta. The match must find the food in each case.

## First the name, in three steps

1. The plugin makes the two names equal in form: small letters, no marks, and no plural. "Chicken thighs" and "chicken thigh" are the same name.
2. It looks for each food item with that name, or with that name as one of its other names. "Pasta" finds the two kinds of pasta.
3. If it finds more than one food item, it uses the one that has the most.

An ingredient can also be a link to a note, such as `[[Pantry/Rice|rice]]`. Then the name is the name of that note, and text after the link, such as ", cooked", is not a part of it.

With no link, the name stops at a comma or a parenthesis. "salt, to taste" is salt, and "onion (diced)" is onion. The rest is a note of the recipe, not a different food.

## Then the amount

The plugin compares the amount of the ingredient with all rows of the food item.

| The pantry has                                  | The ingredient is      |
| ----------------------------------------------- | ---------------------- |
| No food item, or a food item with no row        | Missing                |
| The amount, or more                             | In the pantry          |
| Less than the amount                            | Low                    |
| The food, but the plugin cannot count it        | In the pantry: "Check" |

A spoon of sugar against a bag in grams is a count: the [amounts](amounts.md) page has the rough rule that compares them. The plugin cannot count two cases. A recipe wants "1 onion", and the row is "500 g": a count against a mass. Or the recipe wants "1 l water", and the row is "tap": a row with no number. The food is there, so it counts in "7 of 9" and it is not on the list. But the recipe card and Get out show the sticker "Check" on the line, and the meal card of the plan says "1 to check". You see that this line is not a count, and you look at the shelf.

An ingredient with no amount, such as salt, is in the pantry when its food item has a row. The plugin does not assume that a food is there: only a row tells it.

## An example

The chicken curry wants 300 g of rice. The pantry has 500 g in the kitchen pantry and 2 kg in the downstairs pantry. The match adds the rows: 2.5 kg is more than 300 g, so rice is in the pantry.

## Further reading

- [Use soon](use-soon.md): how a match can move a recipe to the top of the list.
- [Shopping](shopping.md): what occurs with an ingredient that is missing or low.
