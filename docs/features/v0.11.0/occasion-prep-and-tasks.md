---
title: See the preparation and the tasks
summary: "The planner sees the preparation of each of your dishes with \"Prep is done\", and the tasks of the occasion in the sequence of their days."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-see-an-occasion.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / See the preparation and the tasks

# See the preparation and the tasks

As the [planner](../../personas.md), I want to see the preparation of my dishes and the tasks of the occasion in the sequence of their days, so that I do the work before the day in time.

## Requirements

1. Each of your dishes whose recipe has a preparation shows its text, with the check box "Prep is done"
   - a. A dish of a different person shows no preparation
   - b. A dish with a mark shows no preparation
2. A tap on "Prep is done" writes the words `prep done` at the end of the line of the dish
   - a. A second tap takes the words out of the line
   - b. When the box is set, its edge becomes olive, as on the meal of tonight in the Plan
3. The screen has the section "To do", below "To buy", with each occasion task
   - a. An occasion task is a task line below the heading `## To do`
   - b. The section is there also with no task, so that "Add a task" is in reach
4. The tasks are in the sequence of their days
   - a. The day of a task is a field of the form year-month-day after ` · `
   - b. A task with no day comes after each task with a day
   - c. Tasks with the same day, or with no day, keep the sequence of the note
   - d. Each task shows its text, and its day as "24 Nov"
5. A tap on a task gives it its mark, and a second tap takes the mark off
6. The field "Add a task" below the tasks adds a task with no day
   - a. The line `- [ ] <text>` goes after the last task
   - b. With no heading `## To do`, the screen writes the heading and the line at the end of the note
   - a. The mark changes only `[ ]` or `[x]` in the line. The other text of the line stays
   - b. A task with a mark shows a full check and a line through its text, and keeps its place

## Acceptance criteria

Each criterion starts with the note "Thanksgiving 2026" of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives it, with its screen open. The recipe "Beef tacos" has the preparation "Take the ground beef out of the freezer in the morning."

1. GIVEN the screen WHEN the planner looks at "Beef tacos" THEN it shows "Take the ground beef out of the freezer in the morning."
   - a. AND the box "Prep is done" is not set
2. GIVEN the screen WHEN the planner taps "Prep is done" on "Beef tacos" THEN the line is `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · prep done`
   - a. AND the box is set, with an olive edge
3. GIVEN the line `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · prep done` WHEN the planner taps "Prep is done" THEN the line is `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main`
4. GIVEN the line `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · Mum` WHEN the planner looks at "Beef tacos" THEN it shows no preparation
5. GIVEN the line `- [x] [[Recipes/Beef tacos|Beef tacos]] · main` WHEN the planner looks at "Beef tacos" THEN it shows no preparation
6. GIVEN the screen WHEN the planner looks at "Apple crumble" THEN it shows no preparation
7. GIVEN the screen WHEN the planner looks at "To do" THEN the tasks are "Borrow chairs", "Clean the oven", and "Buy candles", in this sequence
   - a. AND "Borrow chairs" shows "24 Nov"
   - b. AND "Buy candles" shows no day
8. GIVEN the screen WHEN the planner taps "Borrow chairs" THEN the line is `- [x] Borrow chairs · 2026-11-24`
   - a. AND "Borrow chairs" shows a full check and a line through its text
   - b. AND "Borrow chairs" is still the first task
9. GIVEN the line `- [x] Borrow chairs · 2026-11-24` WHEN the planner taps "Borrow chairs" THEN the line is `- [ ] Borrow chairs · 2026-11-24`
10. GIVEN a note "Game night" with dishes and no heading `## To do` WHEN the planner adds the task "Buy ice" THEN the note ends with `## To do` and `- [ ] Buy ice`
11. GIVEN the screen WHEN the planner looks at the dishes THEN no task, such as "Buy candles", is a dish
12. GIVEN the screen WHEN the planner types "Get ice" into "Add a task" and presses Enter THEN the line `- [ ] Get ice` comes after `- [ ] Buy candles`

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the screen, and the line above `## To do` that is a dish.

## Architecture

- [Occasion note](../../architecture/occasion-note.md): the form of the note, and what the plugin changes.
- [Preparation](../../architecture/preparation.md): the callout "prep" of a recipe, and the box "Prep is done".
- [Plan note](../../architecture/plan-note.md): the words `prep done` in a task line.
