---
title: Put away the known items with one button
summary: "The keeper sees only the items that the plugin cannot know as lines, and puts the known items away with one tap."
parent: shop-stories.md
updated: 2026-10-17
persona: Keeper
depends-on: [shop-put-away-one-item.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Put away the known items with one button

# Put away the known items with one button

As the [keeper](../../personas.md), I want the items that the plugin knows in one closed group with one button, so that I look only at the items that need me.

## Requirements

1. An item is known when its last receipt has an amount, a place, and a price
2. The known items are in one closed group "Known", above the groups by place
   - a. The head of the group says "Known" and the number of its items
   - b. A tap on the head opens the group, and a second tap closes it
   - c. The open group has a line for each known item, from A to Z, as each other line
   - d. A known item that you correct stays in the group
3. Each other item is a line in the groups by place, as before
4. "Put away 9 known" at the lower edge puts each known item into the pantry
   - a. The button has the number of the known items
   - b. With no known item, the button does not show
   - c. The plugin puts no food away with no tap
5. When no other line is left, the button ends the trip

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-17. The cart has eggs, milk, and quinoa. The receipts have eggs and milk, each with an amount, a place, and a price. Quinoa has no receipt.

1. GIVEN the stage Put away opens WHEN the keeper looks at it THEN the group "Known" is closed, with "2"
   - a. AND the group "Kitchen" has quinoa, with "no place yet"
   - b. AND the button says "Put away 2 known"
2. GIVEN the group "Known" is closed WHEN the keeper taps its head THEN the group shows eggs and milk
3. GIVEN the group "Known" is open WHEN the keeper taps "Sale" on eggs THEN the line of eggs opens in the group "Known"
4. GIVEN the stage shows quinoa WHEN the keeper taps "Put away 2 known" THEN the notes `Eggs` and `Milk` have the new food
   - a. AND the screen shows only quinoa
   - b. AND the button does not show
5. GIVEN each item of the cart is known WHEN the keeper taps "Put away 3 known" THEN the receipt has `status: complete`
6. GIVEN the stage Put away opens WHEN the keeper does nothing THEN the pantry does not change

## Depends on

- [Put away one item at a time](shop-put-away-one-item.md): the line with "Put away", and the end of the trip with the last line.

## Architecture

- [Put away](../../architecture/put-away.md): the group "Known", and the two actions.
- [Facts of an item](../../architecture/put-away-facts.md): where each fact comes from.
