---
title: Timers
summary: 'How a step of a recipe gets its timer, why a timer continues when you go to a different step, and how the alarm gets your attention.'
parent: cook-mode.md
updated: 2026-10-11
---

[Wiki](../README.md) / [Cook Mode](cook-mode.md) / Timers

# Timers

The rice needs 15 minutes, and in that time you cut the onion. A timer on a second device needs clean hands. So Cook Mode has its timers on the page of the step. This page tells where a timer comes from, and how it rings.

## The time is in the text of the step

You do not set a timer. The plugin reads the time in the text of the [step](steps.md).

| The text says                    | The timer shows |
| -------------------------------- | --------------- |
| "Cook for 8 minutes"             | 8:00            |
| "Simmer for 1 1/2 hours"         | 90:00           |
| "Bake for 1 hour and 30 minutes" | 90:00           |
| "Cook for 2-3 minutes"           | 3:00            |

A time is a number and a unit: hours, minutes, or seconds, also as "hrs", "mins", and "secs". The number has the forms of an [amount](amounts.md). A time can have parts, from large to small. If a step has two different times, the first one counts.

## A timer continues

A step with a time shows its clock and the button "Start". After that, the timer continues when you go to a different step. The top of the screen shows each timer of a different step, with its step number. A tap on it goes to that step.

Thus you start a timer at step 3, and you see its time while you are at step 4.

A timer is part of Cook Mode. If you exit Cook Mode, all timers stop.

## The alarm rings until you answer

When the time is up, four things occur:

- The clock shows "Time is up" and flashes.
- Obsidian shows a notice with the recipe and the step.
- The alarm sounds: a short sound, again and again.
- A phone vibrates.

The alarm stops when you tap "OK", or after one minute. If a second timer ends in that minute, the minute starts again.

The sound, the volume, and the vibration are [settings](settings.md). A device lets a page make sound only after a touch. Your tap on "Start" is that touch, so the alarm can sound later.

## The screen stays on

A timer is of no use on a dark screen. While Cook Mode is open, the plugin asks the device to keep the screen on. This is a setting too.

## Further reading

- [End of a meal](end-of-a-meal.md): what occurs after the last step.
