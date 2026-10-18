---
title: See a food item in each place
summary: "The pantry shows one line for each food item in each place, with the total of its packages, and not one line for each row."
parent: packages-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: [packages-keep-one-row-for-each-package.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Packages stories](packages-stories.md) / See a food item in each place

# See a food item in each place

As the [keeper](../../personas.md), I want one line for each food item in each place, so that eight cans of beans are one line and the list stays short.

## Requirements

1. The pantry shows one line for each food item in each place
   - a. The line has the rows of the food item in that place that are not empty
   - b. This replaces requirement 1 of [See the food of each place](../v0.1.0/pantry-see-the-food-of-each-place.md)
2. The line shows the name and the total of its packages
   - a. With 2 or more packages, the total is followed by the number of packages: "1 1/2 gal · 2 packages"
   - b. With 1 package, the line shows only its amount
   - c. A food item in 2 or more places shows its total of all places too, as today
3. The badge of the line comes from the first use-by date of its packages
   - a. An empty row does not count
4. The bar of the line is the level bar of today
   - a. The dark part is the total of this place, and the light part is the total of the other places
5. A food item with only empty rows shows as one line in the group "Out", as a food item with no row does
6. The filter "Use soon" and the sequence "Use first" use the first date of the line

## Acceptance criteria

Each criterion starts with the vault of the [list page](packages-stories.md#what-the-vault-needs).

1. GIVEN black beans have 8 rows in "Kitchen pantry" WHEN the keeper opens the Pantry part THEN the group "Kitchen pantry" has one line of black beans
   - a. AND the line shows "112.5 oz · 8 packages"
2. GIVEN milk has two rows in "Fridge" WHEN the keeper opens the Pantry part THEN the group "Fridge" has one line of milk
   - a. AND the line shows "1 1/2 gal · 2 packages"
3. GIVEN flour has one row WHEN the keeper opens the Pantry part THEN the line of flour shows "1000 g"
4. GIVEN today is 2026-10-20 WHEN the keeper opens the Pantry part THEN the line of milk has the badge "2 days"
5. GIVEN the row of eggs with the date 2026-10-25 is an empty row, and today is 2026-10-20 WHEN the keeper opens the Pantry part THEN the line of eggs has no badge
6. GIVEN each row of milk is an empty row WHEN the keeper opens the Pantry part THEN milk is one dashed line in the group "Out"
   - a. AND the group "Fridge" has no line of milk
7. GIVEN today is 2026-10-20 WHEN the keeper puts the filter "Use soon" on THEN the list has one line of milk

## Depends on

- [Keep one row for each package](packages-keep-one-row-for-each-package.md): the rows, the empty row, and out.

## Architecture

- [Pantry](../../architecture/pantry.md): the lines and the groups by place.
- [Level](../../architecture/level.md): the bar of a line.
- [Use soon](../../architecture/use-soon.md): the badge and the first date.
- [Spec: one row for each package](../../initiatives/one-row-for-each-package/spec.md): scope 7.
