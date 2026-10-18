---
title: Add a recipe one line at a time
summary: "The cook types a recipe one line at a time, sees the food item of each ingredient, and saves a correct RecipeMD note."
parent: recipes-stories.md
persona: Cook
depends-on: []
status: built
updated: 2026-10-18
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Add a recipe one line at a time

# Add a recipe one line at a time

As the [cook](../../personas.md), I want to type a recipe from a card or a cookbook one line at a time, and to see the food item of each ingredient as I type, so that "Save" gives a correct recipe note with a link for each ingredient and I type no Markdown.

## Requirements

1. Tap "Add recipe" in the Recipes part to open intake
   - a. The command "Add recipe" of Obsidian also opens intake
   - b. The two work on the phone and on the computer
2. Intake has a field for the title, the yield, the ingredients, and the steps
   - a. The ingredients and the steps have one line for each ingredient or step
   - b. Enter in a line gives the next empty line, and the cursor goes there
   - c. A new line slides in. With "Reduce motion", it shows with no motion
   - d. Text that you paste goes into the field where you paste it
3. Each ingredient line shows its result below it, as you type
   - a. The amount at the start of the line, as the [amounts](../../architecture/amounts.md) page tells, such as "200 g"
   - b. The one food item that the [match](../../architecture/match.md) finds, such as "200 g · Flour"
   - c. With two food items or more, each of them, such as "300 g · Elbow pasta or Shell pasta"
   - d. With no food item, "No food item"
   - e. The plugin does not divide a line. "salt and pepper" is one line
4. Tap "Save" to write the note `<title>.md` in the recipes folder of the settings
   - a. "Save" is not available while the title is empty
   - b. The note is a correct RecipeMD recipe: the title, the yield in bold, a rule, the ingredients as a list, a rule, and the steps as a numbered list
   - c. An empty line is not written
   - d. An ingredient with one food item is a link to its note, with the text that you typed: `_200 g_ [[Larder/Pantry/Flour|flour]]`
   - e. An ingredient with two food items or more, or with no food item, has no link: `_300 g_ pasta`
   - f. Intake closes, and the Recipes part shows the new recipe

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs).

1. GIVEN the Recipes part WHEN the cook taps "Add recipe" THEN intake shows the fields "Title", "Yield", "Ingredients", and "Steps"
2. GIVEN Obsidian on the computer WHEN the cook runs the command "Add recipe" THEN intake opens
3. GIVEN an empty ingredient line WHEN the cook types "200 g flour" THEN the line shows "200 g · Flour"
4. GIVEN an empty ingredient line WHEN the cook types "300 g pasta" THEN the line shows "300 g · Elbow pasta or Shell pasta"
5. GIVEN an empty ingredient line WHEN the cook types "1 pinch salt" THEN the line shows "1 pinch · Salt"
6. GIVEN an empty ingredient line WHEN the cook types "salt and pepper" THEN the field has one line
   - a. AND the line shows "No food item"
7. GIVEN the cursor is in the ingredient line "200 g flour" WHEN the cook presses Enter THEN the cursor is in a new empty line below it
8. GIVEN the title is empty WHEN the cook looks at "Save" THEN "Save" is not available
9. GIVEN the title "Crepes", the yield "6 crepes", the ingredients "200 g flour", "300 ml milk", "2 eggs", and "1 pinch salt", and the steps "Mix all the ingredients." and "Cook each crepe for 1 minute on each side." WHEN the cook taps "Save" THEN the note `Recipes/Crepes.md` has this text:

   ```markdown
   # Crepes

   **6 crepes**

   ---

   - _200 g_ [[Larder/Pantry/Flour|flour]]
   - _300 ml_ [[Larder/Pantry/Milk|milk]]
   - _2_ [[Larder/Pantry/Eggs|eggs]]
   - _1 pinch_ [[Larder/Pantry/Salt|salt]]

   ---

   1. Mix all the ingredients.
   2. Cook each crepe for 1 minute on each side.
   ```

   - a. AND the Recipes part shows "Crepes", and not as a note that fails
10. GIVEN the ingredient line "300 g pasta" WHEN the cook taps "Save" THEN the note has the line `- _300 g_ pasta`

## Depends on

Nothing. This story can start now.

## Architecture

- [Recipe note](../../architecture/recipe-note.md): the form that "Save" writes.
- [Match](../../architecture/match.md): how a line finds its food item.
- [Amounts](../../architecture/amounts.md): the forms of an amount at the start of a line.
- [Intake](../../architecture/intake.md): how a line is read, and what "Save" writes.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 1, 2 a to 2 c, 3, and 3 b to 3 d.
