---
title: One ledger
summary: "The bins of the Pantry have no card: each place is a head over a heavy rule across the full width, and its lines fill columns under it, so a wide tab has no empty column."
parent: pantry-stories.md
updated: 2026-10-21
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / One ledger

# One ledger

As the [keeper](../../personas.md), I want the pantry to fill a wide screen with its lines, so that I see what I have with no empty column and no long scroll.

## Requirements

1. Each place is a bin with no card: its title in the display font and its count in the faint colour, over a rule of 4 px
   - a. The stickers "past", "soon", and "low" follow the count in the head, as before
   - b. The bin "Out" has a dashed rule, and its tags wrap across the full width
2. Each bin takes the full width of the part, and the next bin starts under it
3. The lines of a bin fill columns of 16 rem or more, from left to right, then down
   - a. Each bin has the same columns, so the lines of all bins line up
   - b. A phone has one column
4. An open card takes the full width of its bin, on the surface colour
5. The lines, the stickers, the bars, the open card, the filters, and the motion are as before

## Acceptance criteria

Each criterion starts with the pantry of the test vault, with "By place".

1. GIVEN the Pantry part WHEN the keeper looks at the bin "Freezer" THEN "Freezer" and "4" are over a rule of 4 px, with no card around the bin
2. GIVEN the Pantry part on a desktop, 1200 px wide WHEN the keeper looks at the bin "Kitchen pantry" THEN its lines are in 4 columns
   - a. AND the columns of "Fridge" line up with the columns of "Kitchen pantry"
   - b. AND no column of the part is empty while a bin has lines left
3. GIVEN the Pantry part on a phone WHEN the keeper looks at the bins THEN each bin has one column of lines
4. GIVEN the Pantry part on a desktop WHEN the keeper taps the line of Milk THEN its card takes the full width of the bin "Fridge"
5. GIVEN the Pantry part WHEN the keeper looks at the bin "Out" THEN its tags are under a dashed rule, and they wrap across the width

## Depends on

Nothing.

## Architecture

- [Pantry](../../architecture/pantry.md): the bins and their lines.
- [Decision log: pantry bins](../../initiatives/pantry-bins/decision-log.md): decisions 1, 2, 4, and 5.
