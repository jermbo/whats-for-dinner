---
title: Put away
summary: "How the stage Put away puts a shopping trip into the pantry: lines that the plugin fills in, groups by place, corrections with one tap, the group of known items, the receipt that keeps the work, and the end of the trip."
parent: shopping.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / Put away

# Put away

After the store, you have bags on the counter and no time. If the pantry needs one entry for each item, you do not make them, and the pantry is wrong the next day. This page tells how one stage of the Shop part puts the full trip into the pantry, and records what you paid.

## The plugin fills in, and you check

"Put away" in the stage Shop opens the stage Put away. The pantry does not change at that moment.

Each line is one package, and it already has the [facts](put-away-facts.md) of its package: the amount, the use-by date, and the price. Two gallons of milk are two lines, so each jug gets its own date. The lines of one item are next to each other, in the group of their place. So a line is text to read, not a form to fill. You check it, and you correct only what is wrong.

The lines are in one group for each place, from A to Z. You put the food away one place at a time, so you check the fridge with the fridge in front of you. The plugin guesses a place only for food with no row and no receipt. Such a line says "no place yet".

## One tap corrects a fact

A tap on a line opens it. Each fact has options: the amounts that you bought before, "3 days" to "1 month" for the use-by date, and the places of the pantry. A field takes a value that no option has.

A line opens with the same chevron as the group "Known", and the chevron turns when it opens. The open line stays in its group while you correct it, so it does not move under your thumb. When it closes, it goes into the group of its place.

The open line has "+ package". It adds a line with the amount, the place, the date, and the price of the open line, for a package that the plugin did not expect. The new line slides in below the open line. A correction of one line does not change the other lines of the item.

"✕ Not bought" takes one line out, for a wrong tap in the store. The task stays in the cart while the item has a line. "Not bought" on the last line of an item takes the item out of the cart. The stage also has the store of the trip: the store that you selected in the stage Shop. A change here changes the open note, and the [receipt](receipt.md) gets the store when it is complete.

## The brand is one tap

The open line of a food item shows its [brands](brands.md), as the row of the stage Shop does. One brand is selected, with a ring in the accent colour: the brand that you took in the store, or the brand of the last receipt, or the only brand. You have the package in your hand, so you check it. One tap selects a different brand, and a tap on the selected brand takes the selection off. The closed line shows the selected brand small, before the name.

A new package gets its photo here: the camera tile after the brands makes a new brand with no name, and selects it. The brand never stops "Put away". A line with no brand goes into the pantry as today, and the row of the pantry gets no brand.

## A sale is one tap

A sale ends, so the plugin never proposes a sale price. Each line has the chip "Sale". A tap opens the line with the cursor in the price, and the field shows the regular price as a hint.

Eggs usually cost 3.99. Today they are 3.49. You tap "Sale" and type 3.49.

## You see only what needs a look

The plugin knows an item when its last receipt has an amount, a place, and a price. Such items are in one closed group "Known", above the groups by place. Each other item is a line in the group of its place. So the lines that you see are the items that need you.

The group "Known" is closed, but it is not hidden. Its head has the number of its items, and a tap opens it. There you can tap "Sale" on an item, or correct it. A known item stays in the group while you correct it.

## Two actions put food away, and you take each one

You check the food against the paper receipt, one package at a time. The open line has "Put away", next to "Not bought". It puts only that package into the pantry, and the line slides off the screen.

"Put away 9 known", at the lower edge, puts each line of the known items into the pantry. The number counts the lines. With no known item, the button does not show. The plugin never puts food away with no tap from you.

No empty fact stops the two actions. The pantry must be correct first, and a price can come later. So the stage only tells how many prices are missing, and the total of the prices that it has. With an empty cart, the stage says "The cart is empty."

## The receipt keeps the work

When the stage opens with a cart, the [receipt](receipt.md) starts as a note in the shopping folder, with `status: active`. Each line has a row with the facts that the plugin proposes. Each correction goes into its row, and a line that is in the pantry has "yes" in the column "Done". The stage reads the facts from that note. So a restart of Obsidian, or your phone after Obsidian Sync, shows the work where you stopped.

## The trip ends with its last item

The trip ends when the last line goes off the screen: with "Put away", with "Put away 9 known", or with "Not bought" on the last line after an item went into the pantry. Then the receipt has `status: complete`. If you take each item out of the cart with "Not bought", nothing went into the pantry, and the trip stays open.

## An item that is not in the pantry

Batteries are not food, so their line has only the price and "Sale", in the last group. The pantry does not change. For quinoa that you buy for the first time, you open its line and put "Into the pantry" on. "Put away" then makes the [food item note](food-item-note.md).

## What changes when food goes into the pantry

- Each food item gets a new package for each line, full. Food that was [low](level.md) is not low any more.
- Each food item that got food has the day of its put away as its purchase date.
- At the end of the trip, the receipt is complete, and the note "Next trip" keeps only the extras that you did not buy.
- A [suggestion](suggestions.md) that you skipped shows again, if its food item still needs a look.

## Further reading

- [Staples](staples.md): why the list can have food that no meal needs.
