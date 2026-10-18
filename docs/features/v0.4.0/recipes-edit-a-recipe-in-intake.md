---
title: Edit a recipe in intake
summary: "A recipe gets a button Edit, which opens intake with its fields, and Save writes the change into the same note, with each part that intake has no field for."
parent: recipes-stories.md
persona: Cook
depends-on: [recipes-add-a-recipe-one-line-at-a-time.md, recipes-convert-a-note-that-fails.md]
status: built
updated: 2026-10-18
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Edit a recipe in intake

# Edit a recipe in intake

As the [cook](../../personas.md), I want to change a recipe in the same intake that made it, so that I can correct an amount or add a step on the phone with no Markdown, and the note keeps its groups, its photos, and its records.

## Requirements

1. Each recipe card has a button "Edit"
   - a. The command "Edit recipe" of Obsidian also opens it, for the recipe note that is open in the editor
   - b. The command is not available when the open note is not a recipe
2. Intake opens with the fields of the recipe
   - a. The title, the tags, the source, the description, the yield, the ingredients, and the steps
   - b. Each source photo of the note shows as a small image. "Remove" takes its link out of the note. The photo stays in the folder `Photos`
   - c. A group of ingredients, such as "Dry", is a line that ends with a colon: "Dry:". The line shows "Group"
   - d. A line that you do not change keeps its text in the note, with its link
   - e. A line that you change, or a new line, gets its result as in a new recipe, with a link or a chip "New"
3. "Save" replaces the text of the same note
   - a. The property block stays as it was
   - b. The note keeps its name, so each link to it still works. A new title changes only the title in the note
   - c. Each step keeps its photos, also when you change its text
   - d. Each text after the steps stays, such as the records of "Cooked"
   - e. The steps are a numbered list
4. Close intake with no "Save", and the note does not change
5. The title message does not count the recipe that you edit

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs).

1. GIVEN the card "Pancakes" WHEN the cook taps "Edit" THEN intake shows the title "Pancakes" and the yield "8 pancakes"
   - a. AND the ingredient lines start with "Dry:" and "200 g flour"
   - b. AND the steps have 5 lines
   - c. AND the title field does not tell that the vault has the recipe "Pancakes"
2. GIVEN intake has "Pancakes" WHEN the cook changes "200 g flour" to "250 g flour" and taps "Save" THEN `Recipes/Pancakes.md` has the line `- _250 g_ [[Larder/Pantry/Flour|flour]]` below `## Dry`
   - a. AND the group "Wet" still has `- *300 ml* milk`
   - b. AND the Recipes part shows "Pancakes", and not as a note that fails
3. GIVEN step 3 of "Pancakes" has a photo WHEN the cook changes the text of step 3 and taps "Save" THEN the line below the new text of step 3 is the link of the photo, with an indent
4. GIVEN "Pancakes" has the heading "Cooked" with records WHEN the cook taps "Save" THEN the note ends with the same records
5. GIVEN `Recipes/Pancakes.md` is open in the editor WHEN the cook runs the command "Edit recipe" THEN intake opens with "Pancakes"
6. GIVEN intake has "Pancakes" WHEN the cook closes intake with no "Save" THEN the note does not change

## Depends on

- [Add a recipe one line at a time](recipes-add-a-recipe-one-line-at-a-time.md): the intake and "Save".
- [Convert a note that fails](recipes-convert-a-note-that-fails.md): "Save" that replaces the text of the same note.

## Architecture

- [Edit](../../architecture/edit.md): which part of the note goes into which field, and what stays.
- [Intake](../../architecture/intake.md): the fields, the result of a line, and the groups.
- [Recipe note](../../architecture/recipe-note.md): the groups of ingredients, and the instructions.
