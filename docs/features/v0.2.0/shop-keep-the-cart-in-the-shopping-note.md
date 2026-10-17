---
title: Keep the cart in the shopping note
summary: "The shopper taps a row, and the item is a task of the open note of the trip."
parent: shop-stories.md
updated: 2026-10-13
persona: Shopper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Keep the cart in the shopping note

# Keep the cart in the shopping note

As the [shopper](../../personas.md), I want each item that I tap to be a task of a note of the vault, so that the cart is the same on my phone and on my computer, and each trip has a note from its first item.

## Requirements

1. Tap a row of the list to put its item in the cart
   - a. With no note "Next trip" in the folder of the shopping notes, the plugin makes it
   - b. The note gets one task with a mark, with a link to the note of the item
   - c. The link has the path of the note, and the name of the item as its text
   - d. Food that the pantry does not know has a link into the pantry folder, to a note that does not exist
   - e. The new task comes after the last task of the note
2. The Shop part reads the open note
   - a. A task with a mark is an item of the cart
   - b. A task with no mark is a row of the list: a choice
   - c. A task with a link is the item of that link, and it is in the pantry when the link goes into the pantry folder
   - d. A task with no link is an item with its text as its name, and it is not in the pantry
   - e. A line that is not a task is your own text, and the plugin does not change it
   - f. A change of the note by hand shows in the Shop part with no restart
   - g. An item stays in the cart when no meal needs it any more
3. Tap a row of a choice to put it in the cart
   - a. Its task gets a mark
4. Tap "Undo" on an item of the cart to take it out of the cart
   - a. The task of a choice loses its mark
   - b. The task of a row of a meal goes out of the note
5. After put away, the open note has no task with a mark
   - a. A task with no mark stays
6. Set the folder of the shopping notes in the settings
   - a. The setting starts as `Shopping`
   - b. After a change of the folder, the kitchen reads the vault again
7. The data file of the plugin has no cart

## Acceptance criteria

Each criterion starts with the test vault, with the guacamole in the plan. So the list has two rows of a meal: "Avocados" with "2", and "Lime" with "1". The vault has no note in the folder `Shopping`.

For criterion 3, the test vault needs one more recipe in the plan, with an ingredient that the pantry does not know: "200 g quinoa".

1. GIVEN the vault has no note `Shopping/Next trip` WHEN the shopper taps the row "Lime" THEN the vault has the note `Shopping/Next trip`
   - a. AND the note has the line `- [x] [[Pantry/Lime|Lime]]`
   - b. AND the Shop part shows "Lime" in the cart
2. GIVEN "Lime" is in the cart WHEN the shopper taps the row "Avocados" THEN the last task of the note is `- [x] [[Pantry/Avocados|Avocados]]`
   - a. AND the note has 2 tasks
3. GIVEN the list has the row "Quinoa" WHEN the shopper taps the row "Quinoa" THEN the note has the line `- [x] [[Pantry/Quinoa|Quinoa]]`
   - a. AND the vault has no note `Pantry/Quinoa`
4. GIVEN the open note has only the line `- [x] [[Pantry/Lime|Lime]]` WHEN you add the line `- [x] [[Pantry/Milk|Milk]]` to the note by hand THEN the Shop part shows "Milk" in the cart
5. GIVEN the open note has the line `- [ ] [[Pantry/Milk|Milk]]` WHEN the shopper opens the Shop part THEN the list has the row "Milk"
   - a. AND "Milk" is not in the cart
6. GIVEN the open note has the line `- [ ] Batteries` WHEN the shopper opens the Shop part THEN the list has the row "Batteries"
7. GIVEN the open note has the line `- [ ] [[Pantry/Milk|Milk]]` WHEN the shopper taps the row "Milk" THEN the note has the line `- [x] [[Pantry/Milk|Milk]]`
   - a. AND the note has 1 task for milk
8. GIVEN the open note has the line `- [x] [[Pantry/Milk|Milk]]`, and no meal puts milk on the list WHEN the shopper taps "Undo" on "Milk" THEN the note has the line `- [ ] [[Pantry/Milk|Milk]]`
9. GIVEN "Lime" is in the cart, from a row of a meal WHEN the shopper taps "Undo" on "Lime" THEN the note has no task for lime
   - a. AND the list has the row "Lime" again
10. GIVEN the open note starts with the line "Mum comes on Friday." WHEN the shopper taps the row "Lime" THEN the note still starts with the line "Mum comes on Friday."
11. GIVEN "Avocados" is in the cart WHEN the planner takes the guacamole out of the plan THEN "Avocados" is still in the cart
12. GIVEN "Lime" is in the cart WHEN you restart Obsidian THEN "Lime" is in the cart
13. GIVEN the open note has the lines `- [x] [[Pantry/Lime|Lime]]` and `- [ ] Batteries` WHEN the keeper puts the cart away THEN the open note has no task with a mark
    - a. AND the open note has the line `- [ ] Batteries`
14. GIVEN the setting of the folder is `Lists` WHEN the shopper taps the row "Lime" THEN the vault has the note `Lists/Next trip`
15. GIVEN the open note is in `Shopping`, with "Lime" in the cart WHEN you change the setting of the folder to `Lists` THEN the cart is empty
16. GIVEN "Lime" is in the cart WHEN you open the data file of the plugin THEN the file has no cart

## Depends on

Nothing. This story can start now.

## Architecture

- [Shopping](../../architecture/shopping.md): how the list knows what to buy, and what a tap in the store does.
- [Shopping note](../../architecture/shopping-note.md): the form of the open note, and what the plugin changes in it.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): why each change goes through a note.
- [Put away](../../architecture/put-away.md): what goes into the pantry, and what goes out of the open note.
- [Settings](../../architecture/settings.md): the shopping folder.
