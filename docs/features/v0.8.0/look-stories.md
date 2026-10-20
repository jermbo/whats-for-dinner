---
title: Look stories
summary: "The user stories of the style guide in version 0.8.0: one design system of tokens and shared pieces that each screen of the plugin follows."
parent: ../README.md
updated: 2026-10-20
---

[Wiki](../../README.md) / [Features](../README.md) / Look stories

# Look stories

Each screen of the plugin sets its own sizes, spaces, and buttons. The name of a food item is 17 px in the Pantry and 21 px on a recipe card. This page lists the seven user stories of version 0.8.0 that give the plugin one design system.

## The goal of the feature

Each colour, size, space, line, corner, and motion comes from a token with a meaning. Shared pieces have the look, and a screen file has only its layout. You change a value in one place, and each screen follows. You confirm the look by eye, on the phone.

The [spec](../../initiatives/style-guide/spec.md) has the scope, and the [decision log](../../initiatives/style-guide/decision-log.md) has each decision and the options that were rejected.

## The stories

| Story                                                                                     | Persona | Depends on | Status  |
| ----------------------------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [Colour roles in the two schemes](look-colour-roles-in-the-two-schemes.md)              | Cook    | Nothing    | `built` |
| 2. [One type scale](look-one-type-scale.md)                                               | Shopper | 1          | `built` |
| 3. [Space, lines, corners, and controls](look-space-lines-corners-and-controls.md)        | Keeper  | 1          | `built` |
| 4. [Motion tokens](look-motion-tokens.md)                                                 | Keeper  | 1          | `built` |
| 5. [One button for each action](look-one-button-for-each-action.md)                       | Shopper | 2, 3       | `built` |
| 6. [Field and panel](look-field-and-panel.md)                                             | Keeper  | 2, 3       | `built` |
| 7. [List line](look-list-line.md)                                                         | Shopper | 2, 3       | `built` |

## The steps of the work

Each story changes the style blocks of many of the same screen files. Two stories that you build at the same time would change the same lines. So the steps have one story each.

1. Colour roles in the two schemes
2. One type scale
3. Space, lines, corners, and controls
4. Motion tokens
5. One button for each action
6. Field and panel
7. List line

## Architecture pages

| Page                                                  | Stories that update it                                  |
| ----------------------------------------------------- | ------------------------------------------------------- |
| Look (new)                                            | 1: the three kinds of token and the naming rule.        |
| Colour (new)                                          | 1: each role and its job.                               |
| Type (new)                                            | 2: the six steps and the line heights.                  |
| Space (new)                                           | 3: the space jobs, the lines, the corners, the heights. |
| Motion (new)                                          | 4: the tokens, the piece tokens, the Svelte transitions. |
| Pieces (new)                                          | 5: the button. 6: field and panel. 7: list line.        |
| [Settings](../../architecture/settings.md)            | 1: the accent colour replaces the role `primary`.       |
| [Code standards](../../standards/code-standards.md)   | 1: the rule "use a token, not a value".                 |

## Further reading

- [Kitchen stories](../v0.7.0/kitchen-stories.md): the stories of the layout before this version.
