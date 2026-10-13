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

Some food you want always, plan or no plan. You label it as a [staple](staples.md), and the Shop part suggests it when it needs a look. One tap accepts a suggestion. Food of a meal that is [past its date](past-its-date.md) is a suggestion too.

Somebody asks you for batteries on a Tuesday. You type the name into the field "Add an item", and the item is on the list of the next trip. The field proposes the notes that the name finds.

A suggestion that you accepted and an item of your own are choices: items that are on the list because you put them there.

## A trip has one note

A trip is one visit to a store. It has one [shopping note](shopping-note.md), which the plugin makes with your first action. A task with no mark in that note is a choice. A task with a mark is an item of the cart.

The cart is in a note, because Obsidian moves a note from one device to the other. Thus the phone and the computer show the same cart.

## In the store, one tap

A tap on a row puts the item in the cart. A row shows the meals that need the item, and the brands that you buy. Thus you can take the brand that is on sale.

"Undo" puts an item back on the list. An item stays in the cart when its meal goes out of the plan. You took the item, so you put it away.

## At home, one screen

[Put away](put-away.md) shows each item of the cart with its facts: the amount, the place, the use-by date, and the price. The plugin proposes them, and you correct what is different. Then one button adds each item to its food item. For flour, the row "Kitchen pantry" goes from 200 g to 1000 g.

A food that the pantry does not know gets a new note. After the button, the cart is empty, and the list has only what you did not buy.

The shopping note becomes the [receipt](receipt.md) of that day, with the price of each item. A choice that you did not buy goes into the note of the next trip.

## Further reading

- [Recipes](recipes.md): how an ingredient finds its food item.
