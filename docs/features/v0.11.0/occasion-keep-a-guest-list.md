---
title: Keep a guest list
summary: "The planner keeps the guest list of an occasion: each guest with a party size, the total that comes, and who can get a job."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-see-an-occasion]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Keep a guest list

# Keep a guest list

As the [planner](../../personas.md), I want a guest list with the size of each party, so that I know how many people come, and who I can ask to bring something.

## Requirements

1. The guest list is the heading `## Guests` of the note, with one list line for each guest
   - a. A line is `- <name>`, or `- <name> ×<number>` for a party size above 1
   - b. A name can be a link, such as `- [[Mum]] ×2`. The screen shows the name of the link
   - c. A person of a dish who has no line is a guest with the size 1
2. "N coming" is 1 for you, and the party size of each guest
3. "Who brings" has two tabs: "Who brings" and "Guest list · N"
   - a. "Who brings" is on when the screen opens
4. The guest list has the field "Add a guest" at the top, then one row for each guest, then "N coming"
   - a. The first row is "You", with "Host" or your jobs. It has no size and no ✕
   - b. Each other row has the name, its jobs or "Visitor", − ×N +, and ✕
5. "Add a guest" writes the line `- <name>` at the end of the list
   - a. With no heading `## Guests`, the screen writes it above `## To do`, or at the end of the note
   - b. A name that is a guest already, or "You", adds nothing
6. − and + write the party size in the line of the guest
   - a. The size is 1 at the least. A size of 1 has no `×`
   - b. A person of a dish with no line gets a line
7. ✕ takes the line of the guest out of the note
   - a. Each job of that guest gets the person `?`, so it is open
8. A guest with a job has a place card in "Who brings". A guest with no job is a "Visitor" in the guest list only

## Acceptance criteria

Each criterion starts with the note "Thanksgiving 2026" of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives it, with its screen open.

1. GIVEN the screen WHEN the planner taps "Guest list · 8" THEN the rows are You, Mum, Sam, and The Smiths
   - a. AND Mum shows "Pumpkin pie" and "×2", Sam shows "Rolls", and The Smiths show "Visitor" and "×4"
   - b. AND the list ends with "8 coming"
2. GIVEN the guest list WHEN the planner types "Aunt Jo" into "Add a guest" and presses Enter THEN the note has the line `- Aunt Jo` after `- The Smiths ×4`
   - a. AND the list shows "9 coming"
   - b. AND "Who brings" has no card "Aunt Jo"
3. GIVEN the guest list WHEN the planner taps + on The Smiths THEN the line is `- The Smiths ×5`
4. GIVEN the guest list WHEN the planner taps − on Mum THEN the line is `- Mum`
   - a. WHEN the planner taps − again THEN the line is still `- Mum`
5. GIVEN the guest list WHEN the planner taps ✕ on Mum THEN the note has no line `- Mum`
   - a. AND the line of the pie is `- [ ] Pumpkin pie · dessert · ?`
   - b. AND "Pumpkin pie" is in the card "Open"
6. GIVEN a note with the line `- [ ] Pie · dessert · Jo` and no heading `## Guests` WHEN the planner opens the guest list THEN it has the row "Jo" with "×1"
   - a. WHEN the planner taps + on Jo THEN the note has `## Guests` with the line `- Jo ×2`
7. GIVEN the screen WHEN the planner taps "8 coming" on the ink card THEN the tab "Guest list" is on

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the screen with "Who brings".

## Architecture

- [Occasion note](../../architecture/occasion-note.md): the form of the guest list.
- [Occasion](../../architecture/occasion.md): a guest, a job, and an open job.
