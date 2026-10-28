# Check list: phone fixes

This list tests the three [phone stories](../docs/features/v0.10.0/phone-stories.md) of version 0.10.0. Each line has one action and what you must see. The text in brackets is the criterion or the requirement. Sections A and B need the Android phone.

## Before you start

- [ ] The build made `main.js` again. Sync the vault to the phone, then put the plugin off and on.
- [ ] Open `Recipes/Boiled eggs.md` and change its first line to `# [[Boiled eggs]]`.

## A. Controls above the bar of Obsidian

Go to: Pantry, on the phone.

- [ ] Scroll to the end. The last bin is fully above the bar of Obsidian. (AC 1)
- [ ] Scroll up and down until Obsidian hides its bar. The last bin does not move. (AC 7)
- [ ] Shop, stage "Extras": "Go shopping" is fully above the bar. (AC 2)
- [ ] Tick 2 items, and open the cart: "Put away 2" is fully above the bar. No line of the cart shows between the foot and the bar. (AC 3, 3 a)
- [ ] Put away: the total is fully above the bar. (AC 4)
- [ ] Cook Mode, last step: scroll to the end. The last control is fully above the bar. (AC 5)
- [ ] The gallery of Pancakes: the date and the stars are fully above the bar. (Requirement 1 a)
- [ ] On the computer: the space below the last bin of the Pantry is as before, 16 px. (AC 8)

## B. A sideways drag stays in the kitchen

Go to: Pantry, on the phone.

- [ ] Tap the line of Milk in "Fridge". Drag the first jug from 1/4 to 3/4. The jug follows. No side panel of Obsidian opens. (AC 1, 1 a)
- [ ] Start a drag at the left edge of the bar, and drag to the right. The first jug fills. The left panel does not open. (AC 2, 2 a)
- [ ] Drag up on the bar. The Pantry scrolls. (AC 3)
- [ ] Tap the middle of the second jug. It is at 1/2. Tap "Cancel". (AC 4)
- [ ] Open the gallery of Pancakes, on 18 October. Swipe to the left on the photo. It shows 4 October. No side panel opens. (AC 5, 5 a)
- [ ] Close the gallery. In the Pantry, with no card open, swipe to the right on a line. The left panel of Obsidian opens. (AC 6)

## C. A linked title shows its name

Go to: Recipes.

- [ ] The card of the eggs is "Boiled eggs", with no brackets. (AC 1)
- [ ] Tap "A to Z". "Boiled eggs" is after "Black bean soup" and before "Chicken fried rice". (AC 2)
- [ ] Add the eggs to the week. Their card in the Plan is "Boiled eggs". (AC 3)
- [ ] Open `Larder/Meal plan.md`. It has `[[Recipes/Boiled eggs|Boiled eggs]]`. Remove the meal again. (AC 3 a)
- [ ] Open the eggs in Cook Mode. The top of the step is "Boiled eggs". Leave Cook Mode. (AC 4)
- [ ] Open the card of the eggs, tap "Edit", then "Save" with no change. The first line of the note is still `# [[Boiled eggs]]`. (AC 5)
- [ ] Change the first line to `# [[Boiled eggs|Eggs, boiled]]`. The card is "Eggs, boiled". (AC 6)
- [ ] "Add recipe": type the title "Boiled eggs". Intake tells that a recipe with that title is there. Close intake. (AC 7)
- [ ] Change the first line back to `# Boiled eggs`.
