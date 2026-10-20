---
title: Motion
summary: "The three durations and two easings of the plugin, the motion of each piece, the rule for less motion, and the transitions of Svelte that stay."
parent: look.md
updated: 2026-10-20
---

[Wiki](../README.md) / [Look](look.md) / Motion

# Motion

A chip that you tap changes to ink. A button moves down a little when you press it. Such a motion tells you that the plugin got your tap. Each change of state must feel the same in each part. This page tells the tokens of the motion.

## Three durations and two easings

| Token                 | Value  | Job                                            |
| --------------------- | ------ | ---------------------------------------------- |
| `--wfd-motion-press`  | 0.1 s  | The press of a button                          |
| `--wfd-motion-change` | 0.2 s  | A control that changes its state, such as a chip |
| `--wfd-motion-move`   | 0.3 s  | A thing that comes, goes, or moves on the screen |
| `--wfd-ease-out`      | ease-out | Fast at the start, slow at the end. The usual easing. |
| `--wfd-ease-bounce`   | a curve that goes past its end and comes back | A motion that lands |

## A piece names its own motion

Four pieces have a motion of their own. Each has a piece token with a duration and an easing, which point to the role tokens above.

| Piece token           | The motion of                     |
| --------------------- | --------------------------------- |
| `--wfd-card-motion`   | A card that opens or changes      |
| `--wfd-row-motion`    | A row that comes or goes          |
| `--wfd-chip-motion`   | A chip that changes to on or off  |
| `--wfd-button-motion` | The press of a button             |

The open card of a food item settles a little as it opens, with the card motion. An example: you want to try a bounce on the [card](card.md) of a food item. You point `--wfd-card-motion` to `--wfd-ease-bounce`. The card of rice opens with a bounce, and the chips and the buttons move as before.

## Less motion is no motion

A device can have the setting for less motion. Then the file of the tokens sets each duration to 0. Each transition and each animation of a screen uses a token, so no screen needs a rule of its own for less motion.

## The transitions of Svelte stay

Some motion is in the scripts, not in a style block: a part that slides in, a row that fades, a photo that grows. Svelte makes these smooth, and each one checks the setting for less motion itself. They do not use the tokens.

## Further reading

- [Look](look.md): the three kinds of token, and why a piece token is rare.
- [Pieces](pieces.md): the pieces that have a motion.
