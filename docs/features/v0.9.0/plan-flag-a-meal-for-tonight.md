---
title: Flag a meal for tonight
summary: "The cook flags one of the planned meals for tonight. It goes into the section Tonight at the top, as a large dark card with its preparation. Each card keeps Cook."
parent: plan-stories.md
updated: 2026-10-21
persona: Cook
depends-on: [plan-one-list-of-meals.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Plan stories](plan-stories.md) / Flag a meal for tonight

# Flag a meal for tonight

As the [cook](../../personas.md), I want to flag the meal that I plan to cook tonight, so that I see at a glance what I selected and what its preparation is.

## Requirements

1. Each card has the flag "☆ Tonight"
2. Tap "☆ Tonight" to flag the meal
   - a. The meal goes into the section "Tonight", above the other meals, as a large dark card
   - b. The flag shows "★ Tonight", full
   - c. A meal that had the flag before loses it, and goes back into the list
   - d. The task of the meal in the plan note gets the date of today: ` · 2026-10-21`
   - e. The card shows its preparation with its check box
   - f. Above the other meals, a group head "Other options" shows their number
3. Tap "★ Tonight" to take the flag off
   - a. The meal goes back to its place in the sequence of the plan note
   - b. The plan note has no date on its task
   - c. The Plan has no section "Tonight", and no group head "Other options"
4. Each card has "Cook →", with or with no flag
   - a. "Cook →" opens Cook Mode for the main dish
   - b. On the flagged card, "Cook →" is the main button when the preparation is done or the recipe has none. While the preparation waits, it is a quiet button
   - c. On each other card, "Cook →" is a quiet button
5. A date on a task that is not today has no effect: the meal is in the list, with no flag
   - a. The plan note keeps the date as text
6. "A day" and "Not today" are not on the card

## Acceptance criteria

Each criterion starts with the plan note of the test vault, on 21 October 2026.

1. GIVEN the Plan WHEN the cook looks at the card of Pancakes THEN it has "☆ Tonight" and "Cook →"
2. GIVEN the Plan WHEN the cook taps "☆ Tonight" on Pancakes THEN the Plan has the section "Tonight" with Pancakes as a dark card
   - a. AND the card shows "★ Tonight"
   - b. AND the task of Pancakes in the plan note has ` · 2026-10-21`
   - c. AND the group head "Other options" shows "3"
3. GIVEN Pancakes has the flag WHEN the cook taps "☆ Tonight" on Spinach omelette THEN Spinach omelette is in the section "Tonight"
   - a. AND Pancakes is in the list, in the third place
   - b. AND the task of Pancakes has no date
4. GIVEN Pancakes has the flag WHEN the cook taps "★ Tonight" on Pancakes THEN the Plan has no section "Tonight"
   - a. AND Pancakes is in the third place
   - b. AND the task of Pancakes has no date
5. GIVEN Beef tacos has the callout `> [!prep] Take the ground beef out of the freezer in the morning.` and is in the plan WHEN the cook flags Beef tacos THEN its card shows the preparation with a check box
   - a. AND "Cook →" is a quiet button
6. GIVEN Beef tacos has the flag and its preparation waits WHEN the cook ticks "Prep is done" THEN "Cook →" is the main button
7. GIVEN no meal has the flag WHEN the cook taps "Cook →" on Banana oat muffins THEN Cook Mode opens Banana oat muffins
8. GIVEN the task of Spinach omelette has ` · 2026-10-20` WHEN the cook opens the Plan on 21 October THEN Spinach omelette is in the list with "☆ Tonight"
   - a. AND the Plan has no section "Tonight"

## Depends on

- [One list of meals](plan-one-list-of-meals.md): the list and the card that this story changes.

## Architecture

- [Plan](../../architecture/plan.md): why the week is a set of options, and the section "Tonight".
- [Plan note](../../architecture/plan-note.md): the date of a task.
- [Preparation](../../architecture/preparation.md): the callout "prep" and its check box.
- [Decision log: meal plan](../../initiatives/meal-plan/decision-log.md): decisions 6 and 12 c.
