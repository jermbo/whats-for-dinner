---
title: Mark the best photo of a step
summary: "A tap on the photo of a step shows its other photos, and Best moves the mark that tells which photo the step page shows."
parent: recipes-stories.md
persona: Cook
depends-on: [recipes-take-a-photo-of-a-step.md]
status: built
updated: 2026-10-18
---

[Wiki](../../README.md) / [Features](../README.md) / [Recipes stories](recipes-stories.md) / Mark the best photo of a step

# Mark the best photo of a step

As the [cook](../../personas.md), I want to see all the photos of a step and to mark the one that shows how the food must look, so that the step page shows that photo and not only the newest one.

## Requirements

1. Tap the photo of a step page to see each photo of that step
   - a. The newest photo is first
   - b. The view opens with a short motion from the photo. With "Reduce motion", it opens with no motion
   - c. Tap "Close" to go back to the step
2. Each photo of the view has a button "Best"
   - a. The best photo shows "Best" as selected
   - b. Tap "Best" to write `|best` in the link of that photo: `![[Pancakes - step 3 2026-10-11.jpg|best]]`
   - c. The tap takes `|best` out of the link of the old best photo of the step
   - d. Tap "Best" on the best photo to take the mark away. Then the step has no best photo
3. The step page shows the best photo of its step
   - a. With no mark, it shows the newest photo, as [Take a photo of a step](recipes-take-a-photo-of-a-step.md) tells
   - b. A mark that you typed in the note counts the same

## Acceptance criteria

Each criterion starts with the recipe vault of the [list page](recipes-stories.md#what-the-vault-needs). Item 3 of `Recipes/Pancakes.md` has two photos:

```markdown
3. Add the wet mix to the dry mix. Stir until there are no large lumps.
   ![[Pancakes - step 3 2026-10-11.jpg]]
   ![[Pancakes - step 3 2026-10-18.jpg]]
```

1. GIVEN step 3 of "Pancakes" WHEN the cook taps the photo THEN the view shows 2 photos, the photo of 2026-10-18 first
2. GIVEN the view of step 3 WHEN the cook taps "Best" on the photo of 2026-10-11 THEN the link in the note is `![[Pancakes - step 3 2026-10-11.jpg|best]]`
   - a. AND the step page shows the photo of 2026-10-11 after "Close"
3. GIVEN the photo of 2026-10-11 is the best WHEN the cook taps "Best" on the photo of 2026-10-18 THEN the note has `![[Pancakes - step 3 2026-10-18.jpg|best]]`
   - a. AND the link of 2026-10-11 has no `|best`
4. GIVEN the photo of 2026-10-11 is the best WHEN the cook taps "Best" on it THEN no link of step 3 has `|best`
   - a. AND the step page shows the photo of 2026-10-18
5. GIVEN the writer typed `|best` after the link of 2026-10-11 in the note WHEN the cook opens step 3 THEN the step page shows the photo of 2026-10-11

## Depends on

- [Take a photo of a step](recipes-take-a-photo-of-a-step.md): the step photos and the step page that shows one of them.

## Architecture

- [Steps](../../architecture/steps.md): the photos of a step.
- [Cook Mode](../../architecture/cook-mode.md): the step pages.
- [Spec: recipe intake](../../initiatives/recipe-intake/spec.md): scope 8.
