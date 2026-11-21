---
title: Cook the dishes at the same time
summary: "The cook opens Cook day, sees the dishes in the sequence of their starts, and swaps between dishes that are in Cook Mode."
parent: cook-day-stories.md
updated: 2026-11-21
persona: Cook
depends-on: [cook-day-set-the-times.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Cook day stories](cook-day-stories.md) / Cook the dishes at the same time

# Cook the dishes at the same time

As the [cook](../../personas.md), I want one screen for the dishes of the day, in the sequence of their starts, with a swap between dishes, so that I cook a main dish and a side dish at the same time.

## Requirements

1. The screen of the occasion has the button "Cook day"
   - a. It is there when the occasion has a dish of yours with no mark
   - b. It has no date rule: it opens a week before the day too
2. "Cook day" opens a screen with a row of chips: "Schedule", "Timeline", and one chip for each dish of yours with a recipe and no mark
   - a. The chips go in the sequence of the start times. A dish with no start comes last
   - b. A chip shows the name and the start
3. "Schedule" shows each of your dishes in the same sequence
   - a. A row has the start, the name, and "Cook", or "Continue" for a dish that is open
   - b. A dish with no recipe has no "Cook", and it has a check
   - c. A dish with a mark is struck, and it goes below the others
4. "Cook" on a row, or a tap on a chip, shows the dish in Cook Mode, as "Cook" on a dish does
   - a. A dish keeps its page, its counter, and its timers when you show a different dish
   - b. "Exit" in a dish that is open leaves the dish and shows "Schedule". The dish stays open, with its page and its timers
   - c. The last page of a dish ends that dish alone, and the screen goes back to "Schedule"
5. "Exit" in the bar of "Cook day" goes back to the screen of the occasion
   - a. It keeps the session, as the [session story](cook-day-keep-the-session.md) tells
   - b. A running timer gets a notice, and no question

## Acceptance criteria

1. GIVEN the screen of "Thanksgiving 2026" WHEN the cook looks below the ink card THEN there is the button "Cook day"
2. GIVEN the screen WHEN the cook taps "Cook day" THEN the chips are "Schedule", "Timeline", "Beef tacos", "Apple crumble", and "Honey glazed carrots"
   - a. AND "Pumpkin pie" has no chip, because Mum brings it
   - b. AND "Gravy" has no chip, because it has no recipe. It is in "Schedule"
3. GIVEN the chips WHEN the cook looks at their sequence THEN "Beef tacos" (12:00) is before "Apple crumble" (13:30), and "Honey glazed carrots" has no start and is last
4. GIVEN "Schedule" WHEN the cook looks at "Gravy" THEN the row has a check and no "Cook"
5. GIVEN "Schedule" WHEN the cook taps "Cook" on "Beef tacos" THEN Cook Mode of "Beef tacos" shows "Get out"
6. GIVEN "Beef tacos" on step 2 WHEN the cook taps the chip "Apple crumble" and then the chip "Beef tacos" THEN Cook Mode shows step 2 of "Beef tacos"
   - a. AND the counter of "Get out" has the same ticks
7. GIVEN a timer of 8:00 on "Beef tacos" WHEN the cook shows "Apple crumble" THEN the timer of "Beef tacos" still runs
8. GIVEN "Apple crumble" in Cook Mode WHEN the cook taps "Exit" THEN "Schedule" shows, and "Beef tacos" still has its page
   - a. AND "Apple crumble" still has its page, and "Continue" is on its row
9. GIVEN the last page of "Apple crumble" WHEN the cook taps "Update the pantry" THEN the line of "Apple crumble" has its mark
   - a. AND "Schedule" shows "Apple crumble" struck
   - b. AND "Beef tacos" has no mark
10. GIVEN "Schedule" WHEN the cook taps "Exit" in the bar THEN the screen of the occasion shows
11. GIVEN a running timer WHEN the cook taps "Exit" in the bar THEN the screen of the occasion shows, with a notice that the timer keeps its time and rings only while Cook day is open

## Depends on

- [Set the serve time and the times of the dishes](cook-day-set-the-times.md): the start of each dish.

## Architecture

- [Occasion](../../architecture/occasion.md): the screen "Cook day".
- [Cook Mode](../../architecture/cook-mode.md): Cook Mode inside "Cook day".
- [End of a meal](../../architecture/end-of-a-meal.md): each dish ends alone.
