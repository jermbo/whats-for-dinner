---
title: Add and remove a dish
summary: "The planner adds a dish from the recipes or by name with one field, and removes a dish with one tap, and the plugin writes the occasion note."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-see-an-occasion.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Add and remove a dish

# Add and remove a dish

As the [planner](../../personas.md), I want to add a dish from my recipes or by name, and remove a dish, so that I build the menu on the phone and never type the form of a line.

## Requirements

1. "Add a dish" is at the end of each card of "Who brings", and "Add a <course>", such as "Add a dessert", is at the end of each card of the menu
   - a. A tap opens the field "Add a dish" in that card, with "Done" below it. One field is open at a time
   - b. In the card of a person, the new dish gets that person. In the card "Open", it gets the person `?`
   - c. In the card of a course, the new dish gets that course and the person `?`
2. As the planner types, the field proposes the recipes that the text finds
   - a. The text finds a recipe by its name only, not by its ingredients
   - b. The field proposes 5 recipes at the most
   - c. A recipe that is a dish of this occasion is not proposed
3. A tap on a proposal adds that recipe as a dish
4. "Add", or the key Enter, adds the text as a dish with no recipe
   - a. "Add" is active only when the text has a letter or a number
5. A new dish has no scale. In the card "You", it has no course and no person, so it is your dish
   - a. A recipe dish is the line `- [ ] [[<path with no .md>|<title>]]`, with its fields after it
   - b. A dish with no recipe is the line `- [ ] <text>`, with its fields after it
   - c. With a person, the line has the course too: the course of the card, the type of the recipe, or "other"
6. The new line goes after the last dish of the note
   - a. With no dish, it goes above the first heading `## Guests` or `## To do`
   - b. With no dish and no such heading, it goes at the end of the note
   - c. The other text of the note stays as it was
7. After an add, the field is empty and keeps the focus
   - a. The new dish comes into its card at its place
8. "Remove dish" in "Who brings?" removes a dish
   - a. It takes the line of the dish out of the note
   - b. The other lines stay as they were
   - c. A card of a guest with no dish left goes out

## Acceptance criteria

Each criterion starts with the note "Thanksgiving 2026" of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives it, with its screen open.

1. GIVEN the field of the card "You" WHEN the planner types "soup" into "Add a dish" THEN the proposals have "Black bean soup" and "Chicken noodle soup"
2. GIVEN the field WHEN the planner types "crumble" THEN the field proposes no recipe
3. GIVEN the field WHEN the planner types "beans" THEN the proposals do not have "Black bean soup"
4. GIVEN the proposals for "soup" WHEN the planner taps "Black bean soup" THEN the note has the line `- [ ] [[Recipes/Black bean soup|Black bean soup]]` directly after the line of "Plates"
   - a. AND "Black bean soup" is in the card "You"
   - b. AND the field is empty and has the focus
5. GIVEN the planner typed "Cheese board" in the card "You" WHEN the planner taps "Add" THEN the note has the line `- [ ] Cheese board` directly after the line of "Plates"
   - a. AND "Cheese board" is in "You" with the label "Other"
6. GIVEN the planner typed "Cheese board" WHEN the planner presses Enter THEN the note has the line `- [ ] Cheese board`
7. GIVEN the field has 3 spaces WHEN the planner looks at "Add" THEN "Add" is not active
8. GIVEN a note "Game night" with the property `date` and the heading `## To do`, and no dish, WHEN the planner adds "Pancakes" THEN the line of "Pancakes" is above the heading `## To do`
9. GIVEN a note "Game night" with the property `date` only WHEN the planner adds "Pancakes" THEN the line of "Pancakes" is the last line of the note
10. GIVEN the screen WHEN the planner adds "Cheese board" THEN the line "Dinner at 15:00." is still in the note
    - a. AND each line below `## Guests` and `## To do` is as it was
11. GIVEN "Who brings?" of "Pumpkin pie" WHEN the planner taps "Remove dish" THEN the note has no line "Pumpkin pie"
    - a. AND "Who brings" has no card "Mum"
    - b. AND each other line of the note is as it was
12. GIVEN "Who brings?" of "Apple crumble" WHEN the planner taps "Remove dish" THEN the note has no line with "Apple crumble"
    - a. AND the field proposes "Apple crumble" for the text "crumble"
13. GIVEN the menu WHEN the planner taps "Add a drink", types "Lemonade", and presses Enter THEN the note has the line `- [ ] Lemonade · drink · ?`
    - a. AND "Lemonade" is in the card "Open" and in the card "Drink"
14. GIVEN the card "Mum" WHEN the planner adds "Rolls" by name THEN the line is `- [ ] Rolls · other · Mum`
15. GIVEN the card "Open" WHEN the planner adds "Ice" by name THEN the line is `- [ ] Ice · other · ?`

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the part, its groups, and the reading of a dish line.

## Architecture

- [Occasion note](../../architecture/occasion-note.md): the form of the note, and what the plugin changes.
- [Shopping](../../architecture/shopping.md): the field "Add an item", which proposes notes as you type in the same way.
- [Recipes](../../architecture/recipes.md): how the text of a find field finds a recipe.
- [Plan note](../../architecture/plan-note.md): how a change of a note keeps your own text.
