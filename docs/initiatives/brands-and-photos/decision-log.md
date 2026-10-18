---
title: "Decision log: brands and photos"
summary: "The state of today and the questions to start with, for the brand of an item that you buy and for the photos of the kitchen."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: brands and photos

# Decision log: brands and photos

A receipt tells that you bought taco seasoning, but not which brand. And no item of the kitchen has a photo that shows what to look for on the shelf. This page records each decision about the [brands](glossary.md) and the photos of the food items, and the reason for it.

The goal of the owner: you use different taco seasonings. You take a photo of the brands that you bought, so that you know which package to get.

## Why the brands and the photos are one subject

The first app had one answer for the two: the product. A product was one exact item on a shelf, with a brand, a photo, a package size, and its own last price. In a vault, a photo is a file, and a file needs a name and a folder. So a product needs the answers about photos first. Version 0.4.0 gave these answers for the photos of a recipe. This work starts from them.

## The brands and the photos today

| Part                       | The plugin today                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| The brands of a food item  | A list of text in the property `brands` of its note. You type it in the note. No screen of the plugin changes it.      |
| Where a brand shows        | On a row of the list, as "Any brand: Brand A, Brand B", and in the form of the Pantry. The find field finds a brand.   |
| The brand that you bought  | No record. A row of the pantry and a row of the receipt have no brand, and put away does not ask.                      |
| The photo of an item       | None.                                                                                                                  |
| The photos of a recipe     | A source photo, a step photo, and the photo of a meal.                                                                 |
| The folder of those photos | The folder `Photos` of the recipes folder, such as `Recipes/Photos`. The plugin makes it with the first photo.         |
| The name of a photo        | From the context: `Chicken curry - step 3 2026-10-11.jpg`. A name in use gets a number.                                |
| The size of a photo        | A JPEG with its longest side 1600 pixels or less, about 1 MB. A smaller photo keeps its size. The location goes.       |
| The code that saves it     | `shrinkPhoto` and `savePhoto` take a photo of the camera, make it small, and write it. They know only recipe photos.   |

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

## What the shopping list gives to this work

The [shopping list](../shopping-list/decision-log.md) records each purchase as one line of a receipt, with a link to the note of its item. A line has no brand. The form of the receipt has room for one more fact on a line.

## Decisions

### What a photo shows

1. **A photo shows one brand of a food item.** Taco seasoning has Brand A and Brand B, and each brand has its own photo. The reason: the goal is to know which brand to get, and the shelf has more than one. Two options were rejected: one photo for the food item, which cannot tell two seasonings apart, and one photo for each purchase, which gives a new photo of the same package at each trip.

### When you take a photo

2. **You can take the photo of a brand at each moment that shows the food item.** Each moment has its own reason:
   - a. In the first food step of [setup](../../architecture/setup.md), you verify: the packages are in the cupboard in front of you.
   - b. At [put away](../../architecture/put-away.md), you double check: the package that you bought is in your hand.
   - c. In the store, you see what you want, and a new brand on the shelf can get its photo there.
   - d. In the Pantry, in the form of "Add food" and in the form that opens with a tap on a food item. This is the main place to add a brand, to give it a name, and to change its photo later.

   An option that was rejected: only put away and the Pantry form. The reason: the owner wants no moment where a photo is not possible.

3. **A new brand starts with a camera button.** The photo comes first, and the field for the name is optional below it. The reason: with decision 8, a brand needs no name, so the camera is the one tap that matters.

### Where a photo shows

4. **The row of the Shop list shows the photos of the brands, small, in place of the text "Any brand: …". A tap on a photo shows it large. The form of the Pantry shows them too.** The reason: in the store, you look for a package, not for a name. An option that was rejected: the names of the brands only, as today.

5. **A brand with no photo shows its name as a chip,** in the place of a photo. The reason: a brand that you typed by hand must still show.

6. **The find field still finds a food item by a brand.** It reads the names of the section "Brands". The reason: in the store you can type "brand c", as today.

### Where a brand is kept

7. **A food item note keeps its brands in a section "Brands": one list item for each brand, with its photos on lines with an indent below it.** This is the form of a [step photo](../../architecture/steps.md). The property `brands` goes. The reason: in Obsidian you see each brand with its photo with no plugin, and the plugin reads one form for the two kinds of photos. Two options were rejected: the property `brands` with a photo that the plugin finds by its name, because a new name of a brand breaks the connection; and a note for each brand, because that is many small notes. This changes the [food item note](../../architecture/food-item-note.md): the plugin writes the section "Brands", and not only the table and the properties.

   ```markdown
   ## Brands

   - Brand A
     ![[Taco seasoning - Brand A.jpg]]
   - Brand B
   ```

8. **A brand can have a photo and no name.** In the store, with one hand, you take the photo and type nothing. A brand with no name shows only its photo, and you can give it a name later. The reason: the shopper has no keyboard. An option that was rejected: a name before the photo.

### The file of a photo

9. **The photo of a brand goes into the folder `Photos` of the pantry folder,** such as `Larder/Pantry/Photos`. The plugin makes the folder with the first photo. The reason: the plugin home keeps it, as the recipes folder keeps the photos of a recipe. So a delete of the home takes the photos with it. An option that was rejected: the folder `Photos` of the recipes folder, which is not in the home.

10. **The name of the photo is the food item and the brand:** `Taco seasoning - Brand A.jpg`. A brand with no name gives the date: `Taco seasoning - brand 2026-10-18.jpg`. A name in use gets a number. The size is the size of a recipe photo. The reason: you type no name, and the name tells where the photo belongs, as for a [recipe photo](../../architecture/end-of-a-meal.md).

11. **A new name of a food item or of a brand does not rename the photo.** The link in the note stays correct, so the photo stays with its brand. The reason: the link is the connection, not the name of the file.

12. **When a brand goes, its photo stays in the folder.** The reason: the plugin deletes no file of yours.

### The brand that you bought

13. **Put away records the brand that you bought, but it never stops you.** The open line shows the photos of the brands, and one tap selects one. The receipt gets the column `Brand`. The reason: put away is the moment to double check, with the package in your hand. An option that was rejected: put away that asks for a brand before "Put away".
   - a. The plugin selects the brand for you: the brand of the last receipt of the item. With one brand, that brand.
   - b. A line with no brand goes into the pantry as today, and its cell `Brand` is empty.

14. **A row of the pantry has no brand.** The row keeps its place, its amount, and its use-by date. The receipt keeps the brand. Two bags of taco seasoning from two brands in one place are one row. The reason: a brand on a row adds work to each change of the pantry, and the goal is to know what to buy, not what is on the shelf. An option that was rejected: a column `Brand` in the table of the food item note.

15. **Each brand has its own price, and the plugin selects it.** At put away, the price starts from the regular price of the last receipt row with the selected brand. With no such row, it starts from the regular price of any brand, as today. The reason: a different brand has a different price, and you type nothing more. An option that was rejected: one price for the food item.

16. **The store records the brand that you take.** A tap on the photo of a brand shows it large, with the button "In cart". That button ticks the row with that brand. Put away then starts from that brand, before the brand of the last receipt. A tap on the row ticks it as today, with no brand. The reason: in the store you look at the package, so the choice is made there, and put away has less to check. An option that was rejected: a brand only at put away.

17. **The task of the cart keeps the brand as text after the link:** `- [x] [[Taco seasoning]] · Brand A`. A brand with no name uses the name of its photo. The reason: the cart is in the shopping note, so the brand must be there for put away on a different device.

## Further reading

- [Workflow](../../standards/workflow.md): the step of the work that this page is in.
