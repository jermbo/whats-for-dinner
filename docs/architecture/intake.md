---
title: Intake
summary: "How you make a recipe note from a card or a cookbook: one line at a time, with the food item of each line, and a correct note at Save."
parent: recipes.md
---

[Wiki](../README.md) / [Recipes](recipes.md) / Intake

# Intake

The kitchen reads only a [recipe note](recipe-note.md) in the RecipeMD format. A card from your family is not in that format, and nobody types italics and links at the stove. Intake is the screen that makes the note for you. This page tells how it reads what you type, and what "Save" writes.

## One line is one ingredient or one step

You start intake with the button "Add recipe" in the Recipes part, or with the command "Add recipe" of Obsidian. Intake has a field for the title, the tags, the source, the yield, the ingredients, and the steps, in this sequence. In the ingredients and the steps, you type one thing on each line. Enter gives the next line.

The plugin does not divide a line. "salt and pepper" is one line, so type two lines.

## Each line shows what the plugin read

Below each ingredient line, the plugin shows its result while you type:

1. The [amount](amounts.md) at the start: a number, and a unit when the next word is a unit, such as "g", "cup", or "can". "2 eggs" has the amount "2" and the name "eggs".
2. The food item of the name, with the rules of the [match](match.md). The name stops at a comma or a parenthesis: "2 eggs, beaten" is the food "eggs". "Save" writes the rest after the name: `_2_ [[Larder/Pantry/Eggs|eggs]], beaten`.

A range, such as "1 1/2 - 2 cups sugar" or "2 to 3 cloves garlic", has no form in RecipeMD. The amount is the low number, because the pantry can always give it, and the range stays in the note as text: `_1 1/2 cups_ [[Larder/Pantry/Sugar|sugar]] (1 1/2 - 2 cups)`.

| The pantry has                         | The line shows                       | "Save" writes                           |
| -------------------------------------- | ------------------------------------ | --------------------------------------- |
| One food item with that name           | "200 g · Flour"                      | `_200 g_ [[Larder/Pantry/Flour\|flour]]` |
| Two food items, such as two pastas     | "300 g · Elbow pasta or Shell pasta" | `_300 g_ pasta`                         |
| No food item                           | The chip "New: Buttermilk"           | `_250 ml_ [[Larder/Pantry/Buttermilk\|buttermilk]]` |

A line with two food items gets no link. The best pasta depends on the pantry on the day that you cook, so [Cook Mode](cook-mode.md) selects it then.

## A new food gets a stub

A line with no food item shows the chip "New: Buttermilk". With no tap, "Save" makes a stub: a [food item note](food-item-note.md) with that name in the pantry folder, with no property and no row. So the ingredient connects to the pantry, and the Shop part shows the food as [out](suggestions.md). Two lines with the same new food make one stub.

A line such as "kosher salt" must not become a second food item when the pantry has salt. A tap on the chip opens a find field with the food items of the pantry. Tap "Salt", and the line links to it: `_1 tsp_ [[Larder/Pantry/Salt|kosher salt]]`.

An old recipe can have a long name, such as "lemons plus more for garnishing if desired". The find field then also gives the text that you type as the name of the new food: type "lemons", and tap "New: Lemons". The text of the line does not change. When you change the text of a line, the line finds its food item again.

## The tags and the title

The tags field shows each tag of your recipes as a chip, from A to Z. A tap adds a tag, and a second tap takes it away. You can type a new tag. "Save" writes the tags in the sequence in which you added them, because the first tag is the type of the recipe, and the Plan needs it.

When the vault has a recipe with the same title, intake tells you. It does not stop you, because two versions of a recipe can both be correct. When the name of the note is in use, "Save" adds a number, such as `Pancakes 1.md`. Capital and small letters are the same here, because the disk of a Mac or a phone can ignore them.

## The source and its photos

A recipe comes from somewhere: a cookbook, a card, a web page. The field "Source" keeps it, such as "One Pan Wonders, page 46". The photo button keeps a source photo, from the camera or from the photos of the phone: the card in the hand of your grandmother, or the page of the cookbook. A photo of the finished food in the cookbook is a source photo too, because the [gallery](gallery.md) shows only your own meals.

The format has no field for a source or a photo, but its description is free text. So "Save" writes the line "Source: One Pan Wonders, page 46" below the title, and each source photo on its own line below it: `![[Crepes - source 2026-10-18.jpg]]`. The photos go into the vault only at "Save", with the [photo rules](end-of-a-meal.md) of the plugin. Intake that you close with no "Save" leaves nothing.

## "Save" writes a correct note

"Save" writes the note `<title>.md` in the recipes folder of the [settings](settings.md). The note has the title, the source, the tags in italics, the yield in bold, a rule, the ingredients as a list, a rule, and the steps as a numbered list. An empty line is not written. Each link has the text that you typed, so the note reads as your recipe, also with no plugin.

"Save" is not available while the title is empty, or while the yield has no number. The format needs a number in each yield. Intake tells you about the yield. An empty title only turns "Save" off, because each new recipe starts with no title.

When the vault cannot write the note, intake stays open with each field, and a notice of Obsidian tells why. You can try again.

## An example

You type "Crepes", "6 crepes", "200 g flour", "2 eggs", and the step "Mix all the ingredients.". The note gets `_200 g_ [[Larder/Pantry/Flour|flour]]` and `_2_ [[Larder/Pantry/Eggs|eggs]]`, and the Recipes part shows "Crepes" at once.

## Further reading

- [Recipe note](recipe-note.md): each part of the format that "Save" writes.
- [Convert](convert.md): how intake starts with the text of a note that is not a recipe.
