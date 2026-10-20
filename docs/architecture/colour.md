---
title: Colour
summary: "Each colour role of the plugin, its job in the kitchen, and how the light and the dark scheme change it."
parent: look.md
updated: 2026-10-20
---

[Wiki](../README.md) / [Look](look.md) / Colour

# Colour

The plugin has the Larder look: paper, cards, ink, and three rare colours. This page tells each colour role, and why the roles, and not the screens, follow the scheme of Obsidian.

## Three rare colours keep their meaning

Olive, amber, and tomato are rare. When the Pantry shows tomato, you know at once that food must be used first. A colour that is on each screen tells you nothing. So each of the three has one job.

## The roles

A screen asks for a job, such as `--wfd-color-danger`. It never asks for tomato.

| Role                                 | Light             | Dark           | Job in the kitchen                                         |
| ------------------------------------ | ----------------- | -------------- | ---------------------------------------------------------- |
| `bg`                                 | paper             | ink            | The page                                                   |
| `surface`                            | white             | dark card      | A card, a panel                                            |
| `control`                            | white             | dark grey      | A control that is off                                      |
| `text`, `text-muted`, `text-faint`   | ink, ink-2, ink-3 | light ink ramp | Text                                                       |
| `border`                             | ink               | soft line      | A line, the edge of a control                              |
| `track`                              | light grey        | dark grey      | The empty part of a bar                                    |
| `selected`, `on-selected`            | ink               | light ink      | A chip that is on, the main button, the open card          |
| `focus`                              | ink               | light ink      | The focus ring                                             |
| `primary`, `on-primary`              | olive             | olive          | Ready, done, the current step                              |
| `warning`, `on-warning`              | amber             | amber          | Low                                                        |
| `danger`, `on-danger`                | tomato            | tomato         | Use first                                                  |
| `frame`, `on-frame`, `frame-muted`   | ink               | ink            | Cook Mode and the gallery                                  |

A role that starts with `on-` is the colour of text on that role. White text on tomato is `on-danger`.

## The dark scheme changes only the roles

In the dark scheme of Obsidian, the paper and the ink change places. The file of the tokens points each role to a different palette colour, and no screen has a rule for the dark scheme. Light lines on a dark page are hard on the eyes, so `border` is soft in the dark. Tomato is a bit lighter, so that it stays clear on a dark card.

## The frame stays dark

[Cook Mode](cook-mode.md) and the [gallery](gallery.md) put a recipe in front of you, so they have a dark frame in the two schemes. Their text is `on-frame`, and the dim parts, such as a step to come, are `frame-muted`.

## The accent setting

The [settings](settings.md) can take the accent colour of your theme. Then that colour replaces `primary`, and the text colour of the accent replaces `on-primary`. Thus "Ready", the current step, and the button "Step 1" of Cook Mode follow your theme. No other role changes.

## Further reading

- [Look](look.md): the three kinds of token and the naming rule.
