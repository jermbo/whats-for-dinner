---
title: Glossary
summary: 'The words of shopping. Each word has one meaning.'
parent: README.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Shopping](README.md) / Glossary

# Glossary

The screens, the code, and these pages use the same words. Each word has one meaning. A word that is a link has a page that explains it.

| Word                                    | Meaning                                                                                                | Example                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------- |
| [Ingredient](ingredient-and-product.md) | The food as a recipe and the pantry see it.                                                            | Taco seasoning         |
| Product                                 | One exact item on a shelf. It is one ingredient.                                                       | Brand B taco seasoning |
| Package                                 | One unit of a product, as the store sells it.                                                          | One bag of rice        |
| Package size                            | The quantity in one package, in the unit of the ingredient.                                            | 1000 g                 |
| Shopping list                           | The ingredients that the menu needs and the pantry does not have, plus the items that you add by hand. | Rice, limes, soap      |
| [Needed](item-journey.md)               | The state of an item that is on the list and not in the cart.                                          |                        |
| [Cart](in-the-store.md)                 | The items that you took in the store and did not put away.                                             |                        |
| [Put away](put-away.md)                 | The step at home that moves an item from the cart into the pantry.                                     |                        |
| [Purchase](data-model.md)               | The record of one item in one trip.                                                                    | Rice, 3 October, 2.49  |
| [Trip](prices-and-trips.md)             | One visit to a store: from the first tap until the cart is empty.                                      |                        |
| Last price                              | The price of the newest purchase of a product.                                                         | 2.49                   |
| [Photo](photo-capture.md)               | The picture of one product. You take it with the phone.                                                |                        |
| [Blob](photo-storage.md)                | A block of bytes with a type. A photo in the database is a blob.                                       |                        |

## Words that we do not use

| Not this            | But this                 | Reason                                                        |
| ------------------- | ------------------------ | ------------------------------------------------------------- |
| Bought              | In the cart, or put away | "Bought" does not tell which of the two steps is done.        |
| Item, for a product | Product                  | "Item" is a row on the list. It can be an ingredient or soap. |
| Stock, for the cart | Pantry                   | Only the pantry is stock.                                     |

## Further reading

- [Choose a product](choose-product.md): ingredients and products in use.
- [Backup](backup.md): where all of these records go in one file.
