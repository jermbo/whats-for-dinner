---
title: Cook Mode closes with a circle
summary: "\"Update the pantry\" and \"Exit\" close Cook Mode with a circle of paper from the button, and the piece of the bar of a new step fills from the left."
parent: one-system-stories.md
updated: 2026-10-21
persona: Cook
depends-on: [one-system-a-circle-to-a-screen.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / Cook Mode closes with a circle

# Cook Mode closes with a circle

As the [cook](../../personas.md), I want the end of a meal to close Cook Mode with the same circle that opened it, so that the end feels like a moment and not like a jump.

## Requirements

1. "Update the pantry" grows a circle of paper from its button, after the pantry is correct
   - a. The part under Cook Mode shows when the circle covers the window, and the circle fades
   - b. If the pantry cannot be updated, Cook Mode stays, with no circle
2. "Exit" grows the same circle from the button, also "Exit" of the question about the timers, and "Back" on "Get out"
3. A step that you go to still slides in from its side
4. The piece of the bar of the step that you go to fills from the left, in the accent colour
5. With less motion, Cook Mode closes at once, and the piece shows at once

## Acceptance criteria

1. GIVEN the last page of Chicken noodle soup WHEN the cook taps "Update the pantry" THEN a circle of paper grows from the button
   - a. AND the Recipes show when the circle fades
2. GIVEN Cook Mode with no timer WHEN the cook taps "Exit" THEN the circle grows from "Exit", and Cook Mode closes
3. GIVEN step 1 WHEN the cook taps "Next" THEN step 2 slides in from the right, and its piece of the bar fills from the left
4. GIVEN the device has less motion on WHEN the cook taps "Exit" THEN Cook Mode closes at once

## Depends on

- [A circle to a screen](one-system-a-circle-to-a-screen.md): the circle that opens Cook Mode.

## Architecture

- [Cook Mode](../../architecture/cook-mode.md): the dark frame and its bar.
- [Motion](../../architecture/motion.md): the circle.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decision 21.
