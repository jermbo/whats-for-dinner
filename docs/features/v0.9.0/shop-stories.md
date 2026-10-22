---
title: Shop stories
summary: "The user stories of version 0.9.0 that bring the stages Shop and Put away into the one system: the list in bins, a tick that flies the name to the cart, the shelf and the cart, the cart view, the undo, and a tidy Put away."
parent: ../README.md
updated: 2026-10-21
---

[Wiki](../../README.md) / [Features](../README.md) / Shop stories

# Shop stories

The Pantry, the Recipes, and the Plan have one look and one language of motion. The stages Shop and Put away kept their older patterns: flat lines, a box that grows, underlined links, and three kinds of arrow. So they look like a different app. This page lists the six user stories of version 0.9.0 that bring them into the system.

## The goal of the feature

In the store, the list is in bins, as the Pantry. A tap ticks a row at once: the check fills, the name is struck, the name flies to the cart at the top right, and the row leaves. The cart opens as a dark view, and a tap on a row there flies the name back to the shelf. At home, Put away is the same form, with one arrow and plain buttons.

The [spec](../../initiatives/shop-and-put-away/spec.md) has the scope, and the [decision log](../../initiatives/shop-and-put-away/decision-log.md) has each decision and the options that were rejected.

## The stories

| Story                                                   | Persona | Depends on | Status  |
| ------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [The list in bins](shop-the-list-in-bins.md)         | Shopper | Nothing    | `built` |
| 2. [A tick acts at once](shop-a-tick-acts-at-once.md)   | Shopper | 1, 3       | `built` |
| 3. [The shelf and the cart](shop-the-shelf-and-the-cart.md) | Shopper | Nothing | `built` |
| 4. [The cart view](shop-the-cart-view.md)               | Shopper | 3          | `built` |
| 5. [Undo a tick](shop-undo-a-tick.md)                   | Shopper | 2          | `built` |
| 6. [A tidy Put away](shop-a-tidy-put-away.md)           | Keeper  | Nothing    | `built` |

## The steps of the work

Stories 1 to 5 change the stage Shop, so they go one after the other. Story 6 changes only Put away, so you can build it at the same time as any of them.

1. The list in bins, and A tidy Put away
2. The shelf and the cart
3. A tick acts at once
4. The cart view
5. Undo a tick

## Architecture pages

| Page                                         | Stories that update it                                               |
| -------------------------------------------- | -------------------------------------------------------------------- |
| [Shopping](../../architecture/shopping.md)   | 1: the bins and the labels. 2: the tick. 3: the shelf, the cart, and the bar. 4: the cart view. 5: the undo bar. |
| [Put away](../../architecture/put-away.md)   | 6: the arrow and the buttons of a line.                              |
| [Motion](../../architecture/motion.md)       | 2: the flying name, and the squeeze of the cart.                     |
| [Pieces](../../architecture/pieces.md)       | 2: the check of a row. 3: the shelf and the cart buttons.            |
| The wiki [glossary](../../glossary.md)       | 2: "tick", "flying name". 3: "shelf". 4: "cart view". 5: "undo bar". |

## Further reading

- [Plan stories](plan-stories.md): the other stories of this version.
