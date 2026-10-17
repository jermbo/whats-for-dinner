---
title: Add to the list from the Pantry
summary: "The keeper sees low food in the Pantry part and puts it on the list with one tap."
parent: shop-stories.md
updated: 2026-10-17
persona: Keeper
depends-on: [shop-add-an-item-of-your-own.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Add to the list from the Pantry

# Add to the list from the Pantry

As the [keeper](../../personas.md), I want to put a food item on the list from its row in the Pantry part, so that I do not go to the Shop part when I see that the milk is low.

## Requirements

1. The open row of a food item has "Add to the list"
   - a. The tap puts the food item on the list as an extra: a task with no mark in the open note
   - b. With no open note, the plugin makes it
2. A food item on the list shows "On the list" in place of the button
   - a. On the list means a row of the list, or an item of the cart
   - b. "On the list" is text, not a button

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17, after the clean-up of that day, with the setting "Low line" at 20 %. The plan has the boiled eggs, the open note has no task, and the data file has no skipped suggestion.

1. GIVEN the Pantry part is open WHEN the keeper opens the row of milk THEN it has "Add to the list"
2. GIVEN the row of milk is open WHEN the keeper taps "Add to the list" THEN the open note has the line `- [ ] [[Pantry/Milk|Milk]]`
   - a. AND the row shows "On the list"
   - b. AND the stage Shop has the row "Milk" with the sticker "Extra"
3. GIVEN the open note has the line `- [x] [[Pantry/Butter|Butter]]` WHEN the keeper opens the row of butter THEN it shows "On the list"

## Depends on

- [Add an item of your own](shop-add-an-item-of-your-own.md): the task of an extra in the open note.

## Architecture

- [Pantry](../../architecture/pantry.md): the open row of a food item.
- [Shopping note](../../architecture/shopping-note.md): the task that the button writes.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 44. It is a page of the initiative.
