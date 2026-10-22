# Check list: Shop and Put away

This list tests the six Shop stories of version 0.9.0, on the phone and on the desktop. Each line has one action and what you must see. The text in brackets is the story and its criterion.

The stories are: 1 [The list in bins](../docs/features/v0.9.0/shop-the-list-in-bins.md), 2 [A tick acts at once](../docs/features/v0.9.0/shop-a-tick-acts-at-once.md), 3 [The shelf and the cart](../docs/features/v0.9.0/shop-the-shelf-and-the-cart.md), 4 [The cart view](../docs/features/v0.9.0/shop-the-cart-view.md), 5 [Undo a tick](../docs/features/v0.9.0/shop-undo-a-tick.md), 6 [A tidy Put away](../docs/features/v0.9.0/shop-a-tidy-put-away.md).

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] `Larder/Shopping/Next trip.md` has Eggs, Milk, and Rice with no mark, and Bread and Celery with a mark.
- [ ] Less motion is off on the device. Section G turns it on.

## A. The list in bins

Go to: Shop, stage "2 Shop".

- [ ] With "A to Z", the rows are in one white bin "To get", with the count of its rows. (1, AC 1)
- [ ] Select "By meal". Each meal has its own bin, with its title and its count. (1, AC 2)
- [ ] On the desktop, 1000 px wide, with "By meal": the bins are in 2 columns. (1, AC 3)
- [ ] Go to: "1 Extras". Type "Batteries" in "Add an item", and add it. Go to: "2 Shop". The row of Batteries has the sticker "Extra" and the plain button "✕ Remove", with no edge. (1, AC 4)
- [ ] Tap "✕ Remove" on Batteries. The row goes, and the rows below glide up. Select "A to Z" again. (1, requirement 4)

## B. The shelf and the cart

- [ ] Under the strip of the stages: the shelf at the left with "To get" and the count of the list, in ink. The cart at the right with its count and "Cart", in white. (3, AC 1)
- [ ] Scroll down the list. The shelf and the cart stay in view at the top. (3, AC 2)
- [ ] Go to: "3 Put away". The head has no shelf and no cart. Go to: "2 Shop". (3, AC 3)

## C. A tick

- [ ] Tap the row of Eggs. The check fills with olive and draws its mark, a line strikes "Eggs", and a pill "Eggs" flies to the cart. The cart icon gives a small squeeze, and its count goes up by 1. No circle grows across the row. (2, AC 1)
- [ ] The row of Eggs fades, and the rows below glide up. Open `Next trip.md`: it has `- [x] [[Larder/Pantry/Eggs|Eggs]]`. (2, AC 2)
- [ ] Tap the row of Milk, and tap it again at once. Milk stays on the list with no tick, and the pill flies back to its check. The note has `- [ ] [[Larder/Pantry/Milk|Milk]]`. (2, AC 3)
- [ ] Tap Milk, then Rice, fast. Milk and Rice go to the cart, and no other row. (2, AC 4)

## D. Undo

- [ ] Tap the row of Onions. The bar "✓ Onions ↶ Undo" shows above the lower edge. Wait 4 seconds: the bar goes. (5, AC 1 and 2)
- [ ] Tap the row of Salt. The bar shows Salt. Tap the bar. The row of Salt comes back with its tick, the tick goes, and the bar goes. The note has `- [ ] [[Larder/Pantry/Salt|Salt]]`. (5, AC 4)

## E. The cart view

- [ ] Tap the cart. A dark circle grows from it, and the cart view shows "In the cart" with its count. The cart button is ink. (4, AC 1)
- [ ] The cart view has the total "About … in the cart · … in all", and the pill "Put away" at the lower edge. (4, requirement 2 d and 4)
- [ ] Tap the row of Bread. A pill "Bread" flies to the shelf, the shelf gives a squeeze, and the row fades and goes. The note has `- [ ] [[Larder/Pantry/Bread|Bread]]`. (4, AC 2)
- [ ] Tap the shelf. A circle of paper grows from it, and the list shows. The row of Bread shows its tick for one moment, and the tick goes. (4, AC 4)
- [ ] Tap the cart, and tap "Put away". The stage Put away opens. (4, AC 3)

## F. Put away

- [ ] The receipt has its paper with sharp corners and the dashed rule. The group "Known" has a chevron that points down. (6, AC 1; requirement 1)
- [ ] Tap the line of Celery. Its chevron turns, the form fades in below it, and the lines below glide down. (6, AC 2)
- [ ] The form has the pill "Put away", and the plain buttons "✕ Not bought" and "+ Package", with no edge. (6, AC 2 a)
- [ ] The closed line of Celery has the chip "Sale". (6, AC 4)
- [ ] Open "Known", if it shows, and tap "Put away" on one of its lines. The line fades, the lines below glide up, and the count of "Known" runs down by 1, with no jump. (6, AC 3)

## G. Less motion

Turn on less motion on the device.

- [ ] Go to: Shop. Tap Eggs. The row goes at once, and no pill flies. (2, AC 5)
- [ ] Tap the cart. The cart view shows at once. (4, AC 5)
- [ ] Tap a row of the list, and look at the bar: it shows and goes with no slide. (5, requirement 4)
