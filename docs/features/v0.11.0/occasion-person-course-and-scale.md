---
title: Give a dish a person, a course, and a scale
summary: "A tap on a dish opens \"Who brings?\": a sheet from the bottom with a large button for each person, the courses, the scales, and \"Remove dish\"."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-see-an-occasion.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Give a dish a person, a course, and a scale

# Give a dish a person, a course, and a scale

As the [planner](../../personas.md), I want one sheet to tell who brings a dish, its course, and its scale, so that I plan who brings what with one thumb and no keyboard.

## Requirements

1. A tap on the name of a dish, in "Who brings" or in the menu, opens the sheet "Who brings?" from the bottom of the screen
   - a. The sheet has the label "Who brings" and the name of the dish
   - b. A tap outside the sheet, the key Escape, or "Done" closes it
2. The sheet has one large button for "You", for each guest in the sequence of the guest list, and for "Nobody yet"
   - a. The button of the person of the dish is in ink, with a check
   - b. A tap on a button writes the person, and closes the sheet
   - c. "You" takes the person out of the line. "Nobody yet" writes the person `?`
3. The field "New person" adds a guest, and gives the dish to that guest
   - a. Enter writes the line `- <name>` in the guest list, and the name as the person of the dish
4. The course chips are starter, main, side, dessert, drink, things, each other course of this occasion, and "+ Course"
   - a. A course that the dish gets from the type of its recipe, or "other", is a chip too
   - b. "+ Course" opens a field for a word. Enter sets that word as the course
5. The scale chips are ×1, ×1.5, ×2, ×3, and ×4
   - a. ×1 takes the scale out of the line
6. "Remove dish" takes the line of the dish out of the note, and closes the sheet
7. Each tap writes the line of the dish at once
   - a. The fields are in this sequence: the course, the scale, the person, and `prep done`
   - b. When the dish has a person, the line has its course too: the course that the screen shows for it, in small letters
   - c. The link, the name, the mark, and `prep done` stay as they were
   - d. A person that is a link stays a link while the person does not change
8. The sheet rises from the bottom. With less motion, it shows at once

## Acceptance criteria

Each criterion starts with the note "Thanksgiving 2026" of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives it, with its screen open.

1. GIVEN the screen WHEN the planner taps "Apple crumble" THEN the sheet "Who brings?" shows "Apple crumble"
   - a. AND the buttons are You, Mum, Sam, The Smiths, and Nobody yet, in this sequence
   - b. AND "You", "dessert", and "×1" are on
2. GIVEN the sheet of "Apple crumble" WHEN the planner taps "Mum" THEN the line is `- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · Mum`
   - a. AND the sheet closes
   - b. AND "Apple crumble" is in the card "Mum"
3. GIVEN the sheet of "Pumpkin pie" WHEN the planner taps "You" THEN the line is `- [ ] Pumpkin pie · dessert`
   - a. AND "Who brings" has no card "Mum"
4. GIVEN the sheet of "Plates" WHEN the planner taps "The Smiths" THEN the line is `- [ ] Plates · things · The Smiths`
   - a. AND "Who brings" has the card "The Smiths"
5. GIVEN the sheet of "Beef tacos" WHEN the planner taps "Nobody yet" THEN the line is `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · ?`
6. GIVEN the sheet of "Honey glazed carrots" WHEN the planner taps "×3" THEN the line is `- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×3`
   - a. WHEN the planner taps "×1" THEN the line is `- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side`
7. GIVEN the line `- [ ] Cheese board` WHEN the planner gives it "Sam" THEN the line is `- [ ] Cheese board · other · Sam`
8. GIVEN the sheet of "Apple crumble" WHEN the planner types "Aunt Jo" into "New person" and presses Enter THEN the line is `- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · Aunt Jo`
   - a. AND the guest list has the line `- Aunt Jo`
   - b. AND "Who brings" has the card "Aunt Jo"
9. GIVEN the line `- [ ] Cheese board` WHEN the planner taps "+ Course", types "bread", and presses Enter THEN the line is `- [ ] Cheese board · bread`
10. GIVEN the sheet of "Rolls" WHEN the planner taps "×2" THEN the line is `- [x] Rolls · bread · ×2 · Sam`
11. GIVEN the line `- [ ] Pumpkin pie · dessert · [[Mum]]` WHEN the planner taps "×2" THEN the line is `- [ ] Pumpkin pie · dessert · ×2 · [[Mum]]`
12. GIVEN the line `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · prep done` WHEN the planner taps "×2" THEN the line is `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · ×2 · prep done`
13. GIVEN the sheet of "Apple crumble" WHEN the planner taps "starter" THEN the line is `- [ ] [[Recipes/Apple crumble|Apple crumble]] · starter`
    - a. AND "Apple crumble" is in the card "Starter" of the menu

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the part, its groups, and the reading of a dish line.

## Architecture

- [Occasion note](../../architecture/occasion-note.md): the form of the note, and what the plugin changes.
- [Plan note](../../architecture/plan-note.md): the fields of a task line, and how a change writes the task again.
- [Recipes](../../architecture/recipes.md): the type of a recipe, its first tag.
