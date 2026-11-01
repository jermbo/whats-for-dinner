---
title: Start from a past occasion
summary: "The planner starts a new occasion from a past one: the dishes, the persons, the scales, and the tasks with no day come into the new note."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-start-an-occasion.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Start from a past occasion

# Start from a past occasion

As the [planner](../../personas.md), I want to start a new occasion from a past one, so that next Thanksgiving starts from this Thanksgiving.

## Requirements

1. The form of "New occasion" shows a chip for each of the 5 newest past occasions
   - a. A past occasion is a note of the occasions folder with a date before today
   - b. The chips are in one row, the newest first
   - c. With no past occasion, the form has no chips
   - d. One chip is selected at a time, and a second tap on it takes the selection off
2. With a chip selected, "Start" writes a copy of that occasion
   - a. Each dish line of the past note comes into the new note, in its sequence, with no mark and with no `prep done`
   - b. The course, the scale, and the person of each dish stay as they were
   - c. Each occasion task with no day comes in below the heading `## To do`, with no mark
   - d. A task with a day does not come in
   - e. Each other text of the past note does not come in
   - f. With no task to copy, the new note has no heading `## To do`
3. The new note gets the name and the day of the form, as in "Start an occasion"
4. The past note does not change
5. The copy gets the guest list of the past note, with each party size

## Acceptance criteria

Each criterion starts with the notes "Thanksgiving 2025", "Thanksgiving 2026", and "Sam's birthday" of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives them, and today is 2026-10-31.

1. GIVEN the Occasions part WHEN the planner taps "New occasion" THEN the form has the chip "Thanksgiving 2025"
   - a. AND the form has no chip "Thanksgiving 2026" and no chip "Sam's birthday"
2. GIVEN the occasions folder has no note with a date before today WHEN the planner opens the form THEN the form has no chips
3. GIVEN 6 notes with dates from 2020-11-26 to 2025-11-27 WHEN the planner opens the form THEN the form has 5 chips
   - a. AND the first chip is the note with the date 2025-11-27
   - b. AND no chip is the note with the date 2020-11-26
4. GIVEN the chip "Thanksgiving 2025" is selected, the name "Friendsgiving 2026", and the day 2026-11-21 WHEN the planner taps "Start" THEN the first dish line of "Friendsgiving 2026" is `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main`
   - a. AND the second dish line is `- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2`
   - b. AND the third dish line is `- [ ] Pumpkin pie · dessert · Mum`
   - c. AND the note has no other dish line
5. GIVEN the same start WHEN the planner reads the note "Friendsgiving 2026" THEN below `## To do` it has only `- [ ] Buy candles`
   - a. AND it has the property `date: 2026-11-21`
   - b. AND it has no line "Dinner at 14:00."
6. GIVEN the same start WHEN the planner reads the note "Thanksgiving 2025" THEN it is as it was
7. GIVEN the chip "Thanksgiving 2025" is selected WHEN the planner taps it again THEN no chip is selected
   - a. AND "Start" writes a note with the property `date` only
8. GIVEN a past note with no task that has no day WHEN the planner starts from it THEN the new note has no heading `## To do`
9. GIVEN a past note with `## Guests` and the line `- The Smiths ×4` WHEN the planner starts from it THEN the new note has `## Guests` with `- The Smiths ×4`

## Depends on

- [Start an occasion](occasion-start-an-occasion.md): the form of "New occasion", and the note that "Start" writes.

## Architecture

- [Occasion](../../architecture/occasion.md): what an occasion is, when it is active, and its part.
- [Occasion note](../../architecture/occasion-note.md): the form of the note, and what the plugin changes.
- [Occasion](../../architecture/occasion.md): the Occasions part, where "New occasion" is.
