---
title: See the food to use soon
summary: "The planner sees which food has a use-by date that is near, so that it is used before it is waste."
parent: pantry-stories.md
persona: Planner
depends-on: [pantry-see-the-food-of-each-place.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / See the food to use soon

# See the food to use soon

As the [planner](../../personas.md), I want to see which food has a use-by date that is near, so that I plan a meal with it before it is waste.

## Requirements

1. A row is "use soon" when its use-by date is near
   - a. The date is in the number of days of the setting "Use soon", or less
   - b. The setting starts at 5 days
   - c. A date in the past is soon too
   - d. A row with no use-by date is never soon
2. A line that is soon shows a badge
   - a. "Past its date" for a date before today
   - b. "Use today" for the date of today
   - c. "1 day" for the date of tomorrow
   - d. The number of days and "days" for a later date
   - e. A line that is not soon shows no badge
3. The head of the pantry shows the number of lines that are soon

## Acceptance criteria

Each criterion starts with the setting "Use soon" at 5 days.

1. GIVEN a row with the use-by date of yesterday WHEN the planner opens the part "Pantry" THEN its line shows the badge "Past its date"
2. GIVEN a row with the use-by date of today WHEN the planner opens the part "Pantry" THEN its line shows the badge "Use today"
3. GIVEN a row with the use-by date of tomorrow WHEN the planner opens the part "Pantry" THEN its line shows the badge "1 day"
4. GIVEN a row with a use-by date 5 days after today WHEN the planner opens the part "Pantry" THEN its line shows the badge "5 days"
5. GIVEN a row with a use-by date 6 days after today WHEN the planner opens the part "Pantry" THEN its line shows no badge
6. GIVEN a row with no use-by date WHEN the planner opens the part "Pantry" THEN its line shows no badge
7. GIVEN a row with a use-by date 3 days after today WHEN the planner sets "Use soon" to 2 days THEN its line shows no badge
8. GIVEN the test vault and the date 2026-10-11 WHEN the planner opens the part "Pantry" THEN the head of the pantry shows "5 soon"
9. GIVEN the test vault and the date 2026-10-11 WHEN the planner opens the part "Pantry" THEN the line of spinach in "Kitchen fridge" shows the badge "2 days"
   - a. AND the line of spinach in "Outside fridge" shows no badge

## Depends on

- [See the food of each place](pantry-see-the-food-of-each-place.md): the lines that get a badge.

## Architecture

- [Use soon](../../architecture/use-soon.md): how the date also moves a recipe, and which row gives its food first.
- [Settings](../../architecture/settings.md): the number of days.
