---
title: Cook day
summary: "How the plugin plans the day of an occasion: the time and the start of each dish, the screen that shows the day, the four states of a dish, the timeline, and the alarm of a start."
parent: occasion.md
updated: 2026-11-21
---

[Wiki](../README.md) / [Occasion](occasion.md) / Cook day

# Cook day

On Thanksgiving you cook a turkey and five sides, and each one needs its own start. Cook Mode shows one dish. "Cook day" shows the whole day: when to start each dish, where each dish is, and what needs you next. This page tells the rules. The reason for each rule is in the [decision log](../initiatives/holiday-planner/decision-log.md), decisions 33 to 57.

## The serve time, the time, and the start

Three facts decide the plan. The [occasion note](occasion-note.md) holds each one, so you can read and change it with no plugin.

| Fact       | Where it is                                   | Rule                                                                                                          |
| ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Serve time | The property `serve: "15:00"`                 | The hour at which the food is on the table. A chip on the screen of the occasion sets it.                      |
| Time       | The field `3h`, `45 min`, or `1h30` of a dish | How long the dish takes, from its start to the table. With no field, the plugin guesses it (see below).        |
| Start      | The field `start 13:30` of a dish             | With no field, the start is the serve time minus the time, rounded down to 5 minutes.                         |

**The guess.** A recipe has no total time, so the plugin adds the first time of each [step](steps.md), and rounds the sum up to 5 minutes. The guess shows with "~". A recipe with no step time has no guess, and the dish shows "Set time". A field of the line always wins over the guess.

**Whose dishes.** Only your dishes have a time and a start: the dishes with no person, and with no mark. A dish of a guest is not on "Cook day" (the guest cooks it). A dish with a time and no recipe is a task: it has a start and a check, and no "Cook".

**The sequence.** Dishes that wait come first, by start. A dish with no start comes after them, in the sequence of the note. A dish with a mark comes last.

**A day that moves.** "Running late" moves the serve time by 15 minutes. A start that the serve time decided moves with it. A start that the line fixes stays, because you decided it.

## The screen

"Cook day" is a screen of its own, from the button "Cook day" on the screen of the occasion. It has no date rule: you can open it a week before, to see the plan. The colours and the alarm work only when the date of the occasion is today.

From the top:

1. **The place card.** The date, the serve time as a sticker, the name of the occasion in large type, a dashed fold, "Serve in 3h 12m", "2 of 6 done" with a bar, and the next action. While a dish is open, the card shrinks, so that Cook Mode keeps its height.
2. **The chips.** Two views, "Schedule" and "Timeline", and one chip for each of your dishes that has a recipe and no mark.
3. **The stage.** The view or the dish that the chip selects.

### Four states of a dish

A dish looks the same on its chip, on its row, and on its bar.

| State      | Sign                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Waiting    | No colour. The row has its start.                                                                         |
| Soon, late | Amber from 15 minutes before the start. Tomato from the start. Only while the dish is not open.           |
| Cooking    | The dish is open. An olive edge, "Step 2 of 4", and a line that fills as you go.                          |
| Done       | The row is struck, and the dish has no chip.                                                              |

### The next action

The card names the dish that must start next: "Next: start Cranberry sauce in 8 min", "Start Cranberry sauce now", or "Cranberry sauce is 12 min late". A dish that is open or done is never the next dish.

### Timers

A dish with a running timer shows it on its chip and on its row: a pulsing dot and the time that is left, or "2 timers". The badge fills from the left as the time goes. When it rang, it says "Time is up" in the colour of danger. A tap on the badge opens the dish. You stop a timer only inside the dish, in [Cook Mode](cook-mode.md), as the [timers](timers.md) page tells. A clock is "8:00" under one hour, and "2:59:46" from one hour on.

### Many dishes at the same time

A dish that you open stays open behind the screen. Its page, its counter, its choice of food, and its timers stay while you show a different dish. "Exit" inside a dish only leaves it: "Schedule" shows, and the row says "Continue". A dish ends alone: its last page updates the pantry and the record, and gives its line the mark, as for a dish with "Cook". Then the dish is closed, and it starts new the next time.

## The timeline

"Timeline" shows the whole day on one axis of hours, with one bar for each dish that has a time. It does not change when a dish is done.

- **The axis.** It goes from the hour of the first start to the hour of the last end, the serve time, or now. It always holds now, so the red line is in view when a dish is late. It is at least two hours long, and it has an hour mark for each hour, or for each second hour when it is longer than eight hours. A done dish counts for the axis, so the axis stays when you finish dishes.
- **The lines.** A dashed line is the serve time. A red line is now, on the day only.
- **A bar that waits or runs** goes from the start to the end of the time. It has the colour of the state of its dish. A dish that you opened has a darker share, from its start to now. A tap opens the dish. A dish with no recipe has a hatched bar with nothing to open.
- **A bar that is done** is muted, with a check, and its name is struck. It ends at the hour of the `done` field of its line, and it is as long as the time of the dish, so "Running late" does not move it. A done dish with no `done` hour keeps its planned bar. The label says "Done 14:50".
- **A dish with no time** is in a line below the chart.

**The chart follows its width.** The chart measures its own width, and it does not use the width of the window, so it is right in a split view too.

- **Layout.** From 640 px on, the names are in a column at the left (176 px) and the bars are at their side, as a Gantt chart. Below 640 px, each name is above its bar, on one line, with its label on a second line. A long name ends in "…".
- **Hour marks.** A mark needs about 56 px for its label. The chart shows a mark for each 30 minutes, hour, 2 hours, 3 hours, or more, as the width allows, so that labels never touch. The thin rules stay hourly while they have 14 px.
- **Tags.** The tag of now is in the lower row below the bars, and the tag of the serve time is in the row above it. Lines that are less than 96 px apart share one tag, "Now · Serve". A tag near an edge grows toward the inside of the card.
- **Targets.** A bar is at least 12 px wide, so that a short dish is visible. The name above or beside a bar opens the dish too, with a target of at least 44 px.

The bars go in the sequence of their starts. Read it so: a bar that ends before the dashed line is a dish that is ready early, so it must wait warm. A bar that crosses the dashed line is a dish that makes the serve time late. Bars that overlap are dishes that you cook together. A done bar that was longer than its plan tells you how long the dish really took.

## The alarm of a start

At the start of a dish that is not open, the alarm of [Cook Mode](timers.md) rings one time, with a banner "Time to start Beef tacos". "Open" shows the dish and stops the alarm, and "OK" stops it. A dish that is already late when you open the screen has the colour and no alarm. The screen asks the device to keep the screen on, so the alarm can ring. A phone cannot ring when Obsidian is shut, so the colour that you see when you look is the part that always works.

## The session stays

"Exit" on "Cook day" leaves the screen and keeps everything. A restart of Obsidian keeps it too. The occasion screen then shows "Resume cook day", with the open dishes and the running timers, and "Discard" removes the session.

**What is saved.** The open dishes in the sequence of their opening, the view that is shown, and for each dish: its page, its ticks of its own "Get out", its choice of food, and its timers. A timer is saved with its end time, so the time that is left is correct after any wait.

**Where.** In the local storage of Obsidian, on this device, one entry for each occasion. It is not a note, and it does not sync. A timer on the laptop does not appear on the phone: Sync is not live, so two devices would ring and write at the same time. The mark of a dish is in the note, so a finished dish shows on both devices.

**Which dish.** A dish is known by its recipe or its name and its count among the lines with the same one. A line that moves in the note keeps its session. A dish that is gone, or has its mark, is dropped when the session is restored.

**A timer that ended while you were away** shows "Time is up" when you come back. It makes no sound, unless the setting "Sound for a timer that ended while you were away" is on. A timer rings only while Cook day or Cook Mode is open. Exit with a running timer gives a notice about it.

**It ends** when its dish is finished, with "Discard", when the occasion is no longer active, or after 36 hours. A session with no open dish and no tick is removed.

## What the plugin writes

In the vault, "Cook day" changes the note of the occasion in three ways only: the property `serve` (the chip and "Running late"), the fields time and start of a dish line (the sheet of the dish), and the mark of a dish with its hour (a check, or the end of Cook Mode), written as `done 14:50`. The session is on the device and not in the vault.

## Further reading

- [Occasion note](occasion-note.md): the exact form of `serve`, the time, and the start.
- [Cook Mode](cook-mode.md): the pages that "Cook day" shows for one dish.
- [Cook day stories](../features/v0.12.0/cook-day-stories.md): each rule as a story with checks.
