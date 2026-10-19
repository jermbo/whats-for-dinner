---
title: Set the place and the date
summary: "The link 'Place and date' opens the place chips and the date field of the package with the handle, inside the card."
parent: pantry-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: [pantry-drag-a-package-on-the-card.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Set the place and the date

# Set the place and the date

As the [keeper](../../personas.md), I want to move a package to the freezer or set its date in the card, so that I do not leave the card for a second form.

## Requirements

1. The link "Place and date" opens a panel inside the card, below the links (decisions 20 and 32)
   - a. A second tap closes it
2. The panel is for the package with the handle (decision 32)
   - a. When the handle moves, the panel shows the new package
3. The places are chips of the list in the settings, and they wrap (decision 32)
   - a. A tap on a place moves the package to it. The package keeps its part on the bar until the card closes, and its colour changes
4. The date is one date field. An empty field is no date
5. "Done" writes the place and the date
6. Each part of the card stays inside its border at a width of 375 pixels and of 280 pixels (decision 21)
   - a. No chip, field, or button is cut or goes past the edge of the card
7. The panel opens and closes with a slide

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN the card of milk with the handle on the full jug WHEN the keeper taps "Place and date", "Freezer", and "Done" THEN `Milk.md` has `Freezer | full | 1 gal | 2026-10-29`
   - a. AND milk has a line in the group "Freezer"
2. GIVEN the panel of the jug of 2026-10-22 WHEN the keeper clears the date and taps "Done" THEN the row of that jug has no use-by date
3. GIVEN the card of black beans on a phone of 375 pixels WHEN the keeper opens "Place and date" THEN each chip and the date field are inside the card

## Depends on

- [Drag a package on the card](pantry-drag-a-package-on-the-card.md): the card and the handle.

## Architecture

- [Pantry](../../architecture/pantry.md): the card.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 20, 21, and 32.
