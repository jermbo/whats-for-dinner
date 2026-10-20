---
title: "Decision log: style guide"
summary: "The state of the look today, as counts from the code, and each decision that makes the look of the plugin uniform before version 1.0."
parent: ../../README.md
updated: 2026-10-20
---

[Wiki](../../README.md) / Decision log: style guide

# Decision log: style guide

The plugin has the Larder look: paper, cards, ink, and three rare colours. But each screen sets its own sizes. The name of a food item is 17 px in the Pantry, 18 px in the Shop, and 21 px on a recipe card. This page records each decision that gives the look one set of rules, and the reason for it. The new words are in the [glossary](glossary.md).

## The look today

The values of the look are custom properties with the prefix `--wfd-`, on the class `.wfd` of the kitchen tab. The dark scheme of Obsidian gives a second set of colours: paper and ink change places. Two settings change the look: the font for titles and numbers, and the accent colour.

| Part of the look   | Today                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Colour             | 15 colour tokens, with a dark variant. 26 tokens in use in total.                                                           |
| Colour not a token | 11 hex values in 4 files. Most are in the dark frame of Cook Mode and the gallery. Two are white text on tomato and on a mark. |
| Font               | Bricolage Grotesque for titles, names, and numbers. The interface font of Obsidian for all other text.                      |
| Font size          | 17 different px values, 4 `clamp()` sizes, and 1 em value in 132 declarations. No token. 14 px has 36 uses.                              |
| Font weight        | 500, 600, 700, and 800.                                                                                                     |
| Line height        | 9 different values.                                                                                                         |
| Space              | 445 declarations of padding, gap, or margin, with 22 different px values. The top 8: 12, 6, 8, 10, 16, 4, 14, 20.           |
| Corner radius      | 3 tokens with 51 uses. 4 values that are not tokens: 6 px, 4 px, a circle, and a pill.                                      |
| Rule               | 1 px and 2 px lines are literal values. The 4 px rule is a token.                                                           |
| Height of controls | 44, 46, 48, 50, 52, 60, and 64 px for the smallest height of a control.                                                     |
| Motion             | 0.1, 0.15, 0.2, 0.25, and 0.3 s in CSS. 150, 160, 200, 220, and 300 ms in scripts. Always ease-out. 26 copies of the reduced-motion rule. |
| Layout             | 2 container queries, no size media query.                                                                                    |
| Shared pieces      | 15 pieces in `src/ui/parts/`, such as the button, the chip, the sticker, and the head of a part. 21 screen files also style 67 buttons of their own. |

### The name of an item in each list

| List                     | Size of the name |
| ------------------------ | ---------------- |
| Pantry line              | 17 px            |
| Cart line                | 17 px            |
| Shop row, put away line  | 18 px            |
| Suggestion, food card    | 18 px            |
| Brand photo              | 20 px            |
| Recipe card              | 21 px            |
| Meal card                | 22 px            |

## Decisions

### What the style guide is

1. **The style guide is a design system with rules, and each screen follows it.** The goal is not a token for each value of today. The goal is a small set of tokens and pieces, and rules that tell which one to use. The reason: the owner wants a look that stays consistent, and a value that the owner can change in one place. Three options were rejected: tokens for the values of today only, which copies each pixel into a name; the same with one form for each job, checked screen by screen; and a new look.
2. **Anything that makes sense to tweak is a token.** This includes the width of a line (1 px, 2 px, and the 4 px rule), a line height, a height of a control, and a motion. The reason: the owner wants to change such a value later in one place. An option that was rejected: lines as literal values.
3. **Shared pieces have the look, and a screen file has only its layout.** The `Button` gets each action. Three pieces are new: a field, a panel (the surface of a card), and a list line (the name, a small line below it, and one number). A local button stays only when no piece fits, such as a photo tile, and it uses only tokens. A value that fits no token tells that a token is missing: you add the token, not the value. The reason: a piece makes the same thing look the same on each screen. Two options were rejected: only the `Button`, and no new piece.

### Names

4. **There are three kinds of token.** A palette token names a plain value, such as `--wfd-palette-olive`. A role token names a job, such as `--wfd-color-primary`. Screens and pieces use only role tokens. A piece token, such as `--wfd-card-motion`, is rare: a piece gets one only when you can want to swap a value on that piece alone. The reason: a role tells which token to use, and the plain value can change under it. The dark variant changes only the role tokens. Two options were rejected: names by size only, and names by step number.
5. **A token name is the category and then the role:** `--wfd-color-primary`, `--wfd-font-size-name`, `--wfd-space-stack`, `--wfd-border-thin`, `--wfd-radius-card`, `--wfd-motion-change`. The reason: the category tells where a token belongs, and "text" the colour does not clash with "text" the size. An option that was rejected: short names with no category, such as `--wfd-primary`.

### Type

6. **The font sizes are a scale of six steps, named by job.** Cook Mode keeps its fluid sizes, because you read it at arm's length.

   | Step  | Size     | Today | Job                                                         |
   | ----- | -------- | ----- | ----------------------------------------------------------- |
   | label | 0.75 rem  | 12 px | A label in capitals, such as a sticker                      |
   | small | 0.875 rem | 14 px | The small line below a name, a chip, the navigation         |
   | text  | 1 rem     | 16 px | Text, a button, a field                                     |
   | name  | 1.125 rem | 18 px | The name of an item in each list                            |
   | title | 1.375 rem | 22 px | The title of a card or of a form, the large number of a row |
   | head  | 2.25 rem  | 36 px | The title of a part                                         |

   The reason: the name of an item gets one size in each list. Two options were rejected: eight steps, which keep 15 px and 26 px, and a scale from a ratio.
7. **A font size has a unit that follows the zoom of the reader.** The sizes are in rem, not in px. The reason: accessibility. When you make the text larger, the plugin must follow. An option that was rejected: px, which follows only the interface zoom of Obsidian.
8. **Line heights are three tokens:** `display` 1.12 for titles and numbers, `text` 1.4 for text, and `single` 1 for a mark or a count in one line. The 9 values of today go to these three. The reason: the owner wants to tweak them.
9. **The values of the type scale are locked, and the check is on the phone after the build.** The reason: each step is one token, so a step that looks wrong is a change of one line.

### Space

10. **Space has six tokens, one for each job, and no scale of steps.**

    | Token     | Value | Job                                                                 |
    | --------- | ----- | ------------------------------------------------------------------- |
    | `page`    | 14 px | The padding of the kitchen tab                                      |
    | `section` | 16 px | The gap between the blocks of a part                                |
    | `stack`   | 12 px | The gap between the items of a list or a form                       |
    | `inset`   | 12 px | The padding inside a panel, a card, or a field                      |
    | `group`   | 8 px  | The gap between controls that belong together, such as chips        |
    | `tight`   | 4 px  | The gap between a name and its small line, or an icon and its text  |

    The values of today go to the nearest job. The reason: the owner does not want steps for the sake of steps, and a review can hold the code only to what has a token. Three options were rejected: steps of 4 px, steps of 2 px, and tokens only for the page, the section, and the inset.

### Lines, corners, and controls

11. **The lines are three tokens:** `--wfd-border-thin` 1 px, `--wfd-border` 2 px, and `--wfd-border-rule` 4 px.
12. **A control has two heights:** 44 px, the smallest target for a thumb, and 50 px, a button or a field. They stay in px, because a target is for the finger, not for the text. Cook Mode keeps its larger buttons.
13. **The circle on a brand photo and the pill of the "out" tag change to the radius of a sticker.** The reason: the Larder rules have no pill and no circle.

### Colour

14. **The light and the dark variant follow the scheme of Obsidian.** The plugin does not take its paper and ink from the Obsidian theme. The accent setting and the font setting stay.
15. **The colour roles have the generic names of a design system.** The guide tells the job of each role in the kitchen. An option that was rejected: kitchen names, such as `ready`, `low`, and `use-first`.

    | Role                                 | Light             | Dark           | Job in the kitchen                                         |
    | ------------------------------------ | ----------------- | -------------- | ---------------------------------------------------------- |
    | `bg`                                 | paper             | ink            | The page                                                   |
    | `surface`                            | white             | dark card      | A card, a panel                                            |
    | `control`                            | white             | dark grey      | A control that is off                                      |
    | `text`, `text-muted`, `text-faint`   | ink, ink-2, ink-3 | light ink ramp | Text                                                       |
    | `border`                             | ink               | soft line      | A line, the edge of a control                              |
    | `track`                              | light grey        | dark grey      | The empty part of a bar                                    |
    | `selected`, `on-selected`            | ink               | light ink      | A chip that is on, the main button                         |
    | `focus`                              | ink               | light ink      | The focus ring                                             |
    | `primary`, `on-primary`              | olive             | olive          | Ready, done, the current step. The accent setting replaces it. |
    | `warning`, `on-warning`              | amber             | amber          | Low                                                        |
    | `danger`, `on-danger`                | tomato            | tomato         | Use first                                                  |
    | `frame`, `on-frame`, `frame-muted`   | ink               | ink            | Cook Mode and the gallery, dark in the two schemes         |

### Motion

16. **Motion has tokens, and a piece names its motion with its own token.** An example: `--wfd-motion-bounce` is a motion, and a card uses `--wfd-card-motion`, which points to it. To try a different motion on the cards, you change one line. The reason: the owner wants to change a motion and have it apply to all the right places.
17. **The motion tokens are three durations and two easings.** The durations are `press` 0.1 s, `change` 0.2 s, and `move` 0.3 s. The easings are `out` and `bounce`. Piece tokens are only for a piece with its own motion: the card, a row that comes and goes, the chip, and the press of a button.
18. **The transitions of Svelte stay as they are.** These are the 40 slides, fades, and flies in the scripts. The reason: Svelte makes them smooth, and the owner wants to look at them later. Three options were rejected: a helper that reads the duration token, a copy of the tokens in TypeScript, and CSS in place of Svelte.

### Where the guide lives and how it is checked

19. **The style guide is a set of architecture pages:** one page "Look", with a page for each of type, colour, space, motion, and pieces. The code standards get one rule: use a token, not a value. An option that was rejected: a view in the plugin that shows each piece. It adds code to keep up before 1.0.
20. **You confirm the look by eye, on the phone. No automatic test checks it.** The style guide and the rule of the code standards tell which token to use, and a review keeps the code to the rule. The reason: Vitest is for the behaviour of the plugin only, and the look is a visual confirmation. The stylelint package stays possible later. Three options were rejected: a Vitest test that reads the style blocks, an own script in `npm run check`, and stylelint now.

## Further reading

- [Workflow](../../standards/workflow.md): the step of the work that this page is in.
- [Settings](../../architecture/settings.md): the two settings of the look.
