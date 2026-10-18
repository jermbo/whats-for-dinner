---
title: Make a stub for a new food
summary: "An ingredient with no food item shows a chip; a tap finds an existing food item, and with no tap, Save makes a stub in the pantry folder."
parent: recipes-stories.md
persona: Cook
depends-on: [recipes-add-a-recipe-one-line-at-a-time.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Make a stub for a new food

# Make a stub for a new food

As the [cook](../../personas.md), I want an ingredient with no food item to get a new food item note when I save, unless I tap to select an existing food item, so that each ingredient connects to the pantry and the pantry gets no second note for a food that it has.

## Requirements

1. An ingredient line with no food item shows the chip "New: Kosher salt" in place of "No food item"
   - a. The name on the chip is the name of the line, with a capital first letter
2. Tap the chip to find an existing food item
   - a. A find field opens below the line, with the food items of the pantry
   - b. Tap a food item to select it. The line shows "1 tsp · Salt", and the chip goes away
   - c. The text of the line does not change
3. With no tap, "Save" makes a [stub](../../initiatives/recipe-intake/glossary.md): the note `<Name>.md` in the pantry folder of the settings
   - a. The stub has no property and no row
   - b. Two lines with the same new name make one stub
   - c. The ingredient is a link to the stub: `_250 ml_ [[Larder/Pantry/Buttermilk|buttermilk]]`
4. An ingredient with a selected food item is a link to that food item: `_1 tsp_ [[Larder/Pantry/Salt|kosher salt]]`
5. A line with two food items or more shows no chip, and "Save" makes no stub for it

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs). The pantry has no note `Buttermilk` and no note `Kosher salt`.

1. GIVEN an empty ingredient line WHEN the cook types "250 ml buttermilk" THEN the line shows the chip "New: Buttermilk"
2. GIVEN the line "1 tsp kosher salt" shows "New: Kosher salt" WHEN the cook taps the chip and then "Salt" THEN the line shows "1 tsp · Salt"
   - a. AND the line still has the text "1 tsp kosher salt"
3. GIVEN the title "Buttermilk pancakes" and the line "250 ml buttermilk" WHEN the cook taps "Save" THEN the vault has the note `Larder/Pantry/Buttermilk.md` with no property and no row
   - a. AND the recipe note has the line `- _250 ml_ [[Larder/Pantry/Buttermilk|buttermilk]]`
4. GIVEN the line "1 tsp kosher salt" with the food item "Salt" selected WHEN the cook taps "Save" THEN the recipe note has the line `- _1 tsp_ [[Larder/Pantry/Salt|kosher salt]]`
   - a. AND the vault has no note `Larder/Pantry/Kosher salt.md`
5. GIVEN the lines "250 ml buttermilk" and "100 ml buttermilk" WHEN the cook taps "Save" THEN the vault has one note `Larder/Pantry/Buttermilk.md`
6. GIVEN the line "300 g pasta" WHEN the cook looks at the line THEN it shows no chip

## Depends on

- [Add a recipe one line at a time](recipes-add-a-recipe-one-line-at-a-time.md): the line result and "Save" that this story changes for a line with no food item.

## Architecture

- [Food item note](../../architecture/food-item-note.md): a note with no row is a food item that is out.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): the pantry folder.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 4.
