---
title: Know when to start
summary: "Cook day shows a running timer on its dish, colours a dish that must start soon, and rings the alarm at the start time."
parent: cook-day-stories.md
updated: 2026-11-21
persona: Cook
depends-on: [cook-day-cook-the-dishes.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Cook day stories](cook-day-stories.md) / Know when to start

# Know when to start

As the [cook](../../personas.md), I want to see which dishes have a running timer, and to hear when a dish must start, so that nothing burns or starts late while I work on a different dish.

## Requirements

1. A dish with a running timer shows it on its chip and on its row
   - a. The badge has a pulsing dot and the time that is left, such as "4:12", or "2:59:46" from one hour on
   - b. The badge fills from the left as the time goes
   - c. With more than one timer, the badge says "2 timers", and it fills for the timer that ends first
   - d. A timer that rang shows "Time is up" in the colour of danger
   - e. A tap on the chip or the row opens the dish
   - f. Cook day has no button that stops a timer. You stop it inside the dish
2. A chip of a dish that is not open has a colour, on the day of the occasion only
   - a. From 15 minutes before the start, the chip is amber
   - b. At the start and after it, the chip is tomato
   - c. A dish that you opened, or that has a mark, has no colour
3. At the start time of a dish that is not open, the alarm of Cook Mode rings
   - a. A banner says "Time to start Beef tacos", with "Open" and "OK"
   - b. "Open" shows the dish and stops the alarm. "OK" stops the alarm
   - c. The alarm rings one time for each dish
   - d. A device with no sound gives the banner and the colour only
4. The clock shows the hour of the device, and the colours and the alarm change with it

## Acceptance criteria

1. GIVEN a timer of 4:12 on step 3 of "Beef tacos" WHEN the cook shows "Apple crumble" THEN the chip of "Beef tacos" shows "4:12"
   - a. AND the row of "Beef tacos" in "Schedule" shows "4:12"
2. GIVEN two timers on "Beef tacos" WHEN the cook looks at its chip THEN the badge says "2 timers"
3. GIVEN a timer that rang WHEN the cook looks at the chip THEN it says "Time is up" with the colour of danger
   - a. AND a tap on the chip shows the dish, with the timer on its step
4. GIVEN a dish with a timer WHEN the cook looks at "Cook day" outside the dish THEN no button stops the timer
   - a. AND a timer of 3 hours shows "2:59:46" and not "179:46"
   - b. AND the badge is filled by the share of the time that has gone
5. GIVEN the time 11:50 and "Beef tacos" with the start 12:00 WHEN the cook looks at the chip THEN it is amber
6. GIVEN the time 11:30 WHEN the cook looks at the chip THEN it has no colour
7. GIVEN the time 12:05 and "Beef tacos" not open WHEN the cook looks at the chip THEN it is tomato
8. GIVEN the time 12:05 and "Beef tacos" open WHEN the cook looks at the chip THEN it has no colour
9. GIVEN the clock goes to 12:00 WHEN "Beef tacos" is not open THEN the alarm rings and the banner says "Time to start Beef tacos"
   - a. AND "OK" stops the alarm, and the banner goes
   - b. AND "Open" shows "Beef tacos", and stops the alarm
10. GIVEN the date of the occasion is in 5 days WHEN the cook opens "Cook day" THEN no chip has a colour, and no alarm rings

## Depends on

- [Cook the dishes at the same time](cook-day-cook-the-dishes.md): the screen, and the timers of each dish.

## Architecture

- [Cook Mode](../../architecture/cook-mode.md): the timers that the badges show.
- [Occasion](../../architecture/occasion.md): the colours and the alarm of the start.
- [Timers](../../architecture/timers.md): the timers that the badges show.
