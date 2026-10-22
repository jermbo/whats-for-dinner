---
title: A circle between stages
summary: "A change of stage in the Shop grows a circle of paper from the point of the tap over the stage, and the new stage is under it."
parent: one-system-stories.md
updated: 2026-10-21
persona: Shopper
depends-on: [one-system-a-circle-to-a-screen.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / A circle between stages

# A circle between stages

As the [shopper](../../personas.md), I want a new stage of the trip to grow from the point that I tapped, as each other change of the plugin, so that the Shop feels like the rest of the kitchen.

## Requirements

1. A tap on a stage of the strip grows a circle of paper from the point of the tap
   - a. The circle covers only the stage below the strip. The strip and its ink line stay in view
   - b. The new stage shows under the circle when it covers the stage, and the circle fades
2. "Go shopping" and "Put away" grow the circle from their arrow
3. The circle has the colour of the page, so the change has no flash
4. With less motion, the new stage shows at once

## Acceptance criteria

1. GIVEN the stage "Extras" WHEN the shopper taps "2 Shop" in the strip THEN a circle of paper grows from the finger over the stage
   - a. AND the strip stays in view, and its ink line slides to "Shop"
   - b. AND the list shows when the circle fades
2. GIVEN the stage "Extras" WHEN the shopper taps "Go shopping" THEN the circle grows from its arrow, and the list shows
3. GIVEN an item in the cart WHEN the shopper taps "Put away" THEN the circle grows from its arrow, and "Put away" shows
4. GIVEN the device has less motion on WHEN the shopper taps a stage THEN the stage shows at once

## Depends on

- [A circle to a screen](one-system-a-circle-to-a-screen.md): the circle that covers, and the new screen under it.

## Architecture

- [Shopping](../../architecture/shopping.md): the stages of a trip.
- [Motion](../../architecture/motion.md): the circle.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decisions 13 and 20.
