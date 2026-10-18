---
title: Set what is left in a package
summary: "The open line of a food item shows its sealed packages as a count and a bar for each open package, as long as the package, with a step of 1/8 or of 1."
parent: packages-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: [packages-see-a-food-item-in-each-place.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Packages stories](packages-stories.md) / Set what is left in a package

# Set what is left in a package

As the [keeper](../../personas.md), I want to drag the bar of one package to what is left in it, so that a quarter gallon or 3 eggs is one move.

## Requirements

1. Tap a line to open its packages
   - a. Only for a line with an amount that the plugin can count
2. The open line shows the sealed packages as one count for each use-by date
   - a. The text is the number, "sealed", and the date: "5 sealed · 2027-03-01"
   - b. The counts are in the sequence of their dates. A count with no date is last
3. The open line shows one bar for each open package
   - a. The bars are in the sequence of their dates, as the counts are
   - b. Each bar shows its date
   - c. An empty row has no bar
4. The length of a bar is the size of its package
   - a. No bar stops at the full amount of the food item
   - b. The amount is not less than 0, and not more than the size
5. The amount snaps to a step
   - a. For a measure, the step is 1/8 of the size: 1/8 gal for 1 gal
   - b. For a count, the step is 1
   - c. The amount goes to the nearest step, and the middle of two steps goes up
   - d. The amount shows in the unit of its row, with eighths as fractions
6. A tap on a sealed count shows a bar for one package of that count (decision 28)
   - a. The bar starts full, and the count is 1 less
   - b. With no change, the package stays sealed
7. Each bar is amber while all rows of the food item together are at or below the low line
8. Tap "Done" to write each package that you changed
   - a. A package at its size is sealed
   - b. A package at 0 is an empty row, with the rules of [Keep one row for each package](packages-keep-one-row-for-each-package.md)
   - c. With no change, the plugin does not write the note
9. The arrow keys move the bar of the focus by one step
10. On a phone, a drag on a bar does not move Obsidian, as today
11. This story replaces requirements 2 to 5 and 7 of [Correct an amount with the bar](../v0.1.0/pantry-correct-an-amount.md)

## Acceptance criteria

Each criterion starts with the vault of the [list page](packages-stories.md#what-the-vault-needs).

1. GIVEN the pantry shows milk WHEN the keeper taps the line of milk THEN the open line shows "1 sealed · 2026-10-29"
   - a. AND one bar of 1 gal with the date 2026-10-22, at 1/2 gal
2. GIVEN the bar of the open jug of milk WHEN the keeper presses the bar at 0.27 gal THEN the amount is "1/4 gal"
3. GIVEN the bar of the open jug of milk WHEN the keeper presses the bar at 0.3 gal THEN the amount is "1/4 gal"
4. GIVEN the bar of the open jug of milk WHEN the keeper presses the bar at 0.32 gal THEN the amount is "3/8 gal"
5. GIVEN the open carton of eggs has 2 WHEN the keeper presses its bar at 3.2 THEN the amount is "3"
6. GIVEN the pantry shows black beans WHEN the keeper taps the line THEN the open line shows "5 sealed · 2027-03-01" and "2 sealed · 2027-06-01"
   - a. AND one bar of 15 oz at 7.5 oz
7. GIVEN the open line of black beans WHEN the keeper taps "5 sealed · 2027-03-01" THEN the count is "4 sealed · 2027-03-01"
   - a. AND a second bar of 15 oz shows, full
8. GIVEN the row of milk with the date 2026-10-29 is an empty row WHEN the keeper presses the bar of the open jug at 0.4 gal THEN the bar is amber
   - a. AND the amount is "3/8 gal"
9. GIVEN the keeper set the open jug to 1/4 gal WHEN the keeper taps "Done" THEN `Milk.md` has the row `Fridge | 1/4 gal | 1 gal | 2026-10-22`
   - a. AND the row with the date 2026-10-29 is as before
10. GIVEN the keeper set the open jug to 0 WHEN the keeper taps "Done" THEN `Milk.md` has the row `Fridge | 0 | 1 gal | 2026-10-22`
    - a. AND the open line shows no bar for that row
11. GIVEN the keeper changed no amount WHEN the keeper taps "Done" THEN the plugin does not write the note
12. GIVEN the focus is on the bar of the open jug at 1/2 gal WHEN the keeper presses the right arrow key THEN the amount is "5/8 gal"

## Depends on

- [See a food item in each place](packages-see-a-food-item-in-each-place.md): the line that opens.

## Architecture

- [Amount bar](../../architecture/amount-bar.md): the bars of the open line, their length, and their steps.
- [Level](../../architecture/level.md): the low line that makes a bar amber.
- [Spec: one row for each package](../../initiatives/one-row-for-each-package/spec.md): scope 5, 6, 8 a to c, and 8 f.
