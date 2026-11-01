---
title: Check and add a package
summary: "The last step of \"Add to pantry\" fills in the food item, the size in grams, the place, and the count. You check them, select a use-by date, and tap \"Correct\" to add the package."
parent: pantry-scan-stories.md
updated: 2026-11-01
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry scan stories](pantry-scan-stories.md) / Check and add a package

# Check and add a package

As the [keeper](../../personas.md), I want the form to fill in each fact of a package and ask only for its use-by date, so that each package on the shelf is a date and one tap on "Correct".

## Requirements

1. The last step is the screen of the use-by date, with the facts of the package as small chips at its top: the food item, the size, the place, and the count
   - a. After a scan with a product, the photo of the product is next to the chips
   - b. A new food item has "New" in front of its name
   - c. The dates are large buttons in two columns, under the chips, and "Correct" is under the dates
2. The food item comes from the scan, or from the name that you tap
   - a. A barcode that a brand has gives the food item of that brand
   - b. A product gives the food item whose name or other name is in the name of the product, the longest first
   - c. A product with no such food item gives a new food item, with a name from the product
3. The size is the size of the product, or else the size of the next package of the food item
   - a. With neither, the form asks for the size, and then goes to the last step
   - b. The size of a product is in grams or millilitres: the weight or volume number of Open Food Facts first, then the quantity of the label
   - c. A label in ounces or pounds becomes grams, and fluid ounces become millilitres, in whole numbers: "16 oz" is 454 g
   - d. From 1000, the size is in kilograms or litres: 1360 g is 1.36 kg
   - e. A quantity of more than one package, such as "6 x 330 ml", gives no size
4. The place is the place of the newest package of the food item that is not empty
   - a. A new food item, or a food item with no such package, gets the place of the last add, or the place that the form started with
5. The count is 1
6. A tap on a chip changes its fact
   - a. The food item opens the name step with the product and the list of food items; a tap on a food item goes back to the last step
   - b. The size opens the size step
   - c. The place opens a row of the places; a tap on a place selects it, and the row closes
   - d. The count opens the chips 1, 2, 3, 4, 6, 12, and a field
7. The last step asks for the use-by date, with buttons: 1 week, 1 month, 3 months, 6 months, 1 year, 2 years, No date, and a date field
   - a. A week is 7 days, a month is 30 days, and a year is 365 days, from today
   - b. A tap on a button selects its date, and the button shows that it is on; a date in the field selects that date
   - c. When the barcode is the barcode of the last add, and that add had a date, "Same date" is the first button, and it is on
8. "Correct" writes the packages with the selected date
   - a. With no date selected, "Correct" is off
   - b. Then the brand gets the barcode, as before
   - c. The form tells what it added, with the date in the language of the device: "Added 1 × Black beans · 31 Oct 2028"
   - d. The form starts again at the scan, or at the name on a device with no barcode reader
   - e. The form does not wait for the note; [Scan the next can with no wait](pantry-scan-scan-the-next-can-with-no-wait.md) tells how

## Acceptance criteria

Each criterion starts with the test vault on the owner's Android phone, in the Pantry part, with a connection. Today is 2026-11-01.

1. GIVEN "Add to pantry" WHEN the keeper scans a can of Bush's Best Black Beans THEN the last step shows the chips "Black beans", "425 g", "Kitchen pantry", and "1 package"
   - a. AND the photo of the product shows next to the chips
   - b. AND the date buttons fill the screen under the chips
2. GIVEN the last step of the beans WHEN the keeper taps "2 years" and "Correct" THEN the line of Black beans in "Kitchen pantry" shows 3 packages
   - a. AND the new row has the use-by date 2028-10-31
   - b. AND the form tells "Added 1 × Black beans" with the date
   - c. AND the form opens on the scan
3. GIVEN the add of AC 2 WHEN the keeper scans the same can THEN "Same date" is the first date button, and it is on
   - a. AND a tap on "Correct" gives a fourth package with the date 2028-10-31
4. GIVEN the last step of the beans WHEN the keeper taps the count chip, the count 4, "1 year", and "Correct" THEN the line of Black beans shows 4 more packages, each with the date 2027-11-01
5. GIVEN the last step of the beans WHEN the keeper taps "Kitchen pantry" and then "Fridge" THEN the place chip shows "Fridge", and the row of places closes
6. GIVEN the last step of the beans WHEN the keeper taps the chip "Black beans" THEN the form shows the name step with the product
   - a. AND a tap on "Diced tomatoes" shows the last step with "Diced tomatoes"
7. GIVEN "Add to pantry" WHEN the keeper scans a package that no food item matches THEN the food item chip shows "New" and a name from the product
8. GIVEN the name step WHEN the keeper types "diced" and taps "Diced tomatoes" THEN the last step shows "Diced tomatoes", "411 g", "Kitchen pantry", and "1 package"
9. GIVEN the last step of "Diced tomatoes" WHEN the keeper taps "No date" and "Correct" THEN the new row of Diced tomatoes has no use-by date
10. GIVEN the last step of "Diced tomatoes" WHEN the keeper sets 2027-05-01 in the date field and taps "Correct" THEN the new row has the use-by date 2027-05-01
11. GIVEN the name step WHEN the keeper types "Rice cakes" and taps "New: Rice cakes" THEN the form asks for the size before the last step
12. GIVEN "Add to pantry" WHEN the keeper scans a package with only "16 oz" on its label THEN the size chip shows "454 g"
13. GIVEN the last step of the beans, with no date selected WHEN the keeper taps "2 years" THEN "2 years" is on, nothing is added, and "Correct" is on
14. GIVEN the last step of the beans WHEN the keeper taps "2 years" and then "1 year" THEN only "1 year" is on

## Depends on

Nothing. The last step is the same after a scan and after a typed name.

## Architecture

- [Pantry](../../architecture/pantry.md): "Add to pantry" and its last step.
- [Brands](../../architecture/brands.md): the barcode of a brand, and the product of a lookup.
