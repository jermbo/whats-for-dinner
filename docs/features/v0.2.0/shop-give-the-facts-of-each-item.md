---
title: Give the facts of each item at put away
summary: "The keeper sees each item of the cart filled in with its amount, place, use-by date, and price, checks it, corrects it with one tap, and puts all away with one button."
parent: shop-stories.md
updated: 2026-10-14
persona: Keeper
depends-on: [shop-get-a-receipt-for-each-trip.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Give the facts of each item at put away

# Give the facts of each item at put away

As the [keeper](../../personas.md), I want each item of the cart filled in with its amount, its place, its use-by date, and its price before I put the cart away, so that I only check it, and correct what is wrong with one tap.

## Requirements

1. Tap "Put away" in the Shop part to open the screen of put away
   - a. The screen has one line for each item of the cart
   - b. The pantry does not change when the screen opens
2. Each fact of an item starts filled in
   - a. The amount starts as the larger of two amounts: the amount of its row on the list, and what makes the food item full
   - b. With none of the two, the amount starts as "1"
   - c. The place starts as the place of the first row of the food item
   - d. With no row, the place starts as the setting "Place for new food"
   - e. The use-by date and the price start empty
   - f. "Sale" starts off
3. The lines are in one group for each place
   - a. The title of a group is its place, with the number of its lines
   - b. The groups are from A to Z, and the lines of a group are from A to Z
   - c. The items that are not in the pantry are the last group, "Not in the pantry"
4. A closed line shows its facts as text, and it has only the chip "Sale"
   - a. The text has the name, the amount, the use-by date or "No date", and the price
   - b. A missing price shows as "–"
   - c. The text has "no place yet" when the place comes from the setting "Place for new food", and you did not select a place
   - d. An item that is not in the pantry shows only its name and its price
5. Tap a line to open it, and tap it again to close it
   - a. One line is open at a time
   - b. The open line has the price, "How much", "Use by", "Where", and "Not bought"
   - c. The open line stays in its group. When it closes, it goes into the group of its place
6. Correct a fact of the open line with one tap
   - a. "How much" has the amount that the item starts with as an option, and a field for a different amount
   - b. "Use by" has the options "No date", "3 days", "1 week", "2 weeks", and "1 month", from today, and a field for a date
   - c. "Where" has one option for each place that the pantry has, and a field for a new place
   - d. The price is a field with the keyboard for numbers, for the full amount of the item
7. Tap "Sale" on a line when the item was on sale
   - a. "Sale" is on, and the line opens with the cursor in the price
   - b. A second tap puts "Sale" off
   - c. A price that you typed stays
8. Tap "Not bought" on an item to take it out of the cart
   - a. The task of a choice loses its mark
   - b. The task of a row of a meal goes out of the open note
   - c. The item goes off the screen
9. The screen tells how many prices are missing
   - a. The text is "1 price is missing", or "2 prices are missing"
   - b. With no missing price, the text does not show
10. Tap "Put into the pantry" to put all items of the screen away, and to end the trip
    - a. The button works with an empty price and an empty use-by date
    - b. The amount goes into the row of the place, if the two have the same use-by date and units that compare
    - c. If not, the amount is a new row, with the place and the use-by date
    - d. The row of the receipt has the amount, the price with 2 decimals, the place, and the use-by date
    - e. The cell "Sale" has "yes" for an item that was on sale, and it is empty for each other item
11. Tap "Back" to close the screen with no change of the pantry
    - a. The cart is as before

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-13, with the guacamole in the plan. The cart has three items of the pantry: lime and avocados, from rows of a meal, and milk, from a task that you typed into the open note. The pantry has 2 limes of 4 in "Kitchen pantry", no avocados of 4, and 450 ml of milk of 1 l in "Kitchen".

1. GIVEN the cart has 3 items WHEN the keeper taps "Put away" in the Shop part THEN the screen of put away shows 3 lines
   - a. AND the note `Milk` has the row "Kitchen" with "450 ml"
2. GIVEN the screen of put away is open WHEN the keeper looks at the amounts THEN the amount of lime is "2"
   - a. AND the amount of avocados is "4"
   - b. AND the amount of milk is "550 ml"
3. GIVEN the screen of put away is open WHEN the keeper looks at the groups THEN the first group is "Kitchen", with avocados and milk in this sequence
   - a. AND the second group is "Kitchen pantry", with lime
4. GIVEN the screen of put away is open WHEN the keeper looks at the line of milk THEN the line says "Milk", "550 ml", "No date", and "–"
   - a. AND "Sale" is off
   - b. AND the line has no field
5. GIVEN the screen of put away is open WHEN the keeper looks at the line of avocados THEN the line has "no place yet"
   - a. AND the line of milk has no "no place yet"
6. GIVEN the line of avocados is open WHEN the keeper taps "Kitchen" in "Where" THEN the line has no "no place yet"
7. GIVEN the screen of put away is open WHEN the keeper looks at the text below the lines THEN the text is "3 prices are missing"
8. GIVEN the screen shows "3 prices are missing" WHEN the keeper types the price "1.29" for milk THEN the text is "2 prices are missing"
9. GIVEN each item has a price WHEN the keeper looks at the text below the lines THEN no text about prices shows
10. GIVEN the screen of put away is open WHEN the keeper taps the line of milk THEN the line shows the price, "How much", "Use by", "Where", and "Not bought"
    - a. AND "How much" has the option "550 ml", and it is on
11. GIVEN the line of milk is open WHEN the keeper taps the line of lime THEN the line of milk is closed
    - a. AND the line of lime is open
12. GIVEN the line of milk is open WHEN the keeper taps "Kitchen fridge" in "Where" THEN milk is still in the group "Kitchen"
13. GIVEN the keeper tapped "Kitchen fridge" for milk WHEN the keeper taps the line of milk to close it THEN the screen has the group "Kitchen fridge", with milk
    - a. AND the group "Kitchen" has 1 line
14. GIVEN the line of milk is open WHEN the keeper taps "1 week" in "Use by" THEN the line says "Use by 20 Oct"
15. GIVEN milk has the use-by date 2026-10-20 WHEN the keeper taps "No date" in "Use by" THEN the line says "No date"
16. GIVEN the screen of put away is open WHEN the keeper taps "Sale" on lime THEN "Sale" of lime is on
    - a. AND the line of lime is open
    - b. AND the cursor is in the price of lime
17. GIVEN "Sale" of lime is on, and the keeper typed "0.5" WHEN the keeper taps "Sale" on lime THEN "Sale" of lime is off
    - a. AND the price of lime is "0.5"
18. GIVEN the keeper set milk to "1 l", "Kitchen fridge", the date 2026-10-20, and the price "1.29" WHEN the keeper taps "Put into the pantry" THEN the note `Milk` has the row "Kitchen fridge" with "1 l" and the date 2026-10-20
    - a. AND the note `Milk` has the row "Kitchen" with "450 ml"
    - b. AND the row of milk in the receipt has "1 l", "1.29", "Kitchen fridge", and "2026-10-20"
    - c. AND the cell "Sale" of that row is empty
19. GIVEN the keeper changed no fact of milk WHEN the keeper taps "Put into the pantry" THEN the note `Milk` has one row "Kitchen" with "1000 ml"
20. GIVEN the keeper tapped "Sale" on lime and typed the price "0.5" WHEN the keeper taps "Put into the pantry" THEN the row of lime in the receipt has the price "0.50"
    - a. AND the cell "Sale" of that row has "yes"
21. GIVEN no item has a price WHEN the keeper taps "Put into the pantry" THEN the vault has the receipt `Shopping/2026-10-13`
    - a. AND the cell "Price" of each row is empty
22. GIVEN the keeper typed the place "Garage" for avocados WHEN the keeper taps "Put into the pantry" THEN the note `Avocados` has the row "Garage" with "4"
23. GIVEN the screen shows lime, from a row of a meal WHEN the keeper taps "Not bought" on lime THEN the screen shows 2 lines
    - a. AND the open note has no task for lime
24. GIVEN the screen shows milk, from a task of the open note WHEN the keeper taps "Not bought" on milk THEN the open note has the line `- [ ] [[Pantry/Milk|Milk]]`
25. GIVEN the keeper typed the price "1.29" for milk WHEN the keeper taps "Back" THEN the note `Milk` has the row "Kitchen" with "450 ml"
    - a. AND the cart has 3 items
26. GIVEN the cart has the item "Batteries", with a link into the folder for items WHEN the keeper opens the screen of put away THEN "Batteries" is in the last group, "Not in the pantry"
    - a. AND its line shows only its name, its price, and "Sale"
27. GIVEN the keeper typed the price "6.99" for "Batteries" WHEN the keeper taps "Put into the pantry" THEN the row of batteries in the receipt has the price "6.99"
    - a. AND the cells "Amount", "Place", and "Use by" of that row are empty

## Depends on

- [Get a receipt for each trip](shop-get-a-receipt-for-each-trip.md): the button that ends the trip, and the table of the receipt.

## Architecture

- [Put away](../../architecture/put-away.md): the screen, its groups and lines, and the button that ends the trip.
- [Facts of an item](../../architecture/put-away-facts.md): what each fact starts as, and when a row gets larger.
- [Amounts](../../architecture/amounts.md): which units compare.
- [Food item note](../../architecture/food-item-note.md): the table that the button writes.
- [Receipt](../../architecture/receipt.md): the columns of the receipt.
