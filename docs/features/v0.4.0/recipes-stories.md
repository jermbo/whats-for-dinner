---
title: Recipes stories
summary: "The user stories of recipe intake in version 0.4.0: eleven pieces of work, with the sequence in which they depend on each other."
parent: ../README.md
---

[Wiki](../../README.md) / [Features](../README.md) / Recipes stories

# Recipes stories

Your recipes are on cards, in cookbooks, and in old notes, and a step has no photo. This page lists the user stories of version 0.4.0 that change that. Each story is one piece of work that one agent or one person can complete.

## The goal of the feature

You type a recipe one line at a time, and "Save" gives a correct RecipeMD note, with a link or a **stub** for each ingredient. Each photo of a recipe stays with the recipe: the **source photo**, the **step photo**, and the photo of a meal. **Cook Mode** selects the food item to use, and the **gallery** shows your meals.

The [spec](../../initiatives/recipe-intake/spec.md) has the scope that is agreed, and each line of it names its decision. The [glossary of the initiative](../../initiatives/recipe-intake/glossary.md) has the new words.

## The stories

| Story                                                                                                    | Persona | Depends on           | Status       |
| -------------------------------------------------------------------------------------------------------- | ------- | -------------------- | ------------ |
| 1. [Add a recipe one line at a time](recipes-add-a-recipe-one-line-at-a-time.md)                         | Cook    | Nothing              | `built`      |
| 2. [Pick tags and see a title in use](recipes-pick-tags-and-see-a-title-in-use.md)                       | Cook    | Story 1              | `built`      |
| 3. [Make a stub for a new food](recipes-make-a-stub-for-a-new-food.md)                                   | Cook    | Story 1              | `built`      |
| 4. [See all food that needs a look](../v0.2.0/shop-see-all-food-that-needs-a-look.md) (changed)          | Planner | Nothing              | `built`      |
| 5. [Keep each photo of a recipe with the recipe](recipes-keep-each-photo-with-the-recipe.md)             | Writer  | Nothing              | `built`      |
| 6. [Keep the source and its photos at intake](recipes-keep-the-source-and-its-photos.md)                 | Cook    | Stories 1 and 5      | `built`      |
| 7. [Take a photo of a step](recipes-take-a-photo-of-a-step.md)                                           | Cook    | Story 5              | `built`      |
| 8. [Mark the best photo of a step](recipes-mark-the-best-photo-of-a-step.md)                             | Cook    | Story 7              | `built`      |
| 9. [Get out selects the food item](recipes-get-out-selects-the-food-item.md)                             | Cook    | Nothing              | `built`      |
| 10. [See the meals of a recipe in a gallery](recipes-see-the-meals-in-a-gallery.md)                      | Planner | Nothing              | `built`      |
| 11. [Convert a note that fails](recipes-convert-a-note-that-fails.md)                                    | Writer  | Stories 1, 2, and 6  | `built`      |

Story 4 is a story of version 0.2.0. Its rule for "Out" changed in this version. The [personas](../../personas.md) page tells who the cook, the planner, and the writer are.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives three steps. The stories of one step can be built at the same time.

| Step | Stories            | What you have after the step                                                                       |
| ---- | ------------------ | -------------------------------------------------------------------------------------------------- |
| 1    | 1, 4, 5, 9, and 10 | Intake that saves a correct recipe, each food with no row as "Out", photos in `Recipes/Photos`, the selected pasta, and the gallery. |
| 2    | 2, 3, 6, and 7     | Tags, stubs, the source with its photos, and a photo for each step.                                |
| 3    | 8 and 11           | The best photo of a step, and old notes that become recipes.                                       |

## Architecture pages

Each story updates the wiki pages **before** its code, in the **Elevate** step of [implement](../../standards/workflow.md).

| Page                                                                 | Stories that update it                                                    |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Intake](../../architecture/intake.md) (new)                         | 1: the fields, the result of a line, and "Save". 2, 3, and 6: the tags, the stub, and the source. 11: "Convert", with its own page [Convert](../../architecture/convert.md). |
| [Gallery](../../architecture/gallery.md) (new)                       | 10: the records with a photo, and the card photo.                         |
| [Recipes](../../architecture/recipes.md)                             | 1: the plugin writes the text of a recipe. 10: the photo of a card. 11: "Convert". |
| [Recipe note](../../architecture/recipe-note.md)                     | 1: the links that intake makes. 6: the source line and the source photos. 7 and 8: the step photos and `\|best`. |
| [Steps](../../architecture/steps.md)                                 | 7: a photo is not text of a step, in a list item and in a paragraph. 8: the best photo. |
| [Cook Mode](../../architecture/cook-mode.md)                         | 7 and 8: the camera button and the photo of a step page. 9: the selected food item on "Get out". |
| [End of a meal](../../architecture/end-of-a-meal.md)                 | 5: the folder and the quality of the photo. 9: the last page asks for no food item. |
| [Suggestions](../../architecture/suggestions.md)                     | 4: each food item with no row is "Out".                                  |
| [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md)   | 3: the stubs in the pantry folder. 5: the folder `Photos`.                |
| [Food item note](../../architecture/food-item-note.md)               | 3: a stub has no property and no row.                                     |
| [Glossary](../../glossary.md)                                        | 1: intake and line. 3: stub. 6: source photo. 7: step photo. 10: gallery. |

## What the vault needs

The test vault today has only `Sugar` and `Onions` in `Larder/Pantry`, and no folder `Recipes`. The settings already have the recipes folder `Recipes` and the pantry folder `Larder/Pantry`. Before the first story, copy these notes from `test-vault/_old`:

| Copy from `_old`                                                                                                   | To                  | For stories             |
| ------------------------------------------------------------------------------------------------------------------ | ------------------- | ----------------------- |
| `Pantry/` Baking powder, Butter, Eggs, Elbow pasta, Flour, Milk, Salt, Shell pasta, and Sugar (replace the live `Sugar`) | `Larder/Pantry/`    | 1 to 3, 6, 9            |
| `Recipes/Pancakes.md` and `Recipes/Pasta with tomato sauce.md`                                                     | `Recipes/`          | 2, 5, 7 to 10           |
| `Edge cases/Recipe with steps as paragraphs.md`, with the new name `Boiled eggs.md`                                | `Recipes/`          | 2, 7                    |
| `Recipes-before-recipemd/Old Fashioned Lemonade.md`                                                                | `Recipes/`          | 11                      |

Story 4 uses the vault of [Shop stories](../v0.2.0/shop-stories.md). Story 8 and story 10 each give the lines that `Pancakes.md` must have, and the photos of those lines.

## The form of a story

Each story has the form that the [user story](../../standards/user-story.md) page gives.

## Further reading

- [Workflow](../../standards/workflow.md): where the stories come from, and what occurs after them.
- [Decision log: recipe intake](../../initiatives/recipe-intake/decision-log.md): the reasons behind the spec.
