---
title: Keep the source and its photos at intake
summary: "The cook types where a recipe comes from and takes photos of the card or the cookbook page, and Save puts them below the title."
parent: recipes-stories.md
persona: Cook
depends-on: [recipes-add-a-recipe-one-line-at-a-time.md, recipes-keep-each-photo-with-the-recipe.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Keep the source and its photos at intake

# Keep the source and its photos at intake

As the [cook](../../personas.md), I want to type where a recipe comes from and to take photos of the original at intake, so that the recipe note keeps the card of my grandmother or the page of the cookbook below its title.

## Requirements

1. Intake has a field "Source", such as "One Pan Wonders, page 46"
2. Intake has a camera button for [source photos](../../initiatives/recipe-intake/glossary.md)
   - a. On the phone, it opens the camera or the photos of the phone
   - b. Each photo shows as a small image in intake. A new image fades in. With "Reduce motion", it shows with no motion
   - c. A photo of the finished food at intake, such as the photo in the cookbook, is also a source photo
   - d. Tap "Remove" on an image to take it out of intake
3. "Save" puts the source into the description, below the title
   - a. The first line is "Source: " and the text of the field
   - b. Each source photo is a link on its own line, below the source line: `![[Crepes - source 2026-10-18.jpg]]`
   - c. "Save" writes the photos into the vault with the rules of [Keep each photo of a recipe with the recipe](recipes-keep-each-photo-with-the-recipe.md)
   - d. With no source and no photo, the note has no description
   - e. The tags and the yield come after the description

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs) on 2026-10-18.

1. GIVEN intake is open WHEN the cook takes a photo with the camera button THEN intake shows the photo as a small image
2. GIVEN intake shows 2 source photos WHEN the cook taps "Remove" on the first THEN intake shows 1 source photo
3. GIVEN the title "Crepes", the source "One Pan Wonders, page 46", and 2 source photos WHEN the cook taps "Save" THEN `Recipes/Crepes.md` starts with this text:

   ```markdown
   # Crepes

   Source: One Pan Wonders, page 46

   ![[Crepes - source 2026-10-18.jpg]]
   ![[Crepes - source 2026-10-18 1.jpg]]
   ```

   - a. AND the folder `Recipes/Photos` has the two photos
   - b. AND the Recipes part shows "Crepes", and not as a note that fails
4. GIVEN the title "Crepes" and 1 source photo with no source text WHEN the cook taps "Save" THEN the description of the note is the link of the photo
5. GIVEN 1 source photo WHEN the cook closes intake with no "Save" THEN the folder `Recipes/Photos` has no new photo

## Depends on

- [Add a recipe one line at a time](recipes-add-a-recipe-one-line-at-a-time.md): the intake and "Save".
- [Keep each photo of a recipe with the recipe](recipes-keep-each-photo-with-the-recipe.md): the folder, the name, and the size of a photo.

## Architecture

- [Recipe note](../../architecture/recipe-note.md): the description, which is zero or more paragraphs.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 2 f and 3 a.
