# Check list: shopping list

This list tests the ten stories of the shopping list. Do the parts in sequence. Each part starts from the state that the part before it leaves.

Each line has one action and what you must see. The text in brackets is the story and its criterion.

## The day of your test

`<today>` is the day of your test, as year-month-day, such as `2026-10-13`. A date shows in the form of your device: "4 Oct" or "Oct 4".

The texts of this list are for 13 October 2026. On a later day, three things are different:

- From 14 October, part 2 has 2 more suggestions: chicken thighs and spinach, with "Past its date". Part 3 tests them.
- From 16 October, fresh coriander has "Past its date". From 20 October, eggs have "Use by 25 Oct".
- A use-by date that the plugin proposes is later by the same number of days.

## Before you start

- [ ] Run `git add test-vault`. Then you can do the test again: see the last part.
- [ ] Run `npm run build`. Then restart Obsidian, or put the plugin off and on.
- [ ] The folder `Shopping` has two notes: `2026-09-28` and `2026-10-04`. It has no note `Next trip`.
- [ ] The plan has 9 meals, with "Chicken curry", "Guacamole", and "Quinoa bowl".
- [ ] The settings of the plugin have "Shopping folder" with `Shopping`, "Items folder" with `Shopping/Items`, and "Place for new food" with `Kitchen`.

## 1. Label a staple

In the Pantry part. This is story 2.

- [ ] Tap the row of butter, and then "Place, date, and low line". The form has "Staple" with 4 options: "Not a staple", "Often", "Sometimes", and "Seldom". "Not a staple" is on. (AC 1, 1 a)
- [ ] Tap "Often". Only "Often" is on. (AC 2, 2 a)
- [ ] Tap "Cancel". The note `Butter` has no `staple`. (AC 9)
- [ ] Open the form again, tap "Often", and tap "Save". The note has `staple: often`. Its row is the same: 130 g in "Kitchen fridge". (AC 3, 3 a)
- [ ] Open the form again. "Often" is on. (AC 4)
- [ ] Tap "Sometimes" and "Save". The note has `staple: sometimes`. (AC 5)
- [ ] Tap "Seldom" and "Save". The note has `staple: seldom`. (AC 6)
- [ ] Tap "Not a staple" and "Save". The note has no `staple`. (AC 7)
- [ ] Change only the amount to "140 g", and tap "Save". The note has no `staple`. Set the amount back to "130 g". (AC 8)
- [ ] In the note `Salt`, change the property to `staple: Seldom`, with a capital letter. Open the form of salt. "Seldom" is on. (AC 10)
- [ ] Change the property to `staple: weekly`. Open the form of salt again. "Not a staple" is on. (AC 11)
- [ ] Set the property of salt back to `staple: seldom`.

## 2. Suggestions

In the Shop part. This is story 3.

- [ ] The Shop part has no check box "Low food on the list". (AC 24)
- [ ] The group "Suggestions" is above the list. It has 7 lines, with the reasons and the facts of this table. (AC 1 to 4, 6, 8, 9, 14, 15)

| Line            | Reason              | Facts                                     |
| --------------- | ------------------- | ----------------------------------------- |
| Avocados        | Out                 | Bought 1 Oct                              |
| Eggs            | Often               | 6 · Bought 4 Oct · Use by 25 Oct          |
| Flour           | Low                 | 200 g · Bought 30 Sep                     |
| Fresh coriander | Use by 15 Oct       | 1 bunch · Bought 10 Oct · Use by 15 Oct   |
| Oats            | No purchase date    | 50 g                                      |
| Rice            | Low                 | 750 g · Bought 20 Sep · Use by 1 Jun 2027 |
| Salt            | Bought 2 months ago | 1 box · Bought 10 Aug                     |

- [ ] The group has no line for sugar, and no line for ginger. (AC 1 a, 1 b)
- [ ] The list has 6 rows: "Avocados 4", "Coconut milk 0.5 cans", "Lime 1", "Peanuts 70 g", "Quinoa 200 g", and "Raisins 80 g". It has no row "Ginger". (AC 24 a)
- [ ] The row "Avocados" has "4", not "2". A staple on the list fills.
- [ ] Tap "Add" on flour. The vault has the note `Shopping/Next trip`, with the line `- [ ] [[Pantry/Flour|Flour]]`. (AC 16)
- [ ] The list has the row "Flour" with "800 g" and with "Remove". The group has no line for flour. (AC 16 a, 16 b)
- [ ] Tap "Add" on salt. The list has the row "Salt" with no amount. (AC 18)
- [ ] Tap "Remove" on the row "Salt". The note has no task for salt, and salt is a suggestion again. (AC 23, 23 a)
- [ ] Tap "Skip" on salt. The line is gone, and the note has no task for salt. (AC 20, 20 a)
- [ ] Tap "Add" on eggs. The list has the row "Eggs" with "6". (AC 17)
- [ ] Open the bar, with the button next to the find field. It has the filters "For a meal" and "Your choices". (AC 25)
- [ ] Tap "Your choices". The list shows "Eggs" and "Flour", and it does not show "Lime". Put the filter off. (AC 26, 26 a)
- [ ] Select the sequence "By meal". The last group is "Your choices". Select "A to Z" again.

## 3. Food past its date

In the Shop part, with the notes `Chicken thighs`, `Spinach`, and `Meal plan` open next to it. This is story 4.

The chicken curry needs 500 g of chicken thighs, and the pantry has 500 g. The spinach omelette needs 100 g of spinach, and the pantry has 500 g.

- [ ] The list has no row "Chicken thighs". (AC 6)
- [ ] In the note `Chicken thighs`, set the date of the row to `<today>`. The group "Suggestions" has no line for chicken thighs. (AC 2)
- [ ] Set the date to `2026-10-01`. The group has the line "Chicken thighs", with "Past its date" and the facts "500 g · Use by 1 Oct". (AC 1, 1 a)
- [ ] The list still has no row "Chicken thighs". (AC 6)
- [ ] In the note `Meal plan`, change the task of the chicken curry to `- [x]`. The line of chicken thighs is gone. (AC 4)
- [ ] Change the task back to `- [ ]`. The line is there again.
- [ ] Tap "Add" on chicken thighs. The note `Shopping/Next trip` has the line `- [ ] [[Pantry/Chicken thighs|Chicken thighs]]`. (AC 7)
- [ ] The list has the row "Chicken thighs" with "500 g" and with "Remove". The group has no line for chicken thighs. (AC 7 a, 5)
- [ ] In the note `Spinach`, set the date of the row "Kitchen fridge" to `2026-10-01`. The group has the line "Spinach", with "Past its date". (AC 3)
- [ ] Tap "Add" on spinach. The list has the row "Spinach" with "100 g". (AC 8)
- [ ] Tap "Remove" on the row "Spinach". Spinach is a suggestion again.
- [ ] Tap "Skip" on spinach. The line is gone, and the note has no task for spinach. (AC 9, 9 a)

The group "Suggestions" has 4 lines now: avocados, fresh coriander, oats, and rice.

## 4. An item of your own

In the Shop part. This is story 5.

- [ ] Tap "+" in the bar. The field "Add an item" opens, with the cursor in it. "Add as new" is not active. (AC 6)
- [ ] Type "egg". The field proposes "Eggs". (AC 1)
- [ ] Type "EGG". The field proposes "Eggs". (AC 3)
- [ ] Type "pasta". The field proposes "Elbow pasta" and "Shell pasta". (AC 2)
- [ ] Type "egg", and tap "Eggs". The note still has 1 task for eggs. (AC 8)
- [ ] Type "but", and tap "Butter". The note has the line `- [ ] [[Pantry/Butter|Butter]]`. (AC 4)
- [ ] The list has the row "Butter" with no amount, and the field is empty. (AC 4 a, 4 b)
- [ ] Type "batteries", and tap "Add as new". The note has the line `- [ ] [[Shopping/Items/Batteries|Batteries]]`. (AC 5)
- [ ] The vault has no note `Shopping/Items/Batteries`. The list has the row "Batteries" with no amount. (AC 5 a, 5 b)
- [ ] Tap "Remove" on the row "Butter". The note has no task for butter, and the list has no row "Butter". (AC 9, 9 a)
- [ ] Tap "+" again. The field closes.

The note `Shopping/Next trip` has this text now:

```markdown
- [ ] [[Pantry/Flour|Flour]]
- [ ] [[Pantry/Eggs|Eggs]]
- [ ] [[Pantry/Chicken thighs|Chicken thighs]]
- [ ] [[Shopping/Items/Batteries|Batteries]]
```

## 5. The cart in the note

In the Shop part, with the note `Shopping/Next trip` open next to it. This is story 1.

- [ ] Tap the row "Lime". The last task of the note is `- [x] [[Pantry/Lime|Lime]]`. The cart has "Lime 1". (AC 1 a, 1 b, 2)
- [ ] Tap the row "Quinoa". The note has the line `- [x] [[Pantry/Quinoa|Quinoa]]`. The vault has no note `Pantry/Quinoa`. (AC 3, 3 a)
- [ ] Tap the row "Flour". Its line in the note has a mark now, and the note has 1 task for flour. The cart has "Flour 800 g". (AC 7, 7 a)
- [ ] Tap "Undo" on flour. Its line is `- [ ] [[Pantry/Flour|Flour]]` again, and flour is on the list. (AC 8)
- [ ] Tap "Undo" on lime. The note has no task for lime, and the list has "Lime 1" again. (AC 9, 9 a)
- [ ] Tap the row "Lime" again.
- [ ] In the note, type "Mum comes on Friday." as the first line, and `- [ ] Soap` as the last line. The list has the row "Soap", with no restart. (AC 4, 6)
- [ ] Tap the row "Avocados". The note still starts with "Mum comes on Friday.". (AC 10)
- [ ] In the note, change the line of lime to `- [x] [[Lime]]`. The cart still has "Lime 1". A link with no folder is the note of the pantry.
- [ ] Tap the row "Soap". Its line is `- [x] Soap`.
- [ ] In the Plan part, tap "Remove" on the guacamole. In the Shop part, "Avocados" is still in the cart. (AC 11)
- [ ] Put the guacamole in the week again, in the Recipes part.
- [ ] Restart Obsidian. The cart has the same 4 items. (AC 12)
- [ ] Salt and spinach are still not suggestions. (Story 3: AC 21)

The note has this text now:

```markdown
Mum comes on Friday.

- [ ] [[Pantry/Flour|Flour]]
- [ ] [[Pantry/Eggs|Eggs]]
- [ ] [[Pantry/Chicken thighs|Chicken thighs]]
- [ ] [[Shopping/Items/Batteries|Batteries]]
- [x] [[Pantry/Quinoa|Quinoa]]
- [x] [[Lime]]
- [x] Soap
- [x] [[Pantry/Avocados|Avocados]]
```

## 6. The screen of put away

In the Shop part. This is story 7, with the start of each fact from stories 8, 9, and 10.

Eggs and milk have a last receipt in the folder `Shopping`. The other items have none. The bracket "AC" without a story is story 7.

- [ ] Tap the rows "Eggs" and "Batteries". The cart has 6 items.
- [ ] Tap "+", type "mil", and tap "Milk". Tap "+" again. Tap the row "Milk". The cart has 7 items.
- [ ] The button below the cart says "Put away". Tap it. The screen "Put away" comes in from below. It has 7 lines, and no line is open. (AC 1)
- [ ] The note `Milk` still has one row: 450 ml in "Kitchen". (AC 1 a)
- [ ] The screen has 4 groups, with the lines of this table, in this sequence. A line has no field. (AC 2, 2 a, 3, 4, 4 b, 26, 26 a. Story 8: AC 1, 1 a to 1 c, 2, 2 a, 2 b, 3, 3 a, 3 b. Story 10: AC 1, 1 a)

| Group             | Line      | Amount | Text                       | Price |
| ----------------- | --------- | ------ | -------------------------- | ----- |
| Kitchen           | Avocados  | 4      | No date · no place yet     | –     |
| Kitchen           | Milk      | 1 l    | Use by 20 Oct              | 1.29  |
| Kitchen           | Quinoa    | 200 g  | No date · no place yet     | –     |
| Kitchen pantry    | Lime      | 2      | No date                    | –     |
| Outside fridge    | Eggs      | 12     | Use by 3 Nov               | 3.99  |
| Not in the pantry | Batteries |        |                            | –     |
| Not in the pantry | Soap      |        |                            | –     |

- [ ] The title of each group has the number of its lines: "Kitchen" has 3. (AC 3)
- [ ] The date of eggs is 21 days after today. The date of milk is 7 days after today. These are the days of the last receipt. (Story 8: AC 1 c, 2 b)
- [ ] The price of eggs is 3.99, from 28 September. The receipt of 4 October has 3.49, but with "yes" in "Sale". (Story 8: AC 1 b)
- [ ] Each line has the chip "Sale", and it is off. (AC 4 a. Story 8: AC 1 d)
- [ ] The head says "2/7 with a price". The text above the two buttons is "5 prices are missing". (AC 7. Story 8: AC 4)
- [ ] "Store" has the options "Market A" and "Market B", and the field "A new store". No option is on. (Story 9: AC 1, 1 a)
- [ ] Tap "Sale" on lime. It is on. The line opens, and the cursor is in the price. The field is empty, with the hint "Price". (AC 16, 16 a, 16 b)
- [ ] Type "0.5". The line says "0.50", and the text is "4 prices are missing". (AC 8)
- [ ] Tap "Sale" on eggs. The line of lime closes, and the line of eggs opens. The price field of eggs is empty, with the hint "3.99 regular". The text is "5 prices are missing". (Story 8: AC 14, 14 a)
- [ ] Tap "Sale" on eggs again. It is off, and the price is "3.99" again. The text is "4 prices are missing". (Story 8: AC 15)
- [ ] Tap "Sale" on lime again, and then a third time. "Sale" of lime is on, and its price is still "0.5". (AC 17, 17 a)
- [ ] Tap the line "Avocados". Type "abc" in the price. The field has a red edge, the line shows "abc" in red, and the text is still "4 prices are missing".
- [ ] Change the price of avocados to "3,2". The red edge is gone, the line says "3.20", and the text is "3 prices are missing".
- [ ] Tap "Kitchen" in "Where" of avocados. The line has no "no place yet". (AC 6)
- [ ] Tap the line "Milk". The line of avocados closes. The line of milk shows the price, "How much", "Use by", "Where", and "Not bought". "How much" has "1 l", and it is on. "Where" has each place of the pantry, and "Kitchen" is on. (AC 10, 10 a, 11, 11 a)
- [ ] Tap "Kitchen fridge". Only "Kitchen fridge" is on. Milk is still in the group "Kitchen". (AC 12)
- [ ] Tap the line of milk to close it. Milk moves into a new group, "Kitchen fridge". The group "Kitchen" has 2 lines. (AC 13, 13 a)
- [ ] Tap the line "Lime", and tap "1 week" in "Use by". The line says "Use by 20 Oct". Tap "No date". The line says "No date". (AC 14, 15)
- [ ] Tap the line "Avocados". Type "Garage" in "A new place". No option is on, and avocados stay in the group "Kitchen". Tap the line to close it. Avocados move into a new group, "Garage".
- [ ] Tap "Back". The Shop part shows, and the cart has 7 items. The notes `Milk` and `Avocados` did not change. (AC 25, 25 a)
- [ ] Tap "Put away" again. Each fact that you gave is still there: the two prices, "Sale" of lime, "Kitchen fridge", and "Garage".
- [ ] Open the line "Quinoa", and tap "Not bought". The line goes out, and the screen has 6 lines. The note has no task for quinoa. (AC 23, 23 a)
- [ ] Open the line "Eggs", and tap "Not bought". The screen has 5 lines, and the group "Outside fridge" goes out. The note has the line `- [ ] [[Pantry/Eggs|Eggs]]`. (AC 24)
- [ ] Tap the line "Soap". It has "Into the pantry", and it is off. (Story 10: AC 2, 2 a)
- [ ] Tap "Into the pantry". It is on. The line shows "1" in "How much", "Kitchen" in "Where", and an empty date. The line says "no place yet". (Story 10: AC 4, 4 a to 4 c)
- [ ] Type "2" in "Another amount", and "1.99" in the price. The text is "1 price is missing".
- [ ] Tap the line of soap to close it. Soap moves from "Not in the pantry" into the group "Kitchen". (Story 10: AC 5)
- [ ] Tap the line "Batteries", and type "6.99" in the price. No text about prices shows, and the head says "5/5 with a price". (AC 9)
- [ ] Tap "Market B". It is on. Tap it again. No option is on. (Story 9: AC 2, 3)
- [ ] Tap "Market A". It is on. Type "Market C" in "A new store". "Market A" is not on. (Story 9: AC 6)

## 7. The button, the receipt, and the pantry

This is the end of story 7, with stories 6, 9, and 10.

- [ ] Tap "Put into the pantry". The screen closes, and the message says "4 items are in the pantry.". (AC 18)
- [ ] The vault has the note `Shopping/<today>`. It has no task. (Story 6: AC 1, 1 c)
- [ ] The note has this text, with your day in `date` and in the row of milk. (AC 18 b, 18 c, 20, 20 a, 27, 27 a. Story 6: AC 1 a, 1 b. Story 9: AC 5, 6. Story 10: AC 7, 9 a, 10 a)

```markdown
---
date: 2026-10-13
store: Market C
---
Mum comes on Friday.

| Item                                    | Amount | Price | Sale | Place          | Use by     |
| --------------------------------------- | ------ | ----- | ---- | -------------- | ---------- |
| [[Shopping/Items/Batteries\|Batteries]] |        | 6.99  |      |                |            |
| [[Lime\|Lime]]                          | 2      | 0.50  | yes  | Kitchen pantry |            |
| [[Pantry/Soap\|Soap]]                   | 2      | 1.99  |      | Kitchen        |            |
| [[Pantry/Avocados\|Avocados]]           | 4      | 3.20  |      | Garage         |            |
| [[Pantry/Milk\|Milk]]                   | 1 l    | 1.29  |      | Kitchen fridge | 2026-10-20 |
```

- [ ] The vault has a new note `Shopping/Next trip`. It has 3 tasks with no mark: flour, eggs, and chicken thighs. (Story 6: AC 3, 3 a)
- [ ] The note `Lime` has the rows "3" and "1" in "Kitchen pantry", and `bought` with today. (Story 6: AC 5)
- [ ] The note `Avocados` has the row "4" in "Garage", and `bought` with today. (AC 22. Story 6: AC 5 a)
- [ ] The note `Milk` has two rows: "450 ml" in "Kitchen", and "1 l" in "Kitchen fridge" with its date. (AC 18, 18 a)
- [ ] The vault has the new note `Pantry/Soap`, with the row "2" in "Kitchen", and `bought` with today. (Story 10: AC 6, 6 a, 6 b, 10)
- [ ] The Pantry part shows soap in "Kitchen", and avocados in "Garage". (Story 10: AC 8)
- [ ] The vault has no note `Pantry/Batteries`, no note `Shopping/Items/Batteries`, and no note `Pantry/Quinoa`. (Story 5: AC 10, 10 a. Story 10: AC 9)
- [ ] In the Shop part, salt and spinach are suggestions again. Avocados are not a suggestion. (Story 3: AC 22)
- [ ] The Shop part has no button "Put away", because the cart is empty. (Story 6: AC 7)
- [ ] The list has the row "Quinoa 200 g" again.

## 8. The second trip

This is story 8, with the second receipt of one day.

- [ ] In the note `Shopping/<today>`, click the link "Batteries". Obsidian makes the note in the folder `Shopping/Items`.
- [ ] In the Shop part, tap "+", and type "bat". The field proposes "Batteries". Tap it. (Story 5: AC 7)
- [ ] Type "lim", and tap "Lime". Tap "+" again.
- [ ] Tap the rows "Batteries", "Chicken thighs", "Eggs", "Flour", and "Lime". Tap "Put away". The screen has 5 lines.
- [ ] The screen has 3 groups, with the lines of this table, in this sequence. Lime, batteries, and eggs start from a receipt. (Story 8: AC 1, 2, 3)

| Group             | Line           | Amount | Text         | Price |
| ----------------- | -------------- | ------ | ------------ | ----- |
| Kitchen pantry    | Flour          | 800 g  | No date      | –     |
| Kitchen pantry    | Lime           | 2      | No date      | –     |
| Outside fridge    | Chicken thighs | 500 g  | No date      | –     |
| Outside fridge    | Eggs           | 12     | Use by 3 Nov | 3.99  |
| Not in the pantry | Batteries      |        |              | 6.99  |

- [ ] Lime has no price, and "Sale" is off. Its only receipt has 0.50, with "yes" in "Sale". (Story 8: AC 1 d, 12)
- [ ] The text is "3 prices are missing".
- [ ] "Store" has 3 options, in this sequence: "Market A", "Market B", "Market C". No option is on. (Story 9: AC 8, 8 a)
- [ ] Tap "Market B". Tap "Put into the pantry". The message says "4 items are in the pantry.". (Story 7: AC 21. Story 9: AC 2)
- [ ] The vault has the note `Shopping/<today> 2`. It has `store: Market B` and 5 rows. The cells "Price" of chicken thighs, flour, and lime are empty. (Story 6: AC 6. Story 7: AC 21 a. Story 9: AC 4)
- [ ] The vault has no note `Shopping/Next trip`, because each task had a mark. (Story 6: AC 4)
- [ ] The note `Flour` has one row: "1000 g" in "Kitchen pantry". (Story 7: AC 19)
- [ ] The note `Eggs` has two rows in "Outside fridge": "6" with the date 2026-10-25, and "12" with the new date.
- [ ] The note `Chicken thighs` has two rows in "Outside fridge": "500 g" with the date 2026-10-01, and "500 g" with no date.
- [ ] Eggs are a suggestion again, with "Often". Chicken thighs are a suggestion again, with "Past its date": the old row is still in the pantry.
- [ ] In the note `Shopping/<today> 2`, change the price of eggs to "3.59", and remove the date of the row of eggs.
- [ ] In the note `Shopping/2026-09-28`, change the property to `store: Farm shop`.
- [ ] Tap "Add" on eggs, tap the row "Eggs", and tap "Put away". Eggs are in the group "Outside fridge". The line says "12", "No date", and "3.59". (Story 8: AC 5, 10, 10 a)
- [ ] "Store" has the options "Farm shop", "Market B", and "Market C". (Story 9: AC 9)
- [ ] In the note `Shopping/<today> 2`, remove the line `date` of the properties. The price of eggs on the screen is still "3.59". (Story 8: AC 8)
- [ ] Tap "Back". Tap "Undo" on eggs, and then "Remove" on the row "Eggs".

## 9. The settings and the data file

- [ ] Tap the row "Peanuts". The note `Shopping/Next trip` has the task of peanuts, and peanuts are in the cart.
- [ ] In the settings, change "Shopping folder" to `Lists`. After a moment, the cart is empty. (Story 1: AC 15)
- [ ] Tap the row "Raisins". The vault has the note `Lists/Next trip`. (Story 1: AC 14)
- [ ] Tap "Put away". "Store" has no option, because the folder `Lists` has no receipt. Tap "Back".
- [ ] Set "Shopping folder" back to `Shopping`. Peanuts are in the cart again. Tap "Undo" on peanuts.
- [ ] Change "Items folder" to `Things`. Tap "+", type "tape", and tap "Add as new". The note has the line `- [ ] [[Things/Tape|Tape]]`. (Story 5: AC 11)
- [ ] Tap "Remove" on the row "Tape", and set "Items folder" back to `Shopping/Items`.
- [ ] Remove the text of "Place for new food". Tap the row "Quinoa", and tap "Put away". Quinoa is in the group "Kitchen". The line says "200 g", "No date", and "no place yet". Tap "Back", and tap "Undo" on quinoa. Set the setting back to `Kitchen`.
- [ ] Open the file `.obsidian/plugins/whats-for-dinner/data.json`. It has `skipped` and `settings`. It has no `cart` and no `shopLow`. (Story 1: AC 16)

## 10. On the phone

- [ ] Tap a row on the phone. After Obsidian Sync, the computer shows the item in the cart.
- [ ] Type a task into the note on the computer. After Obsidian Sync, the phone shows the item on the list.
- [ ] You can do each action with one thumb: "Add", "Skip", a row, "Remove", "Undo", "Put away", a line, "Sale", the options of an open line, "Not bought", and the two buttons of the screen.
- [ ] Put 20 items in the cart, and tap "Put away". The lines scroll, and the two buttons keep their place.
- [ ] Tap "Sale" on a line. The phone shows the keyboard with numbers at once, with the cursor in the price. With the keyboard open, you see the line that you type in.
- [ ] Each change has a motion: a suggestion goes out, a row goes to the cart, the field "Add an item" opens, the screen of put away comes in, a line opens, a line moves into the group of its new place, a new group comes in, and a line goes out.
- [ ] Put a food item in the cart. Then give its note a new name in Obsidian. The item is still in the cart, with its amount.
- [ ] Give the note `Eggs` a new name in Obsidian. Each receipt still links to it, and the line of eggs still starts with its regular price.
- [ ] The group "Suggestions" does not hide the list for too long. Tell if the list must come first.
- [ ] At the counter, you can check a trip of 10 items with no tap on a line. Tell which fact you still had to open.

## 11. Try to break it

Each line tells what the plugin does with an entry that is not usual.

- [ ] A price that is not a number, such as "abc" or "1.2.3": the field has a red edge, the line shows the text in red, the price counts as missing, and the cell of the receipt is empty.
- [ ] "Sale" on a line with a price that you typed: the price stays.
- [ ] "Sale" on an item with no regular price: the hint is "Price", and a second tap leaves the price empty.
- [ ] A price with a comma, such as "1,5": the receipt has "1.50".
- [ ] An amount with no text: the line says "1", and 1 goes into the pantry.
- [ ] An amount with a plus, such as "1 l + 2 cartons": the food item gets two rows, and the receipt has the text as you typed it.
- [ ] An amount with no number, such as "a bag": the food item gets a new row with that text.
- [ ] A new place with no text: the place of the option counts.
- [ ] A new place with spaces only: the line stays in the group of its place.
- [ ] A new store with the name of an option: the receipt has that store one time, and the next trip has one option.
- [ ] Two fast taps on "Put into the pantry": the food goes into the pantry one time, and the vault gets one receipt.
- [ ] "Not bought" on each line: the screen closes with the last line.
- [ ] A change of the note `Next trip` by hand while the screen is open: a new task with a mark is a new line, and a task that loses its mark goes off the screen.
- [ ] A task with no link that has the name of a food item, such as `- [x] milk`, with "Into the pantry" on: the food goes into the note `Milk`, and the plugin makes no second note.
- [ ] A use-by date in the past: the food goes into the pantry, and the Pantry part shows "Past its date".

One limit is known. A place with the character `|` breaks the table of the food item note. The form of the Pantry part has the same limit.

## What this list does not have

These criteria need a different day, a different amount in a note, or a vault with no receipt. A script showed that each of them is true.

| Criterion               | How you can see it                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Story 3: AC 5           | On 16 October, or later, fresh coriander has "Past its date".                                     |
| Story 3: AC 7, 11       | Give rice 2.3 kg. With `bought` 21 days before today, it has "Bought 3 weeks ago".                |
| Story 3: AC 10          | Give rice 2.3 kg. With `bought` 20 days before today, it is not a suggestion.                     |
| Story 3: AC 12, 13      | Salt with `bought` 59 days before today is not a suggestion. With 60 days, it is one.             |
| Story 3: AC 19          | Put a meal that needs 1.2 kg of flour in the plan. The row "Flour" has "1 kg".                    |
| Story 7: AC 2 b, 4, 19  | Move the two receipts out of the folder `Shopping`. Milk then starts with "550 ml" and no price.  |
| Story 8: AC 6, 7        | In `Shopping/2026-10-04`, remove "yes" of eggs: eggs start with 3.49. With "Yes", they get 3.99.  |
| Story 8: AC 9           | In a receipt, put the column "Price" before the column "Amount". The facts of eggs are the same.  |
| Story 8: AC 13          | In `Shopping/2026-09-28`, give eggs the amount "6". "How much" of eggs has "12" and "6".          |

Story 6 tells a receipt with empty cells and with the amount of the list row. Story 7 changed that: the receipt has the facts that you gave, and lime starts with "2".

## To do the test again

The test changes notes of the pantry, the meal plan, and the receipt `2026-09-28`. It makes the notes `Pantry/Soap` and `Shopping/Items/Batteries`, the receipts of today, and the folders `Lists` and `Things`.

If you did `git add test-vault` before the test, these two commands bring the vault back. The second command deletes each file of the test vault that is new after `git add`.

```bash
git restore test-vault
```

```bash
git clean -fd test-vault
```

The data file of the plugin is not in git. To put each suggestion back, put the cart away one time, or remove `skipped` from the file.
