# Check list: pantry onboarding

This list tests the six stories of pantry onboarding, version 0.3.0. Part A tests the test vault as it is: a vault with notes of the kitchen. Parts B to F test setup in the test vault with no data file. The Larder paths have no notes there, so the kitchen sees a new vault. Part G tests the place list in the settings tab. Do the parts in sequence. Each part starts from the state that the part before it leaves.

Each line has one action and what you must see. The text in brackets is the story and its criterion.

## Before you start

- [ ] The watch build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] Copy `.obsidian/plugins/whats-for-dinner/data.json` to `data.json.bak` in the same folder. Part B removes the data file, and the end of this list puts it back.

## A. A vault with notes of the kitchen

The data file has the root paths `Pantry`, `Shopping`, and `Meal plan.md`, and no `setup`.

- [ ] Open the kitchen. The screen has the title "Setup" and tells you to open the settings of the plugin. It has no navigation of the four parts. (Story 3: AC 5, 5 a, 6)
- [ ] Open the settings of the plugin. The top has "Setup" with the button "Use these notes".
- [ ] The section "Places" has the 6 places of the vault: `Downstairs pantry`, `Freezer`, `Kitchen`, `Kitchen fridge`, `Kitchen pantry`, and `Outside fridge`. (Story 2: requirement 1 a)
- [ ] Tap "Use these notes". The section "Setup" goes. Open the kitchen. The four parts fade in, on the Pantry part. The data file has `"setup": "done"`.

## B. No data file: the Larder paths

- [ ] Close Obsidian. Delete `data.json`, and open Obsidian.
- [ ] The data file is there again. It has `"pantryFolder": "Larder/Pantry"`, `"shoppingFolder": "Larder/Shopping"`, `"itemsFolder": "Larder/Shopping/Items"`, `"planNote": "Larder/Meal plan.md"`, and `"recipesFolder": ""`. (Story 1: AC 1, 1 a to 1 d)
- [ ] Open the settings of the plugin. "Pantry folder" shows `Larder/Pantry`, "Shopping folder" `Larder/Shopping`, "Items folder" `Larder/Shopping/Items`, and "Meal plan note" `Larder/Meal plan.md`. (Story 1: AC 2, 2 a to 2 c)

## C. The recipes step

- [ ] Open the kitchen. The screen shows "Recipes" with "Step 1 of 4", and no navigation of the four parts. (Story 3: AC 1, 1 a)
- [ ] The step has no control to skip or to do it later. (Story 3: AC 2)
- [ ] Type `Larder/Recipes`. "Continue" is not active, and the line under the field says that the recipes stay outside Larder. (Story 3: AC 4)
- [ ] Select `Recipes` from the list of folders. Tap "Continue". The step "Plugin home" comes in from the right. The setting "Recipes folder" is `Recipes`. (Story 3: AC 3, 3 a)

## D. The plugin home

- [ ] The field has `Larder`, and the box under it shows `Larder/Pantry`, `Larder/Shopping`, `Larder/Shopping/Items`, and `Larder/Meal plan.md`. (Story 4: requirement 1)
- [ ] Type `Cupboard`. The box shows the paths with `Cupboard`. Type `Larder` again.
- [ ] Close the kitchen tab and open it again. It shows the step "Plugin home" again.
- [ ] Tap "Continue". The vault has the folders `Larder/Pantry/`, `Larder/Shopping/`, and `Larder/Shopping/Items/`, and the note `Larder/Meal plan.md` with no text. (Story 4: AC 1, 1 a)
- [ ] The settings have `Larder/Pantry`, `Larder/Shopping`, `Larder/Shopping/Items`, and `Larder/Meal plan.md`. (Story 4: AC 1 b)
- [ ] The note `Pantry/Rice.md` is still at the root. (Story 4: AC 3)

## E. The places

- [ ] The list shows `Kitchen pantry`, `Fridge`, and `Freezer`. "Place for new food" has `Kitchen pantry` on. (Story 5: AC 1, 1 a)
- [ ] The chips under the list are "+ Downstairs pantry", "+ Secondary pantry", and "+ Garage freezer".
- [ ] Remove the three places. The list is empty, "Place for new food" goes, and "Continue" is not active. (Story 5: AC 4)
- [ ] Tap "+ Garage freezer". "Place for new food" has no place on, and "Continue" is not active. (Story 5: AC 5)
- [ ] Tap "+ Downstairs pantry". Type `Kitchen pantry` in "A new place", and tap "Add". Under "Place for new food", `Kitchen pantry` is on again. (Story 5: requirement 3 b)
- [ ] Rename `Garage freezer` to `Fridge`. The list has `Fridge`.
- [ ] Tap "Continue". The data file has the places `Fridge`, `Downstairs pantry`, and `Kitchen pantry`, and `"newPlace": "Kitchen pantry"`. (Story 5: AC 6, requirement 5)

## F. The first food

- [ ] The step "First food" shows a checklist with "Rice" and "Eggs". "Finish setup" is not active. (Story 6: AC 1, AC 4)
- [ ] Tap "Rice" and "Eggs". Each gets a tick and a field for the amount. "Finish setup" is still not active. Type `2 kg` for rice. "Finish setup" is active.
- [ ] Tap "Add other food". The form "Add to pantry" has the chips of the 3 places, and `Kitchen pantry` is on. Type `Milk`, tap `Fridge`, type `1 l`, and tap "Save". The line "In the pantry: Milk" shows. (Story 6: requirement 2 a)
- [ ] Tap "Finish setup". The kitchen fades in on the Pantry part with rice and milk. The vault has `Larder/Pantry/Rice.md` with a row for `Kitchen pantry` and `2 kg`, and no `Larder/Pantry/Eggs.md`. (Story 6: AC 2, 2 a to 2 c, AC 5, 5 a)
- [ ] The data file has `"setup": "done"`. (Story 6: requirement 4)

## G. The place list in the settings tab

- [ ] Open the settings of the plugin. "Places" has a field for each place, and the field "A new place".
- [ ] Add `Garage freezer`. In the kitchen, the Pantry part has a chip "Garage freezer" in the bar, and the form "Add to pantry" has its chip. (Story 2: AC 1, 2)
- [ ] Remove `Downstairs pantry`. The data file has `Garage freezer`, and not `Downstairs pantry`. (Story 2: AC 4, 4 a)
- [ ] Remove places until one is left. Its trash button is not active, and the list keeps that name. (Story 2: AC 5)

## At the end

- [ ] Close Obsidian. Put `data.json.bak` back as `data.json`, and delete the folder `Larder`.
