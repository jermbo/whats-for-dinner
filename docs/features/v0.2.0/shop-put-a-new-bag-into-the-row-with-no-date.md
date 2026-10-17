---
title: Put a new bag into the row with no date
summary: "The keeper puts food away, and an amount with a use-by date goes into the row of the same place that has no date."
parent: shop-stories.md
updated: 2026-10-17
persona: Keeper
depends-on: [shop-give-the-facts-of-each-item.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Put a new bag into the row with no date

# Put a new bag into the row with no date

As the [keeper](../../personas.md), I want put away to add a new bag to the row of the same place that has no use-by date, so that one food in one place is one row.

## Requirements

1. Put away adds an amount to a row of the same place when the units compare, and one of these is true
   - a. The two have the same use-by date, as before
   - b. The row has no use-by date
   - c. The amount has no use-by date
2. The row then has the use-by date that one of the two has
3. Two different use-by dates make two rows, as before
4. The form of the Pantry part keeps its rule: a date that you type makes its own row

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17. The note `Oats` has the row "Kitchen", "7.5 g", with no use-by date.

1. GIVEN oats are in the cart with "42.5 g", "Kitchen", and the use-by date 2026-11-16 WHEN the keeper taps "Put into the pantry" THEN the note `Oats` has one row: "Kitchen", "50 g", 2026-11-16
2. GIVEN the note `Oats` has the row "Kitchen", "7.5 g", 2026-11-01, and oats are in the cart with "Kitchen" and 2026-11-16 WHEN the keeper taps "Put into the pantry" THEN the note has two rows
3. GIVEN the note `Oats` has the row "Kitchen", "7.5 g", 2026-11-01, and oats are in the cart with "Kitchen" and no date WHEN the keeper taps "Put into the pantry" THEN the note has one row: "Kitchen", "50 g", 2026-11-01
4. GIVEN the form "Add to pantry" is open WHEN the keeper saves "Oats", "Kitchen", "10 g", and the date 2027-01-01 THEN the note `Oats` has a new row with that date

## Depends on

- [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md): the button that puts the cart away. This story changes its requirement 10 b.

## Architecture

- [Facts of an item](../../architecture/put-away-facts.md): one row for one place.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 43. It is a page of the initiative.
