---
title: "Glossary: style guide"
summary: 'The new words of the initiative "style guide", each with one meaning, until the wiki glossary gets them.'
parent: decision-log.md
updated: 2026-10-20
---

[Wiki](../../README.md) / [Decision log: style guide](decision-log.md) / Glossary: style guide

# Glossary: style guide

The [decision log](decision-log.md) uses words that the [glossary](../../glossary.md) of the wiki does not have. This page gives each of them one meaning. The page is temporary: a word goes to the wiki glossary when its decision is made.

## The words of the look

The wiki glossary uses "part", "card", "row", and "line" for things of the kitchen. So the look uses different words for its own things.

| Word        | Meaning                                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Look        | All that you see of the plugin but the data: colour, font, size, space, corners, lines, and motion.                                           |
| Token       | One value of the look with a name, such as `--wfd-ink`. A screen uses the name, not the value. Then one change of the token changes each screen. |
| Scale       | A short list of tokens for one kind of value, from small to large, such as the font sizes. A screen selects a step of the scale.             |
| Step        | One value of a scale.                                                                                                                         |
| Palette token | A token that names a plain value, such as the colour olive. Only a role token uses it.                                                    |
| Role token  | A token that names a job, such as "primary" or the font size of a name. Screens and pieces use it.                                          |
| Piece token | A token of one piece that points to a role token, such as the motion of a card. You change it to try a different value on that piece only. |
| Piece       | One shared thing of the screen with its own look, such as a button, a chip, or a sticker. Each screen uses the same piece.                    |
| Frame       | The dark area around Cook Mode and the gallery. It is dark in the light scheme and in the dark scheme.                                        |
| Style guide | The pages that tell the tokens, the scales, and the pieces, and when to use each one.                                                         |

## Further reading

- [Settings](../../architecture/settings.md): the two settings that change the look.
