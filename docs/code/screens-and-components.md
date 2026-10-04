---
title: Screens and components
summary: 'A screen gathers the data and connects the actions. A component shows what it gets. This page tells where the line between them is.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Code](README.md) / Screens and components

# Screens and components

Each page of the app has one screen file: its `+page.svelte`. The screen is the conductor. The components are the players.

## The problem

When a component starts its own query, you cannot see from the screen what the page reads, and two components can read the same table two times.

When a screen calculates, the opposite occurs: the rule of the kitchen is in a file that also has markup and styles, and no other screen can use it.

## What a screen does

A screen has three parts, in this sequence:

1. **Gather.** It calls the [state modules](layers.md) that the page needs: `useKitchen()`, `useToday()`. For one simple read, it calls `live()` with a read function of the data layer: `live(allTrips, [])`.
2. **Act.** It has one short function for each action of the page. The function calls the data layer, and then tells the result: a message, or a move to a different page.
3. **Lay out.** It puts the components in the columns of the page, and gives each one its data.

A screen does not calculate. A sort, a filter with a rule, or a sentence that depends on the data goes to the domain or to a state module.

## What a component does

A component never calls `live()`. It gets its data as properties, and it tells the screen what the owner did with a function property, such as `oncook`. It keeps only the state of its own view: which card is on top, which row is open.

A small component with one action of its own can call the data layer directly. The button for the number of packages calls `setPackages()`. A callback through three components for one tap is worse than one import.

## An example: Today

The Today screen calls `useToday()`. It gets the hand, the offers of the pantry, and the plan of the week. It has five actions: start, cooked, preparation done, add to the menu, and cook now. It puts `MealHand` in the main column and three panels in the side column.

The order of the hand is a rule: the meal that you cook now is first, then the ready meals. That rule is `handOrder()` in the domain. The screen does not know it.

## Further reading

- [One file, one job](one-file-one-job.md): what to do when a component grows.
