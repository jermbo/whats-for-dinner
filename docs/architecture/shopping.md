---
title: Shopping
summary: "How the list knows what to buy, and how a trip goes through three stages: the extras, the store, and put away."
parent: ../README.md
---

[Wiki](../README.md) / Shopping

# Shopping

With no list, you buy what you have and you forget what you need. This page tells how the plugin makes a list of the missing items only, where it keeps the cart, and how a trip goes through three stages into the pantry.

## The list is the plan minus the pantry

The plugin takes each ingredient of each meal of the [plan](plan.md), and of each side of that meal that is a recipe. A row names the main dish as its meal. It adds the amounts for each food item. Then it takes off what the [pantry](pantry.md) has. If an amount is left, it is a row of the list.

One meal needs 1 onion and a second meal needs 2. The pantry has 1 onion. The list has one row: "Onion, 2".

The plugin adds and compares [amounts](amounts.md) only if their units compare. The pantry can have the food in a different unit, such as "1 bag" for an ingredient of 20 g. Then the plugin does not ask for more.

## A low staple that a meal needs is on the list

A [staple](staples.md) is food that you always want. When a meal needs a staple that is [low](level.md) or out, the meal uses what is left. So the plugin puts the staple on the list with no action from you, also when the pantry has enough for the meal. The row asks for the larger of two amounts: what the meals need, and one package of the staple.

The boiled eggs need 4 eggs. The pantry has one carton with 2 of 12, so eggs are low. The list has one row: "Eggs, 12", for the boiled eggs.

## Your extras are on the list too

Each food item that is out or low, and that no meal puts on the list, is a [suggestion](suggestions.md). A staple also comes back after a time, such as bread. One tap accepts a suggestion. Food of a meal that is [past its date](past-its-date.md) is a suggestion too. The open row of a food item in the [Pantry](pantry.md) part also has "Add to the list".

Somebody asks you for batteries on a Tuesday. You type the name into the field "Add an item", and the item is on the list of the next trip. The field proposes the notes that the name finds.

A suggestion that you accepted and an item of your own are extras: items that are on the list because you put them there.

## A trip has three stages

A trip has three moments: you decide the extras, you shop, and you put the food away. The Shop part has one stage for each, in a strip at the top: "1 Extras", "2 Shop", and "3 Put away". An item goes from a suggestion to the list, from the list to the cart, and from the cart to the pantry. Each stage moves it one place, and the count of a stage tells how many items wait there. A new stage comes in under a circle of paper that grows from the point of your tap and covers only the stage, so the strip stays in view.

The stage Extras starts with one line, such as "Your meals: 6 items on the list". The meals need no action from you, so the stage shows only the [suggestions](suggestions.md) and the field "Add an item".

You can open a stage at any time. When Obsidian starts, the Shop part opens on the stage that has work: "Extras" when a suggestion needs a look and the cart is empty, and "Shop" in each other case.

## A trip has one note

A trip is one visit to a store. It has one [shopping note](shopping-note.md), which the plugin makes with your first action. A task with no mark in that note is an extra. A task with a mark is an item of the cart.

The cart is in a note, because Obsidian moves a note from one device to the other. Thus the phone and the computer show the same cart.

## In the store, one tap

In the store, you hold the phone in one hand and a basket in the other. So each item takes one tap, and the screen tells you at once where the item went.

The stage Shop has the list in bins, as the bins of the [Pantry](pantry.md): white cards in columns, one column on a phone. "A to Z" has one bin, "To get". "By meal" has one bin for each meal, and a bin "Extras". A row shows the meals that need the item, or the sticker "Extra". Below that, it shows the [brands](brands.md) of its food item: the photo of each package, small, in the order of the note. A brand with no photo shows its name as a chip.

A tap on a row ticks it at once. Its round check fills with the accent colour and draws its mark, and a line strikes the name. The name of the item flies on a small pill to the cart button, at the top right. The row fades in its place, and then the item goes into the cart and the rows below glide up. A second tap on the row while it fades takes the tick off, and the item stays on the list. A tap on a chip of a brand, or on the row outside the photos, ticks the row too. The screen stays on while the stage is open, if the setting "Keep the screen on" is on.

You tap the row of eggs. The check fills, "Eggs" flies to the cart, the cart goes from 6 to 7, and the row of eggs is gone.

## The photo of the package

A tap on a photo shows it large, over the stage, with the name of the brand below it. It grows from the small photo. The large photo has "In cart" at its lower edge, in reach of the thumb. "In cart" ticks the row, and the task keeps that brand, so put away starts from it. "Close", or a tap outside the photo, leaves the row as it was.

The row of a food item has a small camera tile after its photos. A row with no brand shows only the tile. A new package on the shelf gets its photo there: the photo is a new brand with no name, in the note at once, and it shows large with "In cart". Batteries have no food item note, so their row has no tile.

## The shelf and the cart

Two buttons are at the top of the stage, under the strip of the stages, so they stay in view while the list scrolls. The shelf is at the left, with the number of the items to get. The cart is at the right, with the number of the items in the cart. The button of the view that is open is ink.

A tap on the cart grows a dark circle from it, and the cart view fills the stage. Each item of the cart is a row there, with the photo of its brand. A tap on the photo shows it large, with "In cart", so you can take a different brand. A tap on the row puts the item back on the list: its name flies to the shelf, and the row goes. "Put away" is at the lower edge of the cart view. A tap on the shelf grows paper back into the list.

A wrong tap must cost nothing. So after each tick, a bar is above the lower edge for 4 seconds: "✓ Eggs ↶ Undo". The full bar is one button, under your thumb. A new tick replaces its item. After the 4 seconds, the cart view is the way back.

An item stays in the cart when its meal goes out of the plan. You took the item, so you put it away.

You see batteries that are not on the list. You type "batt" into the field to find. The field finds no row, so it proposes the note "Batteries", and "Add to cart" puts it in the cart at once.

## The amount that you usually buy, and its price

You buy a box of 12 eggs, not the 28 eggs that make the food item full. So a row shows the newest amount of the receipts in the unit of the food item. When the meals need more than that, the row shows what the meals need. With no such receipt, the row shows what the meals need, or what makes a staple full. Put away starts from the same amount.

Each row also shows its regular price: the price of the newest receipt row with no sale mark. The cart view adds them up: "About 9.40 in the cart · 14.18 in all". It is "about", because the price is for the amount of the receipt.

## The store has an order

You select the store at the start of the trip, in the stage Shop. The open note keeps it, so the phone and the computer know it, and the receipt gets it.

A tap on a row moves its task to the end of the tasks, so the receipt has the items in the order in which you took them. At the next trip to that store, the list has the sequence "Store order": each row is where its item was on the newest receipt of that store. You walk through the store in the same order each time, so the last trip is the best map. An item that you never bought there comes last.

## At home, one stage

[Put away](put-away.md) is the third stage. It shows each item of the cart with its facts: the amount, the place, the use-by date, and the price. The plugin proposes them, and you correct what is different. The items that the plugin knows are in one closed group, with one button. "Put away" in an open line adds one item to its food item. For flour, the row "Kitchen pantry" goes from 200 g to 1000 g.

A food that the pantry does not know gets a new note. After the last item, the cart is empty, and the list has only what you did not buy.

The [receipt](receipt.md) of that day keeps the facts from the start of put away, with the price of each item. An extra that you did not buy goes into the note of the next trip.

## Further reading

- [Recipes](recipes.md): how an ingredient finds its food item.
