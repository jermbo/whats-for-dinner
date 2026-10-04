---
title: Type
summary: 'The three fonts of the app and the job of each one.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / Type

# Type

The app uses three fonts. Each font tells you what kind of text you read.

## The problem

At the stove, you glance at the phone for one second. A name must be large and heavy so that you can read it from an arm's length. A step must be easy to read in a long text. A price on a receipt must look like a price on a receipt.

## The three fonts

| Font              | Used for                   | Rules                                                                                  |
| ----------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| Anton             | Names, titles, and numbers | Always uppercase. Never under 15 px. Line height .86 for a title, .98 for a card name. |
| Schibsted Grotesk | All text                   | Weights 500, 600, 700, and 800.                                                        |
| IBM Plex Mono     | The receipt                | Weights 400 and 600. Uppercase, with dotted leaders.                                   |

## The sizes of text

| Text    | Size and weight | Example            |
| ------- | --------------- | ------------------ |
| Step    | 44 / 600        | Roast 25 min.      |
| Subline | 17 / 600        | 3 meals are ready. |
| Button  | 16 / 700        | Add to the menu    |
| Label   | 12 / 800        | IN THE PANTRY      |

A label is always uppercase, with a little space between the letters.

## Why a count is split in two colours

A count such as 7/9 is Anton. The 7 is ink, and the 9 is a lighter ink. You read the first number first, and the second number is the limit. The two shades make the order clear without a word.

## Where the fonts come from

The three fonts are npm packages: `@fontsource/anton`, `@fontsource-variable/schibsted-grotesk`, and `@fontsource/ibm-plex-mono`. The app loads them from its own files, so they work with no connection. The font names are tokens in `tokens.css`: `--font-display`, `--font-body`, and `--font-mono`.

## Further reading

- [Colour and materials](colour-and-materials.md): the colours that the text sits on.
