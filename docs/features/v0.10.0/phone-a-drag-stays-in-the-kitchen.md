---
title: A sideways drag stays in the kitchen
summary: "A drag on the bar of a card and a swipe on a photo of the gallery move the thing under the finger, and Obsidian does not open a side panel."
parent: phone-stories.md
updated: 2026-10-27
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Phone stories](phone-stories.md) / A sideways drag stays in the kitchen

# A sideways drag stays in the kitchen

As the [keeper](../../personas.md), I want a sideways drag in the kitchen to move the thing under my finger, so that Obsidian does not open a side panel while I set a package.

## Requirements

1. A drag to the side on the bar of an open card moves only the package, and Obsidian opens no side panel
   - a. Also when the drag starts at the left or the right edge of the bar
   - b. A drag up or down on the bar still scrolls, as before
2. A swipe to the side on the photo of the gallery goes to the next or the last record, and Obsidian opens no side panel
3. A tap on the bar sets the package under the finger to the nearest stop, as before
4. A swipe to the side on a different area of the kitchen opens the side panels of Obsidian, as before

## Acceptance criteria

Each criterion starts on the owner's Android phone, with the test vault.

1. GIVEN the card of Milk in "Fridge" is open WHEN the keeper drags the first jug from 1/4 to 3/4 THEN the first jug is at 3/4
   - a. AND no side panel of Obsidian opens
2. GIVEN the card of Milk in "Fridge" is open WHEN the keeper starts a drag at the left edge of the bar and drags to the right THEN the first jug fills
   - a. AND the left side panel of Obsidian does not open
3. GIVEN the card of Milk in "Fridge" is open WHEN the keeper drags up on the bar THEN the Pantry part scrolls
4. GIVEN the card of Milk in "Fridge" is open WHEN the keeper taps the middle of the second jug THEN the second jug is at 1/2
5. GIVEN the gallery of Pancakes on 18 October WHEN the keeper swipes to the left on the photo THEN the gallery shows 4 October
   - a. AND no side panel of Obsidian opens
6. GIVEN the Pantry part with no open card WHEN the keeper swipes to the right on a line THEN the left side panel of Obsidian opens

## Depends on

Nothing.

## Architecture

- [Card](../../architecture/card.md): the handle and the drag.
- [Gallery](../../architecture/gallery.md): the swipe between records.
