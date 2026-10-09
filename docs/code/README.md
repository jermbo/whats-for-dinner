---
title: Code
summary: 'The full picture of how the code is put together: the layers, and the rules that keep each file small.'
parent: ../README.md
updated: 2026-10-04
---

[Wiki](../README.md) / Code

# Code

This topic tells where a line of code goes, and why. This page gives the full picture. Each rule has its own page.

## The problem

One tap on "Cooked" does four things: it reads the recipe, it subtracts the food from the pantry, it writes the cook session, and it moves a card on the screen. You can write all four in one file. The app works, but the file has four reasons to change, and you must read all of it to change one.

So each line needs one clear home.

## The answer: five layers

The code has five [layers](layers.md). A layer uses only the layers below it.

1. A **screen** gathers the data and connects the taps to the actions.
2. A **component** shows the data that it gets.
3. A **state module** keeps data live while a screen is open.
4. The **domain** has the rules of the kitchen, as functions with no side effect.
5. The **data layer** reads and writes the database.

## The rules that keep a file small

- [A screen gathers, and a component shows](screens-and-components.md). So you always know which file starts a query.
- [One file has one job](one-file-one-job.md). The number of lines is not the test. The number of jobs is.
- [Repeat first, share later](repeat-or-share.md). Shared code must earn its place.
- [All screens use one kitchen](one-kitchen.md). The pantry and the recipes are read one time.
- [A style value has one name](style-values.md). A colour or a text size comes from a token.

## An example

"Cooked" in this structure: the Today screen calls `cook()` from the data layer. That function subtracts the food from the pantry and writes the cook session, in one transaction. The state module sees the change and gives the new menu to the screen. The component of the hand gets a shorter list, and moves the cards.

## Further reading

- [Code audit of 4 October 2026](audit-2026-10-04.md): how far the code was from these rules, with a grade.
- [Cleanup plan](cleanup-plan.md): the sequence of the work that closes the gap.
- [Glossary](glossary.md): the meaning of each word.
