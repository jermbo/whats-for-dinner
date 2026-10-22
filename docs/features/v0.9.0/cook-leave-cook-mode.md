---
title: Leave Cook Mode
summary: "The cook leaves Cook Mode with Back from the first page, and Cook Mode asks first when a timer is running."
parent: cook-stories.md
updated: 2026-10-21
persona: Cook
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Cook stories](cook-stories.md) / Leave Cook Mode

# Leave Cook Mode

As the [cook](../../personas.md), I want to leave Cook Mode from the button under my thumb, and I want a question before a running timer stops, so that I do not lose the time of the rice.

## Requirements

1. On the page "Get out", "← Back" closes Cook Mode, as "Exit" does
   - a. "← Back" is not disabled on that page
2. With no timer, "Exit" and "← Back" on "Get out" close Cook Mode at once
3. While a timer runs, "Exit" and "← Back" on "Get out" ask first
   - a. The question is "1 timer is running. Exit and stop it?", or "2 timers are running. Exit and stop them?"
   - b. The two buttons at the bottom change to "Keep cooking" and "Exit", in the same place
   - c. A timer that rang and waits for "OK" counts as running
4. "Keep cooking" closes the question, and each timer continues
5. "Exit" in the question closes Cook Mode, and each timer stops
6. A tap on a different page or on a timer of a different step closes the question

## Acceptance criteria

Each criterion starts with Cook Mode open on Thai green curry of the test vault.

1. GIVEN Cook Mode is on "Get out" WHEN the cook taps "← Back" THEN Cook Mode closes
2. GIVEN no timer runs WHEN the cook taps "Exit" THEN Cook Mode closes
3. GIVEN a step with a timer, and its timer runs WHEN the cook taps "Exit" THEN the screen shows "1 timer is running. Exit and stop it?"
   - a. AND the buttons at the bottom are "Keep cooking" and "Exit"
4. GIVEN the question shows WHEN the cook taps "Keep cooking" THEN the question closes
   - a. AND the timer still runs
5. GIVEN the question shows WHEN the cook taps "Exit" in the question THEN Cook Mode closes
6. GIVEN a timer runs and the cook went back to "Get out" WHEN the cook taps "← Back" THEN the screen shows the question
7. GIVEN two timers run WHEN the cook taps "Exit" THEN the screen shows "2 timers are running. Exit and stop them?"
8. GIVEN a timer rang and waits for "OK" WHEN the cook taps "Exit" THEN the screen shows the question

## Depends on

Nothing.

## Architecture

- [Cook Mode](../../architecture/cook-mode.md): the pages and the two buttons.
- [Timers](../../architecture/timers.md): why a timer is part of Cook Mode.
