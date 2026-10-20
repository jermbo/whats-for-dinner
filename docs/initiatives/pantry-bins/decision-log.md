---
title: "Decision log: pantry bins"
summary: "The layout of the Pantry part on a wide tab: each place is a bin, the bins flow in columns, and the top of each part stays in view."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: pantry bins

# Decision log: pantry bins

On a phone, the Pantry part is good. On a computer, it had much empty space, and the places were not clear. This page records the decisions of a prototype with the real pantry of the test vault, and the reason for each.

## What the owner said

> "I think we need to work on the layout a bit for the pantry. This tool can be used on phone or desktop. So it needs to look good in both. I think phone is ok. This is on desktop about 1000px wide. The problem is we have a lot of negative space. In addition to that, I think it needs to be clearer the sections. Maybe though title changes or something. It needs to be tasteful and elegant."

> "I like bins the most. One thing I think would elevate this would be having a sticky header. As I scroll, the main nav moves as well as the search and stuff."

> "One thing I want to make sure happens is the other pages get the scroll treatment as well."

## The cause of the empty space

The groups were in a grid. A row of a grid is as high as its highest cell, so "Freezer", with 4 lines, had the height of "Fridge", with 14 lines, next to it.

## The options of the prototype

| Option       | Layout                                                                     |
| ------------ | -------------------------------------------------------------------------- |
| Today        | A grid of groups, with a thin rule under each title.                       |
| A: shelf     | Columns, and a thick rule above each title, as the edge of a shelf.        |
| B: bins      | Columns, and each place is a card.                                         |
| B+: bins, further | B, with the state of each bin in its head, tags for "Out", and a top that stays. |
| C: ledger    | Columns, and each line on one row: name, amount, bar.                      |
| D: rail      | Columns, next to an index of the places that stays in view.                |

## Decisions

1. **Each place is a bin: a card with the lines of that place.** The reason: a card shows where a place starts and stops with no rule and no large title. Options A, C, and D were rejected. A and D keep the groups as text on the paper, and C makes the lines small for a finger.
2. **The bins flow in columns.** A bin stays in one column, and the next bin starts under it. The number of columns comes from the width of the part, so a phone has one column. The reason: no bin waits for the bin next to it, so no space is empty. The bins read from the top down in each column.
3. **The head of a bin tells its state.** The title, the number of lines, and a sticker for each kind of attention: "1 past" in tomato, "2 soon" in outline, "2 low" in amber. The reason: you see which bin needs you before you read its lines. In the sequence "Low first", the low sticker does not show, because each line there is low.
4. **Food that is out is a dashed tag with its name.** The bin "Out" has a dashed edge and no card. The reason: food that is out has no amount and no bar, so a full line shows only "None". A tap on a tag opens its card, as a tap on a line does.
5. **In a bin, the rules between lines are soft, and a line answers a touch.** The card holds the group, so a thin rule in ink is noise. A line gets a soft tint under a pointer, and becomes a little smaller while you press it. An open card sits on the paper colour, so that it stands out of the bin.
6. **The bins come in one after the other.** Each bin moves up into place, 60 ms after the bin before it. With reduced motion, the bins show at once.
7. **The top of each part stays in view.** The nav of the kitchen, the head of the part, and its bar stay at the top while the list scrolls. In the Shop part, the strip of the stages stays with the head. The reason: you find, filter, and go to a different part from any point of a long list. When the top is stuck, the title of the part is smaller, so that more lines show.
8. **The amount of a line ends at the right edge.** A line with no sticker had its amount 12 px in from the edge, so the edge of the amounts was not straight.

## Further reading

- [Pantry](../../architecture/pantry.md): the bins and their lines.
- [Decision log: one bar for each part](../one-bar-for-each-part/decision-log.md): the bar that stays at the top.
