---
title: Cook stories
summary: "The user stories of Cook Mode in version 0.9.0: a way out from the first page, and no timer that stops with no warning."
parent: ../README.md
updated: 2026-10-21
---

[Wiki](../../README.md) / [Features](../README.md) / Cook stories

# Cook stories

On the first page of Cook Mode, "Back" does nothing, and "Exit" stops each timer with no question. This page lists the user story of version 0.9.0 that fixes the two.

## The stories

| Story                                         | Persona | Depends on | Status  |
| --------------------------------------------- | ------- | ---------- | ------- |
| 1. [Leave Cook Mode](cook-leave-cook-mode.md) | Cook    | Nothing    | `built` |

## Architecture pages

| Page                                         | Stories that update it                          |
| -------------------------------------------- | ----------------------------------------------- |
| [Cook Mode](../../architecture/cook-mode.md) | 1: "Back" on "Get out" closes Cook Mode.        |
| [Timers](../../architecture/timers.md)       | 1: the question before a running timer stops.   |

## Further reading

- [Plan stories](plan-stories.md): the other stories of this version.
