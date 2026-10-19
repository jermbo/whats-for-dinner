---
title: Add a package
summary: "'+ Add package' on the card adds a full package with the size of the newest package of this place, and gives it the handle."
parent: pantry-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: [pantry-drag-a-package-on-the-card.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Add a package

# Add a package

As the [keeper](../../personas.md), I want to add a carton to the eggs with one tap, so that three cartons in a busy season are three taps.

## Requirements

1. The card has the button "+ Add package" next to "Done" (decision 28)
   - a. In a narrow column, the two buttons go one below the other, and each stays on one line
2. A tap adds a full package at the end of the bar (decisions 28 and 29)
   - a. Its size is the size of the newest package of this place. With no package here, the newest package of the food item
   - b. A measure is `full`, and a count is its size
   - c. Its place is the place of the card, and it has no date
3. The new package gets the handle, so that a drag or the date changes it at once (decision 28)
4. The part grows from zero width, and the total counts up to the new total
5. "Done" writes each new package as a new row

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN the card of eggs WHEN the keeper taps "+ Add package" two times THEN the bar has 4 parts and the total is "40"
   - a. AND after "Done", `Eggs.md` has two more rows `Fridge | 12 | 12 |`
2. GIVEN the card of milk WHEN the keeper taps "+ Add package" THEN the handle is on the new jug, and the scale shows "full of 1 gal"
3. GIVEN the card of milk with a new jug WHEN the keeper drags the new jug to 1/2 and taps "Done" THEN `Milk.md` has `Fridge | 1/2 | 1 gal |`
4. GIVEN the card of eggs in a column of 280 pixels WHEN the keeper looks at it THEN "+ Add package" and "Done" each show on one line

## Depends on

- [Drag a package on the card](pantry-drag-a-package-on-the-card.md): the card and the handle.

## Architecture

- [Pantry](../../architecture/pantry.md): the card.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 28 and 29.
