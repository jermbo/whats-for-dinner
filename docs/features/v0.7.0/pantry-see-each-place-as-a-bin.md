---
title: See each place as a bin
summary: "Each group of the Pantry part is a card with its state in its head, the cards flow in columns, and food that is out is a dashed tag."
parent: kitchen-stories.md
updated: 2026-10-19
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Kitchen stories](kitchen-stories.md) / See each place as a bin

# See each place as a bin

As the [keeper](../../personas.md), I want each place of the pantry as one bin that fills the width, so that I see where each place starts and which place needs me.

## Requirements

1. Each group of the Pantry part is a bin: a card with its head and its lines (decision 1)
   - a. This is true in each sequence: "By place", "Low first", "Use first", and "A to Z"
2. The bins flow in columns of 20rem or more. A bin stays in one column (decision 2)
   - a. A phone has one column
3. The head of a bin has the title, the number of lines, and a sticker for each kind of attention (decision 3)
   - a. "1 past" in tomato for lines past their date
   - b. "2 soon" in outline for lines with a date in the soon days, and not past
   - c. "2 low" in amber for lines that are low. It does not show in "Low first"
4. The bin "Out" has a dashed edge and no card. Each food item in it is a dashed tag with its name (decision 4)
   - a. A tap on a tag opens the card of the food item
5. In a bin, the rule between two lines is soft, and the last line has no rule (decision 5)
   - a. A line has a soft tint under a pointer, and is smaller while you press it
   - b. An open card is on the paper colour
6. Each bin moves up into place, 60 ms after the bin before it. With reduced motion, the bins show at once (decision 6)
7. The amount of each line ends at the right edge of the line (decision 8)

## Acceptance criteria

Each criterion starts with the pantry of the test vault, on 2026-10-19.

1. GIVEN the Pantry part "By place" in a tab of 1000 px WHEN the keeper looks at it THEN there are two columns, and "Freezer" starts under "Fridge" with no empty space
2. GIVEN the Pantry part "By place" WHEN the keeper looks at the bin "Fridge" THEN its head shows "Fridge", "14", "1 past", "4 soon", and "2 low"
3. GIVEN the bin "Out" WHEN the keeper taps the tag "Heavy cream" THEN the card of heavy cream opens under the tags
4. GIVEN the sequence "Low first" WHEN the keeper looks at the bin heads THEN no head has a low sticker
5. GIVEN the bin "Fridge" WHEN the keeper looks at the amounts of Spinach and Carrots THEN the two amounts end at the same edge
6. GIVEN the Pantry part on a phone WHEN the keeper looks at it THEN the bins are in one column

## Depends on

Nothing.

## Architecture

- [Pantry](../../architecture/pantry.md): the bins and their lines.
- [Decision log: pantry bins](../../initiatives/pantry-bins/decision-log.md): decisions 1 to 6, and 8.
