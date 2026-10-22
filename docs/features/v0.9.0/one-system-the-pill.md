---
title: The pill
summary: "Each action that completes a task or goes forward is one pill in the accent colour, with an arrow in a circle when it opens a different screen."
parent: one-system-stories.md
updated: 2026-10-21
persona: Cook
depends-on: [one-system-one-easing-and-the-press.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / The pill

# The pill

As the [cook](../../personas.md), I want each action that goes forward to look the same in each part, so that I find the next step with a quick look.

## Requirements

1. The `olive` kind of the `Button` is the pill
   - a. Round ends: the radius is half of its height
   - b. The background is `primary`, the accent colour, and the text is `on-primary`
   - c. The text is in the font of titles, at the size `name`
   - d. It is 60 px high, and it fills the width that the screen gives it
2. A pill that opens a different screen has an arrow in a circle at its end
   - a. The circle is 44 px, in `on-primary`, with the arrow in `primary`
   - b. The label is at the start, and the circle at the end
   - c. On a computer, a hover moves the arrow 4 px to the right
   - d. A pill that stays on its screen has no arrow
3. These actions are the pill
   - a. "Cook" on an open recipe, with the arrow
   - b. "Cook" on the meal of tonight, with the arrow, when its preparation is done or it has none. On each other meal card, and while the preparation waits, "Cook" stays a quiet button
   - c. "Done" on the card of a food item
   - d. "Go shopping" and "Put away" in the Shop, with the arrow
   - e. "Update the pantry" at the end of Cook Mode
   - f. Each button of Cook Mode that goes to the next step
   - g. Each button that is `olive` today
4. The `main` kind stays for the main action of a form, such as "Save" and "Next"

## Acceptance criteria

1. GIVEN Boiled eggs has the flag "Tonight" and no preparation WHEN the cook looks at its card THEN "Cook" is a pill in the accent colour, with an arrow in a circle
   - a. AND "Cook" on Spinach omelette, with no flag, is a quiet button
2. GIVEN the card of Milk is open WHEN the cook looks at its actions THEN "Done" is a pill with no arrow
3. GIVEN the Shop has items WHEN the cook looks at the end of the list THEN "Go shopping" is a pill with an arrow
4. GIVEN Cook Mode is on step 1 of Pancakes WHEN the cook looks at the bottom THEN the button to step 2 is a pill
5. GIVEN the settings take the accent colour of the theme WHEN the cook opens the Plan THEN "Cook" has the accent colour of the theme
6. GIVEN the intake of a new recipe WHEN the cook looks at "Save" THEN it is the `main` kind, not a pill

## Depends on

- [One easing and the press](one-system-one-easing-and-the-press.md): the press that the pill has.

## Architecture

- [Pieces](../../architecture/pieces.md): the kinds of the `Button`.
- [Colour](../../architecture/colour.md): `primary` and the accent setting.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decisions 10 and 15.
