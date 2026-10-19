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

Each food is one note in the pantry folder: `Rice`, `Eggs`, `Elbow pasta`. This is a [food item](food-item-note.md). Its note has a table with one row for each package: a half jug of milk until 22 October, and a new jug until 29 October. Each row has its size, what is left, its place, and its [use-by date](use-soon.md). Each row has a [level](level.md), such as 1/4, or a count, such as 4 of 12 eggs.

You name the places before food is there. The [settings](settings.md) keep the list of names, so that add food and the filters show a place that has no row yet.

The pantry screen shows one line for each food item in each place, in a group for each place. A line has the total of all places and the count of packages: eight cans of beans are one line, "3.2 kg · 8 packages". The badge of the line comes from the first date of its packages. You see what is in the outside fridge and you do not have to go there.

## One bar shows each package

Two gallons of milk must look like two gallons. So the bar of a line has one part for each package of the food item, in all places, and each part is as long as its package size. The fill of a part is its level, or its count against its size. A thin gap is between two parts.

The packages of the place of the group come first, and their fill is dark. The packages of other places are grey. So the line of milk in "Fridge" shows a jug at 1/4 and a full jug, dark, and the jug in the freezer, grey. In each place, the packages are in the sequence of use: the open package first, then the first use-by date. When the sizes have different units, such as 1 gal and 64 fl oz, the parts are the same length.

A metric total shows as on a label: 425 g, or 3.2 kg with one decimal from 1000 g. Other units show in quarters, such as "1 1/4 gal", and a count is a number, such as "16".

## A card corrects a food item

A tap on a line opens its [card](card.md): one large bar, in which you drag each package to what you see, and "+ Add package" for a new carton. "Done" writes the note. The card also opens the form of the food item, with its package size, its other names, its staple, and its [brands](brands.md).

"Add to pantry" asks only for a name. It finds a food item by its name, by a different name of the food, or by the name of one of its brands: "brand c" finds taco seasoning. A known food opens its card with a new package. A new food asks for its package size, with a unit chip, and for its place. Then it is a note with one full package, and its card opens.

Once a week, the [audit](audit.md) walks each place, and you confirm or correct each food item.

## The level tells you when to buy

A food item is low when one package is left, and it is at 1/4. Then its bar is amber.

A food item with no package is out. It stays in view as a dashed line in the group "Out", so that you buy it again.

## The pantry does not assume

The plugin counts only what a row tells. Water is a food item too, with the text "tap" in place of a level. Such a row is in the pantry, but the plugin cannot count it.

## Three ways in and out

Each of these writes the note of the food item, so the pantry stays correct:

- **You.** You add food, you open a line and drag a package to what is really there, or you check each place in the audit.
- **A shopping trip.** In [Shopping](shopping.md), one button puts your cart into the pantry. The open row of a food item has "Add to the list", so the milk that you see is low gets on the list with one tap.
- **A meal.** At the end of [Cook Mode](cook-mode.md), the plugin takes the ingredients out.

## Further reading

- [Recipes](recipes.md): how the pantry decides which recipe comes first.
- [Notes of the kitchen](notes-of-the-kitchen.md): why each change goes through a note.
