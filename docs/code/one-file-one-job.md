---
title: One file, one job
summary: 'The test that tells when a file must be divided, and where each part goes.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Code](README.md) / One file, one job

# One file, one job

A file has one job, and thus one reason to change. This page gives the test, and tells where the parts go when a file fails it.

## The test is the job, not the length

Say the job of the file in one sentence. If the sentence needs "and", the file has two jobs.

A long file can pass. The grid of a QR code is 160 lines of one job. A short file can fail: 60 lines that read a table, sort the result, and draw a list have three jobs.

## The signs of a second job

- A function in a component does not use the state of the component. It is a rule or a tool, and it can live without the component.
- A block of motion code has only numbers and elements: no data of the kitchen.
- The file changes for two different reasons in one week: a new rule, and a new look.
- A mode flag such as `amending` is in each function. The file is two components in one.

## Where each part goes

| The part                                | Its home                              |
| --------------------------------------- | ------------------------------------- |
| A rule of the kitchen                   | A pure function in `lib/domain`       |
| A read or a write of the database       | `lib/data`                            |
| Data that must stay live                | A state module in `lib/state`         |
| A timeline of motion                    | `lib/motion`                          |
| A gesture                               | `lib/input`                           |
| A part of the markup with its own state | A child component, in the same folder |
| A style that three components use       | A shared block in `lib/styles`        |

The component that stays is short. It reads as a list of what happens: it gets the data, it calls the motion, it shows the children.

## An example: the hand of meal cards

The hand has three jobs. It keeps the order of the pile. It moves the cards: deal, throw, split, and drop. It shows the buttons "Back", "Next", and "Shuffle".

So the order of the pile is three pure functions in `domain/pile.js`: the top card goes to the bottom, the bottom card comes to the top, and the shuffle. The motions are functions in `motion/hand.js`: each gets the element of a card and moves it. The buttons are a child component, `HandActions`. `MealHand` connects them: a throw calls the motion, and then asks the domain for the new order.

Now a new motion changes one file, and a new rule for the shuffle changes a different file.

## Further reading

- [Repeat or share](repeat-or-share.md): a divided file must not become a shared file too early.
