---
title: Keep put away in the receipt note
summary: "The receipt note starts at its final place with the first fact, keeps each correction, and continues after a restart or on a different device."
parent: shop-stories.md
updated: 2026-10-17
persona: Keeper
depends-on: [shop-put-away-one-item.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Keep put away in the receipt note

# Keep put away in the receipt note

As the [keeper](../../personas.md), I want each fact of put away in the receipt note at once, so that I continue after a restart of Obsidian or on a different device.

## Requirements

1. The stage Put away opens with a cart, and the receipt note starts
   - a. The note is `Shopping/<day>`, with a number for a second receipt of the day
   - b. The note has `status: active`, `date`, and `store`
   - c. The table has one row for each item of the cart, in the order of the tasks, with the facts that the plugin proposes
   - d. The column "Done" is empty for each row
2. An item that you tick later gets a row at the end of the table
3. Each correction goes into the row of its item
   - a. A price goes into the row when you stop typing, as you typed it
4. The stage reads its facts from the receipt
   - a. After a restart of Obsidian, each correction is still there
   - b. On a different device, after Obsidian Sync, each correction is there
5. "Not bought" and "Undo" take the row out of the receipt, when the item is not done
6. When each row is done, the receipt is complete
   - a. The note has `status: complete`, and the store of the trip
   - b. The column "Done" goes, and each price has 2 decimals
   - c. Your own text of the note "Next trip" goes into the receipt, above the table
   - d. The note "Next trip" keeps only its tasks with no mark
7. The history uses only receipts with no `status: active`

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17, with the receipt `Shopping/2026-10-17` complete from an earlier trip. The cart has milk and lime, in this order of the tasks.

1. GIVEN no receipt is active WHEN the keeper opens the stage Put away THEN the vault has the note `Shopping/2026-10-17 2` with `status: active`
   - a. AND its table has milk and lime, in this order, with "Done" empty
2. GIVEN the keeper typed "1.29" for milk WHEN 1 s goes by THEN the row of milk has "1.29"
3. GIVEN the row of milk has "1.29" WHEN the keeper restarts Obsidian and opens the stage Put away THEN the line of milk has "1.29"
4. GIVEN the receipt is active WHEN the keeper ticks eggs in the stage Shop and opens the stage Put away THEN the last row of the table is eggs
5. GIVEN the receipt is active WHEN the keeper taps "Undo" on lime in the stage Shop THEN the table has no row for lime
6. GIVEN milk is done WHEN the keeper taps "Put away" on lime THEN the receipt has `status: complete`
   - a. AND the table has no column "Done"
   - b. AND the price of milk is "1.29"
7. GIVEN a receipt is active WHEN the Shop stage proposes the price of an item THEN the price comes from a complete receipt

## Depends on

- [Put away one item at a time](shop-put-away-one-item.md): the column "Done", and the end of the trip.

## Architecture

- [Receipt](../../architecture/receipt.md): the form of the note, active and complete.
- [Put away](../../architecture/put-away.md): when the receipt starts and when it is complete.
