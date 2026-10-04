---
title: Style values
summary: 'Where a colour, a text size, and a style rule live in the code, so that the design stays one design.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Code](README.md) / Style values

# Style values

The [design](../design/README.md) has few colours, three fonts, and three rules. This page tells how the CSS keeps it that way.

## The problem

A component needs a small text. One author writes `0.8rem`, the next writes `0.8125rem`, and a third writes `0.85rem`. Each one looks correct alone. Together, the app has seven sizes that the eye cannot tell apart, and no one of them can change without a search.

## A value has one name

Each value of the design is a token: a custom property in `tokens.css`. A component uses the token and not the value.

- A colour is a material: `--paper`, `--card`, `--ink`, `--olive`. A colour value is in `tokens.css` and in no other file.
- A value has one name only. There is no second name such as `--color-text` for `--ink`. Two names for one value let two vocabularies grow.
- A text size comes from the scale. The name tells the job, as in the [type page](../design/type.md): `--text-label` is 12 px, `--text-subline` is 17 px. A size that scales with its container, such as the name on a card, stays in its component.
- A space is `--space-1` to `--space-8`. A motion curve is `--ease-out` or `--ease-spring`.

## A rule has one home

| The rule                                             | Its home                         |
| ---------------------------------------------------- | -------------------------------- |
| It applies to one component                          | The style block of the component |
| Three components use it: a button, a chip, a sticker | A shared block in `lib/styles`   |
| It places blocks on a page: columns, a grid          | `layout.css`                     |

The name of a shared file tells what is in it: `button.css`, `sticker.css`. A name such as "pieces" tells nothing.

Class names follow BEM in the two places: `step-fields__row--current`.

## An example

A label is small uppercase text with a little space between the letters: "IN THE PANTRY". It is on almost each screen. So it is the class `label` in a shared block, and no component writes its four lines again.

The dashed line for the next step is only in the step list. It stays in the style block of that component.

## Further reading

- [Repeat or share](repeat-or-share.md): the same question, for code that is not CSS.
- [Colour and materials](../design/colour-and-materials.md): the meaning of each colour token.
