---
title: Pantry
summary: 'How the plugin knows what you have: one note for each food item, one row for each place, and one level for each food.'
parent: ../README.md
updated: 2026-10-11
---

[Wiki](../README.md) / Pantry

# Pantry

The pantry is the center of the plugin. The plan, the shopping list, and the sequence of the recipes all start from it. This page tells how the pantry holds your food, and how it stays correct.

## The place is what you forget

You have rice in the kitchen and more rice downstairs. In the store, you think only of the kitchen, and you buy rice again. So the pantry does not keep one number for rice. It keeps one amount for each place.

## A food item is a note, and a place is a row

Each food is one note in the pantry folder: `Rice`, `Eggs`, `Elbow pasta`. This is a [food item](food-item-note.md). Its note has a table with one row for each place: 500 g in the kitchen pantry, and 2 kg in the downstairs pantry. A row can have a [use-by date](use-soon.md).

The pantry screen shows one line for each row, in a group for each place. You see what is in the outside fridge and you do not have to go there. You find a food item by its name, by a different name of the food, or by a brand.

## The level tells you when to buy

All rows of a food item together make its [level](level.md): how much you have, against the most that you had. Below the low line, the food item is low, and its bar is amber.

A food item with no row is out. It stays in view as a dashed line, so that you buy it again.

## The pantry does not assume

The plugin counts only what a row tells. Water is a food item too, with an amount such as "tap". A row with no number, such as "a full bag", is in the pantry, but the plugin cannot count it.

## Three ways in and out

Each of these writes the note of the food item, so the pantry stays correct:

- **You.** You add food, or you open a row and drag its [bar](amount-bar.md) to what is really there.
- **A shopping trip.** In [Shopping](shopping.md), one action puts your cart into the pantry.
- **A meal.** At the end of [Cook Mode](cook-mode.md), the plugin takes the ingredients out.

## Further reading

- [Recipes](recipes.md): how the pantry decides which recipe comes first.
- [Notes of the kitchen](notes-of-the-kitchen.md): why each change goes through a note.
