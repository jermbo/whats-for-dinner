---
title: Timers
summary: 'A time in the text of a step is a button. A timer that runs stays in view on each card.'
parent: cook-mode.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Recipes](README.md) / [Cook mode](cook-mode.md) / Timers

# Timers

A meal often has two things on the heat at the same time. The app gives each of them a timer.

## A time in the text is a button

The app [finds each time in the text](step-text.md) of a step. On the step card, that time is a button in the sentence. A tap starts it, and the button then shows the time that remains.

## A timer stays in view

A timer that runs shows as a small chip at the top of each card: the number of its step and the time that remains. So you can start the rice on step 2 and read step 3 while it cooks.

More than one timer can run, and each has its own chip. A tap on a chip opens its step. There you can stop the timer.

## When a timer ends

The phone makes a sound, and the chip shows "Done" until you tap it.

## How a timer counts

The app does not count seconds. When you start a timer, the app stores the time when it must end, in the [cook session](cook-session.md). Each second, the screen shows the difference between that time and now.

The reason: a browser stops the code of a page that you cannot see. A counter would stop also. An end time does not stop. When you come back, the difference is correct.

## The limit

The app is a page in a browser. When the page is not in view, it cannot make a sound. If a timer ends while you are in a different app, you see "Done" when you come back, but you hear nothing. This is one more reason to keep the screen on in Cook mode.

## An example

| Time  | What occurs                    | The chips                   |
| ----- | ------------------------------ | --------------------------- |
| 18:10 | You start the rice on step 2.  | Step 2, 12:00               |
| 18:14 | You start the sauce on step 4. | Step 2, 8:00. Step 4, 15:00 |
| 18:22 | The phone makes a sound.       | Step 2, Done. Step 4, 7:00  |

## Further reading

- [Offline](../shopping/offline.md): why the app is a page in a browser, with no server behind it.
