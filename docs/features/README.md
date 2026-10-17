---
title: Features
summary: "What the plugin does for you, from the pantry to the plate, and why each part is worth its place."
parent: ../README.md
---

[Wiki](../README.md) / Features

# Features

The plugin makes your vault a kitchen that knows what it has. This page tells what you can do with it, and why you would.

## The first open sets up the vault

The first time that you open the kitchen in a new vault, [setup](../architecture/setup.md) asks four things: where your recipes are, the name of the folder for the notes of the plugin, the places of your kitchen, and the first food. A checklist of staples adds food with a tap and an amount. Then the four parts open, and the pantry has your food.

## The pantry knows what you have, and where

You record your food one time, with its place: a full bag of rice in the downstairs pantry, 6 eggs in the outside fridge. From then on, the [pantry](../architecture/pantry.md) keeps the count for each place. You do not look into each cupboard before you plan, and you do not buy rice that is downstairs.

The plugin does not assume that a food is there. Water is a food item too: you record it one time, with an amount such as "tap".

Each food has a bar that shows its [level](../architecture/level.md): how much is left of the full amount. A tick on the bar is the low line. Below the line, the bar is amber, so you see what gets low before it is out. To correct an amount, you drag the bar to what is really there.

In the store, you ask "do I have this?". You type a name, a brand, or a different name of the food, and the pantry shows it. One tap shows only the food that is low, the food to use soon, the food that is out, or one place.

## The recipes that use your food come first

The [recipe list](../architecture/recipes.md) sorts by your pantry, not by name. Each recipe shows how much of it you have: "7 of 9 in the pantry". Food that spoils soon moves its recipes up, so you use the spinach before it is waste.

You find a recipe by its name or by an ingredient. A filter shows only the recipes that you can cook now, or the recipes of one type, such as dinner.

## The week has a plan before it starts

At a calm moment, you choose the meals of the [week](../architecture/plan.md). You start with the dinners. Then you add breakfasts, lunches, and snacks, if you want them. The week has room for 7 meals of each type, and you do not have to fill it. The plugin proposes recipes that use up your pantry. A meal has no fixed day, so one bad day does not break the plan.

## The day starts with a look at the meal

On the day, you select the meal that you will cook. Some meals need preparation, such as beef that must come out of the freezer. The plugin shows the preparation, and you confirm it when it is done. If you forgot the preparation, you select a different meal of the week.

You write the preparation in the recipe note, as a callout of the type "prep". A callout is a box with a colour and an icon, so the preparation stands out when you read the note.

```markdown
> [!prep] Take the ground beef out of the freezer in the morning.
```

## The shopping list has only the missing items

The [list](../architecture/shopping.md) is the plan minus the pantry. If two meals need onions, the list has one row with the total. In the store, one tap marks an item.

Some food you want always, plan or no plan: bread, eggs, salt. You label such food as a [staple](../architecture/staples.md), and you tell how often you buy it. The plugin then suggests it when it needs a look: it is low, its date is near, or its time is over. One tap puts it on the list, and one tap skips it. Food that a meal needs gets a suggestion too, when the pantry has it [past its date](../architecture/past-its-date.md).

You add an item of your own on any day, such as batteries. The cart is a note of your vault, so your phone and your computer show the same cart.

## The trip goes into the pantry, with its prices

At home, [put away](../architecture/put-away.md) shows each item of the cart filled in with its amount, its place, its use-by date, and its regular price, in groups by place. You check the lines, and one tap corrects a fact or marks a sale. The items that the plugin knows are in one closed group with one button. You see only the other items as lines, and "Put away" in an open line puts that item into the pantry. The receipt note keeps each fact from the start, so you can stop and continue on a different device.

The note of the trip becomes its [receipt](../architecture/receipt.md): what you bought, in which store, and what you paid. Thus the vault has the price of each item over time.

## Cook Mode shows one step at a time

Before the first step, [Cook Mode](../architecture/cook-mode.md) lists what to get out, in the groups of the recipe, such as "Dry" and "Wet". Then it shows one step in large type, with the ingredients of that step. The buttons are large, because your hands are dirty. The screen stays on, and a step with a time has its timer. The timer rings until you stop it. When you finish, the plugin takes the food out of the pantry. You can add a photo, a rating, and a note for the next time.

## The settings fit the plugin to your vault

You tell the plugin which folder has your recipes and which folder is your pantry, so the other notes of your vault stay out of the kitchen. You also select the font, the accent colour, and the sound of the timer. The accent colour can come from your theme.

## Your recipes are notes that last

A recipe is a plain [note](../architecture/notes-of-the-kitchen.md): a title, the ingredients, and the steps. You type it, or you copy it from a cookbook or a family card. Any text editor can open the file, with or without the plugin.

## Your phone and your computer, with no account

The plugin works on the two devices and with no connection. Obsidian moves the vault between them. The plugin sends your data to no server.

## Further reading

- [Vision](../vision.md): the problem that these features solve.
- [Roadmap](roadmap.md): what is left before the plugin does all of this.
