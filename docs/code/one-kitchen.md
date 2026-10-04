---
title: One kitchen
summary: 'How all screens and components read the menu, the recipes, the ingredients, and the pantry from one place.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Code](README.md) / One kitchen

# One kitchen

Four tables are in use on almost each screen: the menu, the recipes, the ingredients, and the pantry. Together they are the kitchen. The app reads them one time, and each file that needs them gets the same copy.

## The problem

A card of a meal must know if the pantry has its food. There are two bad ways to give it the kitchen:

- Each file that needs the kitchen reads it. Then one screen has three sets of the same four queries, and each change to the pantry does the work three times.
- The screen reads it and passes it down. Then a component in the middle gets a `kitchen` property that it does not use, only to pass it on.

## The mechanism

The root layout makes the kitchen one time and puts it in the context of the app. Context is a place where a layout puts a value, and each component below can read the value by name.

1. `+layout.svelte` calls `provideKitchen()`. This starts the four live queries.
2. A screen or a component calls `useKitchen()`. It gets the kitchen of the layout. No new query starts.
3. The kitchen also gives the maps that many files need: `recipesById`, `ingredientsById`, and `pantryByIngredient`.

## Why this is the one exception

The rule is that [a component gets its data as properties](screens-and-components.md). The kitchen is the exception, for one reason: it is the same on each screen. A property that is always the same value tells the reader nothing.

A component does not use context for other data. The open cook session and the selected row are properties.

## What is built on the kitchen

A state module that needs the kitchen calls `useKitchen()` too. `useSoon()` gives the food to use first. `useCookHistory()` gives the last cook of each recipe. Each is calculated in one place.

The shopping list is built on the kitchen, and the navigation shows its number on each screen. So the layout provides it in the same way: `provideShopping()`, and then `useShopping()`.

The [preferences](../settings/how-a-preference-works.md) are also the same on each screen. They have `providePreferences()` and `usePreferences()`.

## An example

The Today screen shows three meals. The navigation shows "Shop 4". The card of the tacos shows "7/9 in the pantry". All three need the pantry. You put the limes away: one query gives the new pantry, and the three places update from it.

## Further reading

- [The layers](layers.md): where the state modules are in the structure.
