---
title: See the food that is out
summary: "The keeper still sees a food item that has no row, and can add it again with one tap."
parent: pantry-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: [pantry-see-the-food-of-each-place.md, pantry-add-food.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / See the food that is out

# See the food that is out

As the [keeper](../../personas.md), I want a food item with no row to stay in view and to open with one tap, so that I do not forget to buy it, and can put it back when I have it.

## Requirements

1. A food item with no row shows in the group "Out". Changed in version 0.5.0: also a food item with only empty rows, as [Keep one row for each package](../v0.5.0/packages-keep-one-row-for-each-package.md) tells
   - a. Its line is dashed, and it shows "None" in the place of an amount
   - b. The lines are in the sequence of their names
   - c. The head of the group shows the number of its lines
   - d. The group is below the groups of the places
2. The head of the pantry shows the number of food items that are out
3. Tap a line of the group to add the food again
   - a. The form has the name of the food item as its title, and no name field
   - b. The form has the place, the amount, the use-by date, and the low line
   - c. "Save" adds the row to the food item note
   - d. The food item goes out of the group "Out"

## Acceptance criteria

Each criterion starts with the test vault in the state in which it starts. Milk and taco seasoning have no row.

1. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the group "Out" shows the lines "Milk" and "Taco seasoning", in this sequence
   - a. AND the head of the group shows 2
2. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the line of milk shows "None"
3. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the group "Out" is below the group "Outside fridge"
4. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the head of the pantry shows "2 out"
5. GIVEN water has one row WHEN the keeper uses up that row THEN the group "Out" shows the line "Water"
6. GIVEN the group "Out" shows milk WHEN the keeper taps the line of milk THEN a form with the title "Milk" shows
   - a. AND the form has no name field
7. GIVEN the form of milk is open WHEN the keeper taps "Kitchen fridge", types "1 l", and taps "Save" THEN the note of milk has the row "Kitchen fridge" with "1 l"
   - a. AND the group "Out" does not show milk
   - b. AND the head of the pantry shows "1 out"

## Depends on

- [See the food of each place](pantry-see-the-food-of-each-place.md): the groups of the pantry.
- [Add food](pantry-add-food.md): the rules that put a row into a food item note.

## Architecture

- [Pantry](../../architecture/pantry.md): why a food item that is out stays a note.
- [Staples](../../architecture/staples.md): how food that is out gets on the shopping list.
