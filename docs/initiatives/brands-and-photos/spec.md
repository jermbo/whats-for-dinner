---
title: "Spec: brands and photos"
summary: "The scope of the work on brands and photos: a photo for each brand of a food item, the section Brands of its note, and the brand that you bought on the receipt."
parent: decision-log.md
status: agreed
---

[Wiki](../../README.md) / [Decision log: brands and photos](decision-log.md) / Spec: brands and photos

# Spec: brands and photos

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

The shopper stands at a shelf with four taco seasonings and no keyboard. The row of the list says "Any brand: Brand A, Brand B", but the shelf shows packages, not names. The receipt does not record which brand was bought, so nothing tells which package to get next time, or what that brand cost.

## The solution

Each brand of a food item has a photo of its package. The shopper sees the photos on the row and takes the package that matches. The keeper checks the brand at put away with one tap, and the receipt keeps the brand and its price.

An example: taco seasoning has Brand A, with a photo, and Brand B, with a photo. In the store, the shopper taps the photo of Brand A and then "In cart". At home, put away starts with Brand A and the last price of Brand A. The receipt gets a row with the link to the photo of Brand A in the column `Brand`.

## In scope

1. A photo shows one brand of a food item (decision 1)
   - a. A brand has a name, a photo, or the two (decision 8)
   - b. A brand with no name shows only its photo, and you can give it a name later (decision 8)
2. You can take the photo of a brand at each moment that shows the food item (decision 2)
   - a. The first food step of setup (decision 2 a)
   - b. The open line of put away (decision 2 b)
   - c. The row of the stage Shop, with a small camera tile after the photos of its brands. A row with no brand has only the tile (decision 2 c)
   - d. The photo of the stage Shop is a new brand with no name, and it shows large with "In cart" (decisions 2 c and 16)
   - e. The form "Add food" and the form of a food item in the Pantry part. There you add a brand, give it a name, and change its photo (decision 2 d)
3. A new brand starts with a camera button, and the field for the name is optional below it (decision 3)
4. The row of the stage Shop shows the photos of the brands, small, in place of the text "Any brand: …" (decision 4)
   - a. A tap on a photo shows it large (decision 4)
   - b. The form of the Pantry part shows the photos too (decision 4)
   - c. A brand with no photo shows its name as a chip (decision 5)
5. The find field finds a food item by the name of a brand of the section "Brands" (decision 6)
6. A food item note keeps its brands in the section "Brands": one list item for each brand, and its photos on lines with an indent below it (decision 7)
   - a. The plugin writes the section "Brands" (decision 7)
   - b. The property `brands` goes (decision 7)
7. The photo of a brand is a file in the folder `Photos` of the pantry folder, such as `Larder/Pantry/Photos` (decision 9)
   - a. The plugin makes the folder with the first photo (decision 9)
   - b. The name of the file is the food item and the brand: `Taco seasoning - Brand A.jpg` (decision 10)
   - c. A brand with no name gives the date: `Taco seasoning - brand 2026-10-18.jpg` (decision 10)
   - d. A name in use gets a number, and the size is the size of a recipe photo (decision 10)
   - e. A new name of a food item or of a brand does not rename the file (decision 11)
   - f. When a brand goes, its photo stays in the folder (decision 12)
8. Put away records the brand that you bought, and it never stops you (decision 13)
   - a. The open line shows the photos of the brands, and one tap selects one (decision 13)
   - b. The brand starts from the brand of the cart task, then from the brand of the last receipt, and with one brand, from that brand (decisions 13 a and 16)
   - c. A line with no brand goes into the pantry as today (decision 13 b)
9. The receipt gets the column `Brand` (decision 13)
   - a. The cell has the link to the first photo of the brand, or the name of a brand with no photo. With no brand, the cell is empty (decisions 13 b and c)
   - b. A cell is a brand when it links to one of the photos of the brand, or when its text is the name of the brand (decision 13 d)
10. A row of the pantry has no brand (decision 14)
11. The price at put away starts from the regular price of the last receipt row with the selected brand, and then from the regular price of any brand (decision 15)
12. In the stage Shop, a tap on a photo shows it large with "In cart", and that button ticks the row with that brand (decision 16)
    - a. A tap on the row ticks it as today, with no brand (decision 16)
13. The cart task keeps the brand after the link, in the form of the cell `Brand`: `- [x] [[Taco seasoning]] · [[Taco seasoning - Brand A.jpg]]` (decision 17)

## Out of scope

1. One photo for the food item, and one photo for each purchase (decision 1)
2. A name that you must type before the photo (decision 8)
3. The names of the brands as text on the row of the stage Shop (decision 4)
4. The property `brands` with a photo that the plugin finds by its name, and a note for each brand (decision 7)
5. The photos of a brand in the folder `Photos` of the recipes folder (decision 9)
6. A rename of the file of a photo, and a delete of the file of a photo (decisions 11 and 12)
7. A put away that asks for a brand before "Put away" (decision 13)
8. The receipts written again when a brand gets a name or a new name (decision 13 c)
9. A brand on a row of the pantry, and a column `Brand` in the table of the food item note (decision 14)
10. One price for the food item, for all brands (decision 15)
11. A brand that you select only at put away (decision 16)
12. The camera only in the large photo (decision 2 c)
13. The name of a brand as text in the cart task (decision 17)

## What changes in the system

Architecture pages that change:

- [Food item note](../../architecture/food-item-note.md): the section "Brands" replaces the property `brands`, and the plugin writes that section.
- [Receipt](../../architecture/receipt.md): the column `Brand`, and the rule that finds a brand in it.
- [Shopping note](../../architecture/shopping-note.md): the brand after the link of a task.
- [Shopping](../../architecture/shopping.md): the row of the stage Shop, with the photos, the camera tile, and the large photo with "In cart".
- [Put away](../../architecture/put-away.md) and [facts of an item](../../architecture/put-away-facts.md): the brand as a sixth fact, and the price of a brand.
- [Pantry](../../architecture/pantry.md): the find field, and the brands in the form.
- [Setup](../../architecture/setup.md): the photo of a brand in the first food step.
- [End of a meal](../../architecture/end-of-a-meal.md): the folder, the name, and the size of a photo, for a brand as for a recipe.
- The wiki [glossary](../../glossary.md), the [features](../../features/README.md) page, and the [roadmap](../../features/roadmap.md).

Notes and data that get a different form:

- **The food item note** loses the property `brands` and gets the section "Brands". The plugin does not read the old property, and you move the brands into the section by hand (not confirmed). In the test vault, `Elbow pasta.md` and `Shell pasta.md` have it.
- **The folder** `Photos` of the pantry folder is new.
- **The receipt** gets the column `Brand`. The receipts of today have no such column, and they count as rows with no brand.
- **The shopping note** gets the brand after the link of a task. A task with no brand stays as today.
- **The data file** does not change.

## How you test it

Checks that need the phone:

1. In the stage Shop, a tap on the camera tile of a row opens the camera. The photo shows large with "In cart", and the cart task gets the link to the photo. (Scope 2 c, 2 d, 12, 13)
2. In the Pantry form, the camera button adds a brand with no name. The name added later shows in the section "Brands" of the note, and the photo keeps its file name. (Scope 1, 3, 7 e)
3. In the stage Shop, a row shows its photos small, a brand with no photo shows as a chip, and a tap on a photo shows it large. (Scope 4)
4. The find field finds taco seasoning when you type "brand a". (Scope 5)
5. At put away, the open line starts with the brand of the cart task, and one tap selects a different brand. The price changes to the price of that brand. (Scope 8, 11)
6. A photo from setup and a photo from put away go into `Larder/Pantry/Photos` with the names of scope 7. (Scope 2 a, 2 b, 7)
7. In Obsidian with no plugin, the section "Brands" shows each brand with its photo below it. (Scope 6)
8. The note `Next trip` with a brand in a task moves to the computer with Obsidian Sync, and put away there starts with that brand. (Scope 13)

Rules that are worth an automatic test, each with the place where a test sees the behaviour from outside:

1. **The brands of a food item.** The text of a food item note goes in. The brands come out, each with its name and its photos. (Scope 1, 6)
2. **A new brand in the note.** The text of a food item note and a brand go in. The new text of the note comes out, with the section "Brands" and the other text as it was. (Scope 6 a)
3. **The name of a photo.** A food item, a brand name or none, a day, and the names in use go in. The file name comes out. (Scope 7 b to d)
4. **The last receipt of a brand.** The texts of the receipts and the brands of a food item go in. The brand of the last receipt and the regular price of each brand come out, also after a brand got a name or a new name. (Scope 8 b, 9 b, 11)
5. **The cart.** The text of the open note goes in. Each item of the cart comes out with its brand. This is the place that exists for the open note. (Scope 13)
6. **The end of a trip.** The text of the open note and the facts of each item, with its brand, go in. The text of the receipt comes out, with the column `Brand`. This is the place that exists for the receipt. (Scope 9 a)

## Further reading

- [Glossary: brands and photos](glossary.md): the words of this page.
