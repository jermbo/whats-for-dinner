---
title: Pantry
summary: "How the plugin knows what you have: one note for each food item, one row for each package, one line for each place, and one level for each food."
parent: ../README.md
---

[Wiki](../README.md) / Pantry

# Pantry

The pantry is the center of the plugin. The plan, the shopping list, and the sequence of the recipes all start from it. This page tells how the pantry holds your food, and how it stays correct.

## The place is what you forget

You have rice in the kitchen and more rice downstairs. In the store, you think only of the kitchen, and you buy rice again. So the pantry does not keep one number for rice. It keeps one amount for each place.

## A food item is a note, and a package is a row

Each food is one note in the pantry folder: `Rice`, `Eggs`, `Elbow pasta`. This is a [food item](food-item-note.md). Its note has a table with one row for each package: a half jug of milk until 22 October, and a new jug until 29 October. Each row has its size, what is left, its place, and its [use-by date](use-soon.md). Food with no packages, such as apples, is loose: it has one row for each place.

You name the places before food is there. The [settings](settings.md) keep the list of names, so that add food and the filters show a place that has no row yet.

The pantry screen shows one line for each food item in each place, in a group for each place: eight cans of beans are one line, "112.5 oz · 8 packages". The badge of the line comes from the first date of its packages. You see what is in the outside fridge and you do not have to go there.

A tap on a line opens its packages: a count for the sealed packages of each date, with "−" and "+", and a [bar](amount-bar.md) for each open package, with "Used up". "Add package" adds a sealed package with the size of the last one. "Place, date, and low line" opens the form of one package, with its size. You find a food item by its name, by a different name of the food, or by the name of one of its [brands](brands.md). "brand c" finds taco seasoning.

The form also has the chip "Loose", which writes `loose: true` into the note at once. The form of a food item shows its brands: the photo of each package, small, and a chip for a brand with no photo. A tap on a brand shows it large, with its name, "New photo", and "Remove". "Add brand" opens the camera, and the photo is a new brand. "Save" writes the brands into the note, and "Cancel" writes nothing.

## The level tells you when to buy

All rows of a food item together make its [level](level.md): how much you have, against the most that you had. Below the low line, the food item is low, and its bar is amber.

A food item with no row, or with only empty rows, is out. It stays in view as a dashed line in the group "Out", so that you buy it again.

## The pantry does not assume

The plugin counts only what a row tells. Water is a food item too, with an amount such as "tap". A row with no number, such as "a full bag", is in the pantry, but the plugin cannot count it.

## Three ways in and out

Each of these writes the note of the food item, so the pantry stays correct:

- **You.** You add food, or you open a line and drag the bar of a package to what is really there.
- **A shopping trip.** In [Shopping](shopping.md), one button puts your cart into the pantry. The open row of a food item has "Add to the list", so the milk that you see is low gets on the list with one tap.
- **A meal.** At the end of [Cook Mode](cook-mode.md), the plugin takes the ingredients out.

## Further reading

- [Recipes](recipes.md): how the pantry decides which recipe comes first.
- [Notes of the kitchen](notes-of-the-kitchen.md): why each change goes through a note.
