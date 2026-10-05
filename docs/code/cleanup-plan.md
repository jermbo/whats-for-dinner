---
title: Cleanup plan
summary: 'The sequence of the work that brings the code to the rules of this topic: seven steps, each one small and safe to stop after.'
parent: README.md
updated: 2026-10-05
---

[Wiki](../README.md) / [Code](README.md) / Cleanup plan

# Cleanup plan

The [audit](audit-2026-10-04.md) found the gap between the code and [the rules](README.md). This page gives the sequence of the work that closes it.

## Why the sequence is important

A cleanup that moves files and changes logic in one step cannot be checked: a bug hides in the noise of the moves. So each step does one kind of change. The steps that change nothing for the owner come first, and they make the later steps small.

After each step, `npm run check` and `npm run lint` pass, the owner uses the app on the phone, and the step is one commit.

## The seven steps

| Step | The work                                                                                                                                                   | What the owner sees     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 1    | **Housekeeping.** Remove the dead function, the needless exports, and the files of a different tool. Write a real README.                                  | Nothing                 |
| 2    | **One token vocabulary.** Replace the 16 old token names at 50 places. Move the motion curves and the raw colours into `tokens.css`.                       | Nothing                 |
| 3    | **Folders and layers.** Move files only: `lib/state`, `lib/domain`, and a component folder for each screen. Add the lint rule for [the layers](layers.md). | Nothing                 |
| 4    | **[One kitchen](one-kitchen.md).** The layout provides it. Add `useShopping()`, `useSoon()`, and one clock. Remove the `kitchen` property.                 | Nothing                 |
| 5    | **[Screens gather](screens-and-components.md).** Move the queries out of the components and the rules out of the screens.                                  | Nothing                 |
| 6    | **[The large files](one-file-one-job.md).** One file for each commit: `MealHand`, `StepFields`, `CookMode`, `PutAwayCard`, `MealSheet`.                    | Nothing, if it is right |
| 7    | **[A scale for text](style-values.md).** Bring 30 text sizes to about 8. Move the styles that three components share.                                      | Small changes of size   |

Step 7 is last because it is the only step that changes the look. The owner must approve the scale first.

## What the plan does not do

- It adds no package. The lint rule for the layers is a part of ESLint.
- It changes no table of the database and no format of a file.
- It does not join two blocks only because they look the same. See [repeat or share](repeat-or-share.md).

## A decision for the owner: tests

The app has no tests, by agreement. After step 3, `lib/domain` has only pure functions. Node has a test tool of its own, so tests for those functions need no package. This is the cheapest place to start. It is not a step of this plan until the owner says so.

## The state on 5 October 2026

Steps 1 to 5 are complete. Step 6 is complete for `MealHand`, `MealSheet`, `CookMode`, and `PutAwayCard`. These parts are open:

- `StepFields` has 400 lines of styles. To divide them into a row component needs a check in the browser.
- Step 7, the scale for text, waits for the owner.

No step had a check in a browser. The type check, the lint, and the build pass after each step.

## How to know that the work is done

- `npm run lint` fails when a component imports the database.
- No Svelte file fails [the test of one job](one-file-one-job.md).
- `tokens.css` has no token with the word "old" in its comment.
- A new audit gives each area a B plus or better.

## Further reading

- [Glossary](glossary.md): the words of the plan, such as "state module" and "domain".
