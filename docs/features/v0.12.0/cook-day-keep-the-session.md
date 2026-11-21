---
title: Keep the session
summary: "Cook day saves the open dishes, their pages, their ticks, and their timers on the device, so that Exit or a restart of Obsidian loses nothing."
parent: cook-day-stories.md
updated: 2026-11-21
persona: Cook
depends-on: [cook-day-cook-the-dishes.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Cook day stories](cook-day-stories.md) / Keep the session

# Keep the session

As the [cook](../../personas.md), I want Cook day to keep my place when I leave it or when Obsidian restarts, so that I can change something in the note and come back to the same dishes and timers.

## Requirements

1. Cook day saves its session on this device, a short time after each change
   - a. The open dishes, in the sequence in which you opened them
   - b. The view that is shown: a view, or a dish
   - c. For each open dish: its page, its ticks of "Get out", its choice of food, and its timers
   - d. The ticks of the list "Get out" of Cook day
   - e. The session is not in a note, and it does not sync to another device
2. A dish is known by its recipe or its name, and its count among the lines with the same one. It is not known by its place in the note
   - a. A dish line that moves in the note keeps its session
   - b. A dish that is gone from the note, or has its mark, is not restored
3. "Exit" keeps the session
   - a. The screen of the occasion shows "Resume cook day", the number of open dishes, and the number of running timers
   - b. "Resume cook day" shows Cook day as you left it
   - c. "Discard" removes the session
4. A restart of Obsidian keeps the session in the same way
5. A timer saves its end time. When you come back, it shows the time that is left
   - a. A timer that ended while you were away shows "Time is up"
   - b. With the setting "Sound for a timer that ended while you were away" on, the alarm also rings. By default, it is off
   - c. A timer rings only while Cook day or Cook Mode is open
6. A session ends
   - a. When its dish is finished: the dish starts new the next time
   - b. With "Discard"
   - c. When the occasion is no longer active, or the session is older than 36 hours
   - d. A session with no open dish and no tick is removed

## Acceptance criteria

1. GIVEN "Beef tacos" on step 2 and "Apple crumble" on "Get out" with 2 ticks WHEN the cook taps "Exit" and then "Resume cook day" THEN "Beef tacos" is on step 2 and "Apple crumble" has its 2 ticks
2. GIVEN the same state WHEN Obsidian restarts and the cook taps "Resume cook day" THEN the same dishes are open with the same pages
3. GIVEN the screen of the occasion WHEN the cook looks at the button THEN it says "Resume cook day" and "2 open · 1 timer"
4. GIVEN a timer of 10 minutes with 6 minutes left WHEN the cook exits and comes back after 2 minutes THEN the timer shows about 4 minutes
5. GIVEN a timer of 1 minute WHEN the cook exits and comes back after 3 minutes THEN the timer says "Time is up"
   - a. AND no sound plays, with the setting off
   - b. AND the alarm rings, with the setting on
6. GIVEN a session and the cook moves the line of "Beef tacos" in the note WHEN the cook resumes THEN "Beef tacos" has its own page and its timers
7. GIVEN a session and the cook removes the line of "Beef tacos" WHEN the cook resumes THEN "Beef tacos" is not open, and the other dishes are
8. GIVEN a session WHEN the cook taps "Discard" THEN the button says "Cook day", and no dish is open
9. GIVEN the last page of "Beef tacos" WHEN the cook taps "Update the pantry" THEN the session has no "Beef tacos"
10. GIVEN a session on a laptop WHEN the cook opens the occasion on a phone THEN the phone has no session

## Depends on

- [Cook the dishes at the same time](cook-day-cook-the-dishes.md): the open dishes.

## Architecture

- [Cook day](../../architecture/cook-day.md): what the session holds, and where it is.
- [Timers](../../architecture/timers.md): a timer that ended while you were away.
- [Settings](../../architecture/settings.md): the setting for the sound.
