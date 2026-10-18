---
title: Keep each photo of a recipe with the recipe
summary: "Each photo of a recipe goes into the folder Photos of the recipes folder, with an automatic name, as a sharp JPEG that Obsidian Sync takes."
parent: recipes-stories.md
persona: Writer
depends-on: []
status: built
updated: 2026-10-18
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Keep each photo of a recipe with the recipe

# Keep each photo of a recipe with the recipe

As the [writer](../../personas.md), I want each photo of a recipe in one folder next to my recipes, with a name that tells its recipe and its day, and small enough for Obsidian Sync with no visible loss, so that the recipes and their photos move as one unit and I type no name.

## Requirements

1. Each photo of a recipe goes into the folder `Photos` in the recipes folder of the settings, such as `Recipes/Photos`
   - a. This is true for a source photo, a step photo, and the photo of a meal
   - b. The plugin makes the folder when it saves the first photo
   - c. The photo of a meal from the last page of Cook Mode uses this folder from this story on
2. The plugin names each photo from the name of the recipe note, the part, and the date of today
   - a. The photo of a meal: `Pancakes 2026-10-18.jpg`
   - b. A step photo: `Pancakes - step 3 2026-10-18.jpg`
   - c. A source photo: `Pancakes - source 2026-10-18.jpg`
   - d. When a name is in use, Obsidian adds a number: `Pancakes 2026-10-18 1.jpg`
3. The plugin draws each photo again as a JPEG with the quality 100%
   - a. The longest side is 1600 pixels or less
   - b. A photo that is smaller keeps its size
4. The record of the meal links the photo, as today

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs) on 2026-10-18. The vault has no folder `Recipes/Photos`.

1. GIVEN the last page of Cook Mode for "Pancakes" with a photo WHEN the cook taps "Update the pantry" THEN the vault has the folder `Recipes/Photos`
   - a. AND the folder has the photo `Pancakes 2026-10-18.jpg`
   - b. AND the record of 2026-10-18 in `Recipes/Pancakes.md` links that photo
2. GIVEN `Recipes/Photos/Pancakes 2026-10-18.jpg` WHEN the cook cooks "Pancakes" again on 2026-10-18 with a photo THEN the folder has the photo `Pancakes 2026-10-18 1.jpg`
3. GIVEN a photo from the phone of 4032 × 3024 pixels WHEN the plugin saves it THEN the photo in the vault is 1600 × 1200 pixels
   - a. AND it is a JPEG with the quality 100%
   - b. AND it is less than 5 MB
4. GIVEN a photo of 1200 × 900 pixels WHEN the plugin saves it THEN the photo in the vault is 1200 × 900 pixels
5. GIVEN the recipe note `Pancakes`, the part "step 3", and the date 2026-10-18 WHEN the plugin names the photo THEN the name is `Pancakes - step 3 2026-10-18.jpg`
6. GIVEN the recipe note `Pancakes`, the part "source", and the date 2026-10-18 WHEN the plugin names the photo THEN the name is `Pancakes - source 2026-10-18.jpg`

## Depends on

Nothing. This story can start now.

## Architecture

- [End of a meal](../../architecture/end-of-a-meal.md): the photo of the record, which this story moves and makes sharper.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): the folders of the plugin.
- [Settings](../../architecture/settings.md): the recipes folder.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 9.
