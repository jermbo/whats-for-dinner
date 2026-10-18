---
title: Pick tags and see a title in use
summary: "The cook adds tags to a new recipe with one tap on a chip, and intake tells when the vault has a recipe with the same title."
parent: recipes-stories.md
persona: Cook
depends-on: [recipes-add-a-recipe-one-line-at-a-time.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Pick tags and see a title in use

# Pick tags and see a title in use

As the [cook](../../personas.md), I want to add the tags of a new recipe with one tap on a chip, and to see when the vault has a recipe with the same title, so that the plan knows the type of the recipe and I do not make a second recipe by accident.

## Requirements

1. Intake has a field for the tags, below the title
   - a. It shows each tag of the recipes in the vault as a chip, from A to Z
   - b. Tap a chip to add its tag. Tap it again to take the tag away
   - c. Type a new tag and press Enter to add it. It becomes a chip
   - d. A chip that you add moves into the tags of the recipe, with a short motion. With "Reduce motion", it moves with no motion
2. "Save" writes the tags as one paragraph in italics, below the title, in the sequence in which you added them
   - a. The first tag is the [type](../../glossary.md) of the recipe
   - b. With no tag, the note has no tags paragraph
3. When the vault has a recipe with the same title, intake tells you below the title field
   - a. Capital and small letters are the same
   - b. You can change the title there, and the message goes away
   - c. The message does not stop "Save"
   - d. When the name of the note is in use, "Save" adds a number to it, such as `Pancakes 1.md`. The title in the note does not change

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs).

1. GIVEN intake is open WHEN the cook looks at the tags field THEN it shows the chips "breakfast", "dinner", "fast", and "vegetarian"
2. GIVEN intake is open WHEN the cook taps "breakfast" and then "vegetarian" THEN the tags of the recipe are "breakfast" and "vegetarian"
3. GIVEN the tags "breakfast" and "vegetarian" WHEN the cook taps "breakfast" again THEN the tags of the recipe are "vegetarian"
4. GIVEN intake is open WHEN the cook types "brunch" in the tags field and presses Enter THEN the tags of the recipe are "brunch"
5. GIVEN the title "Crepes" and the tags "breakfast" and "brunch" WHEN the cook taps "Save" THEN the line below the title of `Recipes/Crepes.md` is `_breakfast, brunch_`
   - a. AND the filter of the type "breakfast" in the Recipes part shows "Crepes"
6. GIVEN the title "Crepes" and no tag WHEN the cook taps "Save" THEN the note has no paragraph in italics
7. GIVEN intake is open WHEN the cook types the title "pancakes" THEN intake tells that the vault has the recipe "Pancakes"
8. GIVEN intake tells that the title "Pancakes" is in use WHEN the cook changes the title to "Pancakes 2.0" THEN the message goes away
9. GIVEN the title "Pancakes" WHEN the cook taps "Save" THEN the vault has the note `Recipes/Pancakes 1.md` with the title "Pancakes"
   - a. AND the note `Recipes/Pancakes.md` does not change

## Depends on

- [Add a recipe one line at a time](recipes-add-a-recipe-one-line-at-a-time.md): the intake that this story adds the tags field and the title check to.

## Architecture

- [Recipe note](../../architecture/recipe-note.md): the tags paragraph.
- [Recipes](../../architecture/recipes.md): the type of a recipe is its first tag.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 2 d and 2 e.
