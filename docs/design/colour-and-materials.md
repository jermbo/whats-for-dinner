---
title: Colour and materials
summary: 'The six colours of the app, the share of each on a screen, and the rule for when to use each.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / Colour and materials

# Colour and materials

The app has six colours. Most of a screen is paper, white, and ink. The other three are rare, so that they keep their meaning.

## The problem

When many colours share a screen, no colour means anything. You cannot tell what is urgent. So the app gives each colour one job, and it keeps the three colours with a message small.

## The six colours

| Colour | Value                | Its job                                                |
| ------ | -------------------- | ------------------------------------------------------ |
| Paper  | `#ECEAE2`            | The page and the navigation. Lists sit on it directly. |
| Card   | `#FFFFFF`            | Cards, the receipt, and input fields. Nothing else.    |
| Ink    | `#1D1C1A`            | Text, rules, the main button, and the active item.     |
| Olive  | `oklch(.78 .15 110)` | The name band, the current step, and the done state.   |
| Amber  | `oklch(.75 .15 75)`  | A gauge that is below its low line.                    |
| Tomato | `oklch(.55 .17 30)`  | "Use first", the stamp, and undo.                      |

A second ink, `#4A463F`, is for text that is less important.

## The share of a typical screen

Paper is 60 percent. Card is 20 percent. Ink is 12 percent. Olive is 6 percent. Amber and tomato are 1 percent or less each. If a screen has more amber or tomato, something is wrong with the screen, and not with the colour.

## Rules for the rare colours

- **Amber** is only for a level that is low. Ink text goes on it. The contrast is 8.9 to 1.
- **Tomato** is for urgency. On a fill, the text is white. On paper, the text uses a darker tomato, so that the contrast is high enough.
- **Olive** always has ink on top. The contrast is 9.6 to 1.

## An example

The card for chicken thighs shows an olive band with the name in ink. The line "Chicken: 7 days in stock" is tomato, because the chicken is the oldest food in the pantry. The rest of the card is white, and the page behind it is paper.

## Further reading

- [Type](type.md): the fonts that sit on these colours.
