---
title: Edit a recipe in its card
summary: "Edit opens the form of a recipe in its card: paper spreads from the button, the form is on it, and Save or Close takes the paper back."
parent: one-system-stories.md
updated: 2026-10-21
persona: Writer
depends-on: [one-system-what-you-must-get-first.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / Edit a recipe in its card

# Edit a recipe in its card

As the [writer](../../personas.md), I want to edit a recipe where I read it, so that a correction does not take me out of the list.

## Requirements

1. "Edit" on an open recipe opens the edit form in the card
   - a. The form has each field of the edit page of today, and "Save" writes the note as today
   - b. The recipe card does not open the edit page. The command "Edit recipe" from a note and "Convert" keep their page
2. Paper spreads from "Edit"
   - a. A circle of `surface` grows from the button over the ink until it covers the card, in 0.6 s
   - b. After 140 ms, the inside changes to the form, and the text of the card changes to the colours of paper
   - c. The fields show at once, on the paper
   - d. The card moves to the top of the screen, as when it opens
3. The head of the form has the size `title` in the card
4. "Save" and "Close" take the paper back
   - a. The circle goes back to the point of the last press in the card
   - b. After 140 ms, the inside changes back to the open recipe, with the new values
5. A tap on the head of the card closes the card and the form, with no save
6. With less motion, the form shows at once, with no circle

## Acceptance criteria

1. GIVEN Chicken noodle soup is open WHEN the writer taps "Edit" THEN paper spreads from "Edit", and the form shows in the card
   - a. AND the field "Title" has "Chicken noodle soup"
   - b. AND the Recipes part stays on the screen around the card
2. GIVEN the form of Chicken noodle soup WHEN the writer changes the yield to "8 servings" and taps "Save" THEN the paper goes back to "Save", and the open recipe shows "8 servings"
   - a. AND the note `Recipes/Chicken noodle soup.md` has "8 servings"
3. GIVEN the form of Chicken noodle soup WHEN the writer taps "Close" THEN the paper goes back to "Close", and the note does not change
4. GIVEN the form is open WHEN the writer taps the name of the card THEN the card closes, and the note does not change
5. GIVEN a note that is not a recipe WHEN the writer taps "Convert" THEN the page "Convert" opens, as today

## Depends on

- [What you must get first](one-system-what-you-must-get-first.md): the action "Edit".

## Architecture

- [Edit](../../architecture/edit.md): the edit of a recipe, and what "Save" keeps.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decisions 11 and 17.
