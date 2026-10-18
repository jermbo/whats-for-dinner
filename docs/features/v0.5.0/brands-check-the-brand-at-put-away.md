---
title: Check the brand at put away
summary: "At put away, the open line shows the brands of the item with one selected, the keeper corrects it with one tap, and the receipt keeps it."
parent: brands-stories.md
persona: Keeper
depends-on: [brands-see-the-brands-as-photos.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Brands stories](brands-stories.md) / Check the brand at put away

# Check the brand at put away

As the [keeper](../../personas.md), I want put away to show the brand that I bought already selected, and to correct it with one tap, so that the receipt keeps the brand and nothing stops me.

## Requirements

1. The open line of put away shows the brands of its food item, as the row of the stage Shop does
   - a. The selected brand has a ring in the accent colour. The ring moves to a new brand with a short slide. With "Reduce motion", it moves with no motion
   - b. One tap on a brand selects it
   - c. A tap on the selected brand takes the selection off
   - d. An item with no brand, or that is not in the pantry, shows no brands
2. The closed line shows the selected brand small, before the name of the item
3. The brand starts from the first of these that has a brand
   - a. The brand of the task in the cart: the link or the text after ` · `
   - b. The brand of the last receipt of the item
   - c. The only brand of the food item
   - d. With none of them, the line has no brand
4. A brand is the brand of a cell, or of a task, with the rule of [bought brand](../../initiatives/brands-and-photos/glossary.md)
   - a. The cell links to one of the photos of the brand
   - b. Or the text of the cell is the name of the brand. Capital letters and small letters are equal
   - c. A cell that is no brand of the food item counts as no brand
5. The receipt has the column `Brand`, after the column `Item`
   - a. The cell has the link to the first photo of the selected brand
   - b. A brand with no photo gives its name
   - c. With no brand, the cell is empty
   - d. In the active receipt, the cell changes with each tap on a brand
   - e. A receipt with no column `Brand` counts as a receipt with no brand
6. The brand never stops "Put away" or "Put away 9 known"
   - a. A line with no brand goes into the pantry as today
   - b. A known item goes with the brand that it starts with
7. The row of the pantry gets no brand. The table of the food item note is as today

## Acceptance criteria

Each criterion starts with the vault of the [list page](brands-stories.md#what-the-vault-needs), and taco seasoning in the cart.

1. GIVEN the task of taco seasoning ends with `· [[Taco seasoning - Brand B.jpg]]` WHEN the keeper opens its line THEN Brand B is selected
2. GIVEN the task of taco seasoning has no brand WHEN the keeper opens its line THEN Brand A is selected, from the receipt `2026-10-14`
3. GIVEN no receipt has taco seasoning and the task has no brand WHEN the keeper opens its line THEN no brand is selected
4. GIVEN the section "Brands" of elbow pasta has only "Store brand", and no receipt has elbow pasta WHEN the keeper opens the line of elbow pasta THEN "Store brand" is selected
5. GIVEN Brand A is selected on the line of taco seasoning WHEN the keeper taps the chip "Brand C" THEN Brand C is selected
   - a. AND the cell `Brand` of the active receipt is `Brand C`
6. GIVEN Brand A is selected WHEN the keeper taps Brand A THEN no brand is selected
   - a. AND the cell `Brand` of the active receipt is empty
7. GIVEN Brand A is selected WHEN the keeper taps "Put away" THEN the row of the receipt has `[[Taco seasoning - Brand A.jpg]]` in the column `Brand`
   - a. AND the table of `Taco seasoning.md` has no column `Brand`
8. GIVEN a receipt has `brand a` in the column `Brand` of taco seasoning, and it is the last receipt WHEN the keeper opens the line THEN Brand A is selected
9. GIVEN no brand is selected WHEN the keeper taps "Put away" THEN taco seasoning goes into the pantry
   - a. AND the cell `Brand` of its row is empty
10. GIVEN the line of taco seasoning is closed with Brand A WHEN the keeper looks at the line THEN it shows the photo of Brand A, small, before "Taco seasoning"
11. GIVEN the cart has batteries WHEN the keeper opens the line of batteries THEN the line shows no brands

## Depends on

- [See the brands of a food item as photos](brands-see-the-brands-as-photos.md): the brands that the line shows. A task with a brand can be typed by hand, so this story does not need [Put a brand in the cart](brands-put-a-brand-in-the-cart.md).

## Architecture

- [Put away](../../architecture/put-away.md): the open line and the two actions.
- [Facts of an item](../../architecture/put-away-facts.md): what the plugin fills in, now with the brand.
- [Receipt](../../architecture/receipt.md): the column `Brand`.
- [Shopping note](../../architecture/shopping-note.md): the task, with the brand after the link.
- [Spec: brands and photos](../../initiatives/brands-and-photos/spec.md): scope 8, 9, and 10.
