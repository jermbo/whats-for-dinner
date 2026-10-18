---
title: Keep loose food in one row
summary: "The chip Loose marks a food item with no packages, and its new food goes into the one row of its place."
parent: packages-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: [packages-put-away-one-line-for-each-package.md, packages-set-what-is-left-in-a-package.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Packages stories](packages-stories.md) / Keep loose food in one row

# Keep loose food in one row

As the [keeper](../../personas.md), I want to mark food that has no packages as loose, so that 6 more apples go into the apples that I have and do not make a second row.

## Requirements

1. The chip "Loose" marks a food item with no packages
   - a. It is on the open line of put away and in the form of the Pantry part
   - b. "Loose" on writes `loose: true` into the food item note
   - c. "Loose" off takes `loose` out of the note
   - d. The chip writes the note at once, and it shows its state with ink, as a chip does
2. A loose food item has one row for each place
   - a. Put away adds the amount of its line into the row of its place, as the facts page told before this feature
   - b. With no row in that place, put away makes a new row
   - c. The size of the row becomes its amount after the addition
   - d. Put away has 1 line for a loose item, with the amount of the list row
3. The open line of a loose item shows one bar for its row
   - a. Its length is the size of the row
4. The end of a meal takes from the row of a loose item as from a package

## Acceptance criteria

Each criterion starts with the vault of the [list page](packages-stories.md#what-the-vault-needs), and apples in the cart.

1. GIVEN the open line of apples at put away WHEN the keeper taps "Loose" THEN `Apples.md` has `loose: true`
2. GIVEN `Apples.md` has `loose: true` and the line of apples has 6 WHEN the keeper taps "Put away" THEN `Apples.md` has one row in "Fridge"
   - a. AND the row has the amount `8` and the size `8`
3. GIVEN `Apples.md` has `loose: true` and the line has the place "Kitchen pantry" WHEN the keeper taps "Put away" THEN `Apples.md` has a new row in "Kitchen pantry"
   - a. AND the row of "Fridge" does not change
4. GIVEN `Apples.md` has no `loose` and the line of apples has 6 WHEN the keeper taps "Put away" THEN `Apples.md` has two rows in "Fridge"
5. GIVEN the form of apples in the Pantry part WHEN the keeper taps "Loose" off THEN `Apples.md` has no property `loose`
6. GIVEN `Apples.md` has `loose: true` and the list row is "Apples, 6" WHEN the stage opens THEN the stage has 1 line of apples

## Depends on

- [Put away one line for each package](packages-put-away-one-line-for-each-package.md): the rule of one row for each package, which loose food does not follow.
- [Set what is left in a package](packages-set-what-is-left-in-a-package.md): the bar of the open line.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the property `loose`.
- [Put away](../../architecture/put-away.md): the chip "Loose" on the open line.
- [Facts of an item](../../architecture/put-away-facts.md): loose food goes into the row of its place.
- [Spec: one row for each package](../../initiatives/one-row-for-each-package/spec.md): scope 3 and 10 a.
