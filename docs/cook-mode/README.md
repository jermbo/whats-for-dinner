---
title: Cook Mode
summary: 'What occurs from the button "Cook" to a correct pantry: the pages of Cook Mode, the timers, and the record of the meal.'
parent: ../README.md
updated: 2026-10-11
---

[Wiki](../README.md) / Cook Mode

# Cook Mode

When you cook, your hands are dirty and your eyes are on the pan. So Cook Mode shows one thing at a time, in large type, with two large buttons. This page tells what its pages do, and what it writes when you finish.

## One page at a time

1. **Get out.** The ingredients, in the groups of the recipe, such as "Dry" and "Wet". You mark what is on the counter.
2. **The steps.** One page for each step, with its text and the ingredients that the text names.
3. **Done.** You confirm what you used. You can add a rating, a note, and a photo.

The two buttons do not move from page to page. The screen stays on while Cook Mode is open.

## What a step is

The format of a [recipe](../recipes/README.md) does not define a step. So the plugin has its own rule: each item of a list in the instructions is a step. With no list, each paragraph is a step.

## A step with a time has a timer

The step "Cook the onion for 5 minutes" shows a timer of 5:00. The first time in the text counts. A timer continues when you go to a different step, and the top of the screen shows it there. When the time is up, the alarm rings until you tap "OK", or for one minute.

## The end makes the pantry correct

The last page lists each ingredient that the plugin can count, with its amount. You take the mark off an ingredient that you did not use. Then "Update the pantry" does four things:

- It takes each amount out of its food item in the [pantry](../pantry/README.md). The row with the first use-by date gives its food first.
- It writes your rating as a property of the recipe note.
- It adds a line below the heading "Cooked" of the recipe note: the date, the rating, your note, and the photo.
- It marks the meal as cooked in the [plan](../plan/README.md).

The photo from a phone is large, so the plugin makes it small before it goes into the vault.

## The note comes back

The next time that you cook this recipe, each page shows the note that you wrote.

## Further reading

- [Notes of the kitchen](../notes-of-the-kitchen.md): why the plugin writes notes and has no database.
