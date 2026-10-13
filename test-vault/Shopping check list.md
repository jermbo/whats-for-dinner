# Check list: shopping list

This list tests the five stories of the shopping list that are built: 1, 2, 3, 5, and 6. Do the parts in sequence. Each part starts from the state that the part before it leaves.

Each line has one action and what you must see. The text in brackets is the story and its criterion.

A date shows in the form of your device: "4 Oct" or "Oct 4". The reasons of part 2 are for 13 to 15 October 2026. From 16 October, fresh coriander has "Past its date". From 20 October, eggs have "Use by 25 Oct".

## Before you start

- [ ] Run `npm run build`. Then restart Obsidian, or put the plugin off and on.
- [ ] The vault has no folder `Shopping`.
- [ ] The plan has 9 meals, with "Guacamole" and "Quinoa bowl".
- [ ] The settings of the plugin have "Shopping folder" with `Shopping`, and "Items folder" with `Shopping/Items`.

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
- [ ] The list has no row "Ginger". (AC 24 a)
- [ ] The list has the row "Avocados" with "4", not "2". A staple on the list fills.
- [ ] Tap "Add" on flour. The vault has the note `Shopping/Next trip`, with the line `- [ ] [[Pantry/Flour|Flour]]`. (AC 16)
- [ ] The list has the row "Flour" with "800 g" and with "Remove". The group has no line for flour. (AC 16 a, 16 b)
- [ ] Tap "Add" on salt. The list has the row "Salt" with no amount. (AC 18)
- [ ] Tap "Remove" on the row "Salt". The note has no task for salt, and salt is a suggestion again. (AC 23, 23 a)
- [ ] Tap "Skip" on salt. The line is gone, and the note has no task for salt. (AC 20, 20 a)
- [ ] Tap "Add" on eggs. The list has the row "Eggs" with "6". (AC 17)
- [ ] Open the bar, with the button next to the find field. It has the filters "For a meal" and "Your choices". (AC 25)
- [ ] Tap "Your choices". The list shows "Eggs" and "Flour", and it does not show "Lime". Put the filter off. (AC 26, 26 a)
- [ ] Select the sequence "By meal". The last group is "Your choices". Select "A to Z" again.

## 3. An item of your own

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
- [ ] [[Shopping/Items/Batteries|Batteries]]
```

## 4. The cart in the note

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
- [ ] Salt is still not a suggestion. (Story 3: AC 21)

The note has this text now:

```markdown
Mum comes on Friday.

- [ ] [[Pantry/Flour|Flour]]
- [ ] [[Pantry/Eggs|Eggs]]
- [ ] [[Shopping/Items/Batteries|Batteries]]
- [x] [[Pantry/Quinoa|Quinoa]]
- [x] [[Lime]]
- [x] Soap
- [x] [[Pantry/Avocados|Avocados]]
```

## 5. Put away and the receipt

This is story 6. "Today" is the day of your test, such as `2026-10-13`.

- [ ] The button says "Put 4 into the pantry". Tap it. The message says "3 items are in the pantry.".
- [ ] The vault has the note `Shopping/2026-10-13`, with the name of today. (AC 1)
- [ ] The note has the property `date`, with today. (AC 1 a)
- [ ] The note has the line "Mum comes on Friday.", and it has no task. (AC 1 b, 1 c)
- [ ] The note has this table, with 4 rows. The cells "Price", "Sale", and "Use by" are empty. (AC 2, 2 a, 2 b, 2 c)

```markdown
| Item                          | Amount | Price | Sale | Place          | Use by |
| ----------------------------- | ------ | ----- | ---- | -------------- | ------ |
| [[Pantry/Quinoa\|Quinoa]]     | 200 g  |       |      | Kitchen        |        |
| [[Lime\|Lime]]                | 1      |       |      | Kitchen pantry |        |
| Soap                          |        |       |      |                |        |
| [[Pantry/Avocados\|Avocados]] | 4      |       |      | Kitchen        |        |
```

- [ ] The vault has a new note `Shopping/Next trip`. It has 3 tasks with no mark: flour, eggs, and batteries. (AC 3, 3 a, 3 b)
- [ ] The note `Lime` has the rows "2" and "1" in "Kitchen pantry", and `bought` with today. (AC 5)
- [ ] The note `Avocados` has the row "4" in "Kitchen", and `bought` with today. (AC 5 a)
- [ ] The vault has the new note `Pantry/Quinoa`, with "200 g" in "Kitchen", and `bought` with today.
- [ ] The vault has no note for the soap. The pantry did not change for it. (Story 5: AC 10)
- [ ] In the Shop part, salt is a suggestion again. Avocados are not a suggestion. (Story 3: AC 22)
- [ ] The Shop part has no button of put away, because the cart is empty. (AC 7)
- [ ] In the note `Shopping/Next trip`, click the link "Batteries". Obsidian makes the note in the folder `Shopping/Items`.
- [ ] Tap "+", and type "bat". The field proposes "Batteries". (Story 5: AC 7)
- [ ] Tap the rows "Flour", "Eggs", and "Batteries". Tap "Put 3 into the pantry". The message says "2 items are in the pantry.".
- [ ] The vault has the note `Shopping/2026-10-13 2`, with the name of today and "2". It has 3 rows, and the row of the batteries has no amount and no place. (AC 6)
- [ ] The vault has no note `Shopping/Next trip`, because each task had a mark. (AC 4)
- [ ] The note `Flour` has "1000 g" in "Kitchen pantry". The note `Eggs` has a second row with "6" in "Outside fridge", with no date.
- [ ] Eggs are a suggestion again, with "Often". The plugin asks about such a staple at each trip.
- [ ] In the Recipes part, open "notes are not recipes". The list has no note of the folder `Shopping`.

## 6. The settings and the data file

- [ ] Tap the row "Peanuts". The vault has a new note `Shopping/Next trip`, and peanuts are in the cart.
- [ ] In the settings, change "Shopping folder" to `Lists`. After a moment, the cart is empty. (Story 1: AC 15)
- [ ] Tap the row "Raisins". The vault has the note `Lists/Next trip`. (Story 1: AC 14)
- [ ] Set "Shopping folder" back to `Shopping`. Peanuts are in the cart again. Tap "Undo" on peanuts.
- [ ] Change "Items folder" to `Things`. Tap "+", type "tape", and tap "Add as new". The note has the line `- [ ] [[Things/Tape|Tape]]`. (Story 5: AC 11)
- [ ] Tap "Remove" on the row "Tape", and set "Items folder" back to `Shopping/Items`.
- [ ] Open the file `.obsidian/plugins/whats-for-dinner/data.json`. It has `skipped` and `settings`. It has no `cart` and no `shopLow`. (Story 1: AC 16)

## 7. On the phone

- [ ] Tap a row on the phone. After Obsidian Sync, the computer shows the item in the cart.
- [ ] Type a task into the note on the computer. After Obsidian Sync, the phone shows the item on the list.
- [ ] You can do each action with one thumb: "Add", "Skip", a row, "Remove", "Undo", and the button of put away.
- [ ] Each change has a motion: a suggestion goes out, a row goes to the cart, and the field "Add an item" opens.
- [ ] Put a food item in the cart. Then give its note a new name in Obsidian. The item is still in the cart, with its amount.
- [ ] The group "Suggestions" with 7 lines does not hide the list for too long. Tell if the list must come first.

## What this list does not have

These criteria of story 3 need a different day, or a different amount in a note. A script showed that each of them is true.

| Criterion | How you can see it                                                                    |
| --------- | ------------------------------------------------------------------------------------- |
| AC 5      | On 16 October, or later, fresh coriander has "Past its date".                         |
| AC 7, 11  | Give rice 2.3 kg. With `bought` 21 days before today, it has "Bought 3 weeks ago".    |
| AC 10     | Give rice 2.3 kg. With `bought` 20 days before today, it is not a suggestion.         |
| AC 12, 13 | Salt with `bought` 59 days before today is not a suggestion. With 60 days, it is one. |
| AC 19     | Put a meal that needs 1.2 kg of flour in the plan. The row "Flour" has "1 kg".        |

## To do the test again

The test changes these notes: `Lime`, `Avocados`, `Flour`, and `Eggs` in the pantry, and possibly `Butter`, `Salt`, and the meal plan. It makes the note `Pantry/Quinoa`, and the folders `Shopping`, `Lists`, and `Things`.

If you stage the test vault before you start, with `git add test-vault`, then `git restore test-vault` brings each note back, and this list has no marks again. You delete the new note and the new folders by hand.
