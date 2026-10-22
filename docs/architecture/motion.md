---
title: Motion
summary: "The three durations and the one easing of the plugin, the press of a button, the motion of each piece, the rule for less motion, and the transitions of Svelte that stay."
parent: look.md
updated: 2026-10-21
---

[Wiki](../README.md) / [Look](look.md) / Motion

# Motion

A chip that you tap changes to ink. A button drops a small circle at your finger when you press it. Such a motion tells you that the plugin got your tap. Each change of state must feel the same in each part. This page tells the tokens of the motion.

## Three durations and one easing

| Token                 | Value  | Job                                            |
| --------------------- | ------ | ---------------------------------------------- |
| `--wfd-motion-press`  | 0.1 s  | The press of a button                          |
| `--wfd-motion-change` | 0.2 s  | A control that changes its state, such as a chip |
| `--wfd-motion-move`   | 0.3 s  | A thing that comes, goes, or moves on the screen |
| `--wfd-ease-out`      | `cubic-bezier(0.22, 1, 0.36, 1)` | Fast at the start, with a long, soft end. Each motion uses it. |

A motion lands and stops. No curve goes past its end and comes back, because a bounce looks generic.

## The press of a button

A press drops a small circle at the point of your finger. The circle has the colour of the text of the button, and it grows until it covers the button, and fades. A key press starts it at the middle. On a touch screen, the circle waits one press time: a finger that moves first starts a scroll, and shows no circle. One listener on the kitchen tab gives the press to each button, so a local button of a screen has it too, with no code of its own.

## A piece names its own motion

Five pieces have a motion of their own. Each has a piece token with a duration and an easing, which point to the role tokens above.

| Piece token           | The motion of                     |
| --------------------- | --------------------------------- |
| `--wfd-card-motion`   | A card that opens or changes      |
| `--wfd-row-motion`    | A row that comes or goes          |
| `--wfd-chip-motion`   | A chip that changes to on or off  |
| `--wfd-button-motion` | A local button that gets smaller under the finger |
| `--wfd-press-motion`  | The circle of the press           |

The ink and the paper of an [open card](open-card.md) take two moves, with `--wfd-ease-out`. An example: you want the [card](card.md) of a food item to open slower. You change the duration of `--wfd-card-motion`. The card of rice opens slower, and the chips and the buttons move as before.

## A motion of a script reads the tokens

The circles of the [open card](open-card.md), the glide of the things around it, and the circle that covers the window are scripts, not style blocks. Each one reads `--wfd-motion-move` and `--wfd-ease-out` of the element that it moves. So a change of a token changes them too, and with less motion they take no time.

| Motion | Time |
| ------ | ---- |
| The ink and the paper of a card | Two moves to open, one move to close |
| The glide of the things that a card pushes | One move |
| A circle that covers the window or a stage | Two moves to grow, one move to fade |

A circle that covers is a bit larger than the window. With the soft end of the easing, it covers the window at half its time, so the new screen opens then, and the circle grows on over it. A screen of its own, such as Cook Mode, opens and closes with such a circle, and so does a stage of the [Shop](shopping.md).

## A name that flies

A tick in the Shop sends the name of the item to the cart button, so you see where the item went. The name is on a small pill in the accent colour. It moves to the side fast and up slow, so its path is an arc, and it gets small as it lands, in 1.8 moves. The button gives a squeeze when the name lands: its icon starts at 70 % of its size and grows back, with no bounce. A tap in the cart view sends the name back to the shelf the same way. Only the position, the scale, and the opacity of the pill move.

## Less motion is no motion

A device can have the setting for less motion. Then the file of the tokens sets each duration to 0. Each transition and each animation of a screen uses a token, so no screen needs a rule of its own for less motion.

## The transitions of Svelte stay

Some motion is in the scripts, not in a style block: a part that slides in, a row that fades, a photo that grows. Svelte makes these smooth, and each one checks the setting for less motion itself. They do not use the tokens.

## Further reading

- [Look](look.md): the three kinds of token, and why a piece token is rare.
- [Pieces](pieces.md): the pieces that have a motion.
