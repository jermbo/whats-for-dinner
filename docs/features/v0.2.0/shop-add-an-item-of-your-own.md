---
title: Add an item of your own
summary: "The planner adds an item to the list on any day, as a link to the note of that item."
parent: shop-stories.md
updated: 2026-10-13
persona: Planner
depends-on: [shop-keep-the-cart-in-the-shopping-note.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Add an item of your own

# Add an item of your own

As the [planner](../../personas.md), I want to add an item of my own to the list on any day, so that a thing that I must not forget is on the list of the next trip.

## Requirements

1. The Shop part has the field "Add an item"
2. Type a name, and the field proposes the notes that the name finds
   - a. The food items of the pantry, by their name and their other names
   - b. The notes of the folder for items
   - c. Capital and small letters are the same
3. Tap a proposal to add that item to the list
   - a. The open note gets a task with no mark, with the link of that note
   - b. With no open note, the plugin makes it
   - c. The field is empty again
4. Tap "Add as new" to add an item that no note has
   - a. The task has a link into the folder for items, with the name that you typed and a capital first letter
   - b. The plugin makes no note for the item
   - c. "Add as new" is active only when the field has text
5. The list shows the item as a row with no amount
   - a. An item that is a task of the open note is not added a second time
6. Tap "Remove" on the row to take the item off the list
   - a. Its task goes out of the open note
7. Put away of an item that is not in the pantry does not change the pantry
   - a. The plugin makes no food item note for it
8. Set the folder for items in the settings
   - a. The setting starts as `Shopping/Items`

## Acceptance criteria

Each criterion starts with the test vault, with no open note and no note in the folder `Shopping/Items`.

1. GIVEN the field "Add an item" is empty WHEN the planner types "egg" THEN the field proposes "Eggs"
2. GIVEN the field is empty WHEN the planner types "pasta" THEN the field proposes "Elbow pasta" and "Shell pasta"
3. GIVEN the field is empty WHEN the planner types "EGG" THEN the field proposes "Eggs"
4. GIVEN the field proposes "Eggs" WHEN the planner taps "Eggs" THEN the note `Shopping/Next trip` has the line `- [ ] [[Pantry/Eggs|Eggs]]`
   - a. AND the list has the row "Eggs" with no amount
   - b. AND the field is empty
5. GIVEN the planner typed "batteries" WHEN the planner taps "Add as new" THEN the open note has the line `- [ ] [[Shopping/Items/Batteries|Batteries]]`
   - a. AND the vault has no note `Shopping/Items/Batteries`
   - b. AND the list has the row "Batteries" with no amount
6. GIVEN the field is empty WHEN the planner looks at "Add as new" THEN "Add as new" is not active
7. GIVEN the vault has the note `Shopping/Items/Batteries` WHEN the planner types "bat" THEN the field proposes "Batteries"
8. GIVEN the open note has a task for eggs WHEN the planner adds "Eggs" again THEN the open note has 1 task for eggs
9. GIVEN the list has the row "Batteries" WHEN the planner taps "Remove" on the row THEN the open note has no task for batteries
   - a. AND the list has no row "Batteries"
10. GIVEN "Batteries" is in the cart WHEN the keeper puts the cart away THEN the vault has no note `Pantry/Batteries`
    - a. AND the vault has no note `Shopping/Items/Batteries`
11. GIVEN the setting of the folder for items is `Things` WHEN the planner adds "batteries" as new THEN the open note has the line `- [ ] [[Things/Batteries|Batteries]]`

## Depends on

- [Keep the cart in the shopping note](shop-keep-the-cart-in-the-shopping-note.md): the open note, and the task with no mark that is a row of the list.

## Architecture

- [Shopping](../../architecture/shopping.md): what the list has, and where a choice is.
- [Settings](../../architecture/settings.md): the folders of the plugin.
- [Shopping note](../../architecture/shopping-note.md): the form of a task and of its link.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decisions 15 and 20 to 22. It is a page of the initiative.
