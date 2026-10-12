---
title: Select the sequence of the pantry
summary: "The planner puts the food that needs attention at the top: the most empty, the first date, or the name."
parent: pantry-stories.md
persona: Planner
depends-on:
  [
    pantry-see-the-level.md,
    pantry-see-the-food-to-use-soon.md,
    pantry-see-the-food-that-is-out.md,
  ]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Select the sequence of the pantry

# Select the sequence of the pantry

As the [planner](../../personas.md), I want to select the sequence of the pantry, so that the food that needs my attention is at the top.

## Requirements

1. Select a sequence in the list next to the chips
   - a. The list has "By place", "Low first", "Use first", and "A to Z"
   - b. The pantry starts with "By place"
2. "Low first" puts the most empty food at the top
   - a. The groups are "Low", "Enough", and "Not counted", in this sequence
   - b. In "Low" and in "Enough", the line with the smallest part of its full amount is first
   - c. "Not counted" has the lines with no bar, in the sequence of their names
   - d. The group "Out" is the first group
3. "Use first" puts the first use-by date at the top
   - a. The groups are "Use first", "Later", and "No date", in this sequence
   - b. "Use first" has the lines that are soon
   - c. "Later" has the other lines with a use-by date
   - d. In "Use first" and in "Later", the first date is at the top
4. "A to Z" puts all lines in one group
   - a. The name of the group is "A to Z"
   - b. The lines are in the sequence of their names
5. In each sequence but "By place", a line shows its place below the name
6. In each sequence but "Low first", the group "Out" is the last group
7. A group with no line does not show
8. The sequence works together with a filter, and with the text of the field "Find food"

## Acceptance criteria

Each criterion starts with the test vault in the state in which it starts, with the setting "Low line" at 25%, and with the date 2026-10-11.

1. GIVEN the test vault WHEN the planner opens the part "Pantry" THEN the list shows "By place"
2. GIVEN the part "Pantry" is open WHEN the planner selects "Low first" THEN the groups are "Out", "Low", "Enough", and "Not counted", in this sequence
3. GIVEN the part "Pantry" is open WHEN the planner selects "Low first" THEN the group "Low" has the lines of flour and of ginger
4. GIVEN the part "Pantry" is open WHEN the planner selects "Low first" THEN the first line of the group "Enough" is tomatoes
   - a. AND the line of sugar is above the lines of rice
5. GIVEN the part "Pantry" is open WHEN the planner selects "Low first" THEN the group "Not counted" has 1 line: water
6. GIVEN the part "Pantry" is open WHEN the planner selects "Use first" THEN the groups are "Use first", "Later", "No date", and "Out", in this sequence
7. GIVEN the part "Pantry" is open WHEN the planner selects "Use first" THEN the group "Use first" has 5 lines
   - a. AND its first line is chicken thighs
8. GIVEN the part "Pantry" is open WHEN the planner selects "Use first" THEN the first line of the group "Later" is spinach in "Outside fridge"
9. GIVEN the part "Pantry" is open WHEN the planner selects "A to Z" THEN the pantry shows the groups "A to Z" and "Out", in this sequence
   - a. AND the first line of "A to Z" is avocados
10. GIVEN the part "Pantry" is open WHEN the planner selects "A to Z" THEN the line of rice with "500 g" shows "Kitchen pantry" below the name
11. GIVEN no food item is out WHEN the planner selects "Low first" THEN the first group is "Low"
12. GIVEN the sequence is "Low first" WHEN the planner taps the chip "Kitchen fridge" THEN the group "Low" has 1 line: ginger

## Depends on

- [See the level of a food item](pantry-see-the-level.md): the level that "Low first" uses.
- [See the food to use soon](pantry-see-the-food-to-use-soon.md): the rule that "Use first" uses.
- [See the food that is out](pantry-see-the-food-that-is-out.md): the group "Out".

## Architecture

- [Pantry](../../architecture/pantry.md): what the pantry shows, and why.
- [Use soon](../../architecture/use-soon.md): what "soon" is.
