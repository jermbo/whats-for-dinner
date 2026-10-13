---
title: Put away
summary: "How one action puts a shopping trip into the pantry: which place gets the food, which amount, and when a row gets larger."
parent: shopping.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / Put away

# Put away

After the store, you have bags on the counter and no time. If the pantry needs one entry for each item, you do not make them, and the pantry is wrong the next day. This page tells how one action puts the full trip into the pantry.

## The plugin already knows the answers

The usual questions for a new item are: what is it, how much, and where does it go? The shopping list has the first two. The pantry has the third. So "Put into the pantry" asks nothing.

## Three decisions for each item of the cart

| Question  | The answer of the plugin                                                                        |
| --------- | ----------------------------------------------------------------------------------------------- |
| What?     | The note of the link of the item. If the note is not there, the plugin makes it.                |
| How much? | The amount of the list row. An item with no amount goes in as 1.                                |
| Where?    | The place where the food item is now. If it has no row, the place for new food of the settings. |

The plugin assumes that you bought what the list said. If you bought a different amount, correct the row with its [bar](amount-bar.md).

## One row for one place

The amount goes into the row that the place has already. Flour has 200 g in the kitchen pantry, and you bought 800 g. The row becomes 1000 g. It does not become two rows.

There is one exception. If the row has a use-by date, the new food gets its own row, because a new bag has a different date. You can give the new row its date in the pantry.

The row keeps its unit. The [amounts](amounts.md) page tells what occurs when the sum is not round in that unit.

## An item that is not in the pantry

The cart can have an item that is not food of the pantry, such as batteries that you typed into the [shopping note](shopping-note.md). Its task has no link to a note of the pantry folder. The pantry does not change. Its row of the [receipt](receipt.md) has no amount and no place.

## What changes after the action

- The [level](level.md) of each food item goes up. If you have more than the full amount, the plugin writes the new full amount.
- Each food item that got food has the day of put away as its purchase date.
- The cart is empty: the shopping note becomes the receipt of the trip.
- The list has only the items that you did not put in the cart.
- A [suggestion](suggestions.md) that you skipped shows again, if its staple still needs a look.

## An item that you did not find

An item that is not in the cart stays on the list. The pantry still does not have it, so the list still asks for it. A choice that you did not buy goes into the note of the next trip.

## Further reading

- [Staples](staples.md): why the list can have food that no meal needs.
- [Food item note](food-item-note.md): the note that a new food item gets.
