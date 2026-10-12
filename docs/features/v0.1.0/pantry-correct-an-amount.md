---
title: Correct an amount with the bar
summary: 'The keeper drags the bar of a row to the amount that is really there.'
parent: pantry-stories.md
persona: Keeper
depends-on: [pantry-see-the-level.md]
status: built
updated: 2026-10-11
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Correct an amount with the bar

# Correct an amount with the bar

As the [keeper](../../personas.md), I want to drag the bar of a row to the amount that is really there, so that a correction is one move and needs no keyboard.

## Requirements

1. Tap a line to open the bar of its food item
   - a. Only for a row with an amount that the plugin can count
2. The bar has one piece for each place of the food item
   - a. The length of a piece is its amount divided by the full amount
   - b. The place of the line that you tapped is the selected place
3. Tap an option to select a different place
   - a. The options show only when the food item is in 2 or more places
4. Press or drag on the bar to set the amount of the selected place
   - a. The amount is the point of the press, less the amounts of the other places
   - b. The amounts of the other places do not change
   - c. The amount is not less than 0
   - d. The amount is not more than the maximum: the full amount, less the amounts of the other places
5. The amount snaps to a step
   - a. The step is the smallest of 1, 2, 2.5, or 5, multiplied by a power of 10, that is not less than 1/20 of the full amount
   - b. For a count of things, such as eggs, the step is not less than 1
   - c. For a count with a full amount of less than 4, the step is not less than 0.5
   - d. The amount goes to the nearest step, and the middle of two steps goes up
   - e. An amount of less than half a step below the maximum becomes the maximum
6. The bar shows the amount of the selected place
   - a. In the unit of its row, with 2 decimals at most
   - b. As "None" when the amount is 0
   - c. In amber while all places together are below the low line
7. Tap "Done" to write the new amounts into the food item note
   - a. A changed row keeps its place and its use-by date
   - b. A row with no change stays as it was
   - c. A row with an amount of 0 goes out of the table
   - d. With no change, the plugin does not write the note
   - e. The row closes
8. Tap "Used up" to set the selected place to 0 and write the note
9. On a phone, a drag on the bar does not move Obsidian
   - a. A drag to the side does not open a side panel
   - b. A drag up or down scrolls the page

## Acceptance criteria

Each criterion starts with the rice of the test vault: a full amount of 5 kg, a low line of 1 kg, 500 g in "Kitchen pantry", and 2 kg in "Downstairs pantry" with the use-by date 2027-06-01.

1. GIVEN the pantry shows rice WHEN the keeper taps the line of rice in "Kitchen pantry" THEN the row shows the bar of rice
2. GIVEN rice is in 2 places WHEN the keeper opens the bar of rice THEN the bar has 2 pieces
   - a. AND the piece of "Kitchen pantry" is 10% of the bar
   - b. AND the piece of "Downstairs pantry" is 40% of the bar
3. GIVEN the pantry shows rice WHEN the keeper taps the line of rice in "Downstairs pantry" THEN the selected place is "Downstairs pantry"
4. GIVEN rice is in 2 places WHEN the keeper opens the bar of rice THEN the bar shows 2 options
5. GIVEN flour is in 1 place WHEN the keeper opens the bar of flour THEN the bar shows no option
6. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper taps the option "Downstairs pantry" THEN the selected place is "Downstairs pantry"
7. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper presses the bar at 3 kg THEN the amount of "Kitchen pantry" is "1000 g"
   - a. AND the amount of "Downstairs pantry" is "2 kg"
8. GIVEN the keeper pressed the bar at 3 kg WHEN the keeper drags to 4 kg THEN the amount of "Kitchen pantry" is "2000 g"
9. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper presses the bar at 1 kg THEN the amount of "Kitchen pantry" is "None"
10. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper presses the bar at 5 kg THEN the amount of "Kitchen pantry" is "3000 g"
11. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper presses the bar at 2.624 kg THEN the amount of "Kitchen pantry" is "500 g"
12. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper presses the bar at 2.625 kg THEN the amount of "Kitchen pantry" is "750 g"
13. GIVEN "Downstairs pantry" has 1.9 kg and the bar is open on "Kitchen pantry" WHEN the keeper presses the bar at 4.95 kg THEN the amount of "Kitchen pantry" is "3100 g"
14. GIVEN "Downstairs pantry" has 1.9 kg and the bar is open on "Kitchen pantry" WHEN the keeper presses the bar at 4.8 kg THEN the amount of "Kitchen pantry" is "3000 g"
15. GIVEN a food item with a full amount of 5 kg and one row of 1 kg WHEN the keeper presses the bar at 1.2 kg THEN the amount is "1.25 kg"
16. GIVEN a food item with a full amount of 12 and one row of 4 WHEN the keeper presses the bar at 4.6 THEN the amount is "5"
17. GIVEN a food item with a full amount of 3 cans and one row of 1 can WHEN the keeper presses the bar at 1.3 cans THEN the amount is "1.5 can"
18. GIVEN the bar of rice is open on "Downstairs pantry" WHEN the keeper presses the bar at 2 kg THEN the amount of "Downstairs pantry" is "1.5 kg"
19. GIVEN the bar of rice is open on "Downstairs pantry" WHEN the keeper presses the bar at 0.75 kg THEN the bar is amber
20. GIVEN the bar of rice is open on "Downstairs pantry" WHEN the keeper presses the bar at 1 kg THEN the bar is not amber
21. GIVEN the keeper set "Kitchen pantry" to 750 g WHEN the keeper taps "Done" THEN the row "Kitchen pantry" of the note has "750 g"
    - a. AND the row "Downstairs pantry" of the note has "2 kg" and the date 2027-06-01
    - b. AND rice in "Kitchen pantry" shows as a line again
22. GIVEN the keeper set "Downstairs pantry" to 1.75 kg WHEN the keeper taps "Done" THEN the row "Downstairs pantry" of the note has "1.75 kg"
    - a. AND the row has the use-by date 2027-06-01
23. GIVEN the keeper set "Kitchen pantry" to nothing WHEN the keeper taps "Done" THEN the note has no row "Kitchen pantry"
24. GIVEN the keeper changed no amount WHEN the keeper taps "Done" THEN the plugin does not write the note
    - a. AND rice in "Kitchen pantry" shows as a line again
25. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper taps "Used up" THEN the note has no row "Kitchen pantry"
26. GIVEN the bar is open on a phone WHEN the keeper drags a finger to the side on the bar THEN no side panel of Obsidian opens
27. GIVEN the bar is open on a phone WHEN the keeper drags a finger up on the bar THEN the page scrolls

## Depends on

- [See the level of a food item](pantry-see-the-level.md): the full amount and the low line that the bar uses.

## Architecture

- [Amount bar](../../architecture/amount-bar.md): why the bar is there, and how its pieces and steps work.
- [Amounts](../../architecture/amounts.md): which units compare.
- [Food item note](../../architecture/food-item-note.md): the table that "Done" writes.
