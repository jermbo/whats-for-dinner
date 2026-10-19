---
title: See all packages on one bar
summary: "Each line of the Pantry part has one bar with one part for each package, dark for this place and grey for other places, and the total of all places."
parent: pantry-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: [pantry-keep-a-level-or-a-count.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / See all packages on one bar

# See all packages on one bar

As the [keeper](../../personas.md), I want one bar that shows each package of a food item, so that two gallons of milk look like two gallons.

## Requirements

1. The Pantry part has one line for each food item in each place, in a group for each place, as today (decision 18)
2. A line has the name, the total of all places, and the count of packages: "1 1/4 gal · 2 packages" (decision 17)
3. A line has one bar for the food item, with one part for each package (decision 17)
   - a. A part is as long as its package size. When the sizes have different units, the parts are the same length
   - b. The fill of a part is its level, or its count against its size
   - c. A thin gap is between two parts
4. The packages of the place of the group come first, and their fill is dark. The fill of other places is grey (decision 18)
   - a. In each place, the packages are in the sequence of use: open first, then the first use-by date
5. The fill of a food item that is low is amber (decision 12)
6. A metric total shows as on a label, and other units show in quarters (decision 31)
   - a. Less than 1000 is in g or ml. 1000 or more is in kg or l, with one decimal: "3.2 kg"
   - b. Other units: "1 1/4 gal"
   - c. A count: "16"
7. A food item that is out shows as a dashed line in the group "Out", as today (decision 11)
8. The badge of the first use-by date of the line stays, as today
9. The bar has no tooltip and no `aria-label`. The line says the total and "low" in text for a screen reader

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN the Pantry part "By place" WHEN the keeper looks at the group "Fridge" THEN the line of milk shows "1 1/4 gal · 2 packages"
   - a. AND its bar has two parts of the same length: one at 1/4, and one full
2. GIVEN the Pantry part WHEN the keeper looks at black beans THEN the line shows "3.2 kg · 8 packages"
   - a. AND the bar has 8 parts, and the first part is at 1/2
3. GIVEN eggs with the rows `Fridge | 4 | 12` and `Freezer | 12 | 12` WHEN the keeper looks at the group "Fridge" THEN the first part of the bar is dark and the second part is grey
   - a. AND in the group "Freezer", the first part is the full carton, dark, and the second part is grey
4. GIVEN `Milk.md` with only the row `Fridge | 1/4 | 1 gal` WHEN the Pantry part opens THEN the fill of milk is amber
5. GIVEN the Pantry part on the computer WHEN the pointer is on a bar THEN no tooltip shows

## Depends on

- [Keep a level or a count](pantry-keep-a-level-or-a-count.md): the packages that the bar shows.

## Architecture

- [Pantry](../../architecture/pantry.md): the line and its bar.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 17, 18, and 31.
