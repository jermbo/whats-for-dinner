---
title: Pick the store at the start of the trip
summary: "The shopper selects the store in the stage Shop, the open note keeps it, and put away and the receipt have it."
parent: shop-stories.md
updated: 2026-10-17
persona: Shopper
depends-on: [shop-record-the-store-of-a-trip.md, shop-tick-the-items-into-the-cart.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Pick the store at the start of the trip

# Pick the store at the start of the trip

As the [shopper](../../personas.md), I want to select the store when the trip starts, so that the list can follow that store, and put away already knows it.

## Requirements

1. The stage Shop has "Store", with one option for each store of the receipts, and a field for a new store
   - a. One tap on the store that is on puts it off
2. The open note keeps the store as its property `store`
   - a. With no open note, the plugin makes it
   - b. A store that you type into the note by hand counts
3. The stage Put away shows the store of the open note
   - a. A change there changes the property of the open note
4. The receipt gets the store of the open note, as before

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17, after the clean-up of that day, with the setting "Low line" at 20 %. The plan has the boiled eggs, the open note has no task, and the data file has no skipped suggestion. The receipts have the stores "Market A" and "Market B".

1. GIVEN the stage Shop is open WHEN the shopper looks at "Store" THEN it has "Market A" and "Market B", with none on
2. GIVEN the stage Shop is open WHEN the shopper taps "Market A" THEN the open note has the property `store: Market A`
3. GIVEN the open note has `store: Market A` WHEN the keeper opens the stage Put away THEN "Market A" is on
4. GIVEN "Market A" is on in the stage Put away WHEN the keeper taps "Market B" THEN the open note has `store: Market B`
5. GIVEN the open note has `store: Market A` WHEN the keeper puts the cart away THEN the receipt has `store: Market A`

## Depends on

- [Record the store of a trip](shop-record-the-store-of-a-trip.md): the options of the stores. This story changes its requirements: the store is a fact of the open note from the start.
- [Tick the items into the cart](shop-tick-the-items-into-the-cart.md): the stage Shop.

## Architecture

- [Shopping note](../../architecture/shopping-note.md): the property `store` of the open note.
- [Receipt](../../architecture/receipt.md): the store of a receipt.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 50. It is a page of the initiative.
