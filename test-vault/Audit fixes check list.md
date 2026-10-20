# Check list: the fixes of the audit

This list tests two fixes of the kitchen state from the audit of 2026-10-19. They are not a story. Each line has one action and what you must see. The text in brackets is the fix.

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] `Larder/Meal plan.md` has one meal that is not cooked.

## A. The date moves at midnight

- [ ] On the phone, open Plan, and tap "Today" on a meal. The meal is in the group "Today". (Fix 1)
- [ ] Keep the kitchen open on Plan, lock the phone, and change no note until after midnight. After midnight, unlock the phone. The group "Today" is not there, and the meal has the buttons "Remove" and "Today" again. (Fix 1: the app comes into view)
- [ ] On the desktop, open Plan, and tap "Today" on a meal. In the system settings, set the date to tomorrow. Keep the kitchen in view, and wait one minute. The group "Today" is not there, and the meal has the buttons "Remove" and "Today" again. Set the date back. (Fix 1: the timer)

## B. A write that fails tells why

Do this part on the desktop. A locked note makes each write to it fail. To lock a note, select it in Finder, choose File > Get Info, and tick "Locked". To unlock it, remove the tick.

- [ ] Lock `Larder/Meal plan.md`. Open Recipes, and tap "+" on a recipe that is not in the week. A notice shows "The plan did not change." and the reason of the system. The "+" stays. Unlock the note. (Fix 2)
- [ ] Lock `Recipes/Boiled eggs.md`. Cook "Boiled eggs" to the finish page, and tap "Update the pantry". A notice shows "The meal is not saved." and the reason. Cook Mode stays on the finish page, and the notice "The pantry is correct again." does not show. Unlock the note. (Fix 2: Cook Mode)
- [ ] Lock `Larder/Shopping/Next trip.md`. Open Shop, and tick a row of the list. A notice shows "The cart did not change." and the reason. The tick goes, and a second tap ticks the row again. Unlock the note. (Fix 2: Shop)
- [ ] Lock `Larder/Pantry/Milk.md`. Open the line of milk, drag its level, and tap "Done". A notice shows "The pantry did not change." and the reason. The line of milk shows the level from before. Unlock the note. (Fix 2: Pantry)

## C. Only a note of the kitchen changes the kitchen

- [ ] Open the kitchen on Pantry in one tab. In a second tab, type a word in this check list, and then change `full` to `1/2` in `Larder/Pantry/Milk.md`. The line of milk shows the new level at once. (Fix 3)
