---
title: "Decision log: pantry bins"
summary: "The layout of the Pantry part on a wide tab: each place is a bin with a head over a heavy rule, its lines fill the full width in columns, and the top of each part stays in view."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: pantry bins

# Decision log: pantry bins

On a phone, the Pantry part is good. On a computer, it had much empty space, and the places were not clear. This page records the decisions of a prototype with the real pantry of the test vault, and the reason for each.

## What the owner said

> "I think we need to work on the layout a bit for the pantry. This tool can be used on phone or desktop. So it needs to look good in both. I think phone is ok. This is on desktop about 1000px wide. The problem is we have a lot of negative space. In addition to that, I think it needs to be clearer the sections. Maybe though title changes or something. It needs to be tasteful and elegant."

> "I like bins the most. One thing I think would elevate this would be having a sticky header. As I scroll, the main nav moves as well as the search and stuff."

> "One thing I want to make sure happens is the other pages get the scroll treatment as well."

On 2026-10-21 the owner looked at the bins on a desktop of about 2000 px:

> "I like where this is going, but it needs to look good on mobile and desktop. Desktop is lacking."

> "None of these look right on desktop. There is too much white space everywhere. What can we do to keep the vibe of the pantry, I really like the look now, but make the flow way better?"

> "I like option c"

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

## The cause of the empty space, the second time

The bins flowed in columns, and a bin stayed in one column. On a wide tab, the largest bin, "Kitchen pantry" with 25 lines, filled one column alone. The other bins shared a second and a third column, and the fourth column was empty. Also, a line is as wide as its column, so most of a line was the space between the name and the amount.

## The options of the second prototype

The first four were in the plugin. The other four were pictures on one page, with the pantry of the test vault, on a desktop and on a phone.

| Option            | Layout                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------ |
| Weighted row      | A bin with more lines is wider, and its lines flow in columns inside it.                   |
| Lanes             | One lane for each place, side by side. A long lane scrolls in its own box.                 |
| Side column       | The weighted row, and a column of the food that needs you next to it.                      |
| Flow              | A bin goes on in the next column, so each column ends at the same height.                  |
| Kitchen map       | Each place is a room of a map, as large as its food. Its food is chips that fill the room. |
| Jar wall          | Each food is a tile that fills to its level. A label tile starts each place, in one grid.   |
| Shelf bands       | Each place is a band across the width, with its food as small tags.                        |
| One ledger        | The lines as they are, with no card. Each place head goes across the width.               |
| Use first         | The food to use soon and the low food as large tiles on top, the rest as small tags.       |

## Decisions

1. **Each place is a bin: its head over a heavy rule, and its lines under it, with no card.** The head is the title in the display font and the count in the faint colour, over a rule of 4 px, as the bins of the Shop list. The reason: the rule shows where a place starts across the whole width, and the Pantry and the Shop have one look. The first prototype had a card for each bin. On a wide tab, the cards left empty space between them and inside them. The shelf, the ledger, and the rail of the first prototype were rejected then, because the groups were text on the paper with no clear start. A rule of 4 px across the width gives that start.
2. **Each bin takes the full width, and its lines fill columns of 16 rem or more inside it.** The lines go from left to right, then down, as the rows of the Shop list. Each bin has the same columns, so the lines of all bins line up. The next bin starts under the last row of the bin before it. A phone has one column. The reason: no bin waits for a column, so no column is empty, and a line is short, so the name and the amount are close. The columns in a bin are 16 rem and not the 22 rem of the Shop, because a line of the Pantry has no photo. The weighted row, the lanes, the side column, the flow, and the kitchen map were rejected: each left empty space on a desktop of 2000 px. The jar wall, the shelf bands, and "use first" were rejected for the owner's choice of the ledger, which keeps the lines as they are.
3. **The head of a bin tells its state.** The title, the number of lines, and a sticker for each kind of attention: "1 past" in tomato, "2 soon" in outline, "2 low" in amber. The reason: you see which bin needs you before you read its lines. In the sequence "Low first", the low sticker does not show, because each line there is low.
4. **Food that is out is a dashed tag with its name.** The bin "Out" has a dashed rule under its head, and its tags wrap across the width. The reason: food that is out has no amount and no bar, so a full line shows only "None". A tap on a tag opens its card, as a tap on a line does.
5. **In a bin, the rules between lines are soft, and a line answers a touch.** The heavy rule of the head holds the group, so a thin rule in ink is noise. A line gets a soft tint under a pointer, and becomes a little smaller while you press it. An open card takes the full width of its bin, on the surface colour, because a column is too narrow for its bar and its buttons.
6. **The bins come in one after the other.** Each bin moves up into place, 60 ms after the bin before it. With reduced motion, the bins show at once.
7. **The top of each part stays in view.** The nav of the kitchen, the head of the part, and its bar stay at the top while the list scrolls. In the Shop part, the strip of the stages stays with the head. The reason: you find, filter, and go to a different part from any point of a long list. When the top is stuck, the title of the part is smaller, so that more lines show.
8. **The amount of a line ends at the right edge.** A line with no sticker had its amount 12 px in from the edge, so the edge of the amounts was not straight.

## Further reading

- [Pantry](../../architecture/pantry.md): the bins and their lines.
- [Decision log: one bar for each part](../one-bar-for-each-part/decision-log.md): the bar that stays at the top.
