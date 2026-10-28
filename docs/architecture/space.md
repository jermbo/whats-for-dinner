---
title: Space
summary: "The six space jobs of the plugin, the three line widths, the corners, and the two heights of a control."
parent: look.md
updated: 2026-10-27
---

[Wiki](../README.md) / [Look](look.md) / Space

# Space

Each part must feel like one tool, and each control must be easy to hit with one thumb. So the gaps, the edges, the corners, and the targets come from a few tokens. This page tells each of them.

## Space has a job, not a size

A space token names what the space does. You do not select a size. You ask "what is this gap for?", and the job gives the token.

| Token                 | Value | Job                                                                |
| --------------------- | ----- | ------------------------------------------------------------------ |
| `--wfd-space-page`    | 14 px | The padding of the kitchen tab                                     |
| `--wfd-space-section` | 16 px | The gap between the blocks of a part                               |
| `--wfd-space-stack`   | 12 px | The gap between the items of a list or a form                      |
| `--wfd-space-inset`   | 12 px | The padding inside a panel, a card, or a field                     |
| `--wfd-space-group`   | 8 px  | The gap between controls that belong together, such as chips       |
| `--wfd-space-tight`   | 4 px  | The gap between a name and its small line, or an icon and its text |

`stack` and `inset` have the same value, but a different job. So you can change the gap between the lines of the Pantry and keep the padding of each card.

A gap that seems to need a different value takes the nearest job. A value of its own is how drift starts. Room that must line up with a thing, such as the text after the box of the Shop, is the size of that thing plus a space token.

## Room for the bar of Obsidian

On a phone, Obsidian shows a bar at the bottom of the screen, over the kitchen. A button under that bar cannot be tapped. So the token `--wfd-space-bar` is the height that the bar covers, and each screen adds it to the space at its end. A control that stays at the bottom, such as the foot of a stage of the Shop, sits on top of this room, and its background fills the room.

The kitchen measures the bar on the phone, so a new version of Obsidian with a different bar needs no change. The room stays when Obsidian hides its bar during a scroll, so the screen does not jump. On a computer, the token is 0.

## Three lines

| Token               | Width | Job                                         |
| ------------------- | ----- | ------------------------------------------- |
| `--wfd-border-thin` | 1 px  | A thin rule between rows                    |
| `--wfd-border`      | 2 px  | The edge of a control, a chip, or a field   |
| `--wfd-border-rule` | 4 px  | The heavy rule of a card or a head          |

## Three corners

`--wfd-radius-card` is for a card and a panel. `--wfd-radius-button` is for a button and a field. `--wfd-radius-sticker` is for a sticker, a check box, the mark on a brand photo, and the tag "Out". The Larder look has no circle and no pill, so these two have the nearly square corners of a sticker.

## Two heights for a control

| Token               | Height | Job                                |
| ------------------- | ------ | ---------------------------------- |
| `--wfd-control-min` | 44 px  | The smallest target for a thumb    |
| `--wfd-control`     | 50 px  | A button or a field                |

The heights stay in px. A target is for the finger, and a finger does not get larger with the text. [Cook Mode](cook-mode.md) keeps its larger buttons, because you use them at arm's length.

## Further reading

- [Look](look.md): why a screen names a token and not a value.
- [Pieces](pieces.md): the pieces that use these tokens.
