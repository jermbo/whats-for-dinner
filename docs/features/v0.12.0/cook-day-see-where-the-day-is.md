---
title: See where the day is
summary: "Cook day shows the occasion as a place card, the state of each dish, what to start next, and a way to move the serve time."
parent: cook-day-stories.md
updated: 2026-11-21
persona: Cook
depends-on: [cook-day-know-when-to-start.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Cook day stories](cook-day-stories.md) / See where the day is

# See where the day is

As the [cook](../../personas.md), I want to see the name of the occasion, how far the day is, and which dish is on the stove, so that I know where I am at one look.

## Requirements

1. The top of "Cook day" is a place card
   - a. It shows the date, the days, the name, and the serve time as a sticker
   - b. On the day, it shows "Serve in 3h 12m", counted from the clock of the device
   - c. It shows "2 of 6 done" and a bar
   - d. While a dish is open, the card has only the name, the sticker, the bar, and the next line
2. A dish has a state, on its chip and on its row
   - a. Waiting: no mark
   - b. Soon or late: amber or tomato, as in the [start story](cook-day-know-when-to-start.md)
   - c. Cooking: the dish is open. Its chip has an olive edge and a line of progress. Its row has an olive edge, "Cooking · Step 2 of 4", and a bar
   - d. Done: its row is struck, and it has no chip
3. The card shows the next action on the day
   - a. "Next: start Cranberry sauce in 8 min"
   - b. "Start Cranberry sauce now" at the start
   - c. "Cranberry sauce is 12 min late" after it
   - d. A dish that is open or done is not the next dish
4. "Running late: serve 15 min later" moves the serve time by 15 minutes
   - a. A start that the serve time decided moves with it
   - b. A start that the line fixes does not move

## Acceptance criteria

1. GIVEN "Cook day" of "Thanksgiving Feast" WHEN the cook looks at the top THEN the card shows "Thanksgiving Feast" and "Serve 15:00"
2. GIVEN today is the day and the time is 11:50 WHEN the cook looks at the card THEN it says "Serve in 3h10"
3. GIVEN 2 of 13 dishes have a mark WHEN the cook looks at the card THEN it says "2 of 13 done"
4. GIVEN "Roast turkey" is open on step 2 of 4 WHEN the cook shows "Schedule" THEN the row says "Cooking · Step 2 of 4"
   - a. AND the chip has an olive edge
5. GIVEN "Roast turkey" is open WHEN the cook looks at the card THEN it shows the name, the sticker, the bar, and the next line only
6. GIVEN the time is 11:52 and "Cranberry sauce" starts at 12:00 WHEN the cook looks at the card THEN it says "Next: start Cranberry sauce in 8 min"
7. GIVEN the time is 12:12 and "Cranberry sauce" is not open WHEN the cook looks at the card THEN it says "Cranberry sauce is 12 min late"
8. GIVEN "Cranberry sauce" is open WHEN the cook looks at the card THEN the next line names a different dish
9. GIVEN the serve time "15:00" WHEN the cook taps "Running late" THEN the property is `serve: "15:15"`
   - a. AND "Gravy" with no `start` field starts 15 minutes later
   - b. AND "Cranberry sauce" with `start 12:00` still starts at 12:00

## Depends on

- [Know when to start](cook-day-know-when-to-start.md): the colours and the clock.

## Architecture

- [Occasion](../../architecture/occasion.md): the place card, the states, and the next action.
