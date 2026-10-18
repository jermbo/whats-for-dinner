# Check list: recipe intake

This list tests the twelve stories of version 0.4.0, on the phone. Do the parts in sequence. Each part starts from the state that the part before it leaves. Each line has one action and what you must see. The text in brackets is the story and its criterion, from [Recipes stories](../docs/features/v0.4.0/recipes-stories.md).

## Before you start

- [ ] The settings have the recipes folder `Recipes` and the pantry folder `Larder/Pantry`.
- [ ] `Larder/Pantry` has Baking powder, Butter, Eggs, Elbow pasta, Flour, Milk, Onions, Salt, Shell pasta, and Sugar. They are copies of `_old/Pantry`.
- [ ] `Recipes` has Boiled eggs, Old Fashioned Lemonade, Pancakes, and Pasta with tomato sauce. The vault has no folder `Recipes/Photos`.
- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.

## A. Add a recipe

- [ ] Open the Recipes part. The head has "Add recipe". Tap it. Intake shows "Title", "Tags", "Source", "Yield", "Ingredients", and "Steps", in this sequence. (Story 1: AC 1. Story 2: requirement 1)
- [ ] "Save" is not available. No text below the fields tells you about the title. (Story 1: AC 8)
- [ ] Type "200 g flour" in the first ingredient line. The line shows "200 g · Flour". (Story 1: AC 3)
- [ ] Press Enter. The cursor is in a new empty line, which slides in. (Story 1: AC 7)
- [ ] Type "300 g pasta". The line shows "300 g · Elbow pasta or Shell pasta", with no chip. (Story 1: AC 4. Story 3: AC 6)
- [ ] Type "1 pinch salt" and "salt and pepper" on two more lines. They show "1 pinch · Salt" and the chip "New: Salt and pepper". (Story 1: AC 5 and 6)
- [ ] Take the two lines "300 g pasta" and "salt and pepper" away: empty the line, and press Backspace.
- [ ] Close intake with "Close". The Recipes part shows again, and the vault has no new note.
- [ ] On the computer, run the command "Add recipe". The kitchen opens on intake. (Story 1: AC 2)

## B. Tags, title, and stubs

- [ ] Open intake. The tags field shows the chips "breakfast", "dinner", "fast", and "vegetarian". (Story 2: AC 1)
- [ ] Tap "breakfast" and then "vegetarian". The two move up into the tags of the recipe. Tap "breakfast" again. It moves back. (Story 2: AC 2 and 3)
- [ ] Type "brunch" in the field "A new tag" and press Enter. It is a tag of the recipe. Tap "vegetarian" to take it away.
- [ ] Type the title "pancakes". Below the title: the vault has the recipe "Pancakes". Change it to "Crepes". The message goes away. (Story 2: AC 7 and 8)
- [ ] Type the yield "6 crepes", and the ingredients "200 g flour", "300 ml milk", "2 eggs", "1 pinch salt", "250 ml buttermilk", and "1 tsp kosher salt". (Story 3: AC 1)
- [ ] "250 ml buttermilk" shows the chip "New: Buttermilk". Tap the chip of "1 tsp kosher salt", and then "Salt" in the list. The line shows "1 tsp · Salt", and its text does not change. (Story 3: AC 2)
- [ ] Type "1 onion (diced)" on one more line. It shows "1 · Onions": the food stops at the parenthesis. Change the text to "1 leek". The line shows "New: Leek" again. Take the line away.
- [ ] Type the steps "Mix all the ingredients." and "Cook each crepe for 1 minute on each side."

## C. The source

- [ ] Type the source "One Pan Wonders, page 46". Tap "Add a photo of the source" two times, and take two photos with the camera. On the phone, check that the menu also offers the photos of the phone. Intake shows two small images. (Story 6: AC 1)
- [ ] Tap "Remove" on the first. One image stays. Take one more photo. (Story 6: AC 2)
- [ ] Tap "Save". The Recipes part shows "Crepes", and not as a note that fails. (Story 1: AC 9 a. Story 6: AC 3 b)
- [ ] Open `Recipes/Crepes.md`. It starts with "# Crepes", then "Source: One Pan Wonders, page 46", then the two photo links, then `_breakfast, brunch_`, then `**6 crepes**`. (Story 2: AC 5. Story 6: AC 3)
- [ ] The ingredients are `_200 g_ [[Larder/Pantry/Flour|flour]]`, `_300 ml_ [[Larder/Pantry/Milk|milk]]`, `_2_ [[Larder/Pantry/Eggs|eggs]]`, `_1 pinch_ [[Larder/Pantry/Salt|salt]]`, `_250 ml_ [[Larder/Pantry/Buttermilk|buttermilk]]`, and `_1 tsp_ [[Larder/Pantry/Salt|kosher salt]]`. (Story 1: AC 9. Story 3: AC 3 a and 4)
- [ ] `Recipes/Photos` has `Crepes - source 2026-10-18.jpg` and `Crepes - source 2026-10-18 1.jpg`, each less than 5 MB and sharp. (Story 5: AC 3. Story 6: AC 3 a)
- [ ] `Larder/Pantry` has `Buttermilk.md`, which is empty, and no `Kosher salt.md`. (Story 3: AC 3 and 4 a)
- [ ] The filter "Breakfast" of the Recipes part shows "Crepes". (Story 2: AC 5 a)
- [ ] Add a recipe with the title "Pancakes" and one ingredient, and save. The vault has `Recipes/Pancakes 1.md`, and `Pancakes.md` did not change. Delete `Pancakes 1.md`. (Story 2: AC 9)

## D. Out

- [ ] Open the Shop part, stage Extras. The group "Out" has "Buttermilk". (Story 4: AC 7)
- [ ] Tap "Skip" on it. It goes away with one tap.

## E. Get out selects the pasta

- [ ] Cook "Pasta with tomato sauce". On "Get out", the line "pasta" shows "Elbow pasta" and "Shell pasta", with "Elbow pasta" selected and the sticker "Which one?". (Story 9: AC 1)
- [ ] Tap "Next" with no choice. Step 1 shows. Go back. (Story 9: AC 6)
- [ ] Tap "Shell pasta". It is selected, the line is marked on the counter, and "Which one?" fades out. (Story 9: AC 5)
- [ ] Go to the last page. The line "pasta" shows "Shell pasta", with no list. Tap "Update the pantry". Shell pasta has 200 g in "Kitchen", and elbow pasta has 2300 g. (Story 9: AC 7 and 8)
- [ ] Cook it again. "Shell pasta" is selected now, because the recipe uses up its 200 g. Exit. (Story 9: AC 2)

## F. Photos of a step

- [ ] Cook "Pancakes". On step 3, tap "Photo of this step" and take a photo. The step shows it. (Story 7: AC 1 b)
- [ ] Exit on step 4. In `Recipes/Pancakes.md`, item 3 has the line `   ![[Pancakes - step 3 2026-10-18.jpg]]` with an indent. (Story 7: AC 1 a and 2)
- [ ] Cook "Pancakes" again. Step 3 shows the photo, and its text has no `![[`. The count is "/5". Take a second photo. The step shows the new one. (Story 7: AC 4 and 5)
- [ ] Tap the photo. The view shows 2 photos, the newest first, each with "Best". (Story 8: AC 1)
- [ ] Tap "Best" on the second photo. Close. The step shows that photo, and the note has `|best` after its link. (Story 8: AC 2)
- [ ] Tap "Best" on the other photo. The mark moves. Tap it again. No link has `|best`, and the step shows the newest. (Story 8: AC 3 and 4)
- [ ] Cook "Boiled eggs". On step 2, take a photo. The note has the link on the line directly below "Put the eggs in the water with a spoon. Cook for 7 minutes.", with no blank line. The recipe still has 3 steps, and step 2 has the timer 7:00. (Story 7: AC 3)

## G. The photo of a meal, and the gallery

- [ ] Finish "Pancakes" with 5 stars, the note "Less sugar for the children", and a photo. `Recipes/Photos` has `Pancakes 2026-10-18.jpg`, and the record links it. (Story 5: AC 1)
- [ ] The card "Pancakes" shows that photo as a small square. The card "Pasta with tomato sauce" shows no photo. (Story 10: AC 1 and 2)
- [ ] Tap the photo. The gallery fills the tab with the photo, "18 Oct", five stars, and the note. (Story 10: AC 3)
- [ ] Cook "Pancakes" one more time with a photo. Open the gallery, and swipe to the left. It shows the older record. Swipe to the right. It shows the newest again. (Story 5: AC 2. Story 10: AC 4 and 5)
- [ ] Tap "Close". The Recipes part shows again. (Story 10: AC 7)
- [ ] On the computer, open `Recipes/Pancakes.md` and run "Open the gallery". The gallery of Pancakes opens. (Story 10: AC 6)

## H. Convert

- [ ] At the end of the Recipes part, open "1 note is not a recipe". "Old Fashioned Lemonade" has the button "Convert". (Story 11: AC 1)
- [ ] Tap it. Intake has the title "Old Fashioned Lemonade", 3 ingredient lines, 14 step lines, the two tags with their `#`, and the source "Source Link: [Divas Can Cook](…)" with the video below it. The description has "tags:". (Story 11: AC 2)
- [ ] The line "1 1/2 - 2 cups sugar" shows "1 1/2 cups · Sugar": the low number of the range.
- [ ] The line "8 lemons plus more for garnishing if desired" shows "New: Lemons plus more for garnishing if desired". Tap the chip, type "lemons" in the find field, and tap "New: Lemons". The chip shows "New: Lemons", and the text of the line does not change.
- [ ] Close with no "Save". The note did not change. (Story 11: AC 7)
- [ ] Convert again. Give the lemons the name "Lemons" again, as above, and tap "Save". The list of notes that fail is open, and the line slides out of it. The Recipes part shows "Old Fashioned Lemonade". (Story 11: AC 3 e, and requirement 7 d)
- [ ] The note starts with "# Old Fashioned Lemonade" and "Source: Source Link: [Divas Can Cook](…)", and it has `_#05-Recipe/Drink/Non-Alcoholic, #05-Recipe/Holiday/Summer_`, 3 ingredients, and 14 numbered steps. (Story 11: AC 3 to 3 d)
- [ ] The ingredients have `_8_ [[Larder/Pantry/Lemons|lemons plus more for garnishing if desired]]` and `_1 1/2 cups_ [[Larder/Pantry/Sugar|sugar]] (1 1/2 - 2 cups)`. `Larder/Pantry` has `Lemons.md`, and no note whose name starts with "-".
- [ ] In Obsidian, search for `tag:#05-Recipe/Holiday/Summer`. The search finds the note. (Story 11: AC 3 f)

## I. Edit a recipe

Do this part after part F, so that step 3 of Pancakes has photos, and after part G, so that Pancakes has records.

- [ ] The card "Pancakes" has the buttons "Open note", "Edit", and "Cook →". Tap "Edit". The head says "Edit recipe". (Story 12: AC 1)
- [ ] The title is "Pancakes", with no message that the title is in use, and the yield is "8 pancakes". (Story 12: AC 1 and 1 c)
- [ ] The ingredient lines start with "Dry:", which shows "Group", and "200 g flour", which shows "200 g · Flour". The steps have 5 lines, and step 3 says that its photos stay. (Story 12: AC 1 a and 1 b)
- [ ] Close with no "Save". The note did not change. (Story 12: AC 6)
- [ ] Tap "Edit" again. Change "200 g flour" to "250 g flour", change the text of step 3, and tap "Save". The Recipes part shows "Pancakes", and not as a note that fails. (Story 12: AC 2 b)
- [ ] Open `Recipes/Pancakes.md`. Below `## Dry` is `- _250 g_ [[Larder/Pantry/Flour|flour]]`. The group "Wet" still has `- *300 ml* milk`. (Story 12: AC 2 and 2 a)
- [ ] Below the new text of step 3 are its photo links, with an indent, and the best photo still has `|best`. (Story 12: AC 3)
- [ ] The note ends with the heading "Cooked" and the same records, with their photos. (Story 12: AC 4)
- [ ] On the computer, open `Recipes/Pancakes.md` and run "Edit recipe". Intake opens with "Pancakes". Open `Recipe intake check list.md` instead: the command is not in the list. (Story 12: AC 5)
