---
title: Fill a shelf in a row
summary: "Add to pantry stays open after each food, with the same place, and a count adds many packages of one food with one tap."
parent: pantry-fill-stories.md
updated: 2026-10-27
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry fill stories](pantry-fill-stories.md) / Fill a shelf in a row

# Fill a shelf in a row

As the [keeper](../../personas.md), I want to add the food of a shelf one after the other, with a count for each, so that I do not start again for each food.

## Requirements

1. The last step of "Add to pantry" has a count of packages
   - a. The chips 1, 2, 3, 4, 6, and 12, and a field for a different whole number from 1 to 99
   - b. The count starts at 1 for each food
2. "Add" writes one full row for each package of the count, with the size and the place of the form
3. After "Add", the form stays open, and starts again at an empty name
   - a. The place stays as you selected it
   - b. A short line tells what the last "Add" wrote, such as "Added 4 × Black beans"
   - c. The new line shows in its bin behind the form
4. A known food goes to the last step with the size of its newest package here, or its size
   - a. A known food with no size asks for its size first, as a new food does
5. "Done" closes the form, and so does "Cancel" at the name step
   - a. "Cancel" at a later step goes back to the name step

## Acceptance criteria

Each criterion starts with the test vault, in the Pantry part.

1. GIVEN "Add to pantry" with the new food "Tomato paste", the size 170 g, and the place "Kitchen pantry" WHEN the keeper taps the count 4 and "Add" THEN the note "Tomato paste" has 4 rows of 170 g, each full, in "Kitchen pantry"
   - a. AND the form shows an empty name field
   - b. AND the form tells "Added 4 × Tomato paste"
2. GIVEN the form after "Add" WHEN the keeper adds the new food "Rolled oats" with the size 1 kg THEN its place starts as "Kitchen pantry"
3. GIVEN "Add to pantry" WHEN the keeper types "black" and taps "Black beans" THEN the form shows the last step with "Black beans · 425 g"
4. GIVEN the last step of "Black beans" WHEN the keeper types 8 in the count field and taps "Add" THEN the line of Black beans in "Kitchen pantry" shows 10 packages
5. GIVEN the last step WHEN the keeper looks at the count THEN the chip 1 is on
6. GIVEN the form at the name step WHEN the keeper taps "Done" THEN the form closes
7. GIVEN the last step WHEN the keeper taps "Cancel" THEN the form shows the name step

## Depends on

Nothing.

## Architecture

- [Pantry](../../architecture/pantry.md): "Add to pantry".
- [Decision log: pantry fill](../../initiatives/pantry-fill/decision-log.md): decisions 7 and 8.
