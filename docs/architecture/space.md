---
title: Space
summary: "The six space jobs of the plugin, the three line widths, the place of a focus ring, the corners, and the two heights of a control."
parent: look.md
updated: 2026-11-01
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

## Two places for a focus ring

A keyboard shows where you are with a ring around the control that has the focus. The ring has the width `--wfd-border`.

| Token                | Value  | Job                                                        |
| -------------------- | ------ | ---------------------------------------------------------- |
| `--wfd-focus-offset` | 2 px   | The ring is outside its control, with a small gap.         |
| `--wfd-focus-inset`  | −3 px  | The ring is inside a control that fills its box, such as a row. |

A row fills the width of its list, so a ring outside it is under the next row. That is why it has the ring inside.

## Three corners

`--wfd-radius-card` is for a card and a panel. `--wfd-radius-button` is for a button and a field. `--wfd-radius-sticker` is for a sticker, a check box, the mark on a brand photo, and the tag "Out". The Larder look has no circle and no pill, so these two have the nearly square corners of a sticker.

## Two heights for a control

| Token               | Height | Job                                |
| ------------------- | ------ | ---------------------------------- |
| `--wfd-control-min` | 44 px  | The smallest target for a thumb    |
| `--wfd-control`     | 50 px  | A button or a field                |

The heights stay in px. A target is for the finger, and a finger does not get larger with the text. [Cook Mode](cook-mode.md) keeps its larger buttons, because you use them at arm's length.

## A box holds its children

A child never breaks out of its parent. The cause is always the same: a box takes the width of its longest line, and the parent grows to fit it. Obsidian adds to it, because a `button` does not wrap its text. Four rules keep each box closed, at each screen size.

1. **A grid column may be narrower than its content.** Write `minmax(0, 1fr)`, never `1fr` or `auto`, for a column that holds text. Without the `0`, the column is as wide as its longest line.
2. **A card takes its size from its grid.** A card that sits in a grid, such as a place card, has `contain: inline-size`, so that its longest line cannot widen its track.
3. **A button wraps.** The kitchen sets `white-space: normal` on each button. Text that is too long for its line is clipped at two lines with "…", and the full text is its tooltip.
4. **A small part keeps its size, and the text gives way.** A sticker, a check, or an action such as "Cook" has `flex: none`. The name beside it shrinks, wraps, or is clipped. A long name of a person in a sticker ends in "…" at half the width of the card.

The check is a narrow screen with long names. If a part leaves its box there, one of the four rules is missing.

## Further reading

- [Look](look.md): why a screen names a token and not a value.
- [Pieces](pieces.md): the pieces that use these tokens.
