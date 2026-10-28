# Check list: pantry fill

This list tests the two [pantry fill stories](../docs/features/v0.10.0/pantry-fill-stories.md) of version 0.10.0. Each line has one action and what you must see. The text in brackets is the criterion or the requirement. Section B needs the Android phone or the Mac, a can of Bush's Best Black Beans (or any can with a barcode), and a connection.

## Before you start

- [ ] The build made `main.js` again. Sync the vault to the phone, then put the plugin off and on.
- [ ] The Pantry part is on "By place", with no filter.

## A. Fill a shelf in a row

Go to: Pantry. Tap +.

- [ ] Type "Tomato paste", tap "New: Tomato paste", give 170 g, tap "Next". The last step shows "Tomato paste · 170 g". The chip 1 is on. (AC 5)
- [ ] Tap "Kitchen pantry", the count 4, and "Add 4 packages". The form shows an empty name and "Added 4 × Tomato paste". (AC 1 a, 1 b)
- [ ] Behind the form, the line of Tomato paste in "Kitchen pantry" shows 4 packages. Open the note: 4 rows of 170 g, each full. (AC 1, requirement 3 c)
- [ ] Type "Rolled oats", tap "New", give 1 kg, tap "Next". The place is still "Kitchen pantry". (AC 2)
- [ ] Tap "Cancel". The form shows the name step. (AC 7)
- [ ] Type "black", tap "Black beans". The last step shows "Black beans · 425 g". (AC 3)
- [ ] Type 8 in the count field, tap "Add 8 packages". The line of Black beans in "Kitchen pantry" shows 10 packages. (AC 4)
- [ ] Tap "Done". The form closes. (AC 6)
- [ ] Remove the note "Tomato paste", and the 8 new rows of Black beans.

## B. Add food with a barcode

Go to: Pantry, on the phone. Tap +. The Mac works for each line but flight mode: turn off Wi-Fi in its place.

- [ ] A "Scan" button is next to the name field. (AC 1)
- [ ] On the Mac: tap "Scan", allow the webcam, and hold the can to it. The form shows the product. If the webcam does not open, pick a photo of the barcode. (AC 2)
- [ ] Tap "Scan". Obsidian asks for the camera the first time: allow it. The live view shows. Tap "Cancel". The form shows the name step. (AC 8)
- [ ] Tap "Scan", and point at the barcode of the can. The view closes, and the form shows the product with its size. "Black beans" is first in the list, in bold. (AC 3, 3 a, 3 b)
- [ ] Tap "Black beans", the count 2, and "Add 2 packages". Black beans in "Kitchen pantry" shows 4 packages. (AC 4)
- [ ] Open the note "Black beans". The section "Brands" has a line with the barcode of the can, and a photo in `Larder/Pantry/Photos`. (AC 4 a, 4 b)
- [ ] Turn on flight mode. Scan the same can. The form goes to the last step of "Black beans". Tap "Cancel". (AC 5)
- [ ] Still in flight mode, scan a different package that the pantry does not know. The form tells "No product for this barcode." (AC 6)
- [ ] Turn flight mode off. In the settings, turn off "Look up barcodes online". Scan the different package. The form tells "No product for this barcode." Turn the setting on again. (AC 7)
- [ ] If the live view did not show, and the phone camera opened in its place: take a photo of the barcode. The form goes on as above. A photo with no barcode tells "No barcode in the photo." (Requirement 2 b, 2 c)
- [ ] Remove the 2 new rows of Black beans, and the brand line of the scan.
