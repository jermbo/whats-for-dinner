---
title: Set an amount with the keyboard
summary: "The keeper sets the amount of a row with the keys, and a screen reader tells what the bar is."
parent: pantry-stories.md
persona: Keeper
depends-on: [pantry-correct-an-amount.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Set an amount with the keyboard

# Set an amount with the keyboard

As the [keeper](../../personas.md), I want to set the amount of a row with the keys, so that I can correct the pantry when I cannot use a pointer or cannot see the bar.

## Requirements

1. Move the focus to the bar with the Tab key
   - a. The bar shows a ring while it has the focus
2. Press a key to set the amount of the selected place
   - a. Right arrow or up arrow: one step more
   - b. Left arrow or down arrow: one step less
   - c. Home: nothing
   - d. End: the maximum
   - e. The amount is not less than 0 and not more than the maximum
   - f. The page does not scroll when the bar uses the key
3. Select a different place with the keys
   - a. An arrow key on an option selects the next option
   - b. The group of options has the name "Place to update"
4. A screen reader reads the bar as a slider
   - a. Its name is "Amount of", the food item, "in", and the selected place
   - b. Its value is the amount as the bar shows it

## Acceptance criteria

Each criterion starts with the rice of the test vault: a full amount of 5 kg, 500 g in "Kitchen pantry", and 2 kg in "Downstairs pantry". The bar of rice is open on "Kitchen pantry".

1. GIVEN the bar of rice is open WHEN the keeper moves the focus to the bar with the Tab key THEN the bar shows a ring
2. GIVEN the bar has the focus WHEN the keeper presses the right arrow key THEN the amount of "Kitchen pantry" is "750 g"
3. GIVEN the bar has the focus WHEN the keeper presses the up arrow key THEN the amount of "Kitchen pantry" is "750 g"
4. GIVEN the bar has the focus WHEN the keeper presses the left arrow key THEN the amount of "Kitchen pantry" is "250 g"
5. GIVEN the bar has the focus WHEN the keeper presses the down arrow key THEN the amount of "Kitchen pantry" is "250 g"
   - a. AND the page does not scroll
6. GIVEN the bar has the focus WHEN the keeper presses the Home key THEN the amount of "Kitchen pantry" is "None"
7. GIVEN the bar has the focus WHEN the keeper presses the End key THEN the amount of "Kitchen pantry" is "3000 g"
8. GIVEN the amount of "Kitchen pantry" is "3000 g" WHEN the keeper presses the right arrow key THEN the amount of "Kitchen pantry" is "3000 g"
9. GIVEN the amount of "Kitchen pantry" is "None" WHEN the keeper presses the left arrow key THEN the amount of "Kitchen pantry" is "None"
10. GIVEN the focus is on the option "Kitchen pantry" WHEN the keeper presses the down arrow key THEN the selected place is "Downstairs pantry"
11. GIVEN a screen reader is on WHEN the focus moves to an option THEN the screen reader reads the group name "Place to update"
12. GIVEN a screen reader is on WHEN the focus moves to the bar THEN the screen reader reads a slider with the name "Amount of Rice in Kitchen pantry"
    - a. AND the value "500 g"
13. GIVEN a screen reader is on and the bar has the focus WHEN the keeper presses the right arrow key THEN the screen reader reads "750 g"

## Depends on

- [Correct an amount with the bar](pantry-correct-an-amount.md): the bar, with its steps and its maximum.

## Architecture

- [Amount bar](../../architecture/card.md): how the bar and its steps work.
