---
title: Type
summary: "The six font sizes of the plugin, each with its job, the three line heights, and why the sizes follow the zoom of the reader."
parent: look.md
updated: 2026-10-20
---

[Wiki](../README.md) / [Look](look.md) / Type

# Type

In the store, you look at the list for one second. The name of an item must be the same size in each list, so that your eye finds it at once. This page tells the six font sizes and the three line heights.

## Six sizes, each with a job

A size has the name of its job, not of its value. You select the size by what the text is.

| Token                    | Size      | Job                                                         |
| ------------------------ | --------- | ----------------------------------------------------------- |
| `--wfd-font-size-label`  | 0.75 rem  | A label in capitals, such as a sticker                      |
| `--wfd-font-size-small`  | 0.875 rem | The small line below a name, a chip, the navigation         |
| `--wfd-font-size-text`   | 1 rem     | Text, a button, a field                                     |
| `--wfd-font-size-name`   | 1.125 rem | The name of an item in each list                            |
| `--wfd-font-size-title`  | 1.375 rem | The title of a card or of a form, the large number of a row |
| `--wfd-font-size-head`   | 2.25 rem  | The title of a part                                         |

An example: rice in the Pantry, onions in the Shop, and Mashed potatoes in the Recipes and in the Plan all use `name`. When you change `name` to 1.25 rem, each name of an item gets larger, and no other text changes.

## The sizes follow the zoom

A size is in rem, not in px. A rem is the size of the text of Obsidian. So when you make the text larger, the plugin gets larger too. When you set the zoom of Obsidian from 100% to 120%, the name "Onions" is 20% larger.

## Cook Mode is read at arm's length

[Cook Mode](cook-mode.md) keeps fluid sizes for the text of a step and for the count. A fluid size changes with the width of the tab, so that a step fills a wide screen on the counter. These are the only sizes that are not one of the six.

## Three line heights

| Token                       | Value | Job                           |
| --------------------------- | ----- | ----------------------------- |
| `--wfd-line-height-display` | 1.12  | Titles and numbers            |
| `--wfd-line-height-text`    | 1.4   | Text                          |
| `--wfd-line-height-single`  | 1     | A mark or a count in one line |

## Two fonts

Titles, names, and numbers have Bricolage Grotesque, and all other text has the font of Obsidian. The [settings](settings.md) can change the font for titles and numbers.

## Further reading

- [Look](look.md): why a screen names a token and not a value.
- [Pieces](pieces.md): the list line, which uses `name`, `small`, and `title`.
