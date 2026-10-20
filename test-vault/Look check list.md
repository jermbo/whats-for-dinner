# Check list: the look

This list tests the seven look stories of version 0.8.0. You review the look one part at a time. Each section tells where to go, and what to look at. Do each part two times: in the light scheme, and in the dark scheme of Obsidian. The text in brackets is the story and its criterion.

The stories are: 1 Colour roles, 2 Type scale, 3 Space, lines, corners, and controls, 4 Motion, 5 One button, 6 Field and panel, 7 List line.

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] Each section names what changed on purpose, so that a change that you see is not a surprise.

## A. Pantry

Go to: Pantry, "By place".

- [ ] Light scheme: the page is paper, the bins are white, and the text is ink. (1, AC 4)
- [ ] Dark scheme: the page is dark, the bins are a lighter dark, and the text is light. (1, AC 3)
- [ ] The title "Pantry" is the largest text of the part. (2, AC 4)
- [ ] The line of rice: its name, its small line, and its amount. The amount is at the right edge. With more than one package, "2 packages" is now below the amount, not after it. (7)
- [ ] A sticker such as "3 days" is now next to the name, not before the amount. (7)
- [ ] "Out" has a dashed edge and no card. Its tags have the nearly square corners of a sticker, not a pill. (3, AC 2; 6)
- [ ] Tap the chip "Low". It changes to ink in about 0.2 s. (4, AC 1)
- [ ] Press "Add food". The button moves down a little, in about 0.1 s. (4, AC 2)
- [ ] Tap the line of rice. The card opens and settles a little. "Empty", "Place and date", "Size, names, and brands", and "Cancel" are links in the colour on the ink. "+ Add package" has a light edge on the ink. (5; 6)
- [ ] In the card, tap "Place and date". A white panel shows the place chips and the field "Use by". The label "Use by" is now above the field. (6)
- [ ] Tap "Size, names, and brands". The form has the same corner, edge, and padding as "Add food". (6, AC 3)
- [ ] Taco seasoning: tap "Brands", and tap the photo of a brand. The large photo has a white card with an edge. "Remove" is tomato. The mark on a selected brand photo has square corners, not a circle. (3, AC 1; 5)

## B. Add food

Go to: Pantry, "Add food".

- [ ] The field "Name" has the same edge, height, and text as the field "Use by" in the card of rice. (6, AC 1)
- [ ] Tap the field. It shows the focus ring: ink in the light scheme, light in the dark scheme. (6, AC 2)
- [ ] Type "oat milk" and "New". The field of the package size has the font of the numbers. (6)

## C. Shop

Go to: Shop, the stage "Shop". Put onions on the list first.

- [ ] The line of onions has its name, its small line, and its amount at the same places as the line of rice in the Pantry. "Onions" and "Rice" have the same size. (2, AC 1; 7, AC 1)
- [ ] Tap the line of onions. It ticks as before. (5, AC 4; 7, AC 2)
- [ ] The main button of the stage looks like "Add food" of the Pantry. (5, AC 1)
- [ ] Open "In the cart". Each line has the tick, the name, the amount, the price below the amount, and "Undo" at the end. (7)
- [ ] An item with a long name, about 40 letters: the name wraps, and the amount stays at the end of the line. (7, AC 4)
- [ ] The stage "Extras": each suggestion has its name, its sticker after the name, its facts below, and "Skip" and "Add" at the end. (7)
- [ ] A new item: the field "Add an item" has the look of each field. (6)

## D. Put away

Go to: Shop, the stage "Put away", after a trip with onions.

- [ ] The line of onions has the form of a line of the Pantry: name, small line, amount at the end. (7, AC 3)
- [ ] The price is now small, below the amount. It is faint when it is missing, and tomato when it is wrong. (7)
- [ ] Open the line. The field "Price" has the font of the numbers, and its label is above it. (6)

## E. Recipes and Plan

Go to: Recipes, then Plan.

- [ ] "Mashed potatoes" has the same size in the Recipes and in the Plan. (2, AC 2)
- [ ] A recipe that uses a food to use soon has a tomato sticker "Uses …" with white text. (1, AC 5)
- [ ] Each recipe card and each meal card has the same corner. (6)

## F. Cook Mode and the gallery

Go to: Recipes, Mashed potatoes, Cook.

- [ ] Light scheme: the frame is dark, and "Exit" is light. The done pieces of the step bar are light, and the pieces to come are dim. (1, AC 1)
- [ ] Dark scheme: the frame and its text have the same colours as in the light scheme. (1, AC 2)
- [ ] Make the tab narrow, then wide. The title of the step changes its size with the width. (2, AC 6)
- [ ] On a wide tab, the two halves of the card have room around them. (3)
- [ ] At the end, "Update the pantry" has the look of each olive button. (5, AC 2)
- [ ] Open the gallery of a recipe with photos. "Close" is light on the dark frame. (1; 5)

## G. Setup

Go to: the settings tab, and start setup again in a test vault, or look at the steps.

- [ ] The list "The plugin makes" is a card with the same corner, edge, and padding as a card of the Pantry. (6, AC 3)
- [ ] "A new place" has a dashed edge. The fields of the places have the look of each field. (6)

## H. Each part

- [ ] Tap each chip, button, and line. No target is less than 44 px high. The chips of the brands and the sequence of the bar are taller than before. (3, AC 5)
- [ ] Set the zoom of Obsidian from 100% to 120%. The name "Onions" is larger, and the main buttons keep their place. Then set the text size of the phone larger. Write down which of the two settings has an effect. (2, AC 3)
- [ ] Set the accent setting to "Obsidian". Cook Mode: the current piece of the step bar and the button "Step 1" have the accent colour of the theme. (1, AC 6)
- [ ] Turn on the setting for less motion of the phone. Tap the chip "Low". It changes with no motion. Open the card of rice. It does not settle. (4, AC 4)

## I. One change of a token

Do these on the desktop, in `src/ui/tokens.css`. Build, look, and change the value back.

- [ ] `--wfd-palette-olive` to a different colour: each sticker "Ready" has the new colour. (1, AC 7)
- [ ] `--wfd-font-size-name` to `1.25rem`: each name of an item is larger, and no other text changes. (2, AC 5)
- [ ] `--wfd-space-stack` to `16px`: the gap between two lines is larger in the Pantry and in the Shop. (3, AC 3)
- [ ] `--wfd-border` to `3px`: each chip and each field has a thicker edge. (3, AC 4)
- [ ] `--wfd-card-motion` to `var(--wfd-motion-move) var(--wfd-ease-bounce)`: the card of rice opens with a bounce, and the chips and the buttons move as before. (4, AC 3)
- [ ] `--wfd-radius-button` to `0`: each button has square corners in each part. (5, AC 3)
- [ ] `--wfd-space-inset` to `20px`: each card and each field of the Pantry and the Shop has the new padding. (6, AC 4)
