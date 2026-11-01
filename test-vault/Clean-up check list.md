# Check list: the clean-up of the code

This list tests the clean-up of 2026-11-01. It is not a story: each screen must work as before. Each line has one action and what you must see. The text in brackets is the part of the clean-up that the line tests.

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.

## A. Motion

- [ ] Open the Pantry, and tap "Add to pantry". The form comes in with a motion, as before. (Motion from the tokens)
- [ ] Open Recipes. The cards come in one after the other, and the gallery of a recipe slides. (Motion from the tokens)
- [ ] On the phone, set "Reduce motion" on in the settings of the device. Open the Pantry, and tap a line. The card opens with no motion. Set "Reduce motion" off again. (Motion from the tokens)

## B. The screen stays on

- [ ] In the settings of the plugin, "Keep the screen on" is on. Open Cook Mode on Thai green curry, and wait longer than the auto-lock time of the phone. The screen stays on. (One wake lock)
- [ ] Open Shop on "2 Shop", and wait the same time. The screen stays on. (One wake lock)
- [ ] Set "Keep the screen on" off. Open Cook Mode, and wait. The screen goes dark at the auto-lock time. Set the setting on again. (One wake lock)

## C. The place for new food

- [ ] In the Pantry, open a food item that is out. Its card opens in the place of the setting "Place for new food". (One default place)
- [ ] Make the setting "Place for new food" empty. Open the same food item. Its card opens in "Kitchen". Set the setting back. (One default place)

## D. Put away

- [ ] Put one item of the cart into the pantry. The notice says "… is in the pantry.", with the name of the item. (Shop rules in the domain)
- [ ] Put two items away with one tap of "Put away" on a group. The notice says "2 items are in the pantry.". (Shop rules in the domain)
- [ ] An item with two packages: tap "✕ Not bought" on one line. Only that line goes, and the item stays in the cart. (Shop rules in the domain)
- [ ] Put each item away but one. Tap "✕ Not bought" on the last line. The trip ends, and the receipt is complete. (Shop rules in the domain)
- [ ] Start a new trip, and put the last line away with "Put away". The trip ends, and the receipt is complete. (Shop rules in the domain)

## E. Cook Mode

- [ ] Open Cook Mode on Thai green curry. On "Get out", tick 3 ingredients. The count shows 3. (Get out as a child)
- [ ] A line that fits two food items shows "Which one?". Tap one food item. The sticker fades, and the line is ticked. (Get out as a child)
- [ ] Go to step 1, and back to "Get out". The 3 ticks and the food item that you tapped are still there, with no "Which one?". (Get out as a child)
- [ ] Go to step 2, and tap "Start" on its timer. Go to step 3. The top shows the timer of step 2, and it counts down. (Timers as a class)
- [ ] Wait until the timer rings. The notice says "Thai green curry, step 2: the time is up.", the alarm sounds, and the timer at the top is red. (Timers as a class)
- [ ] Tap the timer at the top, and tap "OK". The alarm stops. (Timers as a class)
- [ ] Start a timer, and tap "Exit". The question "1 timer is running. Exit and stop it?" shows. Tap "Exit". Cook Mode closes, and no alarm rings later. (Timers as a class)
- [ ] Cook Boiled eggs to the finish page, and tap "Update the pantry". The notice "The pantry is correct again." shows, and the eggs in the pantry are less. (Get out as a child: the food item of each line)

## F. Photos of the brands in the Shop

- [ ] On "2 Shop", the row of Taco seasoning shows the photo of its first brand. Tap the photo. The brands open below the row. Tap it again. They close. (Brand photos as a class)
- [ ] Tap a brand photo below the row. The photo shows large. Tap "In cart". The row is ticked with that brand. (Brand photos as a class)
- [ ] In the cart view, the item shows only the brand that you took. Tap it. Each brand shows. Tap a different one, and tap "In cart". The item has the new brand. (Brand photos as a class)
- [ ] On a row with no brand photo, take a photo of a package. The photo shows large at once. (Brand photos as a class)

## G. Occasions

- [ ] Make a new occasion with no dish. Add a dish. The dish line is at the top, above "Guests" and "To do" when they are there. (One insert)
- [ ] Add a task to an occasion with no heading "To do". The note gets "## To do" at its end, with the task below it. (One insert)
- [ ] Add a guest to an occasion with no heading "Guests" and with a heading "To do". The note gets "## Guests" above "To do", with the guest below it. (One insert)
- [ ] Change the size of the party of a guest to 3. The line of the guest ends with "×3". (One insert)
- [ ] Remove a guest who brings a dish. The dish shows "?" as its person. (One insert)

## H. Recipe card

- [ ] Open a recipe card, tap "Edit", and close the card. Open it again. The card shows with no form. (No effect that copies state)

## I. The look

- [ ] On the desktop, press Tab through the Pantry. The ring of the focus is around each button and chip, with a small gap. On a line of a list, the ring is inside the line. (Focus tokens)
- [ ] In the Pantry, the Shop, the audit, and the nav, no small hidden word shows on the screen, such as "Confirmed", "Filters", or ", out". (Hidden text class)
- [ ] The toggle of the bar, the button of a week, the clear button of the find field, and the tick of the audit have the same size as before. (Control tokens)

## J. Settings

- [ ] Change the font to "A font of this device". The field "Font name" shows. Change it back to "Bricolage Grotesque". The titles change font. (Settings with no casts)
- [ ] Change the accent colour to "Accent colour of Obsidian", and back. The olive changes, and comes back. (Settings with no casts)
- [ ] Change the timer sound to "Chime", and tap "Test". You hear the chime. (Settings with no casts)
- [ ] Move the volume slider. The description shows the new number. Turn "Vibrate" off and on. (Settings with no casts)
- [ ] Type a folder in "Recipes folder". The field proposes folders while you type. (Settings with no casts)

## K. Recipes

- [ ] Open the card of Beef tacos. It shows the text of its preparation, the callout `[!prep]` of the note. (No `!`)
- [ ] Open the intake of a recipe that has a source line and photos in its description. The source and the photos are in their fields. (No `!`)
- [ ] A recipe with a yield such as "4 servings" shows its yield, and its list of ingredients is complete. (No `!`)
