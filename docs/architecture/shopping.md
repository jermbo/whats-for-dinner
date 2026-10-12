---
title: Shopping
summary: 'How the list knows what is missing: the plan minus the pantry, plus the low food if you want it.'
parent: ../README.md
updated: 2026-10-11
---

[Wiki](../README.md) / Shopping

# Shopping

With no list, you buy what you have and you forget what you need. This page tells how the plugin makes a list of the missing items only, and how the shopping trip gets into the pantry.

## The list is the plan minus the pantry

The plugin takes each ingredient of each meal of the [plan](plan.md) that you did not cook. It adds the amounts for each food item. Then it takes off what the [pantry](pantry.md) has. If an amount is left, it is a row of the list.

One meal needs 1 onion and a second meal needs 2. The pantry has 1 onion. The list has one row: "Onion, 2".

The plugin adds and compares [amounts](amounts.md) only if their units compare. The pantry can have the food in a different unit, such as "1 bag" for an ingredient of 20 g. Then the plugin does not ask for more.

## Low food is your choice

The chip "[Low food](low-food.md)" puts more on the list: each food item that is below its [low line](level.md), and each food item that is out. The amount is what makes the food item full again. If the meals need more than that, the larger amount stays.

Flour has 200 g, and its full amount is 1 kg. The list gets "Flour, 800 g". Thus you buy flour before a recipe needs it.

## In the store, one tap

A tap on a row puts the item in the cart. A row shows the meals that need the item, and the brands that you buy. Thus you can take the brand that is on sale.

The cart is not a note. It is in the [data file](notes-of-the-kitchen.md) of the plugin, because it is not a fact of the kitchen.

## At home, one action

"Put into the pantry" is the action [put away](put-away.md). It adds each item of the cart to its food item. The amount goes to the place where that food item is now. For flour, the row "Kitchen pantry" goes from 200 g to 1000 g.

A food that the pantry does not know gets a new note, in the place for new food of the settings. After this action, the cart is empty, and the list has only what you did not buy.

## Further reading

- [Recipes](recipes.md): how an ingredient finds its food item.
