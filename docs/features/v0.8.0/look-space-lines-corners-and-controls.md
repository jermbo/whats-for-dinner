---
title: Space, lines, corners, and controls
summary: "Six space jobs, three line widths, the corner tokens, and two control heights, so each part has the same gaps, edges, and targets."
parent: look-stories.md
updated: 2026-10-20
persona: Keeper
depends-on: [look-colour-roles-in-the-two-schemes.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Look stories](look-stories.md) / Space, lines, corners, and controls

# Space, lines, corners, and controls

As the [keeper](../../personas.md), I want each part to have the same gaps, edges, corners, and targets, so that each screen feels like one tool and each control is easy to hit with one thumb.

## Requirements

1. Space has six role tokens, one for each job
   - a. `--wfd-space-page` 14 px: the padding of the kitchen tab
   - b. `--wfd-space-section` 16 px: the gap between the blocks of a part
   - c. `--wfd-space-stack` 12 px: the gap between the items of a list or a form
   - d. `--wfd-space-inset` 12 px: the padding inside a panel, a card, or a field
   - e. `--wfd-space-group` 8 px: the gap between controls that belong together, such as chips
   - f. `--wfd-space-tight` 4 px: the gap between a name and its small line, or an icon and its text
2. Each padding, gap, and margin of a screen or a piece is one of the six tokens, or 0
   - a. A value of today goes to the job that it has
   - b. A space that fits no job is a missing token: the builder names it in the story, and the owner decides
3. The lines are three tokens: `--wfd-border-thin` 1 px, `--wfd-border` 2 px, and `--wfd-border-rule` 4 px
   - a. Each line of a screen or a piece is one of the three
4. The corners are the tokens `--wfd-radius-card`, `--wfd-radius-button`, and `--wfd-radius-sticker`
   - a. The circle on a brand photo and the pill of the tag "Out" get `--wfd-radius-sticker`
   - b. The corners of 6 px and 4 px go to the nearest token
5. A control has one of two heights: `--wfd-control-min` 44 px, the smallest target, and `--wfd-control` 50 px, a button or a field
   - a. The heights stay in px
   - b. Cook Mode keeps its larger buttons
6. The architecture gets the page "Space": each job, the lines, the corners, and the heights

## Acceptance criteria

1. GIVEN the keeper opens the Pantry WHEN the keeper looks at the brand photo of taco seasoning that is selected THEN its mark has square corners
2. GIVEN a food item is out WHEN the keeper opens the Pantry THEN its tag "Out" has the corners of a sticker
3. GIVEN the token `--wfd-space-stack` changes to 16 px WHEN the keeper opens the Pantry and the Shop THEN the gap between two lines is larger in the two parts
4. GIVEN the token `--wfd-border` changes to 3 px WHEN the keeper opens the Pantry THEN each chip and each field has a thicker edge
5. GIVEN the keeper opens each part WHEN the keeper taps each chip, button, and line THEN no target is less than 44 px high
6. GIVEN the code of the screens and the pieces WHEN you search their style blocks for a padding, a gap, a margin, a line width, or a corner in px THEN there is none, but 0

## Depends on

- [Colour roles in the two schemes](look-colour-roles-in-the-two-schemes.md): it makes the file of the tokens and the naming rule.

## Architecture

- [Pantry](../../architecture/pantry.md): the tag "Out".
- [Brands](../../architecture/brands.md): the mark on a brand photo.
