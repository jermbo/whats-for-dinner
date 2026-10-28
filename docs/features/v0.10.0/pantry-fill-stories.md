---
title: Pantry fill stories
summary: "The user stories of version 0.10.0 that make the first fill of the pantry fast: a form that stays open with a count, and a barcode scan."
parent: ../README.md
updated: 2026-10-27
---

[Wiki](../../README.md) / [Features](../README.md) / Pantry fill stories

# Pantry fill stories

The first fill of the pantry took the owner 2 hours for a quarter of the pantry, and beta testers called it a deal breaker. This page lists the stories of version 0.10.0 that make it fast.

## The stories

| Story                                                                | Persona | Depends on | Status  |
| -------------------------------------------------------------------- | ------- | ---------- | ------- |
| 1. [Fill a shelf in a row](pantry-fill-fill-a-shelf-in-a-row.md)     | Keeper  | Nothing    | `built` |
| 2. [Add food with a barcode](pantry-fill-add-food-with-a-barcode.md) | Keeper  | 1          | `built` |

## Architecture pages

| Page                                                   | Stories that update it                                       |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| [Pantry](../../architecture/pantry.md)                 | 1: the count and a form that stays open. 2: the scan.        |
| [Brands](../../architecture/brands.md)                 | 2: the barcode of a brand, and the photo of a product.       |
| [Food item note](../../architecture/food-item-note.md) | 2: the barcode on the line of a brand.                       |
| [Settings](../../architecture/settings.md)             | 2: "Look up barcodes online".                                |
| [Vision](../../vision.md)                              | 2: the one request that the plugin makes.                    |

## Further reading

- [Spec: pantry fill](../../initiatives/pantry-fill/spec.md): the scope that these stories come from.
- [Phone stories](phone-stories.md): the other stories of version 0.10.0.
