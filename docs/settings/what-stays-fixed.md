---
title: What stays fixed
summary: 'The things that are not a preference, and the reason for each one.'
parent: preferences.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Settings](README.md) / [Preferences](preferences.md) / What stays fixed

# What stays fixed

Some things look like a preference and are not one. This page gives each of them and its reason, so that the question has an answer before it comes again.

## The problem

Each fixed thing is a possible switch. A switch is easy to ask for and has a cost for all time: each new screen must work with each of its values. So a thing stays fixed until it passes [the test of a preference](preferences.md).

## The app learns it from the phone

| Thing                         | Why it is not a preference                                                   |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Language of dates and numbers | The phone knows how you write a date and a decimal. The app asks the phone.  |
| Text size                     | The browser has a control for the text size. The sizes in the app follow it. |

A second control for the same thing gives two answers to one question.

## It tells you nothing

| Thing           | Why it is not a preference                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Currency symbol | All prices of one kitchen are in one currency. A symbol on each price says the same thing each time. |

A receipt is narrow. The digits are the information, and they get the space.

## It is a second design

| Thing        | Why it is not a preference                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Dark colours | The look is a label on paper, with [six colours](../design/colour-and-materials.md). Dark paper is a different set of six. |

A switch between two sets of colours is not a value. It is two designs, and each part of each screen must be correct in the two.

## It changes the data

| Thing                      | Why it is not a preference                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Your own storage locations | A location has rules. Food in the freezer does not get old. A new location has no rule.              |
| Your own categories        | A recipe file from a different kitchen brings its ingredients. One list of categories fits them all. |

You can change the sequence of the categories, because that is a [planning preference](planning-preferences.md). You cannot change the list.

## An example

You want a "Cellar" for potatoes and onions. Does food in a cellar get old as in the pantry, or as in the refrigerator? The app cannot know, and the rule of the doubt needs an answer. So "Cellar" is a change of the data model, with a page of its own, and not a text field in Settings.

## Further reading

- [Settings](README.md): the things that you can change.
