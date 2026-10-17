---
title: "Spec: shopping list"
summary: "The scope that is agreed for the shopping list: a note for each trip, items of your own, staples as suggestions, and a put away that makes a receipt."
parent: decision-log.md
status: agreed
---

[Wiki](../../README.md) / [Decision log: shopping list](decision-log.md) / Spec: shopping list

# Spec: shopping list

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

The planner makes the list at a calm moment of the week. The list has only the food that the meals need, so the bread and the batteries are only in the head of the planner. At home, the keeper puts the food away with one button. That button records no price, so nothing tells what an item cost.

## The solution

The planner adds an item on any day, and accepts the staples that the plugin suggests. The shopper marks each item in the note of the trip. The keeper gives the facts of each item, and the note becomes the receipt.

An example: eggs are a staple of the kind "Often". The planner accepts them. The keeper puts 12 eggs away in the outside fridge, for 3.49, on sale. The pantry has 18 eggs, and the receipt of that day has the row of the eggs.

## In scope

1. A trip has one shopping note, from its first action to its receipt (decisions 2, 10, and 14)
   - a. The first action makes the open note, which has a fixed name (decisions 14 and 16)
   - b. One trip is open at a time (decision 14)
   - c. The open note is a list of tasks: a task with no mark is "to buy", and a task with a mark is "in the cart" (decision 25)
   - d. Each task is a link to the note of its item, with the path of the note and the name of the item (decision 20)
   - e. Before the store, the open note has only the choices. A row of a meal gets its task when you put it in the cart (decision 12)
   - f. The cart is in the open note, and not in the data file (decision 25 c)
2. The planner adds an item of their own to the list on any day (decision 15)
   - a. The planner selects the note of the item from the notes that the plugin shows, or adds the item as new (decision 20 a)
   - b. An item that is not in the pantry is a link with no note, into the folder for items (decision 21)
   - c. A task with no link is an item of your own (not confirmed)
3. The keeper labels a food item as a staple, and selects its kind (decisions 3 and 5)
   - a. The kinds are "Often", "Sometimes" with 21 days, and "Seldom" with 60 days (decision 6 a; the 21 days are not confirmed)
4. The Shop part shows the suggestions (decisions 3, 4, and 6)
   - a. A staple is a suggestion when it is low, it is out, its use-by date is near, or the time of its kind is over (decision 6)
   - b. A suggestion shows its reason, the amount in the pantry, the purchase date, and the use-by date (decisions 4 and 6 b)
   - c. The planner accepts a suggestion, and it is a choice of the open note (decision 3)
   - d. The planner skips a suggestion, and it is gone until the trip ends (not confirmed)
   - e. The check box "Low food on the list" is gone (decision 7)
   - f. Food that a meal needs is a suggestion when its row is past its use-by date (decision 8)
5. The screen of put away shows each item of the cart with its facts (decisions 11 and 17)
   - a. The facts are the amount, the place, the use-by date, the price, and the mark "on sale" (decision 11)
   - b. The plugin proposes the amount, the place, and the days until the use-by date of the last receipt of the item (decision 32, and not confirmed)
   - c. The plugin proposes the price of the newest receipt on which the item was not on sale (decisions 13 b and 30)
   - d. The screen opens with each fact filled in, and the keeper only checks it (decision 28)
   - e. The keeper marks a sale with one tap on the chip "Sale" of the line, and types the price of the sale (decision 31)
   - f. The screen tells how many prices are missing, and no empty fact stops the button (decision 19)
   - g. The keeper takes an item out of the cart (not confirmed)
   - h. The keeper selects the store of the trip, or types a new one (decision 23)
   - i. An item that is not in the pantry has only a price. One tap puts it into the pantry (decision 21 b)
6. The button of put away ends the trip, in one step (decision 17)
   - a. The amount adds to the row of the place in the food item note, with the use-by date (decision 11 a and b)
   - b. The food item note gets the purchase date (decisions 9 and 11)
   - c. The open note becomes the receipt: a table with one row for each item, the day, and the store. Its name is the day (decisions 16 and 25)
   - d. A choice that the keeper did not buy goes into the note of the next trip (decision 18)
7. The plugin makes each note in a folder that a setting names (decision 22)
   - a. The settings get a folder for the shopping notes, and a folder for the items that are not in the pantry (decision 22 a)
8. The Shop part has three stages: "Extras", "Shop", and "Put away" (decision 33)
   - a. A strip at the top opens each stage, and shows its count (decision 33 a and b)
   - b. The stage Extras has the suggestions, the field "Add an item", and a line for the meals (decision 34)
   - c. The word "extra" replaces "choice" (decision 35)
   - d. A low staple that a meal needs is on the list with no action, and food that a meal puts on the list is not a suggestion (decision 36)
   - e. The stage Shop has a box to tick on each row, and the cart as one closed line (decision 37)
   - f. The Shop part opens on the stage that has work (decision 38)

## Out of scope

1. A note for each week, and a setting for the first day of a week (decision 2)
2. A button "New trip" (decision 14)
3. A shopping note with the full list (decisions 1 and 12)
4. A list of purchases in the food item note (decision 13)
5. A kind that the plugin learns, or that comes from the use-by date (decision 5)
6. Food past its date that does not count as food in the pantry (decision 8)
7. A note that the plugin makes for an item that is not in the pantry (decision 21)
8. A price that the button needs (decision 19)
9. A put away of one part of the cart (decision 17 a)
10. A brand on a row of a receipt, a photo of an item, a package size, and a barcode (decision 24)
11. A list in groups by store (decision 23 a)
12. A view of the prices over time
13. The first fill of the pantry, and the setup of a vault (decision 27)
14. A reader of the paper receipt, and AI of any kind (decision 29)

## What changes in the system

Architecture pages that change:

- [Shopping](../../architecture/shopping.md): the sources of the list, the cart, and the trip.
- [Put away](../../architecture/put-away.md): the screen, the facts, and the end of the trip.
- [Low food](../../architecture/staples.md): the staples and the suggestions replace the check box.
- [Food item note](../../architecture/food-item-note.md): the properties `staple` and `bought`.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): a fourth kind of note, and a data file with no cart.
- [Settings](../../architecture/settings.md): two folders.
- The wiki [glossary](../../glossary.md), the [features](../../features/README.md) page, and the [roadmap](../../features/roadmap.md).

A page that is new: the form of the shopping note, from the page [shopping note](shopping-note.md) of this initiative.

Notes and data that get a different form:

- **The food item note** gets two properties: `staple`, with the value `often`, `sometimes`, or `seldom`, and `bought`, with a date.
- **The shopping note** is new: the open note "Next trip", and one receipt for each trip.
- **The data file** has no cart, and no choice for the low food. It gets the suggestions that you skipped (not confirmed).

## How you test it

Checks that need the phone:

1. A tap on a row in the store puts a task into the open note, and the computer shows that item in the cart after Obsidian Sync moved the note.
2. The screen of put away is usable with one hand, with 20 items in the cart.
3. A click on the link of an item with no note makes the note in the folder for items. This is the assumption of decision 21 a.
4. A food item note gets a new name in Obsidian, and each receipt still links to it.

Rules that are worth an automatic test, each with the place where a test sees the behaviour from outside:

1. **The suggestions.** Food item notes, the meals of the plan, and a day go in. The suggestions come out, each with its reason.
2. **The open note.** The text of the note goes in. The cart and the choices come out.
3. **The end of a trip.** The text of the open note and the facts of each item go in. The text of the receipt and of the new open note come out.
4. **The last receipt.** The texts of the receipts go in. The regular price, the last amount, place, and days of an item come out.
5. **The pantry.** The text of a food item note and one purchase go in. The new text of the note comes out, with the row and the property `bought`.

## Further reading

- [Shopping note](shopping-note.md): the exact form of the open note and of the receipt.
- [Glossary: shopping list](glossary.md): the words of this page.
