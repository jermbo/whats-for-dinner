---
title: Convert
summary: "How a note that is not a recipe becomes one: the button Convert, which text goes into which field of intake, and what stays."
parent: intake.md
---

[Wiki](../README.md) / [Recipes](recipes.md) / [Intake](intake.md) / Convert

# Convert

You wrote recipes before the plugin, each in your own way. The kitchen cannot read them, so the end of the recipe list shows each one as a note that fails. "Convert" makes such a note a correct recipe, one at a time, in the same [intake](intake.md) as a new recipe. This page tells which text goes into which field.

## The plugin knows words, not habits

Each person writes recipes in a different way, so the plugin has no rule for the habits of one vault. It knows only the common words of recipes, as the heading of a part. Capital and small letters are the same, and a ":" after the word counts the same.

| The note has                                        | It goes into               |
| --------------------------------------------------- | -------------------------- |
| The name of the note                                | The title field            |
| A first heading with that name, also as a link      | Nothing: it is the title   |
| A list below "Ingredients"                          | The ingredient lines       |
| A list below "Directions", "Instructions", "Method", or "Steps" | The step lines |
| The text below "Source" or "Sources"                | The source field           |
| A tag of Obsidian, such as `#05-Recipe/Summer`      | The tags field, with its `#` |
| All other text                                      | The description            |

With no such heading, the first list gives the ingredients, and each later list gives the steps. With no heading "Source", each link to the web outside the lists goes into the source field. A heading inside a part, such as "Pie Dough", stays in the description, because intake has no groups.

## Nothing is lost

Intake shows the description as a field, so you see each text that has no other field, and you can change it. A tag keeps its `#`, so the tag tree of Obsidian still finds the note.

"Save" replaces the text of the same note. The property block stays as it was, and the note keeps its name, so each link to it still works. The core plugin "File recovery" of Obsidian keeps the old version. Intake that you close with no "Save" does not change the note.

## An example

`Old Fashioned Lemonade.md` has the heading `## [[Old Fashioned Lemonade]]`, the parts "Ingredients", "Directions", and "Source", and two tags. After "Save", it starts with the title and "Source: Source Link: [Divas Can Cook](…)", and it has 3 ingredients, 14 numbered steps, and `_#05-Recipe/Drink/Non-Alcoholic, #05-Recipe/Holiday/Summer_`.

## Further reading

- [Recipe note](recipe-note.md): why a note is not a recipe.
