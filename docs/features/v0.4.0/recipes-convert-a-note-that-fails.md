---
title: Convert a note that fails
summary: "A note that is not a recipe gets a button Convert, which opens intake with its text and replaces it with a correct recipe."
parent: recipes-stories.md
persona: Writer
depends-on: [recipes-add-a-recipe-one-line-at-a-time.md, recipes-pick-tags-and-see-a-title-in-use.md, recipes-keep-the-source-and-its-photos.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Convert a note that fails

# Convert a note that fails

As the [writer](../../personas.md), I want to convert a recipe note that I wrote before the plugin, one at a time, in the same intake as a new recipe, so that it becomes a correct recipe and keeps its name, its properties, its tags, and each text that it has.

## Requirements

1. A note that fails gets a button "Convert" on its line in the Recipes list
   - a. A tap opens intake with the text of that note in the fields
2. The title field starts with the name of the note
   - a. A first heading with the same text, also as a link such as `## [[Old Fashioned Lemonade]]`, is that title. It does not go into the description
3. The lists of the note give the lines of the ingredients and of the steps
   - a. A list below a heading "Ingredients" gives the ingredient lines
   - b. A list below a heading "Directions", "Instructions", "Method", or "Steps" gives the step lines
   - c. Capital and small letters are the same, and a mark such as ":" after the word counts the same
   - d. With no such heading, the first list gives the ingredient lines, and each later list gives the step lines
   - e. Each line shows its result, as in a new recipe, with a link or a chip "New"
   - f. A heading inside such a part, such as "Pie Dough", stays in the description
4. Each tag of Obsidian in the text of the note goes into the tags field, with its `#`
   - a. "Save" writes it with its `#`: `_#05-Recipe/Drink/Non-Alcoholic, #05-Recipe/Holiday/Summer_`
5. The text below a heading "Source" or "Sources", up to the next heading, goes into the source field as it is
   - a. With no such heading, each link to the web outside the lists goes into the source field
6. All other text goes into the description, below the source, in its sequence
   - a. The headings "Ingredients", "Directions", "Instructions", "Method", "Steps", "Source", and "Sources" do not go into the description. Their text is in the fields
   - b. A video, a part such as "Details", and each other heading stay as they are
7. "Save" replaces the text of the same note
   - a. The property block stays as it was
   - b. The note keeps its name, so each link to it still works
   - c. The note shows in the Recipes list as a recipe, and not as a note that fails
   - d. The line of the note goes out of the list of notes that fail, with a short motion. With "Reduce motion", it goes with no motion
8. Close intake with no "Save", and the note does not change

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs), with `Recipes/Old Fashioned Lemonade.md` as it is in `test-vault/_old/Recipes-before-recipemd`.

1. GIVEN the Recipes list shows "Old Fashioned Lemonade" as a note that fails WHEN the writer looks at its line THEN the line has the button "Convert"
2. GIVEN the line "Old Fashioned Lemonade" WHEN the writer taps "Convert" THEN the title field has "Old Fashioned Lemonade"
   - a. AND the ingredients have 3 lines, the first "8 lemons plus more for garnishing if desired"
   - b. AND the steps have 14 lines, the first "Wash lemons thoroughly." and the last "Store in the refrigerator."
   - c. AND the tags are "#05-Recipe/Drink/Non-Alcoholic" and "#05-Recipe/Holiday/Summer"
   - d. AND the source field starts with "Source Link: [Divas Can Cook](https://divascancook.com/easy-homemade-lemonade-recipe-old-fashioned/)"
   - e. AND the source field has the line of the video
3. GIVEN intake has the text of "Old Fashioned Lemonade" WHEN the writer taps "Save" THEN the note `Recipes/Old Fashioned Lemonade.md` starts with this text:

   ```markdown
   # Old Fashioned Lemonade

   Source: Source Link: [Divas Can Cook](https://divascancook.com/easy-homemade-lemonade-recipe-old-fashioned/)
   ```

   - a. AND the description also has the line "tags:"
   - b. AND the note has the paragraph `_#05-Recipe/Drink/Non-Alcoholic, #05-Recipe/Holiday/Summer_`
   - c. AND the note has no heading `## [[Old Fashioned Lemonade]]`
   - d. AND the note has 3 ingredients and 14 numbered steps
   - e. AND the Recipes list shows "Old Fashioned Lemonade" as a recipe
   - f. AND the search for the tag `#05-Recipe/Holiday/Summer` in Obsidian finds the note
4. GIVEN the note starts with the property block `source: family` WHEN the writer converts it and taps "Save" THEN the note still starts with the property block `source: family`
5. GIVEN a note that fails with the text "- 4 eggs", a blank line, "Boil the eggs:", and the list "- Boil the eggs for 7 minutes." WHEN the writer taps "Convert" THEN the ingredients have the line "4 eggs"
   - a. AND the steps have the line "Boil the eggs for 7 minutes."
   - b. AND the description has "Boil the eggs:"
6. GIVEN a note that fails with no heading "Source" and the line "From [Grandma's blog](https://example.com/pie)" WHEN the writer taps "Convert" THEN the source field has "[Grandma's blog](https://example.com/pie)"
7. GIVEN intake has the text of "Old Fashioned Lemonade" WHEN the writer closes intake with no "Save" THEN the note does not change

## Depends on

- [Add a recipe one line at a time](recipes-add-a-recipe-one-line-at-a-time.md): the intake and "Save".
- [Pick tags and see a title in use](recipes-pick-tags-and-see-a-title-in-use.md): the tags field, which gets the tags of the note.
- [Keep the source and its photos at intake](recipes-keep-the-source-and-its-photos.md): the source field and the source line of the description.

## Architecture

- [Recipe note](../../architecture/recipe-note.md): why a note is not a recipe, and the properties that the plugin permits.
- [Recipes](../../architecture/recipes.md): the list of the notes that fail.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 11. This story adds "Convert" to the architecture page "Intake".
