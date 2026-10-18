# Check list: one row for each package

This list tests the seven package stories of version 0.5.0, on the phone. Do the parts in sequence. Each part starts from the state that the part before it leaves, unless the part says "Reset". Each line has one action and what you must see. The text in brackets is the story and its criterion, from [Packages stories](../docs/features/v0.5.0/packages-stories.md). Story numbers are the numbers of that page.

"Reset" a note means: copy its text again from the section "What the vault needs" of that page.

## Before you start

- [ ] `Larder/Pantry/Milk.md` has `full: 2 gal`, `low: 1/2 gal`, and two rows in "Fridge": `1/2 gal | 1 gal | 2026-10-22` and `1 gal | 1 gal | 2026-10-29`.
- [ ] `Eggs.md` has `full: "24"` and the rows `2 | 12 | 2026-10-25` and `12 | 12 | 2026-11-16`, in "Fridge".
- [ ] `Black beans.md` has 8 rows in "Kitchen pantry": 5 of `15 oz` with 2027-03-01, 2 of `15 oz` with 2027-06-01, and the last row `7.5 oz | 15 oz | 2027-03-01`.
- [ ] `Apples.md` has no property and the row `Fridge | 2 | | 2026-10-28`. `Flour.md` has one row of `1000 g` with no size.
- [ ] `Larder/Shopping/2026-10-14.md` has a row of milk (1 gal, 3.99) and a row of eggs (12, 3.49).
- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.

## A. One line for each food item in each place

- [ ] Open the Pantry part, "By place". The group "Kitchen pantry" has one line of black beans: "112.5 oz · 8 packages". (Story 2: AC 1 and 1 a)
- [ ] The group "Fridge" has one line of milk: "1 1/2 gal · 2 packages". (Story 1: AC 1 and 1 a. Story 2: AC 2 and 2 a)
- [ ] The line of flour shows "1000 g", with no number of packages. (Story 2: AC 3)
- [ ] The line of milk has a badge with the days to 22 October: "4 days" on 18 October, "2 days" on 20 October. (Story 2: AC 4)
- [ ] Tap the filter "Use soon". The list has one line of milk, not two. Tap the filter again to put it off. (Story 2: AC 7)

## B. Set what is left in a package

- [ ] Tap the line of milk. The open line shows "1 sealed · 2026-10-29", with "−" and "+", and one bar with the date 2026-10-22 at "1/2 gal". The end of the bar says "1 gal". (Story 3: AC 1 and 1 a)
- [ ] Press the bar a little after a quarter. The amount is "1/4 gal". Press it a little before the middle of a quarter and three eighths: still "1/4 gal". Press it a little after that middle: "3/8 gal". (Story 3: AC 2, 3, and 4)
- [ ] Drag the bar to "1/4 gal", and tap "Done". `Milk.md` has `Fridge | 1/4 gal | 1 gal | 2026-10-22`, and the row of 2026-10-29 is as before. (Story 3: AC 9 and 9 a)
- [ ] Open milk again, and tap "Done" with no change. The note does not change: its time of change in the file list stays. (Story 3: AC 11)
- [ ] Open the line of eggs. Press the bar of the carton with 2 a little after the 3. The amount is "3". Tap "Done". (Story 3: AC 5)
- [ ] Open the line of black beans. It shows "5 sealed · 2027-03-01" and "2 sealed · 2027-06-01", and one bar of 15 oz at "7.5 oz". (Story 3: AC 6 and 6 a)
- [ ] Tap the text "5 sealed · 2027-03-01". The count is "4 sealed", and a second bar of 15 oz shows, full. Tap "Done": the note does not change. (Story 3: AC 7 and 7 a)
- [ ] On the computer, open milk, put the focus on the bar with Tab, and press the right arrow key. The amount moves by 1/8 gal. (Story 3: AC 12)
- [ ] On the phone, a drag to the side on a bar does not open the side panel of Obsidian. (Story 3: requirement 10)

## C. Add and use up a package

Start from the open line of black beans.

- [ ] Tap "+" on "2 sealed · 2027-06-01". The count is "3 sealed", with a small pop. `Black beans.md` has 9 rows. (Story 4: AC 1 and 1 a)
- [ ] Tap "−" on "3 sealed · 2027-06-01" two times. The count is "1 sealed". `Black beans.md` has the row `Kitchen pantry | 0 | 15 oz | 2027-06-01`. (Story 4: AC 2 and 2 a)
- [ ] Tap "−" on "5 sealed · 2027-03-01". `Black beans.md` has 1 empty row and 6 rows that are not empty. (Story 4: AC 3 and 3 a)
- [ ] Tap "Add package". The open line shows "1 sealed · No date", and the empty row of the note is now `Kitchen pantry | 15 oz | 15 oz |`. (Story 4: AC 4 and 4 a)
- [ ] Tap "Used up" on the bar of 7.5 oz. The bar slides to 0 and goes out. The row of that can is `Kitchen pantry | 0 | 15 oz | 2027-03-01`. (Story 4: AC 5 and 5 a)
- [ ] With "Reduce motion" on in the phone settings, "+" changes the count with no pop, and "Used up" removes the bar with no slide. Put it off again.
- [ ] Open the line of eggs, and tap "Edit" next to the carton with 3. The form shows "Size" with "12". Type "18", and tap "Save". `Eggs.md` has `Fridge | 3 | 18 | 2026-10-25`. (Story 4: AC 7 and 8)
- [ ] Open milk. Tap "Used up" on the open jug, and then "−" on "1 sealed". Milk is a dashed line in the group "Out", and the group "Fridge" has no line of milk. `Milk.md` has one row, an empty row. (Story 1: AC 13. Story 2: AC 6 and 6 a. Story 4: AC 6 and 6 a)
- [ ] Open Shop. Milk is on the list, with the reason "Out". (Spec, test 6)

## D. The empty row

Reset `Eggs.md`.

- [ ] In the form of the carton with 2 eggs (2026-10-25), tap "Used up". `Eggs.md` has `Fridge | 0 | 12 | 2026-10-25`, and the row of 12 eggs is as before. (Story 1: AC 10 and 10 a)
- [ ] The line of eggs has no badge. Shop has no suggestion "Past its date" or "Use by" for eggs. (Story 1: AC 12 and 12 a. Story 2: AC 5)
- [ ] Open eggs, and tap "−" on "1 sealed". `Eggs.md` has one row: `Fridge | 0 | 12 | 2026-10-25`. (Story 1: AC 11 and 11 a)

## E. A meal takes from each package

Reset `Eggs.md`, `Milk.md`, and `Black beans.md`.

- [ ] The recipe list shows the pancakes with their milk in the pantry: the pantry has gallons, and the pancakes need 300 ml. (Story 1: AC 6)
- [ ] Cook the boiled eggs to the end, and tap the last button. `Eggs.md` has `Fridge | 0 | 12 | 2026-10-25` and `Fridge | 10 | 12 | 2026-11-16`. (Story 5: AC 1 and 1 a)
- [ ] Reset `Eggs.md`. Cook the pancakes with only the egg checked. `Eggs.md` has `Fridge | 1 | 12 | 2026-10-25`, and the row of 12 eggs is as before. (Story 5: AC 2 and 2 a)

## F. Put away one line for each package

Reset `Milk.md` and `Eggs.md`. In Shop, tick milk, eggs, and flour into the cart, and tap "Put away". Milk and eggs have a last receipt, so they are in the group "Known". Open that group.

- [ ] The stage has 1 line of eggs, with "12", "Fridge", and 3.49. (Story 6: AC 1 and 1 a)
- [ ] The line of flour has the amount of its list row. (Story 6: AC 3)
- [ ] Open the line of milk, and tap "+ package". A second line of milk slides in below it, with "1 gal", "Fridge", and 3.99. The receipt note has 2 rows of milk. (Story 6: AC 4 and 4 a)
- [ ] Set the date of the second line of milk to 2026-11-05. The first line keeps its date. (Story 6: AC 5)
- [ ] Open the line of eggs, and tap "+ package". The button at the lower edge says "Put away 4 known": it counts the lines. (Story 6: requirement 8)
- [ ] Tap "Not bought" on the first line of eggs. The stage has 1 line of eggs, and the task of eggs is still in the cart. (Story 6: AC 10 and 10 a)
- [ ] Tap "+ package" on the eggs again. Tap "Put away" on each line of eggs. The receipt has 2 rows of eggs, each with "12" and 3.49, and `Eggs.md` has two new rows of 12. (Story 6: AC 9 and 9 a)
- [ ] Put away the first line of milk with the date 2026-11-01. `Milk.md` has 3 rows: the two rows of before, as before, and `Fridge | 1 gal | 1 gal | 2026-11-01`. `full` is `2 1/2 gal`. (Story 6: AC 6, 6 a, and 6 b. Story 1: AC 14)
- [ ] Before you put away the second line of milk, set `Milk.md` to the one row `Fridge | 0 | 1 gal | 2026-10-22`. Put away the line with the date 2026-11-01. `Milk.md` has only `Fridge | 1 gal | 1 gal | 2026-11-01`. (Story 6: AC 7)
- [ ] Add "Quinoa" as a new item, tick it, and put it away with "1 lb" and "Into the pantry" on. `Quinoa.md` has the amount `1 lb` and the size `1 lb`. (Story 6: AC 8)

## G. Loose food

Reset `Apples.md`. Tick apples into the cart with the amount 6, and tap "Put away".

- [ ] The stage has 1 line of apples. Open it, and tap the chip "Loose". `Apples.md` has `loose: true`. (Story 7: AC 1)
- [ ] Put the line away with 6 in "Fridge". `Apples.md` has one row in "Fridge": `8 | 8`. (Story 7: AC 2 and 2 a)
- [ ] Put 6 more apples away in "Kitchen pantry". `Apples.md` has a new row in "Kitchen pantry", and the row of "Fridge" is as before. (Story 7: AC 3 and 3 a)
- [ ] Open the line of apples in the Pantry part. It shows one bar, full, and no count. (Story 7: requirement 3)
- [ ] Tap "Edit" for the form. Tap the chip "Loose" off. `Apples.md` has no property `loose`. (Story 7: AC 5)
- [ ] Reset `Apples.md`. Put 6 apples away in "Fridge". `Apples.md` has two rows in "Fridge". (Story 7: AC 4)
