---
title: The parts of the screen
summary: 'The sizes of the buttons, chips, gauges, and badges, and why each size is what it is.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / The parts of the screen

# The parts of the screen

A small set of parts builds each screen. Each part has one size, so that a finger always knows where to land.

## The problem

You press with a thumb, and the thumb is often wet. A small target is a missed tap. But a screen with only large targets has no room for information. So each part has a visible size, and a hit area that can be larger.

## The parts

| Part    | Size                     | Rule                                                                                 |
| ------- | ------------------------ | ------------------------------------------------------------------------------------ |
| Button  | 50 px high               | The main button is ink. The quiet button is white with a rule. "Not this" is a link. |
| Chip    | 32 px high, 44 px to hit | A filter. When it is on, it is ink with a check.                                     |
| Gauge   | 14 px high               | A track of paper with an ink fill. Below the low line, the fill is amber.            |
| Badge   | One line of label text   | "Use first" is tomato. "Low" is amber. A number of days is outlined.                 |
| Sticker | One line of label text   | A state flag. It sits on an edge. The corner radius is 2 px.                         |

## How a gauge works

The track is the full amount. The fill is what you have. An empty gauge has no fill, and its track is drawn with ticks, so that "none" does not look like a gauge that did not load. You can slide a gauge to change the level, or you can tap it.

## Rules and radii

Rules are lines of 1, 4, and 8 px. A thin rule divides rows. A rule of 4 px sits under a title. A rule of 8 px closes a heading on a facts panel.

A card has a radius of 12 px. A button and a field have a radius of 8 px. A sticker has a radius of 2 px. Nothing is a pill, and nothing is a circle, except a dot.

## Further reading

- [The Today screen](today-screen.md): the parts used together.
