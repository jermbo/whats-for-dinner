---
title: Drag a package on the card
summary: "A tap on a line opens the card of the first design. A drag on a package snaps it to a quarter or to one, and 'Done' writes the note."
parent: pantry-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: [pantry-see-all-packages-on-one-bar.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Drag a package on the card

# Drag a package on the card

As the [keeper](../../personas.md), I want to open a food item and drag each package to what I see, so that the milk is correct with one move of my thumb.

## Requirements

1. A tap on a line opens its card, and a tap on a different line closes it (decision 27)
2. The card has the name, the place, "2 here · 3 places", and a large total of all places (decision 27)
   - a. With one place, the card shows only the count here
3. The card has one bar of 44 pixels, with one part for each package (decision 27)
   - a. The parts, their sequence, their colours, and amber are as on the line (story 3)
   - b. A thin line of the colour of the card is between two parts
4. The sequence of the parts stays fixed while the card is open (decision 29)
5. A press on the bar puts the olive handle on the package under the thumb (decision 27)
   - a. When the card opens, the handle is on the first package
6. A drag moves only the package with the handle, and it snaps to a stop (decision 27)
   - a. A measure has the stops 1/4, 1/2, 3/4, and full
   - b. A count has one stop for each, from 1 to the size
   - c. A drag stops at the first stop (decision 30)
   - d. A drag to the side moves the handle, and a drag up or down scrolls the list
   - e. The fill follows the thumb with no delay, and the handle grows a little while you drag
7. The arrow keys move the package with the handle by one stop
8. The scale below the bar shows 0, the package with the handle, and the size of all packages (decision 27)
   - a. "1/4 of 1 gal". A package in a different place shows its place first: "Freezer · 12 of 12"
9. The link "Empty" takes the package with the handle out of the card, with a slide (decisions 11 and 30)
10. "Done" writes each change into the note and closes the card (decision 27)
    - a. With no change, it writes nothing
    - b. A change removes `check: true` (decision 35)
11. "Cancel" closes the card and writes nothing
12. The bar has the role "slider" and a name in text, with no `aria-label`

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN the group "Fridge" WHEN the keeper taps the line of milk THEN the card shows "Milk", "Fridge · 2 here", and "1 1/4 gal"
   - a. AND the handle is on the jug at 1/4
   - b. AND the scale shows "1/4 of 1 gal" and "2 gal"
2. GIVEN the card of milk WHEN the keeper drags the full jug to the middle of its part THEN the jug is at 1/2 and the total is "3/4 gal"
   - a. AND after "Done", `Milk.md` has `Fridge | 1/2 | 1 gal | 2026-10-29`
3. GIVEN the card of eggs WHEN the keeper drags the first carton to 1/3 of its part THEN the scale shows "4 of 12"
4. GIVEN the card of black beans WHEN the keeper drags the first can to full THEN the handle stays on that can
   - a. AND the can stays the first part until the card closes
5. GIVEN the card of milk WHEN the keeper drags the jug at 1/4 to the left end THEN the jug stays at 1/4
6. GIVEN the card of milk WHEN the keeper taps "Empty" and "Done" THEN `Milk.md` has only the row of 2026-10-29
7. GIVEN the card of milk WHEN the keeper taps "Done" with no change THEN the plugin does not write `Milk.md`
8. GIVEN `Onions.md` with `check: true` WHEN the keeper drags the onions to 1/4 and taps "Done" THEN `Onions.md` has no property `check`

## Depends on

- [See all packages on one bar](pantry-see-all-packages-on-one-bar.md): the bar that the card makes large.

## Architecture

- [Pantry](../../architecture/pantry.md): the card.
- [Card](../../architecture/card.md): replaced by a page "Card" in the Elevate step.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 27, 29, 30, and 35.
