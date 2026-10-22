---
title: The list in bins
summary: "The rows of the Shop are in bins, in columns, as the bins of the Pantry: one bin for A to Z, and one bin for each meal."
parent: shop-stories.md
updated: 2026-10-21
persona: Shopper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / The list in bins

# The list in bins

As the [shopper](../../personas.md), I want the list in bins, as the Pantry, so that the Shop looks like the rest of the kitchen and each group is easy to see.

## Requirements

1. Each group of the list is a bin: a white card with its title and its count
   - a. "A to Z" has one bin, "To get"
   - b. "By meal" has one bin for each meal, by name, and a bin "Extras" for the extras
   - c. "Store order" has one bin, "To get", in the order of the store
   - d. The count of a bin is the number of its rows
2. The bins flow down in columns of 20 rem or more, one column on a phone, as the bins of the Pantry
3. A row has the check, the name, the recipes that need it in small text, the amount, and the regular price
   - a. A row of an extra has the sticker "Extra", and a plain button "✕ Remove" with no edge
   - b. The brand photos of a row stay below its name, as today
   - c. The rows of a bin have the soft rule of the rows of a bin of the Pantry
4. A bin with no row left goes, and the bins after it glide to their new place
5. With less motion, a bin goes at once

## Acceptance criteria

Each criterion starts with the shopping note of the test vault.

1. GIVEN the stage Shop with "A to Z" WHEN the shopper looks at the list THEN the rows are in one white bin "To get", with the count of the rows
2. GIVEN the stage Shop WHEN the shopper selects "By meal" THEN each meal has its own bin, with its title and its count
3. GIVEN the stage Shop on a computer, 1000 px wide WHEN the shopper selects "By meal" THEN the bins are in 2 columns
4. GIVEN the shopper added Batteries with "Add an item" in Extras WHEN the shopper looks at its row in Shop THEN it has the sticker "Extra" and the plain button "✕ Remove"
5. GIVEN a bin with one row WHEN its row goes to the cart THEN the bin goes, and the bin below it glides up

## Depends on

Nothing.

## Architecture

- [Shopping](../../architecture/shopping.md): the stages of a trip, and the sequences of the list.
- [Decision log: Shop and Put away](../../initiatives/shop-and-put-away/decision-log.md): decisions 2, 4, and 7.
