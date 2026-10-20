---
title: One button for each action
summary: "Each action of each part uses the shared Button, so it looks and responds the same, and a screen file keeps only its layout."
parent: look-stories.md
updated: 2026-10-20
persona: Shopper
depends-on: [look-one-type-scale.md, look-space-lines-corners-and-controls.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Look stories](look-stories.md) / One button for each action

# One button for each action

As the [shopper](../../personas.md), I want each action to be the same button in each part, so that I know what I can tap with one hand and a quick look.

## Requirements

1. Each action of a screen uses the piece `Button`
   - a. The kinds of today stay: `main`, `quiet`, `olive`, and `link`
   - b. The builder adds a kind or a size only when an action fits none, and names it in the story
   - c. The kind `danger`: an action that removes a thing, such as "Remove" of a brand, with a tomato edge and text
2. A screen keeps a local button only when no piece fits, such as a photo tile, a line that is a button, or a step piece
   - a. A local button uses only tokens for its look
   - b. A local button has a height of `--wfd-control-min` or more
3. A screen file has only its layout: the place, the order, and the size of its blocks
   - a. Colour, font, line, corner, and motion come from the pieces and the tokens
4. The architecture gets the page "Pieces": each piece, its kinds, and when to use it

## Acceptance criteria

1. GIVEN the shopper opens the Shop WHEN the shopper looks at the main button of the stage THEN it has the look of the button "Add food" of the Pantry
2. GIVEN the cook finishes Mashed potatoes WHEN the cook looks at the button "Update the pantry" THEN it has the look of each `olive` button
3. GIVEN the token `--wfd-radius-button` changes WHEN the shopper opens each part THEN each button has the new corner
4. GIVEN the shopper opens the Shop with onions on the list WHEN the shopper taps the row of onions THEN the row ticks as today
5. GIVEN the code of a screen WHEN you search it for a button with its own colour or font THEN there is none

## Depends on

- [One type scale](look-one-type-scale.md): the font sizes of a button.
- [Space, lines, corners, and controls](look-space-lines-corners-and-controls.md): the space, the edge, and the height of a button.

## Architecture

- [Shopping](../../architecture/shopping.md): the rows and the buttons of the stages.
- [Put away](../../architecture/put-away.md): the buttons of an open line.
- [Pieces](../../architecture/pieces.md): each piece, its kinds, and when to use it. New.
