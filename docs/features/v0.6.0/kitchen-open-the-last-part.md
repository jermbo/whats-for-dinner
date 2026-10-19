---
title: Open the last part
summary: "The kitchen opens on the part that you used last: after you close the tab, and after a restart of Obsidian. Each device keeps its own part."
parent: ../README.md
updated: 2026-10-19
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / Open the last part

# Open the last part

As the [keeper](../../personas.md), I want the kitchen to open on the part that I used last, so that I do not tap back to it each time.

## Requirements

1. The kitchen opens on the part that you used last: Pantry, Recipes, Plan, or Shop
   - a. After you close the tab of the kitchen and open it again
   - b. After a restart of Obsidian
2. Each device keeps its own part
   - a. The part is in the local storage of the vault on that device, not in the data file, so Obsidian Sync does not move it
3. Only the part stays
   - a. The bar of each part, Cook Mode, and the stage of Shop start again, as before
4. A new device, or a device with no part, opens on Pantry, as before

## Acceptance criteria

1. GIVEN the kitchen shows Plan WHEN the keeper closes the tab and opens the kitchen again THEN the kitchen shows Plan
2. GIVEN the kitchen shows Shop WHEN the keeper restarts Obsidian and opens the kitchen THEN the kitchen shows Shop
3. GIVEN the phone shows Recipes and the desktop shows Pantry WHEN the keeper opens the kitchen on each device THEN the phone shows Recipes and the desktop shows Pantry
4. GIVEN the Recipes bar has a filter WHEN the keeper closes the tab and opens the kitchen again THEN the kitchen shows Recipes, and the bar has no filter

## Depends on

Nothing.

## Architecture

- [Kitchen state](../../architecture/kitchen-state.md): the part on the screen.
