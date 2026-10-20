---
title: Kitchen stories
summary: "The user stories of the layout in version 0.7.0: each place of the pantry is a bin, and the top of each part stays in view."
parent: ../README.md
updated: 2026-10-19
---

[Wiki](../../README.md) / [Features](../README.md) / Kitchen stories

# Kitchen stories

On a computer, the Pantry part had much empty space, and the places were not clear. In each part, the nav and the bar went away when you scrolled. This page lists the two user stories of version 0.7.0 that change that.

## The goal of the feature

Each place of the pantry is a bin, and the bins fill the width with no empty space. The nav, the head, and the bar of each part stay at the top.

The [decision log](../../initiatives/pantry-bins/decision-log.md) has each decision and the options that were rejected.

## The stories

| Story                                                            | Persona | Depends on | Status  |
| ---------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [See each place as a bin](pantry-see-each-place-as-a-bin.md)  | Keeper  | Nothing    | `built` |
| 2. [Keep the top in view](kitchen-keep-the-top-in-view.md)       | Keeper  | Nothing    | `built` |

The two stories do not depend on each other.

## Architecture pages

| Page                                     | Stories that update it          |
| ---------------------------------------- | ------------------------------- |
| [Pantry](../../architecture/pantry.md)   | 1: the bins, and the tags of "Out". |
