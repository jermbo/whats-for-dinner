---
title: Pantry gaps
summary: 'What the Pantry screen of the design has that the app does not, and the seven steps that add it.'
parent: gap-plan.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / [Gap plan](gap-plan.md) / Pantry gaps

# Pantry gaps

You open Pantry with two questions: what must I use, and what must I buy? The design answers both on the first screen. The app shows a list by place, and you must find the answers yourself.

The images are `pantry-mobile-01` to `03` and `pantry-desktop-01` to `04` in `docs/inspiration/`.

## The design and the app

| Part        | The design                                                     | The app on 4 October 2026                            |
| ----------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| Title       | "2 low, 1 out" next to the title                               | No counts                                            |
| Views       | Place, Low first, Use soon                                     | Place only, sorted by name                           |
| Row         | A tick at the low line. A badge: "Use today", "2 days"         | No tick, no badge. Amber starts at one fixed level   |
| To Shop     | "Add 12 to Shop": one button for all items below the line      | No link from Pantry to Shop                          |
| Item detail | "Used in" with the night, History, "Used up", "Add to Shop"    | An exact number, the place, "Used up", "Thrown away" |
| Edit        | A long press opens the row in ink, with a scale                | A slide on the row                                   |
| Add         | A card: name, place, and a slide for the amount                | A form in a closed block at the end of the page      |
| Desktop     | Two columns of places. A side column: Use soon, Below the line | One grid, no side column                             |

## The steps

1. **The low line.** Each item has a low line. The row shows it as a tick, and the fill is amber below it.
2. **The counts and "Low first".** The title shows the low and the out items. The view puts out first, then low, then enough.
3. **"Add to Shop".** One button sends each item below the line to the shopping list. The row in Shop tells the reason: "Low in the pantry".
4. **The use-by date.** A food has a usual number of days. The row shows a badge in the last three days. The "Use soon" view has three groups: Today, This week, Keeps.
5. **The item detail.** It shows the meals that use the item, and the history of its changes. The app keeps this history, but no screen shows it.
6. **The add card.** It opens in its place, and the list stays in view behind it.
7. **The desktop columns.** The side column answers the two questions. A click on a row puts its detail there.

Step 1 and step 4 change the database. The other steps change only the screens.

## What stays

Scan, Pantry check, and the search "Do I have this?" are not in the design. All three stay on the screen, in view, and they get the look of the design: square buttons with a rule, and a field as the "Add an item" field of the desktop image. Step 2 gives them their place in the title row.

## Further reading

- [The parts of the screen](parts.md): the gauge and the badge that these steps use.
- [Put away](../shopping/put-away.md): where most items come into the pantry.
