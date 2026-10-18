---
title: Change a row
summary: "The keeper changes the place, the amount, the use-by date, or the low line of one row in a form."
parent: pantry-stories.md
updated: 2026-10-18
persona: Keeper
depends-on:
  [
    pantry-see-the-food-of-each-place.md,
    pantry-see-the-level.md,
    pantry-correct-an-amount.md,
  ]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Change a row

# Change a row

As the [keeper](../../personas.md), I want to change the place, the amount, the use-by date, and the low line of a row in a form, so that I can correct what a drag of the bar cannot correct.

## Requirements

1. Open the form of a row
   - a. The link "Place, date, and low line" of an open bar opens the form of the selected place
   - b. A tap on a line with an amount that the plugin cannot count opens the form directly
2. The form shows the row as it is
   - a. The place, the amount as text, and the use-by date of the row
   - b. The low line of the food item, as the text of the property `low`
   - c. With no `low`, the field is empty and shows the low line of the plugin as a hint
   - d. The brands of the food item, as [See the brands of a food item as photos](../v0.5.0/brands-see-the-brands-as-photos.md) shows them (changed in version 0.5.0), and its other names
3. Select a different place
   - a. One tap selects a place that the pantry has
   - b. A text field takes a place that is new
4. Tap "Save" to write the row into the food item note
   - a. The row has the place, the amount, and the use-by date of the form
   - b. The other rows of the food item do not change
   - c. The plugin writes `low` only when the low line changed
   - d. An empty low line takes `low` out of the note
   - e. The row closes
5. Tap "Used up" to take the row out of the table
6. Tap "Cancel" to close the form with no change
7. Tap "Open note" to open the food item note in a new tab

## Acceptance criteria

Each criterion starts with the test vault in the state in which it starts, and with the setting "Low line" at 25%. Rice has `low: 1 kg`, 500 g in "Kitchen pantry", and 2 kg in "Downstairs pantry" with the use-by date 2027-06-01.

1. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper taps "Place, date, and low line" THEN the form of the row "Kitchen pantry" shows
2. GIVEN water has the amount "tap" WHEN the keeper taps the line of water THEN the form of that row shows
3. GIVEN the pantry shows rice WHEN the keeper opens the form of rice in "Downstairs pantry" THEN the form has the place "Downstairs pantry"
   - a. AND the amount "2 kg"
   - b. AND the use-by date 2027-06-01
4. GIVEN the pantry shows rice WHEN the keeper opens the form of rice THEN the field "Low line" has "1 kg"
5. GIVEN elbow pasta has `full: 2 kg` and no `low` WHEN the keeper opens the form of elbow pasta THEN the field "Low line" is empty
   - a. AND it shows the hint "500 g"
6. GIVEN the pantry shows elbow pasta WHEN the keeper opens the form of elbow pasta THEN the form shows the chips "Brand A" and "Store brand"
   - a. AND "Other names: pasta, macaroni"
7. GIVEN the form of rice in "Kitchen pantry" is open WHEN the keeper sets the use-by date to 2026-12-31 and taps "Save" THEN the row "Kitchen pantry" of the note has the date 2026-12-31
   - a. AND the row "Downstairs pantry" is the same as before
   - b. AND rice in "Kitchen pantry" shows as a line again
8. GIVEN the form of rice in "Kitchen pantry" is open WHEN the keeper sets the amount to "1 bag" and taps "Save" THEN the row "Kitchen pantry" of the note has "1 bag"
9. GIVEN the form of rice in "Kitchen pantry" is open WHEN the keeper taps the place "Freezer" and taps "Save" THEN the row of the note has the place "Freezer"
10. GIVEN the form of rice in "Kitchen pantry" is open WHEN the keeper types the new place "Garage" and taps "Save" THEN the row of the note has the place "Garage"
11. GIVEN the form of rice is open WHEN the keeper sets the low line to "3 kg" and taps "Save" THEN the note has `low: 3 kg`
12. GIVEN the form of rice is open WHEN the keeper makes the low line empty and taps "Save" THEN the note has no `low`
13. GIVEN the form of water is open WHEN the keeper taps "Used up" THEN the note of water has no row
14. GIVEN the form of rice in "Kitchen pantry" is open WHEN the keeper sets the amount to "9 kg" and taps "Cancel" THEN the row "Kitchen pantry" of the note has "500 g"
15. GIVEN the form of rice is open WHEN the keeper taps "Open note" THEN Obsidian opens the note "Pantry/Rice.md" in a new tab

## Depends on

- [See the food of each place](pantry-see-the-food-of-each-place.md): the lines that open.
- [See the level of a food item](pantry-see-the-level.md): the low line that this form sets.
- [Correct an amount with the bar](pantry-correct-an-amount.md): the bar that has the link to this form.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the table and the property `low` that this story writes.
- [Level](../../architecture/level.md): what the low line does.
