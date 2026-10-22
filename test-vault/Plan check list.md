# Check list: the weekly Plan

This list tests the four Plan stories of version 0.9.0, on the phone and on the desktop. Each line has one action and what you must see. The text in brackets is the story and its criterion.

The stories are: 1 [One list of meals](../docs/features/v0.9.0/plan-one-list-of-meals.md), 2 [Flag a meal for tonight](../docs/features/v0.9.0/plan-flag-a-meal-for-tonight.md), 3 [The sides of a meal](../docs/features/v0.9.0/plan-the-sides-of-a-meal.md), 4 [A cooked meal leaves](../docs/features/v0.9.0/plan-a-cooked-meal-leaves.md).

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] `Larder/Meal plan.md` has 4 meals with no mark and no date: Banana oat muffins, Mashed potatoes, Pancakes, Spinach omelette.
- [ ] Add this line to the description of `Recipes/Beef tacos.md`: `> [!prep] Take the ground beef out of the freezer in the morning.` (For 2, AC 3)

## A. One list

Go to: Plan.

- [ ] The Plan shows 4 cards in one list: Banana oat muffins, Mashed potatoes, Pancakes, Spinach omelette. No group head "Breakfast" or "Side", and no "2/7". (1, AC 1)
- [ ] The head says "4 meals". "Add a meal" is the first control below the head.
- [ ] The card of Pancakes has the small label "Breakfast". The card of Mashed potatoes has "Side". (1, AC 2 and 3)
- [ ] The top has no find field, no sequence, and no filter chips. (1, AC 8)
- [ ] Scroll to the end. No group "Ideas for your pantry", no group "Cooked", and no "Start a new week". (1, AC 9; 4, AC 4)
- [ ] Tap "Add a meal". The Recipes part opens with the sequence "Best for the pantry" and no filter on. (1, AC 5)
- [ ] In Recipes, tap "+" on Beef tacos. Go back to Plan. Beef tacos is the fifth card, and the head says "5 meals".
- [ ] Scroll the Plan. "Add a meal" stays at the top. (1, AC 7)

## B. Tonight

The date of today is in the lines as "today". In the note, it is year-month-day.

- [ ] Each card has "☆ Tonight" and "Cook →". No card has "A day" or "Not today". (2, AC 1; requirement 6)
- [ ] Tap "☆ Tonight" on Pancakes. The section "Tonight" opens at the top, with Pancakes as a large dark card and "★ Tonight". The card moves there. Below it, "Other options" shows 4. (2, AC 2)
- [ ] Open `Meal plan.md`. The line of Pancakes ends with ` · ` and the date of today. (2, AC 2 b)
- [ ] Tap "☆ Tonight" on Spinach omelette. Spinach omelette is in "Tonight", and Pancakes is back in the list, in the third place, with no date in the note. (2, AC 3)
- [ ] Tap "★ Tonight" on Spinach omelette. The section "Tonight" and the head "Other options" go away. Spinach omelette is in its place, with no date in the note. (2, AC 4)
- [ ] With no flag, tap "Cook →" on Banana oat muffins. Cook Mode opens Banana oat muffins. Close it with no finish. (2, AC 7)
- [ ] The card of Beef tacos has the sticker "Prep". Flag Beef tacos. Its dark card shows the preparation "Take the ground beef out of the freezer in the morning." with the box "Prep is done", and "Cook →" is the quiet button. Tick the box. "Cook →" is the main button. (2, AC 5 and 6)
- [ ] In `Meal plan.md`, give Spinach omelette the date of yesterday. The Plan shows Spinach omelette in the list with "☆ Tonight", and only Beef tacos is in "Tonight". (2, AC 8)

## C. Sides

- [ ] On Beef tacos, tap "+ Side". A field opens. With no text, the first recipes are Honey glazed carrots and Mashed potatoes. (3, AC 2)
- [ ] Type "carr". The field shows Honey glazed carrots. Tap it. The card shows Honey glazed carrots below its name, with its count, and the field closes. (3, AC 1 and 3)
- [ ] `Meal plan.md` has `	- [[Recipes/Honey glazed carrots|Honey glazed carrots]]` on the line below Beef tacos. (3, AC 3 a)
- [ ] Tap "+ Side" again. Type "Salad". Tap `Add "Salad"`. The card shows "Salad" with no count. The note has `	- Salad` below the carrots. (3, AC 4)
- [ ] The field does not offer Beef tacos or Honey glazed carrots again.
- [ ] Honey glazed carrots has "Cook". Salad has no "Cook". (3, AC 7)
- [ ] Tap "Cook" on Honey glazed carrots. Cook Mode opens Honey glazed carrots. Close it with no finish. (3, AC 7)
- [ ] Go to Shop. The list has the food of the carrots that the pantry does not have, and each such row names Beef tacos. (3, AC 6)
- [ ] Back in Plan, tap "Remove" on Salad. The card has only the carrots. The line of Beef tacos in the note did not change. (3, AC 5)
- [ ] Add `Mum comes on Friday.` at the end of `Meal plan.md`. Add a side to the last meal. `Mum comes on Friday.` is still in the note, below the side. (3, AC 8)

## D. A cooked meal leaves

- [ ] Tap "Cook" on Honey glazed carrots, and finish Cook Mode. The plan note did not change. (4, AC 2)
- [ ] Beef tacos has the flag. Tap "Cook →" on Beef tacos, and finish Cook Mode. Beef tacos and its carrots are gone from the Plan and from the note. (4, AC 1)
- [ ] `Recipes/Beef tacos.md` has one new line below "Cooked". (4, AC 1 c)
- [ ] `Mum comes on Friday.` is still in the note. (4, AC 6)
- [ ] Go to Shop. The list has no row for Beef tacos. (4, AC 3)
- [ ] In `Meal plan.md`, change `- [ ]` of Pancakes to `- [x]`. The Plan shows no card of Pancakes. (4, AC 5)

## E. Each device

- [ ] Add a side on the phone. After Sync, the desktop shows the same side on the same card.
- [ ] The card is usable with one hand on the phone: "+ Side", "Remove", "☆ Tonight", and "Cook →" each take one tap.

## After the test

- [ ] Change `Larder/Meal plan.md` back to the 4 meals of "Before you start", and take the prep line out of Beef tacos if you do not want it.
