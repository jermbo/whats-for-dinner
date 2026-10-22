---
title: The list in bins
summary: "The rows of the Shop are labels in bins, as the Larder images: the photo of the package, the name, and the amount in one column. One bin for A to Z, one bin for each meal."
parent: shop-stories.md
updated: 2026-10-21
persona: Shopper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / The list in bins

# The list in bins

As the [shopper](../../personas.md), I want the list as clear labels in bins, so that I find the package on the shelf and its amount at a glance.

## Requirements

1. Each group of the list is a bin: its title in the display font, its count in the faint colour, over a rule of 4 px, with no card
   - a. "A to Z" has one bin, "To get"
   - b. "By meal" has one bin for each meal, by name, and a bin "Extras" for the extras
   - c. "Store order" has one bin, "To get", in the order of the store
   - d. The count of a bin is the number of its rows
2. The bins flow down in columns of 20 rem or more, one column on a phone
   - a. One bin takes the full width, and its rows flow in columns of 22 rem or more inside it
3. A row is a label, with a soft rule below it
   - a. The check, then the photo of the package, 44 px: the brand that you took, or the first brand
   - b. With no photo, a hatched tile with a camera
   - c. The name, and below it in small muted text the meals that need the item, or "Extra"
   - d. The amount at the right edge, in the display font, and the regular price below it
   - e. An extra has a quiet ✕ at the end, with no label and no edge
4. The sticker "Extra" shows after the name only when the list has rows for a meal and extras
5. A tap on the photo or on the hatched tile shows the brands of the item below the row, with the camera tile. A second tap hides them
6. The store, the find field, and the sequence are in one row above the bins
   - a. The store is a small button with its name, or "Store" with no store. A tap shows the stores below the row, with "Done"
7. A bin with no row left goes, and the bins after it glide to their new place
8. With less motion, a bin goes at once

## Acceptance criteria

Each criterion starts with the shopping note of the test vault.

1. GIVEN the stage Shop with "A to Z" WHEN the shopper looks at the list THEN the rows are in one bin "To get", with the count of the rows and a rule of 4 px below the title
2. GIVEN the stage Shop WHEN the shopper selects "By meal" THEN each meal has its own bin, with its title and its count
3. GIVEN the stage Shop on a computer, 1000 px wide WHEN the shopper selects "By meal" THEN the bins are in 2 columns
   - a. AND with "A to Z", the bin "To get" takes the full width, and its rows are in 2 columns
4. GIVEN each row is an extra WHEN the shopper looks at the row of Sugar THEN it has the hatched tile, "Sugar", "Extra" in small text below it, "1 kg" at the right edge, and a quiet ✕
   - a. AND no row has the sticker "Extra"
5. GIVEN the row of Taco seasoning has two brand photos WHEN the shopper looks at it THEN its photo is the first brand, and "28 g" has "2.49" below it
6. GIVEN the row of Sugar WHEN the shopper taps its hatched tile THEN the camera tile shows below the row
7. GIVEN the stage Shop WHEN the shopper looks above the bins THEN the store, the find field, and the sequence are in one row

## Depends on

Nothing.

## Architecture

- [Shopping](../../architecture/shopping.md): the stages of a trip, and the sequences of the list.
- [Brands](../../architecture/brands.md): the photo of a package.
- [Decision log: Shop and Put away](../../initiatives/shop-and-put-away/decision-log.md): decisions 2, 4, 7, and 14.
