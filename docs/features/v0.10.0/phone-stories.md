---
title: Phone stories
summary: "The user stories of version 0.10.0 that fix the kitchen on a phone: room for the bar of Obsidian, a drag that Obsidian does not take, and a linked title that shows its name."
parent: ../README.md
updated: 2026-10-27
---

[Wiki](../../README.md) / [Features](../README.md) / Phone stories

# Phone stories

The owner used the kitchen on an Android phone for a long time. Three things got in the way: the bar of Obsidian at the bottom covers the last controls, a sideways drag opens a side panel of Obsidian, and a title such as `# [[Apple Pie]]` shows its brackets. This page lists the stories of version 0.10.0 that fix them.

## The stories

| Story                                                                  | Persona | Depends on | Status  |
| ---------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [Controls above the bar of Obsidian](phone-controls-above-the-obsidian-bar.md) | Keeper  | Nothing    | `built` |
| 2. [A sideways drag stays in the kitchen](phone-a-drag-stays-in-the-kitchen.md)   | Keeper  | Nothing    | `built` |
| 3. [A linked title shows its name](phone-a-linked-title-shows-its-name.md)        | Writer  | Nothing    | `built` |

## Architecture pages

| Page                                                 | Stories that update it                                         |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| [Space](../../architecture/space.md)                 | 1: the room for the bar of Obsidian.                           |
| [Card](../../architecture/card.md)                   | 2: a drag on the bar is not a swipe of Obsidian.               |
| [Gallery](../../architecture/gallery.md)             | 2: a swipe on the photo is not a swipe of Obsidian.            |
| [Recipe note](../../architecture/recipe-note.md)     | 3: a link in the title shows as its name in the kitchen.       |

## Further reading

- [Pantry fill stories](pantry-fill-stories.md): the other stories of version 0.10.0.
