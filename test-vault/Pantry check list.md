# Check list: the simple pantry

This list tests the pantry stories and the units stories of version 0.6.0, on the phone. Do the parts in sequence. Each line has one action and what you must see. The text in brackets is the story and its criterion, from [Pantry stories](../docs/features/v0.6.0/pantry-stories.md), or from [Units stories](../docs/features/v0.6.0/units-stories.md) when it says "Units".

## Before you start

- [ ] Each note in `Larder/Pantry/` has the columns `Place | Left | Size | Use by`, and no property `full`, `low`, or `loose`.
- [ ] `Milk.md` has `Fridge | 1/4 | 1 gal | 2026-10-22` and `Fridge | full | 1 gal | 2026-10-29`.
- [ ] `Eggs.md` has `Fridge | 4 | 12 | 2026-10-25` and `Fridge | 12 | 12 | 2026-11-16`.
- [ ] `Sugar.md` has `Kitchen pantry | 1/4 | 1 kg |`, `Onions.md` has `Kitchen pantry | 1/2 | 1 kg |`, and `Water.md` has `Kitchen pantry | tap | |`.
- [ ] `Recipes/Boiled eggs.md` has the line `*1 l* water`.
- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.

## A. A level or a count (story 1)

- [ ] Open the Pantry part. The line of milk shows "1 1/4 gal · 2 packages", and its bar is not amber. (Story 1: AC 1 and 3)
- [ ] The line of eggs shows "16 · 2 packages". (Story 1: AC 2)
- [ ] The plugin settings have no setting "Low line" and no setting "Units". (Story 1: requirement 10 a)
- [ ] In `Eggs.md`, delete the row of 2026-11-16, and change `4` to `3`. The bar of eggs is amber. Change `3` back to `4`: the bar is not amber. (Story 1: AC 4)
- [ ] In `Milk.md`, delete the row `full | 1 gal`. The bar of milk is amber. (Story 1: AC 3 a)
- [ ] Open the Shop part. Milk is a suggestion "Low". (Story 1: AC 3 a)
- [ ] Open "Boiled eggs" in the recipe list. Water counts as in the pantry. (Story 1: AC 6)
- [ ] In `Milk.md`, add the row `Fridge | 0 | 1 gal |`. Open the line of milk and tap "Done" after a drag. The row with `0` is not in the note. (Story 1: AC 7)
- [ ] Add `full: 2 gal` to the properties of `Milk.md`. After a drag and "Done", `full: 2 gal` is still there, and nothing changed it. (Story 1: AC 8)
- [ ] Reset `Milk.md` and `Eggs.md` from the section "What the vault needs" of the stories page.

## B. A spoon against grams (Units story 1)

- [ ] Open Recipes, and open the pancakes. The line of sugar ("1 tablespoon") has the tick of "in the pantry", and no sticker. (Units 1: AC 1 and 1 a)
- [ ] Set `Sugar.md` to `Kitchen pantry | 1/4 | 40 g |`. The line of sugar has "Low". (Units 1: AC 2)
- [ ] Put the pancakes in the plan, and open Shop. The list has sugar with "5 ml". (Units 1: AC 3)
- [ ] Set `Sugar.md` to `Kitchen pantry | 1/2 | 1 kg |`. Cook the pancakes to the end, with sugar used. `Sugar.md` still has `1/2`. (Units 1: AC 4 and 4 a)
- [ ] Reset `Sugar.md` to `Kitchen pantry | 1/4 | 1 kg |`, and take the pancakes out of the plan.

## C. Food to check (Units story 2)

- [ ] Open Recipes, and open "Pasta with tomato sauce". The line of onion has the sticker "Check". The count of the recipe has the onion in the pantry. (Units 2: AC 1 and 1 a)
- [ ] Open "Boiled eggs" in Cook Mode. Get out shows "Check" on the line of water. (Units 2: AC 2)
- [ ] Put the pasta in the plan, and open the Plan. Its meal card says "· 1 to check". (Units 2: AC 3)
- [ ] Open Shop. The list has no row of onions. (Units 2: AC 4)

## D. A verdict for a brand (story 2)

- [ ] Open taco seasoning in the Pantry part, and the form. Tap the photo of Brand A. The large view has the chips "Buy again" and "Avoid". (Story 2: requirement 3)
- [ ] Tap "Buy again", close the view, and tap "Save". `Taco seasoning.md` has `- Brand A · buy again`, and the photo line below it is as before. (Story 2: AC 1 and 1 a)
- [ ] In `Taco seasoning.md`, change `- Brand B` to `- Brand B · avoid`. Put taco seasoning on the list, and open Shop. The photo of Brand B has a tomato cross, Brand A has an olive check, and Brand C has no mark. (Story 2: AC 2 and 2 a)
- [ ] Open the large view of Brand B, tap "Avoid" to put it off, and "Save". The line is `- Brand B`. (Story 2: AC 3)
- [ ] Change the line of Brand A to `- Brand A · BUY AGAIN`. The photo still has the olive check. (Story 2: AC 4)

## E. One bar for all packages (story 3)

- [ ] Open the Pantry part, "By place". The line of milk in "Fridge" shows "1 1/4 gal · 2 packages". Its bar has two parts of the same length: one at 1/4, and one full. (Story 3: AC 1 and 1 a)
- [ ] The line of black beans shows "3.2 kg · 8 packages". The bar has 8 parts, and the first part is at 1/2. (Story 3: AC 2 and 2 a)
- [ ] In `Eggs.md`, change the place of the row of 2026-11-16 to `Freezer`. In "Fridge", the first part of eggs is dark and the second is grey. In "Freezer", the full carton is first and dark, and the carton at 4 is grey. Change the place back to `Fridge`. (Story 3: AC 3 and 3 a)
- [ ] In `Milk.md`, delete the row `full | 1 gal`. The fill of milk is amber. Reset `Milk.md`. (Story 3: AC 4)
- [ ] On the computer, put the pointer on a bar. No tooltip shows. (Story 3: AC 5)

## F. A meal from the open package (story 4)

Reset `Eggs.md`, `Milk.md`, `Flour.md`, `Sugar.md`, and `Onions.md` before each line.

- [ ] Cook "Boiled eggs" to the end, with the eggs used. `Eggs.md` has only `Fridge | 12 | 12 | 2026-11-16`. (Story 4: AC 1)
- [ ] Cook "Super Test Recipe" to the end, with each ingredient used. `Eggs.md` has `2 | 12` and `12 | 12`. `Milk.md` has `1/4` and `full`, as before. `Flour.md` has `3/4`. (Story 4: AC 2, 3, 3 a, and 4)
- [ ] Cook the pancakes to the end. `Sugar.md` still has `1/4`. (Story 4: AC 5)
- [ ] Cook "Pasta with tomato sauce" to the end. The last page has onion in "Not counted". `Onions.md` keeps its row, and has the property `check: true`. (Story 4: AC 6 and 6 a)
- [ ] Set `Milk.md` to only `Fridge | 1/4 | 1 gal |`. Give a recipe the line `*4 cups* milk`, and cook it to the end. `Milk.md` has no row, and milk is out. (Story 4: AC 7)

## G. Put away a package (story 5)

- [ ] Put milk, 1 gal, on the list and in the cart. At put away, select "Fridge" and the use-by date 2026-11-02, and tap "Put away". `Milk.md` has a third row `Fridge | full | 1 gal | 2026-11-02`. (Story 5: AC 1)
- [ ] Put away eggs, 12, in "Fridge". `Eggs.md` has a third row `Fridge | 12 | 12 |`. (Story 5: AC 2)
- [ ] Put away apples, 6. `Apples.md` has two rows: `2 | 6` and `6 | 6`. (Story 5: AC 3)
- [ ] On a line of milk, select "Another amount" and type "1 gall". The line says "Select a size", and "Put away" does nothing. (Story 5: AC 4)

## H. The card (story 6)

Reset the notes of the stories page before this part.

- [ ] In "Fridge", tap the line of milk. The card shows "Milk", "Fridge · 2 here", and "1 1/4 gal". The handle is on the jug at 1/4, and the scale shows "1/4 of 1 gal" and "2 gal". (Story 6: AC 1, 1 a, and 1 b)
- [ ] Drag the full jug to the middle of its part. It is at 1/2, and the total is "3/4 gal". Tap "Done". `Milk.md` has `Fridge | 1/2 | 1 gal | 2026-10-29`. (Story 6: AC 2 and 2 a)
- [ ] Open eggs, and drag the first carton to a third of its part. The scale shows "4 of 12". Tap "Cancel". (Story 6: AC 3)
- [ ] Open black beans, and drag the first can to full. The handle stays on that can, and the can stays the first part. Tap "Cancel". (Story 6: AC 4 and 4 a)
- [ ] Open milk, and drag the jug at 1/4 to the left end. The scale shows "Empty · 1 gal", and the total is "1 gal". Tap "Done". `Milk.md` has only the row of 2026-10-29. Reset `Milk.md`. (Story 6: AC 5 and 5 a)
- [ ] Tap "Empty" and "Done". `Milk.md` has only the row of 2026-10-29. Reset `Milk.md`. (Story 6: AC 6)
- [ ] Open milk and tap "Done" with no change. The note does not change. (Story 6: AC 7)
- [ ] Add `check: true` to `Onions.md`. Open onions, drag them to 1/4, and tap "Done". `Onions.md` has no property `check`. (Story 6: AC 8)

## I. Add a package (story 7)

- [ ] Open eggs, and tap "+ Add package" two times. The bar has 4 parts, and the total is "40". Tap "Done". `Eggs.md` has two more rows `Fridge | 12 | 12 |`. (Story 7: AC 1 and 1 a)
- [ ] Open milk, and tap "+ Add package". The handle is on the new jug, and the scale shows "full of 1 gal". Drag it to 1/2, and tap "Done". `Milk.md` has `Fridge | 1/2 | 1 gal |`. (Story 7: AC 2 and 3)
- [ ] On the computer, make the tab narrow. "+ Add package" and "Done" each show on one line. (Story 7: AC 4)

## J. Place and date (story 8)

Reset `Milk.md`.

- [ ] Open milk, put the handle on the full jug, and tap "Place and date". Tap "Freezer" and "Done". `Milk.md` has `Freezer | full | 1 gal | 2026-10-29`, and milk has a line in "Freezer". (Story 8: AC 1 and 1 a)
- [ ] Open milk, put the handle on the jug of 2026-10-22, open "Place and date", clear the date, and tap "Done". That row has no date. (Story 8: AC 2)
- [ ] On the phone, open black beans and "Place and date". Each chip and the date field are inside the card. (Story 8: AC 3)

## K. The package size with a chip (story 9)

Reset `Milk.md`.

- [ ] Open milk, and tap "Size, names, and brands". The form shows "1" and the chip "gal" on. (Story 9: AC 1)
- [ ] Type "64", tap "fl oz", and "Save". `Milk.md` has the property `size: 64 fl oz`. Open milk, and tap "+ Add package". The new package is "full of 64 fl oz", and the two jugs are as before. Tap "Cancel". (Story 9: AC 2 and 2 a)
- [ ] Open the form of eggs. The chip "Count" is on, and the number is "12". (Story 9: AC 3)
- [ ] On the phone, each chip of the form of milk is inside the form. Remove `size` from `Milk.md`. (Story 9: AC 4)

## L. Add new food (story 10)

- [ ] Tap the plus button, and type "mil". The list shows "Milk" and "New: mil". (Story 10: AC 1)
- [ ] Tap "Milk". The card of milk opens in "Fridge" with a third jug, full, and the handle on it. Tap "Cancel". (Story 10: AC 2)
- [ ] Tap the plus button, type "Oat milk", tap "New: Oat milk", type "64", tap "fl oz", "Next", "Fridge", and "Add". `Oat milk.md` has `Fridge | full | 64 fl oz |`, and its card is open. (Story 10: AC 3 and 3 a)
- [ ] Tap the plus button, and type "brand c". The list shows "Taco seasoning". Delete `Oat milk.md`. (Story 10: AC 4)

## M. The audit (story 11)

- [ ] Add `check: true` to `Onions.md`. Tap "Audit". The head says "Audit · 1 of 3" and "Kitchen pantry". Onions are first, with "Check". (Story 11: AC 1 and 1 a)
- [ ] Tap "Right" on onions. `Onions.md` has no property `check`, and onions move to the end, grey, with a check mark. (Story 11: AC 2 and 2 a)
- [ ] Tap "Next place", then "Stop". Tap "Audit" again: it starts at "Fridge". (Story 11: AC 3)
- [ ] Tap milk, drag the jug at 1/4 to full, and tap "Done". `Milk.md` has `Fridge | full | 1 gal | 2026-10-22`, and milk is grey with a check mark. (Story 11: AC 4 and 4 a)
- [ ] Tap "Next place". "Freezer" says "3 of 3". Tap "Done". Tap "Audit" again: it starts at "Kitchen pantry". (Story 11: AC 5)
