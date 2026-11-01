---
title: See the occasions
summary: "The planner finds each occasion in a fifth part of the kitchen, Occasions: the next one first as an ink card, the others as rows, with filters and sequences."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / See the occasions

# See the occasions

As the [planner](../../personas.md), I want one part of the kitchen with each occasion, so that I find how to add one, see the next one at one look, and find a past one.

## Requirements

1. The nav has a fifth option "Occasions" after "Shop", at all times
   - a. The part comes in from the side of its option, as each other part does
2. From the top, the part has the head "Occasions", the wide button "New occasion", the ink card "Next up", one row of chips, and one row for each other occasion
3. "Next up" is the nearest occasion that is not past
   - a. An occasion is past when its date is before today. A note with no date is not past, and it comes after each note with a date
   - b. The card has the label "Next up", the name, the date and the days, and four numbers: coming, open, to buy, and to do
   - c. With no occasion that is not past, the part has no card "Next up"
   - d. A tap on the card opens the screen of the occasion
4. The chips are the filters "Upcoming", "Past", and "All", then the sequences "Nearest first", "Newest first", and "A to Z"
   - a. The part starts with "Upcoming" and "Nearest first"
   - b. One filter is on at a time, and one sequence is on at a time
   - c. "Nearest first" puts the upcoming occasions by date, and then the past ones, the newest first
5. Below the chips, a group head names the filter, with the number of rows
   - a. Each row has the name, the date, the number of dishes, the number of people who come, and the days for an upcoming occasion
   - b. The row of "Next up" is not in the list again
   - c. A past occasion is in the muted colour
   - d. A tap on a row opens the screen of the occasion
6. With no row, the part says "No occasion here"
7. The kitchen keeps the occasion that is open while you go to a different part, and Cook Mode returns to it

## Acceptance criteria

Each criterion starts with the occasion notes of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives them, and today is 2026-11-10.

1. GIVEN the kitchen WHEN the planner looks at the nav THEN it has the five options Pantry, Recipes, Plan, Shop, and Occasions
2. GIVEN the occasions folder has no note WHEN the planner opens Occasions THEN the part has the head and "New occasion", and no card "Next up"
   - a. AND it says "No occasion here"
3. GIVEN the part WHEN the planner looks at "Next up" THEN it is "Sam's birthday", with "14 Nov · 4 days"
4. GIVEN the part WHEN the planner looks at the rows THEN the group is "Upcoming" with 1 row: "Thanksgiving 2026", with "16" days
5. GIVEN the part WHEN the planner taps "Past" THEN the rows are "Thanksgiving 2025", in the muted colour
6. GIVEN the part WHEN the planner taps "All" and "A to Z" THEN the rows are "Thanksgiving 2025" and "Thanksgiving 2026", in this sequence
7. GIVEN the part WHEN the planner taps the row "Thanksgiving 2026" THEN the screen of "Thanksgiving 2026" shows
8. GIVEN the screen of "Thanksgiving 2026" WHEN the planner taps Pantry and then Occasions THEN the screen of "Thanksgiving 2026" shows again
9. GIVEN today is 2026-11-28 WHEN the planner opens Occasions THEN "Next up" is not "Thanksgiving 2026"
   - a. AND "Past" has "Thanksgiving 2026"
   - b. AND the vault still has the note "Thanksgiving 2026"
10. GIVEN a phone with a screen 375 px wide WHEN the planner opens the kitchen THEN the five options of the nav are in view, and the nav does not scroll to the side

## Depends on

Nothing. The occasion notes of the test vault are written by hand.

## Architecture

- [Occasion](../../architecture/occasion.md): when an occasion is past, and the Occasions part.
- [Kitchen state](../../architecture/kitchen-state.md): the fifth part, and the occasion that is open.
