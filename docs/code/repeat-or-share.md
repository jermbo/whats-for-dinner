---
title: Repeat or share
summary: 'When two blocks of code that look the same stay as two, and when they become one shared function.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Code](README.md) / Repeat or share

# Repeat or share

Code that is written two times is not a fault. Shared code has a cost, and it must earn its place.

## The cost of shared code

A shared function joins all the files that call it. A change for one caller is a risk for each other caller. Then the function gets an option for each caller, and nobody can read it.

## The two reasons to share

**One rule.** The two blocks say the same fact about the kitchen. If the fact changes, each copy must change at the same moment, and a copy that you forget is a bug. This is a reason at the second copy.

**Three copies.** The blocks have the same shape, and you wrote the shape three times. Now you know which parts are the same and which parts change.

If you have neither reason, repeat the code.

## The question to ask

"If I change this block, must I change the other one?"

- **Yes, always**: it is one rule. Share it now.
- **Possibly**: wait for the third copy.
- **No**: the blocks only look the same. Keep the two.

## An example of each

**Share.** "The cart is the purchases that are not put away." The shopping list, the number in the navigation, and the put-away screen all need this. It is one fact, so it is one function in the [domain](layers.md), and each place calls it.

**Repeat.** The card of a meal on Today and the card of a recipe in the dealer have a name, a photo, and a count. The markup looks the same. But Today changes for cooking and the dealer changes for planning. They stay two components.

**Count.** A dialog has some lines that open and close it. Two dialogs with those lines are not a reason to share. Nine dialogs are: the lines become one function. The content of each dialog stays its own.

A shared rule goes to the domain. A shared part of a screen goes to `lib/components/ui` only when it has no knowledge of the kitchen: a chip, a gauge, a dialog.

## Further reading

- [One file, one job](one-file-one-job.md): the rule that divides a file, before this rule joins two.
