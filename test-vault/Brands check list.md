# Check list: brands and photos

This list tests the seven stories of version 0.5.0, on the phone. Do the parts in sequence. Each part starts from the state that the part before it leaves. Each line has one action and what you must see. The text in brackets is the story and its criterion, from [Brands stories](../docs/features/v0.5.0/brands-stories.md). Story numbers are the numbers of that page.

## Before you start

- [ ] `Larder/Pantry/Taco seasoning.md` has the section "Brands" with Brand A, Brand B, and Brand C. Brand A and Brand B have a photo.
- [ ] `Larder/Pantry/Photos` has `Taco seasoning - Brand A.jpg` and `Taco seasoning - Brand B.jpg`. They are plain coloured boxes. Replace them with real photos of a package, if you want, with the same names.
- [ ] `Elbow pasta.md` has the brands "Brand A" and "Store brand". `Shell pasta.md` has "Brand A". No food item note has the property `brands`.
- [ ] `Larder/Shopping/Next trip.md` has the tasks of onions and taco seasoning, with no mark.
- [ ] `Larder/Shopping` has the receipts `2026-10-04` (Brand B, 1.99), `2026-10-11` (Brand A, 2.49), and `2026-10-14` (Brand A, 1.79, sale).
- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.

## A. The photos on the row

- [ ] Open Shop, stage "Shop". The row of taco seasoning shows the photo of Brand A, the photo of Brand B, and the chip "Brand C", in that order, and a dashed camera tile. It has no text "Any brand". (Story 1: AC 1. Story 4: AC 1)
- [ ] The row of onions shows only the camera tile. (Story 4: AC 2)
- [ ] Tap the photo of Brand A. It grows from the small photo, large, with "Brand A" below it and "In cart" at the lower edge. The row is not ticked. (Story 1: AC 2. Story 3: AC 1)
- [ ] Tap "Close". The row is as before, not ticked. Tap the photo again, and tap the dark part outside the photo. It closes too. (Story 1: AC 3)
- [ ] Type "brand b" in the find field. The stage shows the row of taco seasoning. Clear the field. (Story 1: AC 10)
- [ ] Tap the chip "Brand C". The row is ticked, and it goes into the cart. Open "In the cart", and tap "Undo". (Story 1: AC 4)
- [ ] With "Reduce motion" on in the phone settings, the large photo shows with no motion. Put it off again.

## B. The Pantry part

- [ ] Open the Pantry part. Type "brand c" in "Find food". The pantry shows only taco seasoning. (Story 1: AC 8)
- [ ] Type "gold". The pantry shows no line. Clear the field. (Story 1: AC 9)
- [ ] Open elbow pasta, and tap "Place, date, and size" for the form. The form shows the chips "Brand A" and "Store brand", and no text "Brands:". (Story 1: AC 6)
- [ ] Tap "Cancel". Open the form of taco seasoning. Tap the photo of Brand B. It shows large, with a field "Name", "New photo", and "Remove", and no "In cart". Tap "Close". (Story 1: AC 7. Story 3: AC 6)

## C. Add a brand with the camera

- [ ] In the form of taco seasoning, tap "Add brand", and take a photo. A fourth brand fades in after the chip "Brand C", and it opens large with an empty field "Name". (Story 2: AC 1)
- [ ] Type "Brand D", tap "Close", and tap "Save". `Larder/Pantry/Photos` has `Taco seasoning - Brand D.jpg`. The section ends with `- Brand D` and `  ![[Taco seasoning - Brand D.jpg]]`. The table is as before. (Story 2: AC 2)
- [ ] The row of taco seasoning in the stage Shop shows the photo of Brand D after the chip "Brand C". (Story 2: AC 11)
- [ ] Open the form again. Add a brand with a photo and no name, and tap "Save". The new file is `Taco seasoning - brand <today>.jpg`, and the section ends with `- ![[Taco seasoning - brand <today>.jpg]]`. (Story 2: AC 3)
- [ ] Open the form, tap that brand, type "Brand E", and tap "Save". The section ends with `- Brand E` and the photo on the line below. The file keeps its name. (Story 2: AC 4)
- [ ] Add one more brand "Brand D" with a photo. The new file is `Taco seasoning - Brand D 2.jpg`. (Story 2: AC 5)
- [ ] Tap Brand A, "New photo", take a photo, and "Save". The line below "Brand A" is `![[Taco seasoning - Brand A 2.jpg]]`. `Taco seasoning - Brand A.jpg` is still in the folder. (Story 2: AC 8)
- [ ] Tap Brand B, "Remove", and "Save". The section has no item "Brand B". `Taco seasoning - Brand B.jpg` is still in the folder. (Story 2: AC 7)
- [ ] Add a brand with a photo, and tap "Cancel". The note is as before, and the folder has no new file. (Story 2: AC 9)
- [ ] Open the form of onions (with no section "Brands"). Add a brand "Store brand" with a photo, and "Save". The note ends with `## Brands` and the brand. (Story 2: AC 6)

To continue with the vault of the list page, put the section "Brands" of taco seasoning back as it was: Brand A, Brand B, and Brand C, with the photos `Taco seasoning - Brand A.jpg` and `Taco seasoning - Brand B.jpg`.

## D. A brand in the cart

- [ ] In the stage Shop, tap the photo of Brand A, and "In cart". The row is ticked. `Next trip.md` has `- [x] [[Larder/Pantry/Taco seasoning|Taco seasoning]] · [[Taco seasoning - Brand A.jpg]]`. (Story 3: AC 2)
- [ ] Open "In the cart". Taco seasoning shows only the photo of Brand A. (Story 3: AC 2 b)
- [ ] Tap that photo. Each brand shows again. Tap the photo of Brand B, and "In cart". The task ends with `· [[Taco seasoning - Brand B.jpg]]`. (Story 3: AC 3)
- [ ] Tap "Undo". The task is `- [ ] [[Larder/Pantry/Taco seasoning|Taco seasoning]]`. (Story 3: AC 5)
- [ ] Tap the row of taco seasoning. The task is `- [x] [[Larder/Pantry/Taco seasoning|Taco seasoning]]`, with no brand. Tap "Undo". (Story 3: AC 4)
- [ ] Put Brand A in the cart on the phone. After Obsidian Sync, the stage Shop of the computer shows taco seasoning in the cart, with the photo of Brand A. (Story 3: AC 7)

## E. The brand and the price at put away

Taco seasoning is in the cart with Brand A, from part D.

- [ ] Open the stage "Put away", and open the line of taco seasoning. Brand A has the ring. The price is 2.49, not 1.79. (Story 5: AC 2. Story 6: AC 1)
- [ ] Tap the chip "Brand C". The ring slides to it. The price is 2.49. After a moment, the cell `Brand` of the active receipt is `Brand C`. (Story 5: AC 5. Story 6: AC 3)
- [ ] Tap Brand B. The price fades to 1.99. (Story 6: AC 2)
- [ ] Tap "Sale". The price field shows the hint "1.99 regular". Tap "Sale" again. The price is 1.99. (Story 6: AC 6)
- [ ] Tap Brand B again. No brand is selected. The price is 2.49, and the cell `Brand` is empty. (Story 5: AC 6. Story 6: AC 4)
- [ ] Type 2.29 in the price. Tap Brand B. The price stays 2.29. Remove the price, and tap Brand A and then Brand B again. (Story 6: AC 5)
- [ ] Close the line. It shows the photo of Brand B, small, before "Taco seasoning". (Story 5: AC 10)
- [ ] On the open line, the camera tile is after the chip "Brand C". (Story 7: AC 1)
- [ ] Tap the camera tile, and close the camera with no photo. Brand B is still selected. (Story 7: AC 4)
- [ ] Tap "Put away" on the line with Brand B. The row of the receipt has `[[Taco seasoning - Brand B.jpg]]` in the column `Brand`, and the price 1.99. The table of `Taco seasoning.md` has no column `Brand`. (Story 5: AC 7. Story 6: AC 7)

## F. The brand starts from the cart, the receipt, or the only brand

- [ ] Add `· [[Taco seasoning - Brand B.jpg]]` by hand to a ticked task of taco seasoning. Open put away. Brand B is selected. (Story 5: AC 1)
- [ ] Change a receipt so that its cell `Brand` of taco seasoning is `brand a`, and it is the last receipt, and the task has no brand. Brand A is selected. (Story 5: AC 8)
- [ ] With no receipt of taco seasoning and no brand in the task, no brand is selected. (Story 5: AC 3)
- [ ] Leave only "Store brand" in the section of elbow pasta, and put elbow pasta in the cart. Its line starts with "Store brand". (Story 5: AC 4)
- [ ] Put batteries in the cart. Their line shows no brands and no camera tile. (Story 5: AC 11. Story 7: AC 3)
- [ ] With no brand selected, "Put away" puts taco seasoning into the pantry, and the cell `Brand` is empty. (Story 5: AC 9)

## G. A photo in the store and at put away

- [ ] In the stage Shop, tap the camera tile of taco seasoning, and close the camera with no photo. `Taco seasoning.md` is as before. (Story 4: AC 6)
- [ ] Tap the camera tile, and take a photo. `Larder/Pantry/Photos` has `Taco seasoning - brand <today>.jpg`. The section ends with `- ![[Taco seasoning - brand <today>.jpg]]`. The photo grows large from the tile, with "In cart". (Story 4: AC 3)
- [ ] Tap "Close". The row shows the new photo after the chip "Brand C", and it is not ticked. (Story 4: AC 5)
- [ ] Tap the new photo, and "In cart". The task ends with `· [[Taco seasoning - brand <today>.jpg]]`, and the row is ticked. (Story 4: AC 4)
- [ ] At put away, open the line of taco seasoning, tap the camera tile, and take a photo. A new file `Taco seasoning - brand <today> 2.jpg` is there, and the section ends with it. The new photo grows in with the ring. After a moment, the cell `Brand` of the active receipt is its link. (Story 7: AC 2)

## H. Setup

- [ ] In a vault for a test of setup, go to the step "First food". Tap "Add other food", type "Cumin", tap "Add brand", take a photo, type "Brand A", and "Save". `Larder/Pantry/Cumin.md` has a section "Brands" with "Brand A" and `![[Cumin - Brand A.jpg]]`. (Story 2: AC 10)
