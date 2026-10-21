---
title: A circle to a screen
summary: "A button that opens a screen of its own grows a circle from the point of the tap until the screen is covered, and the new screen is under it."
parent: one-system-stories.md
updated: 2026-10-21
persona: Cook
depends-on: [one-system-the-pill.md, one-system-what-you-must-get-first.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / A circle to a screen

# A circle to a screen

As the [cook](../../personas.md), I want a new screen to grow from the button that I tapped, so that I feel where I came from and where I am.

## Requirements

1. "Cook" grows the circle of its arrow into the dark frame of Cook Mode
   - a. The circle starts at the arrow, 22 px in radius, and grows until it covers the window, in 0.48 s, slow at the start and at the end
   - b. Cook Mode opens under it, and the circle fades in 0.26 s
   - c. The same for "Cook" on the meal of tonight. A quiet "Cook" grows the circle from the point of the tap
2. "Add recipe", "Convert", and a tap on the photo of a recipe grow a circle from the point of the tap
   - a. The circle has the colour of the new screen: `bg` for intake and "Convert", `frame` for the gallery
3. A change from one part to a different part stays a fade
4. With less motion, the new screen opens at once

## Acceptance criteria

1. GIVEN Chicken noodle soup is open WHEN the cook taps "Cook" THEN a dark circle grows from the arrow and covers the window
   - a. AND Cook Mode shows Chicken noodle soup when the circle fades
2. GIVEN Boiled eggs has the flag "Tonight" WHEN the cook taps "Cook" on it THEN the dark circle grows from its arrow, and Cook Mode opens Boiled eggs
3. GIVEN the Recipes WHEN the cook taps "Add recipe" THEN a circle of paper grows from the button, and the intake opens
4. GIVEN a recipe with a photo WHEN the cook taps its photo THEN a dark circle grows from the photo, and the gallery opens
5. GIVEN the Recipes WHEN the cook taps "Pantry" in the nav THEN the Pantry fades in, with no circle
6. GIVEN the device has less motion on WHEN the cook taps "Cook" THEN Cook Mode opens at once

## Depends on

- [The pill](one-system-the-pill.md): the arrow in a circle on "Cook".
- [What you must get first](one-system-what-you-must-get-first.md): the open recipe with "Cook".

## Architecture

- [Cook Mode](../../architecture/cook-mode.md): the dark frame.
- [Motion](../../architecture/motion.md): the circle.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decisions 5, 10, and 17.
