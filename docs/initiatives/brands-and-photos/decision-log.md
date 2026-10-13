---
title: "Decision log: brands and photos"
summary: "The state of today and the questions to start with, for the brand of an item that you buy and for the photos of the kitchen."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: brands and photos

# Decision log: brands and photos

A receipt tells that you bought taco seasoning, but not which brand. And no item of the kitchen has a photo that shows what to look for on the shelf. This page has the state of today and the questions to start with. The discussion did not start, so the page has no decision.

## Why the brands and the photos are one subject

The first app had one answer for the two: the product. A product was one exact item on a shelf, with a brand, a photo, a package size, and its own last price. In a vault, a photo is a file, and a file needs a name and a folder. So a product needs the answers about photos first. The same answers hold for the photos of a recipe and of its steps.

## The brands and the photos today

| Part                       | The plugin today                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| The brands of a food item  | A list of text in the property `brands` of its note.                                                         |
| Where a brand shows        | On a row of the list, as "Any brand: Brand A, Brand B", and in the Pantry. The find field finds a brand too. |
| The brand that you bought  | No record. A row of the pantry has no brand, and put away does not ask.                                      |
| The photo of an item       | None.                                                                                                        |
| The photo of a cooked meal | One photo at the end of Cook Mode. The plugin makes it small: its longest side is 1600 pixels or less.       |
| The name of that photo     | The name of the recipe and the date, such as `Tacos 2026-10-12.jpg`.                                         |
| The folder of that photo   | The folder that Obsidian uses for attachments. It is not a folder of the plugin.                             |
| The photo of a step        | None.                                                                                                        |

## What the first app did

The first app is in the folder `_archive/`.

| Part                   | The first app                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| A product              | One exact item on a shelf: its ingredient, a name, a package size, a photo, and an optional barcode.    |
| In the store           | The row of an ingredient showed the photos of its products. A tap on a photo selected the product.      |
| A new product          | At home, you took a photo of the package, and you typed the package size one time.                      |
| The last price         | Each product had its own.                                                                               |
| A photo of a product   | The app made it small, about 60 KB, and kept it in its database.                                        |
| The photos of a recipe | One photo for each cooked meal, with one of them as the cover. A step kept three photos and showed one. |

## Questions to start with

The brand:

1. How do you tell the plugin which brand you bought, with one hand and no keyboard?
2. What occurs with a brand that is new?
3. How does the pantry show one food item from two brands, such as two bags of taco seasoning?
4. Does each brand have its own last price?
5. Is a brand a text in a property, or a note of its own that a line links to?
6. Is a brand only a fact of a purchase, or also a way to put the items in groups?

The photos:

7. In which moment do you take the photo of an item: in the store, at put away, or in the Pantry?
8. Which name does a photo get? The name must come from the context, such as the item and its brand, or the recipe and its step.
9. Which folder has the photos? It must be a folder of the settings, apart from the other photos of the vault.
10. How small does the plugin make a photo?
11. Do a recipe and its steps get photos with the same rules?
12. What occurs with a photo when its item or its recipe gets a new name, or is gone?

## What the shopping list gives to this work

The [shopping list](../shopping-list/decision-log.md) records each purchase as one line of a receipt, with a link to the note of its item. A line has no brand. The form of the receipt has room for one more fact on a line.

## Decisions

No decision is made.

## Further reading

- [Workflow](../../standards/workflow.md): the step of the work that this page is in.
