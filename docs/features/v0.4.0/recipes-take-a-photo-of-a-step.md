---
title: Take a photo of a step
summary: "On a step page of Cook Mode, the cook takes a photo, and it goes into the note below that step at once."
parent: recipes-stories.md
persona: Cook
depends-on: [recipes-keep-each-photo-with-the-recipe.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Take a photo of a step

# Take a photo of a step

As the [cook](../../personas.md), I want to take a photo on a step page of Cook Mode, and to see it on that page the next time I cook, so that I know what the food must look like at that step.

## Requirements

1. Each step page of Cook Mode has a camera button
   - a. It is large, as the other buttons of Cook Mode, and it does not move the two main buttons
   - b. On the phone, it opens the camera
2. A [step photo](../../initiatives/recipe-intake/glossary.md) goes into the vault at once, with the rules of [Keep each photo of a recipe with the recipe](recipes-keep-each-photo-with-the-recipe.md)
   - a. A photo stays when you close Cook Mode before the last page
3. The link of the photo goes into the recipe note, below the text of its step
   - a. In a step that is a list item, it is a line with an indent in that item: `   ![[Pancakes - step 3 2026-10-18.jpg]]`
   - b. In a step that is a paragraph, it is the line directly below the text, with no blank line
   - c. A second photo of a step goes below the first
4. A photo in a step is not text of the step
   - a. The step page does not show the link as text
   - b. The number of steps does not change
   - c. A timer and the ingredients of the step come from its text only
5. The step page shows the newest photo of its step, next to the text
   - a. A new photo fades in. With "Reduce motion", it shows with no motion

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs) on 2026-10-18.

1. GIVEN Cook Mode of "Pancakes" on step 3 WHEN the cook takes a photo THEN the folder `Recipes/Photos` has `Pancakes - step 3 2026-10-18.jpg`
   - a. AND item 3 of `Recipes/Pancakes.md` is:

      ```markdown
      3. Add the wet mix to the dry mix. Stir until there are no large lumps.
         ![[Pancakes - step 3 2026-10-18.jpg]]
      ```

   - b. AND step 3 shows the photo
2. GIVEN the cook took a photo on step 3 WHEN the cook closes Cook Mode on step 4 THEN the note still has the photo below step 3
3. GIVEN Cook Mode of "Boiled eggs" on step 2 WHEN the cook takes a photo THEN the second paragraph of the instructions is:

   ```markdown
   Put the eggs in the water with a spoon. Cook for 7 minutes.
   ![[Boiled eggs - step 2 2026-10-18.jpg]]
   ```

   - a. AND "Boiled eggs" has 3 steps
   - b. AND step 2 has a timer of 7:00
4. GIVEN "Pancakes" has a photo below step 3 WHEN the cook opens step 3 THEN the text of the step does not show `![[`
   - a. AND "Pancakes" has 5 steps
5. GIVEN step 3 has a photo of 2026-10-11 and a photo of 2026-10-18 WHEN the cook opens step 3 THEN the step shows the photo of 2026-10-18

## Depends on

- [Keep each photo of a recipe with the recipe](recipes-keep-each-photo-with-the-recipe.md): the folder, the name, and the size of a step photo.

## Architecture

- [Steps](../../architecture/steps.md): how the plugin finds the steps, which this story changes for a photo.
- [Cook Mode](../../architecture/cook-mode.md): the step pages and their two buttons.
- [Recipe note](../../architecture/recipe-note.md): the instructions, which permit all Markdown.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 7, and scope 8 a with no mark.
