---
title: Pantry stories
summary: "The user stories of the simple pantry in version 0.6.0: a level or a count for each package, one card with a bar that you drag, meals that take from the open package, brand verdicts, and a weekly audit."
parent: ../README.md
updated: 2026-10-19
---

[Wiki](../../README.md) / [Features](../README.md) / Pantry stories

# Pantry stories

The pantry has many rules, and on the phone it is hard to use. Two gallons show as one, the form has eleven fields, and you type each unit. This page lists the user stories of version 0.6.0 that make the pantry simple. They replace the unit system and the drag in round steps of the first units work, and the [units stories](units-stories.md) keep the rest.

## The goal of the feature

Each package has a level or a count. One card with one bar shows all packages of a food item, and you drag a package to what you see. A meal takes from the open package first. Once a week, the audit walks each place, and you confirm or correct each food item.

The [spec](../../initiatives/simple-pantry/spec.md) has the scope that is agreed, and each line of it names its decision.

## The stories

| Story                                                                     | Persona | Depends on       | Status  |
| ------------------------------------------------------------------------- | ------- | ---------------- | ------- |
| 1. [Keep a level or a count](pantry-keep-a-level-or-a-count.md)           | Keeper  | Nothing          | `built` |
| 2. [Give a brand a verdict](pantry-give-a-brand-a-verdict.md)             | Shopper | Nothing          | `built` |
| 3. [See all packages on one bar](pantry-see-all-packages-on-one-bar.md)   | Keeper  | Story 1          | `built` |
| 4. [Take a meal from the open package](pantry-take-a-meal-from-the-open-package.md) | Cook | Story 1    | `built` |
| 5. [Put away a package](pantry-put-away-a-package.md)                     | Keeper  | Story 1          | `built` |
| 6. [Drag a package on the card](pantry-drag-a-package-on-the-card.md)     | Keeper  | Story 3          | `built` |
| 7. [Add a package](pantry-add-a-package.md)                               | Keeper  | Story 6          | `built` |
| 8. [Set the place and the date](pantry-set-the-place-and-the-date.md)     | Keeper  | Story 6          | `built` |
| 9. [Set the package size with a chip](pantry-set-the-package-size-with-a-chip.md) | Keeper | Story 6     | `built` |
| 10. [Add new food to the pantry](pantry-add-new-food-to-the-pantry.md)    | Keeper  | Stories 7 and 9  | `built` |
| 11. [Audit the pantry each week](pantry-audit-the-pantry-each-week.md)    | Planner | Stories 4 and 6  | `built` |

The [personas](../../personas.md) page tells who the keeper, the shopper, the cook, and the planner are.

## The sequence of the work

1. Stories 1 and 2. Story 1 is the new note, and each other story reads it. Story 2 touches only the brands.
2. Stories 3, 4, and 5. Each one reads the note of story 1, and none needs another.
3. Story 6: the card.
4. Stories 7, 8, and 9. Each one adds a part to the card.
5. Stories 10 and 11.

## Architecture pages

Each story updates the wiki pages **before** its code, in the **Elevate** step of the [workflow](../../standards/workflow.md).

| Page                                                     | Stories that update it                                   |
| -------------------------------------------------------- | -------------------------------------------------------- |
| [Food item note](../../architecture/food-item-note.md)   | 1: the column `Left`, and fewer properties. 11: `check`. |
| [Level](../../architecture/level.md)                     | 1: the level of a package, and the rule for low.         |
| [Amounts](../../architecture/amounts.md)                 | 1: no unit system. 9: the unit list.                     |
| [Pantry](../../architecture/pantry.md)                   | 3: the bar. 6: the card. 10: "Add to pantry".            |
| [Card](../../architecture/card.md)           | 6: replaced by a page "Card".                            |
| [End of a meal](../../architecture/end-of-a-meal.md)     | 4: the open package first, rounding, and "to check".     |
| [Put away](../../architecture/put-away.md)               | 5: a package that is full.                               |
| [Brands](../../architecture/brands.md)                   | 2: the verdict.                                          |
| [Settings](../../architecture/settings.md)               | 1: no setting "Units" and no low percentage. 11: the audit. |
| A new page "Audit"                                       | 11.                                                      |
| [Glossary](../../glossary.md)                            | 1: level, low, out. 6: card, handle. 11: audit.          |

## What the vault needs

Prototype data is disposable, so the notes are reset to the new form. Before story 1 is tested, make these changes in `test-vault/Larder/Pantry/`. Remove the properties `full`, `low`, and `loose` from each note. The other properties stay.

| Note                 | The table                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Milk.md`            | `Fridge \| 1/4 \| 1 gal \| 2026-10-22` and `Fridge \| full \| 1 gal \| 2026-10-29`                                   |
| `Eggs.md`            | `Fridge \| 4 \| 12 \| 2026-10-25` and `Fridge \| 12 \| 12 \| 2026-11-16`                                             |
| `Black beans.md`     | In "Kitchen pantry": 5 rows `full \| 425 g \| 2027-03-01`, 2 rows `full \| 425 g \| 2027-06-01`, and `1/2 \| 425 g \| 2027-03-01` |
| `Flour.md`           | `Kitchen pantry \| full \| 1 kg \|`                                                                                 |
| `Sugar.md`           | `Kitchen pantry \| 1/4 \| 1 kg \|`                                                                                  |
| `Onions.md`          | `Kitchen pantry \| 1/2 \| 1 kg \|`                                                                                  |
| `Apples.md`          | `Fridge \| 2 \| 6 \| 2026-10-28`                                                                                    |
| `Water.md`           | `Kitchen pantry \| tap \| \|`                                                                                       |
| `Butter.md`          | `Fridge \| full \| 290 g \| 2026-11-20`                                                                            |
| `Shell pasta.md`     | `Kitchen pantry \| full \| 500 g \|`                                                                                |
| Each other note      | Each row gets `full` in `Left`. Its `Size` is the old size, or the old amount when the row had no size. An empty row goes out. |

The columns are `Place | Left | Size | Use by`. The settings of the plugin keep the places "Kitchen pantry", "Fridge", and "Freezer".
