---
title: Cook and tick the dishes
summary: "On the day, the cook cooks each dish at its scale, the pantry loses what the dish used, and each dish that is ready gets its mark."
parent: occasion-stories.md
updated: 2026-10-31
persona: Cook
depends-on: [occasion-see-an-occasion.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Cook and tick the dishes

# Cook and tick the dishes

As the [cook](../../personas.md), I want to cook my dishes of the occasion at their scale, and tick each dish that is ready, so that the pantry is correct and I see at one look what is still to come.

## Requirements

1. Each of your dishes that is a recipe and has no mark has "Cook"
   - a. A dish with no recipe has no "Cook"
   - b. A dish of a different person has no "Cook"
2. "Cook" opens the recipe in Cook Mode, as "Cook" on a meal does
   - a. With a scale that is not ×1, the top of each page of Cook Mode shows the scale, such as "×2"
   - b. "Get out" and the steps show the amounts as the recipe has them
3. The last page lists each amount times the scale
   - a. "Update the pantry" takes those amounts out of the pantry
   - b. The record of the meal goes into the recipe note, as for a meal of the week
   - c. The line of the dish gets its mark
   - d. The plan note does not change, also when the recipe is a meal of the plan
4. "Exit" before the last page gives the dish no mark
5. Each dish has a check
   - a. A tap on the check of a dish with no mark gives it its mark
   - b. A tap on the check of a dish with a mark takes the mark off
   - c. The mark changes only `[ ]` or `[x]` in the line. The other text of the line stays
   - d. A tap on the check does not open the dish
6. A dish that gets its mark shows it at once
   - a. The check fills with the accent colour and draws its mark, and a line strikes the name, as a tick in the Shop does
   - b. The dish keeps its place in its card

## Acceptance criteria

Each criterion starts with the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives it: the note "Thanksgiving 2026" with its screen open, and 450 g of carrots.

1. GIVEN the screen WHEN the cook looks at "Beef tacos" THEN it has "Cook"
2. GIVEN the screen WHEN the cook looks at "Pumpkin pie" THEN it has no "Cook"
3. GIVEN the line `- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · Mum` WHEN the cook looks at "Apple crumble" THEN it has no "Cook"
4. GIVEN the line `- [ ] Cheese board` WHEN the cook looks at "Cheese board" THEN it has no "Cook"
5. GIVEN the screen WHEN the cook taps "Cook" on "Honey glazed carrots" THEN Cook Mode opens on "Get out"
   - a. AND the top of the page shows "×2"
   - b. AND "Get out" shows "500 g" for the carrots
6. GIVEN the screen WHEN the cook taps "Cook" on "Beef tacos" THEN the top of the page shows no scale
7. GIVEN Cook Mode of "Honey glazed carrots" from the screen WHEN the cook reaches the last page THEN the carrots show "1000 g"
8. GIVEN the last page of "Honey glazed carrots" from the screen WHEN the cook taps "Update the pantry" THEN the pantry has no carrots
   - a. AND the line is `- [x] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2`
   - b. AND the note "Honey glazed carrots" has a new line below "Cooked" with the date of today
9. GIVEN the plan has the meal "Beef tacos" WHEN the cook finishes Cook Mode of "Beef tacos" from the screen THEN the plan note still has the meal "Beef tacos"
   - a. AND the line of "Beef tacos" in the occasion note has its mark
10. GIVEN Cook Mode of "Beef tacos" from the screen WHEN the cook taps "Exit" on a step THEN the line of "Beef tacos" has no mark
11. GIVEN the screen WHEN the cook taps the check of "Pumpkin pie" THEN the line is `- [x] Pumpkin pie · dessert · Mum`
    - a. AND "Pumpkin pie" shows a full check and a line through its name
    - b. AND "Pumpkin pie" is still in the card "Mum"
12. GIVEN the screen WHEN the cook taps the check of "Rolls" THEN the line is `- [ ] Rolls · bread · Sam`
13. GIVEN the screen WHEN the cook taps the check of "Apple crumble" THEN the line is `- [x] [[Recipes/Apple crumble|Apple crumble]] · dessert`
    - a. AND the pantry does not change
    - b. AND "Apple crumble" has no "Cook"
14. GIVEN the screen WHEN the cook taps the check of "Pumpkin pie" THEN the sheet "Who brings?" does not open

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the screen, and the reading of the scale, the person, and the mark of a dish.

## Architecture

- [Occasion note](../../architecture/occasion-note.md): the form of the note, and what the plugin changes.
- [Cook Mode](../../architecture/cook-mode.md): the pages of Cook Mode, and its two buttons.
- [End of a meal](../../architecture/end-of-a-meal.md): what "Update the pantry" takes out, and the record in the recipe note.
- [Plan note](../../architecture/plan-note.md): what the end of a meal changes in the plan note.
