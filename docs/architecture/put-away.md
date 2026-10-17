---
title: Put away
summary: "How one screen puts a shopping trip into the pantry: lines that the plugin fills in, groups by place, corrections with one tap, and the button that ends the trip."
parent: shopping.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / Put away

# Put away

After the store, you have bags on the counter and no time. If the pantry needs one entry for each item, you do not make them, and the pantry is wrong the next day. This page tells how one screen puts the full trip into the pantry, and records what you paid.

## The plugin fills in, and you check

"Put away" in the Shop part opens the screen. The pantry does not change at that moment.

Each line already has the [facts](put-away-facts.md) of its item: the amount, the use-by date, and the price. So a line is text to read, not a form to fill. You check it, and you correct only what is wrong.

The lines are in one group for each place, from A to Z. You put the food away one place at a time, so you check the fridge with the fridge in front of you. The plugin guesses a place only for food with no row and no receipt. Such a line says "no place yet".

## One tap corrects a fact

A tap on a line opens it. Each fact has options: the amounts that you bought before, "3 days" to "1 month" for the use-by date, and the places of the pantry. A field takes a value that no option has.

The open line stays in its group while you correct it, so it does not move under your thumb. When it closes, it goes into the group of its place.

"Not bought" takes an item out of the cart, for a wrong tap in the store. The screen also has the store of the trip, which the [receipt](receipt.md) gets.

## A sale is one tap

A sale ends, so the plugin never proposes a sale price. Each line has the chip "Sale". A tap opens the line with the cursor in the price, and the field shows the regular price as a hint.

Eggs usually cost 3.99. Today they are 3.49. You tap "Sale" and type 3.49.

## One button ends the trip

"Put into the pantry" puts each item of the screen away in one step. No empty fact stops the button. The pantry must be correct first, and a price can come later. So the screen only tells how many prices are missing. "Back" closes the screen with no change, and what you gave stays while the kitchen is open.

## An item that is not in the pantry

Batteries are not food, so their line has only the price and "Sale", in the last group. The pantry does not change. For quinoa that you buy for the first time, you open its line and put "Into the pantry" on. The button then makes the [food item note](food-item-note.md).

## What changes after the button

- The [level](level.md) of each food item goes up. If you have more than the full amount, the plugin writes the new full amount.
- Each food item that got food has the day of put away as its purchase date.
- The shopping note becomes the receipt of the trip, so the cart is empty.
- A choice that you did not buy goes into the note of the next trip.
- A [suggestion](suggestions.md) that you skipped shows again, if its food item still needs a look.

## Further reading

- [Staples](staples.md): why the list can have food that no meal needs.
