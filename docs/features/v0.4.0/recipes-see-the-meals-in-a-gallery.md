---
title: See the meals of a recipe in a gallery
summary: "A recipe card shows the photo of its newest meal, and a tap opens a gallery of each meal with a photo, its date, its rating, and its note."
parent: recipes-stories.md
persona: Planner
depends-on: []
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / See the meals of a recipe in a gallery

# See the meals of a recipe in a gallery

As the [planner](../../personas.md), I want a recipe card to show the photo of the last meal of the recipe, and a tap to show each meal with a photo, full screen, so that I see how the meal was and what I wrote before I put it in the plan.

## Requirements

1. A recipe card in the Recipes part shows the photo of the newest [record](../../glossary.md) with a photo
   - a. A recipe with no record with a photo shows no photo
2. Tap the photo of a card to open the [gallery](../../initiatives/recipe-intake/glossary.md) of that recipe
   - a. The command "Open the gallery" of Obsidian also opens it, for the recipe note that is open in the editor
   - b. The command is not available when the open note is not a recipe with a record with a photo
3. The gallery shows one record at a time, full screen
   - a. The photo, the date, the rating as stars, and the note of the record
   - b. A record with no rating or no note shows no empty line for it
   - c. The newest record is first
   - d. A record with no photo is not in the gallery
4. Swipe to the left to go to the next older record, and to the right to go back
   - a. The photo follows the finger. With "Reduce motion", the next record shows with no motion
   - b. On the computer, the arrow keys do the same
5. Tap "Close" to go back to where you were

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs). `Recipes/Pancakes.md` ends with this record, and the two photos are in `Recipes/Photos`:

```markdown
## Cooked

- 2026-10-04 · ★★★☆☆ · Too thin
  ![[Pancakes 2026-10-04.jpg]]
- 2026-10-11 · ★★★★☆
- 2026-10-18 · ★★★★★ · Less sugar for the children
  ![[Pancakes 2026-10-18.jpg]]
```

1. GIVEN the Recipes part WHEN the planner looks at the card "Pancakes" THEN it shows the photo `Pancakes 2026-10-18.jpg`
2. GIVEN the Recipes part WHEN the planner looks at the card "Pasta with tomato sauce" THEN it shows no photo
3. GIVEN the card "Pancakes" WHEN the planner taps its photo THEN the gallery shows `Pancakes 2026-10-18.jpg` full screen
   - a. AND it shows "18 Oct", five stars, and "Less sugar for the children"
4. GIVEN the gallery shows the record of 2026-10-18 WHEN the planner swipes to the left THEN the gallery shows the record of 2026-10-04, with "Too thin"
5. GIVEN the gallery shows the record of 2026-10-04 WHEN the planner swipes to the right THEN the gallery shows the record of 2026-10-18
6. GIVEN `Recipes/Pancakes.md` is open in the editor WHEN the writer runs the command "Open the gallery" THEN the gallery of "Pancakes" opens
7. GIVEN the gallery is open WHEN the planner taps "Close" THEN the Recipes part shows again

## Depends on

Nothing. This story can start now. The records with a photo are there today.

## Architecture

- [End of a meal](../../architecture/end-of-a-meal.md): the record, with its date, rating, note, and photo.
- [Recipes](../../architecture/recipes.md): the recipe list and its cards.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 10. This story writes the new architecture page "Gallery".
