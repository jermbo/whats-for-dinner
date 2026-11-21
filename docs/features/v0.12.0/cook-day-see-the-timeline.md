---
title: See the day on a timeline
summary: "Cook day has a timeline of the whole day, with one bar for each dish, also for a dish that is done."
parent: cook-day-stories.md
updated: 2026-11-21
persona: Cook
depends-on: [cook-day-cook-the-dishes.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Cook day stories](cook-day-stories.md) / See the day on a timeline

# See the day on a timeline

As the [cook](../../personas.md), I want to see all dishes on one axis of hours, so that I see what is done, what overlaps, and what is late.

## Requirements

1. The chip "Timeline" shows the whole day: one bar for each of your dishes that has a time, also for a dish that is done
   - a. The bar goes from the start to the end of the time
   - b. The axis has an hour mark for each hour, or for each second hour when the day is longer than 8 hours
   - c. A dashed line shows the serve time, and a red line shows now, on the day only
   - d. A bar has the colour of its state: olive when open, amber when soon, tomato when late
   - e. A tap on a bar opens its dish
   - f. A dish with a time and no recipe has a hatched bar, and nothing opens
   - g. A dish with no time is in a line below: "No time yet"
   - h. The axis does not change when a dish is done, and it always holds now
   - i. A dish that is done has a muted bar with a check, and its name is struck. The bar ends at the hour of `done 14:50` of its line, and it is as long as the time of the dish. The label says "Done 14:50"
   - j. A dish that is done with no `done` hour keeps its planned bar
   - k. A bar of a dish that you opened is darker from its start to now
   - l. The bars go in the sequence of their starts
   - m. The chart follows its own width. From 640 px, the names are in a column at the left. Below 640 px, each name is above its bar
   - n. A mark of the axis has about 56 px for its label, so a narrow chart has a mark for each second or third hour, and labels never touch
   - o. The tag of now and the tag of the serve time are in two rows. When the lines are less than 96 px apart, there is one tag, "Now · Serve"
   - p. A bar is at least 12 px wide. The name of a dish that is not done opens the dish, with a target of at least 44 px high

## Acceptance criteria

1. GIVEN the serve time "15:00" and "Roast turkey" with the start 11:10 and 3h50 WHEN the cook taps "Timeline" THEN the bar of "Roast turkey" goes from 11:10 to 15:00
2. GIVEN the same day WHEN the cook looks at the axis THEN it has the marks 11:00, 12:00, 13:00, 14:00, and 15:00
   - a. AND a dashed line is at 15:00
3. GIVEN the time is 12:00 on the day WHEN the cook looks at the timeline THEN a red line "Now" is at 12:00
4. GIVEN the date is in 5 days WHEN the cook looks at the timeline THEN there is no "Now" line
5. GIVEN the cook taps the bar of "Cranberry sauce" THEN Cook Mode of "Cranberry sauce" shows
6. GIVEN "Gravy" has 20 min and no recipe WHEN the cook looks at the timeline THEN its bar is hatched, and a tap does nothing
7. GIVEN "Mashed potatoes" has no time WHEN the cook looks at the timeline THEN the line "No time yet" names it
8. GIVEN "Gravy" with 20 min and the line `· done 14:30` WHEN the cook looks at the timeline THEN its bar goes from 14:10 to 14:30, it is muted with a check, and the label says "Done 14:30 · 20 min"
9. GIVEN "Honey glazed carrots" is done WHEN the cook looks at the axis THEN it has the same marks as before the dish was done
10. GIVEN the time is 14:00 and "Roast turkey" is late and open WHEN the cook looks at the timeline THEN the red "Now" line is at 14:00, in view
11. GIVEN "Roast turkey" (12:00 to 13:00) is open at 12:30 WHEN the cook looks at its bar THEN the first half is darker
12. GIVEN "Mashed potatoes" has a mark from an earlier version, with no `done` hour WHEN the cook looks at the timeline THEN its bar is the planned one, muted, with a check
13. GIVEN the cook ticks "Gravy" at 14:32 THEN its line ends with `· done 14:32`
    - a. AND the cook unticks it, and the line has no `done` field
14. GIVEN "Gravy" is done and the cook taps "Running late" THEN the bar of "Gravy" does not move
15. GIVEN a chart 360 px wide and an axis of 6 hours WHEN the cook looks at the axis THEN the marks are 2 hours apart, and no two labels touch
16. GIVEN a chart 900 px wide WHEN the cook looks at the rows THEN each name is in a column at the left, and its bar is at its right
17. GIVEN a chart 360 px wide WHEN the cook looks at a row THEN the name is above its bar, on one line, and a long name ends in "…"
18. GIVEN the time is 14:55 and the serve time is 15:00 WHEN the cook looks at the tags THEN one tag says "Now · Serve"
19. GIVEN the time is 12:00 and the serve time is 15:00 on a chart 360 px wide THEN "Now" and "Serve" are two tags in two rows, and neither is clipped by the card
20. GIVEN "Honey glazed carrots" with 10 min on an axis of 6 hours WHEN the cook looks at its bar THEN the bar is at least 12 px wide
21. GIVEN the name "Roast turkey" WHEN the cook taps it THEN Cook Mode of "Roast turkey" shows

## Depends on

- [Cook the dishes at the same time](cook-day-cook-the-dishes.md): the screen and its chips.

## Architecture

- [Cook day](../../architecture/cook-day.md): the timeline.
