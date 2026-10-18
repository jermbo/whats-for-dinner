---
title: Brands stories
summary: "The user stories of brands and photos in version 0.5.0: seven pieces of work, with the sequence in which they depend on each other."
parent: ../README.md
---

[Wiki](../../README.md) / [Features](../README.md) / Brands stories

# Brands stories

In the store, you look for a package, but the list gives you a name. And no receipt tells which brand you bought. This page lists the user stories of version 0.5.0 that change that. Each story is one piece of work that one agent or one person can complete.

## The goal of the feature

Each brand of a food item has a photo of its package, in the section "Brands" of its note. The shopper sees the photos on the row and takes the package that matches. The keeper checks the brand at put away with one tap, and the receipt keeps the brand and its own price.

The [spec](../../initiatives/brands-and-photos/spec.md) has the scope that is agreed, and each line of it names its decision. The [glossary of the initiative](../../initiatives/brands-and-photos/glossary.md) has the new words.

## The stories

| Story                                                                                       | Persona | Depends on      | Status  |
| ------------------------------------------------------------------------------------------- | ------- | --------------- | ------- |
| 1. [See the brands of a food item as photos](brands-see-the-brands-as-photos.md)            | Shopper | Nothing         | `ready` |
| 2. [Add a brand with the camera](brands-add-a-brand-with-the-camera.md)                     | Keeper  | Story 1         | `ready` |
| 3. [Put a brand in the cart](brands-put-a-brand-in-the-cart.md)                             | Shopper | Story 1         | `ready` |
| 4. [Take a photo of a new brand in the store](brands-take-a-photo-in-the-store.md)          | Shopper | Stories 2 and 3 | `ready` |
| 5. [Check the brand at put away](brands-check-the-brand-at-put-away.md)                     | Keeper  | Story 1         | `ready` |
| 6. [Each brand has its own price](brands-each-brand-has-its-own-price.md)                   | Keeper  | Story 5         | `ready` |
| 7. [Take a photo of a brand at put away](brands-take-a-photo-at-put-away.md)                | Keeper  | Stories 2 and 5 | `ready` |
| [Find a food item](../v0.1.0/pantry-find-a-food-item.md) (changed)                          | Shopper | Story 1         | `built` |
| [Change a row](../v0.1.0/pantry-change-a-row.md) (changed)                                  | Keeper  | Story 1         | `built` |

The two stories of version 0.1.0 read the brands from the property `brands`. Story 1 changes that to the section "Brands", and each of them now points to story 1. They need no work of their own. The [personas](../../personas.md) page tells who the shopper and the keeper are.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives three steps. The stories of one step can be built at the same time.

| Step | Stories        | What you have after the step                                                                         |
| ---- | -------------- | ---------------------------------------------------------------------------------------------------- |
| 1    | 1              | The section "Brands", with the photos on the row of the stage Shop and in the Pantry form.           |
| 2    | 2, 3, and 5    | A brand that you add with the camera, a brand in the cart, and the brand on the receipt.             |
| 3    | 4, 6, and 7    | A new brand from the store and from put away, and a price for each brand.                            |

## Architecture pages

Each story updates the wiki pages **before** its code, in the **Elevate** step of [implement](../../standards/workflow.md).

| Page                                                                 | Stories that update it                                                                  |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Food item note](../../architecture/food-item-note.md)               | 1: the section "Brands" replaces the property `brands`. 2: the plugin writes the section. |
| [Pantry](../../architecture/pantry.md)                               | 1: the find field and the brands in the form. 2: the camera button in the form.        |
| [Shopping](../../architecture/shopping.md)                           | 1: the photos on the row. 3: the large photo with "In cart". 4: the camera tile.        |
| [Shopping note](../../architecture/shopping-note.md)                 | 3: the brand after the link of a task.                                                  |
| [Put away](../../architecture/put-away.md)                           | 5: the brand on the open line. 7: the camera tile on the open line.                    |
| [Facts of an item](../../architecture/put-away-facts.md)             | 5: where the brand starts. 6: the price of a brand.                                     |
| [Receipt](../../architecture/receipt.md)                             | 5: the column `Brand`, and the rule that finds a brand in it.                           |
| [Setup](../../architecture/setup.md)                                 | 2: the photo of a brand in the step "First food".                                       |
| [End of a meal](../../architecture/end-of-a-meal.md)                 | 2: the folder, the name, and the size of a photo, for a brand as for a recipe.          |
| [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md)   | 2: the folder `Photos` of the pantry folder.                                            |
| [Glossary](../../glossary.md)                                        | 1: brand, brand photo, and brands section. 5: bought brand.                             |

## What the vault needs

The test vault has no taco seasoning in `Larder/Pantry`, no photo of a brand, and no receipt. Before the first story, make these changes in `test-vault/`:

1. Copy `_old/Pantry/Taco seasoning.md` to `Larder/Pantry/`. Change its place "Kitchen" to "Kitchen pantry", and replace the property `brands` with this section, below the table:

   ```markdown
   ## Brands

   - Brand A
     ![[Taco seasoning - Brand A.jpg]]
   - Brand B
     ![[Taco seasoning - Brand B.jpg]]
   - Brand C
   ```

2. Put two photos of a package, with the names `Taco seasoning - Brand A.jpg` and `Taco seasoning - Brand B.jpg`, into `Larder/Pantry/Photos/`.
3. In `Larder/Pantry/Elbow pasta.md`, replace the property `brands` with this section, below the table:

   ```markdown
   ## Brands

   - Brand A
   - Store brand
   ```

   Do the same in `Shell pasta.md` with its own brands.
4. Add the task `- [ ] [[Larder/Pantry/Taco seasoning|Taco seasoning]]` to `Larder/Shopping/Next trip.md`, so that the stage Shop has a row of taco seasoning.
5. For stories 5 and 6, make three receipts in `Larder/Shopping/`. Each has `status: complete`, its date, and `store: Market A`:

   | Note            | The row of taco seasoning                                                                                                    |
   | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
   | `2026-10-04.md` | `[[Larder/Pantry/Taco seasoning\|Taco seasoning]]`, Brand `[[Taco seasoning - Brand B.jpg]]`, 1 bag, 1.99, Kitchen pantry     |
   | `2026-10-11.md` | `[[Larder/Pantry/Taco seasoning\|Taco seasoning]]`, Brand `[[Taco seasoning - Brand A.jpg]]`, 1 bag, 2.49, Kitchen pantry     |
   | `2026-10-14.md` | `[[Larder/Pantry/Taco seasoning\|Taco seasoning]]`, Brand `[[Taco seasoning - Brand A.jpg]]`, 1 bag, 1.79, Sale `yes`, Kitchen pantry |

   The columns are `Item`, `Brand`, `Amount`, `Price`, `Sale`, `Place`, and `Use by`.

The plugin does not read the old property `brands`, so a note that you do not change shows no brand. This line of the spec is not confirmed.

## The form of a story

Each story has the form that the [user story](../../standards/user-story.md) page gives.

## Further reading

- [Workflow](../../standards/workflow.md): where the stories come from, and what occurs after them.
- [Decision log: brands and photos](../../initiatives/brands-and-photos/decision-log.md): the reasons behind the spec.
