---
title: See the day on a timeline, and get out the food
summary: "Cook day has a timeline with one bar for each dish, and one list of the food to put on the counter for all dishes."
parent: cook-day-stories.md
updated: 2026-11-21
persona: Cook
depends-on: [cook-day-cook-the-dishes.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Cook day stories](cook-day-stories.md) / See the day on a timeline, and get out the food

# See the day on a timeline, and get out the food

As the [cook](../../personas.md), I want to see all dishes on one axis of hours, and one list of the food to take out, so that I see what overlaps and I take out the food one time.

## Requirements

1. The chip "Timeline" shows one bar for each of your dishes that has a start and a time
   - a. The bar goes from the start to the end of the time
   - b. The axis has an hour mark for each hour, or for each second hour when the day is longer than 8 hours
   - c. A dashed line shows the serve time, and a red line shows now, on the day only
   - d. A bar has the colour of its state: olive when open, amber when soon, tomato when late
   - e. A tap on a bar opens its dish
   - f. A dish with a time and no recipe has a hatched bar, and nothing opens
   - g. A dish with no time is in a line below: "No time yet"
2. The chip "Get out" lists the food of each of your dishes with a recipe and no mark
   - a. Each dish is a group, with its scale, such as "×2"
   - b. A row has the amount as the recipe has it, and the name of the food
   - c. A tap on a row ticks it. The count "N of M on the counter" changes
   - d. A tick changes nothing in the pantry, and Cook Mode has its own counter

## Acceptance criteria

1. GIVEN the serve time "15:00" and "Roast turkey" with the start 11:10 and 3h50 WHEN the cook taps "Timeline" THEN the bar of "Roast turkey" goes from 11:10 to 15:00
2. GIVEN the same day WHEN the cook looks at the axis THEN it has the marks 11:00, 12:00, 13:00, 14:00, and 15:00
   - a. AND a dashed line is at 15:00
3. GIVEN the time is 12:00 on the day WHEN the cook looks at the timeline THEN a red line "Now" is at 12:00
4. GIVEN the date is in 5 days WHEN the cook looks at the timeline THEN there is no "Now" line
5. GIVEN the cook taps the bar of "Cranberry sauce" THEN Cook Mode of "Cranberry sauce" shows
6. GIVEN "Gravy" has 20 min and no recipe WHEN the cook looks at the timeline THEN its bar is hatched, and a tap does nothing
7. GIVEN "Mashed potatoes" has no time WHEN the cook looks at the timeline THEN the line "No time yet" names it
8. GIVEN "Honey glazed carrots" with ×2 WHEN the cook taps "Get out" THEN the group says "Honey glazed carrots ×2"
   - a. AND the row of the carrots says "500 g carrots"
9. GIVEN the cook taps the row "500 g carrots" THEN it is ticked, and the count goes up by 1
   - a. AND the pantry does not change
10. GIVEN "Apple crumble" has a mark WHEN the cook taps "Get out" THEN it has no group

## Depends on

- [Cook the dishes at the same time](cook-day-cook-the-dishes.md): the screen and its chips.

## Architecture

- [Occasion](../../architecture/occasion.md): the timeline and the list.
