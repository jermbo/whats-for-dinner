---
title: Packages stories
summary: "The user stories of one row for each package in version 0.5.0: seven pieces of work, with the sequence in which they depend on each other."
parent: ../README.md
updated: 2026-10-18
---

[Wiki](../../README.md) / [Features](../README.md) / Packages stories

# Packages stories

You have a half gallon and a new gallon of milk, each with its own date, but the pantry keeps one row with one date, and its bar moves by half a gallon. This page lists the user stories of version 0.5.0 that change that. Each story is one piece of work that one agent or one person can complete.

## The goal of the feature

Each package is one row, with its own size, its own amount left, and its own use-by date. The bar of a package is as long as the package and moves in small steps. Put away and the end of a meal keep the packages correct with no extra work.

The [spec](../../initiatives/one-row-for-each-package/spec.md) has the scope that is agreed, and each line of it names its decision. The [glossary of the initiative](../../initiatives/one-row-for-each-package/glossary.md) has the new words.

## The stories

| Story                                                                                              | Persona | Depends on | Status  |
| -------------------------------------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [Keep one row for each package](packages-keep-one-row-for-each-package.md)                      | Keeper  | Nothing    | `built` |
| 2. [See a food item in each place](packages-see-a-food-item-in-each-place.md)                      | Keeper  | Story 1    | `built` |
| 3. [Set what is left in a package](packages-set-what-is-left-in-a-package.md)                      | Keeper  | Story 2    | `built` |
| 4. [Add and use up a package](packages-add-and-use-up-a-package.md)                                | Keeper  | Story 3    | `built` |
| 5. [A meal takes from each package](packages-a-meal-takes-from-each-package.md)                    | Cook    | Story 1    | `built` |
| 6. [Put away one line for each package](packages-put-away-one-line-for-each-package.md)            | Keeper  | Story 1    | `built` |
| 7. [Keep loose food in one row](packages-keep-loose-food-in-one-row.md)                            | Keeper  | Stories 3 and 6 | `built` |
| [See the food of each place](../v0.1.0/pantry-see-the-food-of-each-place.md) (changed)            | Keeper  | Story 2    | `built` |
| [See the food that is out](../v0.1.0/pantry-see-the-food-that-is-out.md) (changed)                | Keeper  | Story 1    | `built` |
| [Correct an amount with the bar](../v0.1.0/pantry-correct-an-amount.md) (changed)                 | Keeper  | Story 3    | `built` |
| [Change a row](../v0.1.0/pantry-change-a-row.md) (changed)                                        | Keeper  | Story 4    | `built` |

The four stories of version 0.1.0 have requirements that a story of this page replaces. Each replaced line points to its new story, and they need no work of their own. The list of the Shop part does not change: it asks for the amount that the meals need, as today. The [personas](../../personas.md) page tells who the keeper and the cook are.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives four steps. The stories of one step can be built at the same time.

| Step | Stories     | What you have after the step                                                                  |
| ---- | ----------- | --------------------------------------------------------------------------------------------- |
| 1    | 1           | The column `Size`, the empty row, gallons as a volume, and out with empty rows.               |
| 2    | 2, 5, and 6 | One line for each food item in each place, meals that take from each package, and put away.  |
| 3    | 3           | A bar for each open package.                                                                  |
| 4    | 4 and 7     | "+", "−", "Add package", and "Used up" on the packages, and loose food.                       |

## Architecture pages

Each story updates the wiki pages **before** its code, in the **Elevate** step of the [workflow](../../standards/workflow.md).

| Page                                                       | Stories that update it                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Food item note](../../architecture/food-item-note.md)     | 1: the column `Size` and the empty row. 7: the property `loose`.                      |
| [Amounts](../../architecture/amounts.md)                   | 1: gallons, quarts, pints, and fluid ounces, and eighths as fractions.                |
| [Level](../../architecture/level.md)                       | 1: the full amount only for the level, and out with empty rows.                       |
| [Use soon](../../architecture/use-soon.md)                 | 1: an empty row has no date that counts. 5: the open package on the same date.        |
| [Pantry](../../architecture/pantry.md)                     | 2: one line for each food item in each place. 4: the packages in the form.            |
| [Amount bar](../../architecture/card.md)             | 3: one bar for each open package, and its steps. 4: the count of sealed packages.     |
| [End of a meal](../../architecture/end-of-a-meal.md)       | 5: a meal that takes from more than one package, and the empty row.                   |
| [Put away](../../architecture/put-away.md)                 | 6: one line for each package, and "+ package". 7: the chip "Loose".                   |
| [Facts of an item](../../architecture/put-away-facts.md)   | 6: the number of lines, the size, and the row that a line writes. 7: loose food.      |
| [Receipt](../../architecture/receipt.md)                   | 6: one row for each package.                                                          |
| [Glossary](../../glossary.md)                              | 1: package, package size, left, open package, sealed, and row. 3: step.               |

## What the vault needs

Prototype data is disposable, so the notes are reset to the new form. Before the first story, make these changes in `test-vault/Larder/`:

1. `Pantry/Milk.md`:

   ```markdown
   ---
   full: 2 gal
   low: 1/2 gal
   bought: 2026-10-14
   ---

   | Place  | Amount  | Size  | Use by     |
   | ------ | ------- | ----- | ---------- |
   | Fridge | 1/2 gal | 1 gal | 2026-10-22 |
   | Fridge | 1 gal   | 1 gal | 2026-10-29 |
   ```

2. `Pantry/Eggs.md`: keep the properties, and change `full` to `"24"`. The table:

   ```markdown
   | Place  | Amount | Size | Use by     |
   | ------ | ------ | ---- | ---------- |
   | Fridge | 2      | 12   | 2026-10-25 |
   | Fridge | 12     | 12   | 2026-11-16 |
   ```

3. A new note `Pantry/Black beans.md` with `full: 120 oz` and 8 rows in "Kitchen pantry", each with the size `15 oz`: 5 rows of `15 oz` with the date 2027-03-01, 2 rows of `15 oz` with the date 2027-06-01, and 1 row of `7.5 oz` with the date 2027-03-01.
4. A new note `Pantry/Apples.md` with no property and one row: `Fridge | 2 | | 2026-10-28`.
5. `Pantry/Flour.md` stays as it is: one row of `1000 g` with no size.
6. Two rows in the receipt `Shopping/2026-10-14.md`, below taco seasoning:

   ```markdown
   | [[Larder/Pantry/Milk\|Milk]] |  | 1 gal | 3.99 |  | Fridge | 2026-10-29 |
   | [[Larder/Pantry/Eggs\|Eggs]] |  | 12    | 3.49 |  | Fridge | 2026-11-16 |
   ```

## Further reading

- [Brands stories](brands-stories.md): the other feature of version 0.5.0.
