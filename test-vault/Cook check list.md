# Check list: leave Cook Mode

This list tests the story [Leave Cook Mode](../docs/features/v0.9.0/cook-leave-cook-mode.md) of version 0.9.0, on the phone. Each line has one action and what you must see. The text in brackets is the criterion.

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] Open Cook Mode on Thai green curry, from its recipe card or its meal in the Plan.

## A. Back on the first page

- [ ] On "Get out", "← Back" is not grey. Tap it. Cook Mode closes. (AC 1)
- [ ] Open Cook Mode again. Tap "Exit" with no timer. Cook Mode closes at once. (AC 2)

## B. A running timer

- [ ] Open Cook Mode again. Go to step 2, and tap "Start" on its timer of 2:00. Tap "Exit". The bottom shows "1 timer is running. Exit and stop it?", with "Exit" at the left and "Keep cooking" at the right, in the place of "Back" and "Next". (AC 3)
- [ ] Tap "Keep cooking". The question goes, and the timer still counts down. (AC 4)
- [ ] Tap "Back" two times, to "Get out". The top still shows the timer of step 2. Tap "← Back". The question shows. (AC 6)
- [ ] Tap "Keep cooking". Go to step 3, and start its timer of 5:00. Tap "Exit". The question says "2 timers are running. Exit and stop them?". (AC 7)
- [ ] Tap "Exit" in the question. Cook Mode closes, and no alarm rings after that. (AC 5)

## C. A timer that rang

- [ ] Open Cook Mode again. Go to step 2, start its timer, and wait 2 minutes until it rings. Do not tap "OK". Tap "Exit". The question shows. (AC 8)
- [ ] Tap "Exit" in the question. Cook Mode closes, and the alarm stops.
