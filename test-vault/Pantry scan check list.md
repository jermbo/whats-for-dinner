# Check list: pantry scan

This list tests the three [pantry scan stories](../docs/features/v0.11.0/pantry-scan-stories.md) of version 0.11.0. Each line has one action and what you must see. The text in brackets is the criterion or the requirement. You need the Android phone, a connection, a can of Bush's Best Black Beans (or any can that Open Food Facts knows), and a package that no food item matches, such as a box of crackers.

The dates below are for 1 November 2026. On a different day, each date moves by the same number of days.

## Before you start

- [ ] Run `npm run dev` one time, so that `main.js` of the test vault is new. Sync the vault to the phone, then turn the plugin off and on.
- [ ] Black beans has 2 cans in "Kitchen pantry", and no barcode on a brand. Remove a brand line of an earlier scan.

## A. The camera opens at once

Go to: Pantry, on the phone.

- [ ] Tap +. The camera of the phone opens, with no tap on "Take a photo". (Story 2, AC 1)
- [ ] Close the camera with no photo. The form shows "Take a photo of the barcode", "Type barcode", and "Type name". (Story 2, AC 4)
- [ ] Tap "Take a photo of the barcode", take a photo of a wall, and tap "OK". The form tells "No barcode in the photo.", and the camera opens again. (Story 2, AC 5, 5 a)

## B. The last step fills in each fact

- [ ] Take a photo of the barcode of the beans, and tap "OK". The form shows the photo of the product next to small chips: "Black beans", "425 g", "Kitchen pantry", and "1 package". (Story 1, AC 1, 1 a; story 2, AC 2)
- [ ] Under the title "Use by", large buttons in two columns: 1 week, 1 month, 3 months, 6 months, 1 year, 2 years, and No date, then a date field and "Correct". No button is on, "Correct" is off, and there is no "Same date" button yet. (Story 1, AC 1 b, requirement 7, 8 a)
- [ ] Tap "2 years". It turns dark, and nothing is added. Tap "1 year": only "1 year" is dark. Tap "2 years" again. (Story 1, AC 13, 14)
- [ ] Tap "Correct". The camera opens again in less than 1 second. When you close it, the form tells "Added 1 × Black beans" with 31 Oct 2028. (Story 1, AC 2 b, 2 c; story 2, AC 3; story 3, AC 1)
- [ ] Wait a few seconds. Black beans in "Kitchen pantry" shows 3 packages. Open the note: the new row has 2028-10-31, and the brand line has the barcode and a photo. (Story 1, AC 2, 2 a; story 3, AC 1 a)
- [ ] Scan the same can. "Same date" is the first button, and it is dark. Tap "Correct". Black beans shows 4 packages, and the new row has 2028-10-31 too. (Story 1, AC 3, 3 a)

## C. A tap on a chip corrects a fact

- [ ] Scan the beans. Tap "1 package". A row of counts opens. Tap 4, then "1 year" and "Correct". Black beans gets 4 more packages, each with 2027-11-01. (Story 1, AC 4; story 3, AC 2)
- [ ] Scan the beans. Tap "Kitchen pantry". A row of places opens. Tap "Fridge". The chip shows "Fridge", and the row closes. (Story 1, AC 5)
- [ ] Tap the chip "Black beans". The form shows the name step with the product. Tap "Diced tomatoes" in the list (type "diced" first if it is not there). The last step shows "Diced tomatoes". Tap "Cancel". (Story 1, AC 6, 6 a)
- [ ] Scan the crackers. The food item chip shows "New" and a name from the product. If the product has no size, the form asks for the size first. Tap "Cancel". (Story 1, AC 7, requirement 3 a)
- [ ] Scan a package with only ounces on its label, such as "16 oz". The size chip shows grams, such as "454 g". (Story 1, AC 12)
- [ ] Turn on flight mode. Scan the beans. The form goes to the last step of "Black beans", with "425 g". Tap "Cancel", and turn flight mode off. (Story 3, AC 3)

## D. The same last step after a typed name

- [ ] Close the camera, and tap "Type name". Type "diced" and tap "Diced tomatoes". The last step shows "Diced tomatoes", "411 g", "Kitchen pantry", and "1 package". (Story 1, AC 8)
- [ ] Tap "No date" and "Correct". The new row of Diced tomatoes has no use-by date. (Story 1, AC 9)
- [ ] Close the camera, tap "Type name", type "diced", and tap "Diced tomatoes". Set 2027-05-01 in the date field, and tap "Correct". The new row has 2027-05-01. (Story 1, AC 10)
- [ ] Close the camera, tap "Type name", type "Rice cakes", and tap "New: Rice cakes". The form asks for the size first. Tap "Cancel". (Story 1, AC 11)

## E. The Mac

- [ ] On the Mac, open "Add to pantry". The form shows the live view of the webcam, as before. (Story 2, AC 6)

## Clean up

- [ ] In "Black beans", remove the new rows and the brand line of the scan. In "Diced tomatoes", remove the 2 new rows.
