---
title: Keep the screen on in the store
summary: "The phone does not lock while the stage Shop is open."
parent: shop-stories.md
updated: 2026-10-17
persona: Shopper
depends-on: [shop-tick-the-items-into-the-cart.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Keep the screen on in the store

# Keep the screen on in the store

As the [shopper](../../personas.md), I want the screen to stay on while the stage Shop is open, so that the phone does not lock between two shelves.

## Requirements

1. With the setting "Keep the screen on", the screen stays on while the stage Shop is open
   - a. The screen can lock again when a different stage or part opens
   - b. With the setting off, the screen locks as the phone decides
2. A device that cannot keep the screen on shows no error

## Acceptance criteria

Each criterion uses the phone, with the setting "Keep the screen on" on, and a lock time of 30 s.

1. GIVEN the stage Shop is open WHEN the shopper does not touch the phone for 60 s THEN the screen is on
2. GIVEN the stage Extras is open WHEN the shopper does not touch the phone for 60 s THEN the screen locks
3. GIVEN the setting "Keep the screen on" is off, and the stage Shop is open WHEN the shopper does not touch the phone for 60 s THEN the screen locks

## Depends on

- [Tick the items into the cart](shop-tick-the-items-into-the-cart.md): the stage Shop.

## Architecture

- [Settings](../../architecture/settings.md): the setting "Keep the screen on".
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decision 48. It is a page of the initiative.
