---
title: Put away a package
summary: "Each line of put away makes one package in the new form: full for a measure, the size for a count."
parent: pantry-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: [pantry-keep-a-level-or-a-count.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Put away a package

# Put away a package

As the [keeper](../../personas.md), I want each package from the store to go into the pantry as a full package, so that I do not set a level after a trip.

## Requirements

1. Each line of put away makes one new row (decision 26)
   - a. A measure gets `Left` = `full`, and its size from the line
   - b. A count gets `Left` = its size
   - c. The place and the use-by date come from the line, as today
2. Put away no longer writes over an empty row, and loose food no longer goes into one row (decisions 11 and 13)
3. The size of a line is a number with a unit of the [unit list](../../initiatives/simple-pantry/decision-log.md), or a count (decision 5)
   - a. A size that the plugin cannot read keeps the line open, with the message "Select a size"
4. The receipt stays as today

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN a cart with milk, 1 gal, place "Fridge", use by 2026-11-02 WHEN the keeper puts it away THEN `Milk.md` has a third row `Fridge | full | 1 gal | 2026-11-02`
2. GIVEN a cart with eggs, 12, place "Fridge" WHEN the keeper puts it away THEN `Eggs.md` has a third row `Fridge | 12 | 12 |`
3. GIVEN a cart with apples, 6 WHEN the keeper puts it away THEN `Apples.md` has two rows: `2 | 6` and `6 | 6`
4. GIVEN a cart line of milk with the size "1 gall" WHEN the keeper taps "Put away" THEN the line stays open with "Select a size"

## Depends on

- [Keep a level or a count](pantry-keep-a-level-or-a-count.md): the form of a row.

## Architecture

- [Put away](../../architecture/put-away.md): what a line writes.
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 5, 11, 13, and 26.
