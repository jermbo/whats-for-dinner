---
title: Add and use up a package
summary: "In the open line, one tap adds a package or uses one up, and the form of a row shows its size."
parent: packages-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: [packages-set-what-is-left-in-a-package.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Packages stories](packages-stories.md) / Add and use up a package

# Add and use up a package

As the [keeper](../../personas.md), I want to add or use up one package with one tap, so that the pantry stays correct when I find a can or finish a jug with no shopping trip.

## Requirements

1. Each sealed count has "−" and "+" (decision 29)
   - a. "+" adds one sealed package with the size and the date of the count
   - b. "−" makes one package of the count an empty row, with the rules of [Keep one row for each package](packages-keep-one-row-for-each-package.md)
   - c. The number of the count changes with a small pop. With "Reduce motion", it changes with no motion
2. The open line has "Add package"
   - a. It adds one sealed package with the size of the last package, in the place of the line, with no date
   - b. The last package is the row with the newest date. With no date, it is the last row of the table
   - c. The new package shows as a count with no date
3. Each open package has "Used up"
   - a. It sets the package to 0, so it is an empty row
   - b. The bar slides to 0, and then goes out of the open line
   - c. This replaces requirement 8 of [Correct an amount with the bar](../v0.1.0/pantry-correct-an-amount.md)
4. "−", "+", "Add package", and "Used up" write the note at once, with no "Done"
5. Each count and each bar has "Place, date, and low line", which opens the form of one package
   - a. The form shows the size of the package, next to the amount
   - b. "Save" writes the size into the cell `Size`
   - c. "Used up" in the form makes the package an empty row. This replaces requirement 5 of [Change a row](../v0.1.0/pantry-change-a-row.md)
   - d. A form of a count changes one package of it
6. When the last package of a place is used up, the line goes to the group "Out", as [See a food item in each place](packages-see-a-food-item-in-each-place.md) tells

## Acceptance criteria

Each criterion starts with the vault of the [list page](packages-stories.md#what-the-vault-needs), and the open line of black beans in "Kitchen pantry".

1. GIVEN the count "2 sealed · 2027-06-01" WHEN the keeper taps "+" THEN the count is "3 sealed · 2027-06-01"
   - a. AND `Black beans.md` has 9 rows
2. GIVEN the count "2 sealed · 2027-06-01" WHEN the keeper taps "−" THEN the count is "1 sealed · 2027-06-01"
   - a. AND `Black beans.md` has the row `Kitchen pantry | 0 | 15 oz | 2027-06-01`
3. GIVEN the keeper tapped "−" on "2 sealed · 2027-06-01" WHEN the keeper taps "−" on "5 sealed · 2027-03-01" THEN `Black beans.md` has 1 empty row
   - a. AND 6 rows that are not empty
4. GIVEN the open line of black beans WHEN the keeper taps "Add package" THEN the open line shows "1 sealed" with no date
   - a. AND `Black beans.md` has a new row `Kitchen pantry | 15 oz | 15 oz |`
5. GIVEN the open can has 7.5 oz WHEN the keeper taps its "Used up" THEN the open line has no bar
   - a. AND `Black beans.md` has the row `Kitchen pantry | 0 | 15 oz | 2027-03-01`
6. GIVEN the open line of milk WHEN the keeper taps "Used up" on the open jug, and then "−" on "1 sealed" THEN milk is in the group "Out"
   - a. AND `Milk.md` has one row, an empty row
7. GIVEN the open line of eggs WHEN the keeper opens the form of the carton with 2 eggs THEN the form shows the size "12"
8. GIVEN the form of the carton with 2 eggs WHEN the keeper sets the size to "18" and taps "Save" THEN `Eggs.md` has the row `Fridge | 2 | 18 | 2026-10-25`

## Depends on

- [Set what is left in a package](packages-set-what-is-left-in-a-package.md): the open line with its counts and its bars.

## Architecture

- [Amount bar](../../architecture/amount-bar.md): the counts and their buttons.
- [Pantry](../../architecture/pantry.md): the form of one package.
- [Spec: one row for each package](../../initiatives/one-row-for-each-package/spec.md): scope 4 a and 8 d to g.
