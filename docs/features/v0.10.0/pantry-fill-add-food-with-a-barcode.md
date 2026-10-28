---
title: Add food with a barcode
summary: "A scan of the barcode fills in the food item, the brand, the size, and the photo of a package, from the vault or from Open Food Facts."
parent: pantry-fill-stories.md
updated: 2026-10-27
persona: Keeper
depends-on: [pantry-fill-fill-a-shelf-in-a-row.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry fill stories](pantry-fill-stories.md) / Add food with a barcode

# Add food with a barcode

As the [keeper](../../personas.md), I want to scan the barcode of a package, so that the pantry gets its food item, brand, size, and photo with no typing.

## Requirements

1. "Add to pantry" opens on the scan when the device has a barcode reader in its browser, also a computer
   - a. On a device with no reader, the form opens on the name, with "Type barcode"
   - b. When "Add to pantry" starts from a name in the find bar, the form opens on the name
2. The scan shows a live view of the camera, and closes when it reads an EAN or UPC code
   - a. "Type barcode" opens a field for the digits; "Type name" goes to the name with no code
   - b. When the live view cannot open, the camera of the phone takes one photo, and the plugin reads the code in it
   - c. A photo with no code tells "No barcode in the photo", and the form stays at the name
3. A code that a brand of the pantry has goes to the last step of its food item, with no lookup
4. A different code gets a lookup at Open Food Facts, when the setting "Look up barcodes online" is on
   - a. The request has only the code
   - b. While it waits, the form tells "Looking up…"
5. A product shows its photo, its name, its brand, and its size
   - a. The size is the metric part of the quantity, when the label has it: "15 oz (425 g)" is 425 g
   - b. A quantity that is not one package size, such as "6 x 330 ml", gives no size
   - c. The form shows the barcode; you can change the digits and look the new code up
6. The form proposes the food item: the food item whose name or other name is in the name of the product
   - a. The longest such name wins: "Black beans" before "Beans"
   - b. Below it, the name field finds the other food items, as today
   - c. "New" has a name from the product, which you can change
7. A product with a size goes from the food item to the last step; a product with no size asks for the size first
8. "Add" writes the packages, and then the brand with the barcode
   - a. A brand of the same name gets the barcode
   - b. A new brand gets the photo of the product, when it has one
   - c. The form opens again on the scan when the device has a reader
9. With no connection, a code that Open Food Facts does not know, or the setting off, the form stays at the name with "No product for this barcode"
   - a. "Add" keeps the code on a brand with no name, so the next scan finds the food item
10. The settings have "Look up barcodes online", on at the start

## Acceptance criteria

Each criterion starts with the test vault, on the owner's Android phone, in the Pantry part, but where it names the computer.

1. GIVEN "Add to pantry" on a device with a barcode reader WHEN the keeper opens it THEN the form shows the scan
2. GIVEN "Add to pantry" on the owner's Mac WHEN the keeper holds a can to the webcam THEN the form shows the product
3. GIVEN the live view WHEN the keeper points it at the barcode of a can of Bush's Best Black Beans THEN the live view closes
   - a. AND the form shows the product with "425 g"
   - b. AND "Black beans" is the first food item
   - c. AND the form shows the barcode of the can
4. GIVEN the product of the beans WHEN the keeper taps "Black beans", the count 2, and "Add" THEN the line of Black beans in "Kitchen pantry" shows 4 packages
   - a. AND the note "Black beans" has a brand line with the barcode of the can
   - b. AND that brand has a photo in `Larder/Pantry/Photos`
   - c. AND the form opens on the scan again
5. GIVEN the brand with the barcode, and no connection WHEN the keeper scans the same can THEN the form shows the last step of "Black beans"
6. GIVEN no connection WHEN the keeper scans a can that the pantry does not know THEN the form tells "No product for this barcode", at the name
7. GIVEN the setting "Look up barcodes online" is off WHEN the keeper scans a new can THEN no request leaves the phone, and the form tells "No product for this barcode"
8. GIVEN the live view WHEN the keeper taps "Type name" THEN the form shows the name step
9. GIVEN the live view WHEN the keeper taps "Type barcode", types the digits of the can, and "Look up" THEN the form shows the product
10. GIVEN the product WHEN the keeper changes the barcode digits and taps "Look up" THEN the form looks up the new code

## Depends on

- [Fill a shelf in a row](pantry-fill-fill-a-shelf-in-a-row.md): the last step with the count, and the form that stays open.

## Architecture

- [Pantry](../../architecture/pantry.md): "Add to pantry".
- [Brands](../../architecture/brands.md): the barcode of a brand.
- [Settings](../../architecture/settings.md): "Look up barcodes online".
