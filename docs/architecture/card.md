---
title: Card
summary: "How you correct a food item with one drag: the card of a line, its bar with one part for each package, the olive handle that snaps to a stop, and what Done writes."
parent: pantry.md
---

[Wiki](../README.md) / [Pantry](pantry.md) / Card

# Card

The pantry is useful only when it is correct. If a correction needs the keyboard, you do not make it. This page tells how the card of a food item lets you set each package with your thumb, and add one with a tap.

## You look at the jug, not at a number

You stand at the fridge with the milk in your hand. You do not know that it has 0.95 l. You see that it is a quarter full. So the card asks what you see: you drag the jug to a quarter.

## A tap on a line opens its card

The card opens as an [open card](open-card.md): its ink spreads from your tap, and it moves to the top of the screen. Its bar is ready at once. The card has the name, the place, the count of packages here and of places, and a large total of all places: "Milk · Fridge · 2 here · 1 1/4 gal". Below is one bar of 44 pixels, with one part for each package, as the line has it: the packages of this place first and dark, other places grey, and amber when the food item is [low](level.md). A thin line of the card is between two parts.

The sequence of the parts stays while the card is open. A can of beans that you drag to full is not open any more, but it does not move behind the other cans under your thumb.

## The handle snaps to a stop

A press on the bar puts the olive handle on the package under your thumb, and sets it to the stop under your thumb. A drag to the side moves only that package, and a drag up or down still scrolls the list. On a phone, a swipe to the side opens a side panel of Obsidian. The bar keeps each drag that starts on it, so Obsidian does not see it as a swipe. The fill follows the thumb with no delay, and the handle grows a little while you drag.

| Package  | Stops                         | Example                      |
| -------- | ----------------------------- | ---------------------------- |
| Measured | 0, 1/4, 1/2, 3/4, full        | A jug of 1 gal at 1/2        |
| Counted  | One for each, from 0 to the size | A carton of 12 at 4      |

The handle snaps to the nearest stop. At the left end, a package is empty: its part stays on the bar until the card closes, and "Done" takes its row out of the note. Nothing is written before "Done", so a drag back or "Cancel" undoes a drag that went too far. The arrow keys move the package with the handle by one stop. Below the bar, the scale shows 0, the package with the handle, such as "1/4 of 1 gal", and the size of all packages.

## The buttons and the links

| Control                  | What it does                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| "+ Add package"          | A full package at the end of the bar, with the size of the food item, or of its newest package here. It gets the handle. |
| "Done"                   | Writes each change into the note, and closes the card. With no change, it writes nothing.         |
| "Empty"                  | Takes the package with the handle out of the card. "Done" takes its row out of the note.        |
| "Place and date"         | Opens the place chips and the date field of the package with the handle, inside the card.       |
| "Size, names, and brands" | Opens the form of the food item.                                                                |
| "Cancel"                 | Closes the card and writes nothing.                                                              |

A change in the card takes away `check: true`, because you looked at the food. A food item with no size yet cannot add a package: the card asks you to give it a size in the form.

## The form of the food item

The form has what is true of each package, not of one: the package size of the next package, as a number and a unit chip of the [unit list](amounts.md#the-units-of-a-package-size), the other names, the staple, and the [brands](brands.md). "Save" writes the size as the property `size` of the note. A package that you have keeps its own size.

## Further reading

- [Food item note](food-item-note.md): the rows that "Done" writes.
- [Audit](audit.md): the card in the weekly walk.
