---
title: Give the facts of each item at put away
summary: "The keeper sees each item of the cart with its amount, place, use-by date, and price, corrects them, and puts all away with one button."
parent: shop-stories.md
persona: Keeper
depends-on: [shop-get-a-receipt-for-each-trip.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / Give the facts of each item at put away

# Give the facts of each item at put away

As the [keeper](../../personas.md), I want to see each item of the cart with its amount, its place, its use-by date, and its price before I put the cart away, so that the pantry gets what I really bought, and the receipt gets what I paid.

## Requirements

1. Tap "Put away" in the Shop part to open the screen of put away
   - a. The screen has one line for each item of the cart
   - b. The pantry does not change when the screen opens
2. Each item shows its amount, and you can change it
   - a. It starts as the larger of two amounts: the amount of its row on the list, and what makes the food item full
   - b. With none of the two, it starts as "1"
3. Each item shows its place, and you can change it
   - a. It starts as the place of the first row of the food item
   - b. With no row, it starts as the setting "Place for new food"
   - c. One tap selects a place that the pantry has
   - d. A text field takes a place that is new
4. Each item shows its use-by date, its price, and the mark "On sale"
   - a. The use-by date and the price start empty
   - b. The price is a number, for the full amount of the item
   - c. "On sale" starts off, and one tap changes it
5. An item that is not in the pantry shows only its price and "On sale"
6. Tap "Not bought" on an item to take it out of the cart
   - a. The task of a choice loses its mark
   - b. The task of a row of a meal goes out of the open note
   - c. The item goes off the screen
7. The screen tells how many prices are missing
   - a. The text is "1 price is missing", or "2 prices are missing"
   - b. With no missing price, the text does not show
8. Tap "Put into the pantry" to put all items of the screen away, and to end the trip
   - a. The button works with an empty price and an empty use-by date
   - b. The amount goes into the row of the place, if the two have the same use-by date and units that compare
   - c. If not, the amount is a new row, with the place and the use-by date
   - d. The row of the receipt has the amount, the price with 2 decimals, the place, and the use-by date
   - e. The cell "Sale" has "yes" for an item that was on sale, and it is empty for each other item
9. Tap "Back" to close the screen with no change of the pantry
   - a. The cart is as before

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-13, with the guacamole in the plan. The cart has three items of the pantry: lime and avocados, from rows of a meal, and milk, from a task that you typed into the open note. The pantry has 2 limes of 4 in "Kitchen pantry", no avocados of 4, and 450 ml of milk of 1 l in "Kitchen".

1. GIVEN the cart has 3 items WHEN the keeper taps "Put away" in the Shop part THEN the screen of put away shows 3 items
   - a. AND the note `Milk` has the row "Kitchen" with "450 ml"
2. GIVEN the screen of put away is open WHEN the keeper looks at the amounts THEN the amount of lime is "2"
   - a. AND the amount of avocados is "4"
   - b. AND the amount of milk is "550 ml"
3. GIVEN the screen of put away is open WHEN the keeper looks at the places THEN the place of lime is "Kitchen pantry"
   - a. AND the place of milk is "Kitchen"
   - b. AND the place of avocados is "Kitchen"
4. GIVEN the screen of put away is open WHEN the keeper looks at milk THEN its use-by date is empty
   - a. AND its price is empty
   - b. AND "On sale" is off
5. GIVEN the screen of put away is open WHEN the keeper looks at the text below the items THEN the text is "3 prices are missing"
6. GIVEN the screen shows "3 prices are missing" WHEN the keeper types the price "1.29" for milk THEN the text is "2 prices are missing"
7. GIVEN each item has a price WHEN the keeper looks at the text below the items THEN no text about prices shows
8. GIVEN the keeper set milk to "1 l", "Kitchen fridge", the date 2026-10-20, and the price "1.29" WHEN the keeper taps "Put into the pantry" THEN the note `Milk` has the row "Kitchen fridge" with "1 l" and the date 2026-10-20
   - a. AND the note `Milk` has the row "Kitchen" with "450 ml"
   - b. AND the row of milk in the receipt has "1 l", "1.29", "Kitchen fridge", and "2026-10-20"
   - c. AND the cell "Sale" of that row is empty
9. GIVEN the keeper changed no fact of milk WHEN the keeper taps "Put into the pantry" THEN the note `Milk` has one row "Kitchen" with "1000 ml"
10. GIVEN the keeper typed the price "0.5" for lime and tapped "On sale" WHEN the keeper taps "Put into the pantry" THEN the row of lime in the receipt has the price "0.50"
    - a. AND the cell "Sale" of that row has "yes"
11. GIVEN no item has a price WHEN the keeper taps "Put into the pantry" THEN the vault has the receipt `Shopping/2026-10-13`
    - a. AND the cell "Price" of each row is empty
12. GIVEN the keeper typed the place "Garage" for avocados WHEN the keeper taps "Put into the pantry" THEN the note `Avocados` has the row "Garage" with "4"
13. GIVEN the screen shows lime, from a row of a meal WHEN the keeper taps "Not bought" on lime THEN the screen shows 2 items
    - a. AND the open note has no task for lime
14. GIVEN the screen shows milk, from a task of the open note WHEN the keeper taps "Not bought" on milk THEN the open note has the line `- [ ] [[Pantry/Milk|Milk]]`
15. GIVEN the keeper typed the price "1.29" for milk WHEN the keeper taps "Back" THEN the note `Milk` has the row "Kitchen" with "450 ml"
    - a. AND the cart has 3 items
16. GIVEN the cart has the item "Batteries", with a link into the folder for items WHEN the keeper opens the screen of put away THEN "Batteries" shows only its price and "On sale"
17. GIVEN the keeper typed the price "6.99" for "Batteries" WHEN the keeper taps "Put into the pantry" THEN the row of batteries in the receipt has the price "6.99"
    - a. AND the cells "Amount", "Place", and "Use by" of that row are empty

## Depends on

- [Get a receipt for each trip](shop-get-a-receipt-for-each-trip.md): the button that ends the trip, and the table of the receipt.

## Architecture

- [Put away](../../architecture/put-away.md): the three decisions that the plugin makes for each item today, and when a row gets larger.
- [Amounts](../../architecture/amounts.md): which units compare.
- [Food item note](../../architecture/food-item-note.md): the table that the button writes.
- [Shopping note](../../initiatives/shopping-list/shopping-note.md): the columns of the receipt. It is a page of the initiative.
