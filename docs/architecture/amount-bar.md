---
title: Amount bar
summary: "How you correct a package with one drag or one tap: the open line, the count of the sealed packages, the bar of each open package, and the steps that a bar snaps to."
parent: pantry.md
---

[Wiki](../README.md) / [Pantry](pantry.md) / Amount bar

# Amount bar

The pantry is only useful when it is correct. If a correction needs the keyboard, you do not make it. This page tells how the open line lets you set what is left in a package with one drag, and add or use up a package with one tap.

## You look at the jug, not at a number

You stand at the fridge with the milk in your hand. You do not know that it has 0.25 gal. You see that it is a quarter full. So the bar asks what you see: you drag it to a quarter.

## The open line

A tap on a line of the Pantry part opens it, if the plugin can count its amount. A line with no number, such as "a full bag", opens as a form. The open line shows the packages of the food item in that place, in the sequence of their dates. A package with no date is last, and an [empty row](food-item-note.md#the-empty-row) does not show.

| Package | What shows                                                                    |
| ------- | ----------------------------------------------------------------------------- |
| Sealed  | One count for each date, with "−" and "+": "5 sealed · 2027-03-01".           |
| Open    | One bar with its date, and "Used up".                                         |
| Loose   | One bar for the row of the place.                                             |

A tap on a count opens one package of it: a bar shows, full, and the count is 1 less. With no change, the package stays sealed.

## The bar is as long as the package

The end of a bar is the size of its package, and not the full amount of the food item. So the half jug of milk shows half of a gallon. The amount is not less than 0 and not more than the size.

The amount snaps to a step. For a measure, a step is 1/8 of the size: 1/8 gal for a gallon, so each quarter is a stop. For a count, a step is 1: 3 eggs is possible. The amount goes to the nearest step, and the middle of two steps goes up. It shows in the unit of the package, with eighths as fractions.

When all rows of the food item together are at or below the low line of its [level](level.md), each bar is amber. The arrow keys move the bar that has the focus by one step.

## The buttons

| Button                      | What it does                                                                 |
| --------------------------- | ---------------------------------------------------------------------------- |
| "Done"                      | Writes each package that you dragged. With no change, it writes nothing.     |
| "Used up"                   | Sets an open package to 0, and the bar slides out.                           |
| "−" and "+"                 | "−" makes one package of the count an empty row. "+" adds one sealed package with the size and the date of the count. |
| "Add package"               | Adds one sealed package with the size of the last package, with no date.     |
| "Place, date, and low line" | Opens the form of one package, for its place, date, and size.                |

A package at its size is sealed, and a package at 0 is an empty row. "−", "+", "Add package", and "Used up" write the note at once, together with each bar that you dragged.

## Further reading

- [Food item note](food-item-note.md): the table that the buttons write.
- [Amounts](amounts.md): the unit that a package keeps after a change.
