---
title: Recipes
summary: "How a note becomes a recipe, how each ingredient finds its food, and why the pantry decides which recipe comes first."
parent: ../README.md
---

[Wiki](../README.md) / Recipes

# Recipes

A recipe viewer shows your recipes by name. This plugin shows them by what you can cook now. This page tells how a recipe gets into the list, and how it gets its position there.

## A recipe is a note in a public format

A recipe is a plain note in the [RecipeMD](https://recipemd.org/specification.html) format: a title, a description, tags, the yield, the ingredients, and the instructions. The amount of an ingredient is in italics:

```markdown
- _500 g_ chicken thighs
- _1 can_ coconut milk
- salt
```

The format does not come from the plugin, so your recipes do not depend on it. The [recipe note](recipe-note.md) page gives its exact form. A note that does not follow the format is not lost. The end of the list shows it, with the reason.

## Each ingredient looks for its food

The plugin compares each ingredient with the [pantry](pantry.md). This comparison is the [match](match.md). First the name of the ingredient finds a food item. Then the amounts decide: the ingredient is in the pantry, it is low, or it is missing.

The result is one count for the recipe: "7 of 9 in the pantry".

## The pantry gives the sequence

The list starts in the sequence "Best for the pantry".

1. The recipes that use food that you must [use soon](use-soon.md) come first.
2. Then come the recipes with the largest part of their ingredients in the pantry.
3. Recipes that are equal are in the sequence of their names.

Thus the spinach that spoils on Tuesday moves the spinach omelette to the top, before it is waste.

You can select a different sequence, such as by rating. A filter shows only the recipes that you can cook now, or one type. The type of a recipe is its first tag, such as "dinner".

## What the plugin adds to a recipe note

The plugin does not change your recipe. It adds two things after a meal: your rating, as a property, and a record of the meal at the end of the note. [Cook Mode](cook-mode.md) writes them.

A recipe can also tell its [preparation](preparation.md): the work that it needs before the day of the meal.

## Further reading

- [Plan](plan.md): how a recipe becomes a meal of the week.
- [Notes of the kitchen](notes-of-the-kitchen.md): how the plugin finds the notes that are recipes.
