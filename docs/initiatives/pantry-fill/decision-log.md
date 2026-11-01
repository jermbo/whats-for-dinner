---
title: "Decision log: pantry fill"
summary: "The options and the decisions that make the first fill of the pantry fast: a barcode scan that fills in the facts, and a form that stays open for the next food."
parent: ../../README.md
updated: 2026-11-01
---

[Wiki](../../README.md) / Decision log: pantry fill

# Decision log: pantry fill

The owner filled a quarter of the pantry in 2 hours. Beta testers said the same: if the first fill is this slow, nobody uses the plugin. This page records how the first fill gets fast, and the reason for each decision. The new words are in the [glossary](glossary.md).

## The words of the owner

> "Adding things to the pantry is taking for ever. Manually entering everything is a slow and tedious process that needs to be sped up. Taking a photo of it or scanning the barcode to get the information would be a key feature. I got through only a quarter of the pantry and that took 2 hours."

> "I need to reconsider my statement. I am not opposed to an API call, I was just trying to make this as simple as possible. Based on my testing and the feedback of beta testers, this manual entry is a deal breaker. It will not be used if the barrier to entry is so high."

> "I have an andriod, but need to support iphone as well. (Though I will not be able to test it)"

> "This is only a phone option? I want to use it regardless."

> "12. I think live view would work, it pulled up the camera no problem when trying to capture the photo. 13. Don't care right now. I take back having to support it. I dont want to install a package right now. 14. I am ok with this. I think we need to do something and test."

> "Is it possible to get the barcode by having a live scan, not a picture? Also, if we are getting the information about size, picture, and other details, can it auto fill that out for me? Why do I have to manually enter the data we are getting form the api. The only thing it should ask for is expire date."

> "i dont see the option in android settings"

> "I like option C. your recommendations are good. Build all and I will test"

> "After scanning the barcode, it inconsistently adding quantity. I want to default to grams where possible. Also, after the count and amount is recorded, I expect to see a screen to see the date. Lastly, once I save it takes a long time to go back to scan option again. The note is saved already, but the modal lingers on the just scanned item. This is breaking immersion and flow."

> "agreed.. build it all"

> "Ok. This is good. But I think its too fast. I feel like I am not able to verify and tweak before it goes into the capture again. When I click the expire date it assumes everything else is correct. I want to click a button that says "correct" then go into the next photo flow."

## What the plugin does today

| Topic           | Today                                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Add to pantry   | Eight steps for a new food: tap +, type the name, tap "New", type the size, tap a unit, tap "Next", tap a place, tap "Add". Then the card of the food opens, and the next food starts at + again. |
| A known food    | Type the name, tap it: its card opens with a new full package.                                                                                |
| Many of one     | One tap on "+ Add package" for each package: 7 taps for 8 cans.                                                                               |
| Setup           | A checklist of staples, each with a size field. "Add to pantry" for the rest.                                                                 |
| Brands          | A brand has a name, a photo, or both. The camera button opens the camera of the phone and keeps one photo.                                    |
| The network     | The plugin sends nothing and reads nothing from the internet. Decision 29 of the [shopping list](../shopping-list/decision-log.md) and the [vision](../../vision.md) say so. |
| Barcodes        | The plugin has no barcode.                                                                                                                    |

## Facts from research

| Fact                                                                                                     | Confidence                                                                                          |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Android WebView has the `BarcodeDetector` of the browser, which reads EAN and UPC codes.                 | Secondary source: the Chromium intent to ship and two developer reports.                           |
| The WebView of iOS has no `BarcodeDetector`. An app on iOS needs a decoder of its own, such as zxing-wasm. | Secondary source. The sources do not agree on the newest iOS versions.                             |
| Open Food Facts gives a product by its barcode with no key: name, brands, quantity, and a front photo.   | Secondary source: the API pages of Open Food Facts.                                                 |
| Open Food Facts permits 15 product reads each minute from one address, and wants a User-Agent with the app name and a contact. | Verified: the API page of Open Food Facts.                                         |
| The data is under the ODbL, and the photos are under CC BY-SA.                                           | Verified: the API page of Open Food Facts.                                                          |
| A product has its size as one number in grams or millilitres: `product_quantity`, with `product_quantity_unit`. | Assumption. A scan of the beans tells.                                                    |
| Open Food Facts has fewer US products than European products.                                            | Assumption. A test with 20 packages of the owner's pantry tells the real rate.                      |
| Obsidian on Android gives a plugin no live camera view (`getUserMedia`). The app does not ask Android for the camera. | Verified on the owner's Android phone: the scan fell back to the photo, and the settings of the app list no camera permission. |
| Obsidian on a Mac has the `BarcodeDetector` of Chromium, and permits the webcam in a plugin. | Assumption. Chromium has the reader on macOS; Windows and Linux do not have it. |
| `<input capture>` opens the camera in Obsidian on Android and on iOS.                                   | Verified on Android: the brand photos use it today. iOS: assumption.                                |

## Decisions

1. **The plugin can read one fact from the internet: the product of a barcode.** Only the barcode number leaves the phone, never a fact of the vault. With no connection, the plugin works as today. The reason: the owner's words above; a pantry that nobody fills is worse than one request. Options that were rejected: local only, with a barcode memory and no lookup (no help for the first fill), and a photo that AI reads (still no AI).
2. **The source is Open Food Facts.** The reason: it is free, it needs no key, and its data is open. 15 reads each minute is more than one person scans. Options that were rejected: UPCitemdb (100 reads each day on its free plan), and a paid service (a key cannot be a secret in a public plugin).
3. **The scan is in "Add to pantry" of the Pantry part.** The reason: the first fill is the problem, and it happens in the Pantry part. Setup needs only one food, and its form is a different form. Put away already fills in the facts of a known package. Options that were rejected for now: a scan in setup, in put away, and in the audit. They can come later, with the barcodes that this work keeps.
4. **The note keeps the barcode on the line of its brand**, after a middle dot, as the verdict: `- Bush's · buy again · 039400016045`. A barcode is only digits, so it does not clash with a verdict. The reason: a barcode is one brand of one package, and a second scan of that package finds the food item and its brand with no connection.
5. **The photo of a new brand comes from Open Food Facts when it has one.** You can take your own photo later, as today. The reason: in the store, you look for the package, and the front photo is that package. The photo goes into the folder `Photos` as any brand photo. (Assumption: a photo in your own vault for your own use is within CC BY-SA. The README names Open Food Facts.)
6. **The size is in grams or millilitres where the product has a weight or a volume.** The number of Open Food Facts in grams or millilitres comes first. Then the quantity of the label: "15 oz (425 g)" gives 425 g, and "16 oz" gives 454 g. Ounces and pounds become grams, and fluid ounces become millilitres, in whole numbers. From 1000, the size is in kilograms or litres. A multipack gives no size. The reason: the pantry is metric, and the owner's words, "I want to default to grams where possible". A label in ounces gave ounces, so two cans of one food could have two units.
7. **The form stays open after each add.** It starts again at the scan (or the name), and "Done" closes it. The new line shows in its bin behind the form. A known food goes to the same last step, with its size. The place of the last step is the place of the newest package of the food item. A new food item gets the place of the last add. The reason: you fill a shelf, not one item; and the place of a known food is a fact that the pantry already has.
8. **The form has a count: how many of this package you put on the shelf**, with chips 1, 2, 3, 4, 6, 12 and a field. 8 cans are 8 rows, each full. The count is 1 at the start, and it opens from its fact. The reason: one tap in place of 7, and most scans are one package.
9. **With no connection, or a barcode that Open Food Facts does not know, the form asks for the name as today**, and it keeps the barcode on the brand. The next scan of that package is known. The reason: the scan never makes the form slower than today.
10. **A setting "Look up barcodes online" is on at the start.** The README tells which request the plugin makes. The reason: a person who wants no request can turn it off, and the review of Obsidian wants each network use in the README. (Assumption: the rule of the Obsidian review. Check it before the release.)
11. **The use-by date is the one question of the last step, and "Correct" adds the package.** Buttons give a time: 1 week, 1 month, 3 months, 6 months, 1 year, 2 years, and "No date". A date field takes the date of the label. A tap on a button selects its date, and "Correct" writes the packages with it. After a scan of the same package, "Same date" is the first button, and it is on, so that can is one tap. The reason: the owner's words, "The only thing it should ask for is expire date", and "When I click the expire date it assumes everything else is correct. I want to click a button that says "correct" then go into the next photo flow." A time is close enough for food on a shelf, so a date needs no typing. A month is 30 days, and a year is 365 days. Options that were rejected: the date as the add (no moment to check the facts), and all dates at the end of the shelf (you look at the label twice).

12. **The camera reads the barcode in a live view where Obsidian gives one, and from one photo where it does not.** The Mac gives the live view: you point the webcam, and the scan is done with no shutter. Obsidian on Android does not give it, so the camera of the phone opens at once, with no tap on a button, and the plugin reads the barcode in the photo. After an add, the camera opens again for the next package. The reason: the owner tested the live view, and Android shows no camera permission for Obsidian. A package cannot get the camera when the app does not have it. The photo costs a shutter and "OK", and the open camera saves the third tap. Options that were rejected: a live view of our own (no camera), and a request to Obsidian as the only path (the owner can ask on the forum, but the scan must work now).
13. **Each device with a barcode reader in its browser gets the scan**: the Android phone, and the computer when Obsidian there has the reader. On a computer, the camera is the webcam, or a photo file when the webcam does not open. On a device with no reader, such as an iPhone, the scan button is not there, and "Add to pantry" is as today. The reason: the owner's words, "I take back having to support it. I dont want to install a package right now." and, about the computer, "I want to use it regardless." Options that were rejected: a decoder package for iPhone (no package now), a decoder of our own (it fails on a blurred or tilted photo), and the scan on the phone only.
14. **The plugin selects the food item of a product, and you correct it only when it is wrong.** The food item whose name or other name is in the name of the product, the longest first, is the food item of the last step. With no such food item, the last step has a new food item with a name from the product. One tap on the name opens the list of food items, where you select a different one or change the new name. The brand is the first brand of the product. The reason: the pantry needs "Black beans" with the brand "Bush's", not "Bush's Best Black Beans"; and the owner's words, "Why do I have to manually enter the data we are getting form the api." Options that were rejected: the product name as the food item (the recipes do not find it), a name that you always type, and a proposal that you always accept with a tap.
15. **The last step is the screen of the use-by date, and each fact of the package is a small chip at its top**: the food item, the size, the place, and the count. The dates are large buttons in two columns. The facts come from the scan, from the pantry, or from the last add. A product with no size asks for the size first, because the pantry cannot count a package with no size. The reason: the owner's words, "can it auto fill that out for me?", and "I expect to see a screen to see the date"; the plugin fills in each fact and you spot check, so the date is what the screen is for. The same last step comes after a typed name. An option that was rejected: a screen of facts with "Next", and then a screen of dates (one more tap for each package).
16. **The form does not wait for the note.** A tap on "Correct" starts the next scan at once. The writes go on behind it, one add after the other: the packages of one add are one write, and then the brand and its photo. A write that fails tells it in a notice. The form keeps each barcode that it added until Obsidian starts again, so a second scan of that can needs no lookup. The reason: the owner's words, "the modal lingers on the just scanned item. This is breaking immersion and flow." The download of the photo was the slow part, and you do not need the photo to scan the next can.
