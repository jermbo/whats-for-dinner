---
title: Pantry scan stories
summary: "The user stories of version 0.11.0 that make a scan fast: the form fills in each fact, asks only for the use-by date, and opens the camera by itself after \"Correct\"."
parent: ../README.md
updated: 2026-11-01
---

[Wiki](../../README.md) / [Features](../README.md) / Pantry scan stories

# Pantry scan stories

The scan of version 0.10.0 found the product of a barcode, but the keeper still tapped the food item, the count, the place, and "Add". On Android, the keeper also tapped a button to open the camera, because Obsidian gives no live view there, and after each add the form waited for the note. These stories make the scan fast: the form fills in each fact, the only question is the use-by date, and after "Correct" the camera comes back at once. The [decision log](../../initiatives/pantry-fill/decision-log.md) of the pantry fill has the reasons, in decisions 6, 7, 11, 12, 14, 15, and 16.

## The stories

| Story                                                                                | Persona | Depends on | Status  |
| ------------------------------------------------------------------------------------ | ------- | ---------- | ------- |
| 1. [Check and add a package](pantry-scan-check-and-add-a-package.md) | Keeper  | Nothing    | `built` |
| 2. [Open the camera at once](pantry-scan-open-the-camera-at-once.md)                 | Keeper  | Story 1    | `built` |
| 3. [Scan the next can with no wait](pantry-scan-scan-the-next-can-with-no-wait.md)   | Keeper  | Story 1    | `built` |

## The test data

The criteria use these notes of the test vault. The [check list](../../../test-vault/Pantry%20scan%20check%20list.md) of these stories tells how to test each one on the phone.

- "Black beans" has 2 full cans of 425 g in "Kitchen pantry", and no barcode on a brand.
- "Diced tomatoes" has 1 full can of 411 g in "Kitchen pantry".
- The places are "Kitchen pantry", "Fridge", and "Freezer".

The criteria with a barcode need a can of Bush's Best Black Beans, or a different can that Open Food Facts knows.

## Architecture pages

| Page                                   | Stories that update it                                         |
| -------------------------------------- | -------------------------------------------------------------- |
| [Pantry](../../architecture/pantry.md) | 1: the last step with its facts and dates. 2: the open camera. 3: the writes behind the scan. |
| [Brands](../../architecture/brands.md) | 1: the product fills in the facts of the last step, with the size in grams. |

## Further reading

- [Pantry fill stories](../v0.10.0/pantry-fill-stories.md): the count, the form that stays open, and the first scan.
- [Occasion stories](occasion-stories.md): the other stories of version 0.11.0.
