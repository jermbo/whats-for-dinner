---
title: Give a dish a person, a course, and a scale
summary: "The planner opens a dish and sets who brings it, its course, and how many times you make it, each with one tap on a chip."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-see-an-occasion.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Give a dish a person, a course, and a scale

# Give a dish a person, a course, and a scale

As the [planner](../../personas.md), I want to give a dish a person, a course, and a scale with chips, so that I plan who brings what with no keyboard.

## Requirements

1. A tap on a dish opens it below its row, with three rows of chips: person, course, and scale
   - a. The chips of the dish are selected: its person or "You", its course as the part shows it, and its scale
   - b. A tap on the open dish, or on a different dish, closes it
   - c. One dish is open at a time
2. The person chips are "You", each person of this occasion in the sequence of the note, and "+ Person"
   - a. "You" takes the person out of the line
   - b. "+ Person" opens a field for a name. Enter sets that name as the person
3. The course chips are starter, main, side, dessert, drink, each other course of this occasion, and "+ Course"
   - a. A course that the dish gets from the type of its recipe, or "Other", is a chip too
   - b. "+ Course" opens a field for a word. Enter sets that word as the course
4. The scale chips are ×1, ×1.5, ×2, ×3, and ×4
   - a. ×1 takes the scale out of the line
5. Each tap on a chip writes the line of the dish at once
   - a. The fields are in this sequence: the course, the scale, the person, and `prep done`
   - b. When the dish has a person, the line has its course too: the course that the part shows for it, in small letters
   - c. The link, the name, the mark, and `prep done` stay as they were
   - d. A person that is a link stays a link while the person does not change
6. When the person changes, the dish glides into the group of its new person
   - a. A group with no dish left goes out, and a new group comes in

## Acceptance criteria

Each criterion starts with the note "Thanksgiving 2026" of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives it, with its part open.

1. GIVEN the part WHEN the planner taps "Apple crumble" THEN the dish shows the chips of person, course, and scale
   - a. AND the chips "You", "dessert", and "×1" are selected
2. GIVEN "Apple crumble" is open WHEN the planner taps "Honey glazed carrots" THEN "Honey glazed carrots" is open
   - a. AND "Apple crumble" is closed
3. GIVEN "Apple crumble" is open WHEN the planner looks at the person chips THEN they are "You", "Mum", "Sam", and "+ Person", in this sequence
4. GIVEN "Apple crumble" is open WHEN the planner taps "Mum" THEN the line is `- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · Mum`
   - a. AND "Apple crumble" is in the group "Mum", before "Pumpkin pie"
5. GIVEN "Pumpkin pie" is open WHEN the planner taps "You" THEN the line is `- [ ] Pumpkin pie · dessert`
   - a. AND the part has no group "Mum"
6. GIVEN "Honey glazed carrots" is open WHEN the planner taps "×3" THEN the line is `- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×3`
7. GIVEN "Honey glazed carrots" is open WHEN the planner taps "×1" THEN the line is `- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side`
8. GIVEN the line `- [ ] [[Recipes/Pancakes|Pancakes]]` and "Pancakes" is open WHEN the planner taps "Sam" THEN the line is `- [ ] [[Recipes/Pancakes|Pancakes]] · breakfast · Sam`
9. GIVEN the line `- [ ] Cheese board` and "Cheese board" is open WHEN the planner taps "Sam" THEN the line is `- [ ] Cheese board · other · Sam`
10. GIVEN "Apple crumble" is open WHEN the planner taps "+ Person", types "Aunt Jo", and presses Enter THEN the line is `- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · Aunt Jo`
    - a. AND the part has the group "Aunt Jo"
11. GIVEN the line `- [ ] Cheese board` and "Cheese board" is open WHEN the planner taps "+ Course", types "bread", and presses Enter THEN the line is `- [ ] Cheese board · bread`
12. GIVEN "Rolls" is open WHEN the planner taps "×2" THEN the line is `- [x] Rolls · bread · ×2 · Sam`
13. GIVEN the line `- [ ] Pumpkin pie · dessert · [[Mum]]` and "Pumpkin pie" is open WHEN the planner taps "×2" THEN the line is `- [ ] Pumpkin pie · dessert · ×2 · [[Mum]]`
14. GIVEN the line `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · prep done` and "Beef tacos" is open WHEN the planner taps "×2" THEN the line is `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · ×2 · prep done`
15. GIVEN "Apple crumble" is open WHEN the planner taps "starter" THEN the line is `- [ ] [[Recipes/Apple crumble|Apple crumble]] · starter`
    - a. AND "Apple crumble" is the first dish of "You"

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the part, its groups, and the reading of a dish line.

## Architecture

- [Plan note](../../architecture/plan-note.md): the fields of a task line, and how a change writes the task again.
- [Recipes](../../architecture/recipes.md): the type of a recipe, its first tag.
