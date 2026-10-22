# Check list: one system

This list tests the eleven one system stories of version 0.9.0, on the phone and on the desktop. Each line has one action and what you must see. The text in brackets is the story and its criterion.

The stories are: 1 [One easing and the press](../docs/features/v0.9.0/one-system-one-easing-and-the-press.md), 2 [The pill](../docs/features/v0.9.0/one-system-the-pill.md), 3 [Recipe cards in columns](../docs/features/v0.9.0/one-system-recipe-cards-in-columns.md), 4 [Open a recipe card](../docs/features/v0.9.0/one-system-open-a-recipe-card.md), 5 [What you must get first](../docs/features/v0.9.0/one-system-what-you-must-get-first.md), 6 [Edit a recipe in its card](../docs/features/v0.9.0/one-system-edit-a-recipe-in-its-card.md), 7 [A circle to a screen](../docs/features/v0.9.0/one-system-a-circle-to-a-screen.md), 8 [Open a food card](../docs/features/v0.9.0/one-system-open-a-food-card.md), 9 [Tonight with the ink](../docs/features/v0.9.0/one-system-tonight-with-the-ink.md), 10 [A circle between stages](../docs/features/v0.9.0/one-system-a-circle-between-stages.md), 11 [Cook Mode closes with a circle](../docs/features/v0.9.0/one-system-cook-mode-closes-with-a-circle.md).

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] `Larder/Meal plan.md` has 3 meals with no date: Boiled eggs, Spinach omelette, Chicken noodle soup.
- [ ] Less motion is off on the device. Section K turns it on.

## A. The press and the easing

- [ ] Go to: Shop. Press "In cart" on a row. A small circle grows from the finger and fades. The button does not move down. (1, AC 1)
- [ ] On the phone, go to: Recipes. Put a finger on "+" of a card, and scroll the list up. No circle shows on "+". (decision 22)
- [ ] Go to: Pantry. Tap the chip "Low". A circle grows from the finger, and the chip changes to ink. (1, AC 2)
- [ ] Go to: Recipes. Tap "+" on Beef tacos. The check grows to its size and stops, with no wobble. Tap it again to take Beef tacos out. (1, AC 3)

## B. The pill

- [ ] Go to: Plan. Flag Boiled eggs for tonight. "Cook" is a pill in the accent colour, with the arrow in a circle. "Cook" on Spinach omelette is a quiet button. (2, AC 1)
- [ ] Go to: Shop. "Go shopping" is a pill with an arrow. (2, AC 3)
- [ ] Go to: Pantry. Open Milk. "Done" is a pill with no arrow. Tap "Done". (2, AC 2)
- [ ] Go to: Recipes. Tap "Add recipe". "Save" is the ink button, not a pill. Tap "Close". (2, AC 6)

## C. The columns

Go to: Recipes.

- [ ] On the desktop, 1000 px wide: the cards are in 2 columns, and the first card of the sequence is at the top of the first column. (3, AC 1)
- [ ] On the phone: the cards are in one column. (3, AC 3)
- [ ] Select the sequence "By type". The group "Dinner" has its cards in columns under its head. Go back to "Best for the pantry". (3, AC 4)

## D. Open a recipe

- [ ] Tap the name of Chicken noodle soup near its left edge. The ink spreads from that point, and the name is larger. The other cards step back: they get lighter. (4, AC 1)
- [ ] The meter has 9 pieces: 5 dark, 1 grey, 1 amber, 2 dashed. The count of the head runs from 0 to 6 with the pieces. (5, AC 1 and 2)
- [ ] "To get or check · 4" has celery "None", elbow pasta "None", chicken broth "Low", and carrots "Check", in this sequence. Each sticker presses on after its row. (5, AC 1 a)
- [ ] "In the pantry · 5" has the chips chicken thighs 450 g, onion 1, olive oil 1 tbsp, salt, and black pepper. (5, AC 1 b)
- [ ] The stickers press on one after the other: "None" of celery first, "Check" of carrots last. (5, AC 3)
- [ ] The motion is smooth on the phone: no stop and no jump while the ink spreads and the card moves up. (4, requirement 4 b)
- [ ] On the desktop: the description and the actions are in a column at the right of the food. (5, AC 4)
- [ ] With Chicken noodle soup open, open Thai green curry. Chicken noodle soup folds, and Thai green curry moves to the top. (4, AC 3)
- [ ] Press Escape. The ink goes back and the inside fades, and then the cards below glide back up, with no jump. On the desktop, a card that changes column glides there. (4, AC 5; requirement 4 c)
- [ ] On the phone, scroll until Garlic butter spaghetti is the last card on the screen. Open it. It moves up until its top is just under the head of the part. (4, AC 2)

## E. Edit in the card

- [ ] Open Chicken noodle soup, and tap "Edit". Paper spreads from "Edit", and the form shows in the card. "Title" has "Chicken noodle soup". (6, AC 1)
- [ ] Change the yield to "8 servings", and tap "Save". The paper goes back to "Save", and the card shows "8 servings". The note has "8 servings". Change it back to "6 servings" the same way. (6, AC 2)
- [ ] Tap "Edit", and then "Close". The paper goes back to "Close", and the note does not change. (6, AC 3)

## F. A circle to a screen

- [ ] Open Chicken noodle soup, and tap "Cook". A dark circle grows from the arrow, and Cook Mode opens Chicken noodle soup. Close Cook Mode with no finish. (7, AC 1)
- [ ] Go to: Plan. With Boiled eggs flagged, tap its "Cook". The dark circle grows from its arrow. Close Cook Mode. (7, AC 2)
- [ ] Go to: Recipes. Tap "Add recipe". A circle of paper grows from the button. Tap "Close". (7, AC 3)
- [ ] Tap "Pantry" in the nav. The Pantry fades in, with no circle. (7, AC 5)

## G. The Pantry and the Plan

- [ ] Go to: Pantry. Tap the line of Milk. The ink spreads from the finger, the bar shows at once, and the other lines step back. Drag the bar at once: the handle follows. Tap "Cancel". The ink goes back to "Cancel" while the card stays and fades, and then the line of Milk takes its place. No line shows under the card. The lines and bins below glide back up, and the edge of the bin comes up with them: nothing jumps. (8, AC 1, 3, and 4)
- [ ] Open Milk, and tap the line of Eggs. Milk is a line at once, and the card of Eggs moves to the top and stays there. (8, AC 5)
- [ ] Go to: Plan. Take the flag off Boiled eggs. Tap "☆ Tonight" on Spinach omelette. The ink spreads from its star. Boiled eggs and Chicken noodle soup stay at full. (9, AC 1)
- [ ] Tap "★ Tonight". The ink goes back to the star, and Spinach omelette is in the list. (9, AC 2)

## H. A circle between stages

Go to: Shop.

- [ ] Tap "1 Extras" in the strip. Tap "2 Shop". The ink line slides to "Shop" at once, and a circle of paper grows from the finger over the stage. The strip stays in view. The list shows when the circle fades. (10, AC 1)
- [ ] Tap "1 Extras". Tap "Go shopping". The circle grows from its arrow, and the list shows. (10, AC 2)
- [ ] Mark one row "In cart". Tap "Put away". The circle grows from its arrow, and "Put away" shows. Tap "2 Shop" to go back. (10, AC 3)

## I. Cook Mode closes with a circle

- [ ] Go to: Recipes. Open Boiled eggs, and tap "Cook". Tap "Step 1". The first piece of the bar is white, and the second piece fills with olive from the left. Step 1 slides in from the right. (11, AC 3)
- [ ] Tap "Exit". A circle of paper grows from "Exit", and the Recipes show when it fades. (11, AC 2)
- [ ] Open Boiled eggs again, and tap "Cook". Tap "Step 1", "Next", "Next", and "Finish". Tap "Update the pantry". A circle of paper grows from the button, and the Recipes show when it fades. The pantry has 4 eggs less. (11, AC 1)

## J. Focus and long text

On the desktop, with the keyboard:

- [ ] Go to: Recipes. Press Tab until the name of Chicken noodle soup has the focus ring. Press Enter. Press Tab until "Close" has the ring. Press Enter. The ring is on the name of Chicken noodle soup. ([open card](../docs/architecture/open-card.md))
- [ ] Go to: Pantry. Press Tab until the line of Milk has the ring. Press Enter. Press Tab until "Cancel" has the ring. Press Enter. When the line of Milk is back, the ring is on it. ([open card](../docs/architecture/open-card.md))
- [ ] On the phone, go to: Plan. Flag Chicken noodle soup for tonight. Its name wraps on two lines, and no text goes past the edge of the card. Take the flag off. (5, requirement 3 c)

## K. Less motion

Turn on less motion on the device.

- [ ] Go to: Recipes. Open Chicken noodle soup. It is ink and at the top at once, each piece shows at once, and the count shows 6. (4, AC 6; 5, AC 6)
- [ ] Tap "Cook". Cook Mode opens at once. Close it. (7, AC 6)
- [ ] Press any button. No circle shows. (1, AC 5)
- [ ] Go to: Shop. Tap "2 Shop". The list shows at once, with no circle. (10, AC 4)
- [ ] Go to: Recipes. Open Boiled eggs, and tap "Cook". Tap "Exit". Cook Mode closes at once. (11, AC 4)
