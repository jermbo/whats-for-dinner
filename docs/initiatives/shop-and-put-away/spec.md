---
title: "Spec: Shop and Put away"
summary: "The scope of Shop and Put away: the list in bins, a tick that flies the name to the cart, the shelf and the cart at the top, the dark cart view, the undo in two places, and a tidy Put away."
parent: decision-log.md
updated: 2026-10-21
status: agreed
---

[Wiki](../../README.md) / [Decision log: Shop and Put away](decision-log.md) / Spec: Shop and Put away

# Spec: Shop and Put away

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there. The words are in the [glossary](glossary.md).

## The problem

The shopper ticks the list in the store. The rows are flat lines on the page, a tick grows a small box and slides the row away, and "Undo" is an underlined link. At home, each line of Put away opens with a different arrow and three kinds of button. The two stages look like a different app from the Pantry, the Recipes, and the Plan.

## The solution

The Shop list is in bins, as the Pantry. A tick acts at once: the check fills, the name is struck, the name flies to the cart at the top right, and the row leaves. A tap on the cart opens the dark cart view with a circle. A tap on a row there flies its name back to the shelf. An example: the shopper taps "Eggs". The check fills, "Eggs" flies to the cart, the cart count goes to 7, and the bar "✓ Eggs ↶ Undo" is under the thumb for 4 seconds.

## In scope

1. The list is in bins, in columns: one bin for "A to Z", one bin for each meal (decision 7)
2. A tick acts at once (decisions 5 and 9)
   - a. The check fills from its middle and draws its mark, and a line strikes the name from the left
   - b. The name of the item flies to the cart button, and the cart button gives a small squeeze when it lands
   - c. The row fades in its place, then the rows below glide up
   - d. A second tap on the row while it fades takes the tick off, and the name flies back to its check
   - e. On a phone that can, a short buzz
   - f. No ink across the row, and no press circle on the row
3. The shelf and the cart are two buttons at the top, under the stages (decision 10)
   - a. The shelf, at the left, has the count of the items to get. The cart, at the right, has its count
   - b. The button of the view that is open is ink
4. The cart view (decision 10)
   - a. A tap on the cart grows a dark circle from it, and the cart view fills the stage
   - b. Each item of the cart is a row with a check, its name, its amount, and its price, and the total
   - c. A tap on a row flies its name to the shelf, and the row fades and leaves
   - d. "Put away" is the pill at the bottom of the cart view
   - e. A tap on the shelf grows paper back into the list. An item that came back shows its tick for one moment, and the tick goes
5. The undo bar (decision 8)
   - a. After each tick, "✓ Eggs ↶ Undo" is above the bottom edge for 4 seconds, as one button
   - b. A tap puts the item back on the list, and its name flies back
6. Put away keeps the form in the list (decision 11), with the receipt look (decision 12)
   - a. One chevron for "Known" and for each line (decision 1)
   - b. "Not bought" and "+ package" are plain buttons with a mark (decision 2)
   - c. The count of "Known" runs up, with no jump (decision 3)
   - d. The chip "Sale" stays on the closed line (decision 6)
7. Each row or group that comes or goes moves only its position, its scale, or its opacity (decision 4)
8. With less motion, no name flies, no circle grows, and each change shows at once

## Out of scope

1. The Shop as flat lines (decision 7)
2. Rows that wait until you stop before they leave, or that sink in their bin (decision 9)
3. The shelf and the cart at the bottom (decision 10)
4. An ink card for a line of Put away (decision 11)
5. A summary card at the end of a trip (decision 13)
6. A new look for the receipt (decision 12)
7. The stage Extras

## What changes in the system

- [Shopping](../../architecture/shopping.md): the bins, the tick, the shelf, the cart view, and the undo bar.
- [Put away](../../architecture/put-away.md): the tidy form.
- [Motion](../../architecture/motion.md): the flying name.
- [Pieces](../../architecture/pieces.md): the check of a row, and the shelf and cart buttons.
- The wiki [glossary](../../glossary.md) gets the words of this work.
- No note changes its form.

## How you test it

On the phone, with less motion off and on:

1. A tick flies the name to the cart, and the row leaves at once.
2. A fast run of ticks does not tick a wrong row.
3. "Undo" on the bar, and a tap on a row of the cart, each put the item back on the list.
4. The cart view opens from the cart, and the list comes back from the shelf.
5. A line of Put away opens with the chevron, and "Not bought" is a plain button.

An automatic test is worth it for no rule here: the work changes the screen, not the rules of the kitchen.

## Further reading

- [Shop stories](../../features/v0.9.0/shop-stories.md): the user stories of this work.
