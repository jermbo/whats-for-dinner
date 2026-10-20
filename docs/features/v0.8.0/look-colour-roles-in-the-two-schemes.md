---
title: Colour roles in the two schemes
summary: "Each colour of the plugin comes from a role token, so each screen reads well in the light and the dark scheme, and one change of a palette token changes each screen."
parent: look-stories.md
updated: 2026-10-20
persona: Cook
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Look stories](look-stories.md) / Colour roles in the two schemes

# Colour roles in the two schemes

As the [cook](../../personas.md), I want each screen to take its colours from one set of roles that follows the scheme of Obsidian, so that I can read each screen, Cook Mode too, in the light and in the dark.

## Requirements

1. The tokens of the look are in one file, with three kinds: palette, role, and piece
   - a. A palette token names a plain value: `--wfd-palette-olive`
   - b. A role token names a job: `--wfd-color-primary`
   - c. A token name is the category and then the role
2. The colour roles are `bg`, `surface`, `control`, `text`, `text-muted`, `text-faint`, `border`, `track`, `selected`, `on-selected`, `focus`, `primary`, `on-primary`, `warning`, `on-warning`, `danger`, `on-danger`, `frame`, `on-frame`, and `frame-muted`
   - a. Each role has the colour of the table of decision 15 of the [decision log](../../initiatives/style-guide/decision-log.md)
3. The dark scheme of Obsidian changes only the role tokens
   - a. No screen and no piece has a rule of its own for the dark scheme
4. Screens and pieces use only role tokens and piece tokens for a colour
   - a. No hex value, no `oklch()` value, and no palette token is in a screen or a piece
   - b. The text and the dim parts of the dark frame of Cook Mode and the gallery use `on-frame` and `frame-muted`
   - c. White text on tomato uses `on-danger`
5. The accent setting "Obsidian" replaces `primary` and `on-primary`
6. Each screen looks as it does today, in the two schemes
7. The architecture gets the page "Look": the three kinds of token, the naming rule, and the rule "use a token, not a value"
   - a. The architecture gets the page "Colour": each role and its job in the kitchen
   - b. The code standards get the rule "use a token, not a value"

## Acceptance criteria

1. GIVEN the light scheme WHEN the cook opens Cook Mode on Mashed potatoes THEN the frame is dark and the text "Exit" is light
   - a. AND the done pieces of the step bar are light, and the pieces to come are dim
2. GIVEN the dark scheme WHEN the cook opens Cook Mode on Mashed potatoes THEN the frame and its text have the same colours as in the light scheme
3. GIVEN the dark scheme WHEN the keeper opens the Pantry THEN the page is dark, the cards are a lighter dark, and the text is light
4. GIVEN the light scheme WHEN the keeper opens the Pantry THEN the page is paper, the cards are white, and the text is ink
5. GIVEN a recipe uses a food to use soon WHEN the planner opens the Recipes THEN its sticker "Uses …" is tomato with white text
6. GIVEN the accent setting is "Obsidian" WHEN the cook opens Cook Mode on Mashed potatoes THEN the current piece of the step bar and the button "Step 1" have the accent colour of the theme
7. GIVEN the palette token of olive changes to a different colour WHEN the planner opens the Recipes THEN each sticker "Ready" has the new colour
8. GIVEN the code of the screens and the pieces WHEN you search their style blocks for a hex value THEN there is none

## Depends on

Nothing. This story makes the file of the tokens and the naming rule, which each other story of the look uses.

## Architecture

- [Settings](../../architecture/settings.md): the accent colour, which now replaces the role `primary`.
- [Cook Mode](../../architecture/cook-mode.md) and [gallery](../../architecture/gallery.md): the two screens with the dark frame.
- [Code standards](../../standards/code-standards.md): the page that gets the rule.
- [Look](../../architecture/look.md): the three kinds of token, the naming rule, and the rule "use a token, not a value". New.
- [Colour](../../architecture/colour.md): each role and its job in the kitchen. New.
