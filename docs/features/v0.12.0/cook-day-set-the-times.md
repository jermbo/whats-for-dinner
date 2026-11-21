---
title: Set the serve time and the times of the dishes
summary: "The cook gives the occasion a serve time, and each dish gets a time and a start, with a guess from the steps when the cook gives none."
parent: cook-day-stories.md
updated: 2026-11-21
persona: Cook
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Cook day stories](cook-day-stories.md) / Set the serve time and the times of the dishes

# Set the serve time and the times of the dishes

As the [cook](../../personas.md), I want to say when the food is on the table and how long each dish takes, so that I see when to start each dish.

## Requirements

1. The screen of the occasion has a chip below the ink card
   - a. With a serve time, it says "Serve at 15:00"
   - b. With no serve time, it says "Set serve time"
   - c. A tap opens a time field, and a change writes `serve: "15:00"` in the properties of the note
   - d. "Clear" takes the property out
2. A dish has a time
   - a. The field `· 3h`, `· 45 min`, or `· 1h30` of the line gives it
   - b. With no field, the time is the sum of the first time of each step of the recipe, rounded up to 5 minutes, and the chip shows "~"
   - c. A dish with a recipe, and with no field and no step time, has "Set time"
3. A dish of yours that has no mark shows a start chip
   - a. The start is the serve time minus the time of the dish, rounded down to 5 minutes
   - b. The field `· start 13:30` gives a start that the serve time does not change
   - c. With no serve time and no field, the chip shows the time only, such as "3h"
   - d. A dish of a different person, and a dish with a mark, have no chip
4. The sheet "Who brings?" of your dish has a part "Time" with the time and the start
   - a. A change of the time writes the field `· 3h` and takes out the guess
   - b. "Auto" takes the field `start` out, so the serve time decides again
5. A dish with no recipe can have a time and a start

## Acceptance criteria

1. GIVEN the screen WHEN the cook looks below the ink card THEN the chip says "Serve at 15:00"
2. GIVEN the screen WHEN the cook sets the serve time to 17:30 THEN the properties of the note have `serve: "17:30"`
   - a. AND the other lines of the note do not change
3. GIVEN the screen WHEN the cook taps "Clear" THEN the note has no property `serve`
4. GIVEN a note with no properties WHEN the cook sets the serve time THEN the note starts with a block of properties that has `serve`
5. GIVEN the line `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · 3h` and the serve time "15:00" WHEN the cook looks at "Beef tacos" THEN the chip says "Start 12:00"
6. GIVEN the line of "Apple crumble" with `start 13:30` WHEN the cook sets the serve time to 17:00 THEN the chip still says "Start 13:30"
7. GIVEN the line `- [ ] Gravy · side · 20 min` and the serve time "15:00" WHEN the cook looks at "Gravy" THEN the chip says "Start 14:40"
8. GIVEN a recipe with the steps "Bake for 45 minutes" and "Rest for 10 minutes", and no field WHEN the cook looks at it and the serve time "15:00" WHEN the cook looks at it THEN the chip says "~Start 14:00"
9. GIVEN a recipe with no step time and no field WHEN the cook looks at it THEN the chip says "Set time"
10. GIVEN the sheet of "Gravy" WHEN the cook sets the time to 30 min THEN the line has `30 min` and the chip says "Start 14:30"
11. GIVEN the line of "Apple crumble" with `start 13:30` WHEN the cook taps "Auto" THEN the line has no `start`
12. GIVEN the line `- [x] Rolls · bread · Sam` WHEN the cook looks at "Rolls" THEN it has no chip
13. GIVEN the line of "Pumpkin pie" with the person "Mum" WHEN the cook looks at it THEN it has no chip

## Depends on

Nothing. The story builds on the screen of [See an occasion](../v0.11.0/occasion-see-an-occasion.md), which is `built`.

## Architecture

- [Occasion note](../../architecture/occasion-note.md): the property `serve`, and the fields of time and start.
- [Occasion](../../architecture/occasion.md): how the time and the start are decided.
