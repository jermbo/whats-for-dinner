---
title: One type scale
summary: "Six font sizes in rem and three line heights, so the name of an item has one size in each list, and the text follows the zoom of the reader."
parent: look-stories.md
updated: 2026-10-20
persona: Shopper
depends-on: [look-colour-roles-in-the-two-schemes.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Look stories](look-stories.md) / One type scale

# One type scale

As the [shopper](../../personas.md), I want the text of each part to come from one scale that follows the zoom, so that a name has the same size in each list and I can read it at a glance in the store.

## Requirements

1. The font sizes are six role tokens, in rem
   - a. `--wfd-font-size-label` 0.75 rem: a label in capitals, such as a sticker
   - b. `--wfd-font-size-small` 0.875 rem: the small line below a name, a chip, the navigation
   - c. `--wfd-font-size-text` 1 rem: text, a button, a field
   - d. `--wfd-font-size-name` 1.125 rem: the name of an item in each list
   - e. `--wfd-font-size-title` 1.375 rem: the title of a card or of a form, the large number of a row
   - f. `--wfd-font-size-head` 2.25 rem: the title of a part
2. Each font size of a screen or a piece is one of the six tokens
   - a. Cook Mode keeps its fluid sizes for the step and the count
   - b. The name of an item in the lists of the Pantry, the Shop, put away, the suggestions, the Plan, and the Recipes uses `name`
3. The line heights are three role tokens
   - a. `--wfd-line-height-display` 1.12: titles and numbers
   - b. `--wfd-line-height-text` 1.4: text
   - c. `--wfd-line-height-single` 1: a mark or a count in one line
4. Each line height of a screen or a piece is one of the three tokens
5. The architecture gets the page "Type": each step, its job, and the line heights

## Acceptance criteria

1. GIVEN the Pantry shows rice WHEN the shopper opens the Shop with onions on the list THEN the name "Onions" and the name "Rice" have the same size
2. GIVEN the Plan shows Mashed potatoes WHEN the planner opens the Recipes THEN the name "Mashed potatoes" has the same size in the two parts
3. GIVEN the zoom of Obsidian is 100% WHEN the shopper sets the zoom to 120% THEN the name "Onions" is 20% larger
4. GIVEN the shopper opens the Pantry WHEN the shopper reads the title "Pantry" THEN its size is `--wfd-font-size-head`
5. GIVEN the token `--wfd-font-size-name` changes to 1.25 rem WHEN the shopper opens each part THEN each name of an item is larger, and no other text changes
6. GIVEN the cook opens Cook Mode on Mashed potatoes WHEN the tab is narrow and then wide THEN the title of the step changes its size with the width
7. GIVEN the code of the screens and the pieces WHEN you search their style blocks for a font size in px THEN there is none, but in the fluid sizes of Cook Mode

## Depends on

- [Colour roles in the two schemes](look-colour-roles-in-the-two-schemes.md): it makes the file of the tokens and the naming rule.

## Architecture

- [Cook Mode](../../architecture/cook-mode.md): the fluid sizes of a step.
- [Settings](../../architecture/settings.md): the font for titles and numbers, which this story does not change.
