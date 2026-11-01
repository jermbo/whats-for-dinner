---
title: "Spec: pantry fill"
summary: "The scope that is agreed for a fast first fill: a barcode scan with an online lookup, and a form that stays open with a count."
parent: decision-log.md
updated: 2026-11-01
status: agreed
---

[Wiki](../../README.md) / [Decision log: pantry fill](decision-log.md) / Spec: pantry fill

# Spec: pantry fill

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

The **keeper** fills the pantry for the first time, at the shelf. Each new food takes eight steps, and the form closes after each food. The owner filled a quarter of the pantry in 2 hours.

## The solution

The keeper opens "Add to pantry", and the camera opens. One photo of the barcode, and the form shows the food item, the brand, the size, the place, and the photo, all filled in. One tap on a use-by date and one on "Correct" add the can, and the camera opens for the next can.

An example: the keeper scans a can of Bush's Best Black Beans. The form shows "Black beans", "Bush's", 425 g, and "Kitchen pantry". The keeper taps "2 years" and "Correct". The pantry has a full can of 425 g in "Kitchen pantry" that keeps 2 years, the brand "Bush's" has its photo and its barcode, and the camera waits for the next can.

## In scope

1. "Add to pantry" has a scan button on each device with a barcode reader in its browser, the phone and the computer (decisions 3 and 13)
   - a. On a device with no reader, the button is not there, and the form is as today (decision 13)
2. The scan shows a live view of the camera, and reads the barcode with no shutter (decision 12)
   - a. When the live view does not open, such as on Android, the camera of the phone opens at once and takes one photo, and the plugin reads the barcode in it (decision 12)
3. A barcode that a brand of the pantry has finds that food item and that brand, with no connection (decision 4)
4. A barcode that the pantry does not have gets a lookup at Open Food Facts (decisions 1 and 2)
   - a. Only the barcode number leaves the phone (decision 1)
   - b. The product gives the brand, the size, and the photo (decisions 5 and 6)
   - c. The size is metric when the label has it (decision 6)
5. The form selects the food item of a product, or a new food item with a name from the product (decision 14)
   - a. One tap on the name opens the list of the other food items, as the name field finds them today (decision 14)
6. With no connection, an unknown barcode, or the setting off, the form asks for the name as today, and keeps the barcode (decisions 9 and 10)
7. The note keeps the barcode on the line of its brand, after a middle dot (decision 4)
   - a. A new brand of a product gets the photo of the product, when it has one (decision 5)
8. The last step shows the food item, the size, the place, and the count as chips that you can tap (decisions 8 and 15)
   - a. The count is 1, with chips 1, 2, 3, 4, 6, 12, and a field (decision 8)
   - b. The place is the place of the newest package of the food item, or of the last add (decision 7)
9. The last step asks for the use-by date, and "Correct" adds the packages (decision 11)
10. After an add, the form stays open at the scan (or the name), and "Done" closes it (decision 7)
   - a. A known food goes to the last step with its size, as a new food does (decision 7)
11. A setting "Look up barcodes online" is on at the start (decision 10)

## Out of scope

1. A scan in setup, in put away, and in the audit (decision 3)
2. A scan on iPhone, and a decoder package (decision 13)
3. AI, and a photo of a package that the plugin reads with no barcode (decision 1)
4. A paid service, or a service with a key (decision 2)
5. The use-by date in the fast fill (decision 11)

## What changes in the system

Architecture pages that change:

- [Pantry](../../architecture/pantry.md): "Add to pantry" with the scan, the count, and a form that stays open.
- [Brands](../../architecture/brands.md): the barcode of a brand, and the photo of a product.
- [Food item note](../../architecture/food-item-note.md): the barcode on the line of a brand.
- [Settings](../../architecture/settings.md): "Look up barcodes online".
- [Vision](../../vision.md): the one request that the plugin makes.

Notes that get a different form:

- **The food item note** gets the barcode on the line of a brand: `- Bush's · 039400016045`.

## How you test it

Checks that need the phone:

1. A scan of a can that Open Food Facts knows proposes the food item, the brand, and the size.
2. A second scan of the same can, with no connection, finds the food item and the brand.
3. A scan of a package that Open Food Facts does not know asks for the name, and the next scan of it is known.
4. The count 4 adds 4 rows, and the form waits at the name.

Rules that are worth an automatic test:

1. **The line of a brand.** A line with a name, a verdict, and a barcode goes in; the three come out, and the line that the plugin writes back is the same.
2. **The size of a product.** "15 oz (425 g)" gives "425 g", "1 L" gives "1 l", and "6 x 330 ml" gives no size.
3. **The proposal.** "Bush's Best Black Beans" with the food items of the test vault proposes "Black beans".
