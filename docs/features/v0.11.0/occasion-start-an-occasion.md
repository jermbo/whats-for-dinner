---
title: Start an occasion
summary: "The planner starts an occasion with a name and a day, from the head of the Plan or with a command, and the plugin writes its note."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-see-an-occasion.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Start an occasion

# Start an occasion

As the [planner](../../personas.md), I want to start an occasion with a name and a day, from the Occasions part or with a command, so that I do not make its note by hand.

## Requirements

1. The Occasions part has the wide button "New occasion" below its head
   - a. The Plan part has no button "New occasion"
2. The Obsidian command "New occasion" opens the kitchen with the same form
3. "New occasion" opens a form with a name and a day
   - a. The form grows from the button that you tapped, as a circle of paper
   - b. The name field has the focus when the form opens
   - c. The day field is the date field of the device
4. "Start" is active only with a name and a day that can start an occasion
   - a. With a name that a note of the occasions folder has, the form shows "An occasion has this name"
   - b. With a name that has one of the signs `\ / : * ? " < > | # ^ [ ]`, the form shows "A name cannot have" and the sign
   - c. With a day before today, the form shows "This day is past"
   - d. A name with spaces only is no name
5. "Start" writes the note of the occasion
   - a. The note is in the occasions folder, and its name is the name of the occasion, with `.md`
   - b. The note has the property `date` with the day, as year-month-day, and no other text
   - c. When the occasions folder is not there, the plugin makes it first
6. After "Start", the kitchen shows the screen of the new occasion
   - a. A circle of paper grows from "Start", and the screen opens under it
   - b. An occasion with no dish shows the ink card, the empty cards "You" and "Open", and a dashed card for each known course
7. "Cancel" closes the form, and writes no note
   - a. A circle of paper grows from "Cancel", and the Occasions part opens under it

## Acceptance criteria

Each criterion starts with the note "Thanksgiving 2026" of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives it, and today is 2026-10-31.

1. GIVEN the Occasions part is open WHEN the planner looks below its head THEN it has the wide button "New occasion"
   - a. AND the Plan part has no button "New occasion"
2. GIVEN the Occasions part is open WHEN the planner taps "New occasion" THEN the form shows a name field and a day field
   - a. AND the name field has the focus
3. GIVEN the kitchen is not open WHEN the planner runs the command "New occasion" THEN the kitchen opens with the form
4. GIVEN the form with no name and the day 2026-12-24 WHEN the planner looks at "Start" THEN "Start" is not active
5. GIVEN the form with the name "Christmas 2026" and no day WHEN the planner looks at "Start" THEN "Start" is not active
6. GIVEN the form with the name "Christmas 2026" and the day 2026-12-24 WHEN the planner taps "Start" THEN the vault has the note `Larder/Occasions/Christmas 2026.md`
   - a. AND the note has the property `date: 2026-12-24`
   - b. AND the kitchen shows the screen of "Christmas 2026", with "24 Dec · 54 days"
7. GIVEN the vault has no folder `Larder/Occasions` WHEN the planner starts "Christmas 2026" THEN the vault has the folder and the note
8. GIVEN the form WHEN the planner types the name "Thanksgiving 2026" THEN the form shows "An occasion has this name"
   - a. AND "Start" is not active
9. GIVEN the form WHEN the planner types the name "Mum/Dad" THEN the form shows "A name cannot have /"
   - a. AND "Start" is not active
10. GIVEN the form with the name "Christmas 2026" WHEN the planner selects the day 2026-10-30 THEN the form shows "This day is past"
    - a. AND "Start" is not active
11. GIVEN the form with the name "Christmas 2026" WHEN the planner selects the day 2026-10-31 THEN "Start" is active
12. GIVEN the form with the name "Christmas 2026" and the day 2026-12-24 WHEN the planner taps "Cancel" THEN the vault has no note "Christmas 2026"
    - a. AND the Occasions part shows
13. GIVEN the occasions folder is set to `Events` WHEN the planner starts "Christmas 2026" THEN the note is `Events/Christmas 2026.md`

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the fifth part that shows the new occasion, and the setting of the occasions folder.

## Architecture

- [Occasion](../../architecture/occasion.md): what an occasion is, when it is active, and its part.
- [Occasion note](../../architecture/occasion-note.md): the form of the note, and what the plugin changes.
- [Plan](../../architecture/plan.md): the head of the Plan part, and why "Add a meal" keeps its place.
- [Settings](../../architecture/settings.md): the folders of the plugin home.
