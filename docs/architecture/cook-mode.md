---
title: Cook Mode
summary: 'What occurs from the button "Cook" to a correct pantry: the pages of Cook Mode, the timers, and the record of the meal.'
parent: ../README.md
---

[Wiki](../README.md) / Cook Mode

# Cook Mode

When you cook, your hands are dirty and your eyes are on the pan. So Cook Mode shows one thing at a time, in large type, with two large buttons. This page tells what its pages do, and what it writes when you finish.

## One page at a time

1. **Get out.** The ingredients, in the groups of the recipe, such as "Dry" and "Wet". You mark what is on the counter. A line that the pantry does not have shows "None", a line with too little shows "Low", and a line that the plugin cannot count shows "Check", as the [match](match.md) tells.
2. **The steps.** One page for each step, with its text and the ingredients that the text names.
3. **Done.** You confirm what you used. You can add a rating, a note, and a photo.

The two buttons do not move from page to page. The screen stays on while Cook Mode is open.

## Get out selects the food item

An ingredient such as "pasta" can fit two food items: elbow pasta and shell pasta. On "Get out", that line shows each of them that has a row with an amount that [compares](amounts.md) with the recipe, and the plugin selects one before you tap, so that the food is used wisely. Three rules decide, in this sequence. A rule that keeps one food item decides.

1. The food item with the earliest [use-by date](use-soon.md). A food item with no date comes last.
2. The food item that the recipe uses up: the recipe needs as much as the pantry has of it, or more.
3. The food item that the pantry has the most of.

The recipe needs 300 g of pasta. With 200 g of shell pasta and 2.3 kg of elbow pasta, the shell pasta is selected, so that no small rest stays in the cupboard. Tap the other one to change it. Until you tap, the line shows "Which one?", but "Next" works: the selected food item is usually correct, and you only check it. The last page uses the same options, so it takes the food out of the food item that you saw selected.

## What a step is

The format of a [recipe](recipes.md) does not define a step. So the plugin has its own rule: each item of a list in the instructions is a [step](steps.md). With no list, each paragraph is a step.

## A step can show how it must look

Each step page has a camera button. The photo goes into the vault at once, below its step in the [note](steps.md), so it stays when you close Cook Mode before the last page. The next time, the step page shows the best photo of the step, next to the text. With no best photo, it shows the newest.

A tap on the photo shows each photo of the step, the newest first. The view grows from the photo, and it covers only the card, so the two buttons of Cook Mode stay. The focus goes to "Close", and Escape also closes the view. Each one has a button "Best". A tap moves the mark to that photo, so a step has one best photo or none. A tap on the best photo takes the mark away.

## A step with a time has a timer

The step "Cook the onion for 5 minutes" shows a [timer](timers.md) of 5:00. The first time in the text counts. A timer continues when you go to a different step, and the top of the screen shows it there. When the time is up, the alarm rings until you tap "OK", or for one minute.

## The end makes the pantry correct

The [last page](end-of-a-meal.md) lists each ingredient that the plugin can count, with its amount. You take the mark off an ingredient that you did not use. Then "Update the pantry" does three things:

- It takes each amount out of its food item in the [pantry](pantry.md). The row with the first use-by date gives its food first.
- It adds a line below the heading "Cooked" of the recipe note: the date, the rating, your note, and the photo.
- It marks the meal as cooked in the [plan](plan.md).

The photo from a phone is large, so the plugin makes it smaller, with no visible loss, before it goes into the folder `Photos` of the recipes folder.

## The note comes back

The next time that you cook this recipe, each page shows the note that you wrote.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): why the plugin writes notes and has no database.
