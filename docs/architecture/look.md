---
title: Look
summary: "How the plugin keeps one look on each screen: three kinds of token, one naming rule, and shared pieces that hold the look."
parent: ../README.md
updated: 2026-10-20
---

[Wiki](../README.md) / Look

# Look

The look is all that you see of the plugin but the data: colour, font, size, space, corners, lines, and motion. This page tells how one change in one place changes each screen.

## A screen that sets its own values drifts

When each screen sets its own sizes, the name of rice is 17 px in the Pantry and 18 px in the Shop. Nobody decided that. It is drift: each new screen copies a value that is nearly right. So no screen has a value of its own. A screen names a token, and the token has the value.

## Three kinds of token

A token is one value of the look with a name. All tokens are in one file of the kitchen.

| Kind    | It names     | Example                                                        | Who uses it                  |
| ------- | ------------ | -------------------------------------------------------------- | ---------------------------- |
| Palette | A plain value | `--wfd-palette-olive`                                          | Only a role token            |
| Role    | A job        | `--wfd-color-primary`, which points to the olive of the palette | Screens and pieces           |
| Piece   | One piece    | `--wfd-card-motion`, which points to a role token              | That piece only              |

A role tells you which token to use, and the plain value can change under it. The dark scheme of Obsidian changes only the role tokens. A piece token is rare: a piece gets one only when you want to try a different value on that piece alone.

## The name of a token

A name is the prefix `--wfd-`, the category, and then the role: `--wfd-color-primary`, `--wfd-font-size-name`, `--wfd-space-stack`, `--wfd-border-thin`, `--wfd-radius-card`, `--wfd-motion-change`. The category tells where a token belongs. So "text" the colour and "text" the size do not clash.

## Use a token, not a value

A screen or a piece has no hex value, no px size, no space, and no duration of its own. The only number is 0. When a value fits no token, a token is missing. You find the nearest token. You do not add a value.

## Pieces hold the look

A piece is one shared thing of the screen with its own look, such as a button or a chip. A screen file has only its layout: the place, the order, and the size of its blocks. [Pieces](pieces.md) tells each piece and when to use it.

An example: the owner changes `--wfd-font-size-name` to 1.25 rem. The name of each item in each list gets larger, and no other text changes.

## The tokens of each category

- [Colour](colour.md): each colour role and its job in the kitchen.
- [Type](type.md): the six font sizes and the three line heights.
- [Space](space.md): the space jobs, the lines, the corners, and the heights of a control.
- [Motion](motion.md): the durations, the easings, and the motion of each piece.

## Further reading

- [Settings](settings.md): the two settings that change the look.
- [Code standards](../standards/code-standards.md): the rule that a review holds each file to.
