---
title: Label a staple
summary: "The keeper labels a food item as a staple, and selects how often it is bought."
parent: shop-stories.md
persona: Keeper
depends-on: []
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Label a staple

# Label a staple

As the [keeper](../../personas.md), I want to label a food item as a staple and to select how often I buy it, so that the plugin knows which food I always want.

## Requirements

1. The form of a row shows the kind of its food item
   - a. The options are "Not a staple", "Often", "Sometimes", and "Seldom"
   - b. One option is on
   - c. With no property `staple` in the food item note, "Not a staple" is on
2. Tap an option to select it
3. Tap "Save" to write the kind into the food item note
   - a. "Often" writes `staple: often`, "Sometimes" writes `staple: sometimes`, and "Seldom" writes `staple: seldom`
   - b. "Not a staple" takes `staple` out of the note
   - c. The plugin writes `staple` only when the kind changed
4. Tap "Cancel" to close the form with no change of the kind
5. The plugin reads a kind that you type into the note
   - a. Capital and small letters are the same
   - b. A value that is not one of the three kinds counts as no staple

## Acceptance criteria

Each criterion starts with the eggs of the test vault: 6 in "Outside fridge", with the use-by date 2026-10-25, and no property `staple`.

1. GIVEN the note `Eggs` has no property `staple` WHEN the keeper opens the form of the row of eggs THEN the form shows 4 options
   - a. AND the option "Not a staple" is on
2. GIVEN the form of eggs is open WHEN the keeper taps "Often" THEN the option "Often" is on
   - a. AND no other option is on
3. GIVEN the keeper tapped "Often" WHEN the keeper taps "Save" THEN the note `Eggs` has `staple: often`
   - a. AND the row "Outside fridge" has "6" and the date 2026-10-25
4. GIVEN the note `Eggs` has `staple: often` WHEN the keeper opens the form of the row of eggs THEN the option "Often" is on
5. GIVEN the note `Eggs` has `staple: often` WHEN the keeper taps "Sometimes" and taps "Save" THEN the note has `staple: sometimes`
6. GIVEN the note `Eggs` has `staple: often` WHEN the keeper taps "Seldom" and taps "Save" THEN the note has `staple: seldom`
7. GIVEN the note `Eggs` has `staple: often` WHEN the keeper taps "Not a staple" and taps "Save" THEN the note has no property `staple`
8. GIVEN the note `Eggs` has no property `staple` WHEN the keeper changes only the amount to "8" and taps "Save" THEN the note has no property `staple`
9. GIVEN the form of eggs is open and the keeper tapped "Often" WHEN the keeper taps "Cancel" THEN the note has no property `staple`
10. GIVEN you typed `staple: Seldom` into the note `Salt` WHEN the keeper opens the form of the row of salt THEN the option "Seldom" is on
11. GIVEN you typed `staple: weekly` into the note `Salt` WHEN the keeper opens the form of the row of salt THEN the option "Not a staple" is on

## Depends on

Nothing of this version. The form is the form of [Change a row](../v0.1.0/pantry-change-a-row.md), which is built.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the properties of the note, and what the plugin changes in it.
- [Low food](../../architecture/low-food.md): why you want some food always, plan or no plan.
