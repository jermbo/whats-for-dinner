---
title: Gap plan
summary: 'The sequence of the work that brings the app to the design: Pantry, Cook mode, Meal plan, and then the rest.'
parent: README.md
updated: 2026-10-05
---

[Wiki](../README.md) / [Design](README.md) / Gap plan

# Gap plan

The [record of the design gaps](design-gaps-2026-10-04.md) found what the app does not do. This page gives the sequence of the work that closes the gaps.

## Why the sequence is important

The owner set the sequence: Pantry, then Cook mode, then Meal plan, then the rest.

The sequence also agrees with the data. The meal plan must know which food spoils first and which food is low. The Pantry stage adds these two facts. So the stage that needs them comes after the stage that makes them.

## The stages

| Stage | Area                              | What it adds                                                          |
| ----- | --------------------------------- | --------------------------------------------------------------------- |
| 1     | [Pantry](pantry-gaps.md)          | The low line, the use-by date, the three views, the link to Shop      |
| 2     | [Cook mode](cook-gaps.md)         | The "Done?" card, the large timer, the dark surround                  |
| 3     | [Meal plan](meal-plan-gaps.md)    | The flow of four steps, with a night for each meal as a proposal      |
| 4     | [Shop and put away](shop-gaps.md) | The reason on each row, "Use within", the end of a trip               |
| 5     | Today                             | The line "Chicken is frozen", with "Order in" and "Thaw for tomorrow" |

## How one step works

Each area page has a list of steps. A step is small: one part of one screen, which the owner can use on the phone.

A step includes its motion. When a step changes what the screen shows, such as a new sequence of the rows, the change is a small animation and not a hard cut.

1. The step is built.
2. The owner uses it on the phone.
3. The owner tells what is wrong, and the step changes.
4. The next step starts.

The app is a prototype, so its data has no value yet. A step that changes the database changes it directly, and the data starts again from the sample data. No step keeps an old backup file readable.

## What the plan does not do

- It removes nothing that the app has and the design does not show: Scan, Pantry check, the search, the trips.
- It adds no reminder that the phone sends. A reminder in the design is a line on a screen.
- It adds no package.

## The state on 5 October 2026

Each step of each area is built. The type check and the lint pass. The owner did not approve a step on the phone yet, and no step was seen in a browser: the checks were of the code and of the rules only.

| Area              | What is built                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| Pantry            | The low line, the counts, the three views, "Add to Shop", the use-by badge, the item detail, the side column |
| Cook mode         | "Done?", the large step number and clock, the note band, the dark surround, "Get out", the two halves        |
| Meal plan         | The four steps, a night for each meal, the three filters, the minutes, "Set the menu", the prep line         |
| Shop and put away | The reason on a row, the segments, "All in the cart", "Use within", "Not bought", "Pantry fills", the end    |
| Today             | The line of a meal that is not prepared, with "Order in" and "Thaw for tomorrow"                             |

The data changed, so the device must load the sample data again.

Some parts of the design are open, because no step asked for them:

- The number of people in "Which nights?".
- The long press that opens a pantry row in ink.
- The nights that are off as rows of "Your week". The screen tells them in one sentence.

Four rules are assumptions, and the owner must confirm them:

- A place of the plan is for a meal of each type. A breakfast on the menu also gets a night.
- A meal is "quick" when it takes 30 minutes or less.
- The usual days of a food come from its category: 2 for meat and fish, 5 for bakery, 7 for produce, 10 for dairy.
- "Order in" moves each meal of tonight or later by one night.

## How to know that the work is done

- Each row in each area page is built and the owner approved it on the phone.
- A new comparison with `docs/inspiration/` finds no missing part.

## Further reading

- [Roadmap](../roadmap.md): the first plan of the project, from before the design.
