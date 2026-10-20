---
title: List line
summary: "A new piece for a line of a list, with its name, a small line, and one number, so an item looks the same in each list."
parent: look-stories.md
updated: 2026-10-20
persona: Shopper
depends-on: [look-one-type-scale.md, look-space-lines-corners-and-controls.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Look stories](look-stories.md) / List line

# List line

As the [shopper](../../personas.md), I want an item to have the same form in each list, so that I find its name and its number at the same place in each part.

## Requirements

1. The piece List line shows the name of an item, a small line below it, and one number
   - a. The name uses `--wfd-font-size-name`, the small line `--wfd-font-size-small`, and the number `--wfd-font-size-title`
   - b. A list line can have a mark before the name and a control after the number
   - c. A long name wraps, and the number keeps its place
2. The lines of these lists use List line
   - a. The Pantry
   - b. The rows of the stage Shop, and the cart
   - c. The lines of put away
   - d. The suggestions
3. What a line shows and what a tap does do not change
4. The page "Pieces" gets List line

## Acceptance criteria

1. GIVEN onions are on the list WHEN the shopper opens the Shop THEN the line of onions has its name, its small line, and its number at the same places as the line of rice in the Pantry
2. GIVEN the shopper opens the Shop WHEN the shopper taps the line of onions THEN it ticks as today
3. GIVEN the keeper opens put away after a trip with onions WHEN the keeper looks at the line of onions THEN it has the form of a line of the Pantry
4. GIVEN a food item with a name of 40 letters WHEN the shopper opens the Shop with it on the list THEN its name wraps and its number stays at the end of the line
5. GIVEN the code of the Pantry, the Shop, put away, and the suggestions WHEN you search it for a style of a name or a number of a line THEN there is none

## Depends on

- [One type scale](look-one-type-scale.md): the sizes of the name and the number.
- [Space, lines, corners, and controls](look-space-lines-corners-and-controls.md): the space of a line.

## Architecture

- [Pantry](../../architecture/pantry.md): the line of a food item in a place.
- [Shopping](../../architecture/shopping.md): the rows of the stage Shop and the cart.
- [Put away](../../architecture/put-away.md): the lines of put away.
- [Pieces](../../architecture/pieces.md): List line.
