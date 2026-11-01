# Check list: occasions

This list tests the eleven occasion stories of version 0.11.0, on the phone and on the desktop. Each line has one action and what you must see. The text in brackets is the story and its criterion.

The stories are: 1 [See an occasion](../docs/features/v0.11.0/occasion-see-an-occasion.md), 2 [Start an occasion](../docs/features/v0.11.0/occasion-start-an-occasion.md), 3 [Add and remove a dish](../docs/features/v0.11.0/occasion-add-and-remove-a-dish.md), 4 [Give a dish a person, a course, and a scale](../docs/features/v0.11.0/occasion-person-course-and-scale.md), 5 [Shop for an occasion](../docs/features/v0.11.0/occasion-shop-for-an-occasion.md), 6 [Cook and tick the dishes](../docs/features/v0.11.0/occasion-cook-and-tick-the-dishes.md), 7 [See the preparation and the tasks](../docs/features/v0.11.0/occasion-prep-and-tasks.md), 8 [Start from a past occasion](../docs/features/v0.11.0/occasion-start-from-a-past-occasion.md), 9 [See the occasions](../docs/features/v0.11.0/occasion-see-the-occasions.md), 10 [Keep a guest list](../docs/features/v0.11.0/occasion-keep-a-guest-list.md), 11 [Open or delete an occasion](../docs/features/v0.11.0/occasion-open-or-delete-an-occasion.md).

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] `Larder/Occasions` has `Thanksgiving 2026`, `Sam's birthday`, and `Thanksgiving 2025`, as the [occasion stories](../docs/features/v0.11.0/occasion-stories.md#the-test-data) page gives them. `Thanksgiving 2026` has the line `- [ ] Plates · things · ?` and the heading `## Guests` with Mum ×2, Sam, and The Smiths ×4.
- [ ] `Recipes/Beef tacos.md` has the line `> [!prep] Take the ground beef out of the freezer in the morning.` in its description.

The lines use real days. "In 5 days" means the date of today plus 5 days, as year-month-day. You change the property `date` of a note to test a day.

## A. The Occasions part

- [ ] Open the kitchen. The nav has five options: Pantry, Recipes, Plan, Shop, Occasions. On a narrow phone, each label is complete, and the nav does not scroll to the side. (9, AC 1 and 10)
- [ ] Tap Occasions. From the top: "Occasions", the olive button "New occasion", the ink card "Next up", one row of chips, and the rows. (9, AC 3)
- [ ] "Next up" is the nearest occasion that is not past, with its date, its days, and four numbers: coming, open, to buy, to do. (9, AC 3)
- [ ] The chips "Upcoming" and "Nearest first" are on. Tap "Past": the row "Thanksgiving 2025" is muted. Tap "All" and "A to Z": the rows go A to Z. (9, AC 4 to 6)
- [ ] The Plan part has no "New occasion". (2, AC 1 a)
- [ ] Tap the row or the card of "Thanksgiving 2026". Its screen comes in from the right. (9, AC 7)
- [ ] Tap Pantry, then Occasions. The screen of Thanksgiving is still open. (9, AC 8)
- [ ] Tap "← Occasions". The list comes in from the left. (1, AC 14)
- [ ] Set the `date` of Thanksgiving to the day before yesterday. It is in "Past", not "Next up", and the note is still there. Set the date back to 2026-11-26. (9, AC 9)

## B. The screen of an occasion

Open Thanksgiving 2026.

- [ ] The ink card shows "26 Nov · N days", "Thanksgiving 2026", "⋯", and "8 coming", "1 open", the rows to buy, and "3 to do". It has the same look as "Next up". (1, AC 1)
- [ ] "Who brings" has the place cards You, Mum, Sam, and Open, each with the name above a dashed fold. The Smiths have no card. (1, AC 4)
- [ ] "Open" has "Plates" with the dashed sticker "Who brings?". (1, AC 4 d)
- [ ] Honey glazed carrots shows "×2" and "Side". Rolls has a full check and a line through its name. (1, AC 5 and 6)
- [ ] The menu has Starter, Main, Side, Dessert, Drink, Things, and Bread. Starter and Drink are dashed: "No starter yet", "No drink yet". (1, AC 7)
- [ ] In the menu, Apple crumble has the olive sticker "You", Pumpkin pie the sticker "Mum", and Plates "Who brings?". (1, AC 7 b and c)
- [ ] Tap "1 open" on the card: the screen scrolls to "Who brings", and the nav covers nothing. Tap "3 to do": it scrolls to "To do". (1, AC 12)
- [ ] In the note, change `×2` to `×3`. The screen shows "×3". Change it back. (1, AC 13)

## C. The guest list

- [ ] Tap "8 coming" on the card. The tab "Guest list · 8" is on. (10, AC 7)
- [ ] The rows are You ("Host" or your dishes), Mum ("Pumpkin pie", ×2), Sam ("Rolls"), and The Smiths ("Visitor", ×4). The list ends with "8 coming". (10, AC 1)
- [ ] Type "Aunt Jo" into "Add a guest" and press Enter. The note has `- Aunt Jo` after The Smiths, and the list shows "9 coming". "Who brings" has no card "Aunt Jo". (10, AC 2)
- [ ] Tap + on The Smiths: `- The Smiths ×5`. Tap − back to ×4. (10, AC 3)
- [ ] Tap − on Mum: `- Mum`. The − of Mum is now not active. Tap + to ×2 again. (10, AC 4)
- [ ] Tap ✕ on Aunt Jo. The line goes. (10)
- [ ] Tap ✕ on Mum. The pie line ends with `· ?`, and the pie is in "Open". Then set the pie back: open it and tap "Mum" (see D), and add Mum ×2 to the list again. (10, AC 5)

## D. Who brings?

- [ ] Tap "Apple crumble". A sheet rises from the bottom: "Who brings", "Apple crumble", and large buttons You (in ink, with ✓), Mum, Sam, The Smiths, Nobody yet. "dessert" and "×1" are on. (4, AC 1)
- [ ] Tap "Mum". The sheet closes. The line is `... Apple crumble · dessert · Mum`, and the crumble is in the card "Mum". (4, AC 2)
- [ ] Open the crumble again, and tap "You". The line is `... Apple crumble · dessert`. (4, AC 3)
- [ ] Open Plates, and tap "The Smiths". The line is `- [ ] Plates · things · The Smiths`, and "Who brings" has a card "The Smiths". Set it back to "Nobody yet". (4, AC 4 and 5)
- [ ] Open Honey glazed carrots. Tap "×3", then "×1", then "×2". The line follows each tap. (4, AC 6)
- [ ] Open Apple crumble, type "Aunt Jo" into "New person", and press Enter. The crumble is in the card "Aunt Jo", and the guest list has Aunt Jo. Tap "You" on it again, and remove Aunt Jo. (4, AC 8)
- [ ] Open Rolls, and tap "×2". The line is `- [x] Rolls · bread · ×2 · Sam`. Tap "×1". (4, AC 10)
- [ ] Open a dish, and tap outside the sheet. It closes. Open it, and press Escape. It closes. (4, req 1 b)

## E. Add and remove a dish

- [ ] In the card "You", tap "Add a dish". The field opens with the focus. Type "soup": Black bean soup and Chicken noodle soup. Type "crumble": no proposal. (3, AC 1 and 2)
- [ ] Type "soup", and tap Black bean soup. It is in "You", and the line `- [ ] [[Recipes/Black bean soup|Black bean soup]]` is after the line of Plates. Tap "Done". (3, AC 4)
- [ ] In the card "Mum", add "Rolls" by name. The line is `- [ ] Rolls · other · Mum`. (3, AC 14)
- [ ] In the menu, tap "Add a drink", type "Lemonade", and press Enter. The line is `- [ ] Lemonade · drink · ?`, in "Open" and in "Drink". (3, AC 13)
- [ ] Open Lemonade, and tap "Remove dish". The line goes. Remove Black bean soup and Mum's Rolls the same way. (3, AC 11)
- [ ] `Dinner at 15:00.`, the guests, and the tasks are as they were. (3, AC 10)

## F. Shop for an occasion

- [ ] The screen has "To buy" below the menu, with Apples and Carrots, each with "Add to the list". (5, AC 5)
- [ ] Set the `date` of Thanksgiving to in 7 days. Shop has Apples and Carrots, each with "Thanksgiving 2026". Plates put nothing on the list. (5, AC 2)
- [ ] Set the date back to 2026-11-26.

## G. Cook and tick

- [ ] Beef tacos has "Cook". Pumpkin pie and Plates have no "Cook". (6, AC 1 to 4)
- [ ] Tap "Cook" on Honey glazed carrots. Cook Mode shows "×2". Exit. Back in Occasions, the screen of Thanksgiving is still open. (6, AC 5)
- [ ] Tap the check of Pumpkin pie. It fills, a line strikes the name, and the sheet does not open. Tap it again. (6, AC 11 and 14)

## H. Preparation and tasks

- [ ] Beef tacos shows its preparation with "Prep is done". Tick it: the line ends with `· prep done`. Tick it again. (7, AC 1 to 3)
- [ ] "To do" has Borrow chairs, Clean the oven, and Buy candles, in this sequence. (7, AC 7)
- [ ] Type "Get ice" into "Add a task" and press Enter. The line `- [ ] Get ice` comes after Buy candles. Delete it in the note. (7, AC 12)

## I. Start an occasion

- [ ] In Occasions, tap "New occasion". A circle of paper grows, and the form shows "Name" with the focus, and "Day". (2, AC 2)
- [ ] Tap "Cancel". The Occasions part shows. (2, AC 12)
- [ ] Open the form: name "Christmas 2026", day 2026-12-24, "Start". The screen of "Christmas 2026" opens, with the cards You and Open, and a dashed card for each course. (2, AC 6)
- [ ] Run the command "New occasion". The kitchen opens with the form. Tap "Cancel". (2, AC 3)

## J. Start from a past occasion

- [ ] Tap "New occasion". "Start from" has the chip "Thanksgiving 2025". (8, AC 1)
- [ ] Name "Friendsgiving 2026", day 2026-11-21, the chip, "Start". The screen shows Beef tacos, Honey glazed carrots ×2, and Pumpkin pie of Mum, all with no mark. (8, AC 4)

## K. Open or delete an occasion

- [ ] On the screen of Christmas 2026, tap "⋯". The menu has "Open the note" and "Delete occasion". Tap outside: it closes. (11, AC 1)
- [ ] Tap "⋯" and "Open the note". The note opens in a new tab. (11, AC 2)
- [ ] Tap "⋯" and "Delete occasion". It asks "Delete Christmas 2026? The note goes to the trash." Tap "Keep it": nothing changes. (11, AC 3 and 4)
- [ ] Tap "⋯", "Delete occasion", "Delete". The list of the occasions shows, with no Christmas 2026, and the note is in the trash of the vault. Delete Friendsgiving 2026 the same way. (11, AC 5)

## After the test

- [ ] Set `Thanksgiving 2026.md` back to the text of the [occasion stories](../docs/features/v0.11.0/occasion-stories.md#the-test-data) page.
