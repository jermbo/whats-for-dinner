---
title: Pieces
summary: "The shared pieces of the screen, each with its kinds and when to use it, so that a thing looks the same in each part."
parent: look.md
updated: 2026-10-20
---

[Wiki](../README.md) / [Look](look.md) / Pieces

# Pieces

You use the plugin with one hand and a quick look. A button that looks different in each part makes you stop and read. So each screen builds with the same pieces, and a piece has the look. This page tells each piece and when to use it.

## A screen file has only its layout

A piece holds colour, font, line, corner, and motion. A screen holds only the place, the order, and the size of its blocks. Thus the main button of the Shop has the look of "Add food" in the Pantry, because the two are the same piece.

A screen keeps a local control only when no piece fits, such as a photo tile, a line that is a button, or the step bar of Cook Mode. A local control uses only tokens, and it is at least `--wfd-control-min` high.

## The pieces of an action

| Piece    | Kinds                                       | Use it for                                                                                                         |
| -------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Button   | `main`, `quiet`, `olive`, `danger`, `link`  | Each action. `main` is the one action of a card, `quiet` a second action, `olive` an action that completes a task, such as "Update the pantry", `danger` an action that removes a thing, and `link` an action that is not important. A link has the colour of the text around it, so it reads on ink and on the dark frame too. |
| Chip     | on, off                                     | A filter or a choice that you switch with one tap.                                                                 |
| Pick one | —                                           | A row of chips of which one is on, with a field for a value that no chip has.                                     |

## The pieces of a form and a card

| Piece      | Kinds                                  | Use it for                                                                                   |
| ---------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| Field      | `plain`, `new`, `number`               | Each text field, date field, text area, and select of a form, with its label above it. `new` has a dashed edge: a value that is not an option yet, such as a new place. `number` has the font of the numbers, such as a price. Its focus ring is `--wfd-color-focus`. |
| Find field | —                                      | The find field of the bar. It is a piece of its own, with room for its icons, and it has the look of a field. |
| Panel      | `surface`, `form`, `ink`, `empty`      | The surface of a card: its background, its edge, its corner, and its padding. `form` has an edge and holds a form. `ink` is the open card of a food item. `empty` is a dashed edge with no card, such as the place of the food that is out. A flush panel has no padding, so that a photo reaches its edge. |

On the ink panel, the roles of the text, the edges, and the controls take the colour on the ink. So a quiet button or a link inside the open card reads with no rule of its own. A white panel inside it gives the roles of the scheme back.

## The pieces of a list

| Piece     | Use it for                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| List line | One item of a list: its name, a small line below it, and one number with a small line below it, such as a price. A mark can come before the name, a tag such as a sticker after the name, and a control after the number. A long name wraps, and the number keeps its place. The Pantry, the Shop, the cart, put away, and the suggestions use it. |
| Group head | The title of a group, such as a place, with its count.                                                           |
| Sticker   | A fact in a small box: tomato for use first, amber for low, olive for done, an outline for a fact, a dashed edge for an empty place. |
| Count     | "7 of 9" as a number and a bar.                                                                                    |

## The pieces of a part

The nav, the head of a part, the top of a part, and the bar with its find field and its chips are the same in each part. The brand strip and the brand photo show the [brands](brands.md) of a food item.

## Further reading

- [Look](look.md): why a piece, and not a screen, has the look.
- [Space](space.md): the heights and the corners that each piece uses.
