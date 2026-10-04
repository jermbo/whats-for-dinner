---
title: How a preference works
summary: 'Where the value of a preference is kept, how it gets to the rule that uses it, and which values a backup has.'
parent: preferences.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Settings](README.md) / [Preferences](preferences.md) / How a preference works

# How a preference works

A preference is a value in one place and a rule in a different place. This page tells how the value gets to the rule.

## The problem

The rule "a week has five meals" is in the domain: the [layer](../code/layers.md) of pure functions. A pure function cannot read the database. So the rule cannot ask for the preference itself. The value must come to it.

## The mechanism: four steps

1. **The code has the list.** One file names each preference: its key, its kind, and its default. `mealsInWeek`, planning, 5.
2. **A change writes one row.** When you set "Meals in a week" to 4, the database gets one row: the key and the value. A preference that you did not change has no row.
3. **A state module joins the two.** It reads the rows, fills each gap with the default, and keeps the result live. All screens read this one object, in the same way that they read [one kitchen](../code/one-kitchen.md).
4. **The screen gives the value to the rule.** The rule gets the value as an argument: `weekPlan(cooked, menu, now, mealsInWeek)`.

So the rule stays pure. You can read it, and test it, with no database: for the same four inputs, it gives the same week.

## Why the default is not in the database

If the app wrote each default as a row, a default could never change. A later version of the app can have a better default. A kitchen that did not touch the preference then gets the new value, and a kitchen that made a choice keeps its choice.

## What a backup has

| Kind                                           | In the backup | Reason                                                       |
| ---------------------------------------------- | ------------- | ------------------------------------------------------------ |
| [Planning preference](planning-preferences.md) | Yes           | It is a fact about your kitchen, as a recipe is.             |
| [Device preference](device-preferences.md)     | No            | It is a fact about one phone. A new phone is not that phone. |

A new phone that imports your backup plans four meals in a week immediately. Its timer sound is on, because that is the default of a device.

## An example

You set "Days before a doubt" to 4. The database gets the row `doubtDays: 4`. The pantry check screen reads 4 from the state module and gives it to the rule of the doubt. Spinach that you bought five days ago now gets a doubt.

## Further reading

- [Backup](../shopping/backup.md): the file that has the planning preferences.
