---
title: Shopping
summary: "How the list knows what to buy: the plan minus the pantry, and your choices in the note of the trip."
parent: ../README.md
---

[Wiki](../README.md) / Shopping

# Shopping

With no list, you buy what you have and you forget what you need. This page tells how the plugin makes a list of the missing items only, where it keeps the cart, and how the shopping trip gets into the pantry.

## The list is the plan minus the pantry

The plugin takes each ingredient of each meal of the [plan](plan.md) that you did not cook. It adds the amounts for each food item. Then it takes off what the [pantry](pantry.md) has. If an amount is left, it is a row of the list.

One meal needs 1 onion and a second meal needs 2. The pantry has 1 onion. The list has one row: "Onion, 2".

The plugin adds and compares [amounts](amounts.md) only if their units compare. The pantry can have the food in a different unit, such as "1 bag" for an ingredient of 20 g. Then the plugin does not ask for more.

## Your choices are on the list too

Some food you want always, plan or no plan. You label it as a [staple](staples.md), and the Shop part suggests it when it needs a look. One tap accepts a suggestion.

Somebody asks you for batteries on a Tuesday. You type the name into the field "Add an item", and the item is on the list of the next trip. The field proposes the notes that the name finds.

A suggestion that you accepted and an item of your own are choices: items that are on the list because you put them there.

## A trip has one note

A trip is one visit to a store. It has one [shopping note](shopping-note.md), which the plugin makes with your first action. A task with no mark in that note is a choice. A task with a mark is an item of the cart.

The cart is in a note, because Obsidian moves a note from one device to the other. Thus the phone and the computer show the same cart.

## In the store, one tap

A tap on a row puts the item in the cart. A row shows the meals that need the item, and the brands that you buy. Thus you can take the brand that is on sale.

"Undo" puts an item back on the list. An item stays in the cart when its meal goes out of the plan. You took the item, so you put it away.

## At home, one action

"Put into the pantry" is the action [put away](put-away.md). It adds each item of the cart to its food item. The amount goes to the place where that food item is now. For flour, the row "Kitchen pantry" goes from 200 g to 1000 g.

A food that the pantry does not know gets a new note, in the place for new food of the settings. After this action, the cart is empty, and the list has only what you did not buy.

The shopping note becomes the [receipt](receipt.md) of that day. A choice that you did not buy goes into the note of the next trip.

## Further reading

- [Recipes](recipes.md): how an ingredient finds its food item.
