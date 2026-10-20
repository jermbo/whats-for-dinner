---
title: "Spec: style guide"
summary: "The scope of the style guide: a design system of tokens and shared pieces that each screen of the plugin follows, and that you confirm by eye on the phone."
parent: decision-log.md
updated: 2026-10-20
status: agreed
---

[Wiki](../../README.md) / [Decision log: style guide](decision-log.md) / Spec: style guide

# Spec: style guide

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there. The words are in the [glossary](glossary.md).

## The problem

The keeper opens the Pantry, then the Shop, then the Recipes. The name of a food item is 17 px in one list, 18 px in the next, and 21 px on a recipe card. Each screen sets its own sizes, spaces, and buttons, so the plugin does not feel like one thing. The owner cannot change a size or a motion in one place, and larger text in the device settings does not make the plugin larger.

## The solution

The plugin has one design system: palette tokens, role tokens, a few piece tokens, and shared pieces. Each screen uses only role tokens and pieces. You confirm the look by eye, on the phone.

An example: the name of an item in each list uses `--wfd-font-size-name`, 1.125 rem. The owner changes that token to 1.25 rem, and each list changes. In the dark scheme of Obsidian, `--wfd-color-bg` points to the dark palette colour, and no screen changes.

## In scope

1. Three kinds of token: palette, role, and piece (decision 4)
   - a. Screens and pieces use only role tokens and piece tokens (decision 4)
   - b. A token name is the category and then the role, such as `--wfd-color-primary` (decision 5)
   - c. Each value that makes sense to tweak is a token, such as a line width, a line height, a control height, and a motion (decision 2)
   - d. Three line widths: `--wfd-border-thin` 1 px, `--wfd-border` 2 px, and `--wfd-border-rule` 4 px (decision 11)
   - e. Two control heights in px: 44 px and 50 px. Cook Mode keeps its larger buttons (decision 12)
2. A font size scale of six steps: label, small, text, name, title, head (decision 6)
   - a. The sizes are in rem, so they follow the zoom of the reader (decision 7)
   - b. The name of an item has the same size in each list (decision 6)
   - c. Cook Mode keeps its fluid sizes (decision 6)
   - d. Line heights are tokens: `display` 1.12, `text` 1.4, and `single` 1 (decision 8)
   - e. The values of the scale are locked, and the phone checks them after the build (decision 9)
3. Six space tokens: page, section, stack, inset, group, tight (decision 10)
4. Colour roles with generic names, from `bg` to `frame` (decision 15)
   - a. The light and the dark variant follow the scheme of Obsidian (decision 14)
   - b. The dark variant changes only the role tokens (decision 4)
   - c. The accent setting replaces `primary`, and the font setting stays (decision 14)
   - d. The text of the dark frame of Cook Mode and of the gallery uses role tokens (decision 15)
5. Motion tokens: the durations `press`, `change`, and `move`, and the easings `out` and `bounce` (decision 17)
   - a. Piece tokens for the motion of the card, a row that comes and goes, the chip, and the press of a button (decisions 16 and 17)
6. Shared pieces have the look, and a screen file has only its layout (decision 3)
   - a. The `Button` gets each action (decision 3)
   - b. New pieces: a field, a panel, and a list line (decision 3)
   - c. A local button stays only when no piece fits, and it uses only tokens (decision 3)
   - d. The circle on a brand photo and the pill of the "out" tag get the radius of a sticker (decision 13)
7. The style guide is a set of architecture pages: "Look", and a page for each of type, colour, space, motion, and pieces (decision 19)
   - a. The code standards get the rule "use a token, not a value" (decision 19)
8. The look is confirmed by eye on the phone, with the checks below. A review keeps the code to the rule of the code standards (decision 20)

## Out of scope

1. A token for each value of today, one form for each job checked screen by screen, and a new look (decision 1)
2. Short token names with no category, and names by size or by step number (decisions 4 and 5)
3. A scale of space steps (decision 10)
4. Font sizes in px (decision 7)
5. Paper and ink from the Obsidian theme (decision 14)
6. Kitchen names for the colour roles (decision 15)
7. A change to the transitions of Svelte in the scripts (decision 18)
8. A view in the plugin that shows each piece (decision 19)
9. An automatic test of the look, in Vitest or in a script. The stylelint package can come later (decision 20)

## What changes in the system

Architecture pages that are new:

- **Look**: the three kinds of token, the rules, and the way to the five pages below.
- **Type**, **Colour**, **Space**, **Motion**, and **Pieces**: each token and each piece, with its job.

Pages that change:

- [Code standards](../../standards/code-standards.md): the rule "use a token, not a value".
- [Settings](../../architecture/settings.md): the accent colour replaces the role `primary`.
- The wiki [glossary](../../glossary.md), the [features](../../features/README.md) page, and the [roadmap](../../features/roadmap.md).

No note of the vault and no data file changes.

## How you test it

Checks that need the phone:

1. Each part in the light scheme and in the dark scheme. The name of an item has one size in each list, and no text is unreadable on its background. (Scope 2 b, 4)
2. Cook Mode and the gallery in the two schemes. The frame stays dark, and its text is readable. (Scope 4 d)
3. Larger text: the zoom of Obsidian, and the text size of the device. The text of the plugin gets larger, and the main buttons keep their place. Write down which of the two settings has an effect. (Scope 2 a)
4. A tap on each button, chip, and card. The motion is as before, and with less motion there is none. (Scope 5)
5. The accent setting "Obsidian" changes the colour of "ready" and of the current step. (Scope 4 c)

No rule of this work gets an automatic test. The look is a visual confirmation (decision 20).

## Further reading

- [Glossary: style guide](glossary.md): the words of this page.
