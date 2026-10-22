---
title: A tidy Put away
summary: "Put away keeps its form in the list and its receipt, with one chevron for each part that opens, plain buttons with a mark, and a count that runs up."
parent: shop-stories.md
updated: 2026-10-21
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / A tidy Put away

# A tidy Put away

As the [keeper](../../personas.md), I want Put away to use the same pieces as the other parts, so that I know each control at once when I come home with the food.

## Requirements

1. Put away keeps its receipt: the paper with sharp corners, the dashed rule, and the line of the trip
2. Each part that opens has the same chevron, 20 px, that turns half a turn when it opens
   - a. The group "Known"
   - b. Each line, in the place of the mark "›"
3. The open line has the pill "Put away", and its second actions are plain buttons with no edge and a mark
   - a. "✕ Not bought"
   - b. "+ Package"
4. The count of "Known" runs up or down to its new number, with no jump
5. The chip "Sale" stays on the closed line
6. A line that opens or closes, and a line that goes, moves only its position or its opacity
7. With less motion, each change shows at once

## Acceptance criteria

Each criterion starts with the cart of the test vault, on the stage Put away.

1. GIVEN Put away WHEN the keeper looks at the group "Known" THEN its head has the chevron, pointing down
2. GIVEN Put away WHEN the keeper taps the line of Celery THEN its chevron turns, and the form opens below it
   - a. AND the form has the pill "Put away", and the plain buttons "✕ Not bought" and "+ Package"
3. GIVEN the group "Known" has 2 lines or more WHEN the keeper opens it, and taps "Put away" on one line THEN its count runs down by 1, with no jump
4. GIVEN Put away WHEN the keeper looks at the closed line of Celery THEN it has the chip "Sale"

## Depends on

Nothing.

## Architecture

- [Put away](../../architecture/put-away.md): the lines, the groups, and the receipt.
- [Decision log: Shop and Put away](../../initiatives/shop-and-put-away/decision-log.md): decisions 1 to 4, 6, 11, and 12.
