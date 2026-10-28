---
title: A linked title shows its name
summary: "A recipe title such as `# [[Apple Pie]]` shows as Apple Pie in each place of the kitchen, and the note keeps its brackets."
parent: phone-stories.md
updated: 2026-10-27
persona: Writer
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Phone stories](phone-stories.md) / A linked title shows its name

# A linked title shows its name

As the [writer](../../personas.md), I want to keep a link as the title of my recipe note, so that the title and the file name stay the same, and the kitchen shows only the name.

## Requirements

1. Each place of the kitchen that shows the name of a recipe shows each link of the title as its name
   - a. `[[Apple Pie]]` shows "Apple Pie"
   - b. A link with a name after `|` shows that name: `[[Apple Pie|Grandma's pie]]` shows "Grandma's pie"
   - c. Text outside the link stays: `[[Apple Pie]] (vegan)` shows "Apple Pie (vegan)"
   - d. The places: the recipe card, the Plan, the sides, Cook Mode, the gallery, and the recipes that the Shop list names
2. The sequence "A to Z" of the Recipes part uses the name that the kitchen shows
3. The note keeps its title exactly as you wrote it
   - a. "Edit" shows the title with its brackets, and "Save" writes it back with them
4. The link that the plugin writes into the meal plan note has the name with no brackets after `|`
5. Intake finds a recipe that is already there by the name that the kitchen shows

## Acceptance criteria

Each criterion starts with the test vault, in which the title of `Recipes/Boiled eggs.md` is `# [[Boiled eggs]]`.

1. GIVEN the Recipes part WHEN the writer looks at the card of the eggs THEN its name is "Boiled eggs", with no brackets
2. GIVEN the Recipes part with "A to Z" WHEN the writer looks at the sequence THEN "Boiled eggs" is after "Black bean soup" and before "Chicken fried rice"
3. GIVEN the eggs are not in the week WHEN the writer adds them to the week THEN their card in the Plan is "Boiled eggs"
   - a. AND the meal plan note has `[[Recipes/Boiled eggs|Boiled eggs]]`
4. GIVEN the eggs in Cook Mode WHEN the writer looks at the top of a step THEN the name is "Boiled eggs"
5. GIVEN the open card of the eggs WHEN the writer taps "Edit" and then "Save" with no change THEN the first heading of the note is `# [[Boiled eggs]]`
6. GIVEN the title is `# [[Boiled eggs|Eggs, boiled]]` WHEN the writer looks at the card of the eggs THEN its name is "Eggs, boiled"
7. GIVEN "Add recipe" WHEN the writer types the title "Boiled eggs" THEN intake tells that a recipe with that title is there, as for a title with no brackets

## Depends on

Nothing.

## Architecture

- [Recipe note](../../architecture/recipe-note.md): a link as the title.
