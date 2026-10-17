---
title: Record the store of a trip
summary: "The keeper selects the store of a trip with one tap, and the receipt has it."
parent: shop-stories.md
updated: 2026-10-13
persona: Keeper
depends-on: [shop-give-the-facts-of-each-item.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Record the store of a trip

# Record the store of a trip

As the [keeper](../../personas.md), I want to tell the store of a trip with one tap, so that the receipt tells where I paid each price.

## Requirements

1. The screen of put away has the control "Store"
   - a. It has one option for each store that a receipt has, from A to Z
   - b. A text field takes a store that is new
   - c. No option is on at the start
2. Tap an option to select that store
   - a. A second tap on the option puts it off
   - b. A new store that has text counts, and not the store of the tap
3. The button of put away writes the store into the receipt
   - a. The receipt gets the property `store`
   - b. With no store, the receipt has no property `store`
   - c. The button works with no store
4. A store that you type into a receipt by hand is an option at the next trip

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-13, with lime in the cart. The test vault needs two receipts: the note `Shopping/2026-09-28` with the property `store: Market A`, and the note `Shopping/2026-10-04` with the property `store: Market B`.

1. GIVEN the vault has 2 receipts with a store WHEN the keeper opens the screen of put away THEN the control "Store" shows the options "Market A" and "Market B"
   - a. AND no option is on
2. GIVEN the screen of put away is open WHEN the keeper taps "Market B" THEN the option "Market B" is on
3. GIVEN the option "Market B" is on WHEN the keeper taps "Market B" THEN no option is on
4. GIVEN the option "Market B" is on WHEN the keeper taps "Put into the pantry" THEN the receipt `Shopping/2026-10-13` has `store: Market B`
5. GIVEN the keeper typed "Market C" into the field WHEN the keeper taps "Put into the pantry" THEN the receipt has `store: Market C`
6. GIVEN the option "Market A" is on and the keeper typed "Market C" into the field WHEN the keeper taps "Put into the pantry" THEN the receipt has `store: Market C`
7. GIVEN no option is on and the field is empty WHEN the keeper taps "Put into the pantry" THEN the vault has the receipt `Shopping/2026-10-13`
   - a. AND the receipt has no property `store`
8. GIVEN a receipt has `store: Market C` WHEN the keeper opens the screen of put away at the next trip THEN the control shows 3 options
   - a. AND their sequence is "Market A", "Market B", "Market C"
9. GIVEN you typed `store: Farm shop` into the note `Shopping/2026-09-28` WHEN the keeper opens the screen of put away THEN the control shows the option "Farm shop"

## Depends on

- [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md): the screen of put away, and its button.

## Architecture

- [Put away](../../architecture/put-away.md): the screen that this story adds a fact to.
- [Receipt](../../architecture/receipt.md): the properties of a receipt.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 23, why the store is a fact of the trip. It is a page of the initiative.
