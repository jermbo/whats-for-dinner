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

You open a line to set what is left, so a line always has a bar. When no package is open, the first sealed package shows as a bar, full, and its count is 1 less. A tap on a count opens one more package in the same way. With no change, the package stays sealed. So the milk with one sealed jug opens as one bar of 3.79 l, and the beans with seven sealed cans open as their open can and two counts.

## The bar is as long as the package

The end of a bar is the size of its package, and not the full amount of the food item. So the half jug of milk shows half of a gallon. The amount is not less than 0 and not more than the size.

The amount snaps to a step. A thumb on a phone can hit about 40 stops on a bar, so a step is a round amount of about 1/40 of the package. Round, because "1.2 l" is easy to read and "1.42 l" is not.

| Package               | Step                                                                    | Example                                |
| --------------------- | ----------------------------------------------------------------------- | -------------------------------------- |
| g or ml               | The smallest of 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, … that is 1/40 of the size or more. | 3.79 l moves by 100 ml. 1 l by 25 ml. 425 g by 20 g. |
| oz, lb, or fl oz      | The same list in that unit, with 0.1, 0.2, 0.25, and 0.5 too.           | 15 oz moves by 0.5 oz.                 |
| gal, qt, pt, or cup   | 1/8 of one unit, because you read these in fractions.                   | 2 gal moves by 1/8 gal.                |
| A count               | 1.                                                                      | 3 eggs is possible.                    |

The amount goes to the nearest step, and the middle of two steps goes up. The size is always a stop, so a jug of 3.79 l can be full again. A metric amount shows as the label shows it: less than 1000 in g or ml, and more in kg or l. So a bottle of 1 l at a quarter shows "250 ml", and the row gets `250 ml`. Other units show in the unit of the package, with eighths as fractions.

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
