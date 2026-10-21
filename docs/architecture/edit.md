---
title: Edit
summary: "How a recipe goes back into intake: the button Edit, which part of the note goes into which field, and what stays when you save."
parent: intake.md
---

[Wiki](../README.md) / [Recipes](recipes.md) / [Intake](intake.md) / Edit

# Edit

A recipe changes: less sugar, one more step. You can change the note in the editor of Obsidian, but at the stove you do not type italics and links. "Edit" on an open recipe opens the same [intake](intake.md) that made it, on paper in the card, so you stay in the list. The command "Edit recipe" opens it as a page. This page tells which part of the note goes into which field, and what stays that intake has no field for.

## Each part has its field

| The note has                                     | It goes into                                  |
| ------------------------------------------------ | --------------------------------------------- |
| The title                                        | The title field                               |
| The tags and the yield                           | The tags field and the yield field            |
| A first paragraph that starts with "Source: "    | The source field                              |
| A paragraph of photo links below it              | The source photos                             |
| All other text of the description                | The description field                         |
| A heading in the ingredients, such as `## Dry`   | The ingredient line "Dry:"                    |
| An ingredient                                    | An ingredient line, such as "200 g flour"     |
| A step                                           | A step line, with no photo link               |

## A group is a line with a colon

A recipe card often says "For the dough:" above its ingredients. So in intake, a line that ends with a colon is a group, and "Save" writes it as a heading: "Dry:" is `## Dry`. This is true for a new recipe too. A group in a group of the note becomes a group of the first level, because intake has one level.

## A line that you do not change stays

"Save" writes a line that you did not change with the text that the note had, with its link and its italics. So a link that you selected earlier, such as `[[Larder/Pantry/Salt|kosher salt]]`, stays, and the plugin makes no stub for it. A line that you change, or a new line, is read as in a new recipe: it gets a link, or the chip "New".

## What has no field stays

- **The step photos.** Each step keeps its photo links, also when you change its text. They are the lines with an indent below the text of the step.
- **The text after the steps.** The records of "Cooked", and each other text of the instructions that is not a step, stay after the steps, in their sequence.
- **The property block.** It stays as it was.
- **The name of the note.** A new title changes only the heading of the note, so each link to the note still works.

The steps are a numbered list after "Save". A source photo that you remove loses only its link: the photo stays in the folder `Photos`, because the plugin does not delete a file.

## An example

You edit "Pancakes", and you change "200 g flour" to "250 g flour". The note gets `- _250 g_ [[Larder/Pantry/Flour|flour]]` below `## Dry`. The other lines keep their text, such as `- *300 ml* milk`, and the records of "Cooked" stay at the end.

## Further reading

- [Convert](convert.md): the same intake for a note that is not a recipe.
- [Recipe note](recipe-note.md): each part of the format.
