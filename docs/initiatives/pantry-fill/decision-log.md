---
title: "Decision log: pantry fill"
summary: "The options and the decisions that make the first fill of the pantry fast: a barcode scan that fills in the facts, and a form that stays open for the next food."
parent: ../../README.md
updated: 2026-10-27
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
| Open Food Facts has fewer US products than European products.                                            | Assumption. A test with 20 packages of the owner's pantry tells the real rate.                      |
| Obsidian on a phone permits a live camera view (`getUserMedia`) in a plugin.                             | Assumption. Only a prototype on the phone tells.                                                    |
| Obsidian on a Mac has the `BarcodeDetector` of Chromium, and permits the webcam in a plugin. | Assumption. Chromium has the reader on macOS; Windows and Linux do not have it. |
| `<input capture>` opens the camera in Obsidian on Android and on iOS.                                   | Verified on Android: the brand photos use it today. iOS: assumption.                                |

## Decisions

1. **The plugin can read one fact from the internet: the product of a barcode.** Only the barcode number leaves the phone, never a fact of the vault. With no connection, the plugin works as today. The reason: the owner's words above; a pantry that nobody fills is worse than one request. Options that were rejected: local only, with a barcode memory and no lookup (no help for the first fill), and a photo that AI reads (still no AI).
2. **The source is Open Food Facts.** The reason: it is free, it needs no key, and its data is open. 15 reads each minute is more than one person scans. Options that were rejected: UPCitemdb (100 reads each day on its free plan), and a paid service (a key cannot be a secret in a public plugin).
3. **The scan is in "Add to pantry" of the Pantry part.** The reason: the first fill is the problem, and it happens in the Pantry part. Setup needs only one food, and its form is a different form. Put away already fills in the facts of a known package. Options that were rejected for now: a scan in setup, in put away, and in the audit. They can come later, with the barcodes that this work keeps.
4. **The note keeps the barcode on the line of its brand**, after a middle dot, as the verdict: `- Bush's · buy again · 039400016045`. A barcode is only digits, so it does not clash with a verdict. The reason: a barcode is one brand of one package, and a second scan of that package finds the food item and its brand with no connection.
5. **The photo of a new brand comes from Open Food Facts when it has one.** You can take your own photo later, as today. The reason: in the store, you look for the package, and the front photo is that package. The photo goes into the folder `Photos` as any brand photo. (Assumption: a photo in your own vault for your own use is within CC BY-SA. The README names Open Food Facts.)
6. **The size comes from the quantity of the label, in metric when the label has it**: "15 oz (425 g)" gives 425 g. The reason: the pantry is metric, and a correction is one tap on the unit chip.
7. **The form stays open after "Add".** It starts again at the name, with the same place, and "Done" closes it. The new line shows in its bin behind the form. A known food goes to the same last step, with its size: the count and the place, then "Add". The reason: you fill a shelf, not one item. Today the form closes and you start at + again, and a known food opens its card, which closes the form.
8. **The form has a count: how many of this package you put on the shelf**, with chips 1, 2, 3, 4, 6, 12 and a field. 8 cans are 8 rows, each full. The reason: one tap in place of 7.
9. **With no connection, or a barcode that Open Food Facts does not know, the form asks for the name as today**, and it keeps the barcode on the brand. The next scan of that package is known. The reason: the scan never makes the form slower than today.
10. **A setting "Look up barcodes online" is on at the start.** The README tells which request the plugin makes. The reason: a person who wants no request can turn it off, and the review of Obsidian wants each network use in the README. (Assumption: the rule of the Obsidian review. Check it before the release.)
11. **The use-by date is not part of the fast fill**, as today. The reason: a date is typed, and the audit and put away ask for it later.

12. **The camera reads the barcode in a live view**: you point the phone, and the scan is done with no shutter. When Obsidian does not give the live view, the camera button of the phone takes one photo, and the plugin reads the barcode in it. The reason: the owner's words, "I think live view would work". The photo is the safe way back, because the live view in Obsidian is not tested yet, and the photo uses the same reader. An option that was rejected: only a photo, with a shutter and "OK" for each package.
13. **Each device with a barcode reader in its browser gets the scan**: the Android phone, and the computer when Obsidian there has the reader. On a computer, the camera is the webcam, or a photo file when the webcam does not open. On a device with no reader, such as an iPhone, the scan button is not there, and "Add to pantry" is as today. The reason: the owner's words, "I take back having to support it. I dont want to install a package right now." and, about the computer, "I want to use it regardless." Options that were rejected: a decoder package for iPhone (no package now), a decoder of our own (it fails on a blurred or tilted photo), and the scan on the phone only.
14. **The plugin proposes the food item of a product.** A food item whose name or other name is in the name of the product comes first, and one tap accepts it. The other food items are a list, and "New" proposes a name from the product. The brand is the first brand of the product. The reason: the pantry needs "Black beans" with the brand "Bush's", not "Bush's Best Black Beans"; the owner's words, "I am ok with this. I think we need to do something and test." Options that were rejected: the product name as the food item (the recipes do not find it), and a name that you always type.
