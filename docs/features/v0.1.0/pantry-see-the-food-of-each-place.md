---
title: See the food of each place
summary: "The keeper sees each food in the group of its place, with its amount."
parent: pantry-stories.md
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / See the food of each place

# See the food of each place

As the [keeper](../../personas.md), I want to see my food in a group for each place, so that I know what is in a place and do not have to go there.

## Requirements

1. The pantry shows one line for each row of each food item
   - a. A food item is a note in the pantry folder
   - b. A line shows the name of the food item and the amount of its row
   - c. An amount with no number shows as its text
2. The lines are in one group for each place
   - a. The groups are in the sequence A to Z
   - b. The head of a group shows the number of its lines
   - c. In a group, the line with the first use-by date is at the top
   - d. The lines with no date come last, in the sequence of their names
3. A food item in 2 or more places shows its total on each of its lines
   - a. The text is the total and the number of places
4. The pantry follows the notes of the vault
   - a. A change of a food item note shows with no action of the keeper
5. A pantry with no food item tells how to start
   - a. The text is "The pantry is empty. Add your first food with the plus button."

## Acceptance criteria

Each criterion starts with the test vault in the state in which it starts.

1. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the pantry shows the groups "Downstairs pantry", "Freezer", "Kitchen", "Kitchen fridge", "Kitchen pantry", and "Outside fridge", in this sequence
2. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the head of the group "Outside fridge" shows 3
   - a. AND its lines are chicken thighs, spinach, and eggs, in this sequence
3. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the line of rice in "Kitchen pantry" shows "500 g"
   - a. AND the text "2.5 kg in 2 places"
4. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the line of flour shows no total
5. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the line of water shows "tap"
6. GIVEN the part "Pantry" is open WHEN the amount of rice in "Kitchen pantry" changes to "400 g" in the note THEN the line of rice in "Kitchen pantry" shows "400 g"
   - a. AND the text "2.4 kg in 2 places"
7. GIVEN a pantry folder with no note WHEN the keeper opens the part "Pantry" THEN the pantry shows "The pantry is empty. Add your first food with the plus button."

## Depends on

No other story.

## Architecture

- [Pantry](../../architecture/pantry.md): why the pantry keeps one amount for each place.
- [Food item note](../../architecture/food-item-note.md): the note and the table that the lines come from.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): how a change of a note gets to the screen.
