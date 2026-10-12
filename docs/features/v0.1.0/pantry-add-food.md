---
title: Add food
summary: "The keeper records a food with its amount, its place, and its use-by date."
parent: pantry-stories.md
persona: Keeper
depends-on: [pantry-see-the-food-of-each-place.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Add food

# Add food

As the [keeper](../../personas.md), I want to record a food with its amount, its place, and its use-by date, so that the pantry knows what I have and where it is.

## Requirements

1. Tap the plus button to open the form "Add to pantry"
   - a. The name field has the focus
   - b. A second tap on the plus button closes the form
2. Type the name of the food
   - a. The field proposes the names of the food items of the pantry
3. Select the place of the food
   - a. One tap selects a place that the pantry has
   - b. A text field takes a place that is new
   - c. A new place that has text counts, and not the place of the tap
4. Type the amount and the use-by date
   - a. The use-by date is optional
5. Tap "Save" to write the food into the pantry
   - a. "Save" is active only when the form has a name and a place
   - b. The name finds a food item of the pantry, with no difference between capital and small letters, or between singular and plural
   - c. For a food item that the pantry has, the amount goes into the row of that place, if the two have the same use-by date and units that compare
   - d. If not, the amount is a new row
   - e. A food that is new gets a note in the pantry folder, with its name and a capital first letter
   - f. The form closes
6. Tap "Cancel" to close the form with no change

## Acceptance criteria

Each criterion starts with the rice of the test vault: 500 g in "Kitchen pantry" with no date, and 2 kg in "Downstairs pantry" with the use-by date 2027-06-01.

1. GIVEN the part "Pantry" is open WHEN the keeper taps the plus button THEN the form "Add to pantry" shows
   - a. AND the name field has the focus
2. GIVEN the form "Add to pantry" is open WHEN the keeper taps the plus button THEN the form closes
3. GIVEN the form "Add to pantry" is open WHEN the keeper types "Ric" in the name field THEN the field proposes "Rice"
4. GIVEN the form "Add to pantry" is open with no place WHEN the keeper types the name "Rice" THEN "Save" is not active
5. GIVEN the form has the name "Rice" WHEN the keeper taps the place "Kitchen pantry" THEN "Save" is active
6. GIVEN the form "Add to pantry" is open WHEN the keeper saves "Rice", "Kitchen pantry", and "500 g" with no date THEN the row "Kitchen pantry" of the note "Rice" has "1000 g"
   - a. AND the note has 2 rows
   - b. AND the form closes
7. GIVEN the form "Add to pantry" is open WHEN the keeper saves "rices", "Kitchen pantry", and "500 g" THEN the row "Kitchen pantry" of the note "Rice" has "1000 g"
8. GIVEN the form "Add to pantry" is open WHEN the keeper saves "Rice", "Kitchen pantry", "1 kg", and the date 2027-01-01 THEN the note "Rice" has a new row "Kitchen pantry" with "1 kg" and that date
9. GIVEN the form "Add to pantry" is open WHEN the keeper saves "Rice", "Kitchen pantry", and "1 bag" THEN the note "Rice" has a new row "Kitchen pantry" with "1 bag"
10. GIVEN the pantry has no honey WHEN the keeper saves "honey", the new place "Cellar", and "1 jar" THEN the vault has the note "Pantry/Honey.md"
    - a. AND the pantry shows the group "Cellar"
11. GIVEN the form has the place "Kitchen pantry" of a tap WHEN the keeper types the new place "Cellar" and saves THEN the row has the place "Cellar"
12. GIVEN the form has a name, a place, and an amount WHEN the keeper taps "Cancel" THEN the form closes
    - a. AND no note of the vault changes

## Depends on

- [See the food of each place](pantry-see-the-food-of-each-place.md): the screen that shows the new row.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the note that this story writes.
- [Amounts](../../architecture/amounts.md): the forms of an amount, and the unit of a row after a sum.
