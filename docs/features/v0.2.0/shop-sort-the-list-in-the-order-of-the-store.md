---
title: Sort the list in the order of the store
summary: "The plugin records the order in which you take the items, and the next trip in that store sorts the list in that order."
parent: shop-stories.md
updated: 2026-10-17
persona: Shopper
depends-on: [shop-pick-the-store-at-the-start.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Sort the list in the order of the store

# Sort the list in the order of the store

As the [shopper](../../personas.md), I want the list to have the order in which I walk through the store, so that I do not walk back for an item.

## Requirements

1. A tick moves the task to the end of the tasks of the open note
   - a. So the receipt has the items in the order of your ticks
2. With a store, the bar has the sequence "Store order"
   - a. A row is where its item was in the newest receipt of that store, as a part of the length of that receipt
   - b. An item that you never bought in that store comes last, from A to Z
3. The sequence "Store order" is on when you select a store that has a receipt
   - a. You can select "A to Z" or "By meal" after that

## Acceptance criteria

Each criterion starts with the receipt `Shopping/2026-10-17 3`, with `store: Market A` and the rows rice, eggs, and avocados, in this order. The open note has `store: Market A`, and the list has the rows "Avocados", "Eggs", "Milk", and "Rice".

1. GIVEN the open note has `- [ ] [[Pantry/Milk|Milk]]` and `- [x] [[Pantry/Eggs|Eggs]]`, in this order WHEN the shopper ticks milk THEN the last task of the note is `- [x] [[Pantry/Milk|Milk]]`
2. GIVEN the shopper ticked milk and then eggs WHEN the keeper puts the cart away THEN the receipt has the row of milk first
3. GIVEN the stage Shop is open WHEN the shopper selects "Market A" THEN the sequence is "Store order"
   - a. AND the rows are "Rice", "Eggs", "Avocados", and "Milk"
4. GIVEN the sequence is "Store order" WHEN the shopper selects "A to Z" THEN the rows are "Avocados", "Eggs", "Milk", and "Rice"
5. GIVEN the open note has no store WHEN the shopper opens the bar THEN it has no sequence "Store order"

## Depends on

- [Pick the store at the start of the trip](shop-pick-the-store-at-the-start.md): the store of the open note.

## Architecture

- [Shopping note](../../architecture/shopping-note.md): where a tick puts the task.
- [Shopping](../../architecture/shopping.md): the sequences of the list.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 51. It is a page of the initiative.
