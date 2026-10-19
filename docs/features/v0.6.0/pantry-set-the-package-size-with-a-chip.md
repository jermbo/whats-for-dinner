---
title: Set the package size with a chip
summary: "The form of the food item has the package size as a number and a unit chip, the other names, the staple, and the brands. No unit is typed."
parent: pantry-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: [pantry-drag-a-package-on-the-card.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Set the package size with a chip

# Set the package size with a chip

As the [keeper](../../personas.md), I want to select the unit of a package from chips, so that a typo such as "1 gall" cannot happen.

## Requirements

1. The card has the link "Size, names, and brands", which opens the form of the food item (decision 20)
2. The form has the package size: one number field and one group of unit chips (decision 5)
   - a. The chips are "Count", tsp, tbsp, cup, fl oz, pt, qt, gal, ml, l, oz, lb, g, and kg, and they wrap
   - b. "Count" makes the size a plain number
   - c. The number field takes a whole number or a decimal, such as 1 or 3.5, and the phone shows the keypad of numbers
3. The size is for the next package: "+ Add package" and "Add to pantry" use it (decision 28)
   - a. "Save" does not change the size of a package that is there
4. The form has the other names, the staple, and the brands, as today (decisions 14 and 15)
5. The form has no field for the place, the amount, the low line, or "Loose" (decisions 12, 13, and 20)
6. "Save" writes the note and goes back to the card. "Cancel" writes nothing
7. Each part of the form stays inside its border at 375 and 280 pixels (decision 21)

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN the card of milk WHEN the keeper taps "Size, names, and brands" THEN the form shows "1" and the chip "gal" on
2. GIVEN the form of milk WHEN the keeper types "64", taps "fl oz", "Save", and "+ Add package" THEN the new package is "full of 64 fl oz"
   - a. AND the two jugs of 1 gal are as before
3. GIVEN the form of eggs WHEN the keeper looks at it THEN the chip "Count" is on and the number is "12"
4. GIVEN the form of milk on a phone of 375 pixels WHEN the keeper looks at it THEN each chip is inside the form

## Depends on

- [Drag a package on the card](pantry-drag-a-package-on-the-card.md): the card that opens the form.

## Architecture

- [Amounts](../../architecture/amounts.md): the unit list.
- [Food item note](../../architecture/food-item-note.md): what the form writes.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 5, 12 to 15, 20, and 28.
