---
title: Field and panel
summary: "Two new pieces, a field and a panel, so each form and each card surface has the same edge, padding, and text."
parent: look-stories.md
updated: 2026-10-20
persona: Keeper
depends-on: [look-one-type-scale.md, look-space-lines-corners-and-controls.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Look stories](look-stories.md) / Field and panel

# Field and panel

As the [keeper](../../personas.md), I want each field and each card to look the same in each form, so that I see at once where to type and what belongs together.

## Requirements

1. The piece Field shows a text field, a date field, a text area, or a select
   - a. Its label, its edge, its padding, its height, and its text come from the tokens
   - b. It replaces the global rules for fields of the kitchen
   - c. The focus ring uses the role `focus`
   - d. Its kinds are `plain`; `new`, with a dashed edge for a value that is not an option yet, such as a new place; and `number`, in the font of the numbers, such as a price
2. The piece Panel is the surface of a card: its background, its edge, its corner, and its padding
   - a. It has the kinds of surface that the screens use today, such as a white card and an ink card
   - b. Its kinds are `surface`, `form` with an edge, `ink`, and `empty` with a dashed edge and no card. A flush panel has no padding, for a photo that reaches the edge
   - c. On the ink panel, the roles of the text, the edges, and the controls take the colour on the ink, so that a button inside needs no rule of its own
3. Each field of a form uses Field
   - a. The find field of the bar keeps its own piece, and it uses the same tokens
4. Each card surface of a screen uses Panel
5. The page "Pieces" gets Field and Panel

## Acceptance criteria

1. GIVEN the keeper opens "Add food" WHEN the keeper looks at the fields THEN each field has the same edge, height, and text as the fields of the card of rice
2. GIVEN the keeper taps a field of "Add food" WHEN the field has focus THEN it shows the ring of the role `focus`
3. GIVEN the keeper opens the Pantry and setup WHEN the keeper looks at a card in each THEN the two cards have the same corner, edge, and padding
4. GIVEN the token `--wfd-space-inset` changes WHEN the keeper opens the Pantry and the Shop THEN each card and each field has the new padding
5. GIVEN the code of a screen WHEN you search it for a style of an input, a select, or a text area THEN there is none

## Depends on

- [One type scale](look-one-type-scale.md): the text of a field.
- [Space, lines, corners, and controls](look-space-lines-corners-and-controls.md): the padding, the edge, and the height.

## Architecture

- [Pantry](../../architecture/pantry.md): the form "Add food" and the card of a food item.
- [Setup](../../architecture/setup.md): the forms of setup.
- [Pieces](../../architecture/pieces.md): Field and Panel.
